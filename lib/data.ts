// Agent Vitals — Live Data Layer
// Fetches from /api/gateway, falls back to static definitions

export type AgentStatus = 'online' | 'idle' | 'error' | 'offline';
export type TaskStatus = 'success' | 'failed' | 'running';
export type EventSeverity = 'info' | 'warning' | 'error' | 'success';

export interface Agent {
  id: string;
  name: string;
  emoji: string;
  model: string;
  role: string;
  status: AgentStatus;
  uptime: number;
  tasksCompleted: number;
  tasksFailed: number;
  tokensUsed24h: number;
  costPerToken: number;
  lastSeen: string;
  description: string;
  sessionCount?: number;
  heartbeatEnabled?: boolean;
  gatewayAgentId?: string;
}

export interface Task {
  id: string;
  agentId: string;
  title: string;
  status: TaskStatus;
  startedAt: string;
  completedAt?: string;
  tokensUsed: number;
  duration?: number;
  error?: string;
}

export interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: string;
  lastStatus: string;
  lastRunAt: string | null;
  nextRunAt: string | null;
  consecutiveErrors: number;
  lastError?: string;
  sessionTarget: string;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
}

export interface UptimeDay {
  date: string;
  uptime: number;
}

export interface TimelineEvent {
  id: string;
  agentId: string;
  agentName: string;
  agentEmoji: string;
  type: 'task_complete' | 'task_failed' | 'task_started' | 'error' | 'status_change' | 'config_update';
  message: string;
  severity: EventSeverity;
  timestamp: string;
  meta?: Record<string, string | number>;
}

// --- Real Agent Definitions ---
export const AGENTS: Agent[] = [
  {
    id: 'sedim3nt',
    name: 'Sedim3nt',
    emoji: '🦋',
    model: 'claude-opus-4',
    role: 'Orchestrator / CEO',
    status: 'online',
    uptime: 99.2,
    tasksCompleted: 0,
    tasksFailed: 0,
    tokensUsed24h: 0,
    costPerToken: 15,
    lastSeen: new Date().toISOString(),
    description: 'Primary orchestrator and fleet CEO. Routes tasks, manages priorities, runs heartbeats and nightly reviews.',
    gatewayAgentId: 'main',
  },
  {
    id: 'riptid3',
    name: 'Riptid3',
    emoji: '🌊',
    model: 'claude-sonnet-4',
    role: 'Research',
    status: 'offline',
    uptime: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    tokensUsed24h: 0,
    costPerToken: 3,
    lastSeen: '',
    description: 'Deep research and synthesis agent. Web search, document analysis, competitor intelligence, knowledge compilation.',
    gatewayAgentId: 'research',
  },
  {
    id: 'granit3',
    name: 'Granit3',
    emoji: '🪨',
    model: 'claude-sonnet-4',
    role: 'Coding (Blueprint)',
    status: 'offline',
    uptime: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    tokensUsed24h: 0,
    costPerToken: 3,
    lastSeen: '',
    description: 'Full-stack coding agent. Implements features via the Blueprint pattern: design brief → reference study → LLM loop → deterministic checks.',
    gatewayAgentId: 'coding',
  },
  {
    id: 'glaci3r',
    name: 'Glaci3r',
    emoji: '🐯',
    model: 'claude-opus-4',
    role: 'Content (Editor-in-Chief)',
    status: 'offline',
    uptime: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    tokensUsed24h: 0,
    costPerToken: 15,
    lastSeen: '',
    description: 'Editor-in-Chief. Writes, edits, and publishes content across Substack, X, Bluesky, and other channels.',
    gatewayAgentId: 'content',
  },
  {
    id: 'tid3pool',
    name: 'Tid3pool',
    emoji: '🫧',
    model: 'claude-sonnet-4',
    role: 'Ops / Journal',
    status: 'offline',
    uptime: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    tokensUsed24h: 0,
    costPerToken: 3,
    lastSeen: '',
    description: 'Operations and journal agent. Handles scheduling, daily reviews, system monitoring, and automation maintenance.',
    gatewayAgentId: 'ops',
  },
  {
    id: 'pigm3nt',
    name: 'Pigm3nt',
    emoji: '🎨',
    model: 'gpt-image-1',
    role: 'Image Generation',
    status: 'offline',
    uptime: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    tokensUsed24h: 0,
    costPerToken: 20,
    lastSeen: '',
    description: 'Image generation agent. Creates visuals for social media, product assets, and brand materials via gpt-image-1.',
    gatewayAgentId: 'artist',
  },
  {
    id: 'br3eze',
    name: 'Br3eze',
    emoji: '💨',
    model: 'gemini-2.5-pro',
    role: 'Google Ecosystem',
    status: 'offline',
    uptime: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    tokensUsed24h: 0,
    costPerToken: 7,
    lastSeen: '',
    description: 'Google ecosystem agent. Manages Gmail, Sheets, Drive, and integrations via Gemini CLI.',
  },
  {
    id: 'eth3r',
    name: 'Eth3r',
    emoji: '⛓️',
    model: 'claude-sonnet-4',
    role: 'Blockchain',
    status: 'offline',
    uptime: 0,
    tasksCompleted: 0,
    tasksFailed: 0,
    tokensUsed24h: 0,
    costPerToken: 3,
    lastSeen: '',
    description: 'Blockchain and Web3 agent. Handles on-chain operations, attestations, and wallet management on Base.',
  },
];

