'use client';

import { useState, useEffect } from 'react';
import { VehicleCard } from './VehicleCard';
import { Search, Filter, X, Car, Bike } from 'lucide-react';

interface City {
  id: number;
  name: string;
  slug: string;
}

interface VehicleFleetProps {
  cities: City[];
}

interface Vehicle {
  id: number;
  name: string;
  type: 'CAR' | 'BIKE';
  brand: string | null;
  model: string | null;
  seatingCapacity: number | null;
  fuelType: string | null;
  transmissionType: string | null;
  ratePerHour: number;
  ratePerDay: number;
  imageUrl: string | null;
  description: string | null;
  fromCityId: number;
  toCityId: number;
  isFeatured: boolean;
}

export function VehicleFleet({ cities }: VehicleFleetProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    type: 'ALL' as 'ALL' | 'CAR' | 'BIKE',
    fromCityId: '',
    toCityId: '',
    fuelType: '',
    transmissionType: '',
    minPrice: '',
    maxPrice: '',
    searchQuery: '',
  });

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.type !== 'ALL') queryParams.append('type', filters.type);
      if (filters.fromCityId) queryParams.append('fromCityId', filters.fromCityId);
      if (filters.toCityId) queryParams.append('toCityId', filters.toCityId);
      if (filters.fuelType) queryParams.append('fuelType', filters.fuelType);
      if (filters.transmissionType) queryParams.append('transmissionType', filters.transmissionType);
      if (filters.searchQuery) queryParams.append('search', filters.searchQuery);

      const response = await fetch(`/api/vehicles?${queryParams.toString()}`);
      const data = await response.json();
      
      let filteredVehicles = data.vehicles || [];
      
      // Client-side price filtering
      if (filters.minPrice) {
        filteredVehicles = filteredVehicles.filter((v: Vehicle) => v.ratePerDay >= parseInt(filters.minPrice));
      }
      if (filters.maxPrice) {
        filteredVehicles = filteredVehicles.filter((v: Vehicle) => v.ratePerDay <= parseInt(filters.maxPrice));
      }
      
      setVehicles(filteredVehicles);
    } catch (error) {
      console.error('Failed to fetch vehicles:', error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      type: 'ALL',
      fromCityId: '',
      toCityId: '',
      fuelType: '',
      transmissionType: '',
      minPrice: '',
      maxPrice: '',
      searchQuery: '',
    });
  };

  const hasActiveFilters = filters.type !== 'ALL' || filters.fromCityId || filters.toCityId || 
    filters.fuelType || filters.transmissionType || filters.minPrice || filters.maxPrice || filters.searchQuery;

  return (
    <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="inline-block mb-3 sm:mb-4">
          <div className="border-t-2 border-black w-16 sm:w-20 mb-2"></div>
          <p className="text-base sm:text-lg font-medium tracking-wide text-gray-600">Explore Our Fleet</p>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-black mb-3 sm:mb-4">
          Available Vehicles
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl">
          Choose from our wide range of well-maintained cars and bikes for your next adventure in Odisha
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by vehicle name or brand..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
            />
          </div>

          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
          >
            <Filter className="w-5 h-5" />
            Filters {hasActiveFilters && `(${Object.values(filters).filter(v => v && v !== 'ALL').length})`}
          </button>
        </div>

        {/* Quick Type Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          <button
            onClick={() => setFilters({ ...filters, type: 'ALL' })}
            className={`px-5 py-2 rounded-full font-semibold transition-all whitespace-nowrap flex-shrink-0 cursor-pointer ${
              filters.type === 'ALL'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Vehicles
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: 'CAR' })}
            className={`px-5 py-2 rounded-full font-semibold transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-2 cursor-pointer ${
              filters.type === 'CAR'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Car className="w-4 h-4" />
            Cars Only
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: 'BIKE' })}
            className={`px-5 py-2 rounded-full font-semibold transition-all whitespace-nowrap flex-shrink-0 flex items-center gap-2 cursor-pointer ${
              filters.type === 'BIKE'
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Bike className="w-4 h-4" />
            Bikes Only
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Advanced Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-black font-semibold flex items-center gap-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Clear All</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* From City */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Pickup City
              </label>
              <select
                value={filters.fromCityId}
                onChange={(e) => setFilters({ ...filters, fromCityId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* To City */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Drop-off City
              </label>
              <select
                value={filters.toCityId}
                onChange={(e) => setFilters({ ...filters, toCityId: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Fuel Type
              </label>
              <select
                value={filters.fuelType}
                onChange={(e) => setFilters({ ...filters, fuelType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
              >
                <option value="">All Fuel Types</option>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Transmission
              </label>
              <select
                value={filters.transmissionType}
                onChange={(e) => setFilters({ ...filters, transmissionType: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
              >
                <option value="">All Types</option>
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Min Price (per day)
              </label>
              <input
                type="number"
                placeholder="₹0"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
              />
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Max Price (per day)
              </label>
              <input
                type="number"
                placeholder="₹10000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition-colors text-gray-900"
              />
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          {loading ? 'Loading...' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
        </div>
      ) : vehicles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl font-bold text-gray-900 mb-2">No vehicles found</p>
          <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
