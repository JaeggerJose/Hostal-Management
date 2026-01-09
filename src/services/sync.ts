import nodeIcal from 'node-ical';
import { supabase } from '@/lib/supabase/client';
import { differenceInDays, parseISO } from 'date-fns';

export const SyncService = {
  async fetchAndParseIcal(url: string) {
    try {
      const data = await nodeIcal.async.fromURL(url);
      const events = Object.values(data).filter((event: any) => event.type === 'VEVENT');
      
      return events.map((event: any) => ({
        uid: event.uid,
        summary: event.summary,
        start: event.start,
        end: event.end,
        description: event.description
      }));
    } catch (error) {
      console.error('iCal fetch error:', error);
      throw new Error('Failed to fetch iCal feed');
    }
  },

  async syncRoom(roomId: string, icalUrl: string) {
    const events = await this.fetchAndParseIcal(icalUrl);
    let syncedCount = 0;
    let conflicts = 0;

    for (const event of events) {
      const checkIn = event.start.toISOString().split('T')[0];
      const checkOut = event.end.toISOString().split('T')[0];

      // Check for conflicts
      const { data: existing } = await supabase
        .from('bookings')
        .select('id, status, source')
        .eq('room_id', roomId)
        .neq('status', 'cancelled')
        .or(`and(check_in.lte.${checkIn},check_out.gt.${checkIn}),and(check_in.lt.${checkOut},check_out.gte.${checkOut})`);

      let status = 'confirmed';
      
      if (existing && existing.length > 0) {
        // If conflict with manual booking, flag it
        const hasManualConflict = existing.some((b: any) => b.source === 'manual');
        if (hasManualConflict) {
          status = 'conflict';
          conflicts++;
        } else {
          // Already exists as external booking, skip or update?
          // For now, assuming upsert based on external_id handles it
        }
      }

      // Upsert booking
      const { error } = await supabase
        .from('bookings')
        .upsert({
          room_id: roomId,
          guest_name: event.summary || 'Booking.com Guest',
          check_in: checkIn,
          check_out: checkOut,
          status: status,
          source: 'booking_com',
          external_id: event.uid,
          raw_data: event
        }, { onConflict: 'external_id' });

      if (!error) syncedCount++;
    }

    return { syncedCount, conflicts };
  },

  async syncAll() {
    const { data: rooms } = await supabase
      .from('rooms')
      .select('id, ical_url')
      .not('ical_url', 'is', null);

    if (!rooms) return { syncedCount: 0, conflicts: 0 };

    let totalSynced = 0;
    let totalConflicts = 0;

    for (const room of rooms) {
      if (room.ical_url) {
        const result = await this.syncRoom(room.id, room.ical_url);
        totalSynced += result.syncedCount;
        totalConflicts += result.conflicts;
      }
    }

    return { syncedCount: totalSynced, conflicts: totalConflicts };
  }
};
