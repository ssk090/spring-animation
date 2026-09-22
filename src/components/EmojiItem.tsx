import { motion } from 'motion/react'

export type EmojiPhase = 'pile' | 'selected'

type EmojiItemProps = {
  emoji: string
  x: number
  y: number
  rotate: number
  scale: number
  phase: EmojiPhase
  delay: number
}

export function EmojiItem({ emoji, x, y, rotate, scale, phase, delay }: EmojiItemProps) {
  return (
    <motion.div
      className={phase === 'selected' ? 'emoji selected' : 'emoji'}
      initial={false}
      animate={{ x, y, rotate, scale }}
      transition={
        phase === 'selected'
          ? { type: 'spring', stiffness: 320, damping: 22, delay }
          : // Low stiffness + damping reads as gravity: slow start, accelerating fall, small settle.
            { type: 'spring', stiffness: 120, damping: 11, mass: 1.1, delay }
      }
    >
      {emoji}
    </motion.div>
  )
}
