"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Maximize2, Minimize2, Copy, Check } from "lucide-react"

interface CodeArtifactProps {
  type: "code"
  language?: string
  content: string
  title?: string
}

interface MarkdownArtifactProps {
  type: "markdown"
  content: string
  title?: string
}

type ArtifactProps = CodeArtifactProps | MarkdownArtifactProps

export function Artifact(props: ArtifactProps) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(props.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const header = (
    <div className="flex items-center justify-between border-b border-border px-3 py-2">
      <div className="text-xs text-muted-foreground truncate">
        {props.title || (props.type === "code" ? props.language || "code" : "artifact")}
      </div>
      <div className="flex items-center gap-1">
        <Button size="sm" variant="ghost" onClick={handleCopy} className="h-7 px-2 text-xs">
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setExpanded((v) => !v)}
          className="h-7 px-2 text-xs"
        >
          {expanded ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
        </Button>
      </div>
    </div>
  )

  const codeBlock = (
    <pre className="bg-muted text-foreground overflow-auto rounded-b-md p-3 text-xs leading-relaxed">
      <code>
        {props.content}
      </code>
    </pre>
  )

  const renderInline = (s: string) => {
    let html = s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;")
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>")
    html = html.replace(/(?:\*)([^\*]+)(?:\*)/g, "<em>$1</em>")
    html = html.replace(/_(.+?)_/g, "<em>$1</em>")
    return html
  }

  const markdownPreview = (
    <div className="bg-muted text-foreground rounded-b-md p-3 text-xs leading-relaxed space-y-1">
      {props.content.split("\n").map((line, idx) => {
        if (line.startsWith("# "))
          return (
            <div key={idx} className="text-base font-semibold" dangerouslySetInnerHTML={{ __html: renderInline(line.slice(2)) }} />
          )
        if (line.startsWith("## "))
          return (
            <div key={idx} className="text-sm font-semibold" dangerouslySetInnerHTML={{ __html: renderInline(line.slice(3)) }} />
          )
        if (line.startsWith("- "))
          return (
            <div key={idx} className="ml-4 list-item" dangerouslySetInnerHTML={{ __html: renderInline(line.slice(2)) }} />
          )
        if (/^\d+\.\s/.test(line))
          return (
            <div key={idx} className="ml-4 list-item" dangerouslySetInnerHTML={{ __html: renderInline(line.replace(/^\d+\.\s/, "")) }} />
          )
        return <div key={idx} dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
      })}
    </div>
  )

  const inline = (
    <div className="border border-border rounded-md overflow-hidden">
      {header}
      <div className="max-h-56 overflow-hidden">
        {props.type === "code" && codeBlock}
        {props.type === "markdown" && markdownPreview}
      </div>
    </div>
  )

  return (
    <div className="my-3">
      {inline}
      <Sheet open={expanded} onOpenChange={setExpanded}>
        <SheetContent side="bottom" className="h-[85vh] p-0">
          <SheetHeader className="px-4 py-3 border-b border-border">
            <SheetTitle className="text-sm">
              {props.title || (props.type === "code" ? props.language || "code" : "artifact")}
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100%-3rem)] overflow-auto">
            {props.type === "code" && (
              <pre className="bg-background text-foreground p-4 text-sm">
                <code>
                  {props.content}
                </code>
              </pre>
            )}
            {props.type === "markdown" && (
              <div className="bg-background text-foreground p-4 text-sm space-y-2">
                {markdownPreview}
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}


