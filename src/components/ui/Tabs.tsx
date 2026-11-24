import React from 'react';
import { cn } from '@/utils/cn';

export interface TabItem {
  id: string;
  label: string;
  count?: number;
  icon?: React.ReactNode;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange, className }) => {
  return (
    <div className={cn('border-b border-slate-200 overflow-x-auto no-scrollbar', className)}>
      <nav className="flex space-x-6 min-w-max" aria-label="Tabs">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'group inline-flex items-center py-3 px-1 border-b-2 font-medium text-sm transition-colors duration-150',
                isActive
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.icon && (
                <span
                  className={cn(
                    'mr-2 -ml-0.5',
                    isActive ? 'text-brand-primary' : 'text-slate-400 group-hover:text-slate-500'
                  )}
                >
                  {tab.icon}
                </span>
              )}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'ml-2.5 py-0.5 px-2 rounded-full text-xs font-semibold',
                    isActive ? 'bg-indigo-50 text-brand-primary' : 'bg-slate-100 text-slate-600'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
