import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: Request) {
  // Allow authorization header or vercel cron token for security if needed
  const authHeader = req.headers.get('authorization');
  
  try {
    const supabase = createAdminClient();
    
    // Find bookings that have been pending for more than 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();

    const { data: expiredBookings, error: fetchError } = await supabase
      .from('bookings')
      .select('id, slot_id')
      .eq('payment_status', 'pending')
      .eq('status', 'pending')
      .lt('created_at', thirtyMinutesAgo);

    if (fetchError) {
      console.error("Cleanup error fetching:", fetchError);
      return NextResponse.json({ error: "Failed to fetch expired bookings" }, { status: 500 });
    }

    if (!expiredBookings || expiredBookings.length === 0) {
      return NextResponse.json({ success: true, message: "No expired bookings found" });
    }

    // Cancel these bookings. 
    // Note: Our database trigger `update_slot_status` will handle freeing up the is_booked flag in available_slots
    const { error: updateError } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .in('id', expiredBookings.map(b => b.id));

    if (updateError) {
      console.error("Cleanup update error:", updateError);
      return NextResponse.json({ error: "Failed to update expired bookings" }, { status: 500 });
    }
    
    // We also need to manually decrement current_bookings on available_slots
    // since the trigger only manages the boolean `is_booked` but doesn't decrement capacity logic.
    // However, since we are doing this in bulk, a safer way is to decrement it logic per logic, or use an RPC.
    // For simplicity, we loop:
    for (const booking of expiredBookings) {
      if (booking.slot_id) {
        // Fetch current slot capacity
        const { data: slot } = await supabase
          .from('available_slots')
          .select('current_bookings')
          .eq('id', booking.slot_id)
          .single();
          
        if (slot && slot.current_bookings > 0) {
          await supabase
            .from('available_slots')
            .update({ 
               current_bookings: slot.current_bookings - 1,
               is_booked: false // ensure it's unbooked
            })
            .eq('id', booking.slot_id);
        }
      }
    }

    return NextResponse.json({ success: true, count: expiredBookings.length });
  } catch (error: any) {
    console.error("Cleanup cron error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
