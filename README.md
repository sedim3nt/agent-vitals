# Agent Vitals

Real-time monitoring dashboard for the SpiritTree agent fleet.

**Live:** [vitals.spirittree.dev](https://vitals.spirittree.dev)
**Stack:** Next.js, TailwindCSS, Recharts, Lucide, OpenClaw Gateway
**Status:** Active

## What This Is

Agent Vitals is an operational dashboard that monitors the health and status of SpiritTree's multi-agent fleet. It pulls live data from the OpenClaw gateway to display agent status, task throughput, token usage sparklines, and cron job schedules.

Think of it as mission control for an AI swarm — at a glance you can see which agents are online, which are erroring, what tasks are running, and whether the gateway is healthy. It auto-generates a plain-English status summary from the live data.

## Features

- 🤖 **Agent Cards** — real-time status for each agent (online/idle/error/offline)
- 📊 **Fleet Statistics** — token usage, throughput, and activity metrics
- 📈 **Sparkline Charts** — token usage trends over time
- ⏱️ **Cron Table** — scheduled task monitoring
- 🔄 **Live Gateway Data** — pulls from OpenClaw gateway API with 30s cache
- 📝 **Auto-generated Status Summary** — plain-English health report

## AI Integration

None — this dashboard monitors AI agents but doesn't use AI itself. Data comes from the OpenClaw gateway.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animation:** Framer Motion
- **Database:** None (live gateway queries)
- **AI:** None
- **Hosting:** Vercel

## Local Development

```bash
npm install
npm run dev
```

## Environment Variables

None required — connects to the local OpenClaw gateway.

## Part of SpiritTree

This project is part of the [SpiritTree](https://spirittree.dev) ecosystem — an autonomous AI operation building tools for the agent economy and displaced workers.

## License

MIT
