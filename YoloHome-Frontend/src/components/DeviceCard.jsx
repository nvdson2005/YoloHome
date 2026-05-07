import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export default function DeviceCard({ queryKey, queryFn, mutationFn, label, icon, onError }) {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn,
    refetchInterval: 5000,
  })

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [queryKey] }),
    onError: (err) => onError?.(err.message || 'Failed to update device'),
  })

  const isOn = data?.value === '1'

  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow p-6">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {isLoading && (
        <div className="animate-pulse h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
      )}
      {isError && (
        <p className="text-red-500 text-sm font-medium">Unavailable</p>
      )}
      {data && (
        <div className="flex items-center gap-4">
          <button
            onClick={() => mutation.mutate(!isOn)}
            disabled={mutation.isPending}
            aria-label={`Toggle ${label}`}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
              isOn ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-600'
            } ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                isOn ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
          <span className={`text-sm font-semibold ${isOn ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {isOn ? 'ON' : 'OFF'}
          </span>
        </div>
      )}
    </div>
  )
}
