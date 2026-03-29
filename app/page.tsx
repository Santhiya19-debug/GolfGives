import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CharitySection from '@/components/home/CharitySection';
import DrawSection from '@/components/home/DrawSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <CharitySection />
        <DrawSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}