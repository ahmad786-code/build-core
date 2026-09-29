import React, { useState } from 'react';
import { X, Building2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SubcontractorTrade } from '../../types';

interface NewSubcontractorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewSubcontractorModal: React.FC<NewSubcontractorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { projects, addSubcontractor } = useApp();

  const [company, setCompany] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [trade, setTrade] = useState<SubcontractorTrade>('Electrical');
  const [phone, setPhone] = useState('+32 ');
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [contractValue, setContractValue] = useState<number>(85000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    addSubcontractor({
      company,
      contactPerson,
      trade,
      phone,
      email: email || `info@${company.toLowerCase().replace(/[^a-z]/g, '')}.be`,
      projectId,
      projectName: project.name,
      contractValue: Number(contractValue),
      status: 'Active',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Add Subcontractor</h3>
              <p className="text-xs text-slate-500">Contract trade partner to job site</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Company Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Cebeo Électrotechnique B.V."
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Person *</label>
              <input
                type="text"
                required
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="e.g. Arnaud Van Damme"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Trade Discipline *</label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value as SubcontractorTrade)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Roofing">Roofing</option>
                <option value="HVAC">HVAC</option>
                <option value="Concrete">Concrete</option>
                <option value="Painting">Painting</option>
                <option value="Scaffolding">Scaffolding</option>
                <option value="Earthwork">Earthwork</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Phone *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Project *</label>
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

          <div>
            <label className="font-bold text-slate-700 block mb-1">Contract Value (€ EUR) *</label>
            <input
              type="number"
              required
              value={contractValue}
              onChange={(e) => setContractValue(Number(e.target.value))}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
            />
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
              Confirm Subcontract
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
