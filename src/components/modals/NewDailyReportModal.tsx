import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  Calendar,
  CloudSun,
  Users,
  HardHat,
  Camera,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface NewDailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProjectId?: string;
}

export const NewDailyReportModal: React.FC<NewDailyReportModalProps> = ({
  isOpen,
  onClose,
  defaultProjectId,
}) => {
  const { projects, addDailyReport } = useApp();

  const [projectId, setProjectId] = useState(defaultProjectId || projects[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [siteManager, setSiteManager] = useState('Sophie Janssens');
  const [weather, setWeather] = useState('Sunny, 16°C, Wind SW 2 Bft');
  const [workersOnSite, setWorkersOnSite] = useState<number>(12);
  const [workCompleted, setWorkCompleted] = useState('');
  const [materialsUsed, setMaterialsUsed] = useState('');
  const [equipmentUsed, setEquipmentUsed] = useState('');
  const [problemsDelays, setProblemsDelays] = useState('No major bottlenecks encountered.');
  const [safetyIssues, setSafetyIssues] = useState('Zero safety incidents. Daily BeSaCC / VCA toolbox conducted.');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1541888946425-d0fbb18615f7?auto=format&fit=crop&w=600&q=80',
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    addDailyReport({
      projectId,
      projectName: project.name,
      date,
      siteManager,
      weather,
      workersOnSite: Number(workersOnSite),
      workCompleted: workCompleted || 'Structural framing and interior MEP rough-ins performed according to schedule.',
      materialsUsed: materialsUsed || 'Ready-mix concrete, framing studs, conduit wiring.',
      equipmentUsed: equipmentUsed || 'Tower crane, scissor lift, concrete pump.',
      problemsDelays,
      safetyIssues,
      notes,
      photos,
    });

    onClose();
  };

  const handleAddSamplePhoto = () => {
    const samples = [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=600&q=80',
    ];
    const nextPhoto = samples[photos.length % samples.length];
    setPhotos([...photos, nextPhoto]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Log New Daily Site Report
              </h3>
              <p className="text-xs text-slate-500">
                Official Belgian construction site logbook entry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Row 1: Project & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Construction Project *
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500"
                required
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.location.split(',')[1]?.trim() || p.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Report Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500"
                required
              >
              </input>
            </div>
          </div>

          {/* Row 2: Site Manager, Weather, Workers */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Site Manager *
              </label>
              <input
                type="text"
                value={siteManager}
                onChange={(e) => setSiteManager(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                required
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Weather & Wind (Bft)
              </label>
              <input
                type="text"
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Workers on Site
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={workersOnSite}
                onChange={(e) => setWorkersOnSite(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Work Completed */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Work Completed *
            </label>
            <textarea
              rows={3}
              value={workCompleted}
              onChange={(e) => setWorkCompleted(e.target.value)}
              placeholder="e.g. Concrete slab poured on zone 3, electrical cabling pulled for 2nd floor, drywall studs installed..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Materials & Equipment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Materials Used
              </label>
              <input
                type="text"
                value={materialsUsed}
                onChange={(e) => setMaterialsUsed(e.target.value)}
                placeholder="e.g. 45m³ C30/37 Concrete, 200m YMvK cable"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Equipment Used
              </label>
              <input
                type="text"
                value={equipmentUsed}
                onChange={(e) => setEquipmentUsed(e.target.value)}
                placeholder="e.g. Liebherr 71K crane, Boels scissor lift"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Problems / Delays & Safety */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Problems / Delays
              </label>
              <input
                type="text"
                value={problemsDelays}
                onChange={(e) => setProblemsDelays(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Safety Issues / VCA Compliance
              </label>
              <input
                type="text"
                value={safetyIssues}
                onChange={(e) => setSafetyIssues(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              General Notes / Visitor Inspections
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Municipal inspector visited at 11:00; signed off on pile depth."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Photos Upload / Attached preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-700">
                Site Photos ({photos.length} attached)
              </label>
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> + Attach Site Photo
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto py-1">
              {photos.map((p, i) => (
                <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                  <img src={p} alt="Evidence" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setPhotos(photos.filter((_, idx) => idx !== i))}
                    className="absolute top-1 right-1 bg-slate-900/80 text-white rounded-full p-0.5"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit footer */}
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
              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow-sm transition active:scale-95"
            >
              Submit Daily Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
