# YoloHome Frontend UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page IoT dashboard with live sensor readings, device toggle controls, and temperature history chart + table, all backed by a FastAPI server at `http://localhost:8000`.

**Architecture:** Single-page layout (no routing) with three sections — sensors, devices, history. TanStack Query owns all data fetching: each component calls `useQuery`/`useMutation` directly with a 5-second `refetchInterval`. `src/api.js` contains pure fetch functions; no TanStack logic leaks into it.

**Tech Stack:** React 19, Vite 8, Tailwind CSS v4, TanStack Query v5, Recharts, Vitest, @testing-library/react

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/api.js` | Pure fetch functions for all 7 endpoints |
| `src/main.jsx` | React root + QueryClientProvider wrapper |
| `src/App.jsx` | Root layout, composes three sections |
| `src/index.css` | Tailwind import + minimal base resets |
| `src/test/setup.js` | jest-dom matchers + ResizeObserver mock |
| `src/test/helpers.jsx` | `renderWithQuery` test utility |
| `src/components/Header.jsx` | App title + last-updated timestamp |
| `src/components/Toast.jsx` | Fixed error banner, auto-dismisses after 3s |
| `src/components/SensorCard.jsx` | Sensor display: value, unit, loading, error |
| `src/components/DeviceCard.jsx` | Device toggle: ON/OFF switch + mutation |
| `src/components/TempChart.jsx` | Recharts LineChart of history data |
| `src/components/TempTable.jsx` | Scrollable table of history data |
| `src/components/SensorSection.jsx` | 2-col grid of SensorCards |
| `src/components/DeviceSection.jsx` | 2-col grid of DeviceCards + Toast |
| `src/components/HistorySection.jsx` | TempChart + TempTable stacked |

---

## Task 1: Install dependencies and configure Vitest

**Files:**
- Modify: `package.json` (via npm)
- Modify: `vite.config.js`
- Create: `src/test/setup.js`
- Create: `src/test/helpers.jsx`

- [ ] **Step 1: Install runtime and dev dependencies**

```bash
cd /Users/codeleap/Uni/multidisciplinary-project/YoloHome-Frontend
npm install @tanstack/react-query recharts
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Expected: no errors, packages appear in `package.json`.

- [ ] **Step 2: Add test script to package.json**

Open `package.json` and add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Configure Vitest in vite.config.js**

Replace the entire file with:
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
  },
})
```

- [ ] **Step 4: Create src/test/setup.js**

```js
import '@testing-library/jest-dom'

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
```

- [ ] **Step 5: Create src/test/helpers.jsx**

```jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'

export function renderWithQuery(ui) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  )
}
```

- [ ] **Step 6: Verify Vitest runs with zero tests**

```bash
npm test
```

Expected output:
```
Test Files  0 passed (0)
Tests  no tests
```

No errors.

- [ ] **Step 7: Commit**

```bash
git add vite.config.js package.json package-lock.json src/test/setup.js src/test/helpers.jsx
git commit -m "chore: add TanStack Query, Recharts, and Vitest"
```

---

## Task 2: Create src/api.js

**Files:**
- Create: `src/api.js`
- Create: `src/api.test.js`

- [ ] **Step 1: Write the failing tests**

Create `src/api.test.js`:

```js
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  getTemperature, getTempHistory, getHumidity,
  getLight, setLight, getFan, setFan,
} from './api'

const BASE = 'http://localhost:8000'

function mockFetch(data, ok = true) {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    status: ok ? 200 : 502,
    json: () => Promise.resolve(data),
  })
}

beforeEach(() => vi.restoreAllMocks())

describe('getTemperature', () => {
  it('calls /feeds/nhiet-do', async () => {
    mockFetch({ feed: 'nhiet-do', value: '28.5', created_at: '' })
    const result = await getTemperature()
    expect(fetch).toHaveBeenCalledWith(`${BASE}/feeds/nhiet-do`)
    expect(result.value).toBe('28.5')
  })
  it('throws on non-ok response', async () => {
    mockFetch({}, false)
    await expect(getTemperature()).rejects.toThrow('502')
  })
})

describe('getTempHistory', () => {
  it('calls /feeds/lich-su-nhiet-do', async () => {
    mockFetch({ feed: 'nhiet-do', value: [] })
    await getTempHistory()
    expect(fetch).toHaveBeenCalledWith(`${BASE}/feeds/lich-su-nhiet-do`)
  })
})

