import { EmojiItem, type EmojiPhase } from './EmojiItem'
import type { EmojiOption } from '../types'
import { getPilePosition, getSelectedPosition } from '../utils/positions'

type EmojiStageProps = {
  emojis: EmojiOption[]
  selectedIds: string[]
  width: number
  height: number
}

export function EmojiStage({ emojis, selectedIds, width, height }: EmojiStageProps) {
  return (
    <div className="emojiStage" aria-hidden="true">
      {emojis.map((emoji, index) => {
        const selectedIndex = selectedIds.indexOf(emoji.id)
        const phase: EmojiPhase = selectedIndex === -1 ? 'pile' : 'selected'
        const position =
          phase === 'selected'
            ? getSelectedPosition(selectedIndex, selectedIds.length, width)
            : getPilePosition(index, emojis.length, width, height)

        return (
          <EmojiItem
            key={emoji.id}
            emoji={emoji.emoji}
            x={position.x}
            y={position.y}
            rotate={position.rotate}
            scale={phase === 'selected' ? 1.6 : 1}
            phase={phase}
            delay={phase === 'selected' ? selectedIndex * 0.04 : index * 0.004}
          />
        )
      })}
    </div>
  )
}
