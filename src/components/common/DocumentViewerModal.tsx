import React from 'react';
import { useDMIS } from '../../context/DMISContext';
import { Printer, Download, X, ShieldCheck, QrCode, CheckCircle, Stamp } from 'lucide-react';

export const DocumentViewerModal: React.FC = () => {
  const { docViewerState, closeDocViewer } = useDMIS();

  if (!docViewerState.isOpen) return null;

  const { title, docType, data } = docViewerState;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Control Bar */}
        <div className="bg-[#1A365D] text-white px-6 py-3.5 flex items-center justify-between border-b border-amber-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">{title || 'Official Government Document'}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-800 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Order</span>
            </button>
            <button
              onClick={() => {
                alert('Document downloaded with verified digital signature certificate.');
              }}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={closeDocViewer}
              className="p-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Government Document Container */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-50">
          <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm max-w-2xl mx-auto font-serif text-slate-900 print:shadow-none print:border-none">
            {/* Gov Header */}
            <div className="text-center border-b-2 border-slate-800 pb-4 mb-6">
              <div className="flex justify-center mb-2">
                <div className="w-12 h-12 rounded-full border-2 border-slate-800 flex items-center justify-center font-bold text-xs bg-amber-50">
                  राज.
                </div>
              </div>
              <h2 className="text-base font-black tracking-wide uppercase text-slate-900">
                Government of Rajasthan / राजस्थान सरकार
              </h2>
              <h3 className="text-sm font-bold text-slate-800 mt-0.5">
                Department of Disaster Management, Relief & Civil Defence
              </h3>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                Government Secretariat, Jaipur - 302005 (Rajasthan)
              </p>
            </div>

            {/* Document Meta Information */}
            <div className="flex justify-between items-start text-xs font-sans mb-6">
              <div>
                <p><strong>Document Ref No:</strong> {data?.refNo || data?.demandNo || data?.poNumber || 'DMIS/2024-25/DOC-0091'}</p>
                <p className="mt-1"><strong>Financial Year:</strong> 2024-25 / Samvat 2083</p>
                <p className="mt-1"><strong>Subject:</strong> {title}</p>
              </div>
              <div className="text-right">
                <p><strong>Date of Issue:</strong> {new Date().toLocaleDateString('en-IN')}</p>
                <p className="mt-1"><strong>Dispatch Status:</strong> Digitally Signed & Sealed</p>
              </div>
            </div>

            {/* Dynamic Body Content depending on docType */}
            <div className="text-xs font-sans leading-relaxed space-y-4 mb-8">
              <p className="text-justify indent-8">
                In exercise of powers conferred under the Rajasthan State Disaster Response Fund (SDRF) norms and State Disaster Management Policy, sanction of the Competent Authority is hereby accorded for the execution of relief assistance/procurement as detailed herein below:
              </p>

              {/* Data Table */}
              <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 p-2 font-bold">Particulars</th>
                    <th className="border border-slate-300 p-2 font-bold">Sanctioned Details / Approved Metrics</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold">Jurisdiction / District</td>
                    <td className="border border-slate-300 p-2">{data?.district || 'Jaipur District'}</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold">Scheme / Component</td>
                    <td className="border border-slate-300 p-2">{data?.scheme || 'Agriculture Input Subsidy (Kharif)'}</td>
                  </tr>
                  {data?.totalFarmers && (
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold">Eligible Beneficiaries</td>
                      <td className="border border-slate-300 p-2">{data.totalFarmers.toLocaleString('en-IN')} Farmers (SMF/OSMF)</td>
                    </tr>
                  )}
                  {data?.totalAreaHa && (
                    <tr>
                      <td className="border border-slate-300 p-2 font-semibold">Affected Cultivated Area</td>
                      <td className="border border-slate-300 p-2">{data.totalAreaHa.toLocaleString('en-IN')} Hectares</td>
                    </tr>
                  )}
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold">Sanctioned Financial Outlay</td>
                    <td className="border border-slate-300 p-2 font-bold text-slate-900">
                      ₹ {data?.totalAmountCr ? `${data.totalAmountCr} Crores (INR ${data.totalAmountInr?.toLocaleString('en-IN')})` : data?.amount ? `₹ ${data.amount.toLocaleString('en-IN')}` : '₹ 38,51,00,000.00'}
                    </td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold">IFMS Budget Head</td>
                    <td className="border border-slate-300 p-2 font-mono">2245-02-101-01-35-00-31 (Relief on Natural Calamities)</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2 font-semibold">Payment / DBT Processing Agency</td>
                    <td className="border border-slate-300 p-2">PayManager / Treasury Directorate / Direct Beneficiary Account</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-justify">
                <strong>Conditions of Sanction:</strong> The expenditure shall be met out of the sanctioned budget allocation under Head 2245. The Drawing & Disbursing Officer (DDO) shall ensure 100% Aadhaar-seeded bank account validations prior to direct benefit transfer (DBT). A certified Utilization Certificate (UC) must be submitted within 30 days of completion.
              </p>
            </div>

            {/* Official Digital Signature Seal */}
            <div className="pt-6 border-t border-slate-300 flex items-center justify-between font-sans">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-slate-300 rounded-lg bg-slate-50">
                  <QrCode className="w-12 h-12 text-slate-700" />
                </div>
                <div className="text-[10px] text-slate-500">
                  <p className="font-bold text-slate-800">Scan to Verify Authenticity</p>
                  <p>Certificate Authority: NIC-CA / Raj eSign</p>
                  <p className="font-mono">SHA-256: 4f82..99a0..1b2c</p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block p-3 rounded-lg border-2 border-emerald-600 bg-emerald-50/70 text-emerald-900 text-[10px] text-left">
                  <div className="flex items-center gap-1 font-bold text-xs text-emerald-800 mb-0.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>DIGITALLY SIGNED</span>
                  </div>
                  <p><strong>Signatory:</strong> {data?.collectorSignedBy || 'District Collector / Secretary DMRD'}</p>
                  <p><strong>Ref:</strong> {data?.eSignRef || 'ESIGN-RJ-DMRD-2025-0099'}</p>
                  <p><strong>Signed On:</strong> {data?.collectorSignedDate || new Date().toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>Official Paperless Workflow Record generated by DMIS 2.0</span>
          <button
            onClick={closeDocViewer}
            className="px-4 py-1.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition font-medium cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
