// Generate meaningful session titles from first message

export function generateSessionTitle(firstMessage: string, maxLength = 50): string {
  if (!firstMessage || firstMessage.trim().length === 0) {
    return "New Chat"
  }

  // Remove markdown, code blocks, and extra whitespace
  let title = firstMessage
    .replace(/```[\s\S]*?```/g, "[code]")
    .replace(/`[^`]*`/g, "[code]")
    .replace(/[*_~]/g, "")
    .replace(/\n+/g, " ")
    .trim()

  // Truncate to max length
  if (title.length > maxLength) {
    title = title.substring(0, maxLength).trim() + "..."
  }

  return title || "New Chat"
}
