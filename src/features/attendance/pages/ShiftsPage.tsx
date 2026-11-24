import React, { useState, useEffect, useCallback } from 'react';
import { ListPage } from '@/components/templates/ListPage';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { useInfiniteList } from '@/hooks/useInfiniteList';
import { attendanceConnector } from '@/connectors/attendance.connector';
import { usersConnector } from '@/connectors/users.connector';
import { ShiftDefinition, ShiftAssignment } from '@/api/types/attendance.types';
import { UserItem } from '@/api/types/users.types';
import { Plus, UserCheck } from 'lucide-react';
import { useShiftColumns } from '../components/useShiftColumns';
import { ShiftModals } from '../components/ShiftModals';
import { ShiftAssignmentsTab } from '../components/ShiftAssignmentsTab';
import { useShiftsManagement } from '../hooks/useShiftsManagement';

export const ShiftsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'definitions' | 'assignments'>('definitions');
  const [searchTerm, setSearchTerm] = useState('');

  // Shift Definitions infinite list
  const {
    items: shifts,
    total: totalShifts,
    isLoading: loadingShifts,
    isLoadingMore: loadingMoreShifts,
    hasMore: hasMoreShifts,
    error: shiftError,
    loadMore: loadMoreShifts,
    refresh: refetchShifts,
  } = useInfiniteList<ShiftDefinition, { search?: string }>({
    queryFn: (params) => attendanceConnector.listShiftDefinitions(params),
    filters: { search: searchTerm || undefined },
    limit: 20,
  });

  // Assignments state
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  const fetchAssignments = useCallback((userId: string) => {
    if (!userId) return;
    setLoadingAssignments(true);
    attendanceConnector.getEmployeeShiftAssignments(userId)
      .then((data) => setAssignments(data))
      .catch(() => setAssignments([]))
      .finally(() => setLoadingAssignments(false));
  }, []);

  useEffect(() => {
    usersConnector.getUsers({ limit: 100 }).then((res) => {
      setUsersList(res.items);
      if (res.items.length > 0 && !selectedUserId) {
        setSelectedUserId(res.items[0].id);
      }
    }).catch(() => {});
  }, [selectedUserId]);

  useEffect(() => {
    if (selectedUserId) {
      fetchAssignments(selectedUserId);
    }
  }, [selectedUserId, fetchAssignments]);

  const shiftsMgmt = useShiftsManagement(selectedUserId, refetchShifts, fetchAssignments);

  const shiftColumns = useShiftColumns({
    onEdit: shiftsMgmt.handleOpenEditShift,
    onDelete: shiftsMgmt.handleDeleteShift,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
        <Tabs
          tabs={[
            { id: 'definitions', label: 'Shift Definitions' },
            { id: 'assignments', label: 'Employee Assignments' },
          ]}
          activeTab={activeTab}
          onChange={(tab) => setActiveTab(tab as 'definitions' | 'assignments')}
        />
        {activeTab === 'definitions' ? (
          <Button
            variant="primary"
            size="sm"
            onClick={shiftsMgmt.handleOpenCreateShift}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Shift Definition
          </Button>
        ) : (
          <Button
            variant="primary"
            size="sm"
            onClick={() => shiftsMgmt.handleOpenAssign(usersList[0]?.id || '', shifts[0]?.id || '')}
            leftIcon={<UserCheck className="w-4 h-4" />}
          >
            Assign Shift
          </Button>
        )}
      </div>

      {activeTab === 'definitions' ? (
        <ListPage<ShiftDefinition>
          title="Configured Shifts"
          description="Manage working hours, overnight flags, grace period margins, and daily break allowances"
          columns={shiftColumns}
          items={shifts}
          total={totalShifts}
          isLoading={loadingShifts}
          isLoadingMore={loadingMoreShifts}
          hasMore={hasMoreShifts}
          error={shiftError}
          onRetry={refetchShifts}
          onLoadMore={loadMoreShifts}
          search={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search shifts by code or name..."
          emptyTitle="No shifts configured"
          emptyDescription="Create your organization shift policies to assign to employees."
        />
      ) : (
        <ShiftAssignmentsTab
          usersList={usersList}
          selectedUserId={selectedUserId}
          onSelectedUserIdChange={setSelectedUserId}
          assignments={assignments}
          loadingAssignments={loadingAssignments}
          onEditAssignment={shiftsMgmt.handleOpenEditAssignment}
          onDeleteAssignment={shiftsMgmt.handleDeleteAssignment}
        />
      )}

      <ShiftModals
        isShiftModalOpen={shiftsMgmt.isShiftModalOpen}
        onShiftModalClose={() => shiftsMgmt.setIsShiftModalOpen(false)}
        isEditingShift={shiftsMgmt.isEditingShift}
        shiftCode={shiftsMgmt.shiftCode}
        onShiftCodeChange={shiftsMgmt.setShiftCode}
        shiftName={shiftsMgmt.shiftName}
        onShiftNameChange={shiftsMgmt.setShiftName}
        startTime={shiftsMgmt.startTime}
        onStartTimeChange={shiftsMgmt.setStartTime}
        endTime={shiftsMgmt.endTime}
        onEndTimeChange={shiftsMgmt.setEndTime}
        isOvernight={shiftsMgmt.isOvernight}
        onIsOvernightChange={shiftsMgmt.setIsOvernight}
        gracePeriodMinutes={shiftsMgmt.gracePeriodMinutes}
        onGracePeriodMinutesChange={shiftsMgmt.setGracePeriodMinutes}
        paidBreakAllowance={shiftsMgmt.paidBreakAllowance}
        onPaidBreakAllowanceChange={shiftsMgmt.setPaidBreakAllowance}
        halfDayThresholdMinutes={shiftsMgmt.halfDayThresholdMinutes}
        onHalfDayThresholdMinutesChange={shiftsMgmt.setHalfDayThresholdMinutes}
        fullDayThresholdMinutes={shiftsMgmt.fullDayThresholdMinutes}
        onFullDayThresholdMinutesChange={shiftsMgmt.setFullDayThresholdMinutes}
        onShiftSubmit={shiftsMgmt.handleShiftSubmit}
        isShiftSubmitting={shiftsMgmt.isShiftSubmitting}
        isAssignModalOpen={shiftsMgmt.isAssignModalOpen}
        onAssignModalClose={() => shiftsMgmt.setIsAssignModalOpen(false)}
        isEditingAssignment={shiftsMgmt.isEditingAssignment}
        assignUserId={shiftsMgmt.assignUserId}
        onAssignUserIdChange={shiftsMgmt.setAssignUserId}
        assignShiftId={shiftsMgmt.assignShiftId}
        onAssignShiftIdChange={shiftsMgmt.setAssignShiftId}
        assignStartDate={shiftsMgmt.assignStartDate}
        onAssignStartDateChange={shiftsMgmt.setAssignStartDate}
        assignEndDate={shiftsMgmt.assignEndDate}
        onAssignEndDateChange={shiftsMgmt.setAssignEndDate}
        usersList={usersList}
        shifts={shifts}
        onAssignSubmit={shiftsMgmt.handleAssignSubmit}
        isAssignSubmitting={shiftsMgmt.isAssignSubmitting}
      />
    </div>
  );
};
