import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

/**
 * Cron job endpoint for automated job searching
 * Triggered by Vercel Cron Jobs every 6 hours
 */
export async function GET(request: NextRequest) {
  // Verify cron secret to prevent unauthorized access
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    // Call the API Bridge to trigger cron job
    const apiBridgeUrl = process.env.API_BRIDGE_URL || 'https://carmen.neuralflow.space';
    const apiBridgeKey = process.env.API_BRIDGE_KEY;

    if (!apiBridgeKey) {
      throw new Error('API_BRIDGE_KEY not configured');
    }

    const response = await fetch(`${apiBridgeUrl}/api/cron/job-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Cron-Secret': apiBridgeKey
      },
      body: JSON.stringify({
        trigger: 'cron',
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`API Bridge responded with ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Job search completed',
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Cron job error:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Allow HEAD requests for health checks
export async function HEAD(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (authHeader !== `Bearer ${cronSecret}`) {
    return new NextResponse(null, { status: 401 });
  }

  return new NextResponse(null, { status: 200 });
}
