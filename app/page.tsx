import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CertificateForm } from "@/components/certificate-form"

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/web_background.png')" }}
    >
      <Header />

      <main className="flex flex-1 items-center justify-center">
        <div className="mx-auto flex w-full max-w-md flex-col gap-8 px-6 py-12">
          <HeroSection />
          <CertificateForm />
        </div>
      </main>

      <footer className="bg-card/50 py-4 text-center text-xs text-card-foreground/50 backdrop-blur-sm">
        <p>{"BSCS 1-1N \u00b7 Academic Year 2025\u20132026"}</p>
      </footer>
    </div>
  )
}
