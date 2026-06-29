import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import FeaturesShowcase from '@/components/landing/FeaturesShowcase';
import LiveMapPreview from '@/components/landing/LiveMapPreview';
import StatsSection from '@/components/landing/StatsSection';
import RoleCards from '@/components/landing/RoleCards';
import Footer from '@/components/landing/Footer';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <FeaturesShowcase />
        <LiveMapPreview />
        <StatsSection />
        <RoleCards />
      </main>
      <Footer />
    </div>
  );
}
