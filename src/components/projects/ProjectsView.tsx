import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  LayoutGrid,
  List,
  MapPin,
  Building,
  User,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  Euro,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';

interface ProjectsViewProps {
  onOpenNewProject: () => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onOpenNewProject }) => {
  const { projects, openProjectDetails, globalSearchQuery } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [localSearch, setLocalSearch] = useState<string>('');

  const effectiveSearch = globalSearchQuery || localSearch;

  const filteredProjects = projects.filter((p) => {
    const matchesStatus =
      statusFilter === 'All' ? true : p.status === statusFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      p.client.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      p.projectManager.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      p.location.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case 'On Track':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            On Track
          </span>
        );
      case 'At Risk':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3 h-3 text-amber-700" />
            At Risk
          </span>
        );
      case 'Delayed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200">
            <ShieldAlert className="w-3 h-3 text-rose-700" />
            Delayed
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <CheckCircle2 className="w-3 h-3 text-blue-700" />
            Completed
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Actions Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'On Track', 'At Risk', 'Delayed', 'Completed'].map((status) => {
            const count =
              status === 'All'
                ? projects.length
                : projects.filter((p) => p.status === status).length;
            return (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status} ({count})
              </button>
            );
          })}
        </div>

        {/* Right: Search, View Mode, New Project Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter projects..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 w-44 md:w-56"
            />
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenNewProject}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Project</span>
          </button>
        </div>
      </div>

      {/* Grid Mode */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((project) => {
            const remaining = project.budget - project.spent;
            const spendRatio = Math.round((project.spent / project.budget) * 100);

            return (
              <div
                key={project.id}
                onClick={() => openProjectDetails(project.id)}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group overflow-hidden"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {project.type}
                    </span>
                    {getStatusBadge(project.status)}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-700 transition leading-snug">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{project.location}</span>
                    </p>
                  </div>

                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Client:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[170px]">
                        {project.client}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Project Manager:</span>
                      <span className="font-medium text-slate-800">
                        {project.projectManager}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Schedule:</span>
                      <span className="font-mono text-[11px] text-slate-700">
                        {project.startDate} → {project.expectedCompletion}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-slate-700">Progress</span>
                      <span className="font-bold text-slate-900">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          project.status === 'At Risk'
                            ? 'bg-amber-500'
                            : project.status === 'Delayed'
                            ? 'bg-rose-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-sans">
                      Budget / Spent
                    </span>
                    <span className="font-bold text-slate-800">
                      €{(project.budget / 1000).toFixed(0)}k / €{(project.spent / 1000).toFixed(0)}k
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase font-sans">
                      Remaining
                    </span>
                    <span className="font-bold text-emerald-700">
                      €{(remaining / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table Mode */
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Manager</th>
                  <th className="py-3 px-3">Start Date</th>
                  <th className="py-3 px-3">Completion</th>
                  <th className="py-3 px-3">Budget</th>
                  <th className="py-3 px-3">Spent</th>
                  <th className="py-3 px-3 w-32">Progress</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredProjects.map((project) => (
                  <tr
                    key={project.id}
                    onClick={() => openProjectDetails(project.id)}
                    className="hover:bg-amber-50/40 cursor-pointer transition group"
                  >
                    <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-amber-700">
                      {project.name}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">{project.client}</td>
                    <td className="py-3.5 px-3 text-slate-500">{project.location}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{project.projectManager}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">{project.startDate}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-500">{project.expectedCompletion}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      €{project.budget.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-amber-700">
                      €{project.spent.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="font-bold w-7">{project.progress}%</span>
                        <div className="w-16 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-500 h-full rounded-full"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <span className="text-amber-600 font-semibold group-hover:translate-x-1 inline-flex items-center gap-1 transition">
                        Open <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
