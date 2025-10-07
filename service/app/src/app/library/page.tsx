"use client"

import { useState } from "react"

import LibraryNavigation from "@/widgets/LibraryNavigation"

export default function LibraryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  return (
    <main className="min-h-screen bg-background-primary">
      <LibraryNavigation
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
      />
      <div className="flex w-full flex-col items-center gap-[45px] pt-[40px]"></div>
    </main>
  )
}
