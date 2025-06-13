# serverIbrain_tumour_detection_using_deep_learning.py
import tensorflow as tf
import numpy as np
import argparse
import json
import os
import sys
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import cv2

# Redirect TensorFlow logs to stderr
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # 0=all, 1=INFO, 2=WARNING, 3=ERROR
# Disable progress bars
tf.keras.utils.disable_interactive_logging()

# Parse command line arguments
parser = argparse.ArgumentParser(description='Analyze brain MRI images for tumor detection')
parser.add_argument('--image', required=True, help='Path to the input image')
parser.add_argument('--model', required=True, help='Path to the trained model file')
args = parser.parse_args()

# Load class labels
class_labels = []
try:
    with open('class_labels.json', 'r') as f:
        class_labels = json.load(f)
except FileNotFoundError:
    # Default labels if file not found
    class_labels = ["No Tumor", "Glioma Tumor", "Meningioma Tumor", "Pituitary Tumor"]

def preprocess_image(image_path):
    """
    Preprocess the image to match the model's expected input
    """
    # Load and resize image to match model's expected input shape
    try:
        img = cv2.imread(image_path)
        img = cv2.resize(img, (224, 224))  # Adjust size to match your model's input
        img = img / 255.0  # Normalize pixel values
        return np.expand_dims(img, axis=0)  # Add batch dimension
    except Exception as e:
        print(json.dumps({"error": f"Error processing image: {str(e)}"}))
        exit(1)

def analyze_image():
    """
    Process the image and return prediction results
    """
    try:
        # Load the model
        model = load_model(args.model)
        
        # Preprocess the image
        processed_image = preprocess_image(args.image)
        
        # Make prediction
        predictions = model.predict(processed_image)
        
        # Get the predicted class and confidence
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_index])
        
        # Get the class label
        if predicted_class_index < len(class_labels):
            prediction = class_labels[predicted_class_index]
        else:
            prediction = f"Class {predicted_class_index}"
        
        # Return results as JSON - print to stdout for Node.js to capture
        result = {
            "prediction": prediction,
            "confidence": confidence,
            "class_index": int(predicted_class_index)
        }
        
        # Clear any previous output that might have been sent to stdout
        sys.stdout.flush()
        # Print only the JSON string to stdout - nothing else
        print(json.dumps(result))
        return 0
    except Exception as e:
        sys.stderr.write(f"Error in analysis: {str(e)}\n")
        # Still provide valid JSON even in error case
        print(json.dumps({"error": f"Analysis failed: {str(e)}"}))
        return 1

if __name__ == "__main__":
    exit(analyze_image())