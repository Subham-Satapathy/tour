import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminNav } from '@/components/AdminNav';
import { VehicleForm } from '@/components/VehicleForm';
import { db } from '@/server/db';
import { getAllCities } from '@/server/db/queries/cities';
import Link from 'next/link';

export default async function NewVehiclePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const cities = await getAllCities(db);

  return (
    <>
      <AdminNav />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Link
              href="/admin/vehicles"
              className="text-blue-600 hover:underline flex items-center gap-2"
            >
              ← Back to Vehicles
            </Link>
          </div>

          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Vehicle</h1>

            <div className="bg-white rounded-lg shadow p-6">
              <VehicleForm cities={cities} mode="create" />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
