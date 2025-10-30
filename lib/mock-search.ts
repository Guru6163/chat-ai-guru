export interface Suggestion {
  id: string
  text: string
}

export interface Person {
  id: string
  name: string
}

const WORDS = [
  "analyze logs",
  "generate report",
  "summarize article",
  "translate text",
  "draft email",
  "optimize query",
  "debug error",
  "create outline",
  "explain code",
  "write tests",
  "refactor module",
  "design api",
  "compare options",
  "brainstorm ideas",
]

function randomId() {
  return Math.random().toString(36).slice(2, 10)
}

function latency(min = 120, max = 380) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function searchSuggestions(query: string): Promise<Suggestion[]> {
  const q = query.trim().toLowerCase()
  if (!q) return []
  await new Promise((r) => setTimeout(r, latency()))
  return WORDS.filter((w) => w.includes(q))
    .slice(0, 8)
    .map((text) => ({ id: randomId(), text }))
}

// Pretend we have 1M names; we generate a deterministic-ish sample locally
const FIRST = [
  "Alex",
  "Jordan",
  "Taylor",
  "Morgan",
  "Casey",
  "Riley",
  "Jamie",
  "Cameron",
  "Avery",
  "Reese",
]
const LAST = [
  "Smith",
  "Johnson",
  "Lee",
  "Patel",
  "Garcia",
  "Khan",
  "Nguyen",
  "Brown",
  "Davis",
  "Martinez",
]

export async function searchPeople(query: string): Promise<Person[]> {
  const q = query.replace(/^@+/, "").trim().toLowerCase()
  await new Promise((r) => setTimeout(r, latency(100, 260)))
  const pool: string[] = []
  for (let i = 0; i < FIRST.length; i++) {
    for (let j = 0; j < LAST.length; j++) {
      pool.push(`${FIRST[i]} ${LAST[j]}`)
    }
  }
  const source = !q ? pool : pool.filter((n) => n.toLowerCase().includes(q))
  return source.slice(0, 10).map((name) => ({ id: randomId(), name }))
}


