# Usage Guide
## Build Dataset
```python
# usage example: how to plug this into the training pipeline
from src.preprocessing.preprocess import DatasetBuilder

# init the builder with our chosen hyperparameters
# keep max_len at 100 based 95th percentile analysis in 01_eda.ipynb
# build from the fixed dataset — vocabs are built strictly on train split
builder = DatasetBuilder(
    max_len=100,
    max_word_len=15,
    min_word_freq=2,   # words appearing < 2 times in train -> [UNK]
    train_pct=0.8,
    val_pct=0.1,
    seed=42,
    verbose=True,
)

train_ds, val_ds, test_ds = builder.build_from_file(
    '../data/dataset_fixed.json',
    batch_size=32,
)
```

## How to Save Vocabulary
must be saved since vocabs are used in inference later.

```python
# save vocabs
Path('../data/processed').mkdir(parents=True, exist_ok=True)

builder.save_vocabs('../data/processed/')

for f in Path('../data/processed').iterdir():
    print(f.name, '—', f.stat().st_size, 'bytes')
```

## How to Load Vocabulary

```python
with open('../data/processed/word2idx.json', encoding='utf-8') as f:
    word2idx = json.load(f)
with open('../data/processed/char2idx.json', encoding='utf-8') as f:
    char2idx = json.load(f)
with open('../data/processed/tag2idx.json', encoding='utf-8') as f:
    tag2idx = json.load(f)
    
idx2tag = {v: k for k, v in tag2idx.items()}
```

## Hyperparameter Example

```python
# hyperparams
VOCAB_SIZE     = len(word2idx)       # word vocab
CHAR_VOCAB     = len(char2idx)       # character vocab
NUM_TAGS       = len(tag2idx)        # output classes (BIO tags + PAD)
MAX_LEN        = 100                 # max tokens per sequence
MAX_WORD_LEN   = 15                  # max chars per token

WORD_EMBED_DIM = 128                 # word embedding size
CHAR_EMBED_DIM = 32                  # char embedding size (input to CNN)
CHAR_CNN_DIM   = 128                 # char CNN output size (after global max pool)
BILSTM_UNITS   = 256                 # units per direction -> output is 512
DROPOUT        = 0.3
```

## Building Model

```python
from src.models.ner_model import BillNERModel

# create the model
model = BillNERModel(
    vocab_size=VOCAB_SIZE,
    char_vocab=CHAR_VOCAB,
    num_tags=NUM_TAGS,
    word_embed_dim=WORD_EMBED_DIM,
    char_embed_dim=CHAR_EMBED_DIM,
    char_cnn_dim=CHAR_CNN_DIM,
    bilstm_units=BILSTM_UNITS,
    dropout=DROPOUT,
)

# run a dummy batch to natively build all nested layers
dummy_batch = {
    'word_inputs': tf.zeros((1, MAX_LEN), dtype=tf.int32),
    'char_inputs': tf.zeros((1, MAX_LEN, MAX_WORD_LEN), dtype=tf.int32)
}
model(dummy_batch)
model.summary()
```

## Training Example

```python
optimizer = keras.optimizers.Adam(learning_rate=1e-3, clipnorm=5.0)

@tf.function
def train_step(batch_inputs, batch_tags):
    with tf.GradientTape() as tape:
        emissions, mask = model(batch_inputs, training=True)
        loss = model.crf.log_likelihood(
            emissions,
            tf.cast(batch_tags, tf.int32),
            mask,
        )
    grads = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(grads, model.trainable_variables))
    return loss

@tf.function
def val_step(batch_inputs, batch_tags):
    emissions, mask = model(batch_inputs, training=False)
    loss = model.crf.log_likelihood(
        emissions,
        tf.cast(batch_tags, tf.int32),
        mask,
    )
    return loss

# grab one batch
for batch_inputs, batch_tags in train_ds.take(1):
    print("word_inputs shape :", batch_inputs['word_inputs'].shape)
    print("char_inputs shape :", batch_inputs['char_inputs'].shape)
    print("tags shape        :", batch_tags.shape)

    # forward pass
    emissions, mask = model(batch_inputs, training=False)
    print("emissions shape   :", emissions.shape)   # (batch, max_len, num_tags)
    print("mask shape        :", mask.shape)

    # one training step
    loss = train_step(batch_inputs, batch_tags)
    print(f"loss after 1 step : {loss:.4f}")

    # check no None gradients
    with tf.GradientTape() as tape:
        e, m = model(batch_inputs, training=True)
        l    = model.crf.log_likelihood(e, tf.cast(batch_tags, tf.int32), m)
    grads = tape.gradient(l, model.trainable_variables)
    none_grads = [v.name for v, g in zip(model.trainable_variables, grads) if g is None]
    print(f"none gradients    : {none_grads if none_grads else 'none — all good'}")

    # viterbi decode
    preds = model.decode(batch_inputs)
    print(f"viterbi output    : {preds.shape}")
```