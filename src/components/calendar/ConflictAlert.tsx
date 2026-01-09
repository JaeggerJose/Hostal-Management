'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Booking } from '@/types';
import { zhTW } from '@/lib/i18n/zh-tw';

export default function ConflictAlert() {
  const [conflicts, setConflicts] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchConflicts = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, room:rooms(*)')
        .eq('status', 'conflict');
      
      if (data) setConflicts(data as Booking[]);
    };

    fetchConflicts();
  }, []);

  if (conflicts.length === 0) return null;

  return (
    <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-orange-800">
            {zhTW.common.error} ({conflicts.length})
          </h3>
          <div className="mt-2 text-sm text-orange-700">
            <ul className="list-disc pl-5 space-y-1">
              {conflicts.map((booking) => (
                <li key={booking.id}>
                  {booking.room?.name} - {booking.check_in} ({booking.guest_name})
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
