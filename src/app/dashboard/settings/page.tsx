'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Room } from '@/types';
import { zhTW } from '@/lib/i18n/zh-tw';

export default function SettingsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase.from('rooms').select('*').order('name');
      if (data) setRooms(data);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const handleUpdateIcal = async (roomId: string, icalUrl: string) => {
    setSaving(true);
    const { error } = await supabase
      .from('rooms')
      .update({ ical_url: icalUrl })
      .eq('id', roomId);
    
    if (error) {
      alert(zhTW.common.error);
    } else {
      setRooms(rooms.map(r => r.id === roomId ? { ...r, ical_url: icalUrl } : r));
    }
    setSaving(false);
  };

  if (loading) return <div className="p-4">{zhTW.common.loading}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">房間設定</h1>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {rooms.map((room) => (
            <li key={room.id} className="p-6">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {room.name} ({room.type})
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: room.color + '20', color: room.color }}>
                    Capacity: {room.capacity}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booking.com iCal URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm p-2 border"
                      placeholder="https://admin.booking.com/..."
                      defaultValue={room.ical_url || ''}
                      onBlur={(e) => handleUpdateIcal(room.id, e.target.value)}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    貼上來自 Booking.com 的行事曆連結以啟用同步。
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
