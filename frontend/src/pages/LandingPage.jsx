import { landingStyles } from '../components/landing/constants'
import Navbar from '../components/landing/Navbar'
import HeroSection from '../components/landing/HeroSection'
import ProblemSection from '../components/landing/ProblemSection'
import FiturSection from '../components/landing/FiturSection'
import InovasiSection from '../components/landing/InovasiSection'
import CaraKerjaSection from '../components/landing/CaraKerjaSection'
import UseCaseSection from '../components/landing/UseCaseSection'
import CTASection from '../components/landing/CTASection'
import Footer from '../components/landing/Footer'

const goToSection = (sectionId) => {
  document.querySelector(sectionId)?.scrollIntoView({ behavior: 'smooth' })
}

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#F3F7FD] text-[#081827]">
      <style>{landingStyles}</style>

      {/* Grid background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,63,115,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(18,63,115,.055)_1px,transparent_1px)] bg-[size:46px_46px]" />
      </div>

      <Navbar onSectionClick={goToSection} />

      <main className="relative z-10 pt-20">
        <HeroSection onSectionClick={goToSection} />
        <ProblemSection />
        <FiturSection />
        <InovasiSection />
        <CaraKerjaSection />
        <UseCaseSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  )
}