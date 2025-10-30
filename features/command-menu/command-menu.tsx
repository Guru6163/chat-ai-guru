"use client"

import { useCallback, useEffect, useState } from "react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Plus, Trash2, Settings } from "lucide-react"

interface CommandMenuProps {
  onNewChat: () => void
  onClearHistory: () => void
  onOpenSettings: () => void
}

export function CommandMenu({ onNewChat, onClearHistory, onOpenSettings }: CommandMenuProps) {
  const [open, setOpen] = useState(false)

  const handleToggle = useCallback(() => setOpen((v) => !v), [])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleToggle()
      }
    }
    window.addEventListener("keydown", down)
    return () => window.removeEventListener("keydown", down)
  }, [handleToggle])

  const runAndClose = (fn: () => void) => {
    fn()
    setOpen(false)
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="General">
          <CommandItem onSelect={() => runAndClose(onNewChat)}>
            <Plus className="mr-2" />
            <span>Start a New Chat</span>
            <CommandShortcut>⌘K → Enter</CommandShortcut>
          </CommandItem>
          <CommandItem onSelect={() => runAndClose(onClearHistory)}>
            <Trash2 className="mr-2" />
            <span>Clear History</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Preferences">
          <CommandItem onSelect={() => runAndClose(onOpenSettings)}>
            <Settings className="mr-2" />
            <span>Open Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}


