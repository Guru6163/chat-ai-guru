"use client"

import type React from "react"
import { Artifact } from "./artifact"

interface MarkdownProps {
  content: string
}

export function Markdown({ content }: MarkdownProps) {
  const parseMarkdown = (text: string) => {
    const elements: React.ReactNode[] = []
    const lines = text.split("\n")
    let i = 0

    const escapeHtml = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#39;")

    const renderInline = (s: string) => {
      let html = escapeHtml(s)
      html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      html = html.replace(/(?:\*)([^\*]+)(?:\*)/g, "<em>$1</em>")
      html = html.replace(/_(.+?)_/g, "<em>$1</em>")
      html = html.replace(/`([^`]+)`/g, "<code>$1</code>")
      return html
    }

    while (i < lines.length) {
      const line = lines[i]
      if (line.startsWith("```") ) {
        const fence = line.trim()
        const language = fence.replace(/```+/, "").trim() || undefined
        i++
        const codeLines: string[] = []
        while (i < lines.length && !lines[i].startsWith("```") ) {
          codeLines.push(lines[i])
          i++
        }
        if (i < lines.length && lines[i].startsWith("```") ) {
          i++
        }
        if (language === "md" || language === "markdown") {
          elements.push(
            <Artifact key={`md-${i}`} type="markdown" content={codeLines.join("\n")} />
          )
        } else {
          elements.push(
            <Artifact key={`code-${i}`} type="code" language={language} content={codeLines.join("\n")} />
          )
        }
        continue
      }

      if (line.startsWith("# ")) {
        elements.push(
          <h1 key={i} className="text-2xl font-bold mt-4 mb-2">
            {line.slice(2)}
          </h1>
        )
      } else if (line.startsWith("## ")) {
        elements.push(
          <h2 key={i} className="text-xl font-bold mt-3 mb-2">
            {line.slice(3)}
          </h2>
        )
      } else if (line.startsWith("- ")) {
        elements.push(
          <li key={i} className="ml-4" dangerouslySetInnerHTML={{ __html: renderInline(line.slice(2)) }}>
          
          </li>
        )
      } else if (/^\d+\.\s/.test(line)) {
        const textAfter = line.replace(/^\d+\.\s/, "")
        elements.push(
          <li key={i} className="ml-4" dangerouslySetInnerHTML={{ __html: renderInline(textAfter) }}>
          
          </li>
        )
      } else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <p key={i} className="font-bold">
            {line.slice(2, -2)}
          </p>
        )
      } else if (line.trim()) {
        elements.push(
          <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: renderInline(line) }} />
        )
      }

      i++
    }

    return elements
  }

  return <div className="space-y-2">{parseMarkdown(content)}</div>
}
