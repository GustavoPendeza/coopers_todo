import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import GoodThings from '@/components/GoodThings';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import StaticTodoSection from '@/components/StaticTodoSection';

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <StaticTodoSection />
        <GoodThings />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
