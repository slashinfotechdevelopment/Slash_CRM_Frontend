import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TaskAttachment } from '@/api/types/task.types';
import { Paperclip, FileText, Eye, Download, RefreshCw, Trash2 } from 'lucide-react';
import { formatDate } from '@/utils/formatters';

interface TaskAttachmentsTabProps {
  attachments: TaskAttachment[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPreview: (att: TaskAttachment) => void;
  onDownload: (att: TaskAttachment) => void;
  onRescan: (att: TaskAttachment) => void;
  onDelete: (att: TaskAttachment) => void;
}

export const TaskAttachmentsTab: React.FC<TaskAttachmentsTabProps> = ({
  attachments,
  onFileUpload,
  onPreview,
  onDownload,
  onRescan,
  onDelete,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Task Attachments & Deliverables</h3>
          <p className="text-xs text-slate-500">ClamAV scan validated. Maximum file size 25MB.</p>
        </div>
        <div>
          <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-primary text-white text-xs font-semibold rounded-lg hover:bg-brand-primary-hover transition-colors">
            <Paperclip className="w-3.5 h-3.5" /> Upload File
            <input type="file" onChange={onFileUpload} className="hidden" />
          </label>
        </div>
      </div>

      {attachments.length === 0 ? (
        <div className="text-center py-8 text-xs text-slate-400 italic">
          No attachments uploaded. Use the button above to upload deliverables.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-3">File Name</th>
                <th className="p-3">Size</th>
                <th className="p-3">Scan Status</th>
                <th className="p-3">Uploaded</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attachments.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/50">
                  <td className="p-3 font-medium text-slate-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="truncate max-w-xs">{att.originalName}</span>
                  </td>
                  <td className="p-3 text-slate-500">{(att.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB</td>
                  <td className="p-3">
                    {att.scanStatus === 'CLEAN' ? (
                      <Badge variant="success">Clean</Badge>
                    ) : att.scanStatus === 'INFECTED' ? (
                      <Badge variant="danger">Infected</Badge>
                    ) : (
                      <Badge variant="warning">{att.scanStatus}</Badge>
                    )}
                  </td>
                  <td className="p-3 text-slate-400">{formatDate(att.createdAt)}</td>
                  <td className="p-3 text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => onPreview(att)} title="Preview Inline">
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDownload(att)} title="Download File">
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onRescan(att)} title="Rescan File">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDelete(att)} title="Delete File">
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
