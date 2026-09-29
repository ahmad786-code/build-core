import React, { useState } from 'react';
import {
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  Euro,
  Wrench,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Subcontractor, SubcontractorTrade } from '../../types';

interface SubcontractorsViewProps {
  onOpenNewSubcontractor: () => void;
}

export const SubcontractorsView: React.FC<SubcontractorsViewProps> = ({
  onOpenNewSubcontractor,
}) => {
  const { subcontractors, projects, globalSearchQuery, openProjectDetails } = useApp();
  const [tradeFilter, setTradeFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  const effectiveSearch = globalSearchQuery || localSearch;

  const filteredSubs = subcontractors.filter((s) => {
    const matchesTrade = tradeFilter === 'All' ? true : s.trade === tradeFilter;
    const matchesSearch =
      s.company.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      s.trade.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      s.projectName.toLowerCase().includes(effectiveSearch.toLowerCase());

    return matchesTrade && matchesSearch;
  });

  const totalContracted = subcontractors.reduce((acc, s) => acc + s.contractValue, 0);

  const trades: (SubcontractorTrade | 'All')[] = [
    'All',
    'Electrical',
    'Plumbing',
    'Roofing',
    'HVAC',
    'Concrete',
    'Painting',
    'Scaffolding',
    'Earthwork',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Overview Metric Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">
            Vetted Trade Partners
          </div>
          <div className="text-2xl font-black text-slate-900">{subcontractors.length} Companies</div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Fully certified & insured
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">
            Total Subcontracted Commitments
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            €{totalContracted.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Across 8 active project sites</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-semibold mb-1">
            Active On-Site Subcontractors
          </div>
          <div className="text-2xl font-black text-amber-700">
            {subcontractors.filter((s) => s.status === 'Active').length} Active
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Daily safety toolbox certified</div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Trade Filters */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
          {trades.map((trade) => (
            <button
              key={trade}
              onClick={() => setTradeFilter(trade)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                tradeFilter === trade
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {trade}
            </button>
          ))}
        </div>

        {/* Right: Search and Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search trade partner..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 w-44 md:w-56"
            />
          </div>

          <button
            onClick={onOpenNewSubcontractor}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add Subcontractor</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Company Name</th>
                <th className="py-3 px-3">Contact Person</th>
                <th className="py-3 px-3">Trade</th>
                <th className="py-3 px-3">Phone</th>
                <th className="py-3 px-3">Assigned Project</th>
                <th className="py-3 px-3">Contract Value</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Site</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredSubs.map((sub) => (
                <tr key={sub.id} className="hover:bg-amber-50/40 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {sub.company}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">
                    {sub.contactPerson}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-800">
                      {sub.trade}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-600">
                    {sub.phone}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {sub.projectName}
                  </td>
                  <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                    €{sub.contractValue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        sub.status === 'Active'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : sub.status === 'Contract Signed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <button
                      onClick={() => openProjectDetails(sub.projectId)}
                      className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center gap-1"
                    >
                      View <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
