FROM python:3.10-slim

WORKDIR /app

# System deps needed by Pillow for common image formats
RUN apt-get update && apt-get install -y --no-install-recommends \
    libjpeg62-turbo \
    zlib1g \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app.py .

# Never bake model weights into the image — they are downloaded at
# container startup from MODEL_URL (see app.py).
RUN rm -f *.pth 2>/dev/null || true

EXPOSE 5000

# Render/Railway inject $PORT; gunicorn binds to it.
# 1 worker keeps a single copy of the model in memory; threads handle
# concurrent requests. Increase --timeout if cold-start model download is slow.
CMD gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 1 --threads 4 --timeout 120 app:app
