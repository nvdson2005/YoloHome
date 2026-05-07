import { useQuery } from '@tanstack/react-query'
import { getLightnessHistory } from '../api'

export default function LightnessTable() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['lich-su-do-sang'],
    queryFn: getLightnessHistory,
    refetchInterval: 30000,
  })

  const rows = (data?.value ?? []).slice().reverse()

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-gray-200 dark:bg-gray-700 rounded-xl" />
  }
  if (isError) {
    return <p className="text-red-500 text-sm font-medium">Table unavailable</p>
  }

  return (
    <div className="overflow-y-auto max-h-64 rounded-xl border border-gray-200 dark:border-gray-700">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="text-left px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Time</th>
            <th className="text-right px-4 py-2 font-medium text-gray-500 dark:text-gray-400">Lightness</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
          {rows.map((item) => (
            <tr key={item.created_at}>
              <td className="px-4 py-2 text-gray-600 dark:text-gray-300">
                {new Date(item[1]).toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right font-mono text-gray-900 dark:text-gray-100">
                {parseFloat(item[3]).toFixed(1)} Lux
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
