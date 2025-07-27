import { redirect } from "next/navigation"

export default function GamePage({ params }: { params: { gameId: string } }) {
  redirect(`/game/${params.gameId}/setup`)
}
