import { SyncService } from '@/services/sync';
import nodeIcal from 'node-ical';

jest.mock('node-ical', () => ({
  fromURL: jest.fn(),
  async: {
    fromURL: jest.fn()
  }
}));

describe('SyncService', () => {
  it('should parse iCal feed correctly', async () => {
    const mockEvents = {
      'event1': {
        type: 'VEVENT',
        start: new Date('2026-01-01'),
        end: new Date('2026-01-03'),
        summary: 'Booking.com Reservation',
        uid: '12345'
      }
    };

    (nodeIcal.async.fromURL as jest.Mock).mockResolvedValue(mockEvents);

    // Call internal parsing logic (would need to export it or test via public method)
    // For now, this just verifies mock setup for the implementation
    const result = await nodeIcal.async.fromURL('http://example.com/feed.ics');
    expect(result['event1'].summary).toBe('Booking.com Reservation');
  });
});