// --- Gateway Data Types ---
interface GatewayAgent {
  agentId: string;
  isDefault?: boolean;
  heartbeat?: {
    enabled: boolean;
    every: string;
  };
  sessions?: {
    count: number;
    recent?: Array<{
      key: string;
      updatedAt: number;
      age: number;
    }>;
  };
}

interface GatewayCronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: { kind: string; expr: string; tz?: string };
  sessionTarget: string;
  state?: {
    lastStatus?: string;
    lastRunAtMs?: number;
    nextRunAtMs?: number;
    consecutiveErrors?: number;
    lastError?: string;
    lastDurationMs?: number;
  };
}

export interface GatewayData {
  health?: {
    ok: boolean;
    agents?: GatewayAgent[];
    channels?: Record<string, { configured: boolean; running: boolean; probe?: { ok: boolean } }>;
  };
  crons?: { jobs: GatewayCronJob[] };
  dashboard?: {
    services?: Record<string, string>;
  };
  fetchedAt?: number;
}

// --- Merge gateway data into agents ---
export function mergeGatewayData(agents: Agent[], gw: GatewayData | null): Agent[] {
  if (!gw?.health?.agents) return agents;

  const gwMap = new Map<string, GatewayAgent>();
  for (const ga of gw.health.agents) {
    gwMap.set(ga.agentId, ga);
  }

  // Build cron error map: which agents have cron errors?
  const cronErrorAgents = new Set<string>();
  if (gw.crons?.jobs) {
    for (const job of gw.crons.jobs) {
      if ((job.state?.consecutiveErrors ?? 0) > 0) {
        // Map session target to agent
        cronErrorAgents.add(job.sessionTarget === 'isolated' ? 'main' : job.sessionTarget);
      }
    }
  }

  return agents.map(agent => {
    const ga = agent.gatewayAgentId ? gwMap.get(agent.gatewayAgentId) : undefined;
    if (!ga) return agent;

    const sessionCount = ga.sessions?.count ?? 0;
    const recentSession = ga.sessions?.recent?.[0];
    const lastActivityAgeMs = recentSession?.age ?? Infinity;

    // Derive status
    let status: AgentStatus = 'offline';
    if (sessionCount > 0 && lastActivityAgeMs < 15 * 60 * 1000) {
      status = 'online';
    } else if (sessionCount > 0) {
      status = 'idle';
    }
    // Override: cron errors
    if (agent.gatewayAgentId && cronErrorAgents.has(agent.gatewayAgentId)) {
      status = 'error';
    }

    const lastSeen = recentSession
      ? new Date(recentSession.updatedAt).toISOString()
      : agent.lastSeen;

    return {
      ...agent,
      status,
      sessionCount,
      heartbeatEnabled: ga.heartbeat?.enabled ?? false,
      lastSeen,
    };
  });
}

