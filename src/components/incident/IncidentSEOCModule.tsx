import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { IncidentRecord } from '../../types';
import {
  Flame,
  AlertTriangle,
  Radio,
  PhoneCall,
  Plus,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  Boxes,
  Eye,
  Send,
  ShieldAlert,
} from 'lucide-react';

export const IncidentSEOCModule: React.FC = () => {
  const { incidents, addIncident, updateIncident, openAuditModal } = useDMIS();
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  // New incident state
  const [newIncident, setNewIncident] = useState({
    title: '',
    disasterType: 'Flood' as const,
    district: 'Jaipur',
    tehsil: 'Chomu',
    locationDescription: 'Rampura Nallah breach near Low-Lying Basti',
    severity: 'High' as const,
    affectedPopulationEst: 450,
    fatalities: 0,
    injured: 3,
    cattleLoss: 5,
    assignedTeam: 'SDRF 3rd Bn Unit 2',
  });

  const filteredIncidents = incidents.filter((inc) => {
    return selectedSeverity === 'All' || inc.severity === selectedSeverity;
  });

  const handleCreateIncident = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `INC-${Date.now().toString(36).toUpperCase()}`;

    addIncident({
      title: newIncident.title,
      disasterType: newIncident.disasterType,
      district: newIncident.district,
      tehsil: newIncident.tehsil,
      locationDescription: newIncident.locationDescription,
      severity: newIncident.severity,
      reportedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      reportedBy: 'SEOC Hotline 1070',
      status: 'Reported',
      affectedPopulationEst: Number(newIncident.affectedPopulationEst),
      fatalities: Number(newIncident.fatalities),
      injured: Number(newIncident.injured),
      cattleLoss: Number(newIncident.cattleLoss),
      assignedTeam: newIncident.assignedTeam,
      latitude: 27.17,
      longitude: 75.72,
    });

    alert(`Incident logged successfully! SEOC Reference: ${id}. SDRF team alerted.`);
    setIsLogModalOpen(false);
  };

  const handleUpdateStatus = (incidentId: string, title: string, nextStatus: IncidentRecord['status']) => {
    updateIncident(
      incidentId,
      { status: nextStatus },
      `SEOC Updated Status to ${nextStatus}`,
      `Incident ${title} transitioned to ${nextStatus} by SEOC Duty Officer.`
    );
    alert(`Incident status updated to ${nextStatus}!`);
  };

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-red-700">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <span>State & District Emergency Operations Centre (SEOC / DEOC)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 font-semibold border border-red-200">
                24x7 War Room
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Live disaster incident logging, early warning dissemination, rescue team dispatch, and inter-agency coordination.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-red-600 text-white rounded-xl shadow flex items-center gap-2 text-xs font-bold">
            <PhoneCall className="w-4 h-4" />
            <span>Toll-Free Hotline: 1070 / 1077</span>
          </div>

          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-xl shadow transition text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Emergency Incident</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Active Incidents</span>
          <div className="text-2xl font-black text-red-600">
            {incidents.filter((i) => i.status !== 'Closed').length}
          </div>
          <p className="text-[11px] text-red-500 font-semibold">Under active containment</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">SDRF Teams Deployed</span>
          <div className="text-2xl font-black text-[#1A365D]">18 Teams</div>
          <p className="text-[11px] text-slate-500">Equipped with motorboats & drones</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Evacuated Citizens</span>
          <div className="text-2xl font-black text-emerald-700">1,420</div>
          <p className="text-[11px] text-emerald-600 font-semibold">Sheltered in relief centers</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <span className="text-slate-500 text-xs font-medium">Average Response Time</span>
          <div className="text-2xl font-black text-purple-700">18 Mins</div>
          <p className="text-[11px] text-slate-400">From call to first unit on ground</p>
        </div>
      </div>

      {/* Incidents Feed */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-[#1A365D]">Live Incident Stream</h3>
            <p className="text-slate-500 text-xs">Real-time situational awareness across Rajasthan districts.</p>
          </div>

          <div className="flex items-center gap-2">
            <label className="font-bold text-slate-700">Severity:</label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
            >
              <option value="All">All Severity Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* List of Incidents */}
        <div className="space-y-3">
          {filteredIncidents.map((inc) => (
            <div
              key={inc.id}
              className={`p-4 rounded-xl border space-y-3 transition ${
                inc.severity === 'Critical'
                  ? 'border-red-300 bg-red-50/20'
                  : inc.severity === 'High'
                  ? 'border-amber-300 bg-amber-50/20'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[10px]">{inc.id}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inc.severity === 'Critical'
                          ? 'bg-red-100 text-red-800 border border-red-300'
                          : inc.severity === 'High'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {inc.severity} Severity
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 text-[10px] font-bold">
                      {inc.status}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 mt-1">{inc.title}</h4>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Location: <strong>{inc.locationDescription}</strong> ({inc.tehsil}, {inc.district}) • Reported: {inc.reportedTime} via {inc.reportedBy}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[10px] block">Assigned Response Team</span>
                  <span className="font-bold text-slate-800">{inc.assignedTeam || 'SDRF Quick Response Unit'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Affected Population:</span>
                  <strong>{inc.affectedPopulationEst} Persons</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Injured / Evacuated:</span>
                  <strong className="text-blue-700">{inc.injured} Injured</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Fatalities:</span>
                  <strong className="text-red-700">{inc.fatalities} Reported</strong>
                </div>
                <div className="p-2 bg-white rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Cattle Casualties:</span>
                  <strong>{inc.cattleLoss} Livestock</strong>
                </div>
              </div>

              {/* Status Update Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200/80">
                <button
                  onClick={() => openAuditModal('Incident', inc.id)}
                  className="px-2.5 py-1 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg text-[11px] font-semibold cursor-pointer"
                >
                  View Incident Log
                </button>

                <div className="flex items-center gap-1.5">
                  {inc.status === 'Reported' && (
                    <button
                      onClick={() => handleUpdateStatus(inc.id, inc.title, 'Response Dispatched')}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] shadow cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Dispatch Response Team</span>
                    </button>
                  )}
                  {inc.status === 'Response Dispatched' && (
                    <button
                      onClick={() => handleUpdateStatus(inc.id, inc.title, 'Under Control')}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-[11px] shadow cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Mark Under Control</span>
                    </button>
                  )}
                  {inc.status === 'Under Control' && (
                    <button
                      onClick={() => handleUpdateStatus(inc.id, inc.title, 'Closed')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] shadow cursor-pointer flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Close Incident</span>
                    </button>
                  )}
                  {inc.status === 'Closed' && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Incident Contained & Closed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Emergency Modal */}
      {isLogModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-4 text-xs">
            <h3 className="font-bold text-base text-red-700 flex items-center gap-2">
              <Flame className="w-5 h-5" />
              <span>Log Emergency Disaster Incident</span>
            </h3>

            <form onSubmit={handleCreateIncident} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Incident Headline *</label>
                <input
                  type="text"
                  required
                  value={newIncident.title}
                  onChange={(e) => setNewIncident({ ...newIncident, title: e.target.value })}
                  placeholder="e.g., Flash flood in Bandi River inundating Govindgarh village"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Disaster Type</label>
                  <select
                    value={newIncident.disasterType}
                    onChange={(e) => setNewIncident({ ...newIncident, disasterType: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Flood">Flood / Inundation</option>
                    <option value="Heavy Rain">Excessive Rain</option>
                    <option value="Hailstorm">Hailstorm</option>
                    <option value="Dam Breach">Dam / Canal Breach</option>
                    <option value="Fire">Industrial / Forest Fire</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Severity</label>
                  <select
                    value={newIncident.severity}
                    onChange={(e) => setNewIncident({ ...newIncident, severity: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold text-red-700"
                  >
                    <option value="Critical">Critical (Immediate Evacuation)</option>
                    <option value="High">High (Urgent Response)</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specific Location Description *</label>
                <input
                  type="text"
                  required
                  value={newIncident.locationDescription}
                  onChange={(e) => setNewIncident({ ...newIncident, locationDescription: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estimated Affected People</label>
                  <input
                    type="number"
                    value={newIncident.affectedPopulationEst}
                    onChange={(e) => setNewIncident({ ...newIncident, affectedPopulationEst: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Response Team</label>
                  <input
                    type="text"
                    value={newIncident.assignedTeam}
                    onChange={(e) => setNewIncident({ ...newIncident, assignedTeam: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 hover:bg-red-800 text-white font-bold rounded-xl shadow cursor-pointer"
                >
                  Log & Alert Units
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
