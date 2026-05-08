import SensorCard from './SensorCard'
import { getTemperature, getHumidity, getLightness } from '../api'

export default function SensorSection() {
  return (
    <section className="mb-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SensorCard
          queryKey="nhiet-do"
          queryFn={getTemperature}
          label="Temperature"
          unit="°C"
          icon=""
        />
        <SensorCard
          queryKey="do-am"
          queryFn={getHumidity}
          label="Humidity"
          unit="%"
          icon=""
        />
        <SensorCard
          queryKey="do-sang"
          queryFn={getLightness}
          label="Lightness"
          unit=""
          icon=""
        />
      </div>
    </section>
  )
}
