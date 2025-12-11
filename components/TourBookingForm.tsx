'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { MapPin, Calendar, Route as RouteIcon, User, Mail, Phone, Users } from 'lucide-react';

interface Tour {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  fromCityId: number;
  toCityId: number;
  distanceKm: number;
  durationDays: number;
  basePrice: number;
  pricePerKm: number;
  highlights: string | null;
  imageUrl: string | null;
  galleryImages: string | null;
  isActive: boolean;
  isFeatured: boolean;
  totalBookings: number;
  averageRating: string | null;
}

interface City {
  id: number;
  name: string;
  slug: string;
}

interface TourBookingFormProps {
  tour: Tour;
  fromCity: City;
  toCity: City;
}

export function TourBookingForm({ tour, fromCity, toCity }: TourBookingFormProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    startDate: '',
    numberOfTravellers: '1',
    specialRequests: '',
  });

  const totalPrice = tour.basePrice + (tour.distanceKm * tour.pricePerKm);

  // Pre-fill user data if logged in
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        customerName: session.user.name || '',
        customerEmail: session.user.email || '',
      }));
    }
  }, [session]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name validation
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Full name is required';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    // Email validation
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    // Phone validation
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{10,}$/.test(formData.customerPhone.trim())) {
      newErrors.customerPhone = 'Please enter a valid phone number (min 10 digits)';
    }

    // Start date validation
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    } else {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
    }

    // Number of travellers validation
    const travellers = parseInt(formData.numberOfTravellers);
    if (!formData.numberOfTravellers || isNaN(travellers) || travellers < 1) {
      newErrors.numberOfTravellers = 'Please enter a valid number of travellers';
    } else if (travellers > 50) {
      newErrors.numberOfTravellers = 'Please contact us for groups larger than 50';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.getElementById(firstErrorField);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setLoading(true);
    
    try {
      // Here you would make an API call to create the tour booking
      // For now, we'll just simulate it
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to payment or success page
      console.log('Tour booking submitted:', { tour: tour.id, ...formData });
      
      // TODO: Create actual booking API endpoint and redirect to payment
      alert('Tour booking functionality will be implemented with payment integration!');
      
    } catch (error) {
      console.error('Booking error:', error);
      setErrors({ submit: 'Failed to create booking. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    // Save form data to localStorage before redirecting
    localStorage.setItem('pendingTourBooking', JSON.stringify({
      tourId: tour.id,
      formData,
    }));
    router.push(`/login?redirect=/booking/tour/${tour.id}`);
  };

  return (
    <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-white rounded-xl p-6">
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
        Book This Tour
      </h2>
      
      {status === 'unauthenticated' && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950 border-2 border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-100 mb-3">
            <strong>Sign in for faster booking!</strong> Your details will be pre-filled.
          </p>
          <button
            onClick={handleLoginRedirect}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Sign In / Sign Up
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="customerName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="customerName"
              name="customerName"
              type="text"
              required
              value={formData.customerName}
              onChange={handleInputChange}
              className={`w-full pl-11 pr-4 py-3 border-2 ${
                errors.customerName 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-colors`}
              placeholder="Enter your full name"
              disabled={loading}
            />
          </div>
          {errors.customerName && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerName}</p>
          )}
        </div>

        {/* Email Address */}
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="customerEmail"
              name="customerEmail"
              type="email"
              required
              value={formData.customerEmail}
              onChange={handleInputChange}
              className={`w-full pl-11 pr-4 py-3 border-2 ${
                errors.customerEmail 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-colors`}
              placeholder="your@email.com"
              disabled={loading}
            />
          </div>
          {errors.customerEmail && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerEmail}</p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Phone Number *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="customerPhone"
              name="customerPhone"
              type="tel"
              required
              value={formData.customerPhone}
              onChange={handleInputChange}
              className={`w-full pl-11 pr-4 py-3 border-2 ${
                errors.customerPhone 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-colors`}
              placeholder="+91 1234567890"
              disabled={loading}
            />
          </div>
          {errors.customerPhone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.customerPhone}</p>
          )}
        </div>

        {/* Preferred Start Date */}
        <div>
          <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Preferred Start Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="startDate"
              name="startDate"
              type="date"
              required
              value={formData.startDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
              className={`w-full pl-11 pr-4 py-3 border-2 ${
                errors.startDate 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-colors`}
              disabled={loading}
            />
          </div>
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.startDate}</p>
          )}
        </div>

        {/* Number of Travellers */}
        <div>
          <label htmlFor="numberOfTravellers" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Number of Travellers *
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              id="numberOfTravellers"
              name="numberOfTravellers"
              type="number"
              min="1"
              max="50"
              required
              value={formData.numberOfTravellers}
              onChange={handleInputChange}
              className={`w-full pl-11 pr-4 py-3 border-2 ${
                errors.numberOfTravellers 
                  ? 'border-red-500 dark:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600'
              } rounded-lg focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-colors`}
              placeholder="2"
              disabled={loading}
            />
          </div>
          {errors.numberOfTravellers && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.numberOfTravellers}</p>
          )}
        </div>

        {/* Special Requests */}
        <div>
          <label htmlFor="specialRequests" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Special Requests (Optional)
          </label>
          <textarea
            id="specialRequests"
            name="specialRequests"
            rows={4}
            value={formData.specialRequests}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-black dark:focus:border-white bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none transition-colors resize-none"
            placeholder="Any special requirements or requests..."
            disabled={loading}
          />
        </div>

        {/* Pricing Summary */}
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 dark:text-gray-400">Tour Package</span>
            <span className="font-bold text-gray-900 dark:text-white">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
            <span>Travellers: {formData.numberOfTravellers}</span>
            <span>Duration: {tour.durationDays} {tour.durationDays === 1 ? 'day' : 'days'}</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-300 dark:border-gray-600 mt-3">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Total Amount
            </span>
            <span className="text-2xl font-black text-gray-900 dark:text-white">
              ₹{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Submit Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-800 dark:text-red-200">{errors.submit}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-lg font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Proceed to Payment'
          )}
        </button>

        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          By proceeding, you agree to our terms and conditions
        </p>
      </form>
    </div>
  );
}
