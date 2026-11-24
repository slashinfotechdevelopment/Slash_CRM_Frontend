import { getErrorMessage } from '@/api/client/errorMapper';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListPage } from '@/components/templates/ListPage';
import { FilterSelectConfig } from '@/components/templates/FilterBar';
import { useToast } from '@/hooks/useToast';
import { tasksConnector } from '@/connectors/tasks.connector';
import {
  TaskItem,
  ActiveTimerResponse,
  TaskTimeSummary,
  TaskPauseReason,
  PauseTaskTimerPayload,
} from '@/api/types/task.types';
import { MyTasksTimerCard } from '../components/MyTasksTimerCard';
import { MyTasksTimerModals } from '../components/MyTasksTimerModals';
import { useMyTaskColumns } from '../components/useMyTaskColumns';

export const MyTasksPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');

  // Timer & Telemetry state
  const [activeTimer, setActiveTimer] = useState<ActiveTimerResponse | null>(null);
  const [timeSummary, setTimeSummary] = useState<TaskTimeSummary | null>(null);
  const [elapsedDisplay, setElapsedDisplay] = useState(0);

  // Timer Modals
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [pauseReason, setPauseReason] = useState<TaskPauseReason>('TEA_BREAK');
  const [customDescription, setCustomDescription] = useState('');
  const [stopComment, setStopComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Fetch active timer & time summary
  const fetchTimerAndSummary = useCallback(async () => {
    try {
      const [timerRes, summaryRes] = await Promise.all([
        tasksConnector.getActiveTimer().catch(() => null),
        tasksConnector.getMyTimeSummary().catch(() => null),
      ]);
      if (timerRes) {
        setActiveTimer(timerRes);
        if (timerRes.isRunning && timerRes.entry?.startedAt) {
          const start = new Date(timerRes.entry.startedAt).getTime();
          setElapsedDisplay(Math.max(0, Math.floor((Date.now() - start) / 1000)));
        } else if (timerRes.isPaused && timerRes.activePause?.pauseElapsedSeconds) {
          setElapsedDisplay(timerRes.activePause.pauseElapsedSeconds);
        }
      }
      if (summaryRes) {
        setTimeSummary(summaryRes);
      }
    } catch (err) {
      console.error('Failed to fetch timer telemetry', err);
    }
  }, []);

  // Fetch my tasks list
  const fetchMyTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, unknown> = { limit: 50 };
      if (search.trim()) params.search = search.trim();
      if (selectedStatus !== 'ALL') params.status = selectedStatus;
      if (selectedPriority !== 'ALL') params.priority = selectedPriority;

      const res = await tasksConnector.getMyTasks(params);
      setTasks(res.items);
      setTotal(res.total);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch personal tasks'));
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedStatus, selectedPriority]);

  useEffect(() => {
    fetchMyTasks();
    fetchTimerAndSummary();
  }, [fetchMyTasks, fetchTimerAndSummary]);

  // Live ticking timer interval
  useEffect(() => {
    if (!activeTimer?.isRunning) return;
    const interval = setInterval(() => {
      setElapsedDisplay((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer?.isRunning]);

  // Play / Start Timer on a task
  const handlePlayTimer = async (task: TaskItem) => {
    try {
      await tasksConnector.playTimer(task.id);
      toast.success(`Started timer on ${task.taskCode}`);
      await fetchTimerAndSummary();
      fetchMyTasks();
    } catch (err: unknown) {
      toast.danger(getErrorMessage(err, 'Failed to start timer'));
    }
  };

  // Open Pause Modal
  const handleOpenPause = () => {
    setPauseReason('TEA_BREAK');
    setCustomDescription('');
    setModalError(null);
    setIsPauseModalOpen(true);
  };

  // Submit Pause
  const handlePauseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTimer?.task?.id) return;
    if (pauseReason === 'OTHER' && !customDescription.trim()) {
      setModalError('Custom description is required when reason is OTHER.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      const payload: PauseTaskTimerPayload = {
        reason: pauseReason,
        customDescription: pauseReason === 'OTHER' ? customDescription.trim() : undefined,
      };
      await tasksConnector.pauseTimer(activeTimer.task.id, payload);
      toast.success('Timer paused');
      setIsPauseModalOpen(false);
      await fetchTimerAndSummary();
      fetchMyTasks();
    } catch (err: unknown) {
      setModalError(getErrorMessage(err, 'Failed to pause timer.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resume Timer
  const handleResumeTimer = async () => {
    if (!activeTimer?.task?.id) return;
    try {
      await tasksConnector.resumeTimer(activeTimer.task.id);
      toast.success('Timer resumed');
      await fetchTimerAndSummary();
      fetchMyTasks();
    } catch (err: unknown) {
      toast.danger(getErrorMessage(err, 'Failed to resume timer'));
    }
  };

  // Open Stop Modal
  const handleOpenStop = () => {
    setStopComment('');
    setModalError(null);
    setIsStopModalOpen(true);
  };

  // Submit Stop
  const handleStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTimer?.task?.id) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.stopTimer(activeTimer.task.id, {
        finalComment: stopComment.trim() || undefined,
      });
      toast.success('Work session stopped');
      setIsStopModalOpen(false);
      await fetchTimerAndSummary();
      fetchMyTasks();
    } catch (err: unknown) {
      setModalError(getErrorMessage(err, 'Failed to stop timer.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimerDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filters: FilterSelectConfig[] = useMemo(
    () => [
      {
        key: 'status',
        label: 'Status',
        value: selectedStatus,
        options: [
          { label: 'All Statuses', value: 'ALL' },
          { label: 'To Do', value: 'TODO' },
          { label: 'In Progress', value: 'IN_PROGRESS' },
          { label: 'On Hold', value: 'ON_HOLD' },
          { label: 'In Review', value: 'IN_REVIEW' },
          { label: 'Reopened', value: 'REOPENED' },
          { label: 'Completed', value: 'COMPLETED' },
        ],
      },
      {
        key: 'priority',
        label: 'Priority',
        value: selectedPriority,
        options: [
          { label: 'All Priorities', value: 'ALL' },
          { label: 'Low', value: 'LOW' },
          { label: 'Medium', value: 'MEDIUM' },
          { label: 'High', value: 'HIGH' },
          { label: 'Urgent', value: 'URGENT' },
        ],
      },
    ],
    [selectedStatus, selectedPriority]
  );

  const handleFilterChange = (key: string, val: string | number) => {
    const v = String(val);
    if (key === 'status') setSelectedStatus(v);
    if (key === 'priority') setSelectedPriority(v);
  };

  const columns = useMyTaskColumns({
    activeTimer,
    onOpenPause: handleOpenPause,
    onResumeTimer: handleResumeTimer,
    onPlayTimer: handlePlayTimer,
  });

  return (
    <div className="space-y-6">
      <MyTasksTimerCard
        activeTimer={activeTimer}
        timeSummary={timeSummary}
        elapsedDisplay={elapsedDisplay}
        formatDuration={formatTimerDuration}
        onPauseClick={handleOpenPause}
        onResume={handleResumeTimer}
        onStopClick={handleOpenStop}
      />

      <ListPage<TaskItem>
        title="Personal Deliverables Queue"
        description="Assigned tasks requiring completion, timer tracking, and review submission."
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Filter tasks by code or title..."
        filters={filters}
        onFilterChange={handleFilterChange}
        columns={columns}
        items={tasks}
        total={total}
        isLoading={isLoading}
        error={error}
        onRetry={fetchMyTasks}
        onRowClick={(item) => navigate(`/tasks/${item.id}`)}
      />

      <MyTasksTimerModals
        isPauseModalOpen={isPauseModalOpen}
        onClosePause={() => setIsPauseModalOpen(false)}
        pauseReason={pauseReason}
        setPauseReason={setPauseReason}
        customDescription={customDescription}
        setCustomDescription={setCustomDescription}
        onPauseSubmit={handlePauseSubmit}
        isStopModalOpen={isStopModalOpen}
        onCloseStop={() => setIsStopModalOpen(false)}
        stopComment={stopComment}
        setStopComment={setStopComment}
        onStopSubmit={handleStopSubmit}
        isSubmitting={isSubmitting}
        modalError={modalError}
      />
    </div>
  );
};
