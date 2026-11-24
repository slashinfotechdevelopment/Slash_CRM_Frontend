import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { cn } from '@/utils/cn';
import { ChevronDown, Search, Check, X } from 'lucide-react';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: SelectOption[];
  placeholder?: string;
  value?: string | number | readonly string[];
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  searchable?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      options,
      placeholder = 'Select...',
      id,
      required,
      value,
      defaultValue,
      onChange,
      disabled,
      name,
      searchable = true,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const hiddenSelectRef = useRef<HTMLSelectElement | null>(null);

    // Synchronize forwarded ref and local ref
    const setSelectRef = useCallback(
      (element: HTMLSelectElement | null) => {
        hiddenSelectRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLSelectElement | null>).current = element;
        }
      },
      [ref]
    );

    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    // Current selected value string
    const currentValue = useMemo(() => {
      if (value !== undefined && value !== null) return String(value);
      if (defaultValue !== undefined && defaultValue !== null) return String(defaultValue);
      return '';
    }, [value, defaultValue]);

    // Currently selected option
    const selectedOption = useMemo(() => {
      return options.find((opt) => String(opt.value) === currentValue);
    }, [options, currentValue]);

    // Filtered options based on search query
    const filteredOptions = useMemo(() => {
      if (!searchTerm.trim()) return options;
      const term = searchTerm.toLowerCase().trim();
      return options.filter((opt) => String(opt.label).toLowerCase().includes(term));
    }, [options, searchTerm]);

    // Close when clicking outside
    useEffect(() => {
      if (!isOpen) return;

      const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
          setSearchTerm('');
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    // Auto-focus search input when opening
    useEffect(() => {
      if (isOpen && searchable) {
        const timer = setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
        return () => clearTimeout(timer);
      } else {
        setSearchTerm('');
      }
    }, [isOpen, searchable]);

    // Handle selecting an option
    const handleSelectOption = (opt: SelectOption) => {
      const stringValue = String(opt.value);
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = stringValue;
      }

      if (onChange) {
        const syntheticEvent = {
          target: { value: stringValue, name },
          currentTarget: { value: stringValue, name },
          persist: () => {},
          preventDefault: () => {},
          stopPropagation: () => {},
        } as unknown as React.ChangeEvent<HTMLSelectElement>;

        onChange(syntheticEvent);
      }

      setIsOpen(false);
      setSearchTerm('');
    };

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (disabled) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSearchTerm('');
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (!isOpen) {
          e.preventDefault();
          setIsOpen(true);
        }
      }
    };

    return (
      <div className="w-full flex flex-col gap-1.5" ref={containerRef} onKeyDown={handleKeyDown}>
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold text-slate-700 select-none">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Hidden native select for form accessibility and ref passing */}
          <select
            id={selectId}
            ref={setSelectRef}
            required={required}
            disabled={disabled}
            name={name}
            value={currentValue}
            onChange={onChange}
            className="sr-only pointer-events-none absolute h-0 w-0 opacity-0"
            tabIndex={-1}
            aria-hidden="true"
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Trigger button */}
          <button
            type="button"
            disabled={disabled}
            onClick={() => !disabled && setIsOpen((prev) => !prev)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            className={cn(
              'w-full min-h-[38px] px-3 py-1.5 text-xs text-left bg-white border rounded-lg',
              'transition-all duration-150 flex items-center justify-between gap-2',
              'focus:outline-none focus:ring-2 focus:ring-offset-1',
              error
                ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
                : 'border-slate-200 hover:border-slate-300 focus:border-brand-primary focus:ring-brand-primary/20',
              disabled && 'bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200',
              isOpen && 'border-brand-primary ring-2 ring-brand-primary/20',
              className
            )}
          >
            <span
              className={cn(
                'truncate flex-1',
                selectedOption && selectedOption.value !== '' ? 'text-slate-900 font-medium' : 'text-slate-400'
              )}
            >
              {selectedOption && selectedOption.value !== '' ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={cn('w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-150', isOpen && 'rotate-180')}
            />
          </button>

          {/* Dropdown Popover */}
          {isOpen && (
            <div
              className={cn(
                'absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg',
                'animate-in fade-in-50 zoom-in-95 duration-100 flex flex-col overflow-hidden',
                'max-h-72'
              )}
            >
              {/* Sticky Search Bar */}
              {searchable && (
                <div className="p-1.5 border-b border-slate-100 bg-slate-50/90 sticky top-0 z-10">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search options..."
                      className="w-full pl-8 pr-7 py-1 text-xs bg-white border border-slate-200 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary/30"
                      onClick={(e) => e.stopPropagation()}
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchTerm('');
                          searchInputRef.current?.focus();
                        }}
                        className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Options List */}
              <div className="overflow-y-auto max-h-64 p-1 divide-y divide-slate-50">
                {filteredOptions.length === 0 ? (
                  <div className="px-3 py-3 text-xs text-slate-400 text-center select-none">
                    No matching results found
                  </div>
                ) : (
                  filteredOptions.map((opt) => {
                    const isSelected = String(opt.value) === currentValue;
                    return (
                      <div
                        key={opt.value}
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleSelectOption(opt)}
                        className={cn(
                          'px-2.5 py-1.5 text-xs rounded-md cursor-pointer flex items-center justify-between gap-2 transition-colors select-none',
                          isSelected
                            ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                            : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                        )}
                      >
                        <span className="truncate">{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-primary flex-shrink-0" />}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
