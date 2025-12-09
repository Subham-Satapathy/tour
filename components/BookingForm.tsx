'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const bookingFormSchema = z.object({
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(200),
  customerEmail: z.string().email('Invalid email address').max(200),
  customerPhone: z.string().min(10, 'Phone must be at least 10 digits').max(20),
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  vehicleId: number;
  fromCityId: number;
  toCityId: number;
  startDateTime: string;
  endDateTime: string;
  estimatedAmount: number;
}

export function BookingForm({
  vehicleId,
  fromCityId,
  toCityId,
  startDateTime,
  endDateTime,
  estimatedAmount,
}: BookingFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId,
          fromCityId,
          toCityId,
          startDateTime,
          endDateTime,
          ...data,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push(`/booking/success/${result.bookingId}`);
      } else {
        setError(result.error || 'Booking failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="customerName" className="block text-sm font-medium mb-1">
          Full Name *
        </label>
        <input
          id="customerName"
          type="text"
          {...register('customerName')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="John Doe"
        />
        {errors.customerName && (
          <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="customerEmail" className="block text-sm font-medium mb-1">
          Email Address *
        </label>
        <input
          id="customerEmail"
          type="email"
          {...register('customerEmail')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="john@example.com"
        />
        {errors.customerEmail && (
          <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="customerPhone" className="block text-sm font-medium mb-1">
          Phone Number *
        </label>
        <input
          id="customerPhone"
          type="tel"
          {...register('customerPhone')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="+91 9876543210"
        />
        {errors.customerPhone && (
          <p className="text-red-500 text-sm mt-1">{errors.customerPhone.message}</p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mt-6">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold text-gray-900">
            Estimated Total
          </span>
          <span className="text-2xl font-bold text-blue-600">
            ₹{estimatedAmount}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
      >
        {isLoading ? 'Processing...' : 'Confirm & Pay'}
      </button>

      <p className="text-sm text-gray-500 text-center">
        By proceeding, you agree to our terms and conditions. Payment is processed securely.
      </p>
    </form>
  );
}
