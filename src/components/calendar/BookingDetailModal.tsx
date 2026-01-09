import { X, Trash2, Edit2 } from 'lucide-react';
import { Booking } from '@/types';
import { zhTW } from '@/lib/i18n/zh-tw';
import { useState } from 'react';

interface BookingDetailModalProps {
  booking: Booking;
  onClose: () => void;
  onDeleteSuccess?: () => void;
  onEdit?: () => void;
}

export default function BookingDetailModal({ booking, onClose, onDeleteSuccess, onEdit }: BookingDetailModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('確定要刪除此訂房嗎？此動作無法復原。')) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/bookings?id=${booking.id}`, { method: 'DELETE' });
      if (res.ok) {
        onDeleteSuccess?.();
        onClose();
        // Force reload or trigger refresh from parent
        window.location.reload(); 
      } else {
        alert(zhTW.common.error);
      }
    } catch (error) {
      console.error('Delete failed', error);
      alert(zhTW.common.error);
    } finally {
      setIsDeleting(false);
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
          <h3 className="text-lg font-semibold">{booking.guest_name}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm text-gray-500 block">{zhTW.booking.room}</label>
            <div className="font-medium">{booking.room?.name}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 block">{zhTW.booking.checkIn}</label>
              <div className="font-medium">{booking.check_in}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500 block">{zhTW.booking.checkOut}</label>
              <div className="font-medium">{booking.check_out}</div>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 block">{zhTW.booking.source}</label>
            <div className="font-medium">
              {booking.source === 'manual' ? zhTW.booking.manual : zhTW.booking.booking_com}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 block">{zhTW.booking.status}</label>
            <div className={`font-medium ${
              booking.status === 'confirmed' ? 'text-green-600' :
              booking.status === 'cancelled' ? 'text-red-600' : 'text-orange-600'
            }`}>
              {zhTW.booking[booking.status]}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="flex items-center space-x-2 px-4 py-2 text-teal-600 hover:bg-teal-50 rounded-md"
            >
              <Edit2 size={18} />
              <span>{zhTW.common.edit}</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-md disabled:opacity-50"
            >
              <Trash2 size={18} />
              <span>{zhTW.common.delete}</span>
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            {zhTW.common.close || '關閉'}
          </button>
        </div>
      </div>
    </div>
  );
}
