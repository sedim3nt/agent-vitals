'use client';

import { useState, useEffect, useCallback } from 'react';
import { AGENTS, Agent, CronJob, GatewayData, mergeGatewayData, parseCrons } from './data';

interface UseGatewayResult {
  agents: Agent[];
  crons: CronJob[];
  gatewayOk: boolean;
  channelHealth: Record<string, { configured: boolean; running: boolean; probeOk: boolean }>;
  lastFetched: number | null;
  loading: boolean;
  error: string | null;
}

export function useGateway(intervalMs = 30_000): UseGatewayResult {
  const [data, setData] = useState<GatewayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const resp = await fetch('/api/gateway', { cache: 'no-store' });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json() as GatewayData;
      setData(json);
      setError(null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(fetchData, intervalMs);
    return () => clearInterval(timer);
  }, [fetchData, intervalMs]);

  const agents = mergeGatewayData(AGENTS, data);
  const crons = parseCrons(data);

  const channelHealth: Record<string, { configured: boolean; running: boolean; probeOk: boolean }> = {};
  if (data?.health?.channels) {
    for (const [name, ch] of Object.entries(data.health.channels)) {
      channelHealth[name] = {
        configured: ch.configured,
        running: ch.running,
        probeOk: ch.probe?.ok ?? false,
      };
    }
  }

  return {
    agents,
    crons,
    gatewayOk: data?.health?.ok ?? false,
    channelHealth,
    lastFetched: data?.fetchedAt ?? null,
    loading,
    error,
  };
}
