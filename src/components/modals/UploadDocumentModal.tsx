import React, { useState } from 'react';
import { X, Upload, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory } from '../../types';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { projects, addDocument } = useApp();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Contracts');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [fileType, setFileType] = useState<'PDF' | 'DWG' | 'DOCX' | 'XLSX' | 'JPG'>('PDF');
  const [fileSize, setFileSize] = useState('3.2 MB');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find((p) => p.id === projectId);

    addDocument({
      title: title.endsWith(`.${fileType.toLowerCase()}`) ? title : `${title}.${fileType.toLowerCase()}`,
      category,
      projectId,
      projectName: project?.name,
      uploadedBy: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      fileSize,
      fileType,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Upload Project Document</h3>
              <p className="text-xs text-slate-500">Archive blueprints, municipal permits, or signed contracts</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Document Title / File Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Permis_d_Urbanisme_Avenue_Louise_Bruxelles"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Document Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="Contracts">Contracts</option>
                <option value="Invoices">Invoices</option>
                <option value="Site Reports">Site Reports</option>
                <option value="Purchase Orders">Purchase Orders</option>
                <option value="Project Documents">Project Documents</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Associated Project *</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Format Type</label>
              <select
                value={fileType}
                onChange={(e) => setFileType(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="PDF">PDF</option>
                <option value="DWG">DWG (CAD Blueprint)</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
                <option value="JPG">JPG / PNG</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Simulated File Size</label>
              <input
                type="text"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Drag & drop mock upload area */}
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 text-center space-y-1">
            <Upload className="w-6 h-6 text-slate-400 mx-auto" />
            <div className="font-bold text-slate-700">Drag & drop files or click to browse</div>
            <div className="text-[11px] text-slate-400">Supports PDF, AutoCAD DWG, Office docs up to 50MB</div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-sm"
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
