const BASE = 'https://yolo-home-python.vercel.app'

function call(url, options) {
  const fetchArgs = options ? [url, options] : [url]
  return fetch(...fetchArgs).then(r => {
    if (!r.ok) throw new Error(String(r.status))
    return r.json()
  })
}

export const getTemperature = () => call(`${BASE}/feeds/nhiet-do`)
export const getTempHistory  = () => call(`${BASE}/feeds/lich-su-nhiet-do`)
export const getHumidity     = () => call(`${BASE}/feeds/do-am`)
export const getHumidityHistory     = () => call(`${BASE}/feeds/lich-su-do-am`)
export const getLightness        = () => call(`${BASE}/feeds/do-sang`)
export const getLightnessHistory = () => call(`${BASE}/feeds/lich-su-do-sang`)
export const getLight        = () => call(`${BASE}/feeds/den`)
export const setLight        = (status) => call(`${BASE}/feeds/den?status=${encodeURIComponent(status)}`, { method: 'POST' })
export const getFan          = () => call(`${BASE}/feeds/quat`)
export const setFan          = (status) => call(`${BASE}/feeds/quat?status=${encodeURIComponent(status)}`, { method: 'POST' })
export const getMode         = () => call(`${BASE}/feeds/mode`)
export const setMode         = (status) => call(`${BASE}/feeds/mode?status=${encodeURIComponent(status)}`, { method: 'POST' })
