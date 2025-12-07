// Pure availability checking functions

export interface TimeRange {
  start: Date;
  end: Date;
}

/**
 * Check if two time ranges overlap
 * Two ranges overlap if: NOT (existingEnd <= requestedStart OR existingStart >= requestedEnd)
 */
export function doTimeRangesOverlap(
  range1: TimeRange,
  range2: TimeRange
): boolean {
  return !(range1.end <= range2.start || range1.start >= range2.end);
}

/**
 * Check if a vehicle is available for a given time range
 * by checking against existing bookings
 */
export function isVehicleAvailable(
  requestedRange: TimeRange,
  existingBookings: TimeRange[]
): boolean {
  for (const booking of existingBookings) {
    if (doTimeRangesOverlap(requestedRange, booking)) {
      return false;
    }
  }
  return true;
}

/**
 * Filter available vehicles from a list
 */
export function filterAvailableVehicles<T extends { id: number }>(
  vehicles: T[],
  requestedRange: TimeRange,
  bookingsByVehicle: Map<number, TimeRange[]>
): T[] {
  return vehicles.filter((vehicle) => {
    const existingBookings = bookingsByVehicle.get(vehicle.id) || [];
    return isVehicleAvailable(requestedRange, existingBookings);
  });
}
