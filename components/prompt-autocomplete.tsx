"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { searchPrompts, PROMPT_LIBRARY, PROMPT_CATEGORIES } from "@/lib/prompt-library"
import type { Prompt } from "@/lib/prompt-library"
import { ChevronRight } from "lucide-react"

interface PromptAutocompleteProps {
  onSelectPrompt: (prompt: string) => void
  isOpen: boolean
  onClose: () => void
}

export function PromptAutocomplete({ onSelectPrompt, isOpen, onClose }: PromptAutocompleteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const trimmedQuery = query.trim()
  const suggestions = useMemo<Prompt[]>(() => (trimmedQuery ? searchPrompts(trimmedQuery) : []), [trimmedQuery])
  const showCategories = !trimmedQuery

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev + 1) % (suggestions.length || 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev - 1 + (suggestions.length || 1)) % (suggestions.length || 1))
    } else if (e.key === "Enter") {
      e.preventDefault()
      if (suggestions.length > 0) {
        onSelectPrompt(suggestions[selectedIndex].content)
      }
      onClose()
    } else if (e.key === "Escape") {
      onClose()
    }
  }

  const handleSelectPrompt = (prompt: Prompt) => {
    onSelectPrompt(prompt.content)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div
        className="w-full max-w-2xl bg-background border border-border rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search prompts or type to filter..."
            className="w-full px-4 py-2 bg-input text-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {showCategories ? (
            <div className="p-4 space-y-4">
              {PROMPT_CATEGORIES.map((category) => {
                const categoryPrompts = PROMPT_LIBRARY.filter((p) => p.category === category)
                return (
                  <div key={category}>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-2">{category}</h3>
                    <div className="space-y-1">
                      {categoryPrompts.slice(0, 3).map((prompt) => (
                        <button
                          key={prompt.id}
                          onClick={() => handleSelectPrompt(prompt)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                        >
                          <p className="text-sm font-medium text-foreground">{prompt.title}</p>
                          <p className="text-xs text-muted-foreground">{prompt.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : suggestions.length > 0 ? (
            <div className="p-2">
              {suggestions.map((prompt, index) => (
                <button
                  key={prompt.id}
                  onClick={() => handleSelectPrompt(prompt)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                    index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{prompt.title}</p>
                    <p className="text-xs text-muted-foreground">{prompt.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                </button>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">No prompts found</p>
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t border-border bg-muted/30 text-xs text-muted-foreground">
          <p>↑↓ Navigate • Enter Select • Esc Close</p>
        </div>
      </div>
    </div>
  )
}
