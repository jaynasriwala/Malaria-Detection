# MalariaDetect AI

A blood-smear malaria classifier: an EfficientNetV2-S PyTorch model behind a
Flask API, with a React (Vite) frontend for uploading an image and viewing
the result.

## Project structure

```
.
├── backend/                 Flask API (PyTorch inference)
│   ├── app.py
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.example
├── frontend/
│   └── vite-project/        React + Vite frontend
│       ├── src/
│       ├── package.json
│       ├── vercel.json
│       ├── netlify.toml
│       └── .env.example
├── DEPLOY.md                 Full deployment walkthrough
└── .gitignore
```

## How it works

1. The frontend lets the user upload a blood-smear image and POSTs it to the
   backend's `/predict` endpoint.
2. The backend preprocesses the image, runs it through the EfficientNetV2-S
   model, and returns a prediction (`Malaria Detected` / `No Malaria`) with a
   confidence score.
3. Model weights (`efficientnetv2_weights_aug.pth`) are **not** stored in this
   repo — they're downloaded by the backend at startup from a URL you provide
   via the `MODEL_URL` environment variable. See "Model weights" below.

## Model weights

The `.pth` file is too large to commit to git comfortably and shouldn't be
baked into a Docker image you rebuild often. Instead:
- Upload it to a free Hugging Face model repo
- Set `MODEL_URL` (backend env var) to its direct-download link
- The backend downloads it automatically the first time it boots

Full steps are in `DEPLOY.md`.

## Local development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
# Place efficientnetv2_weights_aug.pth in this folder, OR set MODEL_URL
python app.py
```
Runs on http://localhost:5000. Check http://localhost:5000/health.

**Frontend:**
```bash
cd frontend/vite-project
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```
Runs on http://localhost:5173 (Vite's default).

## Deployment

See [`DEPLOY.md`](./DEPLOY.md) for the full step-by-step guide: GitHub →
Hugging Face (model weights) → Render/Railway (backend) → Vercel/Netlify
(frontend).

## API reference

| Endpoint  | Method | Description                                  |
|-----------|--------|-----------------------------------------------|
| `/health` | GET    | Health check, returns device + status         |
| `/predict`| POST   | `multipart/form-data` with field `file` (image) → prediction |
| `/info`   | GET    | Model metadata (input size, classes, etc.)     |

## Environment variables

**Backend** (`backend/.env.example`):
- `MODEL_URL` — direct-download link to `efficientnetv2_weights_aug.pth`
- `FRONTEND_URL` — comma-separated list of allowed CORS origins
- `PORT` — set automatically by most hosts; defaults to 5000 locally

**Frontend** (`frontend/vite-project/.env.example`):
- `VITE_API_URL` — URL of the deployed backend, no trailing slash

## Disclaimer

This is a research/educational tool, not a medical device. Predictions
should not be used for actual diagnosis without clinical validation and
review by a qualified professional.
