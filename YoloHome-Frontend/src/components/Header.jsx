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
    <header className="mb-10 flex justify-between items-center">
      <h1 className="text-4xl font-black text-blue-600">YOLO:HOME</h1>
      <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full font-bold">● {lastUpdated ? 'Connected' : 'Connecting…'}</span>
    </header>
  )
}
