import { Navbar } from '@/components/Navbar';
import { SearchForm } from '@/components/SearchForm';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { PopularCars } from '@/components/PopularCars';
import { HowItWorks } from '@/components/HowItWorks';
import { Testimonials } from '@/components/Testimonials';
import { Stats } from '@/components/Stats';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';
import { getAllCities } from '@/server/db/queries/cities';
import { db } from '@/server/db';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const cities = await getAllCities(db);

  return (
    <>
      <Navbar />
      <HeroSection cities={cities} />
      <FeaturesSection />
      <PopularCars />
      <HowItWorks />
      <Testimonials />
      <Stats />
      <FAQ />
      <Newsletter />
      <Footer />
    </>
  );
}
