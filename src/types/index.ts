export type BookingStatus = 'confirmed' | 'cancelled' | 'conflict';
export type BookingSource = 'manual' | 'booking_com';

export interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  color: string;
  ical_url?: string;
}

export interface Guest {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  visit_count: number;
}

export interface Booking {
  id: string;
  created_at: string;
  room_id: string;
  guest_id?: string;
  guest_name: string;
  check_in: string; // ISO Date string (YYYY-MM-DD)
  check_out: string; // ISO Date string (YYYY-MM-DD)
  status: BookingStatus;
  source: BookingSource;
  external_id?: string;
  raw_data?: any;
  
  // Joined fields
  room?: Room;
  guest?: Guest;
}

export interface CreateBookingDTO {
  room_id: string;
  guest_name: string;
  guest_phone?: string;
  guest_id?: string;
  check_in: string;
  check_out: string;
  notes?: string;
}
