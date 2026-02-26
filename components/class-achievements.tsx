import { Trophy, ShieldCheck } from "lucide-react"

export function ClassAchievements() {
  return (
    <div 
      className="
        overflow-hidden rounded-xl border border-white/10 
        bg-gray-900/80 shadow-xl backdrop-blur-sm
        transition-all duration-500 ease-in-out
        hover:border-white/30 
        hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] 
        hover:scale-[1.02]
        group
      "
    >
      <div className="border-b border-white/10 px-6 py-4 transition-colors group-hover:bg-white/5">
        <h3 className="text-lg font-bold text-white">{"Class Achievements"}</h3>
      </div>

      <div className="flex flex-col gap-5 px-6 py-5">
        <div className="flex items-start gap-3 transition-transform duration-300 group-hover:translate-x-1">
          <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
          <div>
            <p className="font-semibold text-white">{"President's / Dean's Lister Ready"}</p>
            <p className="text-sm text-gray-400">
              {"High-resolution PDF generation enabled."}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 transition-transform duration-300 group-hover:translate-x-1">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]" />
          <div>
            <p className="font-semibold text-white">{"Verified Records"}</p>
            <p className="text-sm text-gray-400">
              {"Cross-referenced with BSCS 1-1N masterlist."}
            </p>
          </div>
        </div>

        <div className="mt-2 rounded-lg border border-green-800/50 bg-green-950/60 px-4 py-2.5 transition-all duration-300 group-hover:border-green-500/50 group-hover:bg-green-900/60">
          <span className="font-mono text-xs font-semibold uppercase tracking-wider text-green-400">
            {"Status: All Systems Operational"}
          </span>
        </div>
      </div>
    </div>
  )
}