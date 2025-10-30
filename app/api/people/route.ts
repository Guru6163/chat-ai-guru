import { NextResponse } from "next/server"
import { searchPeople } from "@/lib/mock-search"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get("q") || "").trim()
  const results = q ? await searchPeople(q) : []
  return NextResponse.json({ results })
}


