import React, { useState } from 'react';
import {
  ClipboardList,
  Search,
  Plus,
  Calendar,
  CloudSun,
  Users,
  HardHat,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Camera,
  Eye,
  X,
  MapPin,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DailyReport } from '../../types';

interface DailyReportsViewProps {
  onOpenNewReport: () => void;
}

export const DailyReportsView: React.FC<DailyReportsViewProps> = ({ onOpenNewReport }) => {
  const {
    dailyReports,
    projects,
    selectedReportId,
    setSelectedReportId,
    globalSearchQuery,
  } = useApp();

  const [projectFilter, setProjectFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  const effectiveSearch = globalSearchQuery || localSearch;

  const filteredReports = dailyReports.filter((r) => {
    const matchesProject =
      projectFilter === 'All' ? true : r.projectId === projectFilter;
    const matchesSearch =
      r.projectName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      r.siteManager.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      r.workCompleted.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      r.date.includes(effectiveSearch);

    return matchesProject && matchesSearch;
  });

  const inspectingReport = dailyReports.find((r) => r.id === selectedReportId);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Actions Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Project Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Site Filter:
          </span>
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 font-semibold focus:outline-none focus:border-amber-500"
          >
            <option value="All">All Construction Sites ({dailyReports.length} reports)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Search and New Report Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reports, weather, delays..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 w-48 md:w-64"
            />
          </div>

          <button
            onClick={onOpenNewReport}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Daily Report</span>
          </button>
        </div>
      </div>

      {/* Reports Feed / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            onClick={() => setSelectedReportId(report.id)}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer p-5 space-y-3.5 group"
          >
            {/* Report Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {report.date}
                </span>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition mt-0.5">
                  {report.projectName}
                </h3>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-800">
                  <Users className="w-3.5 h-3.5 text-slate-600" />
                  {report.workersOnSite} on site
                </span>
              </div>
            </div>

            {/* Weather & Site Manager */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <CloudSun className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="text-slate-700 truncate">{report.weather}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-slate-700 truncate">
                  Supervisor: <strong>{report.siteManager}</strong>
                </span>
              </div>
            </div>

            {/* Work Completed */}
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Work Completed
              </div>
              <p className="text-xs text-slate-700 leading-relaxed line-clamp-3">
                {report.workCompleted}
              </p>
            </div>

            {/* Safety & Problems Snapshot */}
            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-700 block">
                  Safety Compliance
                </span>
                <span className="text-slate-600 truncate block">
                  {report.safetyIssues}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-700 block">
                  Delays / Blockers
                </span>
                <span className="text-slate-600 truncate block">
                  {report.problemsDelays}
                </span>
              </div>
            </div>

            {/* Photos & View Details Action */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 font-medium">
                  {report.photos?.length || 0} Site Photos
                </span>
              </div>

              <span className="text-xs font-semibold text-amber-600 group-hover:translate-x-1 transition inline-flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Open Full Inspection Report
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Report Inspection Modal */}
      {inspectingReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span>Log #{inspectingReport.id}</span>
                  <span>•</span>
                  <span>{inspectingReport.date}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                  {inspectingReport.projectName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedReportId(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Key Meta Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Site Manager
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {inspectingReport.siteManager}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Weather / Conditions
                </span>
                <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                  {inspectingReport.weather}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Total Workers on Site
                </span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {inspectingReport.workersOnSite} active personnel
                </span>
              </div>
            </div>

            {/* Work Completed */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Work Completed Today
              </h4>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-800 leading-relaxed">
                {inspectingReport.workCompleted}
              </div>
            </div>

            {/* Materials Used & Equipment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Materials Used
                </h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  {inspectingReport.materialsUsed || 'None logged.'}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Equipment / Cranes Used
                </h4>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                  {inspectingReport.equipmentUsed || 'None logged.'}
                </div>
              </div>
            </div>

            {/* Safety & Problems */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                  Safety Issues & Compliance
                </h4>
                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs text-emerald-900 font-medium">
                  {inspectingReport.safetyIssues}
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  Problems & Site Delays
                </h4>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100 text-xs text-amber-900 font-medium">
                  {inspectingReport.problemsDelays}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            {inspectingReport.notes && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Supervisor Notes
                </h4>
                <p className="text-xs text-slate-600 italic p-3 bg-slate-50 rounded-xl">
                  "{inspectingReport.notes}"
                </p>
              </div>
            )}

            {/* Photo Attachments */}
            {inspectingReport.photos && inspectingReport.photos.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Site Photos Attached ({inspectingReport.photos.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {inspectingReport.photos.map((photoUrl, i) => (
                    <div key={i} className="relative rounded-xl overflow-hidden border border-slate-200 h-40 group">
                      <img
                        src={photoUrl}
                        alt={`Site Photo ${i + 1}`}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        Evidence #{i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Close Button */}
            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedReportId(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
              >
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
