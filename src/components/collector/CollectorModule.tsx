import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import {
  ShieldCheck,
  FileText,
  KeyRound,
  Building,
  CreditCard,
  Send,
  CheckCircle2,
  AlertCircle,
  Download,
  Milk,
  Boxes,
  Eye,
  PieChart,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { GISMapComponent } from '../common/GISMapComponent';

export const CollectorModule: React.FC = () => {
  const {
    currentUser,
    farmerApplications,
    updateFarmerApplication,
    cattleCamps,
    updateCattleCamp,
    ifmsBills,
    addIfmsBill,
    fundAllotments,
    openESignModal,
    openDocViewer,
  } = useDMIS();

  const [activeTab, setActiveTab] = useState<'overview' | 'sanctions' | 'cattle-sanctions' | 'ifms-bills' | 'fund-management'>('overview');

  // Filter applications ready for Collector Sanction
  const pendingCollectorApps = farmerApplications.filter((a) => a.status === 'ApprovedCollector');
  const sanctionedApps = farmerApplications.filter((a) => a.status === 'Sanctioned');

  const totalSanctionOutlay = pendingCollectorApps.reduce((acc, a) => acc + a.admissibleSubsidyAmount, 0);

  // Additional Budget Request state (pages 198-207)
  const [budgetRequestForm, setBudgetRequestForm] = useState({
    head: '2245-02-101-01-35-00-31 (Relief on Natural Calamities)',
    district: 'Jaipur',
    additionalDemandCr: 12.5,
    justification: 'Additional demand arising from second spell of heavy rainfall in Chomu & Jamwa Ramgarh tehsils.',
  });

  const [budgetRequestedSuccess, setBudgetRequestedSuccess] = useState(false);

  // Handle Collector Sanction of Farmer Batch
  const handleCollectorSanctionBatch = () => {
    if (pendingCollectorApps.length === 0) {
      alert('No pending applications ready for sanction.');
      return;
    }

    const sanctionOrderNo = `DM-JPR/SDRF/2025/AS-${Math.floor(1000 + Math.random() * 9000)}`;

    openESignModal(
      'Administrative & Financial Sanction Order (Collector Jaipur)',
      sanctionOrderNo,
      (sigMeta) => {
        pendingCollectorApps.forEach((app) => {
          updateFarmerApplication(
            app.id,
            {
              status: 'Sanctioned',
              sanctionOrderNo: sanctionOrderNo,
              sanctionDate: new Date().toISOString().split('T')[0],
              sanctionAmount: app.admissibleSubsidyAmount,
              remarks: `Sanctioned by District Collector via Order ${sanctionOrderNo}`,
            },
            'Collector Financial Sanction Accorded',
            `Digitally signed via Raj e-Sign ref: ${sigMeta.signatureId}`
          );
        });

        // Automatically prepare IFMS Bill Batch (Pages 185-188)
        const billNo = `IFMS-JPR-2025-B${Math.floor(100 + Math.random() * 900)}`;
        addIfmsBill({
          billNumber: billNo,
          district: 'Jaipur',
          tehsil: 'Chomu',
          scheme: 'Agriculture Input Subsidy (Kharif 2024)',
          headOfAccount: '2245-02-101-01-35-00-31',
          totalBeneficiaries: pendingCollectorApps.length,
          totalAmount: totalSanctionOutlay,
          billDate: new Date().toISOString().split('T')[0],
          ddoCode: 'DDO-2083-REV',
          tokenNumber: `TOK-${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'SubmittedToTreasury',
          eSignVerified: true,
          eSignRef: sigMeta.signatureId,
        });

        alert(
          `Sanction Order ${sanctionOrderNo} successfully issued and digitally signed! Automatic IFMS Bill ${billNo} generated and transmitted to Treasury.`
        );
      }
    );
  };

  // Handle Cattle Camp Sanction
  const handleSanctionCattleCamp = (campId: string, campName: string) => {
    const sanctionNo = `DM-JPR/PASHU/2025/AS-${Math.floor(100 + Math.random() * 900)}`;
    openESignModal(
      `Cattle Camp Sanction Order - ${campName}`,
      sanctionNo,
      (sigMeta) => {
        updateCattleCamp(
          campId,
          {
            status: 'Sanctioned',
            sanctionOrderNo: sanctionNo,
            sanctionDate: new Date().toISOString().split('T')[0],
            sanctionedAmount: 250000,
          },
          'District Collector Sanctioned Camp',
          `e-Sign Ref: ${sigMeta.signatureId}`
        );
        alert(`Cattle Camp ${campName} sanctioned under SDRF norms! Sanction Order: ${sanctionNo}`);
      }
    );
  };

  return (
    <div className="space-y-5">
      {/* Collector Module Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'overview' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <PieChart className="w-4 h-4" />
          <span>District Disaster Dashboard & GIS</span>
        </button>

        <button
          onClick={() => setActiveTab('sanctions')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'sanctions' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-amber-500" />
          <span>Agriculture Sanctions ({pendingCollectorApps.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cattle-sanctions')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'cattle-sanctions' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Milk className="w-4 h-4 text-emerald-600" />
          <span>Cattle Camp Sanctions</span>
        </button>

        <button
          onClick={() => setActiveTab('ifms-bills')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'ifms-bills' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CreditCard className="w-4 h-4 text-blue-600" />
          <span>IFMS 3.0 / PayManager Bills ({ifmsBills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fund-management')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'fund-management' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-4 h-4 text-purple-600" />
          <span>SDRF Fund Allotment & Budget Request</span>
        </button>
      </div>

      {/* 1. OVERVIEW & GIS DASHBOARD (Pages 165-175) */}
      {activeTab === 'overview' && (
        <div className="space-y-5 animate-in fade-in">
          {/* Top District Metric Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">District Allotment (SDRF)</span>
              <p className="text-xl font-black text-[#1A365D] mt-1">₹ 45.00 Cr</p>
              <span className="text-[10px] text-slate-500">Head 2245-02-101</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Sanctioned Outlay</span>
              <p className="text-xl font-black text-emerald-700 mt-1">₹ 38.51 Cr</p>
              <span className="text-[10px] text-emerald-600 font-semibold">85.5% Committed</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Disbursed via DBT</span>
              <p className="text-xl font-black text-blue-700 mt-1">₹ 31.20 Cr</p>
              <span className="text-[10px] text-blue-600 font-semibold">14,210 Beneficiaries</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Awaiting Sanction</span>
              <p className="text-xl font-black text-amber-600 mt-1">₹ {(totalSanctionOutlay / 100000).toFixed(2)} L</p>
              <span className="text-[10px] text-amber-600 font-semibold">{pendingCollectorApps.length} Farmers</span>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Treasury Balance</span>
              <p className="text-xl font-black text-purple-700 mt-1">₹ 6.49 Cr</p>
              <span className="text-[10px] text-purple-600 font-semibold">Available for Allotment</span>
            </div>
          </div>

          {/* Integrated GIS Map for District Collector */}
          <GISMapComponent height="450px" selectedDistrict="Jaipur" />
        </div>
      )}

      {/* 2. AGRICULTURE INPUT SUBSIDY SANCTIONS (Pages 178-184) */}
      {activeTab === 'sanctions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                <span>Agricultural Input Subsidy - District Sanction Orders</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Issue composite Administrative & Financial Sanction order with Aadhaar OTP Raj e-Sign.
              </p>
            </div>

            {pendingCollectorApps.length > 0 && (
              <button
                onClick={handleCollectorSanctionBatch}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-lg text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4" />
                <span>Issue & e-Sign Sanction Order ({pendingCollectorApps.length} Farmers)</span>
              </button>
            )}
          </div>

          {/* Sanction Summary Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-800 uppercase tracking-wider">Sanction Proposal Details</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-slate-400 text-[10px]">District & Authority</span>
                <p className="font-bold text-slate-800">Jaipur - District Collector</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Scheme</span>
                <p className="font-semibold text-slate-800">Agri Input Subsidy (Kharif 2024)</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Total Outlay</span>
                <p className="font-black text-emerald-700 text-sm">₹ {totalSanctionOutlay.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <span className="text-slate-400 text-[10px]">Head of Account</span>
                <p className="font-mono text-slate-700">2245-02-101-01-35-00-31</p>
              </div>
            </div>
          </div>

          {/* Pending Applications List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <tr>
                  <th className="p-3 font-bold">App No</th>
                  <th className="p-3 font-bold">Farmer Name</th>
                  <th className="p-3 font-bold">Jan Aadhaar</th>
                  <th className="p-3 font-bold">Village & Tehsil</th>
                  <th className="p-3 font-bold">Crop & Loss %</th>
                  <th className="p-3 font-bold">Sanction Amount</th>
                  <th className="p-3 font-bold">Tehsildar Endorsement</th>
                  <th className="p-3 font-bold text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingCollectorApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-[#1A365D]">{app.applicationNo}</td>
                    <td className="p-3 font-bold text-slate-800">{app.beneficiary.fullName}</td>
                    <td className="p-3 font-mono text-slate-500">{app.beneficiary.janAadhaarFamilyId}</td>
                    <td className="p-3">{app.beneficiary.village}, {app.beneficiary.tehsil}</td>
                    <td className="p-3">
                      <span className="font-semibold">{app.cropType}</span> ({app.lossPercentage}%)
                    </td>
                    <td className="p-3 font-black text-emerald-700">₹ {app.admissibleSubsidyAmount.toLocaleString('en-IN')}</td>
                    <td className="p-3">
                      <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        ✓ Tehsildar Endorsed
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() =>
                          openDocViewer('Administrative Sanction Order Draft', 'CollectorSanction', {
                            refNo: 'PROPOSAL-2025-AS-01',
                            district: 'Jaipur',
                            amount: app.admissibleSubsidyAmount,
                            scheme: 'Agriculture Input Subsidy (Kharif)',
                          })
                        }
                        className="p-1 text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. CATTLE CAMP SANCTIONS (Pages 80-82) */}
      {activeTab === 'cattle-sanctions' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
              <Milk className="w-5 h-5 text-emerald-600" />
              <span>Cattle Camp & Fodder Depot Sanctions (District Collector)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review Tehsildar physical inspection clearance and accord statutory SDRF financial sanction.
            </p>
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
                    camp.status === 'Sanctioned' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {camp.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 text-[10px]">Jurisdiction</span>
                    <p className="font-semibold">{camp.village}, {camp.tehsil}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Animal Capacity</span>
                    <p className="font-bold text-slate-800">{camp.totalAnimals} Head</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Operator</span>
                    <p className="font-semibold">{camp.organizationName} ({camp.operatorType})</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Tehsildar Inspection</span>
                    <p className="font-bold text-emerald-700">✓ Recommended</p>
                  </div>
                </div>

                {camp.status !== 'Sanctioned' ? (
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => handleSanctionCattleCamp(camp.id, camp.campName)}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Issue Financial Sanction & e-Sign</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-50 rounded border border-emerald-200 text-emerald-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Sanction Order: {camp.sanctionOrderNo}</span>
                      <p className="text-[10px]">Sanction Amount: ₹ {camp.sanctionedAmount?.toLocaleString('en-IN')}</p>
                    </div>
                    <button
                      onClick={() =>
                        openDocViewer('Cattle Camp Financial Sanction', 'CattleSanction', {
                          refNo: camp.sanctionOrderNo,
                          district: camp.district,
                          amount: camp.sanctionedAmount,
                          totalFarmers: camp.totalAnimals,
                        })
                      }
                      className="text-xs underline font-semibold text-emerald-900 cursor-pointer"
                    >
                      View Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. IFMS 3.0 / PAYMANAGER BILLS (Pages 185-188, 191-196) */}
      {activeTab === 'ifms-bills' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span>IFMS 3.0 & PayManager Automated Treasury Bills</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Paperless bill generation, digital token tracking, and direct bank account credit monitoring.
              </p>
            </div>
            <span className="px-2.5 py-1 text-[11px] font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
              PayManager Direct Bridge Active
            </span>
          </div>

          <div className="space-y-3">
            {ifmsBills.map((bill) => (
              <div key={bill.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex flex-wrap justify-between items-center gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#1A365D]" />
                    <span className="font-mono font-bold text-sm text-[#1A365D]">{bill.billNumber}</span>
                    <span className="text-slate-400 font-mono text-[11px]">| DDO: {bill.ddoCode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                      Token: {bill.tokenNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {bill.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <span className="text-slate-400 text-[10px]">Head of Account</span>
                    <p className="font-mono font-bold text-slate-800">{bill.headOfAccount}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Scheme</span>
                    <p className="font-semibold text-slate-800">{bill.scheme}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Beneficiaries (DBT)</span>
                    <p className="font-bold text-slate-800">{bill.totalBeneficiaries} Accounts</p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px]">Bill Total Amount</span>
                    <p className="font-black text-emerald-700 text-sm">₹ {bill.totalAmount.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>e-Signed with DDO DSC Ref: {bill.eSignRef}</span>
                  </div>
                  <button
                    onClick={() =>
                      openDocViewer('Official IFMS 3.0 Treasury Bill', 'IFMSBill', {
                        demandNo: bill.billNumber,
                        district: bill.district,
                        amount: bill.totalAmount,
                        totalFarmers: bill.totalBeneficiaries,
                      })
                    }
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold cursor-pointer transition"
                  >
                    View Treasury Bill Sheet
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SDRF FUND MANAGEMENT & BUDGET REQUEST (Pages 198-207) */}
      {activeTab === 'fund-management' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                <span>SDRF Fund Allotment & State Budget Demand</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Head 2245 Disaster Relief Allotments, Expenditure Tracking, and Additional Allotment Proposals.
              </p>
            </div>
          </div>

          {/* Allotment Ledger Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fundAllotments.map((fund) => (
              <div key={fund.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-[10px] font-mono">Head: {fund.headOfAccount}</p>
                    <h4 className="font-bold text-slate-900 text-sm mt-0.5">{fund.description}</h4>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Sanctioned:</span>
                    <strong className="text-slate-800">₹ {fund.totalAllottedCr} Cr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expended / Disbursed:</span>
                    <strong className="text-emerald-700">₹ {fund.expenditureCr} Cr</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Remaining Balance:</span>
                    <strong className="text-purple-700">₹ {fund.balanceCr} Cr</strong>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-emerald-600 h-2 rounded-full"
                    style={{ width: `${(fund.expenditureCr / fund.totalAllottedCr) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Prepare Additional Budget Demand (Pages 201-207) */}
          <div className="p-5 bg-purple-50/50 rounded-xl border border-purple-200 space-y-4 text-xs">
            <h3 className="font-bold text-purple-900 text-sm flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" />
              <span>Submit Additional Budget Allotment Proposal to State DMRD</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Budget Head</label>
                <input
                  type="text"
                  readOnly
                  value={budgetRequestForm.head}
                  className="w-full p-2 bg-slate-100 rounded-lg border font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Additional Outlay Demanded (in ₹ Crores) *</label>
                <input
                  type="number"
                  step="0.1"
                  value={budgetRequestForm.additionalDemandCr}
                  onChange={(e) => setBudgetRequestForm({ ...budgetRequestForm, additionalDemandCr: Number(e.target.value) })}
                  className="w-full p-2 bg-white rounded-lg border border-purple-300 font-bold text-purple-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Executive Justification *</label>
              <textarea
                rows={2}
                value={budgetRequestForm.justification}
                onChange={(e) => setBudgetRequestForm({ ...budgetRequestForm, justification: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-purple-300"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  openESignModal(
                    'Additional Budget Demand Proposal (Jaipur District)',
                    'SDRF-DEM-JPR-2025-001',
                    (sigMeta) => {
                      setBudgetRequestedSuccess(true);
                      alert('Additional budget demand of ₹12.50 Cr digitally signed and submitted to DMRD Secretariat, Jaipur!');
                    }
                  );
                }}
                className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg transition shadow flex items-center gap-1.5 cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>e-Sign & Transmit to Secretary DMRD</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
