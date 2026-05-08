import { useEffect } from 'react'

export default function Toast({ message, type = 'error', onDismiss }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600'

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${bg} text-white px-4 py-3 rounded-xl shadow-lg text-sm max-w-xs`}>
      {message}
    </div>
  )
}
