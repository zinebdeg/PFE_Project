import { createFileRoute } from '@tanstack/react-router';
import HeroSection from '../components/home/hero-section';
import StatsSection from '../components/home/stats-section';
import ServicesSection from '../components/home/services-section';
import PopularRoutes from '../components/home/popular-routes';

export const Route = createFileRoute('/')({
  component: Home,
});

function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <PopularRoutes />
    </main>
  );
}
