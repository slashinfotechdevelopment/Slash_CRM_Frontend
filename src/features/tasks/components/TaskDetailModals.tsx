import React from 'react';
import { TaskEditAssignModals, TaskEditAssignModalsProps } from './TaskEditAssignModals';
import { TaskReviewModals, TaskReviewModalsProps } from './TaskReviewModals';
import { TaskTimerModals, TaskTimerModalsProps } from './TaskTimerModals';

export type TaskDetailModalsProps = TaskEditAssignModalsProps &
  TaskReviewModalsProps &
  TaskTimerModalsProps;

export const TaskDetailModals: React.FC<TaskDetailModalsProps> = (props) => {
  return (
    <>
      <TaskEditAssignModals {...props} />
      <TaskReviewModals {...props} />
      <TaskTimerModals {...props} />
    </>
  );
};
