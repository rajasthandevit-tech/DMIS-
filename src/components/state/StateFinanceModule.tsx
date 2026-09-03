import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import {
  Building2,
  FileCheck,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Landmark,
  Eye,
  KeyRound,
  Download,
  AlertCircle,
  FileText,
  Clock,
  Send,
} from 'lucide-react';

export const StateFinanceModule: React.FC = () => {
  const {
    demands,
    updateDemand,
    openESignModal,
    openDocViewer,
    openAuditModal,
    fundAllotments,
    currentUser,
    role,
  } = useDMIS();

  const [activeTab, setActiveTab] = useState<'demands' | 'allotment-ledger' | 'state-summary'>('demands');
  const [selectedDemandId, setSelectedDemandId] = useState<string | null>(null);

  // Demands submitted by Collectors ready for State Scrutiny
  const submittedDemands = demands.filter(
    (d) => d.status === 'CollectorSigned' || d.status === 'ApprovedStateDMRD' || d.status === 'SanctionIssued'
  );

  const handleStateApproval = (demandId: string, proposalNo: string, amountCr: number) => {
    const allotmentLetterNo = `DMRD/RELIEF/2025/AL-${Math.floor(100 + Math.random() * 900)}`;

    openESignModal(
      `State SDRF Budget Allotment Order - ${allotmentLetterNo}`,
      allotmentLetterNo,
      (sigMeta) => {
        updateDemand(
          demandId,
          {
            status: 'ApprovedStateDMRD',
            allotmentLetterNo: allotmentLetterNo,
            allotmentAmountCr: amountCr,
            remarks: `Approved by Secretary DMRD. Allotment Order ${allotmentLetterNo} issued. Ceilings loaded to IFMS 3.0.`,
          },
          'Secretary DMRD Issued SDRF Budget Allotment',
          `e-Sign Ref: ${sigMeta.signatureId}`
        );
        alert(`SDRF Allotment Order ${allotmentLetterNo} issued and digitally signed! Head 2245 budget ceiling released to Jaipur District.`);
      }
    );
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-50 rounded-xl border border-purple-200 text-purple-900">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <span>State DMRD Secretariat & Finance (Relief Head 2245)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-semibold border border-purple-200">
                Government of Rajasthan
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Scrutiny of District Demands, SDRF/NDRF norm verification, Financial Advisor concurrence & budget allotment letters.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('demands')}
            className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'demands'
                ? 'bg-[#1A365D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            District Demands ({submittedDemands.length})
          </button>
          <button
            onClick={() => setActiveTab('allotment-ledger')}
            className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'allotment-ledger'
                ? 'bg-[#1A365D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SDRF Budget Head 2245 Ledger
          </button>
          <button
            onClick={() => setActiveTab('state-summary')}
            className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'state-summary'
                ? 'bg-[#1A365D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All-District Overview
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">State SDRF Pool 2024-25</span>
          <div className="text-2xl font-black text-slate-900">₹ 1,480.00 Cr</div>
          <p className="text-[11px] text-emerald-600 font-semibold">75% Central / 25% State Share</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Total Allotted to Districts</span>
          <div className="text-2xl font-black text-blue-700">₹ 825.40 Cr</div>
          <p className="text-[11px] text-slate-400">Across 33 Districts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">District Demands Under Scrutiny</span>
          <div className="text-2xl font-black text-amber-600">{submittedDemands.length}</div>
          <p className="text-[11px] text-amber-600 font-semibold">Collector e-Signed Demands</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Uncommitted SDRF Balance</span>
          <div className="text-2xl font-black text-emerald-700">₹ 654.60 Cr</div>
          <p className="text-[11px] text-slate-400">Readily available for allotment</p>
        </div>
      </div>

      {/* 1. DISTRICT DEMANDS TAB */}
      {activeTab === 'demands' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {submittedDemands.map((demand) => {
              const amountCr = demand.totalAmountInr / 10000000;
              const isApproved = demand.status === 'ApprovedStateDMRD' || demand.status === 'SanctionIssued';

              return (
                <div key={demand.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#1A365D]">{demand.demandProposalNo}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                            isApproved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {demand.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-slate-900 mt-1">{demand.disasterEvent}</h3>
                      <p className="text-slate-500 text-xs mt-0.5">
                        District: <strong>{demand.district}</strong> • Collector Sanction Ref: {demand.collectorSanctionNo || 'Verified'}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 text-xs">Recommended Amount</span>
                      <div className="text-2xl font-black text-purple-900">₹ {amountCr.toFixed(2)} Cr</div>
                      <p className="text-[11px] text-slate-500">{demand.totalBeneficiaries.toLocaleString('en-IN')} Affected Farmers</p>
                    </div>
                  </div>

                  {/* Scrutiny Progress Chain */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Section Officer (Norms verified)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Accounts Officer (AO Budget checked)</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Financial Advisor (FA Concurrence)</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-bold text-purple-900">
                      <Clock className="w-4 h-4" />
                      <span>Secretary DMRD Approval</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openDocViewer(`State Allotment Note - ${demand.demandProposalNo}`, 'ConsolidatedDemand', demand)}
                        className="px-3 py-1.5 border border-slate-300 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Scrutiny Sheet</span>
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
                      {isApproved ? (
                        <div className="flex items-center gap-2 text-emerald-700 font-bold">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Allotment Letter Issued: {demand.allotmentLetterNo}</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStateApproval(demand.id, demand.demandProposalNo, amountCr)}
                          className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Issue State Allotment Order & e-Sign</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. ALLOTMENT LEDGER TAB */}
      {activeTab === 'allotment-ledger' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#1A365D]">Major Head 2245 Disaster Relief Ledger (2024-25)</h3>
              <p className="text-slate-500 text-xs">Allotment, progressive expenditure, and balance under state budget lines.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fundAllotments.map((fund) => (
              <div key={fund.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <span className="text-[10px] font-mono text-purple-700 font-bold">{fund.headOfAccount}</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">{fund.description}</h4>
                </div>

                <div className="space-y-1 pt-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Sanctioned Allotment:</span>
                    <strong className="text-slate-900">₹ {fund.totalAllottedCr} Cr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Progressive Disbursed:</span>
                    <strong className="text-emerald-700">₹ {fund.expenditureCr} Cr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Balance in Head:</span>
                    <strong className="text-purple-700">₹ {fund.balanceCr} Cr</strong>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: `${(fund.expenditureCr / fund.totalAllottedCr) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. STATE SUMMARY */}
      {activeTab === 'state-summary' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#1A365D]">District-wise Allocation & Disbursement Heatmap</h3>
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">District</th>
                  <th className="p-3">Disaster Incident</th>
                  <th className="p-3">Allotted SDRF (₹ Cr)</th>
                  <th className="p-3">Disbursed via DBT (₹ Cr)</th>
                  <th className="p-3">Beneficiary Count</th>
                  <th className="p-3">Audit Clearance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">Jaipur</td>
                  <td className="p-3 text-slate-600">Floods & Waterlogging</td>
                  <td className="p-3 font-bold text-purple-900">₹ 45.00 Cr</td>
                  <td className="p-3 font-bold text-emerald-700">₹ 38.50 Cr</td>
                  <td className="p-3">9,842 Farmers</td>
                  <td className="p-3 text-emerald-700 font-bold">100% Reconciled</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">Kota</td>
                  <td className="p-3 text-slate-600">Chambal River Inundation</td>
                  <td className="p-3 font-bold text-purple-900">₹ 35.00 Cr</td>
                  <td className="p-3 font-bold text-emerald-700">₹ 28.10 Cr</td>
                  <td className="p-3">7,210 Farmers</td>
                  <td className="p-3 text-emerald-700 font-bold">100% Reconciled</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900">Jodhpur</td>
                  <td className="p-3 text-slate-600">Flash Flood / Desert Rain</td>
                  <td className="p-3 font-bold text-purple-900">₹ 22.50 Cr</td>
                  <td className="p-3 font-bold text-emerald-700">₹ 19.80 Cr</td>
                  <td className="p-3">4,890 Farmers</td>
                  <td className="p-3 text-emerald-700 font-bold">100% Reconciled</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
