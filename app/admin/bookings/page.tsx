import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminNav } from '@/components/AdminNav';
import { db } from '@/server/db';
import { getAllBookingsWithDetails } from '@/server/db/queries/bookings';

export default async function AdminBookingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  const bookings = await getAllBookingsWithDetails(db);

  return (
    <>
      <AdminNav />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">All Bookings</h1>

          {bookings.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No bookings found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">ID</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Customer</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Vehicle</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Route</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Date</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Amount</th>
                      <th className="text-left py-3 px-4 text-gray-700 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">#{booking.id}</td>
                        <td className="py-3 px-4">
                          <div className="text-gray-900">{booking.customerName}</div>
                          <div className="text-sm text-gray-600">{booking.customerEmail}</div>
                          <div className="text-sm text-gray-600">{booking.customerPhone}</div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-gray-900">{booking.vehicle.name}</div>
                          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded mt-1">
                            {booking.vehicle.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-700">
                          {booking.fromCity.name} → {booking.toCity.name}
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-700">
                            {booking.startDateTime.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.tripDurationHours}h
                          </div>
                        </td>
                        <td className="py-3 px-4 text-gray-900 font-semibold">
                          ₹{booking.totalAmount}
                        </td>
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
