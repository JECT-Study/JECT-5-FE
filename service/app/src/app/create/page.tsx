"use client"

import { AuthGuard } from "@/entities/auth/ui/authGuard"

import { CreateGameNavigation } from "./components/createGameNavigation"
import { FileUploadArea } from "./components/fileUploadArea"
import { QuestionInputForm } from "./components/questionInputForm"
import { QuestionList } from "./components/questionList"

export default function CreateGamePage() {
  return (
    <AuthGuard>
      <div className="bg-background-primary">
        <CreateGameNavigation />
        <div className="flex h-screen pt-[90px]">
          <QuestionList />
          <main className="flex flex-1 justify-center gap-44">
            <FileUploadArea />
            <QuestionInputForm />
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
