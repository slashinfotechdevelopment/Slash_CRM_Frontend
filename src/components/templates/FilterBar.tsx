import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select, SelectOption } from '@/components/ui/Select';
import { Search } from 'lucide-react';

export interface FilterSelectConfig {
  key: string;
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string | number;
  className?: string;
}

export interface FilterBarProps {
  search?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filters?: FilterSelectConfig[];
  onFilterChange?: (key: string, value: string | number) => void;
  actions?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  search = '',
  onSearchChange,
  searchPlaceholder = 'Search records...',
  filters = [],
  onFilterChange,
  actions,
}) => {
  const [localSearch, setLocalSearch] = useState(search);

  // Debounce search update
  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== search) {
        onSearchChange?.(localSearch);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, search, onSearchChange]);

  return (
    <div className="w-full flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex flex-1 flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {onSearchChange && (
          <div className="w-full sm:max-w-xs">
            <Input
              type="text"
              placeholder={searchPlaceholder}
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>
        )}

        {filters.map((f) => (
          <div key={f.key} className={f.className || 'w-full sm:w-56'}>
            <Select
              options={f.options}
              placeholder={f.placeholder || `All ${f.key}`}
              value={f.value ?? ''}
              onChange={(e) => onFilterChange?.(f.key, e.target.value)}
            />
          </div>
        ))}
      </div>

      {actions && (
        <div className="flex items-center gap-2.5 justify-end flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          {actions}
        </div>
      )}
    </div>
  );
};
