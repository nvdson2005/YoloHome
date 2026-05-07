import SensorCard from './SensorCard'
import { getTemperature, getHumidity, getLightness } from '../api'

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
        <SensorCard
          queryKey="do-sang"
          queryFn={getLightness}
          label="Lightness"
          unit="Lux"
          icon="💡"
        />
      </div>
    </section>
  )
}
