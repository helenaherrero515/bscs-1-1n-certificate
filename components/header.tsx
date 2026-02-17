import { Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-card-foreground/10 bg-card/30 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <span className="text-sm font-bold tracking-tight text-card-foreground">
          CTRL+ 1-1N
        </span>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="gap-2 border-card-foreground/20 bg-card/60 text-card-foreground hover:bg-card hover:text-card-foreground"
        >
          <a
            href="https://www.facebook.com/profile.php?id=61578850288922"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="h-4 w-4" />
            <span className="hidden sm:inline">Facebook Page</span>
          </a>
        </Button>
      </div>
    </header>
  )
}
