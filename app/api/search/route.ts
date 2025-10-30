import { NextResponse } from "next/server"
import { searchSuggestions } from "@/lib/mock-search"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get("q") || "").trim()
  const results = q ? await searchSuggestions(q) : []
  return NextResponse.json({ results })
}