describe('getHumidity', () => {
  it('calls /feeds/do-am', async () => {
    mockFetch({ feed: 'do-am', value: '65', created_at: '' })
    await getHumidity()
    expect(fetch).toHaveBeenCalledWith(`${BASE}/feeds/do-am`)
  })
})

describe('getLight', () => {
  it('calls /feeds/den', async () => {
    mockFetch({ feed: 'den', value: 'ON', created_at: '' })
    await getLight()
    expect(fetch).toHaveBeenCalledWith(`${BASE}/feeds/den`)
  })
})

describe('setLight', () => {
  it('calls POST /feeds/den?status=true', async () => {
    mockFetch({ feed: 'den', value: 1 })
    await setLight(true)
    expect(fetch).toHaveBeenCalledWith(`${BASE}/feeds/den?status=true`, { method: 'POST' })
  })
  it('calls POST /feeds/den?status=false', async () => {
    mockFetch({ feed: 'den', value: 0 })
    await setLight(false)
    expect(fetch).toHaveBeenCalledWith(`${BASE}/feeds/den?status=false`, { method: 'POST' })
  })
})

describe('getFan', () => {
  it('calls /feeds/quat', async () => {
    mockFetch({ feed: 'quat', value: 'OFF', created_at: '' })
    await getFan()
    expect(fetch).toHaveBeenCalledWith(`${BASE}/feeds/quat`)
  })
})

