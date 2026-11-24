import React from 'react';
import { TaskCreateModal, TaskCreateModalProps } from './TaskCreateModal';
import { TaskEditModal, TaskEditModalProps } from './TaskEditModal';
import { TaskBulkLifecycleModals, TaskBulkLifecycleModalsProps } from './TaskBulkLifecycleModals';

export type TaskListModalsProps = TaskCreateModalProps &
  TaskEditModalProps &
  TaskBulkLifecycleModalsProps;

export const TaskListModals: React.FC<TaskListModalsProps> = (props) => {
  return (
    <>
      <TaskCreateModal {...props} />
      <TaskEditModal {...props} />
      <TaskBulkLifecycleModals {...props} />
    </>
  );
};
