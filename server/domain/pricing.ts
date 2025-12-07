// Pure pricing calculation functions

export interface PricingInput {
  durationHours: number;
  ratePerHour: number;
  ratePerDay: number;
  strategy?: 'per-hour' | 'per-day' | 'min-of-both';
}

export interface PricingResult {
  totalAmount: number;
  durationHours: number;
  durationDays: number;
  priceByHour: number;
  priceByDay: number;
}

/**
 * Calculate trip duration in hours
 */
export function calculateTripDuration(
  startDateTime: Date,
  endDateTime: Date
): number {
  const diffMs = endDateTime.getTime() - startDateTime.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.ceil(diffHours);
}

/**
 * Calculate pricing based on duration and rates
 */
export function calculatePrice({
  durationHours,
  ratePerHour,
  ratePerDay,
  strategy = 'min-of-both',
}: PricingInput): PricingResult {
  const durationDays = Math.ceil(durationHours / 24);
  const priceByHour = durationHours * ratePerHour;
  const priceByDay = durationDays * ratePerDay;

  let totalAmount: number;

  switch (strategy) {
    case 'per-hour':
      totalAmount = priceByHour;
      break;
    case 'per-day':
      totalAmount = priceByDay;
      break;
    case 'min-of-both':
      totalAmount = Math.min(priceByHour, priceByDay);
      break;
    default:
      totalAmount = Math.min(priceByHour, priceByDay);
  }

  return {
    totalAmount,
    durationHours,
    durationDays,
    priceByHour,
    priceByDay,
  };
}
