import os
import matplotlib.pyplot as plt
from tensorboard.backend.event_processing import event_accumulator
import tensorflow as tf

log_file = r"logs\28k_data_training_log\20260523-221843\events.out.tfevents.1779574723.7975e8713f88.1116.0.v2"
output_image = r"outputs\training_metrics.png"

def plot_tensorboard_logs(log_file, output_image):
    ea = event_accumulator.EventAccumulator(log_file)
    ea.Reload()
    
    tags = ea.Tags().get('tensors', [])
    
    if not tags:
        print("No tensor tags found in the log file.")
        return
    
    num_tags = len(tags)
    fig, axes = plt.subplots(num_tags, 1, figsize=(10, 4 * num_tags))
    
    if num_tags == 1:
        axes = [axes]
        
    for ax, tag in zip(axes, tags):
        events = ea.Tensors(tag)
        steps = [e.step for e in events]
        
        # parse tensor values
        values = []
        for e in events:
            tensor = tf.make_ndarray(e.tensor_proto)
            # Assuming it's a scalar value stored as a 0-d tensor
            values.append(float(tensor))
            
        ax.plot(steps, values, label=tag, marker='o')
        ax.set_title(tag)
        ax.set_xlabel('Steps')
        ax.set_ylabel('Value')
        ax.legend()
        ax.grid(True)
        
    plt.tight_layout()
    plt.savefig(output_image)
    print(f"Plot saved to {output_image}")

if __name__ == "__main__":
    plot_tensorboard_logs(log_file, output_image)
