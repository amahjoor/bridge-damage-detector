# Detect bridge damage in a photo

Upload a photo of a bridge. The page sends the image to a local Express server, and the server asks Azure Custom Vision which regions look damaged or undamaged. This started as a Bitcamp 2024 demo. The original prediction key has been removed, so you need your own Custom Vision resource.

## Run the detector

Copy `.env.example` to `.env` and set `PREDICTION_KEY`, `CUSTOM_VISION_ENDPOINT`, and `PROJECT_ID`. Start the API from `server/app.js` (port 5000), then the page.

```bash
node server/app.js
```

```bash
npm install
npm run dev
```

Open http://localhost:3000 and upload an image. The page posts the bytes to `http://localhost:5000/api/predict`.

`server.js` is an unfinished upload path. It is not the server to start.
