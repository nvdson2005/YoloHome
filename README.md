# YoloHome

IoT dashboard for controlling home devices (light, fan) and monitoring sensors (temperature, humidity) via Adafruit IO.

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** and **npm**

---

## Project Structure

```
multidisciplinary-project/
├── YoloHome-Python/    # FastAPI backend (port 8000)
└── YoloHome-Frontend/  # React + Vite frontend (port 5173)
```

---

## Step 1 — Configure backend credentials

```bash
cd YoloHome-Python
cp .env.example .env
```

Copy `.env.example` to `.env`. 
---

## Step 2 — Install backend dependencies

```bash
cd YoloHome-Python
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

---

## Step 3 — Start the backend

```bash
# Inside YoloHome-Python, with venv active
uvicorn app:app --reload
```

Backend runs at **http://localhost:8000**

Verify it works:
```bash
curl http://localhost:8000/
# {"message":"Hello World"}
```

---

## Step 4 — Install frontend dependencies

Open a **new terminal**:

```bash
cd YoloHome-Frontend
npm install
```

---

## Step 5 — Start the frontend

```bash
cd YoloHome-Frontend
npm run dev
```

Frontend runs at **http://localhost:5173**

Open that URL in your browser. The dashboard loads automatically and polls the backend every 5 seconds.

---

## Using the Dashboard

| Section | What it does |
|---------|-------------|
| **Sensors** | Shows live temperature (°C) and humidity (%) |
| **Devices** | Toggle light and fan ON/OFF |
| **Temperature History** | Line chart + scrollable table of past readings |

The header shows the last time data was fetched. Dark/light mode follows your system preference.

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/feeds/nhiet-do` | Latest temperature |
| GET | `/feeds/lich-su-nhiet-do` | Temperature history |
| GET | `/feeds/do-am` | Latest humidity |
| GET | `/feeds/den` | Light status |
| POST | `/feeds/den?status=true\|false` | Toggle light |
| GET | `/feeds/quat` | Fan status |
| POST | `/feeds/quat?status=true\|false` | Toggle fan |

---

## Running Frontend Tests

```bash
cd YoloHome-Frontend
npm test
```

31 tests across 7 files.

---

## Production Build

```bash
cd YoloHome-Frontend
npm run build
npm run preview   # serves built app at http://localhost:4173
```
