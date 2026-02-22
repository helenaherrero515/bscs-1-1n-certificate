export function HeroSection() {
  return (
    <section className="text-center">
      {/* Increased text size to 6xl and added a custom shadow */}
      <h2 
        className="text-balance font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
        style={{
          textShadow: '0 4px 8px rgb(1, 77, 85), 0 2px 4px rgb(66, 66, 66)',
        }}
      >
        {"CONGRATSSS, Klasmeyt!!"}
      </h2>
      <p 
        className="mx-auto mt-4 max-w-md text-pretty text-lg font-medium leading-relaxed text-white/90 sm:text-xl"
        style={{
          textShadow: '0 2px 8px rgb(0, 0, 0)',
        }}
      >
        {"Get your certificate here."}
      </p>
    </section>
  )
}