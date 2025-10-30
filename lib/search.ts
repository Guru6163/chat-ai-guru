// Search utility for finding messages and sessions

export interface SearchResult {
  type: "message" | "session"
  id: string
  title: string
  preview: string
  timestamp: number
}

export function searchMessages(
  query: string,
  messages: Array<{ id: string; role: string; content: string; timestamp: number }>,
): SearchResult[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  return messages
    .filter((msg) => msg.content.toLowerCase().includes(lowerQuery))
    .map((msg) => ({
      type: "message" as const,
      id: msg.id,
      title: msg.role === "user" ? "Your message" : "Assistant response",
      preview: msg.content.substring(0, 100),
      timestamp: msg.timestamp,
    }))
}

export function searchSessions(
  query: string,
  sessions: Array<{ id: string; title: string; timestamp: number }>,
): SearchResult[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  return sessions
    .filter((session) => session.title.toLowerCase().includes(lowerQuery))
    .map((session) => ({
      type: "session" as const,
      id: session.id,
      title: session.title,
      preview: session.title,
      timestamp: session.timestamp,
    }))
}

export function combineSearchResults(messageResults: SearchResult[], sessionResults: SearchResult[]): SearchResult[] {
  return [...sessionResults, ...messageResults].sort((a, b) => b.timestamp - a.timestamp)
}
