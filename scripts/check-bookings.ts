import { db } from '../server/db';
import { bookings } from '../server/db/schema';
import { count } from 'drizzle-orm';

async function checkBookings() {
  try {
    console.log('Checking bookings...');
    
    // Get all bookings
    const allBookings = await db.select().from(bookings);
    console.log('All bookings:', allBookings.length);
    console.log('Bookings:', JSON.stringify(allBookings, null, 2));
    
    // Get count
    const [countResult] = await db.select({ count: count() }).from(bookings);
    console.log('Count result:', countResult);
    console.log('Count type:', typeof countResult.count);
    console.log('Number(count):', Number(countResult.count));
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkBookings();
