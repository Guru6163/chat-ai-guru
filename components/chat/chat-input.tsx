"use client"

import type React from "react"

import { useEffect, useMemo, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Send, Sparkles } from "lucide-react"
import { PromptAutocomplete } from "@/components/prompt-autocomplete"
import { useQuery } from "@tanstack/react-query"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("")
  const [rows, setRows] = useState(1)
  const [showPromptAutocomplete, setShowPromptAutocomplete] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isMentionMode, setIsMentionMode] = useState(false)
  const [activeToken, setActiveToken] = useState("")

  const [debounced, setDebounced] = useState("")
  useEffect(() => {
    const t = setTimeout(() => setDebounced(input), 200)
    return () => clearTimeout(t)
  }, [input])

  const mentionTokenInfo = useMemo(() => {
    const cursorPos = textareaRef.current?.selectionStart ?? input.length
    const left = input.slice(0, cursorPos)
    const match = left.match(/(^|\s)(@[^\s@]*)$/)
    if (!match) return { hasToken: false as const, token: "", start: -1, end: -1 }
    const token = match[2]
    const start = cursorPos - token.length
    return { hasToken: true as const, token, start, end: cursorPos }
  }, [input])

  useEffect(() => {
    const mention = mentionTokenInfo.hasToken && mentionTokenInfo.token.length >= 1
    setIsMentionMode(!!mention)
    setActiveToken(mention ? mentionTokenInfo.token : "")
    setSelectedIndex(0)
  }, [debounced, mentionTokenInfo])

  useEffect(() => {
    const shouldOpen = (isMentionMode && activeToken.length >= 1) || 
                       (!isMentionMode && debounced.trim().length > 0)
    setIsDropdownOpen(shouldOpen)
  }, [isMentionMode, activeToken, debounced])

  const queryKey = isMentionMode
    ? ["mention-people", activeToken]
    : ["suggestions", debounced]

  const { data: suggestions = [], isFetching } = useQuery({
    queryKey,
    queryFn: async () => {
      const endpoint = isMentionMode
        ? `/api/people?q=${encodeURIComponent(activeToken.replace(/^@+/, ""))}`
        : `/api/search?q=${encodeURIComponent(debounced)}`
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error("Search request failed")
      const data = await res.json()
      return data.results || []
    },
    enabled: isMentionMode ? activeToken.length >= 1 : debounced.trim().length > 0,
    staleTime: 60 * 1000,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setInput(value)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200)
      textareaRef.current.style.height = `${newHeight}px`
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input)
      setInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto"
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const hasSuggestions = (suggestions as any[]).length > 0
    if (isDropdownOpen && (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === "Escape")) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % ((suggestions as any[]).length || 1))
        return
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + ((suggestions as any[]).length || 1)) % ((suggestions as any[]).length || 1))
        return
      }
      if (e.key === "Enter") {
        e.preventDefault()
        if (hasSuggestions) {
          const chosen: any = (suggestions as any[])[selectedIndex]
          if (isMentionMode && mentionTokenInfo.hasToken) {
            const before = input.slice(0, mentionTokenInfo.start)
            const after = input.slice(mentionTokenInfo.end)
            const name = chosen.name as string
            const replacement = `@${name}`
            const next = `${before}${replacement}${after}`
            setInput(next)
            requestAnimationFrame(() => {
              if (textareaRef.current) {
                const pos = (before + replacement).length
                textareaRef.current.selectionStart = pos
                textareaRef.current.selectionEnd = pos
                textareaRef.current.focus()
              }
            })
          } else {
            const text = chosen.text as string
            setInput(text)
          }
        } else {
          return
        }
        setIsDropdownOpen(false)
        return
      }
      if (e.key === "Escape") {
        e.preventDefault()
        setIsDropdownOpen(false)
        return
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const handleSelectPrompt = (promptContent: string) => {
    setInput(promptContent)
    if (textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-3">
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isLoading}
            className="w-full p-2 sm:p-3 bg-input text-foreground border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 text-sm sm:text-base"
            rows={1}
          />
          {/* Suggestions / Mentions Dropdown */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-background border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
              {isFetching && (suggestions as any[]).length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">Searching…</div>
              ) : (suggestions as any[]).length === 0 ? (
                <div className="px-4 py-3 text-sm text-muted-foreground">No results found</div>
              ) : null}
              {(suggestions as any[]).map((item: any, index: number) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    if (isMentionMode && mentionTokenInfo.hasToken) {
                      const before = input.slice(0, mentionTokenInfo.start)
                      const after = input.slice(mentionTokenInfo.end)
                      const name = item.name as string
                      const replacement = `@${name}`
                      const next = `${before}${replacement}${after}`
                      setInput(next)
                    } else {
                      setInput(item.text as string)
                    }
                    setIsDropdownOpen(false)
                    textareaRef.current?.focus()
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors border-b border-border/50 last:border-b-0 ${
                    index === selectedIndex ? "bg-muted" : "hover:bg-muted/50"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">
                    {isMentionMode ? (
                      <Highlight text={item.name as string} query={activeToken.replace(/^@+/, "")} />
                    ) : (
                      <Highlight text={item.text as string} query={debounced} />
                    )}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 self-end">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowPromptAutocomplete(true)}
            disabled={isLoading}
            title="Browse prompt templates"
            className="h-9 w-9 sm:h-10 sm:w-10"
          >
            <Sparkles className="w-4 h-4" />
          </Button>
          <Button type="submit" disabled={isLoading || !input.trim()} className="h-9 w-9 sm:h-10 sm:w-10 p-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <PromptAutocomplete
        isOpen={showPromptAutocomplete}
        onClose={() => setShowPromptAutocomplete(false)}
        onSelectPrompt={handleSelectPrompt}
      />
    </>
  )
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim()
  if (!q) return <>{text}</>
  const lower = text.toLowerCase()
  const idx = lower.indexOf(q.toLowerCase())
  if (idx === -1) return <>{text}</>
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + q.length)
  const after = text.slice(idx + q.length)
  return (
    <>
      {before}
      <mark className="bg-yellow-300/40 text-foreground rounded px-0.5">{match}</mark>
      {after}
    </>
  )
}
