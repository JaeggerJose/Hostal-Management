'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Guest } from '@/types';
import { GuestService } from '@/services/guest';
import { zhTW } from '@/lib/i18n/zh-tw';

interface GuestSearchProps {
  onSelect: (guest: Guest) => void;
  selectedGuestId?: string;
}

export default function GuestSearch({ onSelect, selectedGuestId }: GuestSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Guest[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const search = async () => {
      // Allow searching with empty query to show recent guests
      try {
        const data = await GuestService.searchGuests(query);
        setResults(data);
        // Only auto-open if we have results and (either user typed something OR it's initial load isn't quite right here)
        // Actually, we want to update results whenever query changes.
        // We control isOpen via onFocus/onBlur usually, or manual.
        if (query.length > 0) setIsOpen(true);
      } catch (error) {
        console.error('Search error', error);
      }
    };

    const debounce = setTimeout(search, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleFocus = async () => {
      // Trigger search/show results immediately on focus
      if (results.length === 0) {
          const data = await GuestService.searchGuests(query);
          setResults(data);
      }
      setIsOpen(true);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500"
          placeholder={zhTW.guest.searchPlaceholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)} // Delay hide to allow click
        />
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {results.map((guest) => (
            <li
              key={guest.id}
              className={`p-3 hover:bg-gray-50 cursor-pointer ${
                selectedGuestId === guest.id ? 'bg-teal-50' : ''
              }`}
              onClick={() => {
                onSelect(guest);
                setQuery(guest.name);
                setIsOpen(false);
              }}
            >
              <div className="font-medium">{guest.name}</div>
              <div className="text-sm text-gray-500">電話：{guest.phone || '無'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
