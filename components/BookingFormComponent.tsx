'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Calendar, MapPin, Clock, User, Mail, Phone, CreditCard, Check } from 'lucide-react';

interface Vehicle {
  id: number;
  name: string;
  type: string;
  brand: string | null;
  model: string | null;
  seatingCapacity: number | null;
  fuelType: string | null;
  transmissionType: string | null;
  ratePerHour: number;
  ratePerDay: number;
  imageUrl: string | null;
  description: string | null;
  extraKmCharge: number | null;
  includedKmPerDay: number | null;
  securityDeposit: number | null;
}

interface City {
  id: number;
  name: string;
  slug: string;
}

interface BookingComponentProps {
  vehicle: Vehicle;
  cities: City[];
  initialData?: {
    fromCityId?: number;
    toCityId?: number;
    startDateTime?: string;
    endDateTime?: string;
  };
}

export function BookingFormComponent({ vehicle, cities, initialData }: BookingComponentProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fromCityId: initialData?.fromCityId?.toString() || '',
    toCityId: initialData?.toCityId?.toString() || '',
    startDateTime: initialData?.startDateTime || '',
    endDateTime: initialData?.endDateTime || '',
    customerName: session?.user?.name || '',
    customerEmail: session?.user?.email || '',
    customerPhone: '',
  });

  const [pricing, setPricing] = useState({
    duration: 0,
    baseAmount: 0,
    securityDeposit: vehicle.securityDeposit || 0,
    totalAmount: 0,
  });

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        customerName: session.user.name || '',
        customerEmail: session.user.email || '',
      }));
      
      // Check for saved booking data
      const savedData = localStorage.getItem('pendingBookingData');
      if (savedData) {
        try {
          const { vehicleId, formData: savedFormData, pricing: savedPricing } = JSON.parse(savedData);
          if (vehicleId === vehicle.id) {
            setFormData(prev => ({
              ...savedFormData,
              customerName: session.user.name || '',
              customerEmail: session.user.email || '',
            }));
            setPricing(savedPricing);
            setStep(2); // Move to step 2 since step 1 was completed
            localStorage.removeItem('pendingBookingData');
          }
        } catch (err) {
          console.error('Failed to restore booking data:', err);
        }
      }
    }
  }, [session]);

  useEffect(() => {
    calculatePricing();
  }, [formData.startDateTime, formData.endDateTime]);

  const calculatePricing = () => {
    if (!formData.startDateTime || !formData.endDateTime) return;

    const start = new Date(formData.startDateTime);
    const end = new Date(formData.endDateTime);
    const durationMs = end.getTime() - start.getTime();
    const durationHours = Math.ceil(durationMs / (1000 * 60 * 60));
    const durationDays = Math.ceil(durationHours / 24);

    let baseAmount = 0;
    if (durationHours <= 24) {
      baseAmount = Math.max(durationHours * vehicle.ratePerHour, vehicle.ratePerDay);
    } else {
      baseAmount = durationDays * vehicle.ratePerDay;
    }

    setPricing({
      duration: durationHours,
      baseAmount,
      securityDeposit: vehicle.securityDeposit || 0,
      totalAmount: baseAmount + (vehicle.securityDeposit || 0),
    });
  };

  const validateStep1 = () => {
    if (!formData.fromCityId || !formData.toCityId) {
      setError('Please select pickup and drop-off cities');
      return false;
    }
    if (!formData.startDateTime || !formData.endDateTime) {
      setError('Please select start and end date/time');
      return false;
    }
    const start = new Date(formData.startDateTime);
    const end = new Date(formData.endDateTime);
    if (start >= end) {
      setError('End date must be after start date');
      return false;
    }
    if (start < new Date()) {
      setError('Start date must be in the future');
      return false;
    }
    return true;
  };

  const checkAvailability = async () => {
    try {
      const response = await fetch('/api/bookings/check-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          startDateTime: formData.startDateTime,
          endDateTime: formData.endDateTime,
        }),
      });

      const data = await response.json();
      return data.available;
    } catch (err) {
      console.error('Error checking availability:', err);
      return true; // Allow to proceed if check fails
    }
  };

  const validateStep2 = () => {
    if (!formData.customerName || !formData.customerEmail || !formData.customerPhone) {
      setError('Please fill all required fields');
      return false;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(formData.customerPhone.replace(/[^0-9]/g, ''))) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    setError('');
    if (step === 1) {
      if (!validateStep1()) return;
      
      // Check vehicle availability
      setLoading(true);
      const available = await checkAvailability();
      setLoading(false);
      
      if (!available) {
        setError('Vehicle is not available for the selected dates. Please choose different dates.');
        return;
      }
      
      // Check if user is logged in
      if (status === 'unauthenticated') {
        // Save form data to localStorage before redirecting
        localStorage.setItem('pendingBookingData', JSON.stringify({
          vehicleId: vehicle.id,
          formData,
          pricing
        }));
        router.push(`/login?redirect=/booking/${vehicle.id}`);
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!validateStep2()) return;
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: vehicle.id,
          fromCityId: parseInt(formData.fromCityId),
          toCityId: parseInt(formData.toCityId),
          startDateTime: formData.startDateTime,
          endDateTime: formData.endDateTime,
          customerName: formData.customerName,
          customerEmail: formData.customerEmail,
          customerPhone: formData.customerPhone,
          tripDurationHours: pricing.duration,
          pricePerHour: vehicle.ratePerHour,
          pricePerDay: vehicle.ratePerDay,
          totalAmount: pricing.baseAmount,
          securityDeposit: pricing.securityDeposit,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create booking');
        return;
      }

      // Redirect to payment page
      router.push(`/booking/payment/${data.booking.id}`);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-12 mt-20">
      {/* Progress Steps */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                step >= s ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-16 sm:w-24 h-1 mx-2 ${step > s ? 'bg-black' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs sm:text-sm font-semibold text-gray-600 max-w-md mx-auto">
          <span className={step >= 1 ? 'text-black' : ''}>Trip Details</span>
          <span className={step >= 2 ? 'text-black' : ''}>Your Info</span>
          <span className={step >= 3 ? 'text-black' : ''}>Review</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side - Form */}
        <div className="lg:col-span-2">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sm:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {error}
              </div>
            )}

            {/* Step 1: Trip Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Trip Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Pickup City
                    </label>
                    <select
                      value={formData.fromCityId}
                      onChange={(e) => setFormData({ ...formData, fromCityId: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Drop-off City
                    </label>
                    <select
                      value={formData.toCityId}
                      onChange={(e) => setFormData({ ...formData, toCityId: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
                      required
                    >
                      <option value="">Select City</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.id}>{city.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Start Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.startDateTime}
                      onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      End Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      value={formData.endDateTime}
                      onChange={(e) => setFormData({ ...formData, endDateTime: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors"
                      required
                    />
                  </div>
                </div>

                {pricing.duration > 0 && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-semibold text-gray-900">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Trip Duration: {pricing.duration} hours ({Math.ceil(pricing.duration / 24)} days)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Customer Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Your Information</h2>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Mail className="w-4 h-4 inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
                    placeholder="john@example.com"
                    required
                    disabled={!!session?.user?.email}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^0-9]/g, '');
                      if (value.length <= 10) {
                        setFormData({ ...formData, customerPhone: value });
                      }
                    }}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
                    placeholder="9876543210"
                    maxLength={10}
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter 10-digit mobile number</p>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-black text-gray-900 mb-6">Review Booking</h2>

                <div className="space-y-6">
                  {/* Trip Details */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Trip Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">From:</span>
                        <span className="font-semibold text-gray-900">{cities.find(c => c.id === parseInt(formData.fromCityId))?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">To:</span>
                        <span className="font-semibold text-gray-900">{cities.find(c => c.id === parseInt(formData.toCityId))?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(formData.startDateTime).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                          })}, {new Date(formData.startDateTime).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End:</span>
                        <span className="font-semibold text-gray-900">
                          {new Date(formData.endDateTime).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                          })}, {new Date(formData.endDateTime).toLocaleTimeString('en-IN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-semibold text-gray-900">{pricing.duration} hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Name:</span>
                        <span className="font-semibold text-gray-900">{formData.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-semibold text-gray-900">{formData.customerEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Phone:</span>
                        <span className="font-semibold text-gray-900">+91 {formData.customerPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Important Information */}
                  <div className="pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-bold text-gray-900 mb-3">Important Information</h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Valid driving license required at pickup</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Security deposit is refundable</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Fuel charges not included</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Cancellation up to 24 hours before booking</span>
                      </li>
                      {vehicle.includedKmPerDay && (
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>{vehicle.includedKmPerDay} km included per day</span>
                        </li>
                      )}
                      {vehicle.extraKmCharge && (
                        <li className="flex items-start">
                          <span className="mr-2">•</span>
                          <span>Extra ₹{vehicle.extraKmCharge}/km beyond limit</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border-2 border-black text-black rounded-lg font-bold hover:bg-gray-50 transition-all cursor-pointer"
                >
                  Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all cursor-pointer"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-black text-white rounded-lg font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {loading ? 'Processing...' : 'Proceed to Payment'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sticky top-24">
            <h3 className="text-xl font-black text-gray-900 mb-4">Booking Summary</h3>
            
            {/* Vehicle Info */}
            <div className="mb-6">
              {vehicle.imageUrl && (
                <img 
                  src={vehicle.imageUrl} 
                  alt={vehicle.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
              )}
              <h4 className="font-bold text-lg text-gray-900">{vehicle.name}</h4>
              {vehicle.brand && vehicle.model && (
                <p className="text-sm text-gray-600">{vehicle.brand} {vehicle.model}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {vehicle.seatingCapacity && (
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded">{vehicle.seatingCapacity} Seats</span>
                )}
                {vehicle.fuelType && (
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded capitalize">{vehicle.fuelType.toLowerCase()}</span>
                )}
                {vehicle.transmissionType && (
                  <span className="text-sm bg-gray-100 px-2 py-1 rounded capitalize">{vehicle.transmissionType.toLowerCase()}</span>
                )}
              </div>
            </div>

            {/* Pricing */}
            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm md:text-base">
                <span className="text-gray-600">Base Fare</span>
                <span className="font-semibold">₹{pricing.baseAmount.toLocaleString()}</span>
              </div>
              {vehicle.securityDeposit ? (
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-gray-600">Security Deposit</span>
                  <span className="font-semibold">₹{pricing.securityDeposit.toLocaleString()}</span>
                </div>
              ) : null}
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <span className="font-bold text-gray-900 text-base md:text-lg">Total Amount</span>
                <span className="font-black text-xl md:text-2xl">₹{pricing.totalAmount.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {vehicle.securityDeposit ? '* Security deposit is refundable' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
