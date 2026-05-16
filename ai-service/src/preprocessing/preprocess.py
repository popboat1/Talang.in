import os
import json
import random
import numpy as np
import tensorflow as tf
from collections import Counter
from .tokenizer import BillTokenizer

class NERDatasetBuilder:
    def __init__(self, max_len=100, max_word_len=15, min_word_freq=2, seed=42):
        self.max_len = max_len
        self.max_word_len = max_word_len
        self.min_word_freq = min_word_freq
        self.seed = seed
        self.tokenizer = BillTokenizer()

        self.word2idx = {"[PAD]": 0, "[UNK]": 1}
        self.char2idx = {"[PAD]": 0, "[UNK]": 1}
        self.tag2idx  = {"[PAD]": 0}

    def build_from_file(self, filepath, batch_size=32):
        # load raw data
        with open(filepath, 'r', encoding='utf-8') as f:
            raw = json.load(f)
        samples = raw["data"] if isinstance(raw, dict) and "data" in raw else raw

        # apply tokenizer.align_bio() to build the processed dataset locally
        processed_dataset = []
        for sample in samples:
            text = sample.get('text', '')
            entities = sample.get('entities', [])

            if not text.strip():
                continue

            try:
                tokens, tags = self.tokenizer.align_bio(text, entities)
                if len(tokens) == len(tags):
                    processed_dataset.append({
                        'tokens': tokens,
                        'tags': tags
                    })
            except Exception as e:
                print(f"skipping sample due to error: {e}")

        # train/val/test split
        random.seed(self.seed)
        random.shuffle(processed_dataset)

        total_samples = len(processed_dataset)
        train_end = int(total_samples * 0.8)
        val_end = int(total_samples * 0.9)

        train_data = processed_dataset[:train_end]
        val_data = processed_dataset[train_end:val_end]
        test_data = processed_dataset[val_end:]

        # build vocab strictly on train
        word_counts = Counter(word for sample in train_data for word in sample['tokens'])
        char_counts = Counter(char for sample in train_data for word in sample['tokens'] for char in word)
        tag_counts  = Counter(tag for sample in train_data for tag in sample['tags'])

        for word, freq in word_counts.items():
            if freq >= self.min_word_freq:
                self.word2idx[word] = len(self.word2idx)

        for char, _ in char_counts.items():
            self.char2idx[char] = len(self.char2idx)

        for tag, _ in tag_counts.items():
            self.tag2idx[tag] = len(self.tag2idx)

        # internal vectorizer function
        def _vectorize(data):
            num_samples = len(data)
            X_w = np.zeros((num_samples, self.max_len), dtype=np.int32)
            X_c = np.zeros((num_samples, self.max_len, self.max_word_len), dtype=np.int32)
            Y   = np.zeros((num_samples, self.max_len), dtype=np.int32)

            for i, sample in enumerate(data):
                for j, (word, tag) in enumerate(zip(sample['tokens'][:self.max_len], sample['tags'][:self.max_len])):
                    X_w[i, j] = self.word2idx.get(word, self.word2idx["[UNK]"])
                    Y[i, j] = self.tag2idx.get(tag, self.tag2idx["[PAD]"])

                    for k, char in enumerate(list(word)[:self.max_word_len]):
                        X_c[i, j, k] = self.char2idx.get(char, self.char2idx["[UNK]"])
            return X_w, X_c, Y

        # vectorize splits
        X_w_tr, X_c_tr, Y_tr = _vectorize(train_data)
        X_w_v, X_c_v, Y_v    = _vectorize(val_data)
        X_w_te, X_c_te, Y_te = _vectorize(test_data)

        # internal tf.data wrapper
        def _create_ds(X_w, X_c, Y, shuffle=False):
            ds = tf.data.Dataset.from_tensor_slices(({'word_inputs': X_w, 'char_inputs': X_c}, Y))
            if shuffle:
                ds = ds.shuffle(buffer_size=1000)
            return ds.batch(batch_size).prefetch(tf.data.AUTOTUNE)

        # return final tf.data.Datasets
        train_ds = _create_ds(X_w_tr, X_c_tr, Y_tr, shuffle=True)
        val_ds   = _create_ds(X_w_v, X_c_v, Y_v)
        test_ds  = _create_ds(X_w_te, X_c_te, Y_te)

        return train_ds, val_ds, test_ds

    def save_vocabs(self, save_dir):
        """dumps the dicts to json for inference later"""
        os.makedirs(save_dir, exist_ok=True)

        with open(os.path.join(save_dir, 'word2idx.json'), 'w', encoding='utf-8') as f:
            json.dump(self.word2idx, f, ensure_ascii=False, indent=2)

        with open(os.path.join(save_dir, 'char2idx.json'), 'w', encoding='utf-8') as f:
            json.dump(self.char2idx, f, ensure_ascii=False, indent=2)

        with open(os.path.join(save_dir, 'tag2idx.json'), 'w', encoding='utf-8') as f:
            json.dump(self.tag2idx, f, ensure_ascii=False, indent=2)
