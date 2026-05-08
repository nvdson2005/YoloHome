import Header from './components/Header'
import SensorSection from './components/SensorSection'
import DeviceSection from './components/DeviceSection'
import HistorySection from './components/HistorySection'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <div className="max-w-4xl mx-auto p-10">
        <Header />
        <SensorSection />
        <DeviceSection />
        <HistorySection />
      </div>
    </div>
  )
}
