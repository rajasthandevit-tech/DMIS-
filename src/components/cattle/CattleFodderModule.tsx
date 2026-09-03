import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { CattleCampRecord, FodderDepotRecord } from '../../types';
import {
  Milk,
  Boxes,
  Plus,
  Search,
  CheckCircle2,
  ShieldCheck,
  Building,
  MapPin,
  Calendar,
  AlertTriangle,
  Camera,
  Eye,
  KeyRound,
  FileText,
} from 'lucide-react';

export const CattleFodderModule: React.FC = () => {
  const {
    cattleCamps,
    fodderDepots,
    addCattleCamp,
    updateCattleCamp,
    addFodderDepot,
    openESignModal,
    openDocViewer,
    openAuditModal,
    role,
  } = useDMIS();

  const [activeTab, setActiveTab] = useState<'camps' | 'depots' | 'calculator'>('camps');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [isAddCampModalOpen, setIsAddCampModalOpen] = useState(false);

  // New camp registration state
  const [newCamp, setNewCamp] = useState({
    campName: '',
    operatorType: 'GP' as const,
    organizationName: '',
    district: 'Jaipur',
    tehsil: 'Chomu',
    village: '',
    gramPanchayat: '',
    largeAnimals: 120,
    smallAnimals: 80,
    waterArrangement: true,
    shadeArrangement: true,
    fencingAvailable: true,
    veterinaryDoctorAssigned: 'Dr. R.K. Meena (VAS Chomu)',
    bankName: 'State Bank of India',
    accountNoMasked: 'XXXXXX4819',
    ifscCode: 'SBIN0031120',
  });

  const filteredCamps = cattleCamps.filter((camp) => {
    const matchesDistrict = selectedDistrict === 'All' || camp.district === selectedDistrict;
    return matchesDistrict;
  });

  const totalCattleCount = cattleCamps.reduce((acc, c) => acc + c.totalAnimals, 0);
  const totalLargeAnimals = cattleCamps.reduce((acc, c) => acc + c.largeAnimals, 0);
  const totalSmallAnimals = cattleCamps.reduce((acc, c) => acc + c.smallAnimals, 0);

  // Daily expenditure under SDRF norms (Rs 80/day Large, Rs 40/day Small)
  const dailyOutlay = totalLargeAnimals * 80 + totalSmallAnimals * 40;

  const handleRegisterCamp = (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(newCamp.largeAnimals) + Number(newCamp.smallAnimals);
    const dailyFodder = Math.round((total * 12) / 100); // approx quintals

    addCattleCamp({
      campName: newCamp.campName,
      registrationNo: `CC-RAJ-${Math.floor(1000 + Math.random() * 9000)}`,
      operatorType: newCamp.operatorType,
      organizationName: newCamp.organizationName || newCamp.campName,
      district: newCamp.district,
      tehsil: newCamp.tehsil,
      village: newCamp.village,
      gramPanchayat: newCamp.gramPanchayat || newCamp.village,
      registeredDate: new Date().toISOString().split('T')[0],
      largeAnimals: Number(newCamp.largeAnimals),
      smallAnimals: Number(newCamp.smallAnimals),
      totalAnimals: total,
      dailyFodderReqQuintal: dailyFodder,
      waterArrangement: newCamp.waterArrangement,
      shadeArrangement: newCamp.shadeArrangement,
      fencingAvailable: newCamp.fencingAvailable,
      veterinaryDoctorAssigned: newCamp.veterinaryDoctorAssigned,
      status: 'Applied',
      bankName: newCamp.bankName,
      accountNoMasked: newCamp.accountNoMasked,
      ifscCode: newCamp.ifscCode,
    });

    alert(`Cattle Camp ${newCamp.campName} successfully registered! Application forwarded to Tehsildar for physical inspection.`);
    setIsAddCampModalOpen(false);
  };

  const handleVerifyCamp = (campId: string, campName: string) => {
    updateCattleCamp(
      campId,
      {
        status: 'VerifiedTehsildar',
        inspectionDate: new Date().toISOString().split('T')[0],
        inspectionEvidenceGeoTag: '27.1742 N, 75.7231 E',
      },
      'Tehsildar Inspected & Verified Cattle Camp',
      'Verified livestock count, drinking troughs, shade nets and vet availability on-site.'
    );
    alert(`Cattle Camp ${campName} verified by Tehsildar! Forwarded to District Collector for SDRF Sanction.`);
  };

  const handleCollectorSanction = (campId: string, campName: string) => {
    const sanctionNo = `DM-JPR/PASHU/2025/AS-${Math.floor(100 + Math.random() * 900)}`;

    openESignModal(
      `Cattle Camp Sanction Order - ${campName}`,
      sanctionNo,
      (sigMeta) => {
        updateCattleCamp(
          campId,
          {
            status: 'Active',
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
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
            <Milk className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <span>Cattle Camp & Fodder Depot Management (SDRF Norms)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold border border-amber-200">
                Livestock Disaster Relief
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Livestock census verification, daily fodder subsidy (₹80/Large, ₹40/Small animal), inspection geotagging & collector sanction.
            </p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('camps')}
            className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'camps'
                ? 'bg-[#1A365D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cattle Camps ({cattleCamps.length})
          </button>
          <button
            onClick={() => setActiveTab('depots')}
            className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'depots'
                ? 'bg-[#1A365D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fodder Depots ({fodderDepots.length})
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-2 rounded-lg transition cursor-pointer ${
              activeTab === 'calculator'
                ? 'bg-[#1A365D] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            SDRF Subsidy Calculator
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Total Registered Camps</span>
          <div className="text-2xl font-black text-[#1A365D]">{cattleCamps.length} Camps</div>
          <p className="text-[11px] text-emerald-600 font-semibold">GP & NGO Operated</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Protected Livestock Count</span>
          <div className="text-2xl font-black text-amber-600">{totalCattleCount.toLocaleString('en-IN')}</div>
          <p className="text-[11px] text-slate-500">{totalLargeAnimals} Large / {totalSmallAnimals} Small</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Daily SDRF Fodder Outlay</span>
          <div className="text-2xl font-black text-emerald-700">₹ {dailyOutlay.toLocaleString('en-IN')} / Day</div>
          <p className="text-[11px] text-slate-400">₹80 Large / ₹40 Small</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Fodder Depots Active</span>
          <div className="text-2xl font-black text-purple-700">{fodderDepots.length} Depots</div>
          <p className="text-[11px] text-purple-600 font-semibold">1,500+ Quintals buffer</p>
        </div>
      </div>

      {/* 1. CAMPS TAB */}
      {activeTab === 'camps' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <label className="font-bold text-slate-700">Filter District:</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
              >
                <option value="All">All Districts (Rajasthan)</option>
                <option value="Jaipur">Jaipur</option>
                <option value="Kota">Kota</option>
                <option value="Jodhpur">Jodhpur</option>
                <option value="Barmer">Barmer</option>
              </select>
            </div>

            <button
              onClick={() => setIsAddCampModalOpen(true)}
              className="px-4 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Cattle Camp</span>
            </button>
          </div>

          {/* Camps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCamps.map((camp) => (
              <div key={camp.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3.5 text-xs">
                <div className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="font-mono text-slate-400 text-[10px] block">{camp.registrationNo}</span>
                    <h3 className="font-bold text-sm text-[#1A365D] mt-0.5">{camp.campName}</h3>
                    <p className="text-slate-500 text-[11px]">
                      {camp.organizationName} ({camp.operatorType}) • {camp.village}, {camp.tehsil} ({camp.district})
                    </p>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      camp.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : camp.status === 'VerifiedTehsildar'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>

                {/* Animal Count Breakdown */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Large Animals</span>
                    <strong className="text-sm text-slate-900">{camp.largeAnimals}</strong>
                    <span className="text-[9px] text-slate-400 block">@ ₹80/day</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Small Animals</span>
                    <strong className="text-sm text-slate-900">{camp.smallAnimals}</strong>
                    <span className="text-[9px] text-slate-400 block">@ ₹40/day</span>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="text-[10px] text-amber-800 block">Daily Norm</span>
                    <strong className="text-sm text-amber-900">
                      ₹ {(camp.largeAnimals * 80 + camp.smallAnimals * 40).toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[9px] text-amber-700 block">SDRF Assistance</span>
                  </div>
                </div>

                {/* Facilities Checklist */}
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-semibold">
                    ✓ Water Troughs Active
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-semibold">
                    ✓ Green Shade Nets
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 rounded border border-emerald-200 font-semibold">
                    ✓ Perimeter Fenced
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-800 rounded border border-blue-200 font-semibold">
                    Vet: {camp.veterinaryDoctorAssigned}
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openDocViewer(`Cattle Camp Inspection Slip - ${camp.campName}`, 'CattleCamp', camp)}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg font-semibold cursor-pointer"
                    >
                      View Report
                    </button>
                    <button
                      onClick={() => openAuditModal('CattleCamp', camp.registrationNo)}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg font-semibold cursor-pointer"
                    >
                      Audit
                    </button>
                  </div>

                  <div>
                    {camp.status === 'Applied' && (
                      <button
                        onClick={() => handleVerifyCamp(camp.id, camp.campName)}
                        className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg shadow cursor-pointer flex items-center gap-1"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Tehsildar Geo-Tag Verify</span>
                      </button>
                    )}
                    {camp.status === 'VerifiedTehsildar' && (
                      <button
                        onClick={() => handleCollectorSanction(camp.id, camp.campName)}
                        className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg shadow cursor-pointer flex items-center gap-1"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Collector Sanction Order</span>
                      </button>
                    )}
                    {camp.status === 'Active' && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Camp Active & SDRF Subsidized</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. FODDER DEPOTS TAB */}
      {activeTab === 'depots' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fodderDepots.map((depot) => (
              <div key={depot.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-slate-400 text-[10px] block">{depot.registrationNo}</span>
                    <h3 className="font-bold text-sm text-[#1A365D] mt-0.5">{depot.depotName}</h3>
                    <p className="text-slate-500 text-[11px]">
                      {depot.organizationName} ({depot.operatorType}) • {depot.village}, {depot.tehsil} ({depot.district})
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                    {depot.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-slate-400 text-[10px] block">Opening Balance Stock</span>
                    <strong className="text-base text-slate-900">{depot.openingBalanceQuintals} Quintals</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 text-[10px] block">Contact Person</span>
                    <span className="font-bold text-slate-800">{depot.contactPerson} ({depot.mobileNo})</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. CALCULATOR TAB */}
      {activeTab === 'calculator' && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#1A365D]">Government of Rajasthan SDRF Norms (Head 2245-02-102)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Large Animal Assistance</h4>
              <p className="text-slate-600">Includes Cows, Buffaloes, Camels, Horses, Mules.</p>
              <div className="text-xl font-bold text-emerald-700">₹ 80.00 / Animal / Day</div>
              <p className="text-[11px] text-slate-400">Maximum duration: 30 days per sanction spell</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900">Small Animal Assistance</h4>
              <p className="text-slate-600">Includes Sheep, Goats, Calves, Donkeys.</p>
              <div className="text-xl font-bold text-emerald-700">₹ 40.00 / Animal / Day</div>
              <p className="text-[11px] text-slate-400">Maximum duration: 30 days per sanction spell</p>
            </div>
          </div>
        </div>
      )}

      {/* Add Camp Modal */}
      {isAddCampModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#1A365D]">Register New Cattle Relief Camp</h3>

            <form onSubmit={handleRegisterCamp} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Camp Name *</label>
                <input
                  type="text"
                  required
                  value={newCamp.campName}
                  onChange={(e) => setNewCamp({ ...newCamp, campName: e.target.value })}
                  placeholder="e.g., Gram Panchayat Rampura Pashu Rahat Shivir"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Large Animals (Cows, Buffaloes)</label>
                  <input
                    type="number"
                    value={newCamp.largeAnimals}
                    onChange={(e) => setNewCamp({ ...newCamp, largeAnimals: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Small Animals (Goats, Sheep)</label>
                  <input
                    type="number"
                    value={newCamp.smallAnimals}
                    onChange={(e) => setNewCamp({ ...newCamp, smallAnimals: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tehsil</label>
                  <input
                    type="text"
                    value={newCamp.tehsil}
                    onChange={(e) => setNewCamp({ ...newCamp, tehsil: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Village / Location</label>
                  <input
                    type="text"
                    required
                    value={newCamp.village}
                    onChange={(e) => setNewCamp({ ...newCamp, village: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCampModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Register Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
