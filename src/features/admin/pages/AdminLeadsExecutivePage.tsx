import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminConnector } from '@/connectors/admin.connector';
import {
  AdminLeadsSummaryResponse,
  LeadsByEmployeeItem,
  LeadTrendPoint,
  LeadSourceItem,
} from '@/api/types/admin.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdminLeadsKpis } from '../components/AdminLeadsKpis';
import { AdminLeadsDistributionTrends } from '../components/AdminLeadsDistributionTrends';
import { AdminLeadsStaffAndSources } from '../components/AdminLeadsStaffAndSources';

export const AdminLeadsExecutivePage: React.FC = () => {
  const defaultFrom = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  }, []);
  const defaultTo = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);

  const [summary, setSummary] = useState<AdminLeadsSummaryResponse | null>(null);
  const [employeeRanking, setEmployeeRanking] = useState<LeadsByEmployeeItem[]>([]);
  const [trend, setTrend] = useState<LeadTrendPoint[]>([]);
  const [sources, setSources] = useState<LeadSourceItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        from: from || undefined,
        to: to || undefined,
      };
      const [sumRes, empRes, trendRes, srcRes] = await Promise.all([
        adminConnector.getLeadsSummary(params),
        adminConnector.getLeadsByEmployee(params),
        adminConnector.getLeadsTrend({ ...params, interval: 'day' }),
        adminConnector.getLeadsBySource(params),
      ]);
      setSummary(sumRes);
      setEmployeeRanking(empRes || []);
      setTrend(trendRes || []);
      setSources(srcRes || []);
    } catch (err) {
      console.error('Failed to load executive leads intelligence:', err);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Executive CRM & Pipeline Intelligence</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Super Admin strategic analytics on lead conversion throughput, staff sales quotas, acquisition trends, and lead channels.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-white border border-neutral-200 rounded-lg p-1.5 shadow-xs">
            <span>From:</span>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="text-xs py-1 px-2 border-0 focus:ring-0"
            />
            <span>To:</span>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="text-xs py-1 px-2 border-0 focus:ring-0"
            />
          </div>
          <Button variant="outline" size="sm" onClick={loadAll} className="text-xs">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />
        </div>
      ) : (
        <>
          <AdminLeadsKpis summary={summary} />
          <AdminLeadsDistributionTrends summary={summary} trend={trend} />
          <AdminLeadsStaffAndSources employeeRanking={employeeRanking} sources={sources} />
        </>
      )}
    </div>
  );
};
