import React, { useState } from 'react';
import {
  Package,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  ShoppingCart,
  Plus,
  ArrowUpRight,
  ShieldAlert,
  Edit2,
  Check,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Material } from '../../types';

interface MaterialsViewProps {
  onOpenNewPO: () => void;
}

export const MaterialsView: React.FC<MaterialsViewProps> = ({ onOpenNewPO }) => {
  const { materials, updateMaterialStock, globalSearchQuery } = useApp();
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);

  const effectiveSearch = globalSearchQuery || localSearch;

  const filteredMaterials = materials.filter((m) => {
    const matchesCategory =
      categoryFilter === 'All' ? true : m.category === categoryFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      m.supplier.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      m.location.toLowerCase().includes(effectiveSearch.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const lowStockItems = materials.filter(
    (m) => m.status === 'LOW STOCK' || m.status === 'Critical Low'
  );

  const handleStartEdit = (m: Material) => {
    setEditingId(m.id);
    setTempStock(m.currentStock);
  };

  const handleSaveStock = (id: string) => {
    updateMaterialStock(id, Number(tempStock));
    setEditingId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Low-Stock Warning Banners (Specifically required: Steel - LOW STOCK, Electrical Cable - LOW STOCK) */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-amber-900 text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Low Material Stock Alerts ({lowStockItems.length} items require replenishment)</span>
            </div>
            <button
              onClick={onOpenNewPO}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Create Purchase Order</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {lowStockItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded-lg border border-amber-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-black text-slate-900">{item.name}</span>
                  <div className="text-[11px] text-amber-800 mt-0.5">
                    Current: <strong>{item.currentStock} {item.unit}</strong> (Min required: {item.minimumStock} {item.unit})
                  </div>
                </div>
                <span className="bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase border border-rose-200">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Structural', 'Masonry', 'Carpentry', 'Insulation', 'Electrical', 'Plumbing', 'Finishes'].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  categoryFilter === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            )
          )}
        </div>

        {/* Right Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search materials, supplier, yard..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 w-48 md:w-64"
            />
          </div>

          <button
            onClick={onOpenNewPO}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Reorder PO</span>
          </button>
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Material Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Current Stock</th>
                <th className="py-3 px-3">Minimum Stock</th>
                <th className="py-3 px-3">Primary Supplier</th>
                <th className="py-3 px-3">Yard Location</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Quick Stock Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredMaterials.map((mat) => {
                const isEditing = editingId === mat.id;

                return (
                  <tr
                    key={mat.id}
                    className={`hover:bg-amber-50/40 transition ${
                      mat.status === 'LOW STOCK' || mat.status === 'Critical Low'
                        ? 'bg-amber-50/20'
                        : ''
                    }`}
                  >
                    {/* Material Name */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {mat.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        €{mat.unitPrice} / {mat.unit}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[11px]">
                        {mat.category}
                      </span>
                    </td>

                    {/* Current Stock */}
                    <td className="py-3.5 px-3 font-mono">
                      {isEditing ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            value={tempStock}
                            onChange={(e) => setTempStock(Number(e.target.value))}
                            className="w-20 px-2 py-1 bg-white border border-amber-500 rounded text-xs font-mono font-bold"
                          />
                          <button
                            onClick={() => handleSaveStock(mat.id)}
                            className="p-1 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            title="Save stock level"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <span className="font-bold text-slate-900 text-sm">
                          {mat.currentStock.toLocaleString()} {mat.unit}
                        </span>
                      )}
                    </td>

                    {/* Minimum Stock */}
                    <td className="py-3.5 px-3 font-mono text-slate-500">
                      {mat.minimumStock.toLocaleString()} {mat.unit}
                    </td>

                    {/* Supplier */}
                    <td className="py-3.5 px-3 font-semibold text-slate-800">
                      {mat.supplier}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3 text-slate-500">
                      {mat.location}
                    </td>

                    {/* Status Warning Badge */}
                    <td className="py-3.5 px-3">
                      {mat.status === 'LOW STOCK' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3 h-3 text-amber-700" />
                          LOW STOCK
                        </span>
                      ) : mat.status === 'Critical Low' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                          <ShieldAlert className="w-3 h-3 text-rose-700" />
                          Critical Low
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          In Stock
                        </span>
                      )}
                    </td>

                    {/* Quick Stock Action */}
                    <td className="py-3.5 px-3 text-right">
                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(mat)}
                          className="text-xs text-slate-500 hover:text-slate-900 font-semibold p-1 hover:bg-slate-100 rounded inline-flex items-center gap-1"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Adjust
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
