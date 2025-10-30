"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Plus, Trash2, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { SearchBar } from "./search-bar"
import type { SearchResult } from "@/lib/search"

interface SidebarProps {
  isOpen: boolean
  sessions: Array<{ id: string; title: string; timestamp: number }>
  currentSessionId: string | null
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onNewChat: () => void
  onToggle: () => void
}

export function Sidebar({
  isOpen,
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
  onToggle,
}: SidebarProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSelectSearchResult = (result: SearchResult) => {
    if (result.type === "session") {
      onSelectSession(result.id)
      setIsSearching(false)
    }
  }

  return (
    <>
      <aside
        className={`${
          isOpen ? "w-64" : "w-0"
        } bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-smooth overflow-hidden flex flex-col`}
      >
        <div className="p-4 border-b border-sidebar-border flex items-center justify-between">
          <h2 className="font-semibold text-sm sm:text-base">Chat History</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={onToggle}
            className="text-sidebar-foreground hover:bg-sidebar-accent"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="px-4 py-3 border-b border-sidebar-border">
          <SearchBar sessions={sessions} messages={[]} onSelectResult={handleSelectSearchResult} />
        </div>

        <Button
          onClick={onNewChat}
          className="m-4 w-[calc(100%-2rem)] bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-smooth text-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>

        <div className="flex-1 overflow-y-auto px-2 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              onMouseEnter={() => setHoveredId(session.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={`group p-3 rounded-lg cursor-pointer transition-smooth ${
                currentSessionId === session.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "hover:bg-sidebar-accent/50"
              }`}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{session.title}</p>
                  <p className="text-xs text-sidebar-foreground/60">
                    {formatDistanceToNow(session.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
              {hoveredId === session.id && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteSession(session.id)
                  }}
                  className="mt-2 w-full text-xs text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-smooth"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              )}
            </div>
          ))}
        </div>
      </aside>

      {!isOpen && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggle}
          className="absolute left-0 top-4 text-foreground hover:bg-muted transition-smooth z-30"
        >
          <ChevronLeft className="w-4 h-4 rotate-180" />
        </Button>
      )}
    </>
  )
}
