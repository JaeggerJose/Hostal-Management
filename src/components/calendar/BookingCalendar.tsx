'use client';

import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Booking, Room } from '@/types';
import { BookingService } from '@/services/booking';
import { zhTW } from '@/lib/i18n/zh-tw';
import { useRouter } from 'next/navigation';

interface BookingCalendarProps {
  initialBookings?: Booking[];
  rooms: Room[];
  onBookingClick: (booking: Booking) => void;
}

export default function BookingCalendar({ initialBookings = [], rooms, onBookingClick }: BookingCalendarProps) {
  const [events, setEvents] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (initialBookings.length === 0) return; // Ignore empty initial bookings to avoid overwriting fetched data
    
    // Convert bookings to FullCalendar events
    const mappedEvents = initialBookings.map(booking => ({
      id: booking.id,
      title: `${booking.guest_name} (${booking.room?.name || 'Room'})`,
      start: booking.check_in,
      end: booking.check_out,
      backgroundColor: booking.room?.color || '#0d9488',
      borderColor: booking.room?.color || '#0d9488',
      extendedProps: { booking }
    }));
    // Only update if events actually changed to avoid loop
    setEvents(prev => {
        if (JSON.stringify(prev) === JSON.stringify(mappedEvents)) return prev;
        return mappedEvents;
    });
  }, [initialBookings]);

  const handleDatesSet = async (dateInfo: any) => {
    // Fetch bookings for the new date range
    try {
      const start = dateInfo.startStr.split('T')[0];
      const end = dateInfo.endStr.split('T')[0];
      const response = await fetch(`/api/bookings?start_date=${start}&end_date=${end}`);
      if (response.ok) {
        const bookings: Booking[] = await response.json();
        const mappedEvents = bookings.map(booking => ({
          id: booking.id,
          title: `${booking.guest_name} (${booking.room?.name || 'Room'})`,
          start: booking.check_in,
          end: booking.check_out,
          backgroundColor: booking.room?.color || '#0d9488',
          borderColor: booking.room?.color || '#0d9488',
          extendedProps: { booking }
        }));
        setEvents(mappedEvents);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    }
  };

  const [initialView, setInitialView] = useState('dayGridMonth');

  useEffect(() => {
    // Client-side only check
    if (window.innerWidth < 768) {
      setInitialView('listMonth');
    }
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow h-[calc(100vh-140px)]">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        initialView={initialView}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listMonth'
        }}
        locale="zh-tw"
        events={events}
        datesSet={handleDatesSet}
        eventClick={(info) => onBookingClick(info.event.extendedProps.booking)}
        height="100%"
        buttonText={{
          today: zhTW.dashboard.today,
          month: zhTW.dashboard.month,
          list: zhTW.dashboard.list
        }}
        noEventsContent="無訂房"
      />
    </div>
  );
}
