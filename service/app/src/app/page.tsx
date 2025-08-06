import { HomeNavigation } from "../widgets/HomeNavigation"

export default function Home() {
  const isLoggedIn = false

  return (
    <main className="min-h-screen bg-background-primary">
      <HomeNavigation 
        isLoggedIn={isLoggedIn}
      />
    </main>
  )
}
