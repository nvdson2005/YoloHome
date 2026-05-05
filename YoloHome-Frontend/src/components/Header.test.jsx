import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithQuery } from '../test/helpers'
import Header from './Header'

describe('Header', () => {
  it('renders YoloHome title', () => {
    renderWithQuery(<Header />)
    expect(screen.getByText('YoloHome')).toBeInTheDocument()
  })
})
