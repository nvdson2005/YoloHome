import { useState } from 'react'
import DeviceCard from './DeviceCard'
import Toast from './Toast'
import { getLight, setLight, getFan, setFan, getMode, setMode } from '../api'

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
        <DeviceCard
          queryKey="mode"
          queryFn={getMode}
          mutationFn={setMode}
          label="Mode"
          icon="⚙"
          onError={setToastMsg}
        />
      </div>
      <Toast message={toastMsg} onDismiss={() => setToastMsg(null)} />
    </section>
  )
}
