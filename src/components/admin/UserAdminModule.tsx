import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import { MOCK_USERS } from '../../data/mockData';
import {
  UserCog,
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Building,
  KeyRound,
  Users,
  Eye,
  AlertCircle,
} from 'lucide-react';

export const UserAdminModule: React.FC = () => {
  const { currentUser, setRole, auditLogs, openAuditModal } = useDMIS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('All');

  const allUsers = Object.values(MOCK_USERS);

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.ssoId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.districtName || user.department || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRoleFilter === 'All' || user.userType === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-300 text-slate-800">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <span>RajSSO Jurisdiction & Role-Based Access Control (RBAC)</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold border border-blue-200">
                Administrative Console
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage SSO ID assignments, district/tehsil/patwar circle hierarchy bindings, and digital signature authorization status.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>RajSSO Identity Provider Connected</span>
          </span>
        </div>
      </div>

      {/* Users List & Jurisdiction Mapping */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-[#1A365D]">Government Officers & Cadres ({allUsers.length})</h3>
            <p className="text-xs text-slate-500">
              Click "Switch to Role" to simulate the experience of any official across the disaster management hierarchy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search SSO ID, Name, Cadre..."
                className="p-1.5 pl-8 border border-slate-300 rounded-lg text-xs w-60"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="p-1.5 border border-slate-300 rounded-lg bg-white text-xs font-semibold"
            >
              <option value="All">All Roles</option>
              <option value="Citizen">Citizen</option>
              <option value="Patwari">Patwari</option>
              <option value="Tehsildar">Tehsildar</option>
              <option value="ReliefOIC">Relief OIC</option>
              <option value="Collector">Collector</option>
              <option value="DMRD_Secretary">DMRD Secretary</option>
              <option value="DMRD_FA">DMRD Financial Advisor</option>
              <option value="IFMS_DDO">IFMS DDO Treasury</option>
              <option value="ProcurementOfficer">Procurement Officer</option>
              <option value="WarehouseOfficer">Warehouse Officer</option>
              <option value="RescueCommander">Rescue Commander</option>
              <option value="DrillCoordinator">Drill Coordinator</option>
              <option value="HROfficer">HR Officer</option>
              <option value="SystemAdmin">System Admin</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Official Name & Designation</th>
                <th className="p-3">SSO ID</th>
                <th className="p-3">Assigned Role</th>
                <th className="p-3">Bound Jurisdiction</th>
                <th className="p-3">e-Sign / DSC Status</th>
                <th className="p-3 text-right">Simulation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const isCurrent = currentUser?.ssoId === user.ssoId;

                return (
                  <tr key={user.userId} className={`hover:bg-slate-50/70 transition ${isCurrent ? 'bg-amber-50/40' : ''}`}>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{user.fullName}</div>
                      <div className="text-[11px] text-slate-500">{user.designation}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-purple-900">{user.ssoId}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-bold">
                        {user.userType}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-slate-800">{user.districtName || user.department}</span>
                      {user.tehsilName && <span className="text-slate-500"> › {user.tehsilName}</span>}
                    </td>
                    <td className="p-3">
                      <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active DSC Token</span>
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {isCurrent ? (
                        <span className="text-xs font-bold text-amber-700 px-3 py-1 bg-amber-100 rounded-lg">
                          Active Persona
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setRole(user.userType);
                            alert(`Switched active persona to ${user.fullName} (${user.designation})! Navigation menu updated to match jurisdiction.`);
                          }}
                          className="px-3 py-1 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-lg text-xs cursor-pointer shadow transition"
                        >
                          Switch Role
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Audit Activity Log */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#1A365D]">System Security & Blockchain Audit Log</h3>
            <p className="text-xs text-slate-500">Immutable ledger tracking every electronic approval and e-Sign timestamp.</p>
          </div>
          <button
            onClick={() => openAuditModal('SYSTEM', 'USER_ADMIN')}
            className="px-3 py-1.5 border border-slate-300 rounded-lg hover:bg-slate-50 font-semibold cursor-pointer"
          >
            View Full Audit Ledger
          </button>
        </div>

        <div className="space-y-2">
          {auditLogs.slice(0, 5).map((log) => (
            <div key={log.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">{log.action}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Officer: <strong>{log.performedBy}</strong> ({log.role}) • {log.remarks}
                </p>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
