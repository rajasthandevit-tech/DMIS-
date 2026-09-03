import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { ProcurementProposal, Quotation } from '../../types';
import {
  ShoppingCart,
  FileText,
  KeyRound,
  CheckCircle2,
  Boxes,
  Plus,
  ArrowRight,
  TrendingDown,
  Building,
  Check,
  PackageCheck,
} from 'lucide-react';

export const ProcurementModule: React.FC = () => {
  const {
    procurements,
    addProcurement,
    updateProcurement,
    addInventoryItem,
    openESignModal,
    openDocViewer,
  } = useDMIS();

  const [activeTab, setActiveTab] = useState<'proposals' | 'comparative' | 'new-indent'>('proposals');
  const [selectedProposal, setSelectedProposal] = useState<ProcurementProposal | null>(null);

  // New Indent form state
  const [indentForm, setIndentForm] = useState({
    title: 'Inflatable Rubber Rescue Boats (With 40HP OBM)',
    category: 'Rescue Equipment' as const,
    district: 'Jaipur',
    estimatedCost: 3500000,
    emergencyJustification: 'Critical requirement for Chambal and Banas river flood rescue operations.',
  });

  const handleCreateIndent = (e: React.FormEvent) => {
    e.preventDefault();
    const propNo = `PROP/DMRD/2025/${Math.floor(100 + Math.random() * 900)}`;
    addProcurement({
      proposalNo: propNo,
      title: indentForm.title,
      category: indentForm.category,
      district: indentForm.district,
      department: 'SDRF / Civil Defence',
      estimatedCost: indentForm.estimatedCost,
      status: 'QuotationsReceived',
      emergencyJustification: indentForm.emergencyJustification,
      items: [
        { itemName: 'Inflatable Motor Boat with OBM', quantity: 6, unit: 'Sets', specifications: 'Hypalon fabric, 10 person capacity, CE certified' }
      ],
      quotations: [
        { id: 'q1', vendorName: 'M/s Rajasthan Safety & Marine Corp', vendorGst: '08AAAAA0000A1Z5', quotedAmount: 3240000, isL1: true, technicalQualified: true, submissionDate: '2025-05-18' },
        { id: 'q2', vendorName: 'M/s Western Emergency Gear Ltd', vendorGst: '08BBBBB1111B2Z6', quotedAmount: 3480000, isL1: false, technicalQualified: true, submissionDate: '2025-05-19' },
        { id: 'q3', vendorName: 'M/s Premier Rescue Equipments', vendorGst: '08CCCCC2222C3Z7', quotedAmount: 3620000, isL1: false, technicalQualified: true, submissionDate: '2025-05-19' },
      ],
    });
    alert(`Emergency Procurement Indent ${propNo} created!`);
    setActiveTab('proposals');
  };

  const handleApproveL1AndIssuePO = (prop: ProcurementProposal) => {
    const poNumber = `PO/DMRD/2025/${Math.floor(1000 + Math.random() * 9000)}`;
    const l1Vendor = prop.quotations.find((q) => q.isL1) || prop.quotations[0];

    openESignModal(
      `Emergency Purchase Order - ${prop.title}`,
      poNumber,
      (sigMeta) => {
        updateProcurement(
          prop.id,
          {
            status: 'POCreated',
            poNumber: poNumber,
            poDate: new Date().toISOString().split('T')[0],
            selectedVendor: l1Vendor.vendorName,
            finalSanctionedAmount: l1Vendor.quotedAmount,
          },
          'PO Issued to L1 Vendor',
          `Purchase order sanctioned and signed. Ref: ${sigMeta.signatureId}`
        );
        alert(`Purchase Order ${poNumber} awarded to ${l1Vendor.vendorName} for ₹${l1Vendor.quotedAmount.toLocaleString('en-IN')}!`);
      }
    );
  };

  const handleReceiveGoods = (prop: ProcurementProposal) => {
    const grnNo = `GRN/JPR/2025/${Math.floor(100 + Math.random() * 900)}`;

    updateProcurement(
      prop.id,
      {
        status: 'GoodsReceived',
        grnNumber: grnNo,
        grnDate: new Date().toISOString().split('T')[0],
      },
      'Goods Receipt Note (GRN) Generated',
      `Physical inspection passed by technical committee.`
    );

    // Auto add to inventory
    addInventoryItem({
      itemName: prop.items[0]?.itemName || prop.title,
      category: prop.category,
      warehouseLocation: 'Jaipur Central Disaster Store',
      district: 'Jaipur',
      quantityAvailable: prop.items[0]?.quantity || 10,
      unit: prop.items[0]?.unit || 'Units',
      minThreshold: 5,
      lastInspectedDate: new Date().toISOString().split('T')[0],
      status: 'Available',
    });

    alert(`Goods Receipt Note ${grnNo} recorded! Stock added to Jaipur Central Disaster Store.`);
  };

  return (
    <div className="space-y-5">
      {/* Module Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => {
            setActiveTab('proposals');
            setSelectedProposal(null);
          }}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'proposals' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Procurement Indents & Orders ({procurements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('new-indent')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'new-indent' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4 text-amber-500" />
          <span>Create Emergency Indent</span>
        </button>
      </div>

      {/* 1. PROPOSALS LIST */}
      {activeTab === 'proposals' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {procurements.map((prop) => (
              <div key={prop.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-slate-400 text-[10px] block">{prop.proposalNo}</span>
                    <h3 className="font-bold text-sm text-[#1A365D] mt-0.5">{prop.title}</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    prop.status === 'GoodsReceived'
                      ? 'bg-emerald-100 text-emerald-800'
                      : prop.status === 'POCreated'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {prop.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400">Category & District:</span>
                    <p className="font-semibold text-slate-800">{prop.category} ({prop.district})</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Sanctioned Budget:</span>
                    <p className="font-bold text-emerald-700">
                      ₹ {(prop.finalSanctionedAmount || prop.estimatedCost).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-[11px]">
                  <p className="font-semibold text-slate-800">Emergency Justification:</p>
                  <p className="text-slate-600 italic">"{prop.emergencyJustification}"</p>
                </div>

                {/* Status-specific Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  {prop.status === 'QuotationsReceived' && (
                    <button
                      onClick={() => handleApproveL1AndIssuePO(prop)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Approve L1 & Issue PO with e-Sign</span>
                    </button>
                  )}

                  {prop.status === 'POCreated' && (
                    <button
                      onClick={() => handleReceiveGoods(prop)}
                      className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <PackageCheck className="w-3.5 h-3.5" />
                      <span>Verify Delivery & Issue GRN</span>
                    </button>
                  )}

                  {prop.status === 'GoodsReceived' && (
                    <div className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>GRN: {prop.grnNumber} (Stock Added to Depot)</span>
                    </div>
                  )}

                  <button
                    onClick={() =>
                      openDocViewer('Purchase Order & Tender Comparative Statement', 'ProcurementPO', {
                        poNumber: prop.poNumber || prop.proposalNo,
                        district: prop.district,
                        amount: prop.finalSanctionedAmount || prop.estimatedCost,
                      })
                    }
                    className="text-blue-700 font-semibold text-xs hover:underline cursor-pointer ml-auto"
                  >
                    View Official PO
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. CREATE EMERGENCY INDENT FORM */}
      {activeTab === 'new-indent' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto space-y-5 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              <span>Raise Emergency Procurement Indent</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Invokes Rule 144 of RTPP Act (Emergency Calamity Procurement with Spot Quotations).
            </p>
          </div>

          <form onSubmit={handleCreateIndent} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Item / Work Title *</label>
              <input
                type="text"
                required
                value={indentForm.title}
                onChange={(e) => setIndentForm({ ...indentForm, title: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={indentForm.category}
                  onChange={(e) => setIndentForm({ ...indentForm, category: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Rescue Equipment">Rescue Equipment (Boats, OBM, Jackets)</option>
                  <option value="De-watering Pumps">De-watering Pumps & Generators</option>
                  <option value="Relief Material">Relief Material (Tarpaulins, Blankets)</option>
                  <option value="Food & Ration">Emergency Dry Ration & Food Packets</option>
                  <option value="Medical Supplies">Emergency Medicines & Anti-venom</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Cost (INR) *</label>
                <input
                  type="number"
                  required
                  value={indentForm.estimatedCost}
                  onChange={(e) => setIndentForm({ ...indentForm, estimatedCost: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold text-emerald-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Emergency Justification & Disaster Mandate *</label>
              <textarea
                rows={3}
                required
                value={indentForm.emergencyJustification}
                onChange={(e) => setIndentForm({ ...indentForm, emergencyJustification: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('proposals')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition shadow"
              >
                Create Indent & Invite Quotations
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
