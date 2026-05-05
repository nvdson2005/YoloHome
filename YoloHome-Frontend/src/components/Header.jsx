import { useState, useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'

export default function Header() {
  const queryClient = useQueryClient()
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe(() => {
      setLastUpdated(new Date())
    })
    return unsubscribe
  }, [queryClient])

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
        YoloHome
      </h1>
      <p className="text-sm text-gray-400 mt-1">
        {lastUpdated
          ? `Last updated: ${lastUpdated.toLocaleTimeString()}`
          : 'Connecting…'}
      </p>
    </header>
  )
}
