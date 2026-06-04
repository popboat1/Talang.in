import os
from tensorboard.backend.event_processing import event_accumulator

log_file = r"logs\28k_data_training_log\20260523-221843\events.out.tfevents.1779574723.7975e8713f88.1116.0.v2"

def print_tags(log_file):
    ea = event_accumulator.EventAccumulator(log_file)
    ea.Reload()
    print("Tags:", ea.Tags())

if __name__ == "__main__":
    print_tags(log_file)
