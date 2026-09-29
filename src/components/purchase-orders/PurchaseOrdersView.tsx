import React, { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Plus,
  FileText,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  X,
  Printer,
  Download,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchaseOrder } from '../../types';

interface PurchaseOrdersViewProps {
  onOpenNewPO: () => void;
}

export const PurchaseOrdersView: React.FC<PurchaseOrdersViewProps> = ({ onOpenNewPO }) => {
  const {
    purchaseOrders,
    selectedPOId,
    setSelectedPOId,
    updatePOStatus,
    globalSearchQuery,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [localSearch, setLocalSearch] = useState<string>('');

  const effectiveSearch = globalSearchQuery || localSearch;

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesStatus =
      statusFilter === 'All' ? true : po.status === statusFilter;
    const matchesSearch =
      po.poNumber.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      po.supplier.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      po.projectName.toLowerCase().includes(effectiveSearch.toLowerCase()) ||
      po.requestedBy.toLowerCase().includes(effectiveSearch.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const selectedPO = purchaseOrders.find((po) => po.id === selectedPOId);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Filter and Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          {['All', 'Pending', 'Approved', 'Ordered', 'Delivered'].map((status) => {
            const count =
              status === 'All'
                ? purchaseOrders.length
                : purchaseOrders.filter((po) => po.status === status).length;
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

        {/* Right: Search and Add PO */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search PO#, supplier, project..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-amber-500 w-48 md:w-64"
            />
          </div>

          <button
            onClick={onOpenNewPO}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>+ New Purchase Order</span>
          </button>
        </div>
      </div>

      {/* PO Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">PO Number</th>
                <th className="py-3 px-3">Supplier</th>
                <th className="py-3 px-3">Destination Project</th>
                <th className="py-3 px-3">Items Summary</th>
                <th className="py-3 px-3">Requested By</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Total Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Document</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredPOs.map((po) => (
                <tr
                  key={po.id}
                  onClick={() => setSelectedPOId(po.id)}
                  className="hover:bg-amber-50/40 cursor-pointer transition group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 group-hover:text-amber-700">
                    {po.poNumber}
                  </td>
                  <td className="py-3.5 px-3 font-semibold text-slate-800">
                    {po.supplier}
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">
                    {po.projectName}
                  </td>
                  <td className="py-3.5 px-3 text-slate-500 max-w-xs truncate">
                    {po.items.map((i) => `${i.quantity} ${i.unit} ${i.description}`).join(', ')}
                  </td>
                  <td className="py-3.5 px-3 text-slate-700">
                    {po.requestedBy}
                  </td>
                  <td className="py-3.5 px-3 font-mono text-slate-500">
                    {po.date}
                  </td>
                  <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-900 text-sm">
                    €{po.total.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        po.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : po.status === 'Ordered'
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : po.status === 'Approved'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <span className="text-amber-600 hover:text-amber-700 font-semibold inline-flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5" /> View
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* PO Full Details Document Modal */}
      {selectedPO && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95">
            {/* Document Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <div className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Official Procurement Voucher
                </div>
                <h3 className="text-2xl font-black text-slate-900 font-mono mt-0.5">
                  {selectedPO.poNumber}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => alert('Printing Purchase Order Document...')}
                  className="p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                  title="Print PO"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedPOId(null)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Parties Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Buyer / Company
                </span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  BuildCore Construction B.V.
                </div>
                <div className="text-slate-500 mt-0.5">
                  Project: <strong>{selectedPO.projectName}</strong>
                </div>
                <div className="text-slate-500">
                  Requested By: {selectedPO.requestedBy}
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block">
                  Supplier / Vendor
                </span>
                <div className="font-bold text-slate-900 text-sm mt-0.5">
                  {selectedPO.supplier}
                </div>
                <div className="text-slate-500 mt-0.5">
                  Issued Date: {selectedPO.date}
                </div>
                <div className="text-slate-500">
                  Expected Delivery: {selectedPO.expectedDelivery}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Order Line Items
              </div>
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                  <tr>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-3">Quantity</th>
                    <th className="py-2 px-3 text-right">Unit Price</th>
                    <th className="py-2 px-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 font-medium">
                  {selectedPO.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">
                        {item.description}
                      </td>
                      <td className="py-2.5 px-3 font-mono">
                        {item.quantity} {item.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        €{item.unitPrice.toFixed(2)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                        €{item.total.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td colSpan={3} className="py-2.5 px-3 text-right uppercase text-slate-600">
                      Total Purchase Order Amount (Excl. VAT):
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-base text-slate-900">
                      €{selectedPO.total.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes if any */}
            {selectedPO.notes && (
              <div className="text-xs bg-amber-50/60 border border-amber-200 p-3 rounded-lg text-amber-900">
                <strong>Delivery Notes:</strong> {selectedPO.notes}
              </div>
            )}

            {/* Status Workflow Action Bar */}
            <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Update Status:</span>
                {(['Pending', 'Approved', 'Ordered', 'Delivered'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => updatePOStatus(selectedPO.id, st)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      selectedPO.status === st
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedPOId(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
              >
                Close Voucher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
