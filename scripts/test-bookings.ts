import { db } from '../server/db';
import { bookings, vehicles } from '../server/db/schema';
import { eq, desc } from 'drizzle-orm';

async function testBookingsWithVehicle() {
  try {
    console.log('Testing bookings query with vehicle join...\n');
    
    const recentBookings = await db
      .select({
        id: bookings.id,
        vehicleId: bookings.vehicleId,
        vehicleName: vehicles.name,
        customerName: bookings.customerName,
        customerEmail: bookings.customerEmail,
        totalAmount: bookings.totalAmount,
        status: bookings.status,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .leftJoin(vehicles, eq(bookings.vehicleId, vehicles.id))
      .orderBy(desc(bookings.createdAt))
      .limit(10);

    console.log('Recent Bookings with Vehicle Names:');
    console.log(JSON.stringify(recentBookings, null, 2));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

testBookingsWithVehicle();
