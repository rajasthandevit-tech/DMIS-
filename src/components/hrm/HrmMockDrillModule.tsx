import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { HRMPersonnel, MockDrill } from '../../types';
import {
  Users,
  Shield,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Plus,
} from 'lucide-react';

export const HrmMockDrillModule: React.FC<{ initialTab?: 'personnel' | 'drills' | 'schedule-drill' }> = ({
  initialTab = 'personnel',
}) => {
  const { personnel, mockDrills, addMockDrill, updateMockDrill } = useDMIS();

  const [activeTab, setActiveTab] = useState<'personnel' | 'drills' | 'schedule-drill'>(initialTab);

  // Drill form state
  const [drillForm, setDrillForm] = useState({
    title: 'State-wide Mega Flood & Dam Inundation Drill',
    scenario: 'Flood / Dam Overflow' as const,
    district: 'Kota',
    date: '2025-06-15',
    leadAgency: 'SDRF / Civil Defence / DDMA',
    participatingAgencies: ['SDRF', 'Civil Defence', 'Health Dept', 'Police', 'Fire'],
    targetLocations: ['Kota Barrage', 'Chambal Basti', 'Keshoraipatan'],
  });

  const handleScheduleDrill = (e: React.FormEvent) => {
    e.preventDefault();
    const drillNo = `DRILL-RJ-2025-${Math.floor(100 + Math.random() * 900)}`;
    addMockDrill({
      drillNo: drillNo,
      title: drillForm.title,
      scenario: drillForm.scenario,
      district: drillForm.district,
      date: drillForm.date,
      leadAgency: drillForm.leadAgency,
      participatingAgencies: drillForm.participatingAgencies,
      targetLocations: drillForm.targetLocations,
      status: 'Scheduled',
    });
    alert(`Mock Drill ${drillNo} scheduled successfully!`);
    setActiveTab('drills');
  };

  const handleCompleteDrill = (drillId: string) => {
    updateMockDrill(drillId, {
      status: 'Completed',
      evaluationScore: 92,
      learningsDocUrl: '#',
    });
    alert('Mock Drill marked Completed! After-Action Report (AAR) generated.');
  };

  return (
    <div className="space-y-5">
      {/* Module Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-2 text-xs font-bold">
        <button
          onClick={() => setActiveTab('personnel')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'personnel' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>SDRF & Volunteer Personnel Roster ({personnel.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('drills')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'drills' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>Mock Drills & Preparedness ({mockDrills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schedule-drill')}
          className={`px-3.5 py-2 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'schedule-drill' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Plus className="w-4 h-4 text-emerald-600" />
          <span>Schedule New Drill</span>
        </button>
      </div>

      {/* 1. PERSONNEL ROSTER */}
      {activeTab === 'personnel' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {personnel.map((p) => (
              <div key={p.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono">{p.employeeId}</span>
                    <h4 className="font-bold text-sm text-slate-900 mt-0.5">{p.fullName}</h4>
                    <p className="text-[11px] text-blue-700 font-semibold">{p.designation} • {p.cadre || p.department}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      (p.deploymentStatus || p.status) === 'Deployed'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {p.deploymentStatus || p.status}
                  </span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                  <p><strong>HQ / District:</strong> {p.district}</p>
                  <p><strong>Contact:</strong> <span className="font-mono">{p.contactNumber || p.contact}</span></p>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {p.skills.map((s, idx) => (
                      <span key={idx} className="bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px] font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400">
                  <span>Duty Station: {(p.deploymentStatus || p.status) === 'Deployed' ? 'Active Field Zone' : 'Base Station'}</span>
                  <span className="text-emerald-700 font-bold">Readiness 100%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. MOCK DRILLS */}
      {activeTab === 'drills' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockDrills.map((drill) => (
              <div key={drill.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-slate-400 text-[10px] block">{drill.drillNo || drill.id.toUpperCase()}</span>
                    <h3 className="font-bold text-sm text-[#1A365D] mt-0.5">{drill.title || drill.drillTitle}</h3>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      drill.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {drill.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600">
                  <div>
                    <span className="text-[10px] text-slate-400">Scenario:</span>
                    <p className="font-bold text-slate-800">{drill.scenario || drill.drillType}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400">Date & District:</span>
                    <p className="font-semibold text-slate-800">{drill.date || drill.scheduledDate} ({drill.district})</p>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px]">
                  <p><strong>Lead Agency:</strong> {drill.leadAgency || (drill.participatingAgencies?.[0]?.agency || 'SDRF 3rd Bn')}</p>
                  <p><strong>Participating:</strong> {Array.isArray(drill.participatingAgencies) ? drill.participatingAgencies.map((a: any) => typeof a === 'string' ? a : a.agency).join(', ') : 'State Agencies'}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  {drill.status === 'Completed' ? (
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                      <Award className="w-4 h-4" />
                      <span>Score: {drill.evaluationScore || drill.scorecard?.overallScore || 92}/100 (AAR Filed)</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleCompleteDrill(drill.id)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer transition shadow text-xs"
                    >
                      Conduct & File Report
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SCHEDULE DRILL */}
      {activeTab === 'schedule-drill' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl mx-auto space-y-5 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold text-[#1A365D] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              <span>Schedule Inter-Agency Mock Drill</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate disaster response according to National Disaster Management Guidelines.
            </p>
          </div>

          <form onSubmit={handleScheduleDrill} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Drill Title *</label>
              <input
                type="text"
                required
                value={drillForm.title}
                onChange={(e) => setDrillForm({ ...drillForm, title: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Scenario *</label>
                <select
                  value={drillForm.scenario}
                  onChange={(e) => setDrillForm({ ...drillForm, scenario: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Flood / Dam Overflow">Flood / Dam Overflow</option>
                  <option value="Earthquake">Earthquake & Structural Collapse</option>
                  <option value="Chemical / Industrial Gas Leak">Chemical / Industrial Gas Leak</option>
                  <option value="Forest Fire">Forest Fire / High-rise Fire</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scheduled Date *</label>
                <input
                  type="date"
                  required
                  value={drillForm.date}
                  onChange={(e) => setDrillForm({ ...drillForm, date: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <input
                  type="text"
                  value={drillForm.district}
                  onChange={(e) => setDrillForm({ ...drillForm, district: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Lead Agency</label>
                <input
                  type="text"
                  value={drillForm.leadAgency}
                  onChange={(e) => setDrillForm({ ...drillForm, leadAgency: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('drills')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-lg transition shadow cursor-pointer"
              >
                Schedule Drill & Notify Agencies
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
