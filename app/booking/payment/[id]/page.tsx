'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

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
              className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:scale-105 hover:shadow-xl"
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
          <div className="mb-8 sm:mb-12">
            <button
              onClick={() => setShowBackConfirm(true)}
              className="text-base font-semibold text-gray-700 hover:text-black mb-6 transition-colors underline decoration-2 underline-offset-4 cursor-pointer"
            >
              ← Back to Bookings
            </button>
            <div className="border-l-4 border-black pl-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-2">Complete Payment</h1>
              <p className="text-lg sm:text-xl text-gray-600">Secure your booking with payment</p>
            </div>
          </div>

          {/* Back Confirmation Modal */}
          {showBackConfirm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-gray-900 mb-3">Cancel Payment?</h3>
                  <p className="text-base text-gray-600 leading-relaxed">Your booking will remain unpaid and may be cancelled if payment is not completed.</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowBackConfirm(false)}
                    className="flex-1 px-6 py-3 border-2 border-gray-900 rounded-xl font-bold text-gray-900 hover:bg-gray-50 transition-all cursor-pointer"
                  >
                    Stay Here
                  </button>
                  <button
                    onClick={() => router.push('/my-bookings')}
                    className="flex-1 px-6 py-3 bg-black text-white rounded-xl font-bold hover:scale-105 hover:shadow-xl transition-all cursor-pointer"
                  >
                    Leave Page
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

                <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl">
                  <p className="font-black text-lg text-green-900 mb-1">🔒 Secure Payment Gateway</p>
                  <p className="text-sm text-green-800">Your payment information is encrypted with industry-standard security</p>
                </div>

                <form onSubmit={handlePayment} className="space-y-8">
                  {/* Payment Method Selection */}
                  <div>
                    <label className="block text-xl font-black text-gray-900 mb-4">
                      Choose Payment Method
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-6 border-2 rounded-2xl font-bold transition-all cursor-pointer ${
                          paymentMethod === 'card'
                            ? 'border-black bg-black text-white shadow-lg'
                            : 'border-gray-300 hover:border-gray-400 bg-white text-gray-900'
                        }`}
                      >
                        <span className="text-3xl mb-2 block">💳</span>
                        <span className="text-sm font-black">CARD</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-6 border-2 rounded-2xl font-bold transition-all cursor-pointer ${
                          paymentMethod === 'upi'
                            ? 'border-black bg-black text-white shadow-lg'
                            : 'border-gray-300 hover:border-gray-400 bg-white text-gray-900'
                        }`}
                      >
                        <span className="text-3xl mb-2 block">📱</span>
                        <span className="text-sm font-black">UPI</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('netbanking')}
                        className={`p-6 border-2 rounded-2xl font-bold transition-all cursor-pointer ${
                          paymentMethod === 'netbanking'
                            ? 'border-black bg-black text-white shadow-lg'
                            : 'border-gray-300 hover:border-gray-400 bg-white text-gray-900'
                        }`}
                      >
                        <span className="text-3xl mb-2 block">🏦</span>
                        <span className="text-sm font-black">BANK</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Payment Form */}
                  {paymentMethod === 'card' && (
                    <div className="space-y-6 p-6 bg-gray-50 rounded-2xl">
                      <div>
                        <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">
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
                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-all text-lg font-semibold tracking-wider"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          placeholder="JOHN DOE"
                          className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-all text-lg font-semibold uppercase"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">
                            Expiry
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
                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-all text-lg font-semibold"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-black text-gray-900 mb-3 uppercase tracking-wide">
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
                            className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:border-black focus:outline-none transition-all text-lg font-semibold"
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
                    className="w-full bg-black text-white py-4 rounded-lg font-bold hover:scale-105 hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {processing ? 'Processing Payment...' : `Pay ₹${((booking?.totalAmount || 0) + (booking?.securityDeposit || 0)).toLocaleString()}`}
                  </button>
                </form>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-2xl p-8 sticky top-24 shadow-lg">
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-8 pb-4 border-b-4 border-black">Booking Summary</h3>
                
                {booking && (
                  <div className="space-y-6">
                    <div className="pb-4 border-b-2 border-gray-200">
                      <p className="text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Vehicle</p>
                      <p className="font-black text-xl text-gray-900">{booking.vehicle?.name}</p>
                    </div>

                    <div className="pb-4 border-b-2 border-gray-200">
                      <p className="text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Route</p>
                      <p className="font-black text-lg text-gray-900">
                        {booking.fromCity?.name} → {booking.toCity?.name}
                      </p>
                    </div>

                    <div className="pb-4 border-b-2 border-gray-200">
                      <p className="text-xs font-black text-gray-500 mb-2 uppercase tracking-widest">Duration</p>
                      <p className="font-black text-lg text-gray-900">{booking.tripDurationHours} hours</p>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(booking.startDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} - {new Date(booking.endDateTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="pt-2 space-y-4">
                      <div className="flex justify-between text-base">
                        <span className="text-gray-700 font-semibold">Base Fare</span>
                        <span className="font-black text-gray-900">₹{booking.totalAmount?.toLocaleString()}</span>
                      </div>
                      {booking.securityDeposit > 0 && (
                        <>
                          <div className="flex justify-between text-base">
                            <span className="text-gray-700 font-semibold">Security Deposit</span>
                            <span className="font-black text-gray-900">₹{booking.securityDeposit?.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-2 rounded-lg">* Fully refundable after trip</p>
                        </>
                      )}
                      <div className="flex justify-between border-t-4 border-black pt-6 mt-4">
                        <span className="font-black text-xl text-gray-900">TOTAL</span>
                        <span className="font-black text-3xl text-gray-900">₹{((booking.totalAmount || 0) + (booking.securityDeposit || 0)).toLocaleString()}</span>
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
