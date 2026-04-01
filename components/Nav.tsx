'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, BarChart3, Clock, Zap } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Fleet', icon: Activity },
  { href: '/economics', label: 'Economics', icon: BarChart3 },
  { href: '/timeline', label: 'Timeline', icon: Clock },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center h-14"
      style={{
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-[1300px] mx-auto px-6 flex items-center w-full gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 no-underline shrink-0">
          <Zap size={16} className="text-purple-400" style={{ color: '#7C5CFC' }} />
          <span className="font-bold text-sm tracking-tight" style={{ letterSpacing: '-0.02em' }}>
            <span className="gradient-text">Agent</span>
            <span style={{ color: 'rgba(245,245,245,0.85)' }}>Vitals</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-150 no-underline"
                style={{
                  color: isActive ? '#F5F5F5' : 'rgba(245,245,245,0.55)',
                  background: isActive ? 'rgba(255,255,255,0.06)' : 'transparent',
                }}
              >
                <Icon size={13} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Right side: status indicator */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs" style={{ color: 'rgba(245,245,245,0.35)' }}>
            5 online
          </span>
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: '#3DD68C',
              boxShadow: '0 0 6px #3DD68C',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <a
            href="https://github.com/sedim3nt/agent-vitals"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-2.5 py-1 rounded-md font-medium transition-all duration-150 no-underline"
            style={{
              color: 'rgba(245,245,245,0.6)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
