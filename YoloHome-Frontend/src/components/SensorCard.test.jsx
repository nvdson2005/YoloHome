import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import SensorCard from './SensorCard'
import * as api from '../api'

vi.mock('../api')

const props = {
  queryKey: 'nhiet-do',
  queryFn: api.getTemperature,
  label: 'Temperature',
  unit: '°C',
  icon: '🌡️',
}

describe('SensorCard', () => {
  it('shows skeleton while loading', () => {
    api.getTemperature.mockReturnValue(new Promise(() => {}))
    renderWithQuery(<SensorCard {...props} />)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('displays value and unit on success', async () => {
    api.getTemperature.mockResolvedValue({ feed: 'nhiet-do', value: '28.5', created_at: '' })
    renderWithQuery(<SensorCard {...props} />)
    await waitFor(() => expect(screen.getByText(/28\.5/)).toBeInTheDocument())
    expect(screen.getByText('°C')).toBeInTheDocument()
  })

  it('shows Unavailable on error', async () => {
    api.getTemperature.mockRejectedValue(new Error('502'))
    renderWithQuery(<SensorCard {...props} />)
    await waitFor(() => {
      expect(screen.getByText('Unavailable')).toBeInTheDocument()
      expect(document.querySelector('.animate-pulse')).not.toBeInTheDocument()
    })
  })

  it('displays label and icon', async () => {
    api.getTemperature.mockResolvedValue({ feed: 'nhiet-do', value: '28.5', created_at: '' })
    renderWithQuery(<SensorCard {...props} />)
    await waitFor(() => {
      expect(screen.getByText('Temperature')).toBeInTheDocument()
      expect(screen.getByText('🌡️')).toBeInTheDocument()
    })
  })
})
