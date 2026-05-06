import TempChart from './TempChart'
import TempTable from './TempTable'
import HumidityChart from './HumidityChart'
import HumidityTable from './HumidityTable'

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

      <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-3">
        Humidity History
      </h2>
      <div className="space-y-4">
        <HumidityChart />
        <HumidityTable />
      </div>
    </section>
  )
}
