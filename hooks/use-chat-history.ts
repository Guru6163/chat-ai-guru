"use client"

import { useState, useCallback, useEffect } from "react"
import { storage, type ChatSession, type ChatMessage } from "@/lib/storage"
import { generateSessionTitle } from "@/lib/title-generator"

// Types are imported from storage to avoid duplication

export function useChatHistory() {
  const [sessions, setSessions] = useState<ChatSession[]>(() => storage.getSessions())
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(() => {
    const loaded = storage.getSessions()
    return loaded.length > 0 ? loaded[0].id : null
  })
  const [messages, setMessages] = useState<ChatMessage[]>([])

  // Initial sessions and currentSessionId are set via lazy initializers above

  // Load messages when session changes
  useEffect(() => {
    if (currentSessionId) {
      const loadedMessages = storage.getMessages(currentSessionId)
      queueMicrotask(() => setMessages(loadedMessages))
    } else {
      queueMicrotask(() => setMessages([]))
    }
  }, [currentSessionId])

  const createNewSession = useCallback(
    (initialTitle?: string) => {
      const title = initialTitle || "New Chat"
      const session = storage.createSession(title)
      const updated = [session, ...sessions]
      storage.saveSessions(updated)
      setSessions(updated)
      setCurrentSessionId(session.id)
      setMessages([])
      return session.id
    },
    [sessions],
  )

  const updateSessionTitle = useCallback((sessionId: string, title: string) => {
    storage.updateSessionTitle(sessionId, title)
    setSessions((prev) => prev.map((s) => (s.id === sessionId ? { ...s, title } : s)))
  }, [])

  const autoUpdateSessionTitle = useCallback(
    (sessionId: string, firstMessage: string) => {
      const title = generateSessionTitle(firstMessage)
      updateSessionTitle(sessionId, title)
    },
    [updateSessionTitle],
  )

  const saveMessages = useCallback(
    (sessionId: string, newMessages: ChatMessage[]) => {
      storage.saveMessages(sessionId, newMessages)
      if (sessionId === currentSessionId) {
        setMessages(newMessages)
      }
    },
    [currentSessionId],
  )

  const deleteSession = useCallback(
    (sessionId: string) => {
      storage.deleteSession(sessionId)
      const updated = sessions.filter((s) => s.id !== sessionId)
      setSessions(updated)
      if (currentSessionId === sessionId) {
        setCurrentSessionId(updated.length > 0 ? updated[0].id : null)
      }
    },
    [sessions, currentSessionId],
  )

  const clearAllHistory = useCallback(() => {
    storage.clearAllHistory()
    setSessions([])
    setCurrentSessionId(null)
    setMessages([])
  }, [])

  const exportHistory = useCallback(() => {
    return storage.exportHistory()
  }, [])

  const importHistory = useCallback((jsonData: string) => {
    const success = storage.importHistory(jsonData)
    if (success) {
      const loadedSessions = storage.getSessions()
      setSessions(loadedSessions)
      if (loadedSessions.length > 0) {
        setCurrentSessionId(loadedSessions[0].id)
      }
    }
    return success
  }, [])

  return {
    sessions,
    currentSessionId,
    messages,
    setCurrentSessionId,
    createNewSession,
    updateSessionTitle,
    autoUpdateSessionTitle,
    saveMessages,
    deleteSession,
    clearAllHistory,
    exportHistory,
    importHistory,
  }
}
