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
