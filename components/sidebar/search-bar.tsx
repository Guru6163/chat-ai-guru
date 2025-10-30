"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { searchSessions, searchMessages, combineSearchResults } from "@/lib/search"
import type { SearchResult } from "@/lib/search"

interface SearchBarProps {
  sessions: Array<{ id: string; title: string; timestamp: number }>
  messages: Array<{ id: string; role: string; content: string; timestamp: number }>
  onSelectResult: (result: SearchResult) => void
}

export function SearchBar({ sessions, messages, onSelectResult }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (query.trim()) {
      const sessionResults = searchSessions(query, sessions)
      const messageResults = searchMessages(query, messages)
      const combined = combineSearchResults(messageResults, sessionResults)
      setResults(combined)
      setIsOpen(true)
    } else {
      setResults([])
      setIsOpen(false)
    }
  }, [query, sessions, messages])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search chats..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-8 py-2 text-sm"
        />
        {query && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setQuery("")}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-40 max-h-64 overflow-y-auto">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => {
                onSelectResult(result)
                setQuery("")
              }}
              className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border/50 last:border-b-0"
            >
              <p className="text-sm font-medium text-foreground">{result.title}</p>
              <p className="text-xs text-muted-foreground truncate">{result.preview}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
