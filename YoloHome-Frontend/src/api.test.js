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