// --- Parse crons from gateway ---
export function parseCrons(gw: GatewayData | null): CronJob[] {
  if (!gw?.crons?.jobs) return [];
  return gw.crons.jobs.map(j => ({
    id: j.id,
    name: j.name,
    enabled: j.enabled,
    schedule: j.schedule.expr + (j.schedule.tz ? ` (${j.schedule.tz})` : ''),
    lastStatus: j.state?.lastStatus ?? 'unknown',
    lastRunAt: j.state?.lastRunAtMs ? new Date(j.state.lastRunAtMs).toISOString() : null,
    nextRunAt: j.state?.nextRunAtMs ? new Date(j.state.nextRunAtMs).toISOString() : null,
    consecutiveErrors: j.state?.consecutiveErrors ?? 0,
    lastError: j.state?.lastError,
    sessionTarget: j.sessionTarget,
  }));
}

// --- Generate 24h sparkline (still synthetic, no real token data yet) ---
function generateSparkline(base: number, variance: number, hours = 24): TimeSeriesPoint[] {
  const now = Date.now();
  return Array.from({ length: hours }, (_, i) => {
    const time = new Date(now - (hours - 1 - i) * 3600_000).toISOString();
    const jitter = (Math.random() - 0.5) * variance * 2;
    return { time, value: Math.max(0, Math.round(base + jitter)) };
  });
}

export const FLEET_TOKEN_SPARKLINE: TimeSeriesPoint[] = generateSparkline(250_000, 80_000);
export const TASK_THROUGHPUT: TimeSeriesPoint[] = generateSparkline(12, 6);

export function getAgentUptimeHistory(_agentId: string): UptimeDay[] {
  const days = 7;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86_400_000);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const noise = (Math.random() - 0.5) * 8;
    return { date, uptime: Math.min(100, Math.max(80, 95 + noise)) };
  });
}

export function getAgentTokenHistory(_agentId: string): TimeSeriesPoint[] {
  return generateSparkline(20_000, 10_000);
}

// --- Tasks (synthetic until we have real task tracking) ---
const TASK_TITLES: Record<string, string[]> = {
  sedim3nt: ['Heartbeat check', 'Route task to sub-agent', 'Nightly review', 'Prioritize issue queue', 'Coordinate workflow'],
  riptid3: ['Research competitor pricing', 'Summarize papers', 'Fetch market data', 'Analyze GitHub issues', 'Web research'],
  granit3: ['Implement feature', 'Fix failing tests', 'Blueprint: design brief', 'Code review', 'Build component'],
  glaci3r: ['Write Substack post', 'Edit newsletter', 'Draft X thread', 'Content calendar', 'Publish article'],
  tid3pool: ['Run nightly review', 'Monitor system health', 'Update MEMORY.md', 'Schedule tasks', 'Daily report'],
  pigm3nt: ['Generate hero image', 'Create social graphic', 'Batch resize assets', 'Design thumbnail', 'Product screenshot'],
  br3eze: ['Sync Gmail inbox', 'Update Google Sheet', 'Calendar management', 'Drive organization', 'Gemini task'],
  eth3r: ['Check wallet balance', 'Monitor attestations', 'Sign transaction', 'Fetch on-chain data', 'Gas price alert'],
};

export function getAgentTasks(agentId: string): Task[] {
  const titles = TASK_TITLES[agentId] ?? ['Unknown task'];
  const agent = AGENTS.find(a => a.id === agentId);
  const isOnline = agent?.status === 'online';

  return Array.from({ length: 8 }, (_, i) => {
    const isRunning = i === 0 && isOnline;
    const isFailed = !isRunning && Math.random() < 0.08;
    const start = new Date(Date.now() - (i * 3.5 + Math.random() * 2) * 3600_000);
    const duration = Math.floor(30 + Math.random() * 300);

    return {
      id: `${agentId}-task-${i}`,
      agentId,
      title: titles[i % titles.length],
      status: isRunning ? 'running' : isFailed ? 'failed' : 'success',
      startedAt: start.toISOString(),
      completedAt: isRunning ? undefined : new Date(start.getTime() + duration * 1000).toISOString(),
      tokensUsed: Math.floor(5_000 + Math.random() * 40_000),
      duration: isRunning ? undefined : duration,
      error: isFailed ? 'Task execution timed out' : undefined,
    };
  });
}

export function getAgentErrors(agentId: string): { timestamp: string; message: string; code: string }[] {
  const agent = AGENTS.find(a => a.id === agentId);
  if (!agent || agent.status !== 'error') return [];

  return [
    {
      timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
      code: 'CRON_ERROR',
      message: 'Associated cron job has consecutive errors',
    },
  ];
}

