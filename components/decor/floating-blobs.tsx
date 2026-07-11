/** Decorative animated blob circles for gradient panels. Parent must be `relative overflow-hidden`. */
export function FloatingBlobs() {
  return (
    <>
      <span className="pointer-events-none absolute -top-6 -right-8 size-28 rounded-full bg-white/15 [animation:float-slow_7s_ease-in-out_infinite]" />
      <span className="pointer-events-none absolute -bottom-10 -left-8 size-32 rounded-full bg-white/10 [animation:float-slower_9s_ease-in-out_infinite]" />
      <span className="pointer-events-none absolute top-1/4 left-1/4 size-8 rounded-full bg-white/20 [animation:float-slow_5s_ease-in-out_infinite]" />
    </>
  )
}
