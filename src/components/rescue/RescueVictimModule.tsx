import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { RescueVictim } from '../../types';
import {
  Users,
  Search,
  CheckCircle2,
  HeartPulse,
  Plus,
  Camera,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Building,
} from 'lucide-react';

export const RescueVictimModule: React.FC = () => {
  const { rescueVictims, addRescueVictim, updateRescueVictim } = useDMIS();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New victim form
  const [newVictim, setNewVictim] = useState({
    fullName: '',
    age: 32,
    gender: 'Female' as const,
    district: 'Kota',
    incidentLocation: 'Chambal Riverfront, Ladpura',
    status: 'In Relief Camp' as const,
    currentLocation: 'Pashu & Jan Rahat Camp Sector 4',
    medicalCondition: 'Mild hypothermia, stable',
    kinContact: '9829019283 (Brother: Rahul)',
  });

  const filteredVictims = rescueVictims.filter((v) => {
    const name = v.fullName || '';
    const tag = v.identificationTag || v.caseId || '';
    const dist = v.district || '';
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddVictim = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = `TAG-RJ-${Math.floor(1000 + Math.random() * 9000)}`;
    addRescueVictim({
      caseId: tag,
      incidentId: 'INC-2025-0098',
      category: 'Rescued',
      approxAge: Number(newVictim.age),
      clothingDescription: 'Standard civilian clothes',
      distinguishingMarks: 'None recorded',
      rescueLocation: newVictim.incidentLocation,
      rescueTime: new Date().toLocaleString('en-IN'),
      identificationTag: tag,
      fullName: newVictim.fullName,
      age: Number(newVictim.age),
      gender: newVictim.gender,
      district: newVictim.district,
      incidentLocation: newVictim.incidentLocation,
      rescuedByTeam: 'SDRF 3rd Battalion Team Beta',
      rescuedTimestamp: new Date().toLocaleString('en-IN'),
      currentLocation: newVictim.currentLocation,
      medicalCondition: newVictim.medicalCondition,
      kinContact: newVictim.kinContact,
      status: newVictim.status,
    });
    alert(`Victim ${newVictim.fullName} registered with ID Tag ${tag}!`);
    setIsAddModalOpen(false);
  };

  const handleReunify = (victimId: string) => {
    updateRescueVictim(victimId, {
      status: 'Reunified / Closed',
    });
    alert('Family reunification recorded successfully!');
  };

  return (
    <div className="space-y-5">
      {/* Search & Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-purple-700" />
          <div>
            <h3 className="font-bold text-sm text-[#1A365D]">Rescue Identification & Reunification Registry</h3>
            <p className="text-slate-500 text-[11px]">Victim identification tags, medical status, and family search</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Tag, Name, District..."
              className="p-1.5 pl-8 border border-slate-300 rounded-lg text-xs w-56"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
          >
            <option value="All">All Statuses</option>
            <option value="In Relief Camp">In Relief Camp</option>
            <option value="Hospitalized">Hospitalized</option>
            <option value="Missing">Reported Missing</option>
            <option value="Reunited">Reunited with Family</option>
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 bg-[#1A365D] hover:bg-slate-800 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Register Rescued Person</span>
          </button>
        </div>
      </div>

      {/* Victims Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredVictims.map((v) => (
          <div key={v.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-purple-700 font-bold text-[11px] bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  {v.identificationTag || v.caseId}
                </span>
                <h4 className="font-bold text-sm text-slate-900 mt-1">{v.fullName || 'Unidentified Person'}</h4>
                <p className="text-[11px] text-slate-500">
                  {v.age || v.approxAge || 'Unknown'} Yrs, {v.gender} • {v.district || 'Rajasthan'}
                </p>
              </div>

              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  v.status === 'Hospitalized'
                    ? 'bg-red-100 text-red-800'
                    : v.status === 'Reunited' || v.status === 'Reunified / Closed'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {v.status}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1 text-[11px]">
              <p><strong>Current Location:</strong> {v.currentLocation || v.hospitalAssigned || v.rescueLocation}</p>
              <p><strong>Rescued by:</strong> {v.rescuedByTeam || (v.chainOfCustody?.[0]?.officer || 'SDRF 3rd Bn')}</p>
              <p><strong>Medical Condition:</strong> {v.medicalCondition || 'Stable'}</p>
              <p><strong>Kin / Family Contact:</strong> {v.kinContact || v.verifiedFamilyContact || 'Verification in progress'}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              {v.status === 'Reunified / Closed' || v.status === 'Reunited' ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Reunified with Family</span>
                </span>
              ) : (
                <button
                  onClick={() => handleReunify(v.id)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold cursor-pointer transition shadow"
                >
                  Confirm Reunification
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Register Victim Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-300 space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#1A365D]">Register Rescued Person / Missing Claim</h3>

            <form onSubmit={handleAddVictim} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newVictim.fullName}
                    onChange={(e) => setNewVictim({ ...newVictim, fullName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age & Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={newVictim.age}
                      onChange={(e) => setNewVictim({ ...newVictim, age: Number(e.target.value) })}
                      className="w-20 p-2 border border-slate-300 rounded-lg"
                    />
                    <select
                      value={newVictim.gender}
                      onChange={(e) => setNewVictim({ ...newVictim, gender: e.target.value as any })}
                      className="flex-1 p-2 border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <input
                    type="text"
                    value={newVictim.district}
                    onChange={(e) => setNewVictim({ ...newVictim, district: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Current Shelter / Hospital</label>
                  <input
                    type="text"
                    value={newVictim.currentLocation}
                    onChange={(e) => setNewVictim({ ...newVictim, currentLocation: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Condition</label>
                <input
                  type="text"
                  value={newVictim.medicalCondition}
                  onChange={(e) => setNewVictim({ ...newVictim, medicalCondition: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kin / Family Contact Phone</label>
                <input
                  type="text"
                  value={newVictim.kinContact}
                  onChange={(e) => setNewVictim({ ...newVictim, kinContact: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg transition shadow cursor-pointer"
                >
                  Assign Tag & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
