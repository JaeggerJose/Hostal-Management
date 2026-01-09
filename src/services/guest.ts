import { supabase } from '@/lib/supabase/client';
import { Guest } from '@/types';

export const GuestService = {
  async searchGuests(query: string = '') {
    
    // Search by name or phone
    let queryBuilder = supabase
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false }) // Show newest first
      .limit(20);

    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,phone.ilike.%${query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) throw error;
    return data as Guest[];
  },

  async getGuest(id: string) {
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Guest;
  },
  
  async getGuestHistory(id: string) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, room:rooms(*)')
        .eq('guest_id', id)
        .order('check_in', { ascending: false });
        
      if (error) throw error;
      return data;
  },

  async createGuest(guest: Partial<Guest>) {
    const { data, error } = await supabase
      .from('guests')
      .insert(guest)
      .select()
      .single();

    if (error) throw error;
    return data as Guest;
  },

  async updateGuest(id: string, guest: Partial<Guest>) {
    const { data, error } = await supabase
      .from('guests')
      .update(guest)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Guest;
  },

  async deleteGuest(id: string) {
    // 1. Unlink bookings first (set guest_id to null) to avoid FK constraint violation
    const { error: unlinkError } = await supabase
      .from('bookings')
      .update({ guest_id: null })
      .eq('guest_id', id);

    if (unlinkError) throw unlinkError;

    // 2. Delete the guest
    const { error } = await supabase
      .from('guests')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
