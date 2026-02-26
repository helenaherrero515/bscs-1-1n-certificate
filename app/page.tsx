import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { CertificateForm } from "@/components/certificate-form"
import { ClassAchievements } from "@/components/class-achievements"

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
            <section 
              className="
                flex flex-col gap-4 rounded-2xl bg-white/10 p-6 backdrop-blur-xl 
                border border-white/20 shadow-2xl 
                animate-in fade-in slide-in-from-left-8 duration-1000
                transition-all duration-500 ease-in-out
                hover:border-white/40 
                hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]
                hover:bg-white/15
              "
            >
              <h2 className="text-lg font-semibold text-white">Find Your Certificate</h2>
              <p className="text-sm text-white/60 mb-2">Enter your name or student ID as it appears in the class record.</p>
              <CertificateForm />
            </section>

            {/* Right Side: Feature Highlight (Now visible on mobile) */}
            <section 
              className="
                block animate-in fade-in slide-in-from-right-8 duration-1000
                transition-all duration-500 ease-in-out
                hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]
                rounded-xl
              "
            >
              <ClassAchievements />
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