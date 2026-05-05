import { describe, it, expect, vi } from 'vitest'
import { screen, act } from '@testing-library/react'
import { render } from '@testing-library/react'
import Toast from './Toast'

describe('Toast', () => {
  it('renders nothing when message is null', () => {
    const { container } = render(<Toast message={null} onDismiss={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders the message text', () => {
    render(<Toast message="Toggle failed" onDismiss={vi.fn()} />)
    expect(screen.getByText('Toggle failed')).toBeInTheDocument()
  })

  it('calls onDismiss after 3 seconds', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<Toast message="Error" onDismiss={onDismiss} />)
    act(() => vi.advanceTimersByTime(3000))
    expect(onDismiss).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})
