'use client';

import { useState, useEffect } from 'react';
import { Guest } from '@/types';
import { GuestService } from '@/services/guest';
import { zhTW } from '@/lib/i18n/zh-tw';
import { Search, Plus, User, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import GuestForm from '@/components/guests/GuestForm';

export default function GuestListPage() {
  const [query, setQuery] = useState('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Load initial guests
  useEffect(() => {
    const loadGuests = async () => {
        setLoading(true);
        try {
            const results = await GuestService.searchGuests('');
            setGuests(results);
        } catch (error) {
            console.error('Failed to load guests', error);
        } finally {
            setLoading(false);
        }
    };
    loadGuests();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const results = await GuestService.searchGuests(query);
      setGuests(results);
    } catch (error) {
      console.error('Search failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{zhTW.guest.title}</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">{zhTW.common.add}</span>
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            placeholder={zhTW.guest.searchPlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          disabled={loading}
        >
          {loading ? zhTW.common.loading : zhTW.common.search}
        </button>
      </form>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {guests.map((guest) => (
            <li key={guest.id} className="hover:bg-gray-50">
              <Link href={`/dashboard/guests/${guest.id}`} className="block p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-teal-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-teal-600 truncate">{guest.name}</div>
                      <div className="text-sm text-gray-500">{guest.phone}</div>
                    </div>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {guest.visit_count} {zhTW.guest.visitCount}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
          {guests.length === 0 && !loading && (
            <li className="p-4 text-center text-gray-500">
              {query ? '無搜尋結果' : '暫無常客資料'}
            </li>
          )}
        </ul>
      </div>

      {isFormOpen && (
        <GuestForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
             setIsFormOpen(false);
             handleSearch({ preventDefault: () => {} } as any);
          }}
        />
      )}
    </div>
  );
}
