import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { UserRole } from '../../types';
import { MOCK_USERS } from '../../data/mockData';
import {
  PhoneCall,
  Globe,
  UserCheck,
  Building2,
  Calendar,
  AlertTriangle,
  RotateCw,
  Bell,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    currentUser,
    language,
    setLanguage,
    selectedFinancialYear,
    setSelectedFinancialYear,
    activeModule,
    setActiveModule,
    farmerApplications,
    demands,
    procurements,
  } = useDMIS();

  const [emergencyModalOpen, setEmergencyModalOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  // Count pending actions
  const pendingFarmerCount = farmerApplications.filter((a) => a.status === 'SubmittedPatwari').length;
  const pendingDemandCount = demands.filter((d) => d.status === 'CollectorSigned' || d.status === 'ForwardedDMRD').length;
  const pendingProcurementCount = procurements.filter((p) => p.status === 'Submitted').length;
  const totalNotifications = pendingFarmerCount + pendingDemandCount + pendingProcurementCount;

  const roleLabels: Record<UserRole, { en: string; hi: string }> = {
    Citizen: { en: 'Citizen / Beneficiary', hi: 'नागरिक / लाभार्थी' },
    Patwari: { en: 'Patwari (Field Verifier)', hi: 'पटवारी (क्षेत्र सत्यापनकर्ता)' },
    Tehsildar: { en: 'Tehsildar (Executive)', hi: 'तहसीलदार (कार्यकारी)' },
    ReliefOIC: { en: 'Relief OIC (District)', hi: 'राहत प्रभारी अधिकारी (जिला)' },
    Collector: { en: 'District Collector & DM', hi: 'जिला कलक्टर एवं मजिस्ट्रेट' },
    DMRD_AO: { en: 'DMRD Account Officer', hi: 'आपदा प्रबंधन लेखा अधिकारी' },
    DMRD_FA: { en: 'Financial Advisor (State)', hi: 'वित्तीय सलाहकार (राज्य)' },
    DMRD_Secretary: { en: 'DMRD Secretary / Competent Authority', hi: 'शासन सचिव, आपदा प्रबंधन विभाग' },
    IFMS_DDO: { en: 'IFMS / DDO / Treasury User', hi: 'आईएफएमएस / आहरण एवं संवितरण' },
    ProcurementOfficer: { en: 'Emergency Procurement Officer', hi: 'आपातकालीन अधिप्राप्ति अधिकारी' },
    WarehouseOfficer: { en: 'Store & Warehouse In-Charge', hi: 'भंडार एवं गोदाम प्रभारी' },
    RescueCommander: { en: 'SDRF / Rescue Commander', hi: 'एसडीआरएफ / बचाव दल कमांडर' },
    DrillCoordinator: { en: 'Mock Drill Coordinator', hi: 'मॉक ड्रिल समन्वयक' },
    HROfficer: { en: 'Disaster HRM Nodal Officer', hi: 'आपदा मानव संसाधन नोडल अधिकारी' },
    SystemAdmin: { en: 'System Administrator (ACP-DMRD)', hi: 'प्रणाली व्यवस्थापक' },
  };

  return (
    <header className="bg-[#1A365D] text-white border-b-2 border-amber-500 shadow-md sticky top-0 z-40">
      {/* Top Gov Bar */}
      <div className="bg-[#102a45] text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-700/60">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-amber-400 tracking-wide">
            {language === 'hi' ? 'राजस्थान सरकार' : 'Government of Rajasthan'}
          </span>
          <span className="hidden sm:inline text-slate-400">|</span>
          <span className="hidden sm:inline text-slate-300">
            {language === 'hi' ? 'आपदा प्रबंधन, सहायता एवं नागरिक सुरक्षा विभाग' : 'Department of Disaster Management, Relief & Civil Defence'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-medium text-amber-200">Samvat 2083</span>
            <span className="text-slate-400">/</span>
            <select
              id="header-fy-select"
              value={selectedFinancialYear}
              onChange={(e) => setSelectedFinancialYear(e.target.value)}
              className="bg-[#1a385a] text-white text-xs rounded px-1.5 py-0.5 border border-slate-600 focus:outline-none"
            >
              <option value="2024-25">FY 2024-25</option>
              <option value="2025-26">FY 2025-26</option>
              <option value="2026-27">FY 2026-27</option>
            </select>
          </div>

          {/* Language Switcher */}
          <button
            id="header-lang-toggle"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-900/60 hover:bg-blue-800 transition text-amber-300 font-medium text-xs border border-blue-700/60 cursor-pointer"
            title="Switch Language / भाषा बदलें"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          {/* Emergency Helpline button */}
          <button
            id="header-emergency-helpline-btn"
            onClick={() => setEmergencyModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs tracking-wider transition animate-pulse cursor-pointer shadow"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>EMERGENCY 1070</span>
          </button>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Emblem & Portal Title */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveModule('citizen-portal')}>
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 p-0.5 shadow-lg flex items-center justify-center text-white font-black text-xl">
            <ShieldCheck className="w-8 h-8 text-white drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tight text-xl text-white">DMIS 2.0</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/40 rounded uppercase">
                {language === 'hi' ? 'राजस्थान पोर्टल' : 'State Portal'}
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              {language === 'hi'
                ? 'एकीकृत आपदा प्रबंधन एवं राहत सूचना प्रणाली'
                : 'Integrated Disaster Management Information System (Rajasthan)'}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              id="header-notifications-btn"
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition border border-slate-600 cursor-pointer"
              title="System Alerts & Task Pendency"
            >
              <Bell className="w-4 h-4" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#1A365D]">
                  {totalNotifications}
                </span>
              )}
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 text-slate-800 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-900">Task Inboxes & Urgent Alerts</span>
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {totalNotifications} Actionable
                  </span>
                </div>
                <div className="divide-y divide-slate-100 text-xs mt-2 max-h-60 overflow-y-auto">
                  <div
                    className="py-2 px-1 hover:bg-slate-50 cursor-pointer flex items-start gap-2"
                    onClick={() => {
                      setRole('Patwari');
                      setActiveModule('agri-subsidy');
                      setNotifDropdownOpen(false);
                    }}
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{pendingFarmerCount} Farmer verifications pending</p>
                      <p className="text-[11px] text-slate-500">Chomu Tehsil (Rampura & Morija circles)</p>
                    </div>
                  </div>
                  <div
                    className="py-2 px-1 hover:bg-slate-50 cursor-pointer flex items-start gap-2"
                    onClick={() => {
                      setRole('Collector');
                      setActiveModule('collector-dashboard');
                      setNotifDropdownOpen(false);
                    }}
                  >
                    <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{pendingDemandCount} Demands awaiting Collector OTP eSign</p>
                      <p className="text-[11px] text-slate-500">Jaipur District (Kharif 2024 Flood relief)</p>
                    </div>
                  </div>
                  <div
                    className="py-2 px-1 hover:bg-slate-50 cursor-pointer flex items-start gap-2"
                    onClick={() => {
                      setRole('ProcurementOfficer');
                      setActiveModule('procurement');
                      setNotifDropdownOpen(false);
                    }}
                  >
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{pendingProcurementCount} Emergency procurement requests</p>
                      <p className="text-[11px] text-slate-500">Water pumps & shelter tarpaulins</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Module Switch Buttons */}
          <button
            id="nav-gis-map-btn"
            onClick={() => setActiveModule('gis-map')}
            className={`text-xs px-2.5 py-1.5 rounded font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              activeModule === 'gis-map'
                ? 'bg-emerald-600 border-emerald-400 text-white shadow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
          >
            <span>Rajdharaa GIS</span>
          </button>

          <button
            id="nav-integrations-btn"
            onClick={() => setActiveModule('integrations-hub')}
            className={`text-xs px-2.5 py-1.5 rounded font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
              activeModule === 'integrations-hub'
                ? 'bg-amber-600 border-amber-400 text-white shadow'
                : 'bg-slate-800/80 hover:bg-slate-700 text-slate-200 border-slate-600'
            }`}
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">State APIs</span>
          </button>

          {/* Stakeholder Role Switcher Dropdown */}
          <div className="relative">
            <button
              id="header-role-selector-btn"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2.5 bg-gradient-to-r from-blue-900 to-indigo-950 px-3 py-1.5 rounded-lg border border-amber-400/60 hover:border-amber-400 text-left shadow-md transition cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center font-bold text-xs">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="hidden sm:block text-xs">
                <div className="font-bold text-amber-300 flex items-center gap-1">
                  <span>{roleLabels[role][language]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-[10px] text-slate-300 truncate max-w-[150px]">
                  {currentUser.fullName} ({currentUser.ssoId})
                </div>
              </div>
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 text-slate-800 py-2 z-50 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-slate-100 bg-slate-50">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {language === 'hi' ? 'भूमिका बदलें (अनुकरण)' : 'Switch Stakeholder Role'}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Select any role to test workflow permissions & screen actions
                  </p>
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map((r) => (
                  <button
                    key={r}
                    id={`role-opt-${r}`}
                    onClick={() => {
                      setRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50 transition cursor-pointer ${
                      role === r ? 'bg-blue-100/70 font-bold text-blue-900' : 'text-slate-700'
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{roleLabels[r][language]}</p>
                      <p className="text-[10px] text-slate-500">
                        {r === 'Citizen' ? 'Public Citizen Services Portal' : `SSO: ${MOCK_USERS[r]?.ssoId || r}`}
                      </p>
                    </div>
                    {role === r && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Helpline Modal */}
      {emergencyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white text-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-red-200 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">State Emergency Control Room</h3>
                <p className="text-xs text-red-600 font-medium">State Emergency Operations Centre (SEOC) 24x7</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Toll Free State Disaster Helpline</p>
                  <p className="text-xl font-black text-red-700 tracking-wider">1070</p>
                </div>
                <span className="px-2 py-1 text-[11px] font-bold bg-red-600 text-white rounded">Toll Free</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <p className="text-xs text-slate-500">District Emergency Control Room (Jaipur)</p>
                <p className="font-bold text-slate-800">0141-2227084 / 28072</p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                <div className="p-2 bg-blue-50 text-blue-900 rounded border border-blue-200">
                  <p className="text-slate-500 text-[10px]">Police</p>
                  <p className="font-bold text-base">100 / 112</p>
                </div>
                <div className="p-2 bg-amber-50 text-amber-900 rounded border border-amber-200">
                  <p className="text-slate-500 text-[10px]">Fire Brigade</p>
                  <p className="font-bold text-base">101</p>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-900 rounded border border-emerald-200">
                  <p className="text-slate-500 text-[10px]">Ambulance</p>
                  <p className="font-bold text-base">108</p>
                </div>
              </div>

              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                Email: <span className="font-semibold text-slate-700">helpdesk.dmrd@rajasthan.gov.in</span>
                <br />
                Address: Secretariat, C-Scheme, Jaipur, Rajasthan - 302005
              </div>
            </div>

            <button
              id="emergency-modal-close-btn"
              onClick={() => setEmergencyModalOpen(false)}
              className="mt-5 w-full py-2.5 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
