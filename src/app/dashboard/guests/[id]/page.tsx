'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Guest, Booking } from '@/types';
import { GuestService } from '@/services/guest';
import { zhTW } from '@/lib/i18n/zh-tw';
import { ArrowLeft, Mail, Phone, Calendar, Trash2 } from 'lucide-react';
import GuestForm from '@/components/guests/GuestForm';

export default function GuestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [history, setHistory] = useState<Booking[]>([]);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm('確定要刪除此顧客資料嗎？此動作無法復原。')) return;
    
    setIsDeleting(true);
    try {
      await GuestService.deleteGuest(id as string);
      router.push('/dashboard/guests');
    } catch (error) {
      console.error('Delete failed', error);
      alert('刪除失敗，該顧客可能還有相關聯的訂房資料。');
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchGuest = async () => {
    try {
      const guestData = await GuestService.getGuest(id as string);
      setGuest(guestData);
      const historyData = await GuestService.getGuestHistory(id as string);
      setHistory(historyData as Booking[]);
    } catch (error) {
      console.error('Failed to fetch guest', error);
    }
  };

  useEffect(() => {
    if (id) fetchGuest();
  }, [id]);

  if (!guest) return <div className="p-4">{zhTW.common.loading}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/dashboard/guests"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">{guest.name}</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone size={20} />
                <span>{guest.phone}</span>
              </div>
              {guest.email && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail size={20} />
                  <span>{guest.email}</span>
                </div>
              )}
              {guest.notes && (
                <div className="mt-4 p-4 bg-yellow-50 rounded-md">
                  <h4 className="font-semibold text-yellow-800 mb-1">{zhTW.booking.notes}</h4>
                  <p className="text-yellow-700">{guest.notes}</p>
                </div>
              )}
            </div>
            <button
              onClick={() => setIsEditOpen(true)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
            >
              {zhTW.common.edit}
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 border border-red-300 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <div className="px-6 py-4 bg-gray-50 font-semibold text-gray-900">
            {zhTW.guest.history} ({history.length})
          </div>
          <ul className="divide-y divide-gray-200">
            {history.map((booking) => (
              <li key={booking.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Calendar size={20} className="text-gray-400" />
                    <div>
                      <div className="font-medium text-gray-900">
                        {booking.check_in} ~ {booking.check_out}
                      </div>
                      <div className="text-sm text-gray-500">
                        {booking.room?.name} ({booking.room?.type})
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {zhTW.booking[booking.status]}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isEditOpen && (
        <GuestForm 
          initialData={guest}
          onClose={() => setIsEditOpen(false)} 
          onSuccess={() => {
            setIsEditOpen(false);
            fetchGuest();
          }}
        />
      )}
    </div>
  );
}
