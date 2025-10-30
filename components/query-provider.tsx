"use client"

import type React from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

let queryClientSingleton: QueryClient | null = null

function getQueryClient(): QueryClient {
  if (!queryClientSingleton) {
    queryClientSingleton = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          gcTime: 5 * 60 * 1000,
          refetchOnWindowFocus: false,
        },
      },
    })
  }
  return queryClientSingleton
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const client = getQueryClient()
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}


