import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { tasksConnector } from '@/connectors/tasks.connector';
import { TaskItem, TaskPauseReason } from '@/api/types/task.types';
import { getErrorMessage } from '@/api/client/errorMapper';

export function useTaskTimerActions(
  task: TaskItem | null,
  fetchTaskData: () => Promise<void>,
  setIsSubmitting: (v: boolean) => void,
  setModalError: (v: string | null) => void,
  toast: ReturnType<typeof useToast>
) {
  const [isPauseModalOpen, setIsPauseModalOpen] = useState(false);
  const [isStopModalOpen, setIsStopModalOpen] = useState(false);
  const [pauseReason, setPauseReason] = useState<TaskPauseReason>('TEA_BREAK');
  const [customPauseDesc, setCustomPauseDesc] = useState('');
  const [stopComment, setStopComment] = useState('');

  const handlePauseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.pauseTimer(task.id, {
        reason: pauseReason,
        customDescription: pauseReason === 'OTHER' ? customPauseDesc : undefined,
      });
      toast.success('Timer paused');
      setIsPauseModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to pause timer.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStopSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.stopTimer(task.id, { finalComment: stopComment || undefined });
      toast.success('Timer stopped');
      setIsStopModalOpen(false);
      fetchTaskData();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to stop timer.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isPauseModalOpen,
    setIsPauseModalOpen,
    isStopModalOpen,
    setIsStopModalOpen,
    pauseReason,
    setPauseReason,
    customPauseDesc,
    setCustomPauseDesc,
    stopComment,
    setStopComment,
    handlePauseSubmit,
    handleStopSubmit,
  };
}
