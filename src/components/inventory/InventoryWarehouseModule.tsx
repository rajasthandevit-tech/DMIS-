import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { InventoryItem } from '../../types';
import {
  Boxes,
  AlertTriangle,
  Send,
  Plus,
  ArrowDownUp,
  MapPin,
  CheckCircle2,
  Package,
} from 'lucide-react';

export const InventoryWarehouseModule: React.FC = () => {
  const { inventory, addInventoryItem, updateInventoryItem } = useDMIS();

  const [selectedLocation, setSelectedLocation] = useState('All');
  const [issueModalItem, setIssueModalItem] = useState<InventoryItem | null>(null);
  const [issueQty, setIssueQty] = useState(1);
  const [destinationTehsil, setDestinationTehsil] = useState('Chomu');
  const [dispatchedTo, setDispatchedTo] = useState('SDRF Rescue Unit 3');

  const filteredInventory =
    selectedLocation === 'All'
      ? inventory
      : inventory.filter((item) => (item.warehouseLocation || item.warehouse || '').includes(selectedLocation));

  const handleIssueStock = () => {
    if (!issueModalItem) return;
    const avail = issueModalItem.quantityAvailable ?? issueModalItem.availableQty ?? 0;
    const min = issueModalItem.minThreshold ?? issueModalItem.minStock ?? 50;
    if (issueQty > avail) {
      alert('Cannot issue more than available stock quantity.');
      return;
    }

    const updatedQty = avail - issueQty;
    updateInventoryItem(issueModalItem.id, {
      quantityAvailable: updatedQty,
      availableQty: updatedQty,
      status: updatedQty <= min ? 'Critical' : 'Available',
    });

    alert(
      `Dispatched ${issueQty} ${issueModalItem.unit} of ${issueModalItem.itemName} to ${destinationTehsil} (${dispatchedTo})!`
    );
    setIssueModalItem(null);
  };

  return (
    <div className="space-y-5">
      {/* Top Warehouse Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-[#1A365D]" />
          <div>
            <h3 className="font-bold text-sm text-[#1A365D]">State & District Relief Inventory Depots</h3>
            <p className="text-slate-500 text-[11px]">Real-time buffer stock monitoring & emergency dispatch</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="font-bold text-slate-700">Filter Warehouse:</label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
          >
            <option value="All">All Warehouses (Statewide)</option>
            <option value="Jaipur">Jaipur Central Store</option>
            <option value="Kota">Kota District Depot</option>
            <option value="Jodhpur">Jodhpur Arid Zone Depot</option>
            <option value="Udaipur">Udaipur Hilly Region Depot</option>
          </select>
        </div>
      </div>

      {/* Stock Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredInventory.map((item) => {
          const avail = item.quantityAvailable ?? item.availableQty ?? 0;
          const min = item.minThreshold ?? item.minStock ?? 50;
          const isCritical = avail <= min;
          return (
            <div
              key={item.id}
              className={`bg-white p-4 rounded-xl border shadow-2xs space-y-3 text-xs ${
                isCritical ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold">{item.category}</span>
                  <h4 className="font-bold text-sm text-slate-900 mt-0.5">{item.itemName}</h4>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isCritical
                      ? 'bg-red-100 text-red-800 border border-red-300'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  {isCritical ? 'Buffer Critical' : 'Sufficient Stock'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-500">Available Stock:</span>
                  <span className="text-xl font-black text-slate-900">
                    {avail} <span className="text-xs font-semibold text-slate-500">{item.unit}</span>
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Minimum Threshold:</span>
                  <strong>{min} {item.unit}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Depot Location:</span>
                  <span className="font-semibold text-slate-700">{item.warehouseLocation || item.warehouse}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400">Batch: {item.batchNo || 'BATCH-2025'}</span>
                <button
                  onClick={() => {
                    setIssueModalItem(item);
                    setIssueQty(1);
                  }}
                  className="px-3 py-1.5 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-lg transition text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Issue Stock</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stock Issue Modal */}
      {issueModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-300 space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#1A365D]">
              Dispatch Stock - {issueModalItem.itemName}
            </h3>
            <p className="text-slate-500 text-xs">
              Available at {issueModalItem.warehouseLocation || issueModalItem.warehouse}: <strong>{issueModalItem.quantityAvailable ?? issueModalItem.availableQty ?? 0} {issueModalItem.unit}</strong>
            </p>

            <div className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Dispatch Quantity ({issueModalItem.unit}) *</label>
                <input
                  type="number"
                  min="1"
                  max={issueModalItem.quantityAvailable ?? issueModalItem.availableQty ?? 9999}
                  value={issueQty}
                  onChange={(e) => setIssueQty(Number(e.target.value))}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Destination Tehsil / Incident Zone *</label>
                <input
                  type="text"
                  value={destinationTehsil}
                  onChange={(e) => setDestinationTehsil(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Unit / Receiving Officer *</label>
                <input
                  type="text"
                  value={dispatchedTo}
                  onChange={(e) => setDispatchedTo(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIssueModalItem(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleIssueStock}
                className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition shadow cursor-pointer"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
