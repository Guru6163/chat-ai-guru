"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, RotateCcw, Edit2, Check, X } from "lucide-react"
import { Markdown } from "./markdown"

interface ChatMessageProps {
  message: {
    id: string
    role: "user" | "assistant"
    content: string
    isStreaming?: boolean
  }
  onRegenerate: () => void
  onEdit: (newContent: string) => void
  isLast: boolean
}

export function ChatMessage({ message, onRegenerate, onEdit, isLast }: ChatMessageProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(message.content)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleEditSubmit = () => {
    if (editedContent.trim() && editedContent !== message.content) {
      onEdit(editedContent)
      setIsEditing(false)
    }
  }

  const isUser = message.role === "user"

  return (
    <div className={`flex gap-4 ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-2xl ${isUser ? "bg-primary text-primary-foreground rounded-2xl px-4 py-3" : "flex-1"}`}>
        {isEditing && isUser ? (
          <div className="space-y-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-3 bg-background text-foreground border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleEditSubmit} className="bg-primary hover:bg-primary/90">
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditedContent(message.content)
                }}
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className={isUser ? "" : "prose prose-invert max-w-none"}>
              {isUser ? <p className="text-sm">{message.content}</p> : <Markdown content={message.content} />}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
              <Button size="sm" variant="ghost" onClick={handleCopy} className="text-xs">
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
              {!isUser && (
                <Button size="sm" variant="ghost" onClick={onRegenerate} className="text-xs">
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Regenerate
                </Button>
              )}
              {isUser && (
                <>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)} className="text-xs">
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onEdit(message.content)} className="text-xs">
                    <RotateCcw className="w-3 h-3 mr-1" />
                    Resubmit
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
