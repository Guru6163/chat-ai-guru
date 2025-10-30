"use client"

import { useState, useRef, useEffect } from "react"
import { ChatMessage } from "./chat-message"
import { ChatInput } from "./chat-input"
import { useChatHistory } from "@/hooks/use-chat-history"
import { MessageCircle } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  isStreaming?: boolean
}

interface ChatInterfaceProps {
  sessionId: string | null
  onNewChat: () => void
}

export function ChatInterface({ sessionId, onNewChat }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [stickyQuestion, setStickyQuestion] = useState<string | null>(null)
  const { autoUpdateSessionTitle, saveMessages } = useChatHistory()
  const isFirstMessageRef = useRef(true)

  useEffect(() => {
    if (sessionId) {
      const saved = localStorage.getItem(`chat-${sessionId}`)
      if (saved) {
        setMessages(JSON.parse(saved))
        isFirstMessageRef.current = false
      } else {
        setMessages([])
        isFirstMessageRef.current = true
      }
    }
  }, [sessionId])

  useEffect(() => {
    if (sessionId && messages.length > 0) {
      localStorage.setItem(`chat-${sessionId}`, JSON.stringify(messages))
      if (isFirstMessageRef.current) {
        const firstUserMessage = messages.find((m) => m.role === "user")
        if (firstUserMessage) {
          autoUpdateSessionTitle(sessionId, firstUserMessage.content)
          isFirstMessageRef.current = false
        }
      }
    }
  }, [messages, sessionId, autoUpdateSessionTitle])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const container = messagesContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const firstUserMessage = messages.find((m) => m.role === "user")
      if (firstUserMessage) {
        setStickyQuestion(firstUserMessage.content)
      }
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [messages])

  const handleSendMessage = async (content: string) => {
    if (!sessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, assistantMessage])

    const mockResponse = generateMockResponse(content)
    let currentContent = ""

    for (let i = 0; i < mockResponse.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30))
      currentContent += mockResponse[i]
      setMessages((prev) => prev.map((m) => (m.id === assistantMessage.id ? { ...m, content: currentContent } : m)))
    }

    setMessages((prev) => prev.map((m) => (m.id === assistantMessage.id ? { ...m, isStreaming: false } : m)))

    setIsLoading(false)
  }

  const handleRegenerate = async (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex === -1) return

    const userMessage = messages[messageIndex - 1]
    if (!userMessage || userMessage.role !== "user") return

    setMessages((prev) => prev.filter((m) => m.id !== messageId))
    setIsLoading(true)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, assistantMessage])

    const mockResponse = generateMockResponse(userMessage.content)
    let currentContent = ""

    for (let i = 0; i < mockResponse.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 30))
      currentContent += mockResponse[i]
      setMessages((prev) => prev.map((m) => (m.id === assistantMessage.id ? { ...m, content: currentContent } : m)))
    }

    setMessages((prev) => prev.map((m) => (m.id === assistantMessage.id ? { ...m, isStreaming: false } : m)))

    setIsLoading(false)
  }

  const handleEditPrompt = (messageId: string, newContent: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex === -1) return

    const updatedMessages = messages.slice(0, messageIndex)
    setMessages(updatedMessages)

    handleSendMessage(newContent)
  }

  return (
    <div className="flex flex-col h-full w-full">
      {stickyQuestion && messages.length > 1 && (
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 sm:px-6 py-4 shadow-sm animate-slideInDown">
          <p className="text-xs sm:text-sm text-muted-foreground">Question</p>
          <p className="text-foreground font-medium line-clamp-2 text-sm sm:text-base">{stickyQuestion}</p>
        </div>
      )}

      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 sm:py-8 space-y-4 sm:space-y-6"
      >
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
            <div className="mb-4 p-3 sm:p-4 rounded-full bg-muted">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Start a conversation</h1>
            <p className="text-muted-foreground max-w-md text-sm sm:text-base px-4">
              Ask me anything. I can help with writing, analysis, coding, and much more.
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div key={message.id} className="animate-slideInUp">
              <ChatMessage
                message={message}
                onRegenerate={() => handleRegenerate(message.id)}
                onEdit={(newContent) => handleEditPrompt(message.id, newContent)}
                isLast={index === messages.length - 1}
              />
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-border bg-background px-4 sm:px-6 py-3 sm:py-4">
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
    </div>
  )
}

function generateMockResponse(prompt: string): string {
  const code = `function respond(input) {\n  // Echoes the input and returns a greeting\n  return ` + "`Hello, ${input}!`" + `\n}\n\nconsole.log(respond("${prompt.replace(/`/g, "\\`")}"));`

  const md = `# Quick Notes\n\n- **Topic**: Response preview for \`${prompt}\`\n- You can expand this block to view it in a larger panel.\n\n## Next Steps\n1. Edit the function.\n2. Re-run the sample.\n3. Share results.`

  const message = `Here's a small code sample based on your message:\n\n\
\u0060\u0060\u0060js\n${code}\n\u0060\u0060\u0060\n\nAnd here's a markdown preview you can expand:\n\n\
\u0060\u0060\u0060markdown\n${md}\n\u0060\u0060\u0060\n`

  return message
}
