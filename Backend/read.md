# PlantGuard Backend

FastAPI backend serving the new 38-class `plantguard_efficientnet.keras` model.
Response shape matches what the React frontend's `Detect.jsx` already expects —
no frontend changes needed, just redeploy this folder.

## What changed from the old backend

- **Model**: swapped `models/plant_model_fast.keras` (old, 15 classes,
  MobileNetV2) for `models/plantguard_efficientnet.keras` (new, 38 classes,
  EfficientNetB0 — covers more crops: Apple, Blueberry, Cherry, Corn, Grape,
  Orange, Peach, Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, Tomato).
- **`class_names.json`**: replaced with the 38-class list matching the new model.
- **`PREPROCESS_MODE`**: changed default from `"zero_one"` (divide by 255) to
  `"none"`. The new model has `Rescaling` + `Normalization` layers built directly
  into its graph (verified by inspecting `config.json` inside the `.keras` file),
  so it expects raw 0–255 pixel values. Dividing by 255 again here would
  double-normalize the input and silently produce wrong predictions — this bit
  me when I first checked, so don't change it back without re-verifying the
  model's own preprocessing layers.

Everything else (API contract, CORS origins, `/predict` response shape,
file-size/type validation) is unchanged, so the already-deployed frontend at
your Vercel URL keeps working as soon as this backend redeploys.

## API contract (unchanged — verify your frontend still matches this)

`POST /predict` — multipart form, field `file` (+ optional `crop`)

```json
{
  "predictions": [
    { "label": "Tomato___Late_blight", "confidence": 0.94 },
    { "label": "Tomato___Early_blight", "confidence": 0.04 },
    { "label": "Tomato___healthy", "confidence": 0.02 }
  ],
  "crop": null
}
```

Tested locally end-to-end against the real model before being handed back:
health check, predict (valid image → correct shape), predict (invalid file
type → 400), and CORS preflight for `https://plantguard-two.vercel.app` all
verified working.

## Redeploying to Render

Your frontend's default API URL is already `https://plantguard-wl2l.onrender.com/predict`
(see `Detect.jsx`), so you don't need to change anything in the frontend or in
Render's settings — just push this updated `Backend/` folder to your repo and
Render will redeploy automatically (or trigger a manual deploy from the dashboard).

1. Replace your repo's `Backend/` folder with this one.
2. `git add Backend && git commit -m "Swap to 38-class EfficientNet model" && git push`
3. Render redeploys automatically on push (check the dashboard if autodeploy is off).
4. Once live, hit `https://plantguard-wl2l.onrender.com/health` — it should report
   `"classes": 38`.
5. Open your deployed frontend and run a real scan to confirm live predictions.

**Note**: Render's free tier spins down on inactivity, so the first request
after idling can take 30–60s while the model reloads — this is normal, not a bug.

## Local development

```bash
cd Backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Then in the frontend's Settings tab, point the API URL at `http://localhost:8000`.

## Housekeeping

The old `models/plant_model_fast.keras` (15-class model) is no longer
referenced by `model_utils.py`. It's safe to delete it from the repo to save
space — it's dead weight now:

```bash
git rm Backend/models/plant_model_fast.keras
```
