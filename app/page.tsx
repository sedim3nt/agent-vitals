'use client';

import { FLEET_TOKEN_SPARKLINE, TASK_THROUGHPUT, getFleetStats } from '@/lib/data';
import { useGateway } from '@/lib/useGateway';
import { AgentCard } from '@/components/AgentCard';
import { StatCard } from '@/components/StatCard';
import { SparklineChart } from '@/components/SparklineChart';
import { ThroughputChart } from '@/components/ThroughputChart';
import { CronTable } from '@/components/CronTable';
import { Activity, Cpu, AlertTriangle, Zap, Radio, Server } from 'lucide-react';

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

function timeAgo(ts: number | null): string {
  if (!ts) return 'never';
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'just now';
  if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3600_000)}h ago`;
}

export default function Dashboard() {
  const { agents, crons, gatewayOk, channelHealth, lastFetched, loading } = useGateway();
  const stats = getFleetStats(agents);

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-8">
      {/* Page header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1" style={{ letterSpacing: '-0.03em' }}>
            <span className="gradient-text">Fleet Overview</span>
          </h1>
          <p className="text-sm" style={{ color: 'rgba(245,245,245,0.45)' }}>
            {loading ? 'Connecting to gateway…' : (
              <>
                {stats.totalAgents} agents · {stats.sessions} sessions · Updated {timeAgo(lastFetched)}
              </>
            )}
          </p>
        </div>

        {/* Gateway status pill */}
        <div className="flex items-center gap-2">
          {Object.entries(channelHealth).map(([name, ch]) => (
            <div
              key={name}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{
                background: ch.probeOk ? 'rgba(61,214,140,0.1)' : 'rgba(245,101,101,0.1)',
                color: ch.probeOk ? '#3DD68C' : '#F56565',
              }}
            >
              <Radio size={10} />
              {name}
            </div>
          ))}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
            style={{
              background: gatewayOk ? 'rgba(61,214,140,0.1)' : 'rgba(245,101,101,0.1)',
              color: gatewayOk ? '#3DD68C' : '#F56565',
            }}
          >
            <Server size={10} />
            Gateway
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          label="Total Agents"
          value={stats.totalAgents}
          icon={<Cpu size={14} />}
        />
        <StatCard
          label="Active Now"
          value={stats.activeNow}
          sub={`${stats.totalAgents - stats.activeNow} idle or offline`}
          icon={<Activity size={14} />}
          accent
        />
        <StatCard
          label="Cron Errors"
          value={crons.filter(c => c.consecutiveErrors > 0).length}
          sub={`of ${crons.length} total crons`}
          icon={<AlertTriangle size={14} />}
        />
        <StatCard
          label="Sessions"
          value={stats.sessions}
          sub="across all agents"
          icon={<Zap size={14} />}
          accent
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="card-glass p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Token Burn</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(245,245,245,0.4)' }}>24h rolling — all agents</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(124,92,252,0.12)', color: '#7C5CFC' }}>
              {formatTokens(stats.tokensTotal)} total
            </span>
          </div>
          <SparklineChart data={FLEET_TOKEN_SPARKLINE} color="#7C5CFC" height={80} showTooltip />
        </div>

        <div className="card-glass p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold" style={{ color: '#F5F5F5' }}>Task Throughput</div>
              <div className="text-xs mt-0.5" style={{ color: 'rgba(245,245,245,0.4)' }}>Tasks/hour, last 24h</div>
            </div>
            <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(78,168,222,0.12)', color: '#4EA8DE' }}>
              live
            </span>
          </div>
          <ThroughputChart data={TASK_THROUGHPUT} />
        </div>
      </div>

      {/* Agent grid */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold" style={{ color: 'rgba(245,245,245,0.7)', letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: '11px' }}>
          Agent Roster
        </h2>
        <span className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>
          Click an agent for details
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 mb-10">
        {agents.map(agent => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Cron Jobs */}
      {crons.length > 0 && <CronTable crons={crons} />}
    </div>
  );
}
