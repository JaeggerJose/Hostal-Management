'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Room, Booking } from '@/types';
import { BookingService } from '@/services/booking';
import { zhTW } from '@/lib/i18n/zh-tw';

import GuestSearch from '@/components/guests/GuestSearch';

interface CreateBookingFormProps {
  rooms: Room[];
  initialData?: Booking;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateBookingForm({ rooms, initialData, onClose, onSuccess }: CreateBookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    room_id: initialData?.room_id || rooms[0]?.id || '',
    guest_name: initialData?.guest_name || '',
    guest_phone: initialData?.guest?.phone || '',
    guest_id: initialData?.guest_id || '',
    check_in: initialData?.check_in || new Date().toISOString().split('T')[0],
    check_out: initialData?.check_out || new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = initialData ? `/api/bookings?id=${initialData.id}` : '/api/bookings';
      const method = initialData ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || zhTW.common.error);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg w-full max-w-md shadow-xl animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">
            {initialData ? '編輯訂房' : zhTW.dashboard.newBooking}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {zhTW.booking.room}
            </label>
            <select
              required
              className="w-full rounded-md border border-gray-300 p-2"
              value={formData.room_id}
              onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} ({room.type})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">房客資訊</h4>
            
            {formData.guest_id ? (
              <div className="bg-teal-50 border border-teal-200 rounded-md p-3 flex justify-between items-center">
                <div>
                  <div className="text-sm font-medium text-teal-900">{formData.guest_name}</div>
                  <div className="text-xs text-teal-700">{formData.guest_phone || '無電話'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, guest_id: '', guest_name: '', guest_phone: '' })}
                  className="text-xs text-teal-600 hover:text-teal-800 underline"
                >
                  重新選擇
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    搜尋現有房客
                  </label>
                  <GuestSearch
                    onSelect={(guest) => setFormData({ 
                      ...formData, 
                      guest_name: guest.name, 
                      guest_phone: guest.phone,
                      guest_id: guest.id 
                    })}
                    selectedGuestId={formData.guest_id}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-gray-50 px-2 text-gray-500 text-xs">或是建立新房客</span>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">姓名 <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required={!formData.guest_id}
                      className="w-full rounded-md border border-gray-300 p-2 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      value={formData.guest_name}
                      onChange={(e) => setFormData({ ...formData, guest_name: e.target.value, guest_id: '' })}
                      placeholder="輸入姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">電話</label>
                    <input
                      type="tel"
                      className="w-full rounded-md border border-gray-300 p-2 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      value={formData.guest_phone}
                      onChange={(e) => setFormData({ ...formData, guest_phone: e.target.value, guest_id: '' })}
                      placeholder="輸入電話"
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {zhTW.booking.checkIn}
              </label>
              <input
                type="date"
                required
                className="w-full rounded-md border border-gray-300 p-2"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {zhTW.booking.checkOut}
              </label>
              <input
                type="date"
                required
                className="w-full rounded-md border border-gray-300 p-2"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              {zhTW.common.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
            >
              {loading ? zhTW.common.loading : zhTW.common.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
