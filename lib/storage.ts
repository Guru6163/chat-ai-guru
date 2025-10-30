// Storage utility functions with error handling and validation

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

const STORAGE_KEYS = {
  SESSIONS: "chat-sessions",
  MESSAGES_PREFIX: "chat-messages-",
};

export const storage = {
  // Sessions management
  getSessions(): ChatSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading sessions:", error);
      return [];
    }
  },

  saveSessions(sessions: ChatSession[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    } catch (error) {
      console.error("Error saving sessions:", error);
    }
  },

  createSession(title: string): ChatSession {
    return {
      id: Date.now().toString(),
      title,
      timestamp: Date.now(),
      messages: [],
    };
  },

  // Messages management
  getMessages(sessionId: string): ChatMessage[] {
    try {
      const data = localStorage.getItem(
        `${STORAGE_KEYS.MESSAGES_PREFIX}${sessionId}`
      );
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error reading messages:", error);
      return [];
    }
  },

  saveMessages(sessionId: string, messages: ChatMessage[]): void {
    try {
      localStorage.setItem(
        `${STORAGE_KEYS.MESSAGES_PREFIX}${sessionId}`,
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error("Error saving messages:", error);
    }
  },

  // Session operations
  deleteSession(sessionId: string): void {
    try {
      const sessions = this.getSessions();
      const updated = sessions.filter((s) => s.id !== sessionId);
      this.saveSessions(updated);
      localStorage.removeItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${sessionId}`);
    } catch (error) {
      console.error("Error deleting session:", error);
    }
  },

  updateSessionTitle(sessionId: string, title: string): void {
    try {
      const sessions = this.getSessions();
      const session = sessions.find((s) => s.id === sessionId);
      if (session) {
        session.title = title;
        this.saveSessions(sessions);
      }
    } catch (error) {
      console.error("Error updating session title:", error);
    }
  },

  clearAllHistory(): void {
    try {
      const sessions = this.getSessions();
      sessions.forEach((session) => {
        localStorage.removeItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${session.id}`);
      });
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  },

  // Export/Import
  exportHistory(): string {
    try {
      const sessions = this.getSessions();
      const fullData = sessions.map((session) => ({
        ...session,
        messages: this.getMessages(session.id),
      }));
      return JSON.stringify(fullData, null, 2);
    } catch (error) {
      console.error("Error exporting history:", error);
      return "";
    }
  },

  importHistory(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (!Array.isArray(data)) return false;

      data.forEach((session: ChatSession) => {
        if (session.id && session.title && Array.isArray(session.messages)) {
          this.saveMessages(session.id, session.messages);
        }
      });

      const sessions = data.map((session: ChatSession) => {
        const { id, title, timestamp } = session;
        return { id, title, timestamp };
      });
      this.saveSessions(sessions as ChatSession[]);
      return true;
    } catch (error) {
      console.error("Error importing history:", error);
      return false;
    }
  },
};
