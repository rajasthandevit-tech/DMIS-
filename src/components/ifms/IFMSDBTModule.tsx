import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Search,
  Download,
  Building,
  FileText,
  Clock,
  ShieldCheck,
  Send,
  Eye,
  KeyRound,
} from 'lucide-react';

export const IFMSDBTModule: React.FC = () => {
  const { ifmsBills, updateIFMSBill, farmerApplications, openAuditModal, openDocViewer, openESignModal } = useDMIS();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredBills = ifmsBills.filter((bill) => {
    const matchesStatus = selectedStatus === 'All' || bill.status === selectedStatus;
    const matchesSearch =
      bill.billNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.sanctionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.budgetHead.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalDisbursed = ifmsBills
    .filter((b) => b.status === 'DBT Processed' || b.status === 'Treasury Accepted')
    .reduce((acc, b) => acc + b.totalAmountInr, 0);

  const totalBeneficiaries = ifmsBills.reduce((acc, b) => acc + b.totalBeneficiaries, 0);

  // Trigger batch DBT processing
  const handleProcessDBT = (billId: string, billNo: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const utr = `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`;
      updateIFMSBill(billId, {
        status: 'DBT Processed',
        utrReference: utr,
        failureCount: 0,
        paidCount: ifmsBills.find((b) => b.id === billId)?.totalBeneficiaries || 250,
      });
      alert(`Bill ${billNo} successfully processed via RBI / NPCI e-Kuber! UTR Reference: ${utr}. Direct credit confirmed to beneficiary bank accounts.`);
    }, 800);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-[#1A365D]">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <span>IFMS 3.0 & PayManager Automated DBT Settlement</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                Treasury e-Kuber Gateway
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Online DDO bill presentation, Treasury token authorization, APBS (Aadhaar Payment Bridge), and real-time bank UTR reconciliation.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="p-2 bg-slate-50 rounded-lg border border-slate-200 text-slate-600 font-mono">
            DDO Code: <strong>0102 - Jaipur Relief</strong>
          </span>
          <span className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-emerald-800 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            IFMS 3.0 API LIVE
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Total DBT Disbursed</span>
          <div className="text-2xl font-black text-emerald-700">₹ {(totalDisbursed / 10000000).toFixed(2)} Cr</div>
          <p className="text-[11px] text-slate-400">Directly into Jan Aadhaar Bank Accounts</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Total Beneficiaries Paid</span>
          <div className="text-2xl font-black text-[#1A365D]">{totalBeneficiaries.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">99.2% First-attempt success rate</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Treasury Bills Generated</span>
          <div className="text-2xl font-black text-purple-700">{ifmsBills.length} Bills</div>
          <p className="text-[11px] text-slate-400">Head 2245-02-101-01</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Failed Transactions</span>
          <div className="text-2xl font-black text-slate-900">0</div>
          <p className="text-[11px] text-slate-400">Auto re-query enabled</p>
        </div>
      </div>

      {/* Bills Section */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-[#1A365D]">IFMS 3.0 Electronic Treasury Bill Register</h3>
            <p className="text-xs text-slate-500">
              Real-time synchronization with Finance Department's e-Treasury & PayManager server.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Bill No, Sanction, Head..."
                className="p-1.5 pl-8 border border-slate-300 rounded-lg text-xs w-60"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
            >
              <option value="All">All Statuses</option>
              <option value="Treasury Accepted">Treasury Accepted</option>
              <option value="DBT Processed">DBT Processed</option>
              <option value="Bill Generated">Bill Generated</option>
            </select>
          </div>
        </div>

        {/* Bills Grid */}
        <div className="space-y-3">
          {filteredBills.map((bill) => (
            <div
              key={bill.id}
              className="p-4 bg-slate-50/70 hover:bg-slate-50 rounded-xl border border-slate-200 space-y-3 transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-200/80 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#1A365D]">{bill.billNo}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        bill.status === 'DBT Processed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {bill.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Sanction Order: <strong>{bill.sanctionNo}</strong> • DDO: {bill.ddoCode} • Date: {bill.billDate}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-base font-black text-slate-900">
                    ₹ {bill.totalAmountInr.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {bill.totalBeneficiaries} Beneficiary Farmers
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Budget Head of Account:</span>
                  <span className="font-mono font-bold text-slate-800">{bill.budgetHead}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">RBI Bank UTR Reference:</span>
                  <span className="font-mono font-bold text-emerald-700">{bill.utrReference || 'Pending Gateway Dispatch'}</span>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Payment Settlement:</span>
                  <span className="font-bold text-slate-800">
                    {bill.paidCount} Success / {bill.failureCount} Failed
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openDocViewer(`IFMS Bill Schedule - ${bill.billNo}`, 'IFMSBill', bill)}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-white rounded-lg text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <FileText className="w-3 h-3" />
                    <span>View Bill Schedule (Annexure-A)</span>
                  </button>
                  <button
                    onClick={() => openAuditModal('IFMSBill', bill.billNo)}
                    className="px-3 py-1.5 border border-slate-300 hover:bg-white rounded-lg text-slate-700 font-semibold flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <ShieldCheck className="w-3 h-3" />
                    <span>Audit Trail</span>
                  </button>
                </div>

                <div>
                  {bill.status === 'Treasury Accepted' ? (
                    <button
                      onClick={() => handleProcessDBT(bill.id, bill.billNo)}
                      disabled={isProcessing}
                      className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5 cursor-pointer text-xs"
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} />
                      <span>Transmit DBT via e-Kuber</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Funds Credited to Jan Aadhaar Bank Accounts</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
