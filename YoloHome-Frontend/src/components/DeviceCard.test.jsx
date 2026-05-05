import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor, fireEvent } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import DeviceCard from './DeviceCard'
import * as api from '../api'

vi.mock('../api')

const props = {
  queryKey: 'den',
  queryFn: api.getLight,
  mutationFn: api.setLight,
  label: 'Light',
  icon: '💡',
  onError: vi.fn(),
}

describe('DeviceCard', () => {
  it('shows skeleton while loading', () => {
    api.getLight.mockReturnValue(new Promise(() => {}))
    renderWithQuery(<DeviceCard {...props} />)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('shows ON state', async () => {
    api.getLight.mockResolvedValue({ feed: 'den', value: 'ON', created_at: '' })
    renderWithQuery(<DeviceCard {...props} />)
    await waitFor(() => expect(screen.getByText('ON')).toBeInTheDocument())
  })

  it('shows OFF state', async () => {
    api.getLight.mockResolvedValue({ feed: 'den', value: 'OFF', created_at: '' })
    renderWithQuery(<DeviceCard {...props} />)
    await waitFor(() => expect(screen.getByText('OFF')).toBeInTheDocument())
  })

  it('calls mutationFn with true when toggling from OFF', async () => {
    api.getLight.mockResolvedValue({ feed: 'den', value: 'OFF', created_at: '' })
    api.setLight.mockResolvedValue({ feed: 'den', value: 1 })
    renderWithQuery(<DeviceCard {...props} />)
    const btn = await screen.findByLabelText('Toggle Light')
    fireEvent.click(btn)
    await waitFor(() => expect(api.setLight).toHaveBeenCalledWith(true, expect.any(Object)))
  })

  it('calls mutationFn with false when toggling from ON', async () => {
    api.getLight.mockResolvedValue({ feed: 'den', value: 'ON', created_at: '' })
    api.setLight.mockResolvedValue({ feed: 'den', value: 0 })
    renderWithQuery(<DeviceCard {...props} />)
    const btn = await screen.findByLabelText('Toggle Light')
    fireEvent.click(btn)
    await waitFor(() => expect(api.setLight).toHaveBeenCalledWith(false, expect.any(Object)))
  })

  it('calls onError when mutation fails', async () => {
    const onError = vi.fn()
    api.getLight.mockResolvedValue({ feed: 'den', value: 'ON', created_at: '' })
    api.setLight.mockRejectedValue(new Error('502'))
    renderWithQuery(<DeviceCard {...props} onError={onError} />)
    const btn = await screen.findByLabelText('Toggle Light')
    fireEvent.click(btn)
    await waitFor(() => expect(onError).toHaveBeenCalled())
  })

  it('shows Unavailable on fetch error', async () => {
    api.getLight.mockRejectedValue(new Error('502'))
    renderWithQuery(<DeviceCard {...props} />)
    await waitFor(() => expect(screen.getByText('Unavailable')).toBeInTheDocument())
  })
})
