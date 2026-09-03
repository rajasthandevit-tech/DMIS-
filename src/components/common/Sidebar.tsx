import React from 'react';
import { useDMIS } from '../../context/DMISContext';
import {
  LayoutDashboard,
  Sprout,
  Milk,
  Boxes,
  ShoppingCart,
  Users,
  LifeBuoy,
  Flame,
  Radio,
  FileCheck2,
  FileText,
  Building,
  Hammer,
  Fish,
  Landmark,
  ShieldCheck,
  UserCog,
  MapPin,
  ClipboardList,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { role, activeModule, setActiveModule, language, farmerApplications, demands, procurements } = useDMIS();

  // Counts for badge
  const pendingFarmer = farmerApplications.filter((a) => a.status === 'SubmittedPatwari').length;
  const returnedFarmer = farmerApplications.filter((a) => a.status === 'ReturnedToPatwari' || a.status === 'PaymentFailed').length;
  const pendingDemands = demands.filter((d) => d.status === 'CollectorSigned' || d.status === 'PreparedOIC').length;

  const menuItems = [
    {
      id: 'citizen-portal',
      label: 'Citizen Services Portal',
      labelHi: 'नागरिक सेवा पोर्टल',
      icon: Users,
      badge: null,
      roles: ['Citizen', 'Patwari', 'Tehsildar', 'ReliefOIC', 'Collector', 'DMRD_AO', 'DMRD_FA', 'DMRD_Secretary', 'SystemAdmin'],
    },
    {
      id: 'agri-subsidy',
      label: 'Agriculture Input Subsidy',
      labelHi: 'कृषि आदान अनुदान',
      icon: Sprout,
      badge: pendingFarmer > 0 ? `${pendingFarmer}` : null,
      roles: ['Patwari', 'Tehsildar', 'ReliefOIC', 'Collector', 'SystemAdmin'],
    },
    {
      id: 'tehsildar-workflow',
      label: 'Tehsil Scrutiny & Dedup',
      labelHi: 'तहसील संवीक्षा एवं सत्यापन',
      icon: FileCheck2,
      badge: null,
      roles: ['Tehsildar', 'ReliefOIC', 'Collector', 'SystemAdmin'],
    },
    {
      id: 'relief-oic',
      label: 'District Relief OIC Consolidation',
      labelHi: 'जिला राहत समेकन (ओआईसी)',
      icon: Landmark,
      badge: null,
      roles: ['ReliefOIC', 'Collector', 'SystemAdmin'],
    },
    {
      id: 'collector-dashboard',
      label: 'Collector Approval & e-Sign',
      labelHi: 'कलक्टर अनुमोदन एवं ई-हस्ताक्षर',
      icon: ShieldCheck,
      badge: pendingDemands > 0 ? `${pendingDemands}` : null,
      roles: ['Collector', 'ReliefOIC', 'DMRD_Secretary', 'SystemAdmin'],
    },
    {
      id: 'state-finance',
      label: 'State DMRD & Finance',
      labelHi: 'राज्य वित्त एवं बजट आवंटन',
      icon: FileText,
      badge: null,
      roles: ['DMRD_AO', 'DMRD_FA', 'DMRD_Secretary', 'SystemAdmin'],
    },
    {
      id: 'ifms-dbt',
      label: 'IFMS / PayManager / DBT',
      labelHi: 'आईएफएमएस / पे-मैनेजर बिल',
      icon: Landmark,
      badge: null,
      roles: ['IFMS_DDO', 'DMRD_AO', 'Collector', 'SystemAdmin'],
    },
    {
      id: 'cattle-fodder',
      label: 'Cattle Camp & Fodder Depot',
      labelHi: 'पशु शिविर एवं चारा डिपो',
      icon: Milk,
      badge: null,
      roles: ['Citizen', 'Tehsildar', 'ReliefOIC', 'Collector', 'SystemAdmin'],
    },
    {
      id: 'procurement',
      label: 'Emergency Procurement',
      labelHi: 'आपातकालीन अधिप्राप्ति',
      icon: ShoppingCart,
      badge: procurements.length > 0 ? `${procurements.length}` : null,
      roles: ['ProcurementOfficer', 'Collector', 'WarehouseOfficer', 'SystemAdmin'],
    },
    {
      id: 'inventory',
      label: 'Inventory & Store Management',
      labelHi: 'राहत सामग्री भंडारण एवं स्टॉक',
      icon: Boxes,
      badge: null,
      roles: ['WarehouseOfficer', 'ProcurementOfficer', 'Collector', 'SystemAdmin'],
    },
    {
      id: 'mock-drill',
      label: 'Mock Drill Management',
      labelHi: 'मॉक ड्रिल प्रबंधन',
      icon: LifeBuoy,
      badge: 'Active',
      roles: ['DrillCoordinator', 'RescueCommander', 'Collector', 'SystemAdmin'],
    },
    {
      id: 'hrm',
      label: 'Human Resource Management',
      labelHi: 'आपदा मानव संसाधन प्रबंधन',
      icon: Users,
      badge: null,
      roles: ['HROfficer', 'RescueCommander', 'Collector', 'SystemAdmin'],
    },
    {
      id: 'rescue-victim',
      label: 'Disaster Rescue & Identification',
      labelHi: 'आपदा बचाव एवं पीड़ित पहचान',
      icon: LifeBuoy,
      badge: null,
      roles: ['RescueCommander', 'HROfficer', 'Collector', 'SystemAdmin'],
    },
    {
      id: 'incident-seoc',
      label: 'Incident Management (SEOC)',
      labelHi: 'घटना प्रबंधन एवं नियंत्रण कक्ष',
      icon: Flame,
      badge: null,
      roles: ['RescueCommander', 'Collector', 'ReliefOIC', 'Citizen', 'SystemAdmin'],
    },
    {
      id: 'user-admin',
      label: 'User & SSO Jurisdiction Admin',
      labelHi: 'उपयोगकर्ता एवं अधिकार क्षेत्र',
      icon: UserCog,
      badge: null,
      roles: ['SystemAdmin', 'DMRD_Secretary'],
    },
    {
      id: 'gis-map',
      label: 'Rajdharaa GIS Live Map',
      labelHi: 'राजधरा जीआईएस मानचित्र',
      icon: MapPin,
      badge: null,
      roles: ['Citizen', 'Patwari', 'Tehsildar', 'ReliefOIC', 'Collector', 'DMRD_AO', 'DMRD_FA', 'DMRD_Secretary', 'IFMS_DDO', 'ProcurementOfficer', 'WarehouseOfficer', 'RescueCommander', 'DrillCoordinator', 'HROfficer', 'SystemAdmin'],
    },
  ];

  // Filter menu items by role or show all if admin/viewing
  const visibleItems = menuItems.filter((item) => item.roles.includes(role) || role === 'SystemAdmin');

  return (
    <aside className="w-64 bg-[#0F233C] text-slate-300 flex flex-col shrink-0 border-r border-slate-700/80 select-none">
      {/* Role Profile Info Banner */}
      <div className="p-3.5 border-b border-slate-700/70 bg-[#162f4e]">
        <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
          {language === 'hi' ? 'सक्रिय कार्यक्षेत्र' : 'Active Jurisdiction'}
        </div>
        <div className="text-xs font-semibold text-white mt-1 truncate">
          {role === 'Patwari' && 'Jaipur › Chomu › Rampura'}
          {role === 'Tehsildar' && 'Jaipur District › Chomu Tehsil'}
          {role === 'ReliefOIC' && 'Jaipur District Relief Division'}
          {role === 'Collector' && 'Jaipur District Collectorate'}
          {(role === 'DMRD_AO' || role === 'DMRD_FA' || role === 'DMRD_Secretary') && 'State DMRD HQ, Jaipur'}
          {role === 'IFMS_DDO' && 'Treasury DDO Office 0102'}
          {role === 'ProcurementOfficer' && 'Disaster Procurement Cell'}
          {role === 'WarehouseOfficer' && 'Jaipur Central Relief Store'}
          {role === 'RescueCommander' && 'SDRF 3rd Bn / Kota Riverfront'}
          {role === 'DrillCoordinator' && 'State Preparedness Wing'}
          {role === 'HROfficer' && 'District Nodal HRM'}
          {role === 'SystemAdmin' && 'All 33 Districts Master Console'}
          {role === 'Citizen' && 'Public Citizen Self-Service'}
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 py-3 px-2.5 space-y-1 overflow-y-auto">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-item-${item.id}`}
              onClick={() => setActiveModule(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-amber-400/80'}`} />
                <span className="truncate">{language === 'hi' ? item.labelHi : item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full shrink-0 ${
                    isActive ? 'bg-slate-900 text-amber-300' : 'bg-red-500 text-white'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info / Version */}
      <div className="p-3 border-t border-slate-700/80 bg-[#0a1829] text-[10px] text-slate-400 flex items-center justify-between">
        <span>DMIS v2.0.4-PROD</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          RajSewaDwaar OK
        </span>
      </div>
    </aside>
  );
};