export function getAgentConfig(agentId: string): string {
  const agent = AGENTS.find(a => a.id === agentId);
  if (!agent) return '';
  return `# ${agent.emoji} ${agent.name} — ROLE.md

## Identity
- **Name:** ${agent.name}
- **Model:** ${agent.model}
- **Role:** ${agent.role}
- **Gateway Agent ID:** ${agent.gatewayAgentId ?? 'none'}

## Mission
${agent.description}

## Capabilities
- Autonomous task execution
- Tool use: exec, web_search, web_fetch, read, write, edit
- Memory: reads/writes memory/YYYY-MM-DD.md daily
- Reports to: Sedim3nt (orchestrator)

## Constraints
- Never perform financial transactions without approval
- Ask before destructive file operations
- No external messaging without explicit authorization
- Escalate when uncertain about safety
`;
}

// --- Timeline events ---
export function getTimelineEvents(limit = 50): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const now = Date.now();
  const templates: Array<{ type: TimelineEvent['type']; severity: EventSeverity; msg: (a: Agent) => string }> = [
    { type: 'task_complete', severity: 'success', msg: (a) => `Completed: ${(TASK_TITLES[a.id] ?? ['task'])[0]}` },
    { type: 'task_failed', severity: 'error', msg: (a) => `Failed: ${(TASK_TITLES[a.id] ?? ['task'])[1]}` },
    { type: 'task_started', severity: 'info', msg: (a) => `Started: ${(TASK_TITLES[a.id] ?? ['task'])[2]}` },
    { type: 'status_change', severity: 'warning', msg: (a) => `Status → ${a.status}` },
    { type: 'task_complete', severity: 'success', msg: (a) => `Completed: ${(TASK_TITLES[a.id] ?? ['task'])[3]}` },
  ];

  for (let i = 0; i < limit; i++) {
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const tpl = templates[Math.floor(Math.random() * templates.length)];
    events.push({
      id: `evt-${i}`,
      agentId: agent.id,
      agentName: agent.name,
      agentEmoji: agent.emoji,
      type: tpl.type,
      message: tpl.msg(agent),
      severity: tpl.severity,
      timestamp: new Date(now - i * 180_000 - Math.random() * 120_000).toISOString(),
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// --- Economics ---
export const MODEL_COSTS: { model: string; tokens: number; costPerM: number; color: string }[] = [
  { model: 'claude-opus-4', tokens: 2_280_000, costPerM: 15, color: '#7C5CFC' },
  { model: 'claude-sonnet-4', tokens: 3_030_000, costPerM: 3, color: '#4EA8DE' },
  { model: 'gpt-image-1', tokens: 220_000, costPerM: 20, color: '#F5A524' },
  { model: 'gemini-2.5-pro', tokens: 510_000, costPerM: 7, color: '#3DD68C' },
];

export function getModelCosts() {
  return MODEL_COSTS.map(m => ({
    ...m,
    cost: parseFloat(((m.tokens / 1_000_000) * m.costPerM).toFixed(2)),
  }));
}

export function getAgentCosts() {
  return AGENTS.map(a => ({
    id: a.id,
    name: a.name,
    emoji: a.emoji,
    cost: parseFloat(((a.tokensUsed24h / 1_000_000) * a.costPerToken).toFixed(2)),
    tokens: a.tokensUsed24h,
    tasks: a.tasksCompleted,
    efficiency: 0,
  })).sort((a, b) => b.cost - a.cost);
}

export function getFleetStats(agents?: Agent[]) {
  const list = agents ?? AGENTS;
  const totalAgents = list.length;
  const activeNow = list.filter(a => a.status === 'online').length;
  const errorsToday = list.filter(a => a.status === 'error').length;
  const tokensTotal = list.reduce((sum, a) => sum + a.tokensUsed24h, 0);
  const totalCost = list.reduce((sum, a) => sum + (a.tokensUsed24h / 1_000_000) * a.costPerToken, 0);
  const sessions = list.reduce((sum, a) => sum + (a.sessionCount ?? 0), 0);

  return { totalAgents, activeNow, errorsToday, tokensTotal, totalCost, sessions };
}
