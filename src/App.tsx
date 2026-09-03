/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DMISProvider, useDMIS } from './context/DMISContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { AuditTrailModal } from './components/common/AuditTrailModal';
import { ESignModal } from './components/common/ESignModal';
import { DocumentViewerModal } from './components/common/DocumentViewerModal';

// Workflow Modules
import { CitizenPortal } from './components/citizen/CitizenPortal';
import { PatwariModule } from './components/patwari/PatwariModule';
import { TehsildarModule } from './components/tehsildar/TehsildarModule';
import { ReliefOICModule } from './components/relief/ReliefOICModule';
import { CollectorModule } from './components/collector/CollectorModule';
import { StateFinanceModule } from './components/state/StateFinanceModule';
import { IFMSDBTModule } from './components/ifms/IFMSDBTModule';
import { CattleFodderModule } from './components/cattle/CattleFodderModule';
import { ProcurementModule } from './components/procurement/ProcurementModule';
import { InventoryWarehouseModule } from './components/inventory/InventoryWarehouseModule';
import { HrmMockDrillModule } from './components/hrm/HrmMockDrillModule';
import { RescueVictimModule } from './components/rescue/RescueVictimModule';
import { IncidentSEOCModule } from './components/incident/IncidentSEOCModule';
import { UserAdminModule } from './components/admin/UserAdminModule';
import { GISMapComponent } from './components/common/GISMapComponent';
import { PhoneCall, Radio, AlertTriangle } from 'lucide-react';

const DMISMainLayout: React.FC = () => {
  const { activeModule, language } = useDMIS();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'citizen-portal':
        return <CitizenPortal />;
      case 'agri-subsidy':
        return <PatwariModule />;
      case 'tehsildar-workflow':
        return <TehsildarModule />;
      case 'relief-oic':
        return <ReliefOICModule />;
      case 'collector-dashboard':
        return <CollectorModule />;
      case 'state-finance':
        return <StateFinanceModule />;
      case 'ifms-dbt':
        return <IFMSDBTModule />;
      case 'cattle-fodder':
        return <CattleFodderModule />;
      case 'procurement':
        return <ProcurementModule />;
      case 'inventory':
        return <InventoryWarehouseModule />;
      case 'mock-drill':
        return <HrmMockDrillModule initialTab="drills" />;
      case 'hrm':
        return <HrmMockDrillModule initialTab="personnel" />;
      case 'rescue-victim':
        return <RescueVictimModule />;
      case 'incident-seoc':
        return <IncidentSEOCModule />;
      case 'user-admin':
        return <UserAdminModule />;
      case 'gis-map':
        return (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <h2 className="text-base font-bold text-[#1A365D]">Rajdharaa State GIS Spatial Command View</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Interactive spatial layers across all 33 districts displaying incidents, cattle camps, inventory depots, and SDRF deployments.
              </p>
            </div>
            <GISMapComponent height="calc(100vh - 220px)" />
          </div>
        );
      default:
        return <CitizenPortal />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-800 font-sans antialiased selection:bg-amber-200">
      {/* Top Government Emergency Ticker */}
      <div className="bg-[#0A192F] text-slate-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between border-b border-slate-700/80 gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide text-[11px]">
            {language === 'hi'
              ? 'आपदा प्रबंधन, सहायता एवं नागरिक सुरक्षा विभाग, राजस्थान सरकार'
              : 'Disaster Management, Relief & Civil Defence Department, Govt. of Rajasthan'}
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-amber-300 font-medium text-[11px]">
            {language === 'hi'
              ? 'राज्य आपातकालीन संचालन केंद्र (SEOC) 24x7 सक्रिय'
              : 'State Emergency Operations Centre (SEOC) 24x7 Active'}
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-amber-300 font-bold">
            <PhoneCall className="w-3.5 h-3.5 text-red-400" />
            <span>State Toll-Free: 1070 | District: 1077</span>
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 bg-emerald-950/80 text-emerald-300 rounded border border-emerald-700/50 font-mono text-[10px]">
            IFMS 3.0 & Jan Aadhaar LIVE
          </span>
        </div>
      </div>

      {/* Main Official Header */}
      <Header />

      {/* App Workspace Container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Dynamic Main Stage */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AuditTrailModal />
      <ESignModal />
      <DocumentViewerModal />
    </div>
  );
};

export default function App() {
  return (
    <DMISProvider>
      <DMISMainLayout />
    </DMISProvider>
  );
}
