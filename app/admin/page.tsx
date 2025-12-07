import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminNav } from '@/components/AdminNav';
import { db } from '@/server/db';
import { getAllVehicles } from '@/server/db/queries/vehicles';
import { getAllBookings } from '@/server/db/queries/bookings';
import Link from 'next/link';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const vehicles = await getAllVehicles(db);
  const bookings = await getAllBookings(db);

  const activeVehicles = vehicles.filter((v: any) => v.isActive);
  const paidBookings = bookings.filter((b: any) => b.status === 'PAID');
  const recentBookings = bookings
    .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  return (
    <>
      <AdminNav />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Vehicles</p>
                  <p className="text-3xl font-bold text-gray-900">{vehicles.length}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {activeVehicles.length} active
                  </p>
                </div>
                <div className="bg-blue-100 p-4 rounded-full">
                  <span className="text-3xl">🚗</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
                  <p className="text-sm text-green-600 mt-1">
                    {paidBookings.length} paid
                  </p>
                </div>
                <div className="bg-green-100 p-4 rounded-full">
                  <span className="text-3xl">📋</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ₹{paidBookings.reduce((sum: number, b: any) => sum + b.totalAmount, 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">From paid bookings</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded-full">
                  <span className="text-3xl">💰</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="flex gap-4">
              <Link
                href="/admin/vehicles/new"
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
              >
                + Add New Vehicle
              </Link>
              <Link
                href="/admin/vehicles"
                className="bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
              >
                Manage Vehicles
              </Link>
              <Link
                href="/admin/bookings"
                className="bg-gray-200 text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
              >
                View All Bookings
              </Link>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
            {recentBookings.length === 0 ? (
              <p className="text-gray-500">No bookings yet</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 text-gray-700">ID</th>
                      <th className="text-left py-2 px-4 text-gray-700">Customer</th>
                      <th className="text-left py-2 px-4 text-gray-700">Amount</th>
                      <th className="text-left py-2 px-4 text-gray-700">Status</th>
                      <th className="text-left py-2 px-4 text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking: any) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">#{booking.id}</td>
                        <td className="py-3 px-4 text-gray-900">{booking.customerName}</td>
                        <td className="py-3 px-4 text-gray-900">₹{booking.totalAmount}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                              booking.status === 'PAID'
                                ? 'bg-green-100 text-green-800'
                                : booking.status === 'CANCELLED'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700 text-sm">
                          {booking.createdAt.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
