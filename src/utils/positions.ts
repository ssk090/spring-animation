import type { EmojiPosition } from '../types'

function jitter(index: number, amount: number) {
  return Math.sin(index * 12.9898) * amount
}

// Row just below the search bar, evenly spaced and centered.
export function getSelectedPosition(index: number, total: number, width: number): EmojiPosition {
  const spacing = Math.min(74, (width * 0.88) / Math.max(total, 1))
  const start = ((total - 1) * spacing) / -2

  return {
    x: start + index * spacing,
    y: 96,
    rotate: 0,
  }
}

// Scattered heap pinned to the bottom of the stage, stacked upward.
export function getPilePosition(
  index: number,
  total: number,
  width: number,
  height: number,
): EmojiPosition {
  const perRow = Math.ceil(total / 4)
  const row = Math.floor(index / perRow)
  const column = index % perRow
  const spacing = (width * 0.96) / perRow

  return {
    x: (column - (perRow - 1) / 2) * spacing + jitter(index, 16),
    y: height / 2 - 44 - row * 24 + Math.abs(jitter(index + 4, 16)),
    rotate: jitter(index + 8, 26),
  }
}
