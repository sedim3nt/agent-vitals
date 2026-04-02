import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

interface CachedData {
  data: Record<string, unknown>;
  ts: number;
}

let cache: CachedData | null = null;
const CACHE_TTL = 30_000; // 30s

function runCmd(cmd: string): unknown | null {
  try {
    const out = execSync(cmd, { timeout: 15_000, encoding: 'utf-8' });
    return JSON.parse(out);
  } catch {
    return null;
  }
}

function fetchGatewayData(): Record<string, unknown> {
  const now = Date.now();
  if (cache && now - cache.ts < CACHE_TTL) return cache.data;

  const health = runCmd('openclaw health --json 2>/dev/null') as Record<string, unknown> | null;
  const crons = runCmd('openclaw cron list --json 2>/dev/null') as Record<string, unknown> | null;

  // Also try the dashboard API for extra stats
  let dashHealth: Record<string, unknown> | null = null;
  try {
    const resp = execSync('curl -sf http://localhost:3334/api/health 2>/dev/null', {
      timeout: 5_000,
      encoding: 'utf-8',
    });
    dashHealth = JSON.parse(resp) as Record<string, unknown>;
  } catch {
    // dashboard might not be running
  }

  const data = {
    health: health ?? { ok: false, error: 'Failed to fetch gateway health' },
    crons: crons ?? { jobs: [] },
    dashboard: dashHealth,
    fetchedAt: now,
  };

  cache = { data, ts: now };
  return data;
}

export async function GET() {
  try {
    const data = fetchGatewayData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: 'Gateway fetch failed', detail: String(err) },
      { status: 500 },
    );
  }
}
