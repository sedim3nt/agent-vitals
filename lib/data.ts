// Agent Vitals — Mock Data Layer
// Designed to be replaced with real API data

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
  uptime: number; // percentage
  tasksCompleted: number;
  tasksFailed: number;
  tokensUsed24h: number;
  costPerToken: number; // USD per 1M tokens
  lastSeen: string;
  description: string;
}

export interface Task {
  id: string;
  agentId: string;
  title: string;
  status: TaskStatus;
  startedAt: string;
  completedAt?: string;
  tokensUsed: number;
  duration?: number; // seconds
  error?: string;
}

export interface TimeSeriesPoint {
  time: string;
  value: number;
}

export interface UptimeDay {
  date: string;
  uptime: number;
}

export interface AgentTokenHistory {
  agentId: string;
  history: TimeSeriesPoint[];
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

// --- Agents ---
export const AGENTS: Agent[] = [
  {
    id: 'orchard',
    name: 'Orchard',
    emoji: '🌳',
    model: 'claude-opus-4',
    role: 'Orchestrator',
    status: 'online',
    uptime: 98.7,
    tasksCompleted: 342,
    tasksFailed: 4,
    tokensUsed24h: 1_840_000,
    costPerToken: 15,
    lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    description: 'Fleet orchestrator and CEO agent. Routes tasks, manages priorities, and oversees the full agent network.',
  },
  {
    id: 'rowan',
    name: 'Rowan',
    emoji: '🌿',
    model: 'claude-sonnet-4',
    role: 'Research',
    status: 'online',
    uptime: 97.2,
    tasksCompleted: 518,
    tasksFailed: 11,
    tokensUsed24h: 920_000,
    costPerToken: 3,
    lastSeen: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    description: 'Deep research and synthesis agent. Handles web search, document analysis, and knowledge compilation.',
  },
  {
    id: 'forrest',
    name: 'Forrest',
    emoji: '🌲',
    model: 'claude-sonnet-4',
    role: 'Coding',
    status: 'online',
    uptime: 99.1,
    tasksCompleted: 289,
    tasksFailed: 8,
    tokensUsed24h: 1_100_000,
    costPerToken: 3,
    lastSeen: new Date(Date.now() - 30 * 1000).toISOString(),
    description: 'Full-stack coding agent. Implements features, reviews PRs, refactors codebases using the Blueprint pattern.',
  },
  {
    id: 'sage',
    name: 'Sage',
    emoji: '🌱',
    model: 'claude-opus-4',
    role: 'Content',
    status: 'idle',
    uptime: 94.8,
    tasksCompleted: 204,
    tasksFailed: 6,
    tokensUsed24h: 440_000,
    costPerToken: 15,
    lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    description: 'Editor-in-Chief agent. Writes, edits, and publishes content across Substack, X, and other channels.',
  },
  {
    id: 'grove',
    name: 'Grove',
    emoji: '🍃',
    model: 'claude-sonnet-4',
    role: 'Operations',
    status: 'online',
    uptime: 96.4,
    tasksCompleted: 631,
    tasksFailed: 18,
    tokensUsed24h: 680_000,
    costPerToken: 3,
    lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    description: 'Ops and journal agent. Handles scheduling, daily reviews, system monitoring, and automation maintenance.',
  },
  {
    id: 'blossom',
    name: 'Blossom',
    emoji: '🌸',
    model: 'gpt-image-1',
    role: 'Artist',
    status: 'idle',
    uptime: 91.3,
    tasksCompleted: 87,
    tasksFailed: 3,
    tokensUsed24h: 220_000,
    costPerToken: 20,
    lastSeen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    description: 'Image generation agent. Creates visuals for social media, product assets, and brand materials.',
  },
  {
    id: 'hazel',
    name: 'Hazel',
    emoji: '🌰',
    model: 'gemini-2.5-pro',
    role: 'Google Ecosystem',
    status: 'online',
    uptime: 95.6,
    tasksCompleted: 156,
    tasksFailed: 7,
    tokensUsed24h: 510_000,
    costPerToken: 7,
    lastSeen: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    description: 'Google ecosystem agent. Manages Gmail, Sheets, Drive, and integrations with the Google suite.',
  },
  {
    id: 'ash',
    name: 'Ash',
    emoji: '🔥',
    model: 'claude-sonnet-4',
    role: 'Blockchain',
    status: 'error',
    uptime: 88.9,
    tasksCompleted: 112,
    tasksFailed: 22,
    tokensUsed24h: 330_000,
    costPerToken: 3,
    lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    description: 'Blockchain and Web3 agent. Handles on-chain operations, DeFi monitoring, and wallet management.',
  },
];

// --- Generate 24h token sparkline (one point per hour) ---
function generateSparkline(base: number, variance: number, hours = 24): TimeSeriesPoint[] {
  const now = Date.now();
  return Array.from({ length: hours }, (_, i) => {
    const time = new Date(now - (hours - 1 - i) * 3600_000).toISOString();
    const jitter = (Math.random() - 0.5) * variance * 2;
    return { time, value: Math.max(0, Math.round(base + jitter)) };
  });
}

export const FLEET_TOKEN_SPARKLINE: TimeSeriesPoint[] = generateSparkline(250_000, 80_000);

// --- Task throughput per hour ---
export const TASK_THROUGHPUT: TimeSeriesPoint[] = generateSparkline(12, 6);

// --- Agent uptime (last 7 days) ---
export function getAgentUptimeHistory(agentId: string): UptimeDay[] {
  const agent = AGENTS.find(a => a.id === agentId);
  const baseUptime = agent?.uptime ?? 95;
  const days = 7;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(Date.now() - (days - 1 - i) * 86_400_000);
    const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const noise = (Math.random() - 0.5) * 8;
    return { date, uptime: Math.min(100, Math.max(50, baseUptime + noise)) };
  });
}

