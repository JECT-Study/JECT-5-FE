"use client"

import { Question } from "@shared/design/src/components/question"

export function QuestionList() {
  return (
    <div className="flex w-[400px] flex-col items-center justify-end bg-gray-50 p-[25px_25px_0_25px]">
      <div className="flex w-[350px] flex-col items-start gap-6">
        <Question
          title="질문가나다라마바사가나다라마바사가나다라마바사"
          state="selected"
          onDelete={() => console.log("Delete selected question")}
          onMoveUp={() => console.log("Move up")}
          onMoveDown={() => console.log("Move down")}
        />

        {Array.from({ length: 9 }, (_, index) => (
          <Question
            key={index}
            title=""
            state="error"
            onDelete={() => console.log(`Delete error question ${index}`)}
            onMoveUp={() => console.log(`Move up ${index}`)}
            onMoveDown={() => console.log(`Move down ${index}`)}
          />
        ))}
      </div>
    </div>
  )
}
