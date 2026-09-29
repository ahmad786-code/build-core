import React, { useState } from 'react';
import { X, ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PurchaseOrderItem } from '../../types';

interface NewPurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewPurchaseOrderModal: React.FC<NewPurchaseOrderModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { projects, purchaseOrders, addPurchaseOrder } = useApp();

  const [poNumber, setPoNumber] = useState(
    `PO-2026-0${purchaseOrders.length + 90}`
  );
  const [supplier, setSupplier] = useState('Belgian Steel & Materials');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [requestedBy, setRequestedBy] = useState('Thomas Peeters');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [expectedDelivery, setExpectedDelivery] = useState(
    new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0]
  );
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<PurchaseOrderItem[]>([
    {
      description: 'Structural Steel Rebar BE500S (12mm)',
      quantity: 8,
      unit: 'Tons',
      unitPrice: 940,
      total: 7520,
    },
  ]);

  if (!isOpen) return null;

  const handleItemChange = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: value };
    item.total = Number(item.quantity || 0) * Number(item.unitPrice || 0);
    updated[index] = item;
    setItems(updated);
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: '',
        quantity: 1,
        unit: 'Pieces',
        unitPrice: 100,
        total: 100,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;

    addPurchaseOrder({
      poNumber,
      supplier,
      projectId,
      projectName: project.name,
      items,
      total,
      requestedBy,
      date,
      expectedDelivery,
      status: 'Pending',
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Generate Purchase Order
              </h3>
              <p className="text-xs text-slate-500">
                Official procurement requisition for site materials
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">PO Number</label>
              <input
                type="text"
                readOnly
                value={poNumber}
                className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Supplier *</label>
              <input
                type="text"
                required
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Destination Project *</label>
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

            <div>
              <label className="font-bold text-slate-700 block mb-1">Requested By *</label>
              <input
                type="text"
                required
                value={requestedBy}
                onChange={(e) => setRequestedBy(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Issue Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Expected Site Delivery</label>
              <input
                type="date"
                required
                value={expectedDelivery}
                onChange={(e) => setExpectedDelivery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Requisition Line Items
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="text-amber-600 font-bold hover:text-amber-700 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Line Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div className="flex-1">
                    <input
                      type="text"
                      required
                      placeholder="Material description"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                  </div>

                  <div className="w-16">
                    <input
                      type="number"
                      required
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>

                  <div className="w-20">
                    <input
                      type="text"
                      placeholder="Unit"
                      value={item.unit}
                      onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs"
                    />
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      required
                      placeholder="Unit Price"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs font-mono text-right"
                    />
                  </div>

                  <div className="w-24 text-right font-mono font-bold text-slate-900 pr-1">
                    €{item.total.toLocaleString()}
                  </div>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end p-2 bg-slate-100 rounded-lg text-xs font-bold text-slate-800">
              <span>Total: €{total.toLocaleString()} (Excl. VAT)</span>
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Delivery Instructions / Access Gate</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Call site supervisor 30 mins prior to arrival on Avenue Louise"
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
              Create Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
