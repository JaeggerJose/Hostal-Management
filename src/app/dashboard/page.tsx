'use client';

import { useEffect, useState } from 'react';
import BookingCalendar from '@/components/calendar/BookingCalendar';
import { BookingService } from '@/services/booking';
import { Booking, Room } from '@/types';
import { zhTW } from '@/lib/i18n/zh-tw';
import { Plus } from 'lucide-react';
import CreateBookingForm from '@/components/calendar/CreateBookingForm';
import BookingDetailModal from '@/components/calendar/BookingDetailModal';

import SyncButton from '@/components/ui/SyncButton';

import ConflictAlert from '@/components/calendar/ConflictAlert';

export default function DashboardPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchRooms = async () => {
      try {
        const roomsData = await BookingService.getRooms();
        if (isMounted) {
            setRooms(roomsData || []);
        }
      } catch (error) {
        console.error('Failed to fetch rooms', error);
      }
    };
    fetchRooms();
    return () => { isMounted = false };
  }, []);

  const handleBookingClick = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsCreateModalOpen(false); // Ensure create modal is closed initially
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{zhTW.dashboard.title}</h1>
        <div className="flex space-x-2">
          <SyncButton />
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">{zhTW.dashboard.newBooking}</span>
          </button>
        </div>
      </div>

      <ConflictAlert />

      <BookingCalendar 
        rooms={rooms}
        onBookingClick={handleBookingClick}
      />

      {selectedBooking && !isCreateModalOpen && (
        <BookingDetailModal 
          booking={selectedBooking} 
          onClose={() => setSelectedBooking(null)} 
          onDeleteSuccess={() => {
             window.location.reload();
          }}
          onEdit={() => {
            setIsCreateModalOpen(true);
          }}
        />
      )}
      
      {isCreateModalOpen && (
        <CreateBookingForm 
          rooms={rooms} 
          initialData={selectedBooking || undefined}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedBooking(null);
          }} 
          onSuccess={() => {
            setIsCreateModalOpen(false);
            setSelectedBooking(null);
            window.location.reload(); 
          }}
        />
      )}
    </div>
  );
}
