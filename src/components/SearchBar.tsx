type SearchBarProps = {
  value: string
  isLoading: boolean
  onChange: (value: string) => void
  onClear: () => void
}

export function SearchBar({ value, isLoading, onChange, onClear }: SearchBarProps) {
  return (
    <div className="searchBar">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Try: music, pet, travel, birthday..."
        aria-label="Search emojis"
      />
      {value && (
        <button type="button" onClick={onClear} aria-label="Clear search">
          ×
        </button>
      )}
      {isLoading && <span className="loading">Thinking</span>}
    </div>
  )
}
