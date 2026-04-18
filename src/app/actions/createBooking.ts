"use server";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function createBookingAction(bookingData: any, slotData: any, selectedSlotId: string) {
  try {
    // 1. Insert the booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert(bookingData)
      .select("id")
      .single();

    if (bookingError || !booking) {
      console.error("Booking insert error:", bookingError);
      return { success: false, error: bookingError?.message || "Error creating booking" };
    }

    // 2. Update the slot capacity
    const newCount = slotData.current_bookings + 1;
    const { error: slotError } = await supabase
      .from("available_slots")
      .update({
        current_bookings: newCount,
        is_booked: newCount >= slotData.max_capacity,
      })
      .eq("id", selectedSlotId);

    if (slotError) {
      console.error("Slot update error:", slotError);
      // We still return success since the booking was created, but log the error
    }

    return { success: true, bookingId: booking.id };
  } catch (error: any) {
    console.error("Booking catch error:", error);
    return { success: false, error: error.message };
  }
}
