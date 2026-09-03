import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { FarmerApplication } from '../../types';
import {
  Sprout,
  FileSpreadsheet,
  Satellite,
  UserCheck,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Eye,
  Download,
  Upload,
  Plus,
  FileText,
  Building,
  ShieldAlert,
  Search,
} from 'lucide-react';

export const PatwariModule: React.FC = () => {
  const {
    language,
    currentUser,
    farmerApplications,
    updateFarmerApplication,
    addFarmerApplication,
    openAuditModal,
    openDocViewer,
  } = useDMIS();

  const [activeSubTab, setActiveSubTab] = useState<
    'dashboard' | 'applications' | 'add-village' | 'fetch-satellite' | 'jan-aadhaar' | 'excel-fallback' | 'returned' | 'bank-correction'
  >('dashboard');

  const [selectedApp, setSelectedApp] = useState<FarmerApplication | null>(null);
  const [verificationStep, setVerificationStep] = useState<'summary' | 'identity' | 'scheme' | 'attachments' | 'checklist'>('summary');
  const [decisionRemarks, setDecisionRemarks] = useState('');
  const [checklistValues, setChecklistValues] = useState<Record<string, boolean>>({
    identityVerified: true,
    jurisdictionVerified: true,
    schemeCorrect: true,
    disasterLocationVerified: true,
    damageQuantified: true,
    bankPassbookVerified: true,
    noDuplicateBeneficiary: true,
    fieldInspectionDone: true,
  });

  // Excel Fallback State (pages 118, 121-131)
  const [excelCategory, setExcelCategory] = useState<'SMF' | 'OSMF'>('SMF');
  const [uploadStep, setUploadStep] = useState<'select' | 'validating' | 'summary' | 'errors' | 'declaration'>('select');
  const [uploadedFileName, setUploadedFileName] = useState('');

  // Add Village Form State (page 115)
  const [newVillageForm, setNewVillageForm] = useState({
    season: 'Kharif 2024',
    calamity: 'Heavy Rain / Inundation',
    district: 'Jaipur',
    tehsil: 'Chomu',
    village: 'Rampura',
    notifiedAreaHa: 1500,
    affectedFarmersEst: 450,
  });

  // Filter applications for current patwari's jurisdiction
  const patwariApps = farmerApplications;
  const pendingApps = patwariApps.filter((a) => a.status === 'SubmittedPatwari');
  const returnedApps = patwariApps.filter((a) => a.status === 'ReturnedToPatwari');
  const failedBankApps = patwariApps.filter((a) => a.status === 'PaymentFailed');
  const verifiedApps = patwariApps.filter((a) => a.status !== 'SubmittedPatwari' && a.status !== 'ReturnedToPatwari' && a.status !== 'Draft');

  const handleDecision = (action: 'Recommend' | 'Return' | 'Reject') => {
    if (!selectedApp) return;

    if (action === 'Recommend') {
      updateFarmerApplication(
        selectedApp.id,
        {
          status: 'VerifiedTehsildar',
          verifiedByPatwari: true,
          remarks: decisionRemarks || 'Field verification completed. Recommended to Tehsildar for sanction.',
        },
        'Patwari Verification Complete',
        decisionRemarks
      );
    } else if (action === 'Return') {
      updateFarmerApplication(
        selectedApp.id,
        {
          status: 'ReturnedToPatwari',
          rejectionReason: decisionRemarks || 'Information incomplete. Returned for correction.',
        },
        'Returned for Rectification',
        decisionRemarks
      );
    } else {
      updateFarmerApplication(
        selectedApp.id,
        {
          status: 'Rejected',
          rejectionReason: decisionRemarks || 'Ineligible under notified SDRF guidelines.',
        },
        'Patwari Rejected Application',
        decisionRemarks
      );
    }

    setSelectedApp(null);
  };

  const handleSimulateExcelUpload = () => {
    setUploadStep('validating');
    setTimeout(() => {
      setUploadStep('summary');
    }, 1200);
  };

  return (
    <div className="space-y-5">
      {/* Patwari Header Nav Pills */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-1.5 text-xs font-bold">
        <button
          onClick={() => {
            setActiveSubTab('dashboard');
            setSelectedApp(null);
          }}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'dashboard' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sprout className="w-3.5 h-3.5" />
          <span>Dashboard & Overview</span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('applications');
            setSelectedApp(null);
          }}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'applications' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Farmer Verification Grid ({pendingApps.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('add-village')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'add-village' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-3.5 h-3.5 text-amber-500" />
          <span>Add Damage Village</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fetch-satellite')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'fetch-satellite' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Satellite className="w-3.5 h-3.5 text-emerald-600" />
          <span>Fetch e-Dharti / Satellite</span>
        </button>

        <button
          onClick={() => setActiveSubTab('excel-fallback')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'excel-fallback' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
          <span>SMF/OSMF Excel Fallback</span>
        </button>

        <button
          onClick={() => setActiveSubTab('returned')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'returned' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5 text-red-500" />
          <span>Returned Records ({returnedApps.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('bank-correction')}
          className={`px-3 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'bank-correction' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-purple-600" />
          <span>Bank Bill Correction ({failedBankApps.length})</span>
        </button>
      </div>

      {/* 1. PATWARI DASHBOARD (Pages 54, 113) */}
      {activeSubTab === 'dashboard' && !selectedApp && (
        <div className="space-y-5 animate-in fade-in">
          {/* Top KPI Cards (matches page 113 exactly) */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-slate-500 text-[10px] font-bold uppercase">Affected Villages</p>
              <p className="text-2xl font-black text-[#1A365D] mt-1">12</p>
              <span className="text-[10px] text-emerald-600 font-semibold">↑ 8.5% notified</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-slate-500 text-[10px] font-bold uppercase">Farmers Fetched</p>
              <p className="text-2xl font-black text-blue-600 mt-1">842</p>
              <span className="text-[10px] text-slate-400">e-Dharti & Satellite</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-slate-500 text-[10px] font-bold uppercase">Jan Aadhaar Verified</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">768</p>
              <span className="text-[10px] text-emerald-600 font-semibold">91.2% match</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-slate-500 text-[10px] font-bold uppercase">Verification Pending</p>
              <p className="text-2xl font-black text-amber-600 mt-1">{pendingApps.length}</p>
              <span className="text-[10px] text-amber-600 font-semibold">Urgent (SLA 48h)</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-slate-500 text-[10px] font-bold uppercase">Returned Records</p>
              <p className="text-2xl font-black text-red-600 mt-1">{returnedApps.length}</p>
              <span className="text-[10px] text-red-500">Requires Correction</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-slate-500 text-[10px] font-bold uppercase">Estimated Relief</p>
              <p className="text-2xl font-black text-slate-800 mt-1">₹34.93 Cr</p>
              <span className="text-[10px] text-blue-600 font-semibold">SDRF Outlay</span>
            </div>
          </div>

          {/* Farmer Processing Funnel & Loss Category Breakdown (Page 113) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Funnel */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
                <span>Farmer Processing Funnel</span>
                <span className="text-slate-400 font-mono text-[10px]">Chomu Tehsil</span>
              </h4>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Total Fetched (e-Dharti)</span>
                    <span className="font-bold">842 (100%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Jan Aadhaar Verified</span>
                    <span className="font-bold text-emerald-700">768 (91.2%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-600 h-2 rounded-full w-[91%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">Tehsil Scrutiny Cleared</span>
                    <span className="font-bold text-indigo-700">721 (85.6%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-600 h-2 rounded-full w-[85%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-600">District Eligible (SDRF Norm)</span>
                    <span className="font-bold text-amber-700">684 (81.2%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full w-[81%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Loss Category Distribution */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Loss Severity Analysis</h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <span className="font-semibold text-emerald-900">33 - 50% Crop Loss</span>
                  <span className="font-bold text-emerald-800">41,250 Ha (26%)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-100">
                  <span className="font-semibold text-amber-900">50 - 75% Crop Loss</span>
                  <span className="font-bold text-amber-800">48,610 Ha (31%)</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 border border-red-100">
                  <span className="font-semibold text-red-900">Above 75% Total Loss</span>
                  <span className="font-bold text-red-800">37,741 Ha (24%)</span>
                </div>
                <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-500 flex justify-between">
                  <span>Small & Marginal Farmers (SMF)</span>
                  <strong className="text-slate-800">68% of Beneficiaries</strong>
                </div>
              </div>
            </div>

            {/* Quick Actions & Pending Tasks */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Patwari Quick Actions</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveSubTab('applications')}
                  className="w-full text-left p-2.5 bg-blue-50 hover:bg-blue-100 rounded-lg border border-blue-200 text-xs font-bold text-blue-900 transition flex items-center justify-between cursor-pointer"
                >
                  <span>Start Verification Queue ({pendingApps.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveSubTab('excel-fallback')}
                  className="w-full text-left p-2.5 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 text-xs font-bold text-amber-900 transition flex items-center justify-between cursor-pointer"
                >
                  <span>Upload Bulk Excel Fallback</span>
                  <Upload className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setActiveSubTab('returned')}
                  className="w-full text-left p-2.5 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 text-xs font-bold text-red-900 transition flex items-center justify-between cursor-pointer"
                >
                  <span>Resolve Returned Records ({returnedApps.length})</span>
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Pending Tasks Grid (Page 113) */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                My Pending Field Tasks ({pendingApps.length} records)
              </h4>
              <span className="text-[11px] text-slate-500">Patwari: {currentUser.fullName}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                    <th className="p-3 font-bold">App No</th>
                    <th className="p-3 font-bold">Farmer Name</th>
                    <th className="p-3 font-bold">Jan Aadhaar</th>
                    <th className="p-3 font-bold">Village</th>
                    <th className="p-3 font-bold">Khasra No</th>
                    <th className="p-3 font-bold">Category</th>
                    <th className="p-3 font-bold">Loss %</th>
                    <th className="p-3 font-bold">Subsidy (₹)</th>
                    <th className="p-3 font-bold">Status</th>
                    <th className="p-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {farmerApplications.map((app) => (
                    <tr key={app.id} className="hover:bg-blue-50/50 transition">
                      <td className="p-3 font-mono font-bold text-[#1A365D]">{app.applicationNo}</td>
                      <td className="p-3 font-semibold text-slate-800">{app.beneficiary.fullName}</td>
                      <td className="p-3 font-mono text-slate-500">{app.beneficiary.janAadhaarFamilyId}</td>
                      <td className="p-3">{app.beneficiary.village}</td>
                      <td className="p-3 font-mono">{app.khasraNo}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          app.farmerCategory === 'SMF' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {app.farmerCategory}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-amber-700">{app.lossPercentage}%</td>
                      <td className="p-3 font-bold text-slate-900">₹ {app.admissibleSubsidyAmount.toLocaleString('en-IN')}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'SubmittedPatwari'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : app.status === 'VerifiedTehsildar'
                            ? 'bg-blue-100 text-blue-800'
                            : app.status === 'PaymentFailed' || app.status === 'ReturnedToPatwari'
                            ? 'bg-red-100 text-red-800 border border-red-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-1">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setVerificationStep('summary');
                            setActiveSubTab('applications');
                          }}
                          className="px-2.5 py-1 bg-[#1A365D] text-white rounded text-[11px] font-bold hover:bg-slate-800 transition cursor-pointer"
                        >
                          Verify / Review
                        </button>
                        <button
                          onClick={() => openAuditModal('FarmerApplication', app.applicationNo)}
                          className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[11px] hover:bg-slate-200 transition cursor-pointer"
                          title="View Audit Trail"
                        >
                          Logs
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

      {/* 2. VERIFICATION DETAILED FLOW & SCREENS (Pages 93-99, 133) */}
      {(activeSubTab === 'applications' || selectedApp) && (
        <div className="space-y-4 animate-in fade-in">
          {selectedApp ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Top Banner with App No & Tabs */}
              <div className="bg-[#1A365D] text-white p-4 flex flex-wrap items-center justify-between gap-3 border-b border-amber-500">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-amber-400 font-bold text-sm">{selectedApp.applicationNo}</span>
                    <span className="px-2 py-0.5 bg-white/10 text-white rounded text-[10px] font-bold">
                      {selectedApp.farmerCategory === 'SMF' ? 'Small & Marginal Farmer' : 'Other Farmer'}
                    </span>
                  </div>
                  <h3 className="font-bold text-base mt-0.5">{selectedApp.beneficiary.fullName}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      openDocViewer('Agriculture Relief Assessment Sheet', 'FarmerApplication', {
                        refNo: selectedApp.applicationNo,
                        applicant: selectedApp.beneficiary.fullName,
                        district: selectedApp.beneficiary.district,
                        amount: selectedApp.admissibleSubsidyAmount,
                        totalAreaHa: selectedApp.affectedAreaHa,
                      })
                    }
                    className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Official Form</span>
                  </button>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
                  >
                    Back to Grid
                  </button>
                </div>
              </div>

              {/* Multi-Step Stepper (Pages 93-99) */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex flex-wrap gap-2 text-xs font-semibold">
                <button
                  onClick={() => setVerificationStep('summary')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer transition ${
                    verificationStep === 'summary' ? 'bg-[#1A365D] text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  1. Application Summary
                </button>
                <button
                  onClick={() => setVerificationStep('identity')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer transition ${
                    verificationStep === 'identity' ? 'bg-[#1A365D] text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  2. Applicant & Bank
                </button>
                <button
                  onClick={() => setVerificationStep('scheme')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer transition ${
                    verificationStep === 'scheme' ? 'bg-[#1A365D] text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  3. Scheme & Damage
                </button>
                <button
                  onClick={() => setVerificationStep('attachments')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer transition ${
                    verificationStep === 'attachments' ? 'bg-[#1A365D] text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  4. Attachments ({selectedApp.attachments.length})
                </button>
                <button
                  onClick={() => setVerificationStep('checklist')}
                  className={`px-3 py-1.5 rounded-md cursor-pointer transition ${
                    verificationStep === 'checklist' ? 'bg-[#1A365D] text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  5. Verification & Decision
                </button>
              </div>

              <div className="p-6">
                {/* Step 1: Summary */}
                {verificationStep === 'summary' && (
                  <div className="space-y-4 text-xs animate-in fade-in">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div>
                        <p className="text-slate-400 text-[10px]">Calamity Event</p>
                        <p className="font-bold text-slate-800">{selectedApp.calamityType}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">Season</p>
                        <p className="font-bold text-slate-800">{selectedApp.season}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">Crop Damaged</p>
                        <p className="font-bold text-slate-800">{selectedApp.cropType}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">Khasra Number</p>
                        <p className="font-mono font-bold text-slate-800">{selectedApp.khasraNo}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">Total Cultivated Area</p>
                        <p className="font-semibold">{selectedApp.totalAreaHa} Hectares</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">Affected Area</p>
                        <p className="font-bold text-red-600">{selectedApp.affectedAreaHa} Hectares</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">Assessed Loss %</p>
                        <p className="font-bold text-amber-600">{selectedApp.lossPercentage}%</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-[10px]">Calculated Subsidy Amount</p>
                        <p className="font-black text-emerald-700 text-sm">
                          ₹ {selectedApp.admissibleSubsidyAmount.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200">
                      <p className="font-bold text-blue-900 mb-1">Field Observation Note:</p>
                      <p className="text-slate-700 italic">"{selectedApp.remarks}"</p>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setVerificationStep('identity')}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg font-bold hover:bg-slate-800 transition cursor-pointer"
                      >
                        Next: Identity & Bank →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Identity & Bank */}
                {verificationStep === 'identity' && (
                  <div className="space-y-4 text-xs animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Identity Details */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <h4 className="font-bold text-[#1A365D] uppercase tracking-wider">Jan Aadhaar Identity</h4>
                        <div className="space-y-1.5">
                          <p><strong>Full Name:</strong> {selectedApp.beneficiary.fullName}</p>
                          <p><strong>Father / Spouse:</strong> {selectedApp.beneficiary.fatherSpouseName}</p>
                          <p><strong>Family ID:</strong> <span className="font-mono text-blue-700">{selectedApp.beneficiary.janAadhaarFamilyId}</span></p>
                          <p><strong>Member ID:</strong> {selectedApp.beneficiary.janAadhaarMemberId}</p>
                          <p><strong>Aadhaar Vault Ref:</strong> <span className="font-mono">{selectedApp.beneficiary.aadhaarVaultRef}</span></p>
                          <p><strong>Mobile:</strong> {selectedApp.beneficiary.mobileNo}</p>
                        </div>
                      </div>

                      {/* Bank Details */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <h4 className="font-bold text-[#1A365D] uppercase tracking-wider">Bank Account for DBT</h4>
                        <div className="space-y-1.5">
                          <p><strong>Bank Name:</strong> {selectedApp.beneficiary.bankName}</p>
                          <p><strong>Account Number (Masked):</strong> <span className="font-mono font-bold">{selectedApp.beneficiary.accountNoMasked}</span></p>
                          <p><strong>IFSC Code:</strong> <span className="font-mono text-blue-700">{selectedApp.beneficiary.ifscCode}</span></p>
                          <p>
                            <strong>Validation Status:</strong>{' '}
                            {selectedApp.beneficiary.isBankVerified ? (
                              <span className="text-emerald-700 font-bold">✓ PFMS / NPCI Bank Seeded</span>
                            ) : (
                              <span className="text-red-600 font-bold">⚠ Bank Account Discrepancy Flagged</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setVerificationStep('summary')}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => setVerificationStep('scheme')}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg font-bold hover:bg-slate-800 transition cursor-pointer"
                      >
                        Next: Scheme & Damage →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Scheme & Damage */}
                {verificationStep === 'scheme' && (
                  <div className="space-y-4 text-xs animate-in fade-in">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                      <h4 className="font-bold text-[#1A365D] uppercase tracking-wider">SDRF Norms & Calculation</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 text-[10px]">Notified Rate / Hectare</span>
                          <p className="font-black text-slate-800 text-sm mt-0.5">₹ 8,500.00 / Ha</p>
                          <span className="text-[10px] text-slate-500">Rainfed / Un-irrigated SDRF norm</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 text-[10px]">SMF Ceiling Cap</span>
                          <p className="font-black text-slate-800 text-sm mt-0.5">Max 2.0 Hectares</p>
                          <span className="text-[10px] text-slate-500">Per Jan Aadhaar Family unit</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                          <span className="text-slate-400 text-[10px]">Admissible Assistance</span>
                          <p className="font-black text-emerald-700 text-sm mt-0.5">
                            ₹ {selectedApp.admissibleSubsidyAmount.toLocaleString('en-IN')}
                          </p>
                          <span className="text-[10px] text-emerald-600 font-semibold">Ready for Administrative Sanction</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setVerificationStep('identity')}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => setVerificationStep('attachments')}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg font-bold hover:bg-slate-800 transition cursor-pointer"
                      >
                        Next: Attachments →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Attachments */}
                {verificationStep === 'attachments' && (
                  <div className="space-y-4 text-xs animate-in fade-in">
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#1A365D] uppercase tracking-wider">
                        Mandatory Supporting Evidence & Raj eVault Documents
                      </h4>
                      <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <table className="w-full text-left">
                          <thead className="bg-slate-100 border-b border-slate-200">
                            <tr>
                              <th className="p-2.5 font-bold">Document Name</th>
                              <th className="p-2.5 font-bold">SHA-256 Hash</th>
                              <th className="p-2.5 font-bold">Virus Scan</th>
                              <th className="p-2.5 font-bold">Verification Status</th>
                              <th className="p-2.5 font-bold text-right">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {selectedApp.attachments.map((doc, idx) => (
                              <tr key={idx}>
                                <td className="p-2.5 font-semibold text-slate-800 flex items-center gap-1.5">
                                  <FileText className="w-4 h-4 text-blue-600" />
                                  <span>{doc.name}</span>
                                </td>
                                <td className="p-2.5 font-mono text-[10px] text-slate-400">{doc.hash}</td>
                                <td className="p-2.5">
                                  <span className="text-emerald-700 font-bold text-[10px] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                    Clean (No threats)
                                  </span>
                                </td>
                                <td className="p-2.5">
                                  <span className="text-blue-700 font-bold text-[10px]">Verified</span>
                                </td>
                                <td className="p-2.5 text-right">
                                  <button
                                    onClick={() => alert(`Opening preview of ${doc.name}`)}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold cursor-pointer"
                                  >
                                    Preview
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        onClick={() => setVerificationStep('scheme')}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        ← Previous
                      </button>
                      <button
                        onClick={() => setVerificationStep('checklist')}
                        className="px-4 py-2 bg-[#1A365D] text-white rounded-lg font-bold hover:bg-slate-800 transition cursor-pointer"
                      >
                        Next: Verification Checklist & Decision →
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 5: Checklist & Decision (Matches page 99 & 133) */}
                {verificationStep === 'checklist' && (
                  <div className="space-y-4 text-xs animate-in fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Checklist */}
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
                        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                          Mandatory Verification Checklist (Patwari)
                        </h4>
                        <div className="space-y-2">
                          {[
                            { id: 'identityVerified', label: '1. Identity of Applicant & Jan Aadhaar linkage verified' },
                            { id: 'jurisdictionVerified', label: '2. Village & Patwar circle jurisdiction verified' },
                            { id: 'schemeCorrect', label: '3. Calamity category (Flood/Heavy Rain) verified' },
                            { id: 'disasterLocationVerified', label: '4. Disaster location & Khasra surveyed on spot' },
                            { id: 'damageQuantified', label: '5. Crop loss assessed above statutory 33% threshold' },
                            { id: 'bankPassbookVerified', label: '6. Bank passbook details verified with PFMS' },
                            { id: 'noDuplicateBeneficiary', label: '7. Deduplication check verified across family' },
                            { id: 'fieldInspectionDone', label: '8. Field inspection completed by Patwari' },
                          ].map((item) => (
                            <label key={item.id} className="flex items-center gap-2 cursor-pointer text-slate-700">
                              <input
                                type="checkbox"
                                checked={checklistValues[item.id] ?? true}
                                onChange={(e) =>
                                  setChecklistValues({ ...checklistValues, [item.id]: e.target.checked })
                                }
                                className="rounded text-blue-600 w-4 h-4"
                              />
                              <span className="text-[11px] font-medium">{item.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Decision Panel */}
                      <div className="p-4 bg-white rounded-xl border-2 border-amber-300 space-y-3">
                        <h4 className="font-bold text-[#1A365D] text-xs uppercase tracking-wider">
                          Decision & Recommendation Panel
                        </h4>
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Officer Remarks / Recommendation Observations *
                          </label>
                          <textarea
                            rows={3}
                            value={decisionRemarks}
                            onChange={(e) => setDecisionRemarks(e.target.value)}
                            placeholder="Enter detailed verification remarks (minimum 10 characters)..."
                            className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>

                        <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200">
                          <p className="text-[11px] text-emerald-900">
                            <strong>Recommended Sanction:</strong> ₹{' '}
                            {selectedApp.admissibleSubsidyAmount.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[10px] text-emerald-700">
                            Will be forwarded to Tehsildar Chomu for executive endorsement.
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleDecision('Recommend')}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition cursor-pointer shadow flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Recommend & Forward</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDecision('Return')}
                            className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                          >
                            Return to Farmer
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDecision('Reject')}
                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                          >
                            Reject Claim
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Grid View */
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#1A365D]">
                  Farmer Applications Awaiting Patwari Action ({pendingApps.length})
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-600 border-b border-slate-200">
                      <th className="p-2.5 font-bold">App No</th>
                      <th className="p-2.5 font-bold">Farmer Name</th>
                      <th className="p-2.5 font-bold">Jan Aadhaar</th>
                      <th className="p-2.5 font-bold">Khasra</th>
                      <th className="p-2.5 font-bold">Crop</th>
                      <th className="p-2.5 font-bold">Loss %</th>
                      <th className="p-2.5 font-bold">Amount (₹)</th>
                      <th className="p-2.5 font-bold">Status</th>
                      <th className="p-2.5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pendingApps.map((app) => (
                      <tr key={app.id} className="hover:bg-blue-50/50">
                        <td className="p-2.5 font-mono font-bold text-[#1A365D]">{app.applicationNo}</td>
                        <td className="p-2.5 font-semibold text-slate-800">{app.beneficiary.fullName}</td>
                        <td className="p-2.5 font-mono text-slate-500">{app.beneficiary.janAadhaarFamilyId}</td>
                        <td className="p-2.5 font-mono">{app.khasraNo}</td>
                        <td className="p-2.5">{app.cropType}</td>
                        <td className="p-2.5 font-bold text-amber-600">{app.lossPercentage}%</td>
                        <td className="p-2.5 font-black text-slate-900">₹ {app.admissibleSubsidyAmount.toLocaleString('en-IN')}</td>
                        <td className="p-2.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            {app.status}
                          </span>
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setVerificationStep('summary');
                            }}
                            className="px-3 py-1 bg-[#1A365D] text-white rounded text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
                          >
                            Verify
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. ADD DAMAGE VILLAGE (Page 115) */}
      {activeSubTab === 'add-village' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto space-y-5 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              <span>Add Damage Village / Calamity Notification</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Declare disaster affected village for Kharif 2024 to unlock survey & e-Dharti fetch.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Season *</label>
                <input
                  type="text"
                  readOnly
                  value={newVillageForm.season}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Calamity / Event *</label>
                <input
                  type="text"
                  value={newVillageForm.calamity}
                  onChange={(e) => setNewVillageForm({ ...newVillageForm, calamity: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  readOnly
                  value={newVillageForm.district}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tehsil</label>
                <input
                  type="text"
                  readOnly
                  value={newVillageForm.tehsil}
                  className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Village *</label>
                <input
                  type="text"
                  value={newVillageForm.village}
                  onChange={(e) => setNewVillageForm({ ...newVillageForm, village: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Affected Area (Approx. Ha)</label>
                <input
                  type="number"
                  value={newVillageForm.notifiedAreaHa}
                  onChange={(e) => setNewVillageForm({ ...newVillageForm, notifiedAreaHa: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Affected Farmers</label>
                <input
                  type="number"
                  value={newVillageForm.affectedFarmersEst}
                  onChange={(e) => setNewVillageForm({ ...newVillageForm, affectedFarmersEst: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setActiveSubTab('dashboard')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  alert(`Village ${newVillageForm.village} notified under Kharif 2024 Heavy Rain calamity!`);
                  setActiveSubTab('dashboard');
                }}
                className="px-5 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition shadow"
              >
                Save & Notify Village
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. FETCH SATELLITE / E-DHARTI DATA (Page 116) */}
      {activeSubTab === 'fetch-satellite' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto space-y-5 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
              <Satellite className="w-5 h-5 text-emerald-600" />
              <span>Fetch Satellite & e-Dharti Portal Data (राज खसरा गिरदावरी)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated ingestion of land ownership, sown area, and crop loss from Sentinel-2 & Rajdharaa GIS.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Season</label>
                <input type="text" readOnly value="Kharif 2024" className="w-full p-2 bg-slate-100 rounded border" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Calamity</label>
                <input type="text" readOnly value="Heavy Rain / Inundation" className="w-full p-2 bg-slate-100 rounded border" />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Village</label>
                <input type="text" readOnly value="Rampura (123456)" className="w-full p-2 bg-slate-100 rounded border font-bold" />
              </div>
            </div>

            <button
              onClick={() => alert('API Query dispatched to e-Dharti and Sentinel-2 ISRO Bhuvan service. Records refreshed.')}
              className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg cursor-pointer transition flex items-center gap-2"
            >
              <Satellite className="w-4 h-4" />
              <span>Query e-Dharti & Satellite Stream</span>
            </button>
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 p-2.5 font-bold text-slate-700 border-b border-slate-200">
              Active Data Sources & Fetch Status
            </div>
            <table className="w-full text-left">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">Sentinel-2 (Bhuvan ISRO)</td>
                  <td className="p-3 text-slate-500">Spectral Damage Mapping</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      Fetched (150 Records)
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">20/05/2025 11:15 AM</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">e-Dharti (Land Use / Land Cover)</td>
                  <td className="p-3 text-slate-500">Khasra Ownership & Area</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      Fetched (150 Records)
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">20/05/2025 11:16 AM</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-semibold">Raj Khasra Girdawari (NLC)</td>
                  <td className="p-3 text-slate-500">Crop Sown Details</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-[10px]">
                      Fetched (150 Records)
                    </span>
                  </td>
                  <td className="p-3 font-mono text-[11px] text-slate-400">20/05/2025 11:16 AM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. SMF/OSMF EXCEL BULK FALLBACK (Pages 118, 121-131) */}
      {activeSubTab === 'excel-fallback' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>SMF / OSMF Bulk Excel Upload Fallback Workflow</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized fallback process in case e-Dharti API service is unavailable or rural connectivity is low.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold bg-amber-100 text-amber-800 rounded-full border border-amber-300">
              Fallback Active
            </span>
          </div>

          {/* Stepper for Excel Upload (Pages 121-131) */}
          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-200 pb-3 text-slate-500">
            <span className={uploadStep === 'select' ? 'text-[#1A365D]' : ''}>1. Select File & Category</span>
            <span>→</span>
            <span className={uploadStep === 'validating' ? 'text-[#1A365D]' : ''}>2. Pre-Upload Validation</span>
            <span>→</span>
            <span className={uploadStep === 'summary' ? 'text-[#1A365D]' : ''}>3. Batch Summary</span>
            <span>→</span>
            <span className={uploadStep === 'declaration' ? 'text-emerald-700' : ''}>4. Final Submit</span>
          </div>

          {uploadStep === 'select' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div
                  onClick={() => setExcelCategory('SMF')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    excelCategory === 'SMF'
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-800">SMF - Small & Marginal Farmers</p>
                  <p className="text-slate-500 text-[11px] mt-1">Land holding up to 2.0 Hectares (Upload SMF Template)</p>
                </div>

                <div
                  onClick={() => setExcelCategory('OSMF')}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                    excelCategory === 'OSMF'
                      ? 'border-blue-600 bg-blue-50/60'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="font-bold text-sm text-slate-800">OSMF - Other Than Small/Marginal</p>
                  <p className="text-slate-500 text-[11px] mt-1">Land holding over 2.0 Hectares (Upload OSMF Template)</p>
                </div>
              </div>

              {/* Download templates */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Official Government Excel Template (v2.0.0)</p>
                  <p className="text-slate-500 text-[11px]">Mandatory columns: Jan Aadhaar No, Khasra, Area, Bank IFSC, Crop</p>
                </div>
                <button
                  onClick={() => alert('Official DMIS 2.0 Excel template downloaded: SMF_Upload_Template_v2.0.xlsx')}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer hover:bg-slate-900"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Template</span>
                </button>
              </div>

              {/* File upload drag area */}
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center space-y-3 bg-slate-50/50 hover:bg-slate-50 transition">
                <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                <div>
                  <p className="font-bold text-slate-800">Upload Filled Excel File (.xlsx / .xls)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Naming: SMF_BARMER_SHEO_RANIVARA_20240520.xlsx (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  id="patwari-excel-input"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedFileName(e.target.files[0].name);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setUploadedFileName('SMF_JAIPUR_CHOMU_RAMPURA_20240520.xlsx');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition cursor-pointer"
                >
                  {uploadedFileName ? `Selected: ${uploadedFileName}` : 'Choose Prepared Excel File'}
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleSimulateExcelUpload}
                  disabled={!uploadedFileName}
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition shadow cursor-pointer disabled:opacity-50"
                >
                  Upload & Validate Batch →
                </button>
              </div>
            </div>
          )}

          {uploadStep === 'validating' && (
            <div className="text-center py-12 space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <h4 className="font-bold text-sm text-slate-800">Running Pre-Upload Validation Engine...</h4>
              <p className="text-xs text-slate-500">Checking duplicate Jan Aadhaar, Khasra overlap, and bank formatting.</p>
            </div>
          )}

          {uploadStep === 'summary' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              {/* Batch Counters (Page 126) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-slate-500 text-[10px] font-bold">Total Rows Read</p>
                  <p className="text-xl font-black text-blue-900 mt-0.5">850</p>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <p className="text-slate-500 text-[10px] font-bold">Correct Records</p>
                  <p className="text-xl font-black text-emerald-700 mt-0.5">832</p>
                </div>
                <div className="p-3 bg-red-50 rounded-xl border border-red-200">
                  <p className="text-slate-500 text-[10px] font-bold">Incorrect / Error Rows</p>
                  <p className="text-xl font-black text-red-600 mt-0.5">18</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-slate-500 text-[10px] font-bold">Duplicate Found</p>
                  <p className="text-xl font-black text-amber-600 mt-0.5">4</p>
                </div>
              </div>

              {/* Error records review */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">Sample Row-level Errors Flagged:</span>
                  <button
                    onClick={() => alert('Downloaded Error Excel: Error_Rows_Batch_000125.xlsx with highlighted cells.')}
                    className="text-blue-700 font-semibold underline text-[11px] cursor-pointer"
                  >
                    Download Error Excel (.xlsx)
                  </button>
                </div>
                <div className="bg-white rounded-lg border border-slate-200 p-2.5 space-y-1 font-mono text-[11px]">
                  <p className="text-red-600">Row 14: Jan Aadhaar Family ID invalid checksum (12 digits required)</p>
                  <p className="text-red-600">Row 48: Land Area 0.0000 Ha (Must be greater than 0)</p>
                  <p className="text-amber-600">Row 92: Duplicate Khasra 112/3 already claimed under member 01</p>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setUploadStep('select')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  ← Re-upload Fixed File
                </button>
                <button
                  onClick={() => setUploadStep('declaration')}
                  className="px-5 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-lg cursor-pointer transition shadow"
                >
                  Proceed with Valid Records (832) →
                </button>
              </div>
            </div>
          )}

          {uploadStep === 'declaration' && (
            <div className="space-y-4 text-xs animate-in fade-in">
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 space-y-2">
                <h4 className="font-bold text-emerald-900 text-sm">Official Declaration & Final Submit</h4>
                <label className="flex items-start gap-2.5 cursor-pointer mt-2 text-slate-800">
                  <input type="checkbox" defaultChecked className="rounded text-emerald-600 w-4 h-4 mt-0.5" />
                  <span className="leading-relaxed">
                    I hereby declare that the crop loss data uploaded in this batch has been physically verified in the field according to Revenue Department and SDRF guidelines. Any fraudulent entry shall attract statutory liability under Disaster Management Act 2005.
                  </span>
                </label>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  onClick={() => setUploadStep('summary')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  ← Back to Summary
                </button>
                <button
                  onClick={() => {
                    alert('832 Farmer records successfully committed to DMIS database! Forwarded for Tehsildar verification.');
                    setUploadStep('select');
                    setActiveSubTab('dashboard');
                  }}
                  className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-lg transition shadow-md cursor-pointer"
                >
                  Submit for Tehsildar Verification
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. RETURNED RECORDS (Page 119, 100) */}
      {activeSubTab === 'returned' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-sm text-[#1A365D] flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-red-500" />
              <span>Returned Records Requiring Patwari Rectification ({returnedApps.length})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Review rejection remarks from Tehsildar or Relief OIC, edit discrepancies, and resubmit into workflow.
            </p>
          </div>

          <div className="space-y-3">
            {returnedApps.map((app) => (
              <div key={app.id} className="p-4 bg-red-50/50 rounded-xl border border-red-200 space-y-2 text-xs">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-red-100 pb-2">
                  <span className="font-mono font-bold text-slate-900">{app.applicationNo}</span>
                  <span className="font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded">Returned by Tehsildar</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-slate-500 text-[10px]">Farmer</span>
                    <p className="font-bold">{app.beneficiary.fullName}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Khasra</span>
                    <p className="font-mono">{app.khasraNo}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Claimed Area</span>
                    <p className="font-semibold">{app.affectedAreaHa} Ha</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px]">Relief Outlay</span>
                    <p className="font-bold text-emerald-700">₹ {app.admissibleSubsidyAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="p-2 bg-white rounded border border-red-200 text-red-800">
                  <strong>Reason for Return:</strong> {app.rejectionReason || 'Crop code mismatch between entry and satellite imagery.'}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    onClick={() => {
                      updateFarmerApplication(
                        app.id,
                        {
                          status: 'SubmittedPatwari',
                          remarks: 'Rectified crop code and resubmitted with updated revenue affidavit.',
                        },
                        'Patwari Corrected & Resubmitted',
                        'Updated crop code to verified Moong/Bajari mix.'
                      );
                      alert(`Application ${app.applicationNo} rectified and re-forwarded to Tehsildar!`);
                    }}
                    className="px-4 py-1.5 bg-[#1A365D] hover:bg-slate-800 text-white rounded text-xs font-bold transition cursor-pointer"
                  >
                    Correct & Resubmit to Tehsildar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. BANK BILL CORRECTION (Page 120) */}
      {activeSubTab === 'bank-correction' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="font-bold text-sm text-[#1A365D] flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" />
              <span>Farmer Bank Detail Correction (IFMS / DBT Failure Loop)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rectify bank account numbers or merged IFSC codes for records separated from IFMS bills.
            </p>
          </div>

          <div className="space-y-3">
            {failedBankApps.map((app) => (
              <div key={app.id} className="p-4 bg-purple-50/50 rounded-xl border border-purple-200 space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-purple-100 pb-2">
                  <span className="font-mono font-bold text-slate-900">{app.applicationNo}</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-800 font-bold rounded">
                    Payment Failed (Code E101)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Farmer Name</label>
                    <input type="text" readOnly value={app.beneficiary.fullName} className="w-full p-2 bg-slate-100 rounded border" />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Correct IFSC Code *</label>
                    <input
                      type="text"
                      defaultValue={app.beneficiary.ifscCode}
                      className="w-full p-2 bg-white rounded border border-purple-300 font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-bold mb-1">Updated Bank Account No *</label>
                    <input
                      type="text"
                      defaultValue="345601298412"
                      className="w-full p-2 bg-white rounded border border-purple-300 font-mono font-bold"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => {
                      updateFarmerApplication(
                        app.id,
                        {
                          status: 'VerifiedTehsildar',
                          remarks: 'Bank IFSC corrected and confirmed with bank passbook.',
                        },
                        'Bank Details Corrected by Patwari',
                        'Updated IFSC to SBIN0001234.'
                      );
                      alert(`Bank details corrected for ${app.beneficiary.fullName}. Forwarded for Tehsildar re-verification and IFMS bill regeneration.`);
                    }}
                    className="px-4 py-1.5 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded text-xs transition cursor-pointer"
                  >
                    Save & Forward to Tehsildar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
