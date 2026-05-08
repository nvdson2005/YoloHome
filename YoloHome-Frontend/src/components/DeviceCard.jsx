export default function DeviceCard({ label, disabled, onClick, variant }) {
  const buttonColor =
    variant === 'on'
      ? 'bg-green-500 hover:bg-green-600'
      : 'bg-red-500 hover:bg-red-600'

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${buttonColor} text-white px-10 py-4 rounded-2xl font-black text-xl transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {label}
    </button>
  )
}
