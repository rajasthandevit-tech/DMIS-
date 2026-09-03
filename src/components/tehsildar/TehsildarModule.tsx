import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { FarmerApplication, CattleCamp } from '../../types';
import {
  FileCheck2,
  KeyRound,
  FileText,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Building,
  Milk,
  Eye,
  CheckSquare,
  Square,
  ShieldCheck,
} from 'lucide-react';

export const TehsildarModule: React.FC = () => {
  const {
    currentUser,
    farmerApplications,
    updateFarmerApplication,
    cattleCamps,
    updateCattleCamp,
    openESignModal,
    openDocViewer,
    openAuditModal,
  } = useDMIS();

  const [activeTab, setActiveTab] = useState<'farmer-scrutiny' | 'tehsil-demand' | 'cattle-camps'>('farmer-scrutiny');
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [remarksText, setRemarksText] = useState('');
  const [demandSigned, setDemandSigned] = useState(false);
  const [demandRefNo, setDemandRefNo] = useState('TEH-CHOMU-AIS-2025-0041');

  // Filter for Tehsildar: Patwari verified applications
  const pendingFarmerApps = farmerApplications.filter((a) => a.status === 'VerifiedTehsildar');
  const collectorLevelApps = farmerApplications.filter((a) => a.status === 'ApprovedCollector' || a.status === 'Sanctioned');
  const pendingCamps = cattleCamps.filter((c) => c.status === 'Applied' || c.status === 'Verified');

  const totalEligibleFarmers = pendingFarmerApps.length;
  const totalDemandAmount = pendingFarmerApps.reduce((acc, a) => acc + a.admissibleSubsidyAmount, 0);

  const toggleSelectAll = () => {
    if (selectedAppIds.length === pendingFarmerApps.length) {
      setSelectedAppIds([]);
    } else {
      setSelectedAppIds(pendingFarmerApps.map((a) => a.id));
    }
  };

  const toggleSelectApp = (id: string) => {
    setSelectedAppIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkApprove = () => {
    if (selectedAppIds.length === 0) {
      alert('Please select at least one application.');
      return;
    }

    selectedAppIds.forEach((id) => {
      updateFarmerApplication(
        id,
        {
          status: 'ApprovedCollector', // forwards into Collector queue
          verifiedByTehsildar: true,
          remarks: remarksText || 'Tehsildar verified all Khasra and land records. Recommended to District Collector.',
        },
        'Tehsildar Endorsement & Forward',
        remarksText || 'Verified by Tehsildar Chomu'
      );
    });

    alert(`${selectedAppIds.length} farmer application(s) endorsed and forwarded to District Collector!`);
    setSelectedAppIds([]);
    setRemarksText('');
  };

  const handleReturnSelected = () => {
    if (selectedAppIds.length === 0) {
      alert('Please select at least one application to return.');
      return;
    }
    if (!remarksText) {
      alert('Please provide the return reason in remarks.');
      return;
    }

    selectedAppIds.forEach((id) => {
      updateFarmerApplication(
        id,
        {
          status: 'ReturnedToPatwari',
          rejectionReason: remarksText,
        },
        'Returned by Tehsildar',
        remarksText
      );
    });

    alert(`${selectedAppIds.length} application(s) returned to Patwari circle for correction.`);
    setSelectedAppIds([]);
    setRemarksText('');
  };

  const handleSignDemandProposal = () => {
    openESignModal(
      'Tehsil Consolidated Demand Proposal (Kharif 2024)',
      demandRefNo,
      (sigMeta) => {
        setDemandSigned(true);
        alert(`Tehsil Demand ${demandRefNo} cryptographically signed by ${currentUser.fullName} via Raj e-Sign and transmitted to District Collector!`);
      }
    );
  };

  return (
    <div className="space-y-5">
      {/* Sub-tabs for Tehsildar */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('farmer-scrutiny')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'farmer-scrutiny' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck2 className="w-4 h-4" />
          <span>Farmer Application Scrutiny ({pendingFarmerApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tehsil-demand')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'tehsil-demand' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Consolidated Tehsil Demand & e-Sign</span>
        </button>

        <button
          onClick={() => setActiveTab('cattle-camps')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'cattle-camps' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Milk className="w-4 h-4 text-emerald-600" />
          <span>Cattle Camp Field Inspections ({pendingCamps.length})</span>
        </button>
      </div>

      {/* 1. FARMER SCRUTINY GRID (Pages 134-147) */}
      {activeTab === 'farmer-scrutiny' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Top Quick Metric Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Awaiting Tehsildar Endorsement</span>
              <p className="text-2xl font-black text-[#1A365D] mt-0.5">{pendingFarmerApps.length}</p>
              <span className="text-[10px] text-amber-600 font-semibold">Patwari verified</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Total Subsidy Outlay</span>
              <p className="text-2xl font-black text-emerald-700 mt-0.5">₹ {totalDemandAmount.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-slate-500">Calculated under SDRF</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Patwar Circles Reporting</span>
              <p className="text-2xl font-black text-blue-600 mt-0.5">8 Circles</p>
              <span className="text-[10px] text-emerald-600 font-semibold">100% Girdawari synced</span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Collector Level Sanctioned</span>
              <p className="text-2xl font-black text-purple-700 mt-0.5">{collectorLevelApps.length}</p>
              <span className="text-[10px] text-slate-400">Ready for IFMS Bills</span>
            </div>
          </div>

          {/* Action Ribbon */}
          <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSelectAll}
                className="font-bold text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                {selectedAppIds.length === pendingFarmerApps.length && pendingFarmerApps.length > 0 ? (
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400" />
                )}
                <span>Select All ({selectedAppIds.length}/{pendingFarmerApps.length})</span>
              </button>

              <input
                type="text"
                value={remarksText}
                onChange={(e) => setRemarksText(e.target.value)}
                placeholder="Endorsement or Return Remarks (e.g. Verified on spot with Girdawari)..."
                className="p-1.5 px-3 border border-slate-300 rounded-lg text-xs w-72"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkApprove}
                disabled={selectedAppIds.length === 0}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition shadow cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Endorse & Forward ({selectedAppIds.length})</span>
              </button>

              <button
                onClick={handleReturnSelected}
                disabled={selectedAppIds.length === 0}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Return to Patwari</span>
              </button>
            </div>
          </div>

          {/* Application Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                    <th className="p-3 w-10 text-center">#</th>
                    <th className="p-3 font-bold">App No</th>
                    <th className="p-3 font-bold">Farmer / Jan Aadhaar</th>
                    <th className="p-3 font-bold">Village & Khasra</th>
                    <th className="p-3 font-bold">Crop & Loss %</th>
                    <th className="p-3 font-bold">Area (Ha)</th>
                    <th className="p-3 font-bold">Subsidy Amount</th>
                    <th className="p-3 font-bold">Patwari Check</th>
                    <th className="p-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingFarmerApps.map((app) => {
                    const isSelected = selectedAppIds.includes(app.id);
                    return (
                      <tr key={app.id} className={isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}>
                        <td className="p-3 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectApp(app.id)}
                            className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                          />
                        </td>
                        <td className="p-3 font-mono font-bold text-[#1A365D]">{app.applicationNo}</td>
                        <td className="p-3">
                          <p className="font-bold text-slate-800">{app.beneficiary.fullName}</p>
                          <p className="text-[10px] text-slate-500 font-mono">JA: {app.beneficiary.janAadhaarFamilyId}</p>
                        </td>
                        <td className="p-3">
                          <p className="text-slate-800">{app.beneficiary.village}</p>
                          <p className="text-[10px] text-slate-500 font-mono">Kh: {app.khasraNo}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-slate-800">{app.cropType}</p>
                          <span className="text-amber-700 font-bold">{app.lossPercentage}% Loss</span>
                        </td>
                        <td className="p-3 font-semibold">{app.affectedAreaHa} Ha</td>
                        <td className="p-3 font-black text-emerald-700">₹ {app.admissibleSubsidyAmount.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Verified</span>
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1">
                          <button
                            onClick={() =>
                              openDocViewer('Agriculture Relief Assessment Sheet', 'FarmerApplication', {
                                refNo: app.applicationNo,
                                applicant: app.beneficiary.fullName,
                                district: app.beneficiary.district,
                                amount: app.admissibleSubsidyAmount,
                                totalAreaHa: app.affectedAreaHa,
                              })
                            }
                            className="p-1 text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                            title="View Official Sheet"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openAuditModal('FarmerApplication', app.applicationNo)}
                            className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] hover:bg-slate-200 cursor-pointer"
                          >
                            Audit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. CONSOLIDATED TEHSIL DEMAND & E-SIGN (Pages 148-158) */}
      {activeTab === 'tehsil-demand' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Tehsil Consolidated Demand Proposal (Kharif 2024)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Consolidate verified farmer claims across all Patwar circles and apply Raj e-Sign.
              </p>
            </div>
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
              Ref: {demandRefNo}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Tehsil Summary Metrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px]">Total Patwar Circles</span>
                <p className="text-lg font-bold text-slate-800 mt-0.5">14 Circles</p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px]">Verified Beneficiaries</span>
                <p className="text-lg font-bold text-blue-700 mt-0.5">4,812 Farmers</p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px]">Cultivated Area Damaged</span>
                <p className="text-lg font-bold text-slate-800 mt-0.5">7,240 Hectares</p>
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="text-slate-400 text-[10px]">Financial Demand</span>
                <p className="text-lg font-black text-emerald-700 mt-0.5">₹ 6.15 Crores</p>
              </div>
            </div>
          </div>

          {/* Official Letter Preview */}
          <div className="p-4 bg-white rounded-xl border border-slate-300 font-serif text-xs leading-relaxed space-y-2">
            <div className="text-center border-b border-slate-300 pb-2 mb-2">
              <p className="font-bold text-slate-900 uppercase">Office of the Tehsildar, Chomu</p>
              <p className="text-[10px] text-slate-500 font-sans">District Jaipur, Government of Rajasthan</p>
            </div>
            <p><strong>To:</strong> The District Collector & District Disaster Management Authority (DDMA), Jaipur</p>
            <p><strong>Subject:</strong> Submission of Consolidated Agricultural Input Subsidy Demand under SDRF norms for Kharif 2024.</p>
            <p className="text-justify indent-6">
              Sir/Madam, in reference to the disaster declaration for Heavy Rainfall & Inundation in Chomu Tehsil, field verification of all affected farmers has been performed by the Patwaris and duly scrutinized by the undersigned. A total of 4,812 Small & Marginal Farmers have suffered crop losses exceeding statutory 33% threshold.
            </p>
            <p className="text-justify indent-6">
              It is requested that Administrative & Financial Sanction to the tune of <strong>₹ 6,15,40,000.00 (Rupees Six Crores Fifteen Lakhs Forty Thousand only)</strong> be kindly accorded.
            </p>

            {demandSigned && (
              <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-900 font-sans flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Raj e-Sign Applied (Aadhaar e-KYC Certified)</span>
                  </div>
                  <p className="text-[10px] mt-0.5 text-slate-600">
                    Digitally signed by Tehsildar {currentUser.fullName} on {new Date().toLocaleString('en-IN')}.
                  </p>
                </div>
                <button
                  onClick={() =>
                    openDocViewer('Official Tehsil Demand Order', 'TehsilDemand', {
                      refNo: demandRefNo,
                      district: 'Jaipur',
                      totalFarmers: 4812,
                      totalAreaHa: 7240,
                      totalAmountCr: 6.15,
                      totalAmountInr: 61540000,
                    })
                  }
                  className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-bold cursor-pointer transition"
                >
                  View Order
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            {!demandSigned ? (
              <button
                type="button"
                onClick={handleSignDemandProposal}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold rounded-lg text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Authenticate with Raj e-Sign OTP & Submit Demand</span>
              </button>
            ) : (
              <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Demand Proposal Dispatched to District Collector</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. CATTLE CAMP FIELD INSPECTIONS (Pages 77-80) */}
      {activeTab === 'cattle-camps' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
                <Milk className="w-5 h-5 text-emerald-600" />
                <span>Cattle Camp Physical Verification & Field Inspection</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tehsildar physical inspection of water source, shade arrangements, fodder storage, and vet doctor assignment.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cattleCamps.map((camp) => (
              <div key={camp.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{camp.campName}</h3>
                    <p className="text-slate-500 font-mono text-[10px]">{camp.registrationNo}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    camp.status === 'Sanctioned' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {camp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 text-[10px]">Location</span>
                    <p className="font-semibold">{camp.village}, {camp.tehsil}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Total Animals</span>
                    <p className="font-bold">{camp.totalAnimals} (Large: {camp.largeAnimals}, Small: {camp.smallAnimals})</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Daily Fodder Demand</span>
                    <p className="font-semibold">{camp.dailyFodderReqQuintal} Quintals</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Veterinary Doctor</span>
                    <p className="font-semibold text-slate-800">{camp.veterinaryDoctorAssigned}</p>
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-slate-200 space-y-1">
                  <span className="font-bold text-slate-800">Tehsildar Inspection Findings:</span>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    <span className="text-emerald-700">✓ Water Borewell Operational</span>
                    <span className="text-emerald-700">✓ Tin Sheds Installed</span>
                    <span className="text-emerald-700">✓ Fencing Secure</span>
                  </div>
                </div>

                {camp.status === 'Applied' && (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => {
                        updateCattleCamp(
                          camp.id,
                          {
                            status: 'Verified',
                            tehsildarInspectionDate: new Date().toISOString().split('T')[0],
                            tehsildarInspectionRemarks: 'Physical inspection completed. Water and sheds meet norms. Recommended for sanction.',
                          },
                          'Tehsildar Verified Camp',
                          'Inspection completed'
                        );
                        alert(`Cattle Camp ${camp.campName} inspected and recommended to District Collector!`);
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition cursor-pointer"
                    >
                      Verify & Recommend to Collector
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
