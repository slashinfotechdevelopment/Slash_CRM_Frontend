import React from 'react';
import { cn } from '@/utils/cn';

export interface ColumnDef<T> {
  header: React.ReactNode;
  accessorKey?: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  headerClassName?: string;
  hideOnMobile?: boolean;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
  keyExtractor?: (item: T) => string | number;
}

export function DataTable<T extends object>({
  data,
  columns,
  onRowClick,
  className,
  keyExtractor,
}: DataTableProps<T>) {
  const getKey = (item: T, idx: number): string | number => {
    if (keyExtractor) return keyExtractor(item);
    const rowWithId = item as { id?: string | number; _id?: string | number };
    if (rowWithId.id != null) return rowWithId.id;
    if (rowWithId._id != null) return rowWithId._id;
    return idx;
  };

  const renderCellContent = (col: ColumnDef<T>, item: T) => {
    if (col.cell) {
      return col.cell(item);
    }
    if (col.accessorKey) {
      const val = item[col.accessorKey as keyof T];
      if (val === null || val === undefined) return '-';
      return String(val);
    }
    return null;
  };

  return (
    <div className={cn('w-full', className)}>
      {/* Desktop Table View (lg and up, >= 1024px) */}
      <div className="hidden lg:block w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-xs font-semibold text-slate-600 uppercase tracking-wider">
              {columns.map((col, idx) => (
                <th key={idx} className={cn('px-5 py-3.5', col.headerClassName)}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.map((item, rowIdx) => (
              <tr
                key={getKey(item, rowIdx)}
                onClick={() => onRowClick?.(item)}
                className={cn(
                  'transition-colors duration-150',
                  onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/40'
                )}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className={cn('px-5 py-4 align-middle', col.className)}>
                    {renderCellContent(col, item)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tablet & Mobile Card View (< lg, below 1024px) */}
      <div className="lg:hidden flex flex-col gap-3">
        {data.map((item, rowIdx) => (
          <div
            key={getKey(item, rowIdx)}
            onClick={() => onRowClick?.(item)}
            className={cn(
              'p-4 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1 transition-all',
              onRowClick ? 'active:scale-[0.99] cursor-pointer' : ''
            )}
          >
            {columns.map((col, colIdx) => {
              if (col.hideOnMobile) return null;
              return (
                <div
                  key={colIdx}
                  className="grid grid-cols-[105px_1fr] items-start gap-2.5 py-1.5 border-b border-slate-50 last:border-0"
                >
                  <span className="text-xs font-semibold text-slate-500 text-left">
                    {col.header}
                  </span>
                  <div className="text-xs font-medium text-slate-900 text-left break-words min-w-0">
                    {renderCellContent(col, item)}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
