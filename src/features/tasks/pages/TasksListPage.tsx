import React, { useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ListPage } from '@/components/templates/ListPage';
import { FilterSelectConfig } from '@/components/templates/FilterBar';
import { Button } from '@/components/ui/Button';
import { TaskItem } from '@/api/types/task.types';
import { Plus, Kanban, Table as TableIcon, Tag } from 'lucide-react';
import { TaskKanbanBoard } from '../components/TaskKanbanBoard';
import { TaskManageTagsModal } from '../components/TaskManageTagsModal';
import { TaskListModals } from '../components/TaskListModals';
import { useTasksList } from '../hooks/useTasksList';
import { useTaskColumns } from '../components/useTaskColumns';

export const TasksListPage: React.FC = () => {
  const { isSuperAdmin, hasRole, hasPermission } = useAuth();
  const canManage =
    isSuperAdmin ||
    hasRole(['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER']) ||
    hasPermission('tasks.assign');

  // Non-manager employees should only access My Tasks (/tasks/my)
  if (!canManage) {
    return <Navigate to="/tasks/my" replace />;
  }

  const {
    viewMode,
    setViewMode,
    tasks,
    total,
    isLoading,
    error,
    search,
    setSearch,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    selectedDept,
    setSelectedDept,
    departments,
    tags,
    setIsCreateModalOpen,
    isTagsModalOpen,
    setIsTagsModalOpen,
    fetchTasks,
    fetchMetadata,
    openEdit,
    openAssign,
    openCancel,
    openReopen,
    handleDeleteTask,
    modalsProps,
    newTagName,
    setNewTagName,
    newTagColor,
    setNewTagColor,
    isSubmitting,
    setIsSubmitting,
  } = useTasksList();

  const columns = useTaskColumns({
    openAssign,
    openEdit,
    openReopen,
    openCancel,
    handleDeleteTask,
  });

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
          { label: 'Cancelled', value: 'CANCELLED' },
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
      {
        key: 'department',
        label: 'Department',
        value: selectedDept,
        options: [
          { label: 'All Departments', value: 'ALL' },
          ...departments.map((d) => ({ label: d.name, value: d.id })),
        ],
      },
    ],
    [selectedStatus, selectedPriority, selectedDept, departments],
  );

  const handleFilterChange = (key: string, val: string | number) => {
    const v = String(val);
    if (key === 'status') setSelectedStatus(v);
    if (key === 'priority') setSelectedPriority(v);
    if (key === 'department') setSelectedDept(v);
  };

  return (
    <>
      <ListPage<TaskItem>
        title="Tasks & Deliverables"
        description="Coordinate team initiatives, track progress SLAs, and monitor task turnaround."
        searchPlaceholder="Search tasks by code, title, or description..."
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        headerActions={
          <div className="flex items-center gap-2">
            {hasPermission('tasks.create') && (
              <Button size="sm" variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" /> Create Task
              </Button>
            )}
            <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'table' ? 'bg-slate-100 text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table View"
              >
                <TableIcon className="w-3.5 h-3.5" /> Table
              </button>
              <button
                type="button"
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors ${
                  viewMode === 'kanban' ? 'bg-slate-100 text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Kanban Board View"
              >
                <Kanban className="w-3.5 h-3.5" /> Kanban
              </button>
            </div>
            {hasPermission('tasks.manage_tags') && (
              <Button size="sm" variant="outline" onClick={() => setIsTagsModalOpen(true)}>
                <Tag className="w-4 h-4 mr-1.5" /> Tags
              </Button>
            )}
          </div>
        }
        total={total}
        isLoading={isLoading}
        error={error}
        onRetry={fetchTasks}
        items={tasks}
        columns={columns}
      >
        {viewMode === 'kanban' && (
          <TaskKanbanBoard tasks={tasks} onOpenEdit={openEdit} onOpenAssign={openAssign} />
        )}
      </ListPage>

      <TaskListModals {...modalsProps} />

      <TaskManageTagsModal
        isOpen={isTagsModalOpen}
        onClose={() => setIsTagsModalOpen(false)}
        tags={tags}
        onTagsUpdated={() => {
          fetchMetadata();
          fetchTasks();
        }}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        newTagName={newTagName}
        setNewTagName={setNewTagName}
        newTagColor={newTagColor}
        setNewTagColor={setNewTagColor}
      />
    </>
  );
};
