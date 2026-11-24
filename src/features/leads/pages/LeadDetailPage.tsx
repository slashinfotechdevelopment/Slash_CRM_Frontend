import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DetailPage } from '@/components/templates/DetailPage';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { LeadStatus } from '@/api/types/lead.types';
import { formatDate } from '@/utils/formatters';
import {
  Calendar,
  CheckCircle2,
  UserCheck,
  RotateCcw,
  Plus,
  Trash2,
  Edit,
  Award,
} from 'lucide-react';
import { LeadActivitiesTab } from '../components/LeadActivitiesTab';
import { LeadFollowUpsTab } from '../components/LeadFollowUpsTab';
import { LeadDetailModals } from '../components/LeadDetailModals';
import { useLeadDetail } from '../hooks/useLeadDetail';
import { useLeadDetailFields } from '../components/useLeadDetailFields';

export const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    lead,
    timeline,
    isLoading,
    error,
    activeTab,
    setActiveTab,
    fetchLeadData,
    setIsEditOpen,
    setIsAssignOpen,
    setIsQualifyOpen,
    setIsStatusOpen,
    setIsConvertOpen,
    setIsActivityOpen,
    setIsFollowUpOpen,
    setEditForm,
    setAssignForm,
    setQualifyForm,
    setStatusForm,
    setConvertForm,
    handleCompleteFollowUp,
    handleDeleteLead,
    handleRestoreLead,
    modalsProps,
  } = useLeadDetail(id, navigate);

  const fields = useLeadDetailFields(lead);

  const getStatusBadge = (status?: LeadStatus) => {
    if (!status) return null;
    switch (status) {
      case 'NEW':
        return <Badge variant="neutral">New</Badge>;
      case 'CONTACTED':
        return <Badge variant="info">Contacted</Badge>;
      case 'QUALIFIED':
        return <Badge variant="success">Qualified</Badge>;
      case 'UNQUALIFIED':
        return <Badge variant="warning">Unqualified</Badge>;
      case 'CONVERTED':
        return <Badge variant="success">Converted (Won)</Badge>;
      case 'LOST':
        return <Badge variant="danger">Lost</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  if (!lead && !isLoading) {
    return (
      <DetailPage
        title="Lead Not Found"
        onBack={() => navigate('/leads')}
        error={{ message: 'The requested lead record could not be found.' }}
        onRetry={fetchLeadData}
      />
    );
  }

  return (
    <>
      <DetailPage
        title={lead?.leadName || 'Lead Details'}
        subtitle={lead ? `${lead.leadCode} • Registered ${formatDate(lead.leadDate || lead.createdAt)}` : undefined}
        badge={getStatusBadge(lead?.status)}
        onBack={() => navigate('/leads')}
        isLoading={isLoading}
        error={error}
        onRetry={fetchLeadData}
        fields={fields}
        actions={
          lead && (
            <div className="flex flex-wrap items-center gap-2">
              {lead.deletedAt ? (
                <Button variant="accent" size="sm" onClick={handleRestoreLead} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
                  Restore Lead
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setQualifyForm({
                        qualificationStatus: lead.qualificationStatus,
                        note: '',
                        unqualifiedReason: lead.unqualifiedReason || '',
                      });
                      setIsQualifyOpen(true);
                    }}
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  >
                    Qualify
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setAssignForm({
                        assignedToId: lead.assignedToId || '',
                        departmentId: lead.departmentId || '',
                        note: '',
                      });
                      setIsAssignOpen(true);
                    }}
                    leftIcon={<UserCheck className="w-3.5 h-3.5 text-primary-600" />}
                  >
                    Assign
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setStatusForm({
                        status: lead.status,
                        pipelineStageId: lead.pipelineStageId || '',
                        lostReason: lead.lostReason || '',
                        note: '',
                      });
                      setIsStatusOpen(true);
                    }}
                    leftIcon={<RotateCcw className="w-3.5 h-3.5 text-neutral-600" />}
                  >
                    Status
                  </Button>
                  {lead.status === 'QUALIFIED' && !lead.convertedAt && (
                    <Button
                      variant="accent"
                      size="sm"
                      onClick={() => {
                        setConvertForm({ note: '' });
                        setIsConvertOpen(true);
                      }}
                      leftIcon={<Award className="w-3.5 h-3.5" />}
                    >
                      Convert
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditForm(lead);
                      setIsEditOpen(true);
                    }}
                    leftIcon={<Edit className="w-3.5 h-3.5" />}
                  >
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDeleteLead}>
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </Button>
                </>
              )}
            </div>
          )
        }
      >
        <div className="bg-white rounded-xl border border-neutral-200/80 shadow-xs overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-200 px-6 pt-3">
            <div className="flex gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('timeline')}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'timeline'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Activities & Timeline ({timeline.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('followups')}
                className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
                  activeTab === 'followups'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-500 hover:text-neutral-800'
                }`}
              >
                Scheduled Follow-ups ({lead?.followUps?.length || 0})
              </button>
            </div>

            <div className="pb-2">
              {activeTab === 'timeline' ? (
                <Button variant="primary" size="sm" onClick={() => setIsActivityOpen(true)} leftIcon={<Plus className="w-3.5 h-3.5" />}>
                  Log Activity
                </Button>
              ) : (
                <Button variant="primary" size="sm" onClick={() => setIsFollowUpOpen(true)} leftIcon={<Calendar className="w-3.5 h-3.5" />}>
                  Schedule Follow-up
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'timeline' && <LeadActivitiesTab timeline={timeline} />}
            {activeTab === 'followups' && (
              <LeadFollowUpsTab lead={lead} onCompleteFollowUp={handleCompleteFollowUp} />
            )}
          </div>
        </div>
      </DetailPage>

      <LeadDetailModals {...modalsProps} />
    </>
  );
};