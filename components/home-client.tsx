"use client"

import { useState, useEffect, Suspense } from "react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { CommandMenu } from "@/features/command-menu/command-menu"
import { SettingsModal } from "@/components/settings-modal"
import { storage } from "@/lib/storage"

export function HomeClient() {
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile)
  const [chatSessions, setChatSessions] = useState<Array<{ id: string; title: string; timestamp: number }>>([])
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("chat-sessions")
    if (saved) {
      const sessions = JSON.parse(saved)
      setChatSessions(sessions)
    }
  }, [])
  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
  }, [currentSessionId, isMobile])

  const handleNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: Date.now(),
    }
    const updated = [newSession, ...chatSessions]
    setChatSessions(updated)
    setCurrentSessionId(newSession.id)
    localStorage.setItem("chat-sessions", JSON.stringify(updated))
  }

  const handleClearHistory = () => {
    storage.clearAllHistory()
    setChatSessions([])
    setCurrentSessionId(null)
    localStorage.removeItem("chat-sessions")
  }

  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id)
  }

  const handleDeleteSession = (id: string) => {
    const updated = chatSessions.filter((s) => s.id !== id)
    setChatSessions(updated)
    localStorage.setItem("chat-sessions", JSON.stringify(updated))
    if (currentSessionId === id) {
      setCurrentSessionId(updated.length > 0 ? updated[0].id : null)
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar
        sessions={chatSessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onNewChat={handleNewChat}
      />
      <SidebarInset>
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
          <main className="flex-1 flex flex-col overflow-hidden">
            <Suspense fallback={<div className="flex-1 flex items-center justify-center text-muted-foreground">Loading…</div>}>
              {currentSessionId ? (
                <ChatInterface sessionId={currentSessionId} onNewChat={handleNewChat} />
              ) : (
                <div className="flex-1 flex items-center justify-center text-muted-foreground">
                  Select a chat from the sidebar or start a new chat
                </div>
              )}
            </Suspense>
          </main>
        </div>
        <CommandMenu
          onNewChat={handleNewChat}
          onClearHistory={handleClearHistory}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </SidebarInset>
    </SidebarProvider>
  )
}


