import { Navbar } from '@/components/Navbar';
import { SearchForm } from '@/components/SearchForm';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesSection } from '@/components/FeaturesSection';
import { PopularDestinations } from '@/components/PopularDestinations';
import { HowItWorks } from '@/components/HowItWorks';
import { Testimonials } from '@/components/Testimonials';
import { Stats } from '@/components/Stats';
import { FAQ } from '@/components/FAQ';
import { Newsletter } from '@/components/Newsletter';
import { Footer } from '@/components/Footer';
import { getAllCities } from '@/server/db/queries/cities';
import { db } from '@/server/db';

export default async function HomePage() {
  const cities = await getAllCities(db);

  return (
    <>
      <Navbar />
      <HeroSection cities={cities} />
      <FeaturesSection />
      <PopularDestinations cities={cities} />
      <HowItWorks />
      <Testimonials />
      <Stats />
      <FAQ />
      <Newsletter />
      <Footer />
    </>
  );
}
