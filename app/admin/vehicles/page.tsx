import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminNav } from '@/components/AdminNav';
import { db } from '@/server/db';
import { getAllVehicles } from '@/server/db/queries/vehicles';
import { getAllCities } from '@/server/db/queries/cities';
import { type City, type Vehicle } from '@/server/db/schema';
import Link from 'next/link';

export default async function AdminVehiclesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const [vehicles, cities] = await Promise.all([
    getAllVehicles(db),
    getAllCities(db),
  ]);

  // Create a map of city IDs to names
  const cityMap = new Map(cities.map((c: City) => [c.id, c.name]));

  return (
    <>
      <AdminNav />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Vehicles</h1>
            <Link
              href="/admin/vehicles/new"
              className="bg-black text-white px-6 py-3 rounded-md font-semibold hover:scale-105 hover:shadow-xl transition cursor-pointer"
            >
              + Add New Vehicle
            </Link>
          </div>

          {vehicles.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500 mb-4">No vehicles found</p>
              <Link
                href="/admin/vehicles/new"
                className="inline-block bg-black text-white px-6 py-3 rounded-md font-semibold hover:scale-105 hover:shadow-xl transition cursor-pointer"
              >
                Add Your First Vehicle
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Type</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Route</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Rate/Hour</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Rate/Day</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((vehicle: Vehicle) => (
                      <tr key={vehicle.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{vehicle.name}</td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">
                            {vehicle.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {(cityMap.get(vehicle.fromCityId) as string) || 'Unknown'} → {(cityMap.get(vehicle.toCityId) as string) || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-gray-900">₹{vehicle.ratePerHour}</td>
                        <td className="py-3 px-4 text-gray-900">₹{vehicle.ratePerDay}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              vehicle.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {vehicle.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <Link
                              href={`/admin/vehicles/${vehicle.id}`}
                              className="text-blue-600 hover:underline text-sm font-medium"
                            >
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
