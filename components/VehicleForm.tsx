'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adminVehicleSchema, type AdminVehicleInput } from '@/server/validation/schemas';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface City {
  id: number;
  name: string;
  slug: string;
}

interface VehicleFormProps {
  cities: City[];
  initialData?: AdminVehicleInput & { id?: number };
  mode: 'create' | 'edit';
}

export function VehicleForm({ cities, initialData, mode }: VehicleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminVehicleInput>({
    // @ts-expect-error - Zod resolver type inference issue with optional defaults
    resolver: zodResolver(adminVehicleSchema),
    defaultValues: initialData || undefined,
  });

  const onSubmit = async (data: AdminVehicleInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const url =
        mode === 'create'
          ? '/api/admin/vehicles/create'
          : `/api/admin/vehicles/${initialData?.id}`;

      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/vehicles');
        router.refresh();
      } else {
        const result = await response.json();
        setError(result.error || 'Operation failed');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred');
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id || !confirm('Are you sure you want to delete this vehicle?')) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/vehicles/${initialData.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/vehicles');
        router.refresh();
      } else {
        const result = await response.json();
        setError(result.error || 'Delete failed');
        setIsLoading(false);
      }
    } catch (err) {
      setError('An error occurred');
      setIsLoading(false);
    }
  };

  return (
    // @ts-expect-error - Form type inference issue with optional defaults
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Vehicle Name *
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="Toyota Innova"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="type" className="block text-sm font-medium mb-1">
          Type *
        </label>
        <select
          id="type"
          {...register('type')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
        >
          <option value="CAR">Car</option>
          <option value="BIKE">Bike</option>
        </select>
        {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fromCityId" className="block text-sm font-medium mb-1">
            From City *
          </label>
          <select
            id="fromCityId"
            {...register('fromCityId', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.fromCityId && (
            <p className="text-red-500 text-sm mt-1">{errors.fromCityId.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="toCityId" className="block text-sm font-medium mb-1">
            To City *
          </label>
          <select
            id="toCityId"
            {...register('toCityId', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          >
            <option value="">Select city</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
          {errors.toCityId && (
            <p className="text-red-500 text-sm mt-1">{errors.toCityId.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="ratePerHour" className="block text-sm font-medium mb-1">
            Rate per Hour (₹) *
          </label>
          <input
            id="ratePerHour"
            type="number"
            {...register('ratePerHour', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="500"
          />
          {errors.ratePerHour && (
            <p className="text-red-500 text-sm mt-1">{errors.ratePerHour.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="ratePerDay" className="block text-sm font-medium mb-1">
            Rate per Day (₹) *
          </label>
          <input
            id="ratePerDay"
            type="number"
            {...register('ratePerDay', { valueAsNumber: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="5000"
          />
          {errors.ratePerDay && (
            <p className="text-red-500 text-sm mt-1">{errors.ratePerDay.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="Comfortable 7-seater SUV perfect for family trips"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
          Image URL
        </label>
        <input
          id="imageUrl"
          type="text"
          {...register('imageUrl')}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
          placeholder="https://example.com/image.jpg"
        />
        {errors.imageUrl && (
          <p className="text-red-500 text-sm mt-1">{errors.imageUrl.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <input
          id="isActive"
          type="checkbox"
          {...register('isActive')}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isActive" className="ml-2 text-sm font-medium">
          Active (available for booking)
        </label>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Saving...' : mode === 'create' ? 'Create Vehicle' : 'Update Vehicle'}
        </button>

        {mode === 'edit' && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            Delete
          </button>
        )}
      </div>
    </form>
  );
}
