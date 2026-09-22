import { noul, TypeSafeClient, type NoulQuestion } from '@typesafe-ai/sdk'
import { useEffect, useState } from 'react'
import type { EmojiOption } from '../types'

const apiKey = import.meta.env.VITE_TYPESAFE_API_KEY as string | undefined

// baseURL '/api' keeps requests same-origin. Vite proxies /api/v1 in dev and
// api/v1/[...path].ts proxies it on Vercel; the API has no CORS headers.
const client = apiKey
  ? new TypeSafeClient({ apiKey, baseURL: '/api', dangerouslyAllowBrowser: true })
  : null

if (!client) {
  console.warn('No VITE_TYPESAFE_API_KEY set, falling back to keyword matching.')
}

const MATCH_THRESHOLD = 0.15
const MAX_MATCHES = 12

function keywordMatch(query: string, emojis: EmojiOption[]) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean)

  return emojis
    .filter((emoji) => words.some((word) => emoji.label.includes(word) || emoji.emoji.includes(word)))
    .map((emoji) => emoji.id)
}

export function useEmojiClassification(query: string, emojis: EmojiOption[]) {
  const [result, setResult] = useState<{ query: string; ids: string[] }>({ query: '', ids: [] })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const trimmed = query.trim()

    if (!trimmed) {
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      setIsLoading(true)

      if (!client) {
        setResult({ query: trimmed, ids: keywordMatch(trimmed, emojis) })
        setIsLoading(false)
        return
      }

      const questions = Object.fromEntries(
        emojis.map((emoji) => [
          emoji.id,
          noul(
            `Would this emoji be a good literal pick for the user's request? Emoji: ${emoji.emoji} (${emoji.label}).`,
            {
              true: 'The emoji depicts a real thing the request describes.',
              false: 'The emoji is unrelated, or only metaphorically related.',
            },
          ),
        ]),
      ) as Record<string, NoulQuestion>

      try {
        const { answers } = await client.systemOne(
          { state: { user_request: trimmed }, questions },
          { signal: controller.signal },
        )

        const ids = emojis
          .filter((emoji) => (answers[emoji.id]?.noul ?? 0) >= MATCH_THRESHOLD)
          .sort((a, b) => answers[b.id].noul - answers[a.id].noul)
          .slice(0, MAX_MATCHES)
          .map((emoji) => emoji.id)

        setResult({ query: trimmed, ids })
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error)
          setResult({ query: trimmed, ids: keywordMatch(trimmed, emojis) })
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, 350)

    return () => {
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [query, emojis])

  const current = query.trim()

  return {
    selectedIds: result.query === current ? result.ids : [],
    isLoading: Boolean(current) && isLoading,
  }
}
