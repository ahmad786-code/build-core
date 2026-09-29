import React, { useState } from 'react';
import {
  FileText,
  Search,
  Upload,
  Download,
  Filter,
  Eye,
  FileCheck,
  FolderOpen,
  Calendar,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory, DocumentItem } from '../../types';

interface DocumentsViewProps {
  onOpenUploadModal: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ onOpenUploadModal }) => {
  const { documents, projects, notify, globalSearchQuery } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  const effectiveSearch = globalSearchQuery || localSearch;

  const categories: (DocumentCategory | 'All')[] = [
    'All',
    'Contracts',
    'Invoices',
    'Site Reports',
    'Purchase Orders',
    'Project Documents',
  ];

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      categoryFilter === 'All' ? true : doc.category === categoryFilter;
    const matchesProject =
      projectFilter === 'All' ? true : doc.projectId === projectFilter;
    const matchesSearch =
      doc.title.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      doc.category.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      (doc.projectName && doc.projectName.toLowerCase().includes(effectiveSearch.toLowerCase()));

    return matchesCategory && matchesProject && matchesSearch;
  });

  const handleDownload = (doc: DocumentItem) => {
    notify(`Downloading ${doc.title} (${doc.fileSize})...`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenUploadModal}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            <Upload className="w-4 h-4" />
            <span>+ Upload Document</span>
          </button>
        </div>

        {/* Second Row: Search and Project */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search file name, permit, contract, invoice..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 font-medium">Site Project:</span>
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="All">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm hover:border-amber-400 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {doc.category}
                </span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                  {doc.fileType}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-amber-700 transition line-clamp-2 leading-snug">
                  {doc.title}
                </h3>
                {doc.projectName && (
                  <p className="text-[11px] text-slate-500 mt-1 font-medium">
                    Project: {doc.projectName}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>{doc.fileSize} • {doc.date}</span>
              <button
                onClick={() => handleDownload(doc)}
                className="text-amber-600 hover:text-amber-700 font-semibold p-1 hover:bg-amber-50 rounded flex items-center gap-1"
                title="Download"
              >
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
