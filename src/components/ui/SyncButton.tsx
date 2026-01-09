'use client';

import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { zhTW } from '@/lib/i18n/zh-tw';

export default function SyncButton() {
  const [loading, setLoading] = useState(false);

  const handleSync = async () => {
    setLoading(true);
    try {
      await fetch('/api/sync', { method: 'POST' });
      // Reload to show new bookings
      window.location.reload();
    } catch (error) {
      console.error('Sync failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={loading}
      className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 disabled:opacity-50"
    >
      <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
      <span className="hidden sm:inline">{zhTW.dashboard.syncNow}</span>
    </button>
  );
}
