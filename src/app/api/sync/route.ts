import { NextResponse } from 'next/server';
import { SyncService } from '@/services/sync';

export async function POST(request: Request) {
  try {
    // Check for cron secret authorization (optional but recommended for Vercel Cron)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const result = await SyncService.syncAll();
    
    return NextResponse.json({
      success: true,
      synced_count: result.syncedCount,
      conflicts: result.conflicts
    });
  } catch (error) {
    console.error('Sync failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