describe('setFan', () => {
  it('calls POST /feeds/quat?status=false', async () => {
    mockFetch({ feed: 'quat', value: 0 })
    await setFan(false)
    expect(fetch).toHaveBeenCalledWith(`${BASE}/feeds/quat?status=false`, { method: 'POST' })
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test
```

Expected: `FAIL src/api.test.js — Cannot find module './api'`

- [ ] **Step 3: Create src/api.js**

```js
const BASE = 'http://localhost:8000'

function call(url, options) {
  return fetch(url, options).then(r => {
    if (!r.ok) throw new Error(String(r.status))
    return r.json()
  })
}

export const getTemperature = () => call(`${BASE}/feeds/nhiet-do`)
export const getTempHistory  = () => call(`${BASE}/feeds/lich-su-nhiet-do`)
export const getHumidity     = () => call(`${BASE}/feeds/do-am`)
export const getLight        = () => call(`${BASE}/feeds/den`)
export const setLight        = (status) => call(`${BASE}/feeds/den?status=${status}`, { method: 'POST' })
export const getFan          = () => call(`${BASE}/feeds/quat`)
export const setFan          = (status) => call(`${BASE}/feeds/quat?status=${status}`, { method: 'POST' })
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test
```

Expected:
```
✓ src/api.test.js (9)
Test Files  1 passed (1)
Tests  9 passed (9)
```

- [ ] **Step 5: Commit**

```bash
git add src/api.js src/api.test.js
git commit -m "feat: add api.js with fetch functions for all feeds"
```

---

## Task 3: Configure main.jsx + scaffold App.jsx + clean index.css

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/App.jsx`
- Modify: `src/index.css`
- Delete (contents): `src/App.css`

- [ ] **Step 1: Replace src/main.jsx**

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
```

- [ ] **Step 2: Replace src/App.jsx with a scaffold**

```jsx
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-gray-400">Loading YoloHome…</p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Replace src/index.css — remove Vite template styles**

```css
@import "tailwindcss";

*, *::before, *::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  -webkit-font-smoothing: antialiased;
}
```

- [ ] **Step 4: Clear src/App.css**

Delete all contents of `src/App.css` (leave the file empty — it is imported nowhere after this task but safe to leave).

- [ ] **Step 5: Verify dev server renders without errors**

```bash
npm run dev
```

Open `http://localhost:5173`. Expect dark/light background with "Loading YoloHome…" text. No console errors.

- [ ] **Step 6: Commit**

```bash
git add src/main.jsx src/App.jsx src/index.css src/App.css
git commit -m "feat: wire QueryClientProvider and clean up Vite template"
```

---

## Task 4: Build SensorCard

**Files:**
- Create: `src/components/SensorCard.jsx`
- Create: `src/components/SensorCard.test.jsx`

- [ ] **Step 1: Write the failing tests**

Create `src/components/SensorCard.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import SensorCard from './SensorCard'
import * as api from '../api'

vi.mock('../api')

const props = {
  queryKey: 'nhiet-do',
  queryFn: api.getTemperature,
  label: 'Temperature',
  unit: '°C',
  icon: '🌡️',
}

describe('SensorCard', () => {
  it('shows skeleton while loading', () => {
    api.getTemperature.mockReturnValue(new Promise(() => {}))
    renderWithQuery(<SensorCard {...props} />)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('displays value and unit on success', async () => {
    api.getTemperature.mockResolvedValue({ feed: 'nhiet-do', value: '28.5', created_at: '' })
    renderWithQuery(<SensorCard {...props} />)
    await waitFor(() => expect(screen.getByText(/28\.5/)).toBeInTheDocument())
    expect(screen.getByText('°C')).toBeInTheDocument()
  })

  it('shows Unavailable on error', async () => {
    api.getTemperature.mockRejectedValue(new Error('502'))
    renderWithQuery(<SensorCard {...props} />)
    await waitFor(() => expect(screen.getByText('Unavailable')).toBeInTheDocument())
  })

  it('displays label and icon', async () => {
    api.getTemperature.mockResolvedValue({ feed: 'nhiet-do', value: '28.5', created_at: '' })
    renderWithQuery(<SensorCard {...props} />)
    await waitFor(() => expect(screen.getByText('Temperature')).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- SensorCard
```

Expected: `Cannot find module './SensorCard'`

- [ ] **Step 3: Create src/components/SensorCard.jsx**

```jsx
import { useQuery } from '@tanstack/react-query'

export default function SensorCard({ queryKey, queryFn, label, unit, icon }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn,
    refetchInterval: 5000,
  })

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {isLoading && (
        <div className="animate-pulse h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
      )}
      {isError && (
        <p className="text-red-500 text-sm font-medium">Unavailable</p>
      )}
      {data && (
        <p className="text-4xl font-bold tracking-tight">
          {parseFloat(data.value).toFixed(1)}
          <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- SensorCard
```

Expected:
```
✓ src/components/SensorCard.test.jsx (4)
Tests  4 passed (4)
```

- [ ] **Step 5: Commit**

```bash
git add src/components/SensorCard.jsx src/components/SensorCard.test.jsx
git commit -m "feat: add SensorCard with loading, success, and error states"
```

---

## Task 5: Build Toast

**Files:**
- Create: `src/components/Toast.jsx`
- Create: `src/components/Toast.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/Toast.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { screen, act } from '@testing-library/react'
import { render } from '@testing-library/react'
import Toast from './Toast'

describe('Toast', () => {
  it('renders nothing when message is null', () => {
    const { container } = render(<Toast message={null} onDismiss={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the message text', () => {
    render(<Toast message="Toggle failed" onDismiss={vi.fn()} />)
    expect(screen.getByText('Toggle failed')).toBeInTheDocument()
  })

  it('calls onDismiss after 3 seconds', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<Toast message="Error" onDismiss={onDismiss} />)
    act(() => vi.advanceTimersByTime(3000))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- Toast
```

Expected: `Cannot find module './Toast'`

- [ ] **Step 3: Create src/components/Toast.jsx**

```jsx
import { useEffect } from 'react'

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm max-w-xs">
      {message}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- Toast
```

Expected:
```
✓ src/components/Toast.test.jsx (3)
Tests  3 passed (3)
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Toast.jsx src/components/Toast.test.jsx
git commit -m "feat: add Toast component with auto-dismiss"
```

---

## Task 6: Build DeviceCard

**Files:**
- Create: `src/components/DeviceCard.jsx`
- Create: `src/components/DeviceCard.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/DeviceCard.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import DeviceCard from './DeviceCard'
import * as api from '../api'

vi.mock('../api')

const props = {
  queryKey: 'den',
  queryFn: api.getLight,
  mutationFn: api.setLight,
  label: 'Light',
  icon: '💡',
  onError: vi.fn(),
}

describe('DeviceCard', () => {
  it('shows skeleton while loading', () => {
    api.getLight.mockReturnValue(new Promise(() => {}))
    renderWithQuery(<DeviceCard {...props} />)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('shows ON state', async () => {
    api.getLight.mockResolvedValue({ feed: 'den', value: 'ON', created_at: '' })
    renderWithQuery(<DeviceCard {...props} />)
    await waitFor(() => expect(screen.getByText('ON')).toBeInTheDocument())
  })

  it('shows OFF state', async () => {
    api.getLight.mockResolvedValue({ feed: 'den', value: 'OFF', created_at: '' })
    renderWithQuery(<DeviceCard {...props} />)
    await waitFor(() => expect(screen.getByText('OFF')).toBeInTheDocument())
  })

  it('calls mutationFn with true when toggling from OFF', async () => {
    api.getLight.mockResolvedValue({ feed: 'den', value: 'OFF', created_at: '' })
    api.setLight.mockResolvedValue({ feed: 'den', value: 1 })
    renderWithQuery(<DeviceCard {...props} />)
    const btn = await screen.findByLabelText('Toggle Light')
    fireEvent.click(btn)
    await waitFor(() => expect(api.setLight).toHaveBeenCalledWith(true))
  })

  it('calls mutationFn with false when toggling from ON', async () => {
    api.getLight.mockResolvedValue({ feed: 'den', value: 'ON', created_at: '' })
    api.setLight.mockResolvedValue({ feed: 'den', value: 0 })
    renderWithQuery(<DeviceCard {...props} />)
    const btn = await screen.findByLabelText('Toggle Light')
    fireEvent.click(btn)
    await waitFor(() => expect(api.setLight).toHaveBeenCalledWith(false))
  })

  it('calls onError when mutation fails', async () => {
    const onError = vi.fn()
    api.getLight.mockResolvedValue({ feed: 'den', value: 'ON', created_at: '' })
    api.setLight.mockRejectedValue(new Error('502'))
    renderWithQuery(<DeviceCard {...props} onError={onError} />)
    const btn = await screen.findByLabelText('Toggle Light')
    fireEvent.click(btn)
    await waitFor(() => expect(onError).toHaveBeenCalled())
  })

  it('shows Unavailable on fetch error', async () => {
    api.getLight.mockRejectedValue(new Error('502'))
    renderWithQuery(<DeviceCard {...props} />)
    await waitFor(() => expect(screen.getByText('Unavailable')).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- DeviceCard
```

Expected: `Cannot find module './DeviceCard'`

- [ ] **Step 3: Create src/components/DeviceCard.jsx**

```jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function DeviceCard({ queryKey, queryFn, mutationFn, label, icon, onError }) {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn,
    refetchInterval: 5000,
  })

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    onError: (err) => onError?.(err.message || 'Failed to update device'),
  })

  const isOn = data?.value === 'ON'

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {isLoading && (
        <div className="animate-pulse h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      )}
      {isError && (
        <p className="text-red-500 text-sm font-medium">Unavailable</p>
      )}
      {data && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => mutation.mutate(!isOn)}
            disabled={mutation.isPending}
            aria-label={`Toggle ${label}`}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isOn ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
            } ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isOn ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold ${isOn ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {isOn ? 'ON' : 'OFF'}
          </span>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- DeviceCard
```

Expected:
```
✓ src/components/DeviceCard.test.jsx (7)
Tests  7 passed (7)
```

- [ ] **Step 5: Commit**

```bash
git add src/components/DeviceCard.jsx src/components/DeviceCard.test.jsx
git commit -m "feat: add DeviceCard with toggle switch and mutation"
```

---

## Task 7: Build TempChart

**Files:**
- Create: `src/components/TempChart.jsx`
- Create: `src/components/TempChart.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/TempChart.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import TempChart from './TempChart'
import * as api from '../api'

vi.mock('../api')

const historyData = {
  feed: 'nhiet-do',
  value: [
    { value: '28.5', created_at: '2026-01-01T10:00:00Z' },
    { value: '29.0', created_at: '2026-01-01T10:05:00Z' },
  ],
}

describe('TempChart', () => {
  it('shows skeleton while loading', () => {
    api.getTempHistory.mockReturnValue(new Promise(() => {}))
    renderWithQuery(<TempChart />)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders SVG chart on success', async () => {
    api.getTempHistory.mockResolvedValue(historyData)
    renderWithQuery(<TempChart />)
    await waitFor(() => expect(document.querySelector('svg')).toBeInTheDocument())
  })

  it('shows error message on failure', async () => {
    api.getTempHistory.mockRejectedValue(new Error('502'))
    renderWithQuery(<TempChart />)
    await waitFor(() => expect(screen.getByText('Chart unavailable')).toBeInTheDocument())
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- TempChart
```

Expected: `Cannot find module './TempChart'`

- [ ] **Step 3: Create src/components/TempChart.jsx**

```jsx
import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { getTempHistory } from '../api'

export default function TempChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lich-su-nhiet-do'],
    queryFn: getTempHistory,
    refetchInterval: 30000,
  })

  const chartData = (data?.value ?? [])
    .slice()
    .reverse()
    .map(item => ({
      time: new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: parseFloat(item.value),
    }))

  if (isLoading) {
    return <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-xl" />
  }
  if (isError) {
    return <p className="text-red-500 text-sm font-medium">Chart unavailable</p>
  }

  return (
    <ResponsiveContainer width="100%" height={256}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="time" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} unit="°C" domain={['auto', 'auto']} />
        <Tooltip formatter={(v) => [`${v}°C`, 'Temperature']} />
        <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- TempChart
```

Expected:
```
✓ src/components/TempChart.test.jsx (3)
Tests  3 passed (3)
```

- [ ] **Step 5: Commit**

```bash
git add src/components/TempChart.jsx src/components/TempChart.test.jsx
git commit -m "feat: add TempChart with Recharts line chart"
```

---

## Task 8: Build TempTable

**Files:**
- Create: `src/components/TempTable.jsx`
- Create: `src/components/TempTable.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/TempTable.test.jsx`:

```jsx
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import TempTable from './TempTable'
import * as api from '../api'

vi.mock('../api')

const historyData = {
  feed: 'nhiet-do',
  value: [
    { value: '28.5', created_at: '2026-01-01T10:00:00Z' },
    { value: '29.0', created_at: '2026-01-01T10:05:00Z' },
  ],
}

describe('TempTable', () => {
  it('shows skeleton while loading', () => {
    api.getTempHistory.mockReturnValue(new Promise(() => {}))
    renderWithQuery(<TempTable />)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders rows for each history entry', async () => {
    api.getTempHistory.mockResolvedValue(historyData)
    renderWithQuery(<TempTable />)
    await waitFor(() => expect(screen.getByText(/28\.5/)).toBeInTheDocument())
    expect(screen.getByText(/29\.0/)).toBeInTheDocument()
  })

  it('shows error message on failure', async () => {
    api.getTempHistory.mockRejectedValue(new Error('502'))
    renderWithQuery(<TempTable />)
    await waitFor(() => expect(screen.getByText('Table unavailable')).toBeInTheDocument())
  })

  it('renders Time and Temperature column headers', async () => {
    api.getTempHistory.mockResolvedValue(historyData)
    renderWithQuery(<TempTable />)
    await waitFor(() => expect(screen.getByText('Time')).toBeInTheDocument())
    expect(screen.getByText('Temperature')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- TempTable
```

Expected: `Cannot find module './TempTable'`

- [ ] **Step 3: Create src/components/TempTable.jsx**

```jsx
import { useQuery } from '@tanstack/react-query'
import { getTempHistory } from '../api'

export default function TempTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lich-su-nhiet-do'],
    queryFn: getTempHistory,
    refetchInterval: 30000,
  })

  const rows = (data?.value ?? []).slice().reverse()

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
  }
  if (isError) {
    return <p className="text-red-500 text-sm font-medium">Table unavailable</p>
  }

  return (
    <div className="overflow-y-auto max-h-64 rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="text-left px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Time</th>
            <th className="text-right px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Temperature</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          {rows.map((item, i) => (
            <tr key={i}>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                {new Date(item.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right font-mono text-gray-900 dark:text-gray-100">
                {parseFloat(item.value).toFixed(1)} °C
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- TempTable
```

Expected:
```
✓ src/components/TempTable.test.jsx (4)
Tests  4 passed (4)
```

- [ ] **Step 5: Commit**

```bash
git add src/components/TempTable.jsx src/components/TempTable.test.jsx
git commit -m "feat: add TempTable with scrollable history rows"
```

---

## Task 9: Build Header

**Files:**
- Create: `src/components/Header.jsx`
- Create: `src/components/Header.test.jsx`

- [ ] **Step 1: Write failing tests**

Create `src/components/Header.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import Header from './Header'

describe('Header', () => {
  it('renders YoloHome title', () => {
    renderWithQuery(<Header />)
    expect(screen.getByText('YoloHome')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run tests — verify they fail**

```bash
npm test -- Header
```

Expected: `Cannot find module './Header'`

- [ ] **Step 3: Create src/components/Header.jsx**

```jsx
import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export default function Header() {
  const queryClient = useQueryClient()
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      setLastUpdated(new Date())
    })
    return unsubscribe
  }, [queryClient])

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        YoloHome
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        {lastUpdated
          ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
          : 'Connecting…'}
      </p>
    </header>
  )
}
```

- [ ] **Step 4: Run tests — verify they pass**

```bash
npm test -- Header
```

Expected:
```
✓ src/components/Header.test.jsx (1)
Tests  1 passed (1)
```

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.jsx src/components/Header.test.jsx
git commit -m "feat: add Header with live last-updated timestamp"
```

