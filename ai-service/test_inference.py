from src.inference.predict import NERPredictor


# Load model hasil training
predictor = NERPredictor()

# Contoh input dari user
text = "makan siang dibayarin Fatimah dan maria total 150000\n risna total 30000\nmaria total 25000\n fatimah 20000\n michael total 35000\n elisabeth 15000\n maulida 15000\n es teh 6  10000"

# inference dari .keras
predictor_keras = NERPredictor(
    model_path="models/bill_ner_model_28k.keras", 
    format_type="keras",
    config_path="outputs/training_config_28k.json"
)
print("Result Keras Bundle:", predictor_keras.predict_entities(text))
print("-" * 50)