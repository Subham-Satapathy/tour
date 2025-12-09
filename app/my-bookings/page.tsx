'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Calendar, MapPin, Car, Clock, CheckCircle, XCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Booking {
  id: number;
  vehicleId: number;
  fromCityId: number;
  toCityId: number;
  startDateTime: string;
  endDateTime: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  tripDurationHours: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  vehicle?: {
    name: string;
    type: string;
    imageUrl: string | null;
  };
  fromCity?: {
    name: string;
  };
  toCity?: {
    name: string;
  };
}

export default function MyBookingsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/my-bookings');
      return;
    }

    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/my-bookings');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'PENDING':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-lg text-xs font-bold uppercase";
    switch (status) {
      case 'PAID':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'CANCELLED':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const isUpcoming = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

  const isCompleted = (endDate: string) => {
    return new Date(endDate) < new Date();
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return isUpcoming(booking.startDateTime) && booking.status === 'PAID';
    if (filter === 'completed') return isCompleted(booking.endDateTime) && booking.status === 'PAID';
    if (filter === 'cancelled') return booking.status === 'CANCELLED';
    return true;
  });

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

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-8 sm:py-12 pt-24 sm:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">My Bookings</h1>
            <p className="text-gray-600">View and manage all your vehicle bookings</p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'upcoming'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Upcoming ({bookings.filter(b => isUpcoming(b.startDateTime) && b.status === 'PAID').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'completed'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({bookings.filter(b => isCompleted(b.endDateTime) && b.status === 'PAID').length})
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
                filter === 'cancelled'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Cancelled ({bookings.filter(b => b.status === 'CANCELLED').length})
            </button>
          </div>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <div className="text-center py-16">
              <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? "You haven't made any bookings yet."
                  : `You don't have any ${filter} bookings.`}
              </p>
              <Link
                href="/vehicles"
                className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition-all"
              >
                Browse Vehicles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Vehicle Image */}
                    {booking.vehicle?.imageUrl && (
                      <div className="lg:w-48 lg:h-32 h-48 flex-shrink-0">
                        <img
                          src={booking.vehicle.imageUrl}
                          alt={booking.vehicle.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-black text-gray-900">
                              {booking.vehicle?.name || 'Vehicle'}
                            </h3>
                            <span className={getStatusBadge(booking.status)}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">Booking ID: #{booking.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-gray-900">
                            ₹{booking.totalAmount?.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">Total Amount</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">From</p>
                            <p className="text-base font-semibold text-gray-900">
                              {booking.fromCity?.name || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">To</p>
                            <p className="text-base font-semibold text-gray-900">
                              {booking.toCity?.name || 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Start Date</p>
                            <p className="text-base font-semibold text-gray-900">
                              {new Date(booking.startDateTime).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Clock className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-gray-600">Duration</p>
                            <p className="text-base font-semibold text-gray-900">
                              {booking.tripDurationHours}h ({Math.ceil(booking.tripDurationHours / 24)}d)
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Link
                          href={`/booking/success/${booking.id}`}
                          className="px-6 py-2 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-all"
                        >
                          View Details
                        </Link>
                        {isUpcoming(booking.startDateTime) && booking.status === 'PAID' && (
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this booking?')) {
                                // TODO: Implement cancellation
                                alert('Cancellation feature coming soon!');
                              }
                            }}
                            className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg font-semibold hover:bg-red-50 transition-all"
                          >
                            Cancel Booking
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
