// Curated prompt library for autocomplete suggestions

export interface Prompt {
  id: string
  title: string
  description: string
  category: string
  content: string
}

export const PROMPT_CATEGORIES = [
  "Writing",
  "Analysis",
  "Coding",
  "Learning",
  "Brainstorming",
  "Productivity",
  "Creative",
  "Technical",
]

export const PROMPT_LIBRARY: Prompt[] = [
  // Writing
  {
    id: "write-email",
    title: "Write Professional Email",
    description: "Draft a professional email",
    category: "Writing",
    content: "Help me write a professional email to ",
  },
  {
    id: "write-summary",
    title: "Summarize Text",
    description: "Create a concise summary",
    category: "Writing",
    content: "Please summarize the following text in 3-4 sentences: ",
  },
  {
    id: "write-outline",
    title: "Create Outline",
    description: "Generate a structured outline",
    category: "Writing",
    content: "Create a detailed outline for an article about ",
  },
  {
    id: "write-blog",
    title: "Write Blog Post",
    description: "Draft a blog post",
    category: "Writing",
    content: "Write a blog post about ",
  },

  // Analysis
  {
    id: "analyze-data",
    title: "Analyze Data",
    description: "Interpret and analyze data",
    category: "Analysis",
    content: "Analyze this data and provide insights: ",
  },
  {
    id: "compare-options",
    title: "Compare Options",
    description: "Compare different choices",
    category: "Analysis",
    content: "Compare the pros and cons of ",
  },
  {
    id: "explain-concept",
    title: "Explain Concept",
    description: "Break down a complex idea",
    category: "Analysis",
    content: "Explain the concept of ",
  },

  // Coding
  {
    id: "code-review",
    title: "Code Review",
    description: "Review and improve code",
    category: "Coding",
    content: "Review this code and suggest improvements: ",
  },
  {
    id: "debug-code",
    title: "Debug Code",
    description: "Help fix code issues",
    category: "Coding",
    content: "Help me debug this code: ",
  },
  {
    id: "explain-code",
    title: "Explain Code",
    description: "Explain what code does",
    category: "Coding",
    content: "Explain what this code does: ",
  },
  {
    id: "generate-code",
    title: "Generate Code",
    description: "Write code for a task",
    category: "Coding",
    content: "Write code to ",
  },

  // Learning
  {
    id: "learn-topic",
    title: "Learn Topic",
    description: "Teach me about a topic",
    category: "Learning",
    content: "Teach me about ",
  },
  {
    id: "study-guide",
    title: "Study Guide",
    description: "Create a study guide",
    category: "Learning",
    content: "Create a study guide for ",
  },
  {
    id: "practice-questions",
    title: "Practice Questions",
    description: "Generate practice questions",
    category: "Learning",
    content: "Generate 5 practice questions about ",
  },

  // Brainstorming
  {
    id: "brainstorm-ideas",
    title: "Brainstorm Ideas",
    description: "Generate creative ideas",
    category: "Brainstorming",
    content: "Brainstorm 10 creative ideas for ",
  },
  {
    id: "problem-solving",
    title: "Problem Solving",
    description: "Find solutions to problems",
    category: "Brainstorming",
    content: "Help me solve this problem: ",
  },

  // Productivity
  {
    id: "plan-project",
    title: "Plan Project",
    description: "Create a project plan",
    category: "Productivity",
    content: "Help me plan a project for ",
  },
  {
    id: "time-management",
    title: "Time Management",
    description: "Get productivity tips",
    category: "Productivity",
    content: "Give me tips for managing time when ",
  },

  // Creative
  {
    id: "write-story",
    title: "Write Story",
    description: "Create a creative story",
    category: "Creative",
    content: "Write a short story about ",
  },
  {
    id: "generate-ideas",
    title: "Generate Ideas",
    description: "Spark creative inspiration",
    category: "Creative",
    content: "Generate creative ideas for ",
  },

  // Technical
  {
    id: "tech-help",
    title: "Technical Help",
    description: "Get technical assistance",
    category: "Technical",
    content: "Help me with this technical issue: ",
  },
  {
    id: "setup-guide",
    title: "Setup Guide",
    description: "Step-by-step setup instructions",
    category: "Technical",
    content: "Give me step-by-step instructions to set up ",
  },
]

export function searchPrompts(query: string): Prompt[] {
  if (!query.trim()) return []

  const lowerQuery = query.toLowerCase()
  return PROMPT_LIBRARY.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(lowerQuery) ||
      prompt.description.toLowerCase().includes(lowerQuery) ||
      prompt.category.toLowerCase().includes(lowerQuery),
  )
}

export function getPromptsByCategory(category: string): Prompt[] {
  return PROMPT_LIBRARY.filter((prompt) => prompt.category === category)
}
