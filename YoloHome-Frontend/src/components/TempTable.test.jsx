import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import TempTable from './TempTable'
import * as api from '../api'

vi.mock('../api')

const historyData = {
  feed: 'nhiet-do',
  value: [
    { value: '28.5', created_at: '2026-01-01T10:00:00Z' },
    { value: '29.0', created_at: '2026-01-01T10:05:00Z' },
  ],
}

describe('TempTable', () => {
  it('shows skeleton while loading', () => {
    api.getTempHistory.mockReturnValue(new Promise(() => {}))
    renderWithQuery(<TempTable />)
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument()
  })

  it('renders rows for each history entry', async () => {
    api.getTempHistory.mockResolvedValue(historyData)
    renderWithQuery(<TempTable />)
    await waitFor(() => expect(screen.getByText(/28\.5/)).toBeInTheDocument())
    expect(screen.getByText(/29\.0/)).toBeInTheDocument()
  })

  it('shows error message on failure', async () => {
    api.getTempHistory.mockRejectedValue(new Error('502'))
    renderWithQuery(<TempTable />)
    await waitFor(() => expect(screen.getByText('Table unavailable')).toBeInTheDocument())
  })

  it('renders Time and Temperature column headers', async () => {
    api.getTempHistory.mockResolvedValue(historyData)
    renderWithQuery(<TempTable />)
    await waitFor(() => expect(screen.getByText('Time')).toBeInTheDocument())
    expect(screen.getByText('Temperature')).toBeInTheDocument()
  })
})
