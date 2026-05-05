# YoloHome Frontend UI Design

**Date:** 2026-05-04  
**Context:** Demo/graded university project. IoT dashboard for controlling home devices via Adafruit IO.  
**Stack:** React 19 · Vite 8 · Tailwind CSS v4 · TanStack Query · Recharts

---

## 1. Layout

Single scrollable page, max-width `1200px`, centered. No routing.

```
┌─────────────────────────────────────┐
│  Header: "YoloHome" + last updated  │
├──────────────┬──────────────────────┤
│  🌡 Temp     │  💧 Humidity         │
├──────────────┴──────────────────────┤
│  💡 Light [toggle]  🌀 Fan [toggle] │
├─────────────────────────────────────┤
│  Temperature History                │
│  [Line chart]                       │
│  [Table: time | value]              │
└─────────────────────────────────────┘
```

---

## 2. Architecture & Component Tree

```
QueryClientProvider
└── App
    ├── Header
    ├── SensorSection
    │   ├── SensorCard (temperature)     useQuery('nhiet-do')
    │   └── SensorCard (humidity)        useQuery('do-am')
    ├── DeviceSection
    │   ├── DeviceCard (light/den)       useQuery('den') + useMutation
    │   └── DeviceCard (fan/quat)        useQuery('quat') + useMutation
    └── HistorySection
        ├── TempChart                    useQuery('lich-su-nhiet-do')
        └── TempTable                    same query key, shared cache
```

---

## 3. Data Flow

- `src/api.js` — pure fetch functions, one per endpoint. No TanStack logic inside.
- Each card owns its `useQuery` with `refetchInterval: 5000` (5s polling).
- Device toggles use `useMutation` → `onSuccess` invalidates the feed's query key → triggers re-fetch.
- TanStack Query provides loading/error/stale states automatically.

### API functions

```js
// src/api.js
const BASE = 'http://localhost:8000'

export const getTemperature    = () => fetch(`${BASE}/feeds/nhiet-do`).then(r => r.json())
export const getTempHistory    = () => fetch(`${BASE}/feeds/lich-su-nhiet-do`).then(r => r.json())
export const getHumidity       = () => fetch(`${BASE}/feeds/do-am`).then(r => r.json())
export const getLight          = () => fetch(`${BASE}/feeds/den`).then(r => r.json())
export const setLight          = (status) => fetch(`${BASE}/feeds/den?status=${status}`, { method: 'POST' }).then(r => r.json())
export const getFan            = () => fetch(`${BASE}/feeds/quat`).then(r => r.json())
export const setFan            = (status) => fetch(`${BASE}/feeds/quat?status=${status}`, { method: 'POST' }).then(r => r.json())
```

---

## 4. Components

### `Header`
- App name "YoloHome"
- Last updated timestamp (derived from any successful query's `dataUpdatedAt`)

### `SensorCard`
Props: `queryKey`, `queryFn`, `label`, `unit`, `icon`
- `isLoading` → `animate-pulse` skeleton
- `isError` → red "Unavailable" inline state
- Success → large value + unit display

### `DeviceCard`
Props: `queryKey`, `queryFn`, `mutationFn`, `label`, `icon`
- Renders current ON/OFF status from query
- Custom CSS toggle switch (no extra lib)
- `useMutation` on toggle → optimistic UI or invalidate on success

### `TempChart`
- Recharts `LineChart` of history array
- History response shape: `{ feed, value: [...] }` — chart iterates `data.value`
- X-axis: `created_at` timestamps, Y-axis: temperature values

### `TempTable`
- Scrollable table (max height), same history data from shared cache
- Iterates `data.value` array same as chart
- Columns: Time | Temperature (°C)

### `Toast`
- Fixed bottom-right div, auto-dismisses after 3s
- Shown on mutation error only

---

## 5. Styling

- Tailwind dark/light via `dark:` classes; `prefers-color-scheme` handled via Tailwind v4 `@media` variants
- Cards: `rounded-2xl shadow border`
- Color palette: neutral grays, blue accent for sensors, amber for light, teal for fan
- Toggle switch: custom Tailwind CSS (no JS lib)
- Recharts: inherits theme colors via CSS variables

---

## 6. Error Handling

| Scenario | Behavior |
|----------|----------|
| Fetch error (single feed) | Card shows inline red "Unavailable" |
| Toggle mutation fails | Toast banner, auto-dismiss 3s |
| All feeds fail | All cards in error state, header still renders |
| Loading | `animate-pulse` skeleton per card |
| Stale data during re-fetch | TanStack shows last known value silently |

TanStack default retry (3x) applies. No offline detection.

---

## 7. Dependencies to Add

```bash
npm install @tanstack/react-query recharts
```

No other UI libraries. Bundle stays lean.

---

## 8. File Structure

```
src/
├── api.js
├── main.jsx                  QueryClientProvider wrapper
├── App.jsx
├── index.css
└── components/
    ├── Header.jsx
    ├── SensorCard.jsx
    ├── DeviceCard.jsx
    ├── TempChart.jsx
    ├── TempTable.jsx
    ├── HistorySection.jsx
    ├── SensorSection.jsx
    ├── DeviceSection.jsx
    └── Toast.jsx
```
