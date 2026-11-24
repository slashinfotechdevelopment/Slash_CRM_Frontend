import { getErrorMessage } from '@/api/client/errorMapper';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { leaveConnector } from '@/connectors/leave.connector';
import {
  LeaveType,
  LeaveBalance,
  LeaveRequest,
  LeaveRequestStatus,
  ApplyLeaveRequestPayload,
} from '@/api/types/leave.types';
import { Button } from '@/components/ui/Button';
import { MyLeaveBalancesCards } from '../components/MyLeaveBalancesCards';
import { MyLeaveHistoryTable } from '../components/MyLeaveHistoryTable';
import { ApplyLeaveModal } from '../components/ApplyLeaveModal';
import { LeaveRequestDetailModals } from '../components/LeaveRequestDetailModals';

export const MyLeavePage: React.FC = () => {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(true);

  // Request history state
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestsTotal, setRequestsTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Application Modal state
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState<{
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    isHalfDay: boolean;
    halfDayPeriod: 'FIRST_HALF' | 'SECOND_HALF';
    reason: string;
  }>({
    leaveTypeId: '',
    startDate: '',
    endDate: '',
    isHalfDay: false,
    halfDayPeriod: 'FIRST_HALF',
    reason: '',
  });
  const [isApplying, setIsApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);

  // View request detail
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  // Cancel Request state
  const [requestToCancel, setRequestToCancel] = useState<LeaveRequest | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Load balances & active leave types
  const loadInitialData = useCallback(async () => {
    setLoadingBalances(true);
    try {
      const [balancesRes, typesRes] = await Promise.all([
        leaveConnector.getMyBalances(),
        leaveConnector.getLeaveTypes(false),
      ]);
      setBalances(balancesRes);
      setLeaveTypes(typesRes);
      if (typesRes.length > 0 && !applyForm.leaveTypeId) {
        setApplyForm((prev) => ({ ...prev, leaveTypeId: typesRes[0].id }));
      }
    } catch (err) {
      console.error('Failed to load leave balances or types:', err);
    } finally {
      setLoadingBalances(false);
    }
  }, [applyForm.leaveTypeId]);

  // Load request history
  const loadRequests = useCallback(async () => {
    setLoadingRequests(true);
    try {
      const res = await leaveConnector.getMyLeaveRequests({
        status: statusFilter === 'ALL' ? undefined : (statusFilter as LeaveRequestStatus),
        limit: 50,
      });
      setRequests(res.items);
      setRequestsTotal(res.total);
    } catch (err) {
      console.error('Failed to load user leave requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const selectedTypeBalance = useMemo(() => {
    return balances.find((b) => b.leaveTypeId === applyForm.leaveTypeId);
  }, [balances, applyForm.leaveTypeId]);

  const estimatedDays = useMemo(() => {
    if (!applyForm.startDate) return 0;
    if (applyForm.isHalfDay) return 0.5;
    if (!applyForm.endDate) return 1;
    const s = new Date(applyForm.startDate);
    const e = new Date(applyForm.endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || e < s) return 0;
    const diffTime = Math.abs(e.getTime() - s.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [applyForm.startDate, applyForm.endDate, applyForm.isHalfDay]);

  const handleApply = async () => {
    if (!applyForm.leaveTypeId) {
      setApplyError('Please select a leave type.');
      return;
    }
    if (!applyForm.startDate) {
      setApplyError('Start date is required.');
      return;
    }
    if (!applyForm.isHalfDay && !applyForm.endDate) {
      setApplyError('End date is required.');
      return;
    }
    if (!applyForm.isHalfDay && applyForm.endDate < applyForm.startDate) {
      setApplyError('End date cannot be prior to start date.');
      return;
    }
    if (!applyForm.reason || applyForm.reason.trim().length < 3) {
      setApplyError('Please provide a reason (minimum 3 characters).');
      return;
    }

    setApplyError(null);
    setIsApplying(true);
    try {
      const payload: ApplyLeaveRequestPayload = {
        leaveTypeId: applyForm.leaveTypeId,
        startDate: applyForm.startDate,
        endDate: applyForm.isHalfDay ? applyForm.startDate : applyForm.endDate,
        isHalfDay: applyForm.isHalfDay,
        halfDayPeriod: applyForm.isHalfDay ? applyForm.halfDayPeriod : undefined,
        reason: applyForm.reason.trim(),
      };
      await leaveConnector.applyLeave(payload);
      setIsApplyModalOpen(false);
      setApplyForm({
        leaveTypeId: leaveTypes[0]?.id || '',
        startDate: '',
        endDate: '',
        isHalfDay: false,
        halfDayPeriod: 'FIRST_HALF',
        reason: '',
      });
      await Promise.all([loadInitialData(), loadRequests()]);
    } catch (err) {
      const msg = err instanceof Error ? getErrorMessage(err) : 'Failed to submit leave request.';
      setApplyError(msg);
    } finally {
      setIsApplying(false);
    }
  };

  const handleViewDetail = async (req: LeaveRequest) => {
    setSelectedRequest(req);
    try {
      const detailed = await leaveConnector.getLeaveRequestById(req.id);
      setSelectedRequest(detailed);
    } catch (err) {
      console.error('Failed to fetch request detail:', err);
    }
  };

  const handleConfirmCancel = async () => {
    if (!requestToCancel) return;
    if (!cancelReason || cancelReason.trim().length < 3) {
      setCancelError('Please specify a cancellation reason (minimum 3 characters).');
      return;
    }
    setCancelError(null);
    setIsCancelling(true);
    try {
      await leaveConnector.cancelLeaveRequest(requestToCancel.id, {
        reason: cancelReason.trim(),
      });
      setRequestToCancel(null);
      setCancelReason('');
      await Promise.all([loadInitialData(), loadRequests()]);
    } catch (err) {
      const msg = err instanceof Error ? getErrorMessage(err) : 'Failed to cancel leave request.';
      setCancelError(msg);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Leave & Absence Workspace</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Track your annual leave allocations, check pending approvals, and submit time-off requests.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setApplyError(null);
            setIsApplyModalOpen(true);
          }}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Apply for Leave
        </Button>
      </div>

      <MyLeaveBalancesCards
        balances={balances}
        loading={loadingBalances}
      />

      <MyLeaveHistoryTable
        requests={requests}
        total={requestsTotal}
        loading={loadingRequests}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onViewDetail={handleViewDetail}
        onOpenCancel={(req) => {
          setCancelError(null);
          setCancelReason('');
          setRequestToCancel(req);
        }}
      />

      <ApplyLeaveModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        leaveTypes={leaveTypes}
        selectedTypeBalance={selectedTypeBalance}
        applyForm={applyForm}
        setApplyForm={setApplyForm}
        estimatedDays={estimatedDays}
        isApplying={isApplying}
        applyError={applyError}
        onSubmit={handleApply}
      />

      <LeaveRequestDetailModals
        selectedRequest={selectedRequest}
        onCloseDetail={() => setSelectedRequest(null)}
        requestToCancel={requestToCancel}
        onCloseCancel={() => setRequestToCancel(null)}
        cancelReason={cancelReason}
        onCancelReasonChange={setCancelReason}
        isCancelling={isCancelling}
        cancelError={cancelError}
        onConfirmCancel={handleConfirmCancel}
      />
    </div>
  );
};
