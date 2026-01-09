import { GuestService } from '@/services/guest';
import { supabase } from '@/lib/supabase/client';

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        ilike: jest.fn(() => ({
          order: jest.fn(() => ({
            data: [],
            error: null
          }))
        })),
        eq: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {},
            error: null
          }))
        }))
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(() => ({
            data: {},
            error: null
          }))
        }))
      })),
      update: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: {},
              error: null
            }))
          }))
        }))
      }))
    }))
  }
}));

describe('GuestService', () => {
  it('should search guests', async () => {
    await GuestService.searchGuests('test');
    expect(supabase.from).toHaveBeenCalledWith('guests');
  });

  it('should create guest', async () => {
    const guest = { name: 'Test', phone: '123', email: 'test@test.com' };
    await GuestService.createGuest(guest);
    expect(supabase.from).toHaveBeenCalledWith('guests');
  });
});
