# Deploying MalariaDetect

Two pieces, deployed separately:
- `backend/` → Render or Railway (Docker)
- `frontend/vite-project/` → Vercel or Netlify

## 1. Upload your model weights to Hugging Face

1. Create a free account at https://huggingface.co and click **New Model** to
   create a repo (e.g. `yourname/malaria-effnetv2`). Keep it Public, or Private
   if you'll generate a token for it.
2. Upload `efficientnetv2_weights_aug.pth` via the "Files" tab (drag and drop,
   or `git lfs` for large files).
3. Get the direct-download URL — it looks like:
   `https://huggingface.co/yourname/malaria-effnetv2/resolve/main/efficientnetv2_weights_aug.pth`
   Open it in a browser once to confirm it downloads the file directly (not an HTML page).

## 2. Deploy the backend (Render example)

1. Push the `backend/` folder to a GitHub repo (its own repo, or a subfolder —
   if it's a subfolder, set Render's "Root Directory" to `backend`).
2. In Render: **New → Web Service** → connect the repo → Environment: **Docker**.
3. Set environment variables:
   - `MODEL_URL` = the Hugging Face URL from step 1
   - `FRONTEND_URL` = leave blank for now (you'll add it after step 3 deploys the frontend)
4. Deploy. First boot downloads the model — watch the logs for
   "Model weights downloaded successfully" then "Model loaded successfully".
5. Once live, note the backend URL, e.g. `https://malaria-backend.onrender.com`.
   Test it: open `https://malaria-backend.onrender.com/health` — should return JSON.

(Railway: same idea — New Project → Deploy from GitHub → it detects the
Dockerfile automatically. Set the same two env vars.)

> Free tiers on Render/Railway spin down when idle, so the first request after
> inactivity can take 30–60s while it wakes up and reloads the model — this is
> normal, not a bug.

## 3. Deploy the frontend (Vercel example)

1. Push `frontend/vite-project/` to a GitHub repo (or subfolder, with Vercel's
   "Root Directory" set to `frontend/vite-project`).
2. In Vercel: **New Project** → import the repo → framework auto-detects as Vite.
3. Set environment variable:
   - `VITE_API_URL` = your backend URL from step 2, **no trailing slash**
     (e.g. `https://malaria-backend.onrender.com`)
4. Deploy. Note the resulting URL, e.g. `https://malaria-detect.vercel.app`.

(Netlify: same idea — a `netlify.toml` is already included. Set `VITE_API_URL`
in Site settings → Environment variables.)

## 4. Lock down CORS

Go back to your backend host (Render/Railway) and set:
- `FRONTEND_URL` = `https://malaria-detect.vercel.app`
  (comma-separate multiple origins if you deploy to more than one host)

Redeploy the backend so it picks up the new env var. This restricts `/predict`
to only your frontend's origin instead of `*`.

## 5. Verify end-to-end

Open your Vercel/Netlify URL, upload a blood-smear image, hit Predict.
If it fails, check in this order:
1. Browser devtools console/network tab — is the request even reaching the backend URL?
2. Backend `/health` endpoint — is it up?
3. Backend logs — CORS error, or model error?

## Local development

Backend:
```
cd backend
pip install -r requirements.txt
# put efficientnetv2_weights_aug.pth in this folder, or set MODEL_URL
python app.py
```

Frontend:
```
cd frontend/vite-project
npm install
echo "VITE_API_URL=http://localhost:5000" > .env
npm run dev
```
