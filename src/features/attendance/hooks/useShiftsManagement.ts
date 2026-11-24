import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { useConfirm } from '@/hooks/useConfirm';
import { attendanceConnector } from '@/connectors/attendance.connector';
import { ShiftDefinition, ShiftAssignment, CreateShiftDefinitionPayload } from '@/api/types/attendance.types';

export const useShiftsManagement = (
  selectedUserId: string,
  onRefreshShifts: () => void,
  onRefreshAssignments: (userId: string) => void
) => {
  const toast = useToast();
  const confirm = useConfirm();

  // Shift form modal states
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isEditingShift, setIsEditingShift] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [isShiftSubmitting, setIsShiftSubmitting] = useState(false);

  const [shiftCode, setShiftCode] = useState('');
  const [shiftName, setShiftName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [isOvernight, setIsOvernight] = useState(false);
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState(15);
  const [halfDayThresholdMinutes, setHalfDayThresholdMinutes] = useState(240);
  const [fullDayThresholdMinutes, setFullDayThresholdMinutes] = useState(480);
  const [paidBreakAllowance, setPaidBreakAllowance] = useState(60);

  // Assign modal state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isEditingAssignment, setIsEditingAssignment] = useState(false);
  const [editingAssignmentId, setEditingAssignmentId] = useState<string | null>(null);
  const [assignUserId, setAssignUserId] = useState('');
  const [assignShiftId, setAssignShiftId] = useState('');
  const [assignStartDate, setAssignStartDate] = useState('');
  const [assignEndDate, setAssignEndDate] = useState('');
  const [isAssignSubmitting, setIsAssignSubmitting] = useState(false);

  const handleOpenCreateShift = () => {
    setIsEditingShift(false);
    setEditingShiftId(null);
    setShiftCode('');
    setShiftName('');
    setStartTime('09:00');
    setEndTime('18:00');
    setIsOvernight(false);
    setGracePeriodMinutes(15);
    setHalfDayThresholdMinutes(240);
    setFullDayThresholdMinutes(480);
    setPaidBreakAllowance(60);
    setIsShiftModalOpen(true);
  };

  const handleOpenEditShift = async (shift: ShiftDefinition) => {
    try {
      const details = await attendanceConnector.getShiftDefinitionById(shift.id);
      setIsEditingShift(true);
      setEditingShiftId(shift.id);
      setShiftCode(details.code);
      setShiftName(details.name);
      setStartTime(details.startTime);
      setEndTime(details.endTime);
      setIsOvernight(details.isOvernight || false);
      setGracePeriodMinutes(details.gracePeriodMinutes || 15);
      setHalfDayThresholdMinutes(details.halfDayThresholdMinutes || 240);
      setFullDayThresholdMinutes(details.fullDayThresholdMinutes || 480);
      setPaidBreakAllowance(details.breakPolicy?.paidAllowanceMinutes || 60);
      setIsShiftModalOpen(true);
    } catch (err: unknown) {
      toast.danger('Error', err instanceof Error ? err.message : 'Failed to load shift details.');
    }
  };

  const handleShiftSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shiftCode.trim() || !shiftName.trim()) {
      toast.warning('Validation Error', 'Shift code and name are required.');
      return;
    }

    const payload: CreateShiftDefinitionPayload = {
      code: shiftCode.trim().toUpperCase(),
      name: shiftName.trim(),
      startTime,
      endTime,
      isOvernight,
      gracePeriodMinutes: Number(gracePeriodMinutes),
      halfDayThresholdMinutes: Number(halfDayThresholdMinutes),
      fullDayThresholdMinutes: Number(fullDayThresholdMinutes),
      paidBreakAllowance: Number(paidBreakAllowance),
      breakPolicy: {
        paidAllowanceMinutes: Number(paidBreakAllowance),
        breakTypes: [
          { breakTypeId: 'LUNCH', code: 'LUNCH', name: 'Lunch Break', maxDurationMinutes: 60, isPaid: true },
          { breakTypeId: 'TEA', code: 'TEA', name: 'Tea Break', maxDurationMinutes: 15, isPaid: true },
        ],
      },
    };

    try {
      setIsShiftSubmitting(true);
      if (isEditingShift && editingShiftId) {
        await attendanceConnector.updateShiftDefinition(editingShiftId, payload);
        toast.success('Updated', 'Shift definition updated successfully.');
      } else {
        await attendanceConnector.createShiftDefinition(payload);
        toast.success('Created', 'New shift definition created successfully.');
      }
      setIsShiftModalOpen(false);
      onRefreshShifts();
    } catch (err: unknown) {
      toast.danger('Action Failed', err instanceof Error ? err.message : 'Could not save shift definition.');
    } finally {
      setIsShiftSubmitting(false);
    }
  };

  const handleDeleteShift = async (shift: ShiftDefinition) => {
    const res = await confirm({
      title: 'Delete Shift Definition',
      message: `Are you sure you want to delete "${shift.name}" (${shift.code})? This action cannot be undone if the shift is not linked to active records.`,
      confirmLabel: 'Delete Shift',
      tone: 'danger',
    });

    if (!res.confirmed) return;

    try {
      await attendanceConnector.deleteShiftDefinition(shift.id);
      toast.success('Deleted', 'Shift definition removed successfully.');
      onRefreshShifts();
    } catch (err: unknown) {
      toast.danger('Delete Failed', err instanceof Error ? err.message : 'Cannot delete shift definition.');
    }
  };

  const handleOpenAssign = (fallbackUserId: string, fallbackShiftId: string) => {
    setIsEditingAssignment(false);
    setEditingAssignmentId(null);
    setAssignUserId(selectedUserId || fallbackUserId);
    setAssignShiftId(fallbackShiftId);
    setAssignStartDate(new Date().toISOString().slice(0, 10));
    setAssignEndDate('');
    setIsAssignModalOpen(true);
  };

  const handleOpenEditAssignment = (assignment: ShiftAssignment) => {
    setIsEditingAssignment(true);
    setEditingAssignmentId(assignment.id);
    setAssignUserId(assignment.userId);
    setAssignShiftId(assignment.shiftDefinitionId);
    setAssignStartDate(assignment.startDate.slice(0, 10));
    setAssignEndDate(assignment.endDate ? assignment.endDate.slice(0, 10) : '');
    setIsAssignModalOpen(true);
  };

  const handleAssignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignUserId || !assignShiftId || !assignStartDate) {
      toast.warning('Validation Error', 'Employee, Shift, and Start Date are required.');
      return;
    }

    try {
      setIsAssignSubmitting(true);
      if (isEditingAssignment && editingAssignmentId) {
        await attendanceConnector.updateShiftAssignment(editingAssignmentId, {
          shiftDefinitionId: assignShiftId,
          startDate: assignStartDate,
          endDate: assignEndDate || undefined,
        });
        toast.success('Updated', 'Shift assignment updated successfully.');
      } else {
        await attendanceConnector.assignShift({
          userId: assignUserId,
          shiftDefinitionId: assignShiftId,
          startDate: assignStartDate,
          endDate: assignEndDate || undefined,
        });
        toast.success('Assigned', 'Shift successfully assigned to employee.');
      }
      setIsAssignModalOpen(false);
      if (selectedUserId) {
        onRefreshAssignments(selectedUserId);
      }
    } catch (err: unknown) {
      toast.danger('Assignment Failed', err instanceof Error ? err.message : 'Unable to save shift assignment.');
    } finally {
      setIsAssignSubmitting(false);
    }
  };

  const handleDeleteAssignment = async (assignment: ShiftAssignment) => {
    const res = await confirm({
      title: 'Remove Shift Assignment',
      message: 'Remove this shift assignment from the employee?',
      confirmLabel: 'Remove',
      tone: 'danger',
    });

    if (!res.confirmed) return;

    try {
      await attendanceConnector.deleteShiftAssignment(assignment.id);
      toast.success('Removed', 'Shift assignment removed.');
      if (selectedUserId) {
        onRefreshAssignments(selectedUserId);
      }
    } catch (err: unknown) {
      toast.danger('Action Failed', err instanceof Error ? err.message : 'Failed to delete shift assignment.');
    }
  };

  return {
    isShiftModalOpen,
    setIsShiftModalOpen,
    isEditingShift,
    shiftCode,
    setShiftCode,
    shiftName,
    setShiftName,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    isOvernight,
    setIsOvernight,
    gracePeriodMinutes,
    setGracePeriodMinutes,
    paidBreakAllowance,
    setPaidBreakAllowance,
    halfDayThresholdMinutes,
    setHalfDayThresholdMinutes,
    fullDayThresholdMinutes,
    setFullDayThresholdMinutes,
    isShiftSubmitting,
    handleOpenCreateShift,
    handleOpenEditShift,
    handleShiftSubmit,
    handleDeleteShift,

    isAssignModalOpen,
    setIsAssignModalOpen,
    isEditingAssignment,
    assignUserId,
    setAssignUserId,
    assignShiftId,
    setAssignShiftId,
    assignStartDate,
    setAssignStartDate,
    assignEndDate,
    setAssignEndDate,
    isAssignSubmitting,
    handleOpenAssign,
    handleOpenEditAssignment,
    handleAssignSubmit,
    handleDeleteAssignment,
  };
};
