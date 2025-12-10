import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { VehicleFleet } from '@/components/VehicleFleet';
import { db } from '@/server/db';
import { getAllCities } from '@/server/db/queries/cities';

export const dynamic = 'force-dynamic';

export default async function VehiclesPage() {
  const cities = await getAllCities(db);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white dark:bg-black py-12 pt-24 sm:pt-28">
        <VehicleFleet cities={cities} />
      </main>
      <Footer />
    </>
  );
}
