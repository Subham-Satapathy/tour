import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminNav } from '@/components/AdminNav';
import { VehicleForm } from '@/components/VehicleForm';
import { db } from '@/server/db';
import { getVehicleById } from '@/server/db/queries/vehicles';
import { getAllCities } from '@/server/db/queries/cities';
import Link from 'next/link';

interface EditVehiclePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVehiclePage({ params }: EditVehiclePageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const { id } = await params;
  const vehicleId = parseInt(id);

  if (isNaN(vehicleId)) {
    redirect('/admin/vehicles');
  }

  const [vehicle, cities] = await Promise.all([
    getVehicleById(db, vehicleId),
    getAllCities(db),
  ]);

  if (!vehicle) {
    redirect('/admin/vehicles');
  }

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
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Vehicle</h1>

            <div className="bg-white rounded-lg shadow p-6">
              <VehicleForm
                cities={cities}
                initialData={{
                  name: vehicle.name,
                  type: vehicle.type,
                  brand: vehicle.brand || undefined,
                  model: vehicle.model || undefined,
                  year: vehicle.year || undefined,
                  color: vehicle.color || undefined,
                  licensePlate: vehicle.licensePlate || undefined,
                  seatingCapacity: vehicle.seatingCapacity || undefined,
                  mileage: vehicle.mileage || undefined,
                  fuelType: vehicle.fuelType || undefined,
                  transmissionType: vehicle.transmissionType || undefined,
                  features: vehicle.features || undefined,
                  fromCityId: vehicle.fromCityId,
                  toCityId: vehicle.toCityId,
                  ratePerHour: vehicle.ratePerHour,
                  ratePerDay: vehicle.ratePerDay,
                  extraKmCharge: vehicle.extraKmCharge || undefined,
                  includedKmPerDay: vehicle.includedKmPerDay || undefined,
                  securityDeposit: vehicle.securityDeposit || undefined,
                  description: vehicle.description || undefined,
                  imageUrl: vehicle.imageUrl || undefined,
                  galleryImages: vehicle.galleryImages || undefined,
                  isActive: vehicle.isActive,
                  isFeatured: vehicle.isFeatured,
                  id: vehicle.id
                }}
                mode="edit"
              />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
