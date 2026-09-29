import React from 'react';
import {
  Settings,
  Building,
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  Globe,
  Euro,
  Users,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { resetToDemoData, notify } = useApp();

  return (
    <div className="space-y-6 pb-12 max-w-4xl">
      {/* Transformation Story / Sales Demo Hook Box */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 rounded-2xl p-6 text-white border border-slate-700 shadow-md space-y-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          The Value Proposition For Construction Owners
        </div>
        <h3 className="text-xl font-black text-white">
          Why BuildCore Replaces Excel + WhatsApp Workflows
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2">
            <span className="font-bold text-rose-400 block uppercase tracking-wider text-[11px]">
              BEFORE: Fragmented Chaos
            </span>
            <ul className="space-y-1.5 text-slate-300">
              <li className="flex items-center gap-2">
                <span className="text-rose-400">✕</span> 14 separate Excel spreadsheets with broken VLOOKUPs
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">✕</span> Unstructured WhatsApp group chats with lost photos
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">✕</span> Paper site reports sitting in binders for weeks
              </li>
              <li className="flex items-center gap-2">
                <span className="text-rose-400">✕</span> Surprise budget overruns discovered only at month end
              </li>
            </ul>
          </div>

          <div className="p-3.5 bg-amber-500/10 rounded-xl border border-amber-500/30 space-y-2">
            <span className="font-bold text-amber-400 block uppercase tracking-wider text-[11px]">
              AFTER: One Internal BuildCore ERP
            </span>
            <ul className="space-y-1.5 text-slate-200">
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Real-time budget vs. actual margin visibility
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Digital site manager daily logs with photographic evidence
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Automated low-stock procurement warning thresholds
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Direct accountability for all 45 site workers and trades
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Company Profile Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-base">Company Information</h3>
          <p className="text-xs text-slate-500">Official registered enterprise profile</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-500 font-semibold block mb-1">Company Legal Name</label>
            <input
              type="text"
              readOnly
              value="BuildCore Construction Belgium S.A. / N.V."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Operating Country & Currency</label>
            <input
              type="text"
              readOnly
              value="Belgium • EUR (€)"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Company Headcount</label>
            <input
              type="text"
              readOnly
              value="45 Active Employees (Permanent & Field)"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">Active Construction Projects</label>
            <input
              type="text"
              readOnly
              value="8 Projects Active Across Belgium"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-semibold"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">BCE / KBO Enterprise Number</label>
            <input
              type="text"
              readOnly
              value="BE 0849.201.940 (Brussels)"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-700"
            />
          </div>

          <div>
            <label className="text-slate-500 font-semibold block mb-1">TVA / BTW Identification</label>
            <input
              type="text"
              readOnly
              value="BE 0849.201.940"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-mono text-slate-700"
            />
          </div>
        </div>
      </div>

      {/* Demo Reset Panel */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              Reset Demo Dataset
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reset all projects, tasks, daily site logs, workers, and purchase orders back to the initial pristine Belgian construction company state.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Reset all demo data back to default?')) {
                resetToDemoData();
              }
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 transition"
          >
            Reset All Data
          </button>
        </div>
      </div>
    </div>
  );
};
