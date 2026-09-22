import { useState } from 'react'
import './App.css'
import { EmojiStage } from './components/EmojiStage'
import { SearchBar } from './components/SearchBar'
import { EMOJIS } from './data/emojis'
import { useEmojiClassification } from './hooks/useEmojiClassification'
import { useWindowSize } from './hooks/useWindowSize'

function App() {
  const [query, setQuery] = useState('')
  const { width, height } = useWindowSize()
  const { selectedIds, isLoading } = useEmojiClassification(query, EMOJIS)

  return (
    <main className="appShell">
      <EmojiStage emojis={EMOJIS} selectedIds={selectedIds} width={width} height={height} />

      <h1 className="headline">What are you looking for?</h1>

      <div className="searchWrap">
        <SearchBar
          value={query}
          isLoading={isLoading}
          onChange={setQuery}
          onClear={() => setQuery('')}
        />
      </div>
    </main>
  )
}

export default App
