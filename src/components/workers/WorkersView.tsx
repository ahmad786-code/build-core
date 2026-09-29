import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  HardHat,
  Clock,
  ShieldCheck,
  Building,
  CheckCircle2,
  X,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Worker } from '../../types';

interface WorkersViewProps {
  onOpenNewWorker: () => void;
}

export const WorkersView: React.FC<WorkersViewProps> = ({ onOpenNewWorker }) => {
  const {
    workers,
    projects,
    tasks,
    selectedWorkerId,
    setSelectedWorkerId,
    globalSearchQuery,
    openProjectDetails,
  } = useApp();

  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  const effectiveSearch = globalSearchQuery || localSearch;

  const filteredWorkers = workers.filter((w) => {
    const matchesRole = roleFilter === 'All' ? true : w.role.toLowerCase().includes(roleFilter.toLowerCase());
    const matchesSearch =
      w.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      w.role.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      w.currentProjectName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      w.phone.includes(effectiveSearch);

    return matchesRole && matchesSearch;
  });

  const selectedWorker = workers.find((w) => w.id === selectedWorkerId);
  const workerTasks = selectedWorker
    ? tasks.filter((t) => t.assignedEmployee === selectedWorker.name)
    : [];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Role Filter pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Manager', 'Supervisor', 'Carpenter', 'Electrician', 'Specialist'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                roleFilter === role
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {role === 'All' ? `All (45)` : role}
            </button>
          ))}
        </div>

        {/* Right: Search and Add Worker */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search worker by name, role, phone..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 w-48 md:w-64"
            />
          </div>

          <button
            onClick={onOpenNewWorker}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Worker</span>
          </button>
        </div>
      </div>

      {/* Workers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Current Project</th>
                <th className="py-3 px-3">Hours This Week</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredWorkers.map((worker) => (
                <tr
                  key={worker.id}
                  onClick={() => setSelectedWorkerId(worker.id)}
                  className="hover:bg-amber-50/40 cursor-pointer transition group"
                >
                  {/* Name with initials avatar */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center text-xs shrink-0">
                        {worker.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-amber-700 transition">
                          {worker.name}
                        </div>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {worker.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-3">
                    <span className="font-semibold text-slate-800">
                      {worker.role}
                    </span>
                  </td>

                  {/* Phone */}
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {worker.phone}
                  </td>

                  {/* Current Project */}
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-800">
                      {worker.currentProjectName}
                    </div>
                  </td>

                  {/* Hours This Week */}
                  <td className="py-3.5 px-3 font-mono">
                    <span className="font-bold text-slate-900">
                      {worker.hoursThisWeek} hrs
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {worker.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-3 text-right">
                    <span className="text-amber-600 font-semibold group-hover:translate-x-1 inline-flex items-center gap-1 transition">
                      Profile <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Worker Detail Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black text-base flex items-center justify-center shadow-md">
                  {selectedWorker.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {selectedWorker.name}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {selectedWorker.role} • BuildCore Construction Belgium
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorkerId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Weekly Logged Hours
                </span>
                <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
                  {selectedWorker.hoursThisWeek} hrs
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Standard CP 124 / PC 124</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">
                  Billing Rate
                </span>
                <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
                  €{selectedWorker.hourlyRate}/hr
                </span>
                <span className="text-[10px] text-slate-400">Standard project charge</span>
              </div>
            </div>

            {/* Current Project Assignment */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Current Active Assignment
              </span>
              <div
                onClick={() => {
                  setSelectedWorkerId(null);
                  openProjectDetails(selectedWorker.currentProjectId);
                }}
                className="p-3 bg-amber-50/50 hover:bg-amber-100/50 border border-amber-200 rounded-xl flex items-center justify-between cursor-pointer transition"
              >
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    {selectedWorker.currentProjectName}
                  </div>
                  <div className="text-[11px] text-amber-800">
                    Primary on-site deployment
                  </div>
                </div>
                <span className="text-xs font-semibold text-amber-700 flex items-center gap-1">
                  View Site <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-mono">{selectedWorker.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 truncate">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{selectedWorker.email}</span>
              </div>
            </div>

            {/* Belgian Construction Certifications (VCA / BeSaCC etc.) */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Certifications & Safety Passes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedWorker.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Tasks */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Current Open Tasks ({workerTasks.length})
              </span>
              {workerTasks.length === 0 ? (
                <p className="text-xs text-slate-400">No open deliverables assigned.</p>
              ) : (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {workerTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-2 bg-slate-50 rounded-lg text-xs flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-800 truncate max-w-[240px]">
                        {t.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500">
                        {t.dueDate}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedWorkerId(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
