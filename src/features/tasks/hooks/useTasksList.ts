import { getErrorMessage } from '@/api/client/errorMapper';
import { useState, useEffect, useCallback } from 'react';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { tasksConnector } from '@/connectors/tasks.connector';
import { usersConnector } from '@/connectors/users.connector';
import { rolesConnector } from '@/connectors/roles.connector';
import {
  TaskItem,
  TaskPriority,
  TaskStatus,
  TaskTag,
  CreateTaskPayload,
  UpdateTaskPayload,
  AssignTaskPayload,
} from '@/api/types/task.types';
import { UserItem } from '@/api/types/users.types';
import { DepartmentItem } from '@/api/types/roles.types';
import { TaskListModalsProps } from '../components/TaskListModals';

export function useTasksList() {
  const confirm = useConfirm();
  const toast = useToast();

  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedDept, setSelectedDept] = useState<string>('ALL');

  // Supporting metadata
  const [users, setUsers] = useState<UserItem[]>([]);
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [tags, setTags] = useState<TaskTag[]>([]);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isReopenModalOpen, setIsReopenModalOpen] = useState(false);
  const [isTagsModalOpen, setIsTagsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

  // Form fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as TaskPriority,
    category: 'GENERAL',
    startDate: '',
    startTime: '',
    dueDate: '',
    endTime: '',
    estimatedHours: '',
    assigneeId: '',
    selectedTags: [] as string[],
  });

  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as TaskPriority,
    status: 'TODO' as TaskStatus,
    progress: 0,
    dueDate: '',
    estimatedHours: '',
    statusComment: '',
  });

  const [assigneeId, setAssigneeId] = useState('');
  const [assignReason, setAssignReason] = useState('');
  const [reasonText, setReasonText] = useState('');

  // Tags form
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState('#3b82f6');

  // Fetch metadata
  const fetchMetadata = useCallback(async () => {
    try {
      const [usersRes, deptsRes, tagsRes] = await Promise.allSettled([
        usersConnector.getUsers({ page: 1, limit: 100 }),
        rolesConnector.getDepartments({ limit: 100 }),
        tasksConnector.listTags(),
      ]);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.items || []);
      if (deptsRes.status === 'fulfilled') setDepartments(deptsRes.value.items || []);
      if (tagsRes.status === 'fulfilled') setTags(tagsRes.value || []);
    } catch {
      // Non-critical metadata failure
    }
  }, []);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams: Record<string, string | number> = {
        limit: 100,
      };
      if (search.trim()) queryParams.search = search.trim();
      if (selectedStatus !== 'ALL') queryParams.status = selectedStatus;
      if (selectedPriority !== 'ALL') queryParams.priority = selectedPriority;
      if (selectedDept !== 'ALL') queryParams.departmentId = selectedDept;

      const res = await tasksConnector.getTasks(queryParams);
      setTasks(res.items || []);
      setTotal(res.total ?? (res.items || []).length);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to fetch tasks.'));
    } finally {
      setIsLoading(false);
    }
  }, [search, selectedStatus, selectedPriority, selectedDept]);

  useEffect(() => {
    fetchMetadata();
  }, [fetchMetadata]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      setModalError('Title and description are required.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      const payload: CreateTaskPayload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        priority: formData.priority,
        category: formData.category || 'GENERAL',
        startDate: formData.startDate ? `${formData.startDate}T${formData.startTime || '09:00'}:00.000Z` : undefined,
        dueDate: formData.dueDate ? `${formData.dueDate}T${formData.endTime || '18:00'}:00.000Z` : undefined,
        estimatedHours: formData.estimatedHours ? parseFloat(formData.estimatedHours) : undefined,
        assigneeId: formData.assigneeId || undefined,
        tags: formData.selectedTags.length > 0 ? formData.selectedTags : undefined,
      };
      await tasksConnector.createTask(payload);
      toast.success('Task created successfully');
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'GENERAL',
        startDate: '',
        startTime: '',
        dueDate: '',
        endTime: '',
        estimatedHours: '',
        assigneeId: '',
        selectedTags: [],
      });
      fetchTasks();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to create task.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      const payload: UpdateTaskPayload = {
        title: editFormData.title.trim(),
        description: editFormData.description.trim(),
        priority: editFormData.priority,
        status: editFormData.status,
        progress: editFormData.progress,
        dueDate: editFormData.dueDate ? `${editFormData.dueDate}T18:00:00.000Z` : undefined,
        estimatedHours: editFormData.estimatedHours ? parseFloat(editFormData.estimatedHours) : undefined,
        statusComment: editFormData.statusComment.trim() || undefined,
      };
      await tasksConnector.updateTask(activeTask.id, payload);
      toast.success('Task updated successfully');
      setIsEditModalOpen(false);
      fetchTasks();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to update task.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask) return;
    setIsSubmitting(true);
    setModalError(null);
    try {
      const payload: AssignTaskPayload = {
        assigneeId: assigneeId || null,
        reason: assignReason.trim() || undefined,
      };
      await tasksConnector.assignTask(activeTask.id, payload);
      toast.success('Task reassigned successfully');
      setIsAssignModalOpen(false);
      fetchTasks();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to assign task.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !reasonText.trim()) {
      setModalError('Cancellation reason is required.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.cancelTask(activeTask.id, reasonText.trim());
      toast.success('Task cancelled');
      setIsCancelModalOpen(false);
      fetchTasks();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to cancel task.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReopenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTask || !reasonText.trim()) {
      setModalError('Justification is required to reopen this task.');
      return;
    }
    setIsSubmitting(true);
    setModalError(null);
    try {
      await tasksConnector.reopenTask(activeTask.id, reasonText.trim());
      toast.success('Task reopened successfully');
      setIsReopenModalOpen(false);
      fetchTasks();
    } catch (err) {
      setModalError(getErrorMessage(err, 'Failed to reopen task.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (task: TaskItem) => {
    const res = await confirm({
      tone: 'danger',
      title: `Delete Task ${task.taskCode}?`,
      message: `Are you sure you want to delete "${task.title}"?`,
      confirmLabel: 'Delete Task',
      cancelLabel: 'Keep Task',
    });
    if (res.confirmed) {
      try {
        await tasksConnector.deleteTask(task.id);
        toast.success('Task deleted successfully');
        fetchTasks();
      } catch (err) {
        toast.danger(getErrorMessage(err, 'Failed to delete task'));
      }
    }
  };

  const openEdit = (task: TaskItem) => {
    setActiveTask(task);
    setEditFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      progress: task.progress || 0,
      dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
      estimatedHours: task.estimatedHours ? String(task.estimatedHours) : '',
      statusComment: '',
    });
    setModalError(null);
    setIsEditModalOpen(true);
  };

  const openAssign = (task: TaskItem) => {
    setActiveTask(task);
    setAssigneeId(task.assigneeId || '');
    setAssignReason('');
    setModalError(null);
    setIsAssignModalOpen(true);
  };

  const openCancel = (task: TaskItem) => {
    setActiveTask(task);
    setReasonText('');
    setModalError(null);
    setIsCancelModalOpen(true);
  };

  const openReopen = (task: TaskItem) => {
    setActiveTask(task);
    setReasonText('');
    setModalError(null);
    setIsReopenModalOpen(true);
  };

  const modalsProps: TaskListModalsProps = {
    isCreateModalOpen,
    onCloseCreate: () => setIsCreateModalOpen(false),
    formData,
    setFormData,
    onCreateSubmit: handleCreateSubmit,
    isEditModalOpen,
    onCloseEdit: () => setIsEditModalOpen(false),
    activeTask,
    editFormData,
    setEditFormData,
    onEditSubmit: handleEditSubmit,
    isAssignModalOpen,
    onCloseAssign: () => setIsAssignModalOpen(false),
    assigneeId,
    setAssigneeId,
    assignReason,
    setAssignReason,
    onAssignSubmit: handleAssignSubmit,
    isCancelModalOpen,
    onCloseCancel: () => setIsCancelModalOpen(false),
    isReopenModalOpen,
    onCloseReopen: () => setIsReopenModalOpen(false),
    reasonText,
    setReasonText,
    onCancelSubmit: handleCancelSubmit,
    onReopenSubmit: handleReopenSubmit,
    users,
    tags,
    isSubmitting,
    modalError,
  };

  return {
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
    users,
    departments,
    tags,
    isCreateModalOpen,
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
  };
}
