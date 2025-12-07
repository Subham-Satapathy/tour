import { Navbar } from '@/components/Navbar';
import { db } from '@/server/db';
import { getBookingWithDetails } from '@/server/db/queries/bookings';
import Link from 'next/link';

interface SuccessPageProps {
  params: Promise<{ id: string }>;
}

export default async function SuccessPage({ params }: SuccessPageProps) {
  const { id } = await params;
  const bookingId = parseInt(id);

  if (isNaN(bookingId)) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Invalid Booking ID
              </h1>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  const booking = await getBookingWithDetails(db, bookingId);

  if (!booking) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Booking Not Found
              </h1>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <span className="text-4xl">✓</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Booking Confirmed!
                </h1>
                <p className="text-gray-600">
                  Your booking has been successfully processed
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Booking ID</p>
                    <p className="font-bold text-lg text-gray-900">#{booking.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-800 font-semibold rounded">
                      {booking.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Vehicle</p>
                  <p className="font-semibold text-gray-900">
                    {booking.vehicle.name} ({booking.vehicle.type})
                  </p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="font-semibold text-gray-900">
                    {booking.fromCity.name} → {booking.toCity.name}
                  </p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Trip Duration</p>
                  <p className="font-semibold text-gray-900">
                    {booking.tripDurationHours} hours
                  </p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Start Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {booking.startDateTime.toLocaleString()}
                  </p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">End Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {booking.endDateTime.toLocaleString()}
                  </p>
                </div>

                <div className="border-b pb-3">
                  <p className="text-sm text-gray-600">Customer Details</p>
                  <p className="font-semibold text-gray-900">{booking.customerName}</p>
                  <p className="text-gray-700 text-sm">{booking.customerEmail}</p>
                  <p className="text-gray-700 text-sm">{booking.customerPhone}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{booking.totalAmount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>📧 Email Sent:</strong> A booking confirmation has been sent to{' '}
                  <strong>{booking.customerEmail}</strong>
                </p>
              </div>

              <div className="text-center">
                <Link
                  href="/"
                  className="inline-block bg-blue-600 text-white px-8 py-3 rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Book Another Trip
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
