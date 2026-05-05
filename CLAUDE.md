# YoloHome — CLAUDE.md

IoT dashboard for controlling home devices via Adafruit IO.

---

## Repository Structure

```
multidisciplinary-project/
├── YoloHome-Python/   # FastAPI backend
└── YoloHome-Frontend/ # React + Vite + Tailwind frontend
```

---

## Backend — YoloHome-Python

**Stack:** Python · FastAPI · Adafruit IO SDK · uvicorn

**Entry point:** `app.py`

**Auth:** Adafruit IO credentials via `.env` (`ADAFRUIT_AIO_USERNAME`, `ADAFRUIT_AIO_KEY`). Client initialized in `client.py`.

### API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/feeds/nhiet-do` | Latest temperature reading |
| GET | `/feeds/lich-su-nhiet-do` | Temperature history |
| GET | `/feeds/do-am` | Latest humidity reading |
| GET | `/feeds/den` | Light status |
| POST | `/feeds/den?status=true\|false` | Toggle light ON/OFF |
| GET | `/feeds/quat` | Fan status |
| POST | `/feeds/quat?status=true\|false` | Toggle fan ON/OFF |

**Response shape (GET feeds):**
```json
{ "feed": "nhiet-do", "value": "28.5", "created_at": "2026-01-01T00:00:00Z" }
```

**Control feeds** send `"ON"` / `"OFF"` strings to Adafruit IO.

**Run:**
```bash
cd YoloHome-Python
cp .env.example .env   # fill in credentials
uvicorn app:app --reload
```

---

## Frontend — YoloHome-Frontend

**Stack:** React 19 · Vite 8 · Tailwind CSS v4 (`@tailwindcss/vite` plugin)

**Entry point:** `src/main.jsx` → `src/App.jsx`

**Tailwind:** configured via `@tailwindcss/vite` plugin in `vite.config.js`; imported with `@import "tailwindcss"` in `src/index.css`.

### Planned UI

- **Dashboard** — live sensor cards (temperature, humidity)
- **Controls** — toggle switches for light (`den`) and fan (`quat`)
- **History** — chart of temperature history from `/feeds/lich-su-nhiet-do`

**Run:**
```bash
cd YoloHome-Frontend
npm install
npm run dev
```

**Build:**
```bash
npm run build
```

---

## Dev Notes

- Backend runs on `http://localhost:8000` by default; frontend proxies or calls it directly.
- Adafruit IO feeds use Vietnamese names: `nhiet-do` = temperature, `do-am` = humidity, `den` = light, `quat` = fan.
- Control endpoints accept a `status` query param (`true`/`false`), not a JSON body.
