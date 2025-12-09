'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckCircle, Calendar, MapPin, Car, Mail, Phone, Clock, AlertCircle, User, CreditCard, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SuccessPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookingId, setBookingId] = useState<string>('');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(p => setBookingId(p.id));
  }, [params]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (bookingId) {
      fetchBooking();
    }
  }, [status, bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch booking');
      }
      const data = await response.json();
      setBooking(data.booking);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
        </div>
      </>
    );
  }

  if (!booking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-black text-gray-900 mb-4">Booking Not Found</h1>
            <Link
              href="/vehicles"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800"
            >
              Browse Vehicles
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 py-8 sm:py-12 pt-24 sm:pt-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <button
            onClick={() => router.push('/my-bookings')}
            className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">View All Bookings</span>
          </button>
          
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-600 mb-3">
              Your trip has been successfully booked
            </p>
            <p className="text-sm text-gray-500 inline-flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Confirmation sent to {booking.customerEmail}
            </p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Booking ID</p>
                  <p className="text-xl font-black text-gray-900">#{booking.id}</p>
                </div>
                <span className="px-4 py-2 bg-green-100 text-green-800 font-bold rounded-lg text-sm">
                  {booking.status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Trip Details */}
            <div className="px-6 py-6">
              <h3 className="text-lg font-black text-gray-900 mb-5 flex items-center gap-2">
                <Car className="w-5 h-5" />
                Trip Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Vehicle</p>
                    <p className="font-bold text-gray-900">{booking.vehicle?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600">{booking.vehicle?.type}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="font-bold text-gray-900">{booking.tripDurationHours} hours</p>
                    <p className="text-sm text-gray-600">
                      {Math.ceil(booking.tripDurationHours / 24)} day(s)
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Pickup Location</p>
                    <p className="font-bold text-gray-900">{booking.fromCity?.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Drop-off Location</p>
                    <p className="font-bold text-gray-900">{booking.toCity?.name || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Start Date & Time</p>
                    <p className="font-bold text-gray-900">
                      {new Date(booking.startDateTime).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.startDateTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">End Date & Time</p>
                    <p className="font-bold text-gray-900">
                      {new Date(booking.endDateTime).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-gray-600">
                      {new Date(booking.endDateTime).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer & Payment Details */}
            <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Details */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Details
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-semibold text-gray-900">{booking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold text-gray-900 text-sm">{booking.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-semibold text-gray-900">+91 {booking.customerPhone}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Details */}
                <div>
                  <h3 className="text-sm font-black text-gray-900 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Payment Summary
                  </h3>
                  <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Trip Amount</span>
                      <span className="font-semibold text-gray-900">
                        ₹{booking.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                    {booking.securityDeposit > 0 && (
                      <div className="flex justify-between items-center text-sm border-t pt-2">
                        <span className="text-gray-600">Security Deposit</span>
                        <span className="font-semibold text-gray-900">
                          ₹{booking.securityDeposit?.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center border-t pt-3">
                      <span className="text-sm text-gray-600">Total Paid</span>
                      <span className="text-2xl font-black text-gray-900">
                        ₹{((booking.totalAmount || 0) + (booking.securityDeposit || 0)).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Payment received on {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>
                    {booking.securityDeposit > 0 && (
                      <p className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        * Security deposit is refundable
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              Important Information
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Please carry a valid driving license at the time of pickup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Vehicle will be available 15 minutes before your scheduled start time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Security deposit will be collected at pickup (refundable)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Fuel charges are not included in the booking amount</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Free cancellation up to 24 hours before your trip</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/my-bookings"
              className="bg-black text-white py-4 px-6 rounded-xl font-bold text-center hover:bg-gray-800 transition-all shadow-sm"
            >
              View All Bookings
            </Link>
            <Link
              href="/vehicles"
              className="border-2 border-black text-black py-4 px-6 rounded-xl font-bold text-center hover:bg-gray-50 transition-all"
            >
              Book Another Trip
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

