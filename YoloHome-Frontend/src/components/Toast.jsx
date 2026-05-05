import { useEffect } from 'react'

export default function Toast({ message, onDismiss }) {
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(onDismiss, 3000)
    return () => clearTimeout(timer)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white px-4 py-3 rounded-xl shadow-lg text-sm max-w-xs">
      {message}
    </div>
  )
}
