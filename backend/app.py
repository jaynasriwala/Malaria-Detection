from flask import Flask, request, jsonify
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
import os
from PIL import Image
import io
from flask_cors import CORS
import logging
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = Flask(__name__)

# FRONTEND_URL can be a single origin or a comma-separated list of origins,
# e.g. "https://myapp.vercel.app,https://myapp.netlify.app"
# Defaults to "*" (open) only if not set — override this in production.
FRONTEND_URL = os.environ.get("FRONTEND_URL", "*")
origins = [o.strip() for o in FRONTEND_URL.split(",")] if FRONTEND_URL != "*" else "*"
CORS(app, resources={r"/*": {"origins": origins}})

app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

MODEL_PATH = os.environ.get("MODEL_PATH", "efficientnetv2_weights_aug.pth")
MODEL_URL = os.environ.get("MODEL_URL")  # direct-download link, e.g. a Hugging Face "resolve/main" URL

if not os.path.exists(MODEL_PATH):
    if MODEL_URL:
        import urllib.request
        logger.info(f"Model weights not found locally. Downloading from {MODEL_URL} ...")
        try:
            urllib.request.urlretrieve(MODEL_URL, MODEL_PATH)
            logger.info("Model weights downloaded successfully.")
        except Exception as e:
            logger.error(f"Failed to download model weights: {str(e)}")
            raise RuntimeError(f"Could not download model weights from MODEL_URL: {e}") from e
    else:
        raise RuntimeError(
            "No model weights found and MODEL_URL is not set. "
            "Set the MODEL_URL environment variable to a direct-download link "
            "for efficientnetv2_weights_aug.pth (e.g. a Hugging Face 'resolve/main' URL)."
        )

DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
torch.set_num_threads(int(os.environ.get("TORCH_NUM_THREADS", "1")))
logger.info(f"Using device: {DEVICE}")


class MalariaModel(nn.Module):
    def __init__(self, num_classes=2):
        super(MalariaModel, self).__init__()
        self.model = models.efficientnet_v2_s(weights=None)
        in_features = self.model.classifier[1].in_features
        self.model.classifier[1] = nn.Linear(in_features, num_classes)

    def forward(self, x):
        return self.model(x)


try:
    logger.info("Loading model...")
    model = MalariaModel(num_classes=2)
    state_dict = torch.load(MODEL_PATH, map_location=DEVICE)
    model.load_state_dict(state_dict)
    logger.info(f"Model weights loaded from {MODEL_PATH}")

    model = model.to(DEVICE)
    model.eval()
    logger.info("Model loaded successfully")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise


def preprocess_image(image_bytes):
    try:
        transform = transforms.Compose([
            transforms.Resize((384, 384)),
            transforms.ToTensor(),
            transforms.Normalize(
                mean=[0.485, 0.456, 0.406],
                std=[0.229, 0.224, 0.225]
            )
        ])
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        image = transform(image).unsqueeze(0)
        return image.to(DEVICE)
    except Exception as e:
        logger.error(f"Error preprocessing image: {str(e)}")
        raise ValueError(f"Failed to process image: {str(e)}")


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'device': str(DEVICE),
        'model_loaded': True,
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            logger.warning("No file uploaded")
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        if file.filename == '':
            logger.warning("Empty filename")
            return jsonify({'error': 'No file selected'}), 400

        if not file.content_type or not file.content_type.startswith('image/'):
            logger.warning(f"Invalid file type: {file.content_type}")
            return jsonify({'error': 'File must be an image'}), 400

        logger.info(f"Processing file: {file.filename}")
        image_bytes = file.read()

        image_tensor = preprocess_image(image_bytes)

        with torch.no_grad():
            output = model(image_tensor)
            probabilities = torch.softmax(output, dim=1).squeeze().tolist()
            predicted_class = torch.argmax(output, 1).item()

        result = "Malaria Detected" if predicted_class == 0 else "No Malaria"
        confidence = max(probabilities)

        logger.info(f"Prediction: {result}, Confidence: {confidence:.2%}")

        return jsonify({
            'prediction': result,
            'confidence': float(confidence),
            'probabilities': probabilities,
            'class_index': predicted_class,
            'timestamp': datetime.now().isoformat()
        }), 200

    except ValueError as ve:
        logger.error(f"Validation error: {str(ve)}")
        return jsonify({'error': str(ve)}), 400
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}", exc_info=True)
        return jsonify({'error': f'Server error: {str(e)}'}), 500


@app.route('/info', methods=['GET'])
def model_info():
    return jsonify({
        'model_name': 'EfficientNetV2-S',
        'task': 'Binary Classification (Malaria Detection)',
        'classes': ['Malaria Detected', 'No Malaria'],
        'input_size': [384, 384],
        'input_channels': 3,
        'device': str(DEVICE),
        'version': '3.0.0'
    }), 200


@app.route('/', methods=['GET'])
def root():
    return jsonify({
        'service': 'MalariaDetect AI backend',
        'status': 'running',
        'endpoints': ['/health', '/predict [POST, form field "file"]', '/info']
    }), 200


@app.errorhandler(413)
def request_entity_too_large(error):
    logger.warning("File uploaded is too large (max 16MB)")
    return jsonify({'error': 'File too large (max 16MB)'}), 413


@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    logger.info("=" * 70)
    logger.info("MalariaDetect AI - Backend Server")
    logger.info("=" * 70)
    logger.info(f"Device: {DEVICE}")
    logger.info(f"CORS allowed origins: {origins}")
    logger.info("=" * 70)
    port = int(os.environ.get("PORT", 5000))
    logger.info(f"Starting Flask server on http://0.0.0.0:{port}")
    logger.info("=" * 70)

    app.run(debug=False, port=port, host='0.0.0.0')
