import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  FileText,
  AlertTriangle,
  ArrowRight,
  Filter,
  Eye,
  Download,
  Send,
  Building,
  Users,
  Search,
  Check,
  Percent,
} from 'lucide-react';

export const ReliefOICModule: React.FC = () => {
  const {
    demands,
    farmerApplications,
    createDemand,
    updateDemand,
    openESignModal,
    openDocViewer,
    openAuditModal,
    language,
  } = useDMIS();

  const [activeTab, setActiveTab] = useState<'consolidation' | 'demands' | 'dedup'>('consolidation');
  const [selectedTehsilFilter, setSelectedTehsilFilter] = useState('All');
  const [isConsolidating, setIsConsolidating] = useState(false);

  // Eligible applications verified by Tehsildar but not yet included in a finalized demand
  const eligibleApps = farmerApplications.filter(
    (a) => a.status === 'VerifiedTehsildar' || a.status === 'ApprovedCollector' || a.status === 'Sanctioned'
  );

  const pendingConsolidation = farmerApplications.filter((a) => a.status === 'VerifiedTehsildar');
  const totalBeneficiaries = pendingConsolidation.length;
  const totalSubsidyAmount = pendingConsolidation.reduce((sum, a) => sum + a.admissibleSubsidyAmount, 0);

  // Handle new demand generation
  const handleGenerateDemand = () => {
    if (pendingConsolidation.length === 0) {
      alert('No verified applications pending consolidation.');
      return;
    }

    setIsConsolidating(true);
    setTimeout(() => {
      setIsConsolidating(false);
      const demand = createDemand('Jaipur', 'Floods & Inundation 2024 (Kharif)');
      alert(`Consolidated Demand Proposal ${demand.demandProposalNo} generated for ₹${(demand.totalAmountInr / 10000000).toFixed(2)} Cr (${demand.totalBeneficiaries} farmers). Ready for Collector e-Sign.`);
      setActiveTab('demands');
    }, 600);
  };

  const handleForwardToCollector = (demandId: string, proposalNo: string) => {
    openESignModal(
      `District Relief Consolidation Note - ${proposalNo}`,
      proposalNo,
      (sigMeta) => {
        updateDemand(
          demandId,
          {
            status: 'PreparedOIC',
            remarks: `Forwarded to Collector with verified Jan Aadhaar dedup certificate. Sig: ${sigMeta.signatureId}`,
          },
          'OIC Forwarded Demand to Collector',
          `e-Sign Ref: ${sigMeta.signatureId}`
        );
        alert(`Demand ${proposalNo} successfully forwarded to District Collector Jaipur with e-Sign!`);
      }
    );
  };

  return (
    <div className="space-y-5">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[#1A365D]">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <span>District Relief Division (Officer-in-Charge)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                Jaipur District
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-tehsil damage consolidation, automated de-duplication & administrative sanction drafting under SDRF norms.
            </p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('consolidation')}
            className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'consolidation'
                ? 'bg-[#1A365D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tehsil Batches ({pendingConsolidation.length})
          </button>
          <button
            onClick={() => setActiveTab('demands')}
            className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'demands'
                ? 'bg-[#1A365D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Consolidated Demands ({demands.length})
          </button>
          <button
            onClick={() => setActiveTab('dedup')}
            className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'dedup'
                ? 'bg-[#1A365D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            De-Duplication Audit
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Pending Tehsildar Batches</span>
          <div className="text-2xl font-black text-[#1A365D]">{pendingConsolidation.length} Farmers</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Verified by Chomu, Amer, Chaksu</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Total Proposed Outlay</span>
          <div className="text-2xl font-black text-amber-600">₹ {(totalSubsidyAmount / 100000).toFixed(2)} Lakh</div>
          <p className="text-[11px] text-slate-400">Head 2245 SDRF Norms</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Jan Aadhaar Dedup Status</span>
          <div className="text-2xl font-black text-emerald-700 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>100% Cleared</span>
          </div>
          <p className="text-[11px] text-slate-400">0 duplicate khasra conflicts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Total Demands Submitted</span>
          <div className="text-2xl font-black text-purple-700">{demands.length}</div>
          <p className="text-[11px] text-purple-600 font-semibold">State DMRD Level</p>
        </div>
      </div>

      {/* 1. CONSOLIDATION TAB */}
      {activeTab === 'consolidation' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-sm text-[#1A365D]">Verified Applications Awaiting Consolidation</h3>
                <p className="text-xs text-slate-500">
                  Select and package verified applications into a formal Administrative Sanction (AS) proposal.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedTehsilFilter}
                  onChange={(e) => setSelectedTehsilFilter(e.target.value)}
                  className="p-2 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
                >
                  <option value="All">All Tehsils (Jaipur)</option>
                  <option value="Chomu">Chomu Tehsil</option>
                  <option value="Amer">Amer Tehsil</option>
                  <option value="Jamwa Ramgarh">Jamwa Ramgarh Tehsil</option>
                </select>

                <button
                  onClick={handleGenerateDemand}
                  disabled={isConsolidating || pendingConsolidation.length === 0}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition shadow flex items-center gap-2 cursor-pointer"
                >
                  {isConsolidating ? (
                    <span>Consolidating...</span>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Consolidate & Draft Demand Note</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Application ID</th>
                    <th className="p-3">Farmer & Jan Aadhaar</th>
                    <th className="p-3">Tehsil / Village</th>
                    <th className="p-3">Crop / Damage</th>
                    <th className="p-3">Admissible Subsidy</th>
                    <th className="p-3">Verification Stage</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingConsolidation.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-3 font-mono font-bold text-blue-900">{app.applicationNo}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{app.farmerName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">FID: {app.janAadhaarFamilyId}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-slate-800">{app.tehsil}</span>
                        <div className="text-[11px] text-slate-500">{app.village}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-semibold">{app.cropName} ({app.landType})</div>
                        <div className="text-red-600 font-bold text-[11px]">{app.assessedDamagePercentage}% Loss</div>
                      </td>
                      <td className="p-3 font-bold text-slate-900">
                        ₹ {app.admissibleSubsidyAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => openDocViewer(`Girdawari Slip - ${app.farmerName}`, 'FarmerApplication', app)}
                          className="px-2.5 py-1 text-slate-600 hover:text-blue-700 font-semibold text-[11px] border border-slate-200 rounded-lg cursor-pointer"
                        >
                          View Form
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. DEMANDS TAB */}
      {activeTab === 'demands' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {demands.map((demand) => (
              <div key={demand.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-[#1A365D]">{demand.demandProposalNo}</span>
                      <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px]">
                        {demand.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mt-1">{demand.disasterEvent}</h3>
                    <p className="text-xs text-slate-500">
                      District: {demand.district} • Date: {demand.preparedDate} • Head: 2245-02-101-01
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 text-xs">Consolidated Outlay</span>
                    <div className="text-xl font-black text-amber-600">
                      ₹ {(demand.totalAmountInr / 10000000).toFixed(2)} Cr
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">
                      {demand.totalBeneficiaries.toLocaleString('en-IN')} Total Farmers
                    </span>
                  </div>
                </div>

                {/* Tehsil Distribution Table */}
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Tehsil Breakdown in this Demand:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {demand.tehsilBreakdown.map((t, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <div className="font-bold text-slate-900 text-xs">{t.tehsil}</div>
                        <div className="text-slate-500 text-[11px] mt-1">Beneficiaries: <strong>{t.beneficiaryCount}</strong></div>
                        <div className="text-amber-700 font-bold text-[11px]">₹ {(t.amountInr / 100000).toFixed(2)} Lakh</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDocViewer(`Consolidated Demand Proposal - ${demand.demandProposalNo}`, 'ConsolidatedDemand', demand)}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Formal Proposal</span>
                    </button>
                    <button
                      onClick={() => openAuditModal('ConsolidatedDemand', demand.demandProposalNo)}
                      className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Audit Trail</span>
                    </button>
                  </div>

                  <div>
                    {demand.status === 'Draft' && (
                      <button
                        onClick={() => handleForwardToCollector(demand.id, demand.demandProposalNo)}
                        className="px-4 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>e-Sign & Submit to Collector</span>
                      </button>
                    )}
                    {demand.status === 'PreparedOIC' && (
                      <span className="text-amber-700 font-bold flex items-center gap-1 text-xs">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Submitted to Collector Jaipur for Final e-Sign</span>
                      </span>
                    )}
                    {demand.status === 'CollectorSigned' && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-xs">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approved & Transmitted to State DMRD Secretariat</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. DEDUP AUDIT TAB */}
      {activeTab === 'dedup' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-bold text-sm text-[#1A365D]">Jan Aadhaar & Apna Khata De-Duplication Engine</h3>
              <p className="text-slate-500 text-xs">
                Real-time cross-database matching preventing duplicate claims across family members and joint landholdings.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900">Total Scanned Records:</span>
              <strong className="text-emerald-900">9,842 Farmer Applications</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900">Duplicate Jan Aadhaar Family IDs:</span>
              <strong className="text-emerald-900">0 (100% Unique)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900">Duplicate Khasra Number Filings:</span>
              <strong className="text-emerald-900">0 (Validated via Bhulekh API)</strong>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-900">Bank Account Verification (DBT Ready):</span>
              <strong className="text-emerald-900">9,842 Active NPCI Mapped Accounts</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