// --- Agent token usage over last 24h ---
export function getAgentTokenHistory(agentId: string): TimeSeriesPoint[] {
  const agent = AGENTS.find(a => a.id === agentId);
  const base = (agent?.tokensUsed24h ?? 500_000) / 24;
  return generateSparkline(base, base * 0.5);
}

// --- Recent tasks per agent ---
const TASK_TITLES: Record<string, string[]> = {
  orchard: ['Route research task to Rowan', 'Spawn coding sub-agent', 'Daily fleet review', 'Prioritize issue queue', 'Coordinate cross-agent workflow'],
  rowan: ['Research competitor pricing', 'Summarize arXiv papers', 'Fetch market data', 'Analyze GitHub issues', 'Web search: AI regulation'],
  forrest: ['Implement auth flow', 'Fix failing tests', 'Refactor API routes', 'Code review PR #42', 'Build dashboard component'],
  sage: ['Write Substack post', 'Edit weekly newsletter', 'Draft X thread', 'Review content calendar', 'Publish blog article'],
  grove: ['Run nightly review', 'Monitor system health', 'Update MEMORY.md', 'Schedule weekly tasks', 'Generate daily report'],
  blossom: ['Generate hero image', 'Create social graphic', 'Batch resize assets', 'Design thumbnail', 'Art-direct product screenshot'],
  hazel: ['Sync Gmail inbox', 'Update Google Sheet', 'Calendar event management', 'Drive folder organization', 'Gemini API test'],
  ash: ['Check wallet balance', 'Monitor LP position', 'Sign transaction', 'Fetch on-chain data', 'Gas price alert'],
};

export function getAgentTasks(agentId: string): Task[] {
  const titles = TASK_TITLES[agentId] ?? ['Unknown task'];
  const agent = AGENTS.find(a => a.id === agentId);
  const failRate = (agent?.tasksFailed ?? 5) / Math.max(1, (agent?.tasksCompleted ?? 100) + (agent?.tasksFailed ?? 5));

  return Array.from({ length: 10 }, (_, i) => {
    const isRunning = i === 0 && agent?.status === 'online';
    const isFailed = !isRunning && Math.random() < failRate;
    const start = new Date(Date.now() - (i * 3.5 + Math.random() * 2) * 3600_000);
    const duration = Math.floor(30 + Math.random() * 300);

    return {
      id: `${agentId}-task-${i}`,
      agentId,
      title: titles[i % titles.length],
      status: isRunning ? 'running' : isFailed ? 'failed' : 'success',
      startedAt: start.toISOString(),
      completedAt: isRunning ? undefined : new Date(start.getTime() + duration * 1000).toISOString(),
      tokensUsed: Math.floor(5_000 + Math.random() * 80_000),
      duration: isRunning ? undefined : duration,
      error: isFailed ? 'RateLimitError: API quota exceeded' : undefined,
    };
  });
}

