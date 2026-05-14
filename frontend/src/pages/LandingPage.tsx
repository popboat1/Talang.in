import './landing/landing.css'

import LandingNavbar from './landing/sections/LandingNavbar'
import HeroSection from './landing/sections/HeroSection'
import AudienceSection from './landing/sections/AudienceSection'
import WhyChooseSection from './landing/sections/WhyChooseSection'
import FeaturesSection from './landing/sections/FeaturesSection'
import AiInsightSection from './landing/sections/AiInsightSection'
import HowItWorksSection from './landing/sections/HowItWorksSection'
import ProblemsSection from './landing/sections/ProblemsSection'
import DashboardPreviewSection from './landing/sections/DashboardPreviewSection'
import CtaSection from './landing/sections/CtaSection'
import LandingFooter from './landing/sections/LandingFooter'

export default function LandingPage() {
  return (
    <div className="talang-landing min-h-screen bg-[#faf7fd] text-[#26232c]">
      <LandingNavbar />
      <main>
        <HeroSection />
        <AudienceSection />
        <WhyChooseSection />
        <FeaturesSection />
        <AiInsightSection />
        <HowItWorksSection />
        <ProblemsSection />
        <DashboardPreviewSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </div>
  )
}