---

## Task 10: Build section wrappers + complete App.jsx

**Files:**
- Create: `src/components/SensorSection.jsx`
- Create: `src/components/DeviceSection.jsx`
- Create: `src/components/HistorySection.jsx`
- Modify: `src/App.jsx`

No TDD for pure layout wrappers — they contain no logic; logic is tested in child components.

- [ ] **Step 1: Create src/components/SensorSection.jsx**

```jsx
import SensorCard from './SensorCard'
import { getTemperature, getHumidity } from '../api'

export default function SensorSection() {
  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Sensors</h2>
      <div className="grid grid-cols-2 gap-4">
        <SensorCard
          queryKey="nhiet-do"
          queryFn={getTemperature}
          label="Temperature"
          unit="°C"
          icon="🌡️"
        />
        <SensorCard
          queryKey="do-am"
          queryFn={getHumidity}
          label="Humidity"
          unit="%"
          icon="💧"
        />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create src/components/DeviceSection.jsx**

```jsx
import { useState } from 'react'
import DeviceCard from './DeviceCard'
import Toast from './Toast'
import { getLight, setLight, getFan, setFan } from '../api'

export default function DeviceSection() {
  const [toastMsg, setToastMsg] = useState(null)

  return (
    <section className="mb-6">
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">Devices</h2>
      <div className="grid grid-cols-2 gap-4">
        <DeviceCard
          queryKey="den"
          queryFn={getLight}
          mutationFn={setLight}
          label="Light"
          icon="💡"
          onError={setToastMsg}
        />
        <DeviceCard
          queryKey="quat"
          queryFn={getFan}
          mutationFn={setFan}
          label="Fan"
          icon="🌀"
          onError={setToastMsg}
        />
      </div>
      <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />
    </section>
  )
}
```

- [ ] **Step 3: Create src/components/HistorySection.jsx**

```jsx
import TempChart from './TempChart'
import TempTable from './TempTable'

