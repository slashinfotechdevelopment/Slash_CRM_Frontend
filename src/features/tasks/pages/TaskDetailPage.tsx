import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailPage, DetailField } from '@/components/templates/DetailPage';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { tasksConnector } from '@/connectors/tasks.connector';
import { useToast } from '@/hooks/useToast';
import { TaskStatus } from '@/api/types/task.types';
import {
  CheckCircle2,
  UserCheck,
  Edit2,
  Trash2,
  RotateCcw,
  Ban,
  Send,
} from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { TaskTimeTrackingTab } from '../components/TaskTimeTrackingTab';
import { TaskCommentsTab } from '../components/TaskCommentsTab';
import { TaskAttachmentsTab } from '../components/TaskAttachmentsTab';
import { TaskHistoryTab } from '../components/TaskHistoryTab';
import { TaskDetailModals } from '../components/TaskDetailModals';
import { useTaskDetail } from '../hooks/useTaskDetail';

export const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const {
    task,
    isLoading,
    error,
    fetchTaskData,
    activeTab,
    setActiveTab,
    timeEntries,
    timeSummary,
    comments,
    attachments,
    auditHistory,
    reviews,
    newComment,
    setNewComment,
    isInternalComment,
    setIsInternalComment,
    setIsSubmitModalOpen,
    setIsApproveModalOpen,
    setIsRequestChangesModalOpen,
    setIsRejectModalOpen,
    setIsCancelModalOpen,
    setIsReopenModalOpen,
    setIsPauseModalOpen,
    setIsStopModalOpen,
    handleOpenEdit,
    handleOpenAssign,
    handleDeleteTask,
    handleAddComment,
    handleUpdateComment,
    handleDeleteComment,
    handleFileUpload,
    handleDownload,
    handlePreview,
    handleRescan,
    handleDeleteAttachment,
    modalsProps,
  } = useTaskDetail(id, navigate);

  const getStatusBadge = (s: TaskStatus) => {
    switch (s) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="accent">In Progress</Badge>;
      case 'IN_REVIEW':
        return <Badge variant="warning">In Review</Badge>;
      case 'ON_HOLD':
        return <Badge variant="neutral">On Hold</Badge>;
      case 'REOPENED':
      case 'CANCELLED':
        return <Badge variant="danger">{s}</Badge>;
      case 'TODO':
      default:
        return <Badge variant="neutral">To Do</Badge>;
    }
  };

  const fields: DetailField[] = task
    ? [
        { label: 'Task Code', value: <span className="font-mono font-semibold">{task.taskCode}</span> },
        { label: 'Status', value: getStatusBadge(task.status) },
        { label: 'Priority', value: <Badge variant={task.priority === 'URGENT' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'neutral'}>{task.priority}</Badge> },
        { label: 'Category', value: task.category || 'GENERAL' },
        {
          label: 'Assignee',
          value: task.assignee ? (
            <div>
              <div className="font-semibold text-slate-900">{task.assignee.name}</div>
              <div className="text-xs text-slate-400 font-mono">{task.assignee.userCode} ({task.assignee.email})</div>
            </div>
          ) : (
            <span className="text-slate-400 italic">Unassigned</span>
          ),
        },
        {
          label: 'Department',
          value: task.department ? `${task.department.name} (${task.department.code})` : '-',
        },
        { label: 'Start Date', value: formatDate(task.startDate) },
        { label: 'Due Date', value: formatDate(task.dueDate) },
        { label: 'Estimated Effort', value: task.estimatedHours ? `${task.estimatedHours} hours` : '-' },
        {
          label: 'Progress',
          value: (
            <div className="flex items-center gap-2">
              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-brand-primary h-2 rounded-full" style={{ width: `${task.progress || 0}%` }} />
              </div>
              <span className="text-xs font-semibold">{task.progress || 0}%</span>
            </div>
          ),
        },
        {
          label: 'Created By',
          value: task.createdByUser ? `${task.createdByUser.name} (${task.createdByUser.userCode})` : '-',
        },
        { label: 'Created At', value: formatDate(task.createdAt) },
      ]
    : [];

  const tabDefs: TabItem[] = [
    { id: 'overview', label: 'Description & Scope' },
    { id: 'time', label: `Time Tracking (${timeEntries.length})` },
    { id: 'comments', label: `Discussion (${comments.length})` },
    { id: 'attachments', label: `Deliverables & Attachments (${attachments.length})` },
    { id: 'history', label: 'Audit & Reviews' },
  ];

  return (
    <>
      <DetailPage
        title={task?.title || 'Task Details'}
        subtitle={`Task Code: ${task?.taskCode || ''}`}
        badge={task ? getStatusBadge(task.status) : undefined}
        onBack={() => navigate('/tasks')}
        isLoading={isLoading}
        error={error}
        onRetry={fetchTaskData}
        fields={fields}
        actions={
          task && (
            <div className="flex flex-wrap items-center gap-2">
              {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && task.status !== 'IN_REVIEW' && (
                <Button size="sm" variant="primary" onClick={() => setIsSubmitModalOpen(true)}>
                  <Send className="w-4 h-4 mr-1.5" /> Submit for Review
                </Button>
              )}
              {task.status === 'IN_REVIEW' && (
                <>
                  <Button size="sm" variant="primary" onClick={() => setIsApproveModalOpen(true)}>
                    <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsRequestChangesModalOpen(true)}>
                    <RotateCcw className="w-4 h-4 mr-1.5" /> Request Changes
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setIsRejectModalOpen(true)} className="text-rose-600 border-rose-200 hover:bg-rose-50">
                    <Ban className="w-4 h-4 mr-1.5" /> Reject
                  </Button>
                </>
              )}
              <Button size="sm" variant="outline" onClick={handleOpenAssign}>
                <UserCheck className="w-4 h-4 mr-1.5" /> Assign
              </Button>
              <Button size="sm" variant="outline" onClick={handleOpenEdit}>
                <Edit2 className="w-4 h-4 mr-1.5" /> Edit
              </Button>
              {task.status === 'COMPLETED' || task.status === 'CANCELLED' ? (
                <Button size="sm" variant="outline" onClick={() => setIsReopenModalOpen(true)}>
                  <RotateCcw className="w-4 h-4 mr-1.5 text-indigo-600" /> Reopen
                </Button>
              ) : (
                <Button size="sm" variant="outline" onClick={() => setIsCancelModalOpen(true)}>
                  <Ban className="w-4 h-4 mr-1.5 text-amber-600" /> Cancel
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleDeleteTask} className="text-rose-600 border-rose-200 hover:bg-rose-50">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )
        }
      >
        <div className="mt-6 space-y-6">
          <Tabs tabs={tabDefs} activeTab={activeTab} onChange={(tId) => setActiveTab(tId as typeof activeTab)} />
          {activeTab === 'overview' && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Scope & Deliverables
              </h3>
              <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {task?.description || 'No description provided.'}
              </div>
              {task?.tagMappings && task.tagMappings.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                    Taxonomy Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {task.tagMappings.map((m) => (
                      <span
                        key={m.id}
                        className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{
                          backgroundColor: m.tag.color ? `${m.tag.color}20` : 'var(--color-border-subtle)',
                          color: m.tag.color || 'var(--color-text-body)',
                        }}
                      >
                        {m.tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'time' && (
            <TaskTimeTrackingTab
              timeSummary={timeSummary}
              timeEntries={timeEntries}
              onPlay={() => task && tasksConnector.playTimer(task.id).then(() => { toast.success('Timer started'); fetchTaskData(); })}
              onResume={() => task && tasksConnector.resumeTimer(task.id).then(() => { toast.success('Timer resumed'); fetchTaskData(); })}
              onOpenPause={() => setIsPauseModalOpen(true)}
              onOpenStop={() => setIsStopModalOpen(true)}
            />
          )}

          {activeTab === 'comments' && (
            <TaskCommentsTab
              comments={comments}
              newComment={newComment}
              isInternalComment={isInternalComment}
              onNewCommentChange={setNewComment}
              onIsInternalChange={setIsInternalComment}
              onAddComment={handleAddComment}
              onUpdateComment={handleUpdateComment}
              onDeleteComment={handleDeleteComment}
            />
          )}

          {activeTab === 'attachments' && (
            <TaskAttachmentsTab
              attachments={attachments}
              onFileUpload={handleFileUpload}
              onPreview={handlePreview}
              onDownload={handleDownload}
              onRescan={handleRescan}
              onDelete={handleDeleteAttachment}
            />
          )}

          {activeTab === 'history' && (
            <TaskHistoryTab reviews={reviews} auditHistory={auditHistory} />
          )}
        </div>
      </DetailPage>

      <TaskDetailModals {...modalsProps} />
    </>
  );
};
