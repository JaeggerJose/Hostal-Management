import { supabase as defaultClient } from '@/lib/supabase/client';
import { Booking, CreateBookingDTO, Room } from '@/types';
import { SupabaseClient } from '@supabase/supabase-js';

export const BookingService = {
  async getBookings(startDate: string, endDate: string, client?: SupabaseClient) {
    const supabase = client || defaultClient;
    const { data, error } = await supabase
      .from('bookings')
      .select('*, room:rooms(*), guest:guests(*)')
      .gte('check_in', startDate)
      .lte('check_in', endDate);

    if (error) throw error;
    return data as Booking[];
  },

  async createBooking(booking: CreateBookingDTO, client?: SupabaseClient) {
    const supabase = client || defaultClient;
    // 1. Check for conflicts
    const { data: conflicts } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', booking.room_id)
      .neq('status', 'cancelled')
      .or(`and(check_in.lte.${booking.check_in},check_out.gt.${booking.check_in}),and(check_in.lt.${booking.check_out},check_out.gte.${booking.check_out})`);

    if (conflicts && conflicts.length > 0) {
      throw new Error('Booking conflict detected');
    }

    let guestId = booking.guest_id || null;

    // 2. If no guest_id but guest_name provided, create new guest
    if (!guestId && booking.guest_name) {
      const { data: newGuest, error: guestError } = await supabase
        .from('guests')
        .insert({ 
          name: booking.guest_name,
          phone: booking.guest_phone || ''
        })
        .select('id')
        .single();
      
      if (!guestError && newGuest) {
        guestId = newGuest.id;
      }
    }

    // 3. Create booking
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        room_id: booking.room_id,
        guest_id: guestId,
        guest_name: booking.guest_name,
        check_in: booking.check_in,
        check_out: booking.check_out,
        status: 'confirmed',
        source: 'manual',
      })
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },

  async updateBooking(id: string, booking: Partial<CreateBookingDTO>, client?: SupabaseClient) {
    const supabase = client || defaultClient;

    // 1. Check for conflicts (excluding current booking)
    if (booking.room_id && booking.check_in && booking.check_out) {
      const { data: conflicts } = await supabase
        .from('bookings')
        .select('id')
        .eq('room_id', booking.room_id)
        .neq('id', id) // Exclude current booking
        .neq('status', 'cancelled')
        .or(`and(check_in.lte.${booking.check_in},check_out.gt.${booking.check_in}),and(check_in.lt.${booking.check_out},check_out.gte.${booking.check_out})`);

      if (conflicts && conflicts.length > 0) {
        throw new Error('訂房日期衝突，請選擇其他日期或房型');
      }
    }

    // 2. Handle guest update if needed (similar to create)
    let guestId = booking.guest_id || null;
    if (!guestId && booking.guest_name) {
       // Check if we need to create a new guest on update? 
       // If user cleared guest_id and typed a name, yes.
       const { data: newGuest, error: guestError } = await supabase
        .from('guests')
        .insert({ 
          name: booking.guest_name,
          phone: booking.guest_phone || ''
        })
        .select('id')
        .single();
      
      if (!guestError && newGuest) {
        guestId = newGuest.id;
      }
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({
        room_id: booking.room_id,
        guest_id: guestId,
        guest_name: booking.guest_name,
        check_in: booking.check_in,
        check_out: booking.check_out,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Booking;
  },

  async deleteBooking(id: string, client?: SupabaseClient) {
    const supabase = client || defaultClient;
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getRooms(client?: SupabaseClient) {
    const supabase = client || defaultClient;
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data as Room[];
  }
};