// --- Error log per agent ---
export function getAgentErrors(agentId: string): { timestamp: string; message: string; code: string }[] {
  const agent = AGENTS.find(a => a.id === agentId);
  if (!agent || agent.tasksFailed === 0) return [];

  const errors = [
    { code: 'RATE_LIMIT', message: 'API rate limit exceeded — retried after 60s' },
    { code: 'TIMEOUT', message: 'Task execution exceeded 5m timeout' },
    { code: 'TOOL_ERROR', message: 'exec() returned non-zero exit code' },
    { code: 'CONTEXT_OVERFLOW', message: 'Context window exceeded — truncated input' },
    { code: 'AUTH_FAIL', message: 'Token refresh failed — re-authenticating' },
  ];

  return Array.from({ length: Math.min(agent.tasksFailed, 5) }, (_, i) => ({
    timestamp: new Date(Date.now() - (i * 6 + Math.random() * 4) * 3600_000).toISOString(),
    ...errors[i % errors.length],
  }));
}

// --- Agent config (mock AGENTS.md) ---
export function getAgentConfig(agentId: string): string {
  const agent = AGENTS.find(a => a.id === agentId);
  if (!agent) return '';
  return `# ${agent.emoji} ${agent.name} — ROLE.md

## Identity
- **Name:** ${agent.name}
- **Model:** ${agent.model}
- **Role:** ${agent.role}
- **Status:** ${agent.status}

## Mission
${agent.description}

## Capabilities
- Autonomous task execution
- Tool use: exec, web_search, web_fetch, read, write, edit
- Memory: reads/writes memory/YYYY-MM-DD.md daily
- Reports to: Orchard (orchestrator)

## Constraints
- Never perform financial transactions without approval
- Ask before destructive file operations
- No external messaging without explicit authorization
- Escalate when uncertain about safety

## Current Priorities
1. Maintain fleet health monitoring
2. Process task queue
3. Report blockers to Orchard within 1 hour
`;
}

// --- Timeline events ---
const EVENT_TEMPLATES = [
  { type: 'task_complete' as const, severity: 'success' as const, template: (a: Agent) => `Completed: ${TASK_TITLES[a.id]?.[0] ?? 'task'}` },
  { type: 'task_failed' as const, severity: 'error' as const, template: (a: Agent) => `Failed: ${TASK_TITLES[a.id]?.[1] ?? 'task'} — RateLimitError` },
  { type: 'task_started' as const, severity: 'info' as const, template: (a: Agent) => `Started: ${TASK_TITLES[a.id]?.[2] ?? 'task'}` },
  { type: 'error' as const, severity: 'error' as const, template: (_a: Agent) => `Error: Context window exceeded` },
  { type: 'status_change' as const, severity: 'warning' as const, template: (a: Agent) => `Status changed to ${a.status}` },
  { type: 'task_complete' as const, severity: 'success' as const, template: (a: Agent) => `Completed: ${TASK_TITLES[a.id]?.[3] ?? 'task'}` },
];

export function getTimelineEvents(limit = 50): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const now = Date.now();

  for (let i = 0; i < limit; i++) {
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const tpl = EVENT_TEMPLATES[Math.floor(Math.random() * EVENT_TEMPLATES.length)];
    events.push({
      id: `evt-${i}`,
      agentId: agent.id,
      agentName: agent.name,
      agentEmoji: agent.emoji,
      type: tpl.type,
      message: tpl.template(agent),
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
    efficiency: parseFloat((a.tasksCompleted / Math.max(0.01, (a.tokensUsed24h / 1_000_000) * a.costPerToken)).toFixed(1)),
  })).sort((a, b) => b.cost - a.cost);
}

export function getFleetStats() {
  const totalAgents = AGENTS.length;
  const activeNow = AGENTS.filter(a => a.status === 'online').length;
  const errorsToday = AGENTS.reduce((sum, a) => sum + a.tasksFailed, 0);
  const tokensTotal = AGENTS.reduce((sum, a) => sum + a.tokensUsed24h, 0);
  const totalCost = AGENTS.reduce((sum, a) => sum + (a.tokensUsed24h / 1_000_000) * a.costPerToken, 0);

  return { totalAgents, activeNow, errorsToday, tokensTotal, totalCost };
}
