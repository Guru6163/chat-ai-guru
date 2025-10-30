"use client"

import { useMemo, useState } from "react"
import { Trash2, Plus } from "lucide-react"
import {
  Sidebar as UISidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

type Session = { id: string; title: string; timestamp: number }

interface AppSidebarProps {
  sessions: Session[]
  currentSessionId: string | null
  onSelectSession: (id: string) => void
  onDeleteSession: (id: string) => void
  onNewChat: () => void
}

export function AppSidebar({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat,
}: AppSidebarProps) {
  const [query, setQuery] = useState("")

  const filteredSessions = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return sessions
    return sessions.filter((s) => s.title.toLowerCase().includes(trimmed))
  }, [query, sessions])
  return (
    <UISidebar>
      <SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Chat History</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarInput
              placeholder="Search..."
              aria-label="Search chats"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sessions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredSessions.map((s) => (
                <SidebarMenuItem key={s.id}>
                  <SidebarMenuButton
                    isActive={s.id === currentSessionId}
                    onClick={() => onSelectSession(s.id)}
                    title={s.title}
                  >
                    <span>{s.title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    aria-label="Delete session"
                    onClick={() => onDeleteSession(s.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <Button onClick={onNewChat} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </SidebarFooter>
    </UISidebar>
  )
}