export default function HistorySection() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Temperature History
      </h2>
      <div className="space-y-4">
        <TempChart />
        <TempTable />
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Replace src/App.jsx with complete wiring**

```jsx
import Header from './components/Header'
import SensorSection from './components/SensorSection'
import DeviceSection from './components/DeviceSection'
import HistorySection from './components/HistorySection'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Header />
        <SensorSection />
        <DeviceSection />
        <HistorySection />
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Run all tests — verify full suite passes**

```bash
npm test
```

Expected:
```
✓ src/api.test.js (9)
✓ src/components/SensorCard.test.jsx (4)
✓ src/components/DeviceCard.test.jsx (7)
✓ src/components/TempChart.test.jsx (3)
✓ src/components/TempTable.test.jsx (4)
✓ src/components/Toast.test.jsx (3)
✓ src/components/Header.test.jsx (1)
Test Files  7 passed (7)
Tests  31 passed (31)
```

- [ ] **Step 6: Verify dev server renders correctly**

```bash
npm run dev
```

Open `http://localhost:5173`. Verify:
- Header shows "YoloHome" and updates timestamp after first fetch
- Two sensor cards (Temperature, Humidity) in a 2-column grid
- Two device cards (Light, Fan) each with a toggle switch
- Temperature History section with chart and table below

- [ ] **Step 7: Commit**

```bash
git add src/components/SensorSection.jsx src/components/DeviceSection.jsx src/components/HistorySection.jsx src/App.jsx
git commit -m "feat: wire all sections into App — dashboard complete"
```

---

## Task 11: Verify production build

**Files:** No changes

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: build succeeds with no errors. Output similar to:
```
dist/assets/index-XXXXX.css   ~12 kB
dist/assets/index-XXXXX.js    ~250 kB
✓ built in ~200ms
```

- [ ] **Step 2: Preview production build**

```bash
npm run preview
```

Open `http://localhost:4173`. Confirm the dashboard renders identically to dev.

- [ ] **Step 3: Commit**

No code changes — if build passes, done.
