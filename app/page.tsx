import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CertificateForm } from "@/components/certificate-form"

const ACADEMIC_YEAR = "2025–2026";
const CLASS_SECTION = "BSCS 1-1N";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col font-sans selection:bg-primary/30">
      {/* Dynamic Background with Overlay */}
      <div 
        className="fixed inset-0 -z-10 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
        style={{ backgroundImage: "url('/web_background.png')" }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-black/20 via-transparent to-black/40 backdrop-blur-[2px]" aria-hidden="true" />

      <Header />

      <main className="flex flex-1 flex-col items-center justify-center py-12">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-12 px-6">
          
          {/* Header Section */}
          <div className="text-center animate-in fade-in slide-in-from-top-4 duration-1000">
            <HeroSection />
            <p className="mt-2 text-sm text-white/70 font-light tracking-widest uppercase">
              Official Digital Portal
            </p>
          </div>

          {/* Main Interaction Area: Grid Layout */}
          <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Left Side: The Form */}
            <section className="flex flex-col gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur-xl border border-white/20 shadow-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
              <h2 className="text-lg font-semibold text-white">Find Your Certificate</h2>
              <p className="text-sm text-white/60 mb-2">Enter your name or student ID as it appears in the class record.</p>
              <CertificateForm />
            </section>

            {/* Right Side: Feature Highlight or "Recent" Activity */}
            <section className="hidden md:flex flex-col gap-6 rounded-2xl bg-black/20 p-8 backdrop-blur-md border border-white/10 text-white animate-in fade-in slide-in-from-right-8 duration-1000">
              <div className="space-y-4">
                <h3 className="text-xl font-bold border-b border-white/10 pb-2">Class Achievements</h3>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">🏆</div>
                  <div>
                    <p className="font-medium">Dean's Lister Ready</p>
                    <p className="text-xs text-white/50">High-resolution PDF generation enabled.</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">🛡️</div>
                  <div>
                    <p className="font-medium">Verified Records</p>
                    <p className="text-xs text-white/50">Cross-referenced with BSCS 1-1N masterlist.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/10">
                 <div className="rounded-lg bg-primary/20 p-4 text-center">
                    <p className="text-xs font-mono text-primary-foreground">STATUS: ALL SYSTEMS OPERATIONAL</p>
                 </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <footer className="w-full border-t border-white/10 bg-black/40 py-6 text-center backdrop-blur-md">
        <p className="text-xs font-medium tracking-widest text-white/40 uppercase">
          {CLASS_SECTION} • {ACADEMIC_YEAR} • DEVELOPED FOR THE CLASS
        </p>
      </footer>
    </div>
  )
}