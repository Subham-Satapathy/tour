'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface City {
  id: number;
  name: string;
  slug: string;
}

interface SearchFormProps {
  cities: City[];
}

const searchSchema = z.object({
  fromCityId: z.string().min(1, 'Please select a city'),
  toCityId: z.string().min(1, 'Please select a city'),
  startDateTime: z.string().min(1, 'Please select start date and time'),
  endDateTime: z.string().min(1, 'Please select end date and time'),
  type: z.enum(['BOTH', 'CAR', 'BIKE']),
}).refine(
  (data) => data.fromCityId !== data.toCityId,
  { message: 'From and To cities must be different', path: ['toCityId'] }
).refine(
  (data) => new Date(data.startDateTime) < new Date(data.endDateTime),
  { message: 'End date must be after start date', path: ['endDateTime'] }
);

type SearchFormData = z.infer<typeof searchSchema>;

export function SearchForm({ cities }: SearchFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      type: 'BOTH',
    },
  });

  const onSubmit = async (data: SearchFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        fromCityId: data.fromCityId,
        toCityId: data.toCityId,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        type: data.type,
      });

      router.push(`/search?${params.toString()}`);
    } catch (err) {
      setError('An error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/50 mx-4 sm:mx-6 md:mx-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
        <div>
          <label htmlFor="fromCityId" className="block text-sm font-bold mb-2 text-gray-900">
            From
          </label>
          <select
            id="fromCityId"
            {...register('fromCityId')}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-colors font-medium text-sm sm:text-base"
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id.toString()}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.fromCityId && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 font-semibold">{errors.fromCityId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="toCityId" className="block text-sm font-bold mb-2 text-gray-900">
            To
          </label>
          <select
            id="toCityId"
            {...register('toCityId')}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-colors font-medium text-sm sm:text-base"
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id.toString()}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.toCityId && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 font-semibold">{errors.toCityId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="startDateTime" className="block text-sm font-bold mb-2 text-gray-900">
            Pick-up Date & Time
          </label>
          <input
            id="startDateTime"
            type="datetime-local"
            {...register('startDateTime')}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-colors font-medium text-sm sm:text-base"
          />
          {errors.startDateTime && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 font-semibold">{errors.startDateTime.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="endDateTime" className="block text-sm font-bold mb-2 text-gray-900">
            Drop-off Date & Time
          </label>
          <input
            id="endDateTime"
            type="datetime-local"
            {...register('endDateTime')}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-colors font-medium text-sm sm:text-base"
          />
          {errors.endDateTime && (
            <p className="text-red-500 text-xs sm:text-sm mt-1 font-semibold">{errors.endDateTime.message}</p>
          )}
        </div>
      </div>

      <div className="mb-4 sm:mb-6">
        <label htmlFor="type" className="block text-sm font-bold mb-2 text-gray-900">
          Vehicle Type
        </label>
        <select
          id="type"
          {...register('type')}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-colors font-medium text-sm sm:text-base"
        >
          <option value="BOTH">Both (Car & Bike)</option>
          <option value="CAR">Car Only</option>
          <option value="BIKE">Bike Only</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl mb-4 sm:mb-6 font-semibold text-xs sm:text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
      >
        {isLoading ? '🔍 Searching...' : 'Search Vehicles'}
      </button>
    </form>
  );
}
