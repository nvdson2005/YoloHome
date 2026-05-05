import { useQuery } from '@tanstack/react-query'

export default function SensorCard({ queryKey, queryFn, label, unit, icon }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn,
    refetchInterval: 5000,
  })

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {isLoading && (
        <div className="animate-pulse h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded" />
      )}
      {isError && (
        <p className="text-red-500 text-sm font-medium">Unavailable</p>
      )}
      {data && (
        <p className="text-4xl font-bold tracking-tight">
          {parseFloat(data.value).toFixed(1)}
          <span className="text-lg font-normal text-gray-500 dark:text-gray-400 ml-1">{unit}</span>
        </p>
      )}
    </div>
  )
}
