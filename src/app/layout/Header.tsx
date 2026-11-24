import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, ExternalLink, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();
  const firstName = user?.name ? user.name.split(' ')[0] : 'Member';

  const todayStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between flex-shrink-0 sticky top-0 z-30">
      {/* Left: Mobile hamburger & Greetings */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-1.5 leading-tight">
            Hi {firstName} <span className="inline-block animate-wave">👋</span>
          </h2>
          <p className="text-xs text-slate-400 hidden sm:block">
            {todayStr} • Welcome back to Slash CRM
          </p>
        </div>
      </div>

      {/* Right: Role indicator & Public Inquire shortcut */}
      <div className="flex items-center gap-3">
        {user?.role && (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700">
            <Shield className="w-3.5 h-3.5 text-brand-primary" />
            <span>{user.role}</span>
          </div>
        )}

        <Link
          to="/inquire"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
        >
          <span>Public Lead Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </header>
  );
};
