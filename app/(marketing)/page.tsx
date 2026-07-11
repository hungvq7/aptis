import { HeroSection } from "@/components/marketing/hero-section"
import { SkillsOverviewSection } from "@/components/marketing/skills-overview-section"
import { HowItWorksSection } from "@/components/marketing/how-it-works-section"
import { TestimonialsSection } from "@/components/marketing/testimonials-section"
import { CtaSection } from "@/components/marketing/cta-section"

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SkillsOverviewSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </>
  )
}
