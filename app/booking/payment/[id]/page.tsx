'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CreditCard, Lock, Calendar, MapPin, Car, Check, ArrowLeft } from 'lucide-react';

export default function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [bookingId, setBookingId] = useState<string>('');
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [upiId, setUpiId] = useState('');

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
      setError('Failed to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update booking status
      const response = await fetch(`/api/bookings/${bookingId}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethod,
          paymentDetails: paymentMethod === 'card' 
            ? { last4: cardDetails.number.slice(-4) }
            : paymentMethod === 'upi'
            ? { upiId }
            : {},
        }),
      });

      if (!response.ok) {
        throw new Error('Payment failed');
      }

      // Redirect to success page
      router.push(`/booking/success/${bookingId}`);
    } catch (err) {
      setError('Payment processing failed. Please try again.');
    } finally {
      setProcessing(false);
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

  if (error && !booking) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-black text-gray-900 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/vehicles')}
              className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800"
            >
              Back to Vehicles
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white py-8 sm:py-12 pt-24 sm:pt-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
          <div className="mb-8">
            <button
              onClick={() => setShowBackConfirm(true)}
              className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">Complete Payment</h1>
            <p className="text-gray-600 mt-2">Secure payment for your booking</p>
          </div>

          {/* Back Confirmation Modal */}
          {showBackConfirm && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cancel Payment?</h3>
                <p className="text-gray-600 mb-6">Are you sure you want to go back? Your booking will remain unpaid and may be cancelled.</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowBackConfirm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Stay on Payment
                  </button>
                  <button
                    onClick={() => router.push('/my-bookings')}
                    className="flex-1 px-4 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer"
                  >
                    Go Back
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8">
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-start gap-3">
                  <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-green-900">Secure Payment</p>
                    <p className="text-sm text-green-700">Your payment information is encrypted and secure</p>
                  </div>
                </div>

                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-sm md:text-base font-bold text-gray-900 mb-3">
                      Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-4 border-2 rounded-lg font-bold transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'border-black bg-white'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <CreditCard className="w-6 h-6 mx-auto mb-2" />
                        <span className="text-sm">Card</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-4 border-2 rounded-lg font-bold transition-all cursor-pointer ${
                          paymentMethod === 'upi'
                            ? 'border-black bg-white'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-2">📱</div>
                        <span className="text-sm">UPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`p-4 border-2 rounded-lg font-bold transition-all cursor-pointer ${
                          paymentMethod === 'netbanking'
                            ? 'border-black bg-white'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-2">🏦</div>
                        <span className="text-sm">Banking</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Card Number
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={cardDetails.number}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 16);
                              setCardDetails({ ...cardDetails, number: value });
                            }}
                            placeholder="1234 5678 9012 3456"
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                            required
                          />
                          {cardDetails.number.length >= 16 && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                              CVV
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 mb-2">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          placeholder="John Doe"
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => {
                              let value = e.target.value.replace(/\D/g, '');
                              if (value.length >= 2) {
                                value = value.slice(0, 2) + '/' + value.slice(2, 4);
                              }
                              setCardDetails({ ...cardDetails, expiry: value });
                            }}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, '').slice(0, 3);
                              setCardDetails({ ...cardDetails, cvv: value });
                            }}
                            placeholder="123"
                            maxLength={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* UPI Payment */}
                  {paymentMethod === 'upi' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@upi"
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  )}

                  {/* Net Banking */}
                  {paymentMethod === 'netbanking' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-900 mb-2">
                        Select Bank
                      </label>
                      <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors">
                        <option value="">Choose your bank</option>
                        <option value="sbi">State Bank of India</option>
                        <option value="hdfc">HDFC Bank</option>
                        <option value="icici">ICICI Bank</option>
                        <option value="axis">Axis Bank</option>
                        <option value="kotak">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={processing}
                    className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing Payment...' : `Pay ₹${((booking?.totalAmount || 0) + (booking?.securityDeposit || 0)).toLocaleString()}`}
                  </button>
                </form>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
                <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-6">Booking Summary</h3>
                
                {booking && (
                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <Car className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm md:text-base text-gray-600 mb-1">Vehicle</p>
                        <p className="font-bold text-base md:text-lg text-gray-900">{booking.vehicle?.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm md:text-base text-gray-600 mb-1">Route</p>
                        <p className="font-bold text-base md:text-lg text-gray-900">
                          {booking.fromCity?.name} → {booking.toCity?.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-700 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm md:text-base text-gray-600 mb-1">Duration</p>
                        <p className="font-bold text-base md:text-lg text-gray-900">{booking.tripDurationHours} hours</p>
                        <p className="text-sm md:text-base text-gray-500">
                          {new Date(booking.startDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' })} - {new Date(booking.endDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-6 space-y-3">
                      <div className="flex justify-between text-sm md:text-base">
                        <span className="text-gray-700">Base Fare</span>
                        <span className="font-bold text-gray-900">₹{booking.totalAmount?.toLocaleString()}</span>
                      </div>
                      {booking.securityDeposit > 0 && (
                        <>
                          <div className="flex justify-between text-sm md:text-base">
                            <span className="text-gray-700">Security Deposit</span>
                            <span className="font-bold text-gray-900">₹{booking.securityDeposit?.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-blue-600 font-medium">* Refundable at trip completion</p>
                        </>
                      )}
                      <div className="flex justify-between border-t border-gray-200 pt-3 mt-3">
                        <span className="font-bold text-base md:text-lg text-gray-900">Total Amount</span>
                        <span className="font-black text-xl md:text-2xl text-gray-900">₹{((booking.totalAmount || 0) + (booking.securityDeposit || 0)).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
