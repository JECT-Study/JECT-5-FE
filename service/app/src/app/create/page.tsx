"use client"

import { Suspense } from "react"

import { CreateGameNavigation } from "./components/createGameNavigation"
import { FileUploadArea } from "./components/fileUploadArea"
import { QuestionInputForm } from "./components/questionInputForm"
import { QuestionList } from "./components/questionList"
import CreateGamePageSkeleton from "./loading"

function CreateGameContent() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-background-primary">
      <CreateGameNavigation />
      <div className="flex flex-1 flex-row overflow-hidden">
        <div className="flex">
          <QuestionList />
        </div>
        <div className="flex w-full justify-center gap-[94px]">
          <FileUploadArea />
          <QuestionInputForm />
        </div>
      </div>
    </main>
  )
}

export default function CreateGamePage() {
  return (
    <Suspense fallback={<CreateGamePageSkeleton />}>
      <CreateGameContent />
    </Suspense>
  )
}
