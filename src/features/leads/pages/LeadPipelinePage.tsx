import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { leadsConnector } from '@/connectors/leads.connector';
import {
  PipelineStageItem,
  LeadMetricsSummary,
  LeadItem,
} from '@/api/types/lead.types';
import { RefreshCw, Plus } from 'lucide-react';
import { CardSkeleton } from '@/components/feedback/Skeleton';
import { PipelineFunnelCards } from '../components/PipelineFunnelCards';
import { PipelineStageFunnelView } from '../components/PipelineStageFunnelView';
import { PipelineStageDetailsTable } from '../components/PipelineStageDetailsTable';

export const LeadPipelinePage: React.FC = () => {
  const navigate = useNavigate();

  const [stages, setStages] = useState<PipelineStageItem[]>([]);
  const [summary, setSummary] = useState<LeadMetricsSummary | null>(null);
  const [pipelineMetrics, setPipelineMetrics] = useState<unknown[] | null>(null);
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [stageRes, summaryRes, metricsRes, leadsRes] = await Promise.all([
        leadsConnector.getPipelineStages().catch(() => []),
        leadsConnector.getMetricsSummary().catch(() => null),
        leadsConnector.getPipelineMetrics().catch(() => []),
        leadsConnector.getLeads({ limit: 100 }).catch(() => ({ items: [] })),
      ]);
      setStages(stageRes);
      setSummary(summaryRes);
      setPipelineMetrics(metricsRes as unknown[]);
      setLeads(leadsRes.items || []);
    } catch (err) {
      console.error('Error fetching pipeline data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reconciled pipeline stage data with complete lead attribution
  const funnelStages = useMemo(() => {
    const metricsMap = new Map<string, { count: number; value: number }>();
    if (Array.isArray(pipelineMetrics)) {
      pipelineMetrics.forEach((raw) => {
        const m = raw as { stageId?: string; stageCode?: string; leadCount?: number; totalValue?: number };
        metricsMap.set(m.stageId || m.stageCode || '', {
          count: Number(m.leadCount) || 0,
          value: Number(m.totalValue) || 0,
        });
      });
    }

    const defaultStageId = stages.find((s) => s.isDefault || s.code === 'NEW')?.id || 'ps_stage_01_new';

    return stages.map((stage) => {
      const stageLeads = leads.filter(
        (l) => l.pipelineStageId === stage.id || (!l.pipelineStageId && stage.id === defaultStageId)
      );
      const metricsInfo = metricsMap.get(stage.id) || metricsMap.get(stage.code);

      const count = stageLeads.length || metricsInfo?.count || 0;
      const value =
        stageLeads.reduce((acc, cur) => acc + (Number(cur.estimatedValue) || 0), 0) || metricsInfo?.value || 0;

      return {
        id: stage.id,
        name: stage.name,
        code: stage.code,
        color: stage.color || 'var(--color-info)',
        count,
        value,
        leads: stageLeads,
      };
    });
  }, [stages, pipelineMetrics, leads]);

  const totalFunnelLeads = useMemo(
    () => funnelStages.reduce((acc, s) => acc + s.count, 0) || leads.length,
    [funnelStages, leads.length]
  );
  const totalFunnelValue = useMemo(
    () => funnelStages.reduce((acc, s) => acc + s.value, 0) || Number(summary?.totalPipelineValue) || 0,
    [funnelStages, summary]
  );

  if (isLoading && stages.length === 0) {
    return (
      <div className="space-y-6">
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-neutral-200/80 shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Sales Pipeline Intelligence</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Monitor conversion velocity across deal stages, commercial volume, and pipeline throughput.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={fetchData} leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
            Refresh
          </Button>
          <Button variant="primary" size="sm" onClick={() => navigate('/leads')} leftIcon={<Plus className="w-3.5 h-3.5" />}>
            Manage Leads
          </Button>
        </div>
      </div>

      <PipelineFunnelCards
        totalFunnelValue={totalFunnelValue}
        totalFunnelLeads={totalFunnelLeads}
        summary={summary}
        leads={leads}
      />

      <PipelineStageFunnelView
        totalFunnelLeads={totalFunnelLeads}
        totalFunnelValue={totalFunnelValue}
        funnelStages={funnelStages}
      />

      <PipelineStageDetailsTable
        funnelStages={funnelStages}
        totalFunnelLeads={totalFunnelLeads}
        totalFunnelValue={totalFunnelValue}
        summaryActive={summary?.totalActive ?? leads.length}
      />
    </div>
  );
};
