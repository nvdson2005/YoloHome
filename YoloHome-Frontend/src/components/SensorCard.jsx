import { useQuery } from '@tanstack/react-query'

const colorMap = {
  'nhiet-do': { color: 'text-orange-500', bg: 'bg-orange-50' },
  'do-am': { color: 'text-blue-500', bg: 'bg-blue-50' },
  'do-sang': { color: 'text-yellow-500', bg: 'bg-yellow-50' },
}

export default function SensorCard({ queryKey, queryFn, label, unit, icon }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn,
    refetchInterval: 5000,
  })

  const { color } = colorMap[queryKey] || { color: 'text-gray-800' }

  return (
    <div className="bg-white p-8 rounded-3xl shadow-xl text-center">
      <p className="text-gray-500 uppercase text-xs font-bold mb-2">{icon} {label}</p>
      {isLoading && (
        <div className="animate-pulse h-12 w-24 bg-gray-200 rounded mx-auto" />
      )}
      {isError && (
        <p className="text-red-500 text-sm font-medium">Unavailable</p>
      )}
      {data && (
        <>
          <p className={`text-5xl font-black ${color}`}>
            {parseFloat(data.value).toFixed(1)}{unit}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            {new Date(data.created_at).toLocaleString()}
          </p>
        </>
      )}
    </div>
  )
}
