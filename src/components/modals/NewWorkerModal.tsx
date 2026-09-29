import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NewWorkerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewWorkerModal: React.FC<NewWorkerModalProps> = ({ isOpen, onClose }) => {
  const { projects, addWorker } = useApp();

  const [name, setName] = useState('');
  const [role, setRole] = useState('Carpenter');
  const [phone, setPhone] = useState('+32 4 ');
  const [email, setEmail] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [hourlyRate, setHourlyRate] = useState<number>(50);
  const [certifications, setCertifications] = useState('VCA-Basis, Secourisme');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    addWorker({
      name,
      role,
      phone,
      email: email || `${name.toLowerCase().replace(/\s+/g, '.')}@buildcore.be`,
      currentProjectId: projectId,
      currentProjectName: project.name,
      hoursThisWeek: 40,
      status: 'Active on Site',
      certifications: certifications.split(',').map((c) => c.trim()),
      hourlyRate: Number(hourlyRate),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Onboard New Worker</h3>
              <p className="text-xs text-slate-500">Register employee to Belgian payroll & safety roster</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Maxime Laurent"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Trade Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
              >
                <option value="Project Manager">Project Manager</option>
                <option value="Site Manager">Site Manager</option>
                <option value="Site Supervisor">Site Supervisor</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Electrician">Electrician</option>
                <option value="Mason & Concrete Specialist">Mason / Concrete</option>
                <option value="Scaffolding Lead">Scaffolding Lead</option>
                <option value="Plumber / Pipefitter">Plumber / Pipefitter</option>
                <option value="HVAC Technician">HVAC Technician</option>
                <option value="Heavy Equipment Operator">Crane / Equipment Op</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Billing Rate (€/hr)</label>
              <input
                type="number"
                required
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Phone (BE) *</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Assigned Job Site *</label>
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
            <label className="font-bold text-slate-700 block mb-1">Certifications (comma separated)</label>
            <input
              type="text"
              value={certifications}
              onChange={(e) => setCertifications(e.target.value)}
              placeholder="e.g. VCA-Basis, AREI / RGIE, Brevet Grutier"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
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
              Add to Roster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
