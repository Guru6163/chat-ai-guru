// Keyboard shortcuts configuration

export interface KeyboardShortcut {
  name: string
  description: string
  keys: string
  action: string
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    name: "Command Menu",
    description: "Open the command menu",
    keys: "⌘K / Ctrl+K",
    action: "command-menu",
  },
  {
    name: "New Chat",
    description: "Start a new conversation",
    keys: "⌘N / Ctrl+N",
    action: "new-chat",
  },
  {
    name: "Focus Input",
    description: "Focus on the chat input",
    keys: "⌘/ / Ctrl+/",
    action: "focus-input",
  },
  {
    name: "Toggle Sidebar",
    description: "Show or hide the sidebar",
    keys: "⌘B / Ctrl+B",
    action: "toggle-sidebar",
  },
  {
    name: "Send Message",
    description: "Send your message",
    keys: "Enter",
    action: "send-message",
  },
  {
    name: "New Line",
    description: "Add a new line in message",
    keys: "Shift+Enter",
    action: "new-line",
  },
]
