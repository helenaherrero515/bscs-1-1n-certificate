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
          className="gap-2 border-card-foreground/20 bg-card/90 text-card-foreground transition-all duration-300 
                     hover:border-[#1877F2]/50 hover:bg-[#1877F2]/90 hover:text-[#FFFFFF] 
                     hover:shadow-[0_0_15px_rgba(24,119,242,0.4)]"
        >
          <a
            href="https://www.facebook.com/profile.php?id=61578850288922"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook className="h-4 w-4 fill-current" />
            <span className="hidden sm:inline">Facebook Page</span>
          </a>
        </Button>
      </div>
    </header>
  )
}