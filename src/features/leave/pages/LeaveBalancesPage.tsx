import { getErrorMessage } from '@/api/client/errorMapper';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { leaveConnector } from '@/connectors/leave.connector';
import { usersConnector } from '@/connectors/users.connector';
import {
  LeaveBalance,
  LeaveTransaction,
  LeaveType,
  AdjustLeaveBalancePayload,
} from '@/api/types/leave.types';
import { UserItem } from '@/api/types/users.types';
import { Button } from '@/components/ui/Button';
import { EmployeeBalanceRosterTable } from '../components/EmployeeBalanceRosterTable';
import { AuditTransactionLedgerTable } from '../components/AuditTransactionLedgerTable';
import { AdjustBalanceModal } from '../components/AdjustBalanceModal';

export const LeaveBalancesPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const currentYear = new Date().getFullYear();
  const [activeTab, setActiveTab] = useState<'BALANCES' | 'TRANSACTIONS'>('BALANCES');
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [loadingBalances, setLoadingBalances] = useState(true);
  const [searchEmployee, setSearchEmployee] = useState('');

  const [transactions, setTransactions] = useState<LeaveTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  const [users, setUsers] = useState<UserItem[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);

  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState<{
    userId: string;
    leaveTypeId: string;
    adjustedDays: number;
    reason: string;
  }>({
    userId: '',
    leaveTypeId: '',
    adjustedDays: 1,
    reason: '',
  });
  const [isSubmittingAdjust, setIsSubmittingAdjust] = useState(false);
  const [adjustError, setAdjustError] = useState<string | null>(null);

  const loadBalances = useCallback(async () => {
    setLoadingBalances(true);
    try {
      const res = await leaveConnector.getEmployeeBalances({
        year: selectedYear,
        limit: 100,
      });
      setBalances(res.items);
    } catch (err) {
      console.error('Failed to load leave balances:', err);
    } finally {
      setLoadingBalances(false);
    }
  }, [selectedYear]);

  const loadTransactions = useCallback(async () => {
    setLoadingTransactions(true);
    try {
      const res = await leaveConnector.getTransactions({ limit: 50 });
      setTransactions(res.items);
    } catch (err) {
      console.error('Failed to load leave transactions:', err);
    } finally {
      setLoadingTransactions(false);
    }
  }, []);

  const loadMetadata = useCallback(async () => {
    try {
      const [usersRes, typesRes] = await Promise.all([
        usersConnector.getUsers({ limit: 100 }),
        leaveConnector.getLeaveTypes(false),
      ]);
      setUsers(usersRes.items || []);
      setLeaveTypes(typesRes || []);
      if (usersRes.items?.length && typesRes.length) {
        setAdjustForm((prev) => ({
          ...prev,
          userId: prev.userId || usersRes.items[0].id,
          leaveTypeId: prev.leaveTypeId || typesRes[0].id,
        }));
      }
    } catch (err) {
      console.error('Failed to load metadata:', err);
    }
  }, []);

  useEffect(() => {
    loadMetadata();
  }, [loadMetadata]);

  useEffect(() => {
    if (activeTab === 'BALANCES') {
      loadBalances();
    } else {
      loadTransactions();
    }
  }, [activeTab, loadBalances, loadTransactions]);

  const handleAdjustSubmit = async () => {
    if (!adjustForm.userId) {
      setAdjustError('Please select an employee.');
      return;
    }
    if (!adjustForm.leaveTypeId) {
      setAdjustError('Please select a leave type.');
      return;
    }
    if (isNaN(adjustForm.adjustedDays) || adjustForm.adjustedDays === 0) {
      setAdjustError('Adjustment delta must be a non-zero number.');
      return;
    }
    if (!adjustForm.reason || adjustForm.reason.trim().length < 3) {
      setAdjustError('Please provide an adjustment reason (min 3 chars).');
      return;
    }

    setAdjustError(null);
    setIsSubmittingAdjust(true);
    try {
      const payload: AdjustLeaveBalancePayload = {
        userId: adjustForm.userId,
        leaveTypeId: adjustForm.leaveTypeId,
        year: selectedYear,
        adjustedDays: Number(adjustForm.adjustedDays),
        reason: adjustForm.reason.trim(),
      };
      await leaveConnector.adjustLeaveBalance(payload);
      setIsAdjustModalOpen(false);
      setAdjustForm((prev) => ({ ...prev, reason: '', adjustedDays: 1 }));
      await Promise.all([loadBalances(), loadTransactions()]);
    } catch (err) {
      const msg = err instanceof Error ? getErrorMessage(err) : 'Failed to adjust balance.';
      setAdjustError(msg);
    } finally {
      setIsSubmittingAdjust(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Employee Leave Balances & Ledger</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Audit employee leave quotas, perform manual administrative adjustments, and inspect immutable transaction ledger.
          </p>
        </div>
        {hasPermission('leave.adjust_balances') && (
          <Button
            variant="primary"
            onClick={() => {
              setAdjustError(null);
              setIsAdjustModalOpen(true);
            }}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adjust Balance
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 flex gap-4 text-sm">
        <button
          onClick={() => setActiveTab('BALANCES')}
          className={`pb-3 font-medium transition-colors border-b-2 ${
            activeTab === 'BALANCES'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Employee Balance Roster
        </button>
        <button
          onClick={() => setActiveTab('TRANSACTIONS')}
          className={`pb-3 font-medium transition-colors border-b-2 ${
            activeTab === 'TRANSACTIONS'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          Audit Transaction Ledger
        </button>
      </div>

      {activeTab === 'BALANCES' ? (
        <EmployeeBalanceRosterTable
          balances={balances}
          loading={loadingBalances}
          searchEmployee={searchEmployee}
          onSearchChange={setSearchEmployee}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
        />
      ) : (
        <AuditTransactionLedgerTable
          transactions={transactions}
          loading={loadingTransactions}
        />
      )}

      <AdjustBalanceModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        users={users}
        leaveTypes={leaveTypes}
        adjustForm={adjustForm}
        setAdjustForm={setAdjustForm}
        isSubmitting={isSubmittingAdjust}
        errorMessage={adjustError}
        onSubmit={handleAdjustSubmit}
      />
    </div>
  );
};
