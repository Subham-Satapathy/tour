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
      <main className="min-h-screen bg-white py-6 sm:py-12 pt-20 sm:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-1 sm:mb-2">My Bookings</h1>
            <p className="text-sm sm:text-base text-gray-600">View and manage all your vehicle bookings</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                filter === 'all'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="hidden sm:inline">All ({bookings.length})</span>
              <span className="sm:hidden">All ({bookings.length})</span>
            </button>
            <button
              onClick={() => setFilter('upcoming')}
              className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                filter === 'upcoming'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="hidden sm:inline">Upcoming ({bookings.filter(b => isUpcoming(b.startDateTime) && b.status === 'PAID').length})</span>
              <span className="sm:hidden">Upcoming ({bookings.filter(b => isUpcoming(b.startDateTime) && b.status === 'PAID').length})</span>
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                filter === 'completed'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="hidden sm:inline">Completed ({bookings.filter(b => isCompleted(b.endDateTime) && b.status === 'PAID').length})</span>
              <span className="sm:hidden">Done ({bookings.filter(b => isCompleted(b.endDateTime) && b.status === 'PAID').length})</span>
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm sm:text-base font-semibold transition-all cursor-pointer ${
                filter === 'cancelled'
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="hidden sm:inline">Cancelled ({bookings.filter(b => b.status === 'CANCELLED').length})</span>
              <span className="sm:hidden">Cancelled ({bookings.filter(b => b.status === 'CANCELLED').length})</span>
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
                className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 active:scale-95 transition-all duration-200"
              >
                Browse Vehicles
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-4 sm:p-6 hover:border-gray-300 transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                    {/* Vehicle Image */}
                    {booking.vehicle?.imageUrl && (
                      <div className="w-full lg:w-48 h-40 sm:h-48 lg:h-32 flex-shrink-0">
                        <img
                          src={booking.vehicle.imageUrl}
                          alt={booking.vehicle.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row items-start justify-between mb-3 sm:mb-4 gap-2">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-lg sm:text-xl font-black text-gray-900">
                              {booking.vehicle?.name || 'Vehicle'}
                            </h3>
                            <span className={getStatusBadge(booking.status)}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600">Booking ID: #{booking.id}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xl sm:text-2xl font-black text-gray-900">
                            ₹{booking.totalAmount?.toLocaleString()}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500">Total Amount</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
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

                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Link
                          href={`/booking/success/${booking.id}`}
                          className="px-4 sm:px-6 py-2 bg-black text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-gray-800 active:scale-95 transition-all duration-200 text-center cursor-pointer"
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
                            className="px-4 sm:px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg text-sm sm:text-base font-semibold hover:bg-red-50 transition-all cursor-pointer"
                          >
                            <span className="hidden sm:inline">Cancel Booking</span>
                            <span className="sm:hidden">Cancel</span>
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
