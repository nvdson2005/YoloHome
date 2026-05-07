import { useQuery } from '@tanstack/react-query'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { getLightnessHistory } from '../api'

export default function LightnessChart() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lich-su-do-sang'],
    queryFn: getLightnessHistory,
    refetchInterval: 30000,
  })

  const chartData = (data?.value ?? [])
    .slice()
    .reverse()
    .map(item => ({
      time: new Date(item[1]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      temp: parseFloat(item[3]),
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
        <YAxis tick={{ fontSize: 12 }} unit="Lux" domain={['auto', 'auto']} />
        <Tooltip formatter={(v) => [`${v}Lux`, 'Lightness']} />
        <Line type="monotone" dataKey="temp" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
