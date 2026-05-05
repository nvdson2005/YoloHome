import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import TempChart from './TempChart'
import * as api from '../api'

vi.mock('../api')

const historyData = {
  feed: 'nhiet-do',
  value: [
    { value: '28.5', created_at: '2026-01-01T10:00:00Z' },
    { value: '29.0', created_at: '2026-01-01T10:05:00Z' },
  ],
}

describe('TempChart', () => {
  it('shows skeleton while loading', () => {
    api.getTempHistory.mockReturnValue(new Promise(() => {}))
    renderWithQuery(<TempChart />)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders SVG chart on success', async () => {
    api.getTempHistory.mockResolvedValue(historyData)
    renderWithQuery(<TempChart />)
    await waitFor(() => expect(document.querySelector('.recharts-responsive-container')).toBeInTheDocument())
  })

  it('shows error message on failure', async () => {
    api.getTempHistory.mockRejectedValue(new Error('502'))
    renderWithQuery(<TempChart />)
    await waitFor(() => expect(screen.getByText('Chart unavailable')).toBeInTheDocument())
  })
})
