export function HeroSection() {
  return (
    <section className="text-center">
      {/* Increased text size to 6xl and added a custom shadow */}
      <h2 
        className="text-balance font-display text-4xl font-extrabold tracking-tight text-navy-gray sm:text-5xl lg:text-6xl"
        style={{
          textShadow: '0 4px 15px rgba(51, 51, 51, 0.5), 0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        {"CONGRATSSS, Klasmeyt!!"}
      </h2>
      <p 
        className="mx-auto mt-4 max-w-md text-pretty text-lg font-medium leading-relaxed text-white/90 sm:text-xl"
        style={{
          textShadow: '0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {"Get your certificate here."}
      </p>
    </section>
  )
}