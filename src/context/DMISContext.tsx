import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  Language,
  UserProfile,
  FarmerApplication,
  ConsolidatedDemand,
  CattleCampRecord,
  FodderDepotRecord,
  EmergencyProcurementRequest,
  InventoryItem,
  MockDrillPlan,
  HRPersonnel,
  RescueVictim,
  DisasterIncident,
  IFMSBill,
  AuditLogEntry,
  District,
  FundAllotment,
} from '../types';
import {
  MOCK_USERS,
  RAJASTHAN_DISTRICTS,
  INITIAL_FARMER_APPLICATIONS,
  INITIAL_DEMANDS,
  INITIAL_CATTLE_CAMPS,
  INITIAL_FODDER_DEPOTS,
  INITIAL_PROCUREMENTS,
  INITIAL_INVENTORY,
  INITIAL_MOCK_DRILLS,
  INITIAL_HR_PERSONNEL,
  INITIAL_RESCUE_VICTIMS,
  INITIAL_INCIDENTS,
  INITIAL_IFMS_BILLS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

interface DMISContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedFinancialYear: string;
  setSelectedFinancialYear: (fy: string) => void;
  districts: District[];
  
  // Navigation / active sub-view
  activeModule: string;
  setActiveModule: (mod: string) => void;
  
  // Data entities
  farmerApplications: FarmerApplication[];
  demands: ConsolidatedDemand[];
  cattleCamps: CattleCampRecord[];
  fodderDepots: FodderDepotRecord[];
  procurements: EmergencyProcurementRequest[];
  inventory: InventoryItem[];
  mockDrills: MockDrillPlan[];
  personnel: HRPersonnel[];
  rescueVictims: RescueVictim[];
  incidents: DisasterIncident[];
  ifmsBills: IFMSBill[];
  auditLogs: AuditLogEntry[];

  // Action methods
  addAuditLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  updateFarmerApplication: (id: string, updates: Partial<FarmerApplication>, actionName?: string, remarks?: string) => void;
  batchVerifyFarmers: (villageId: number, officerName: string) => number;
  addFarmerApplication: (app: FarmerApplication) => void;
  
  updateDemand: (id: string, updates: Partial<ConsolidatedDemand>, actionName?: string, remarks?: string) => void;
  createDemand: (demand: Omit<ConsolidatedDemand, 'id'>) => ConsolidatedDemand;
  
  addCattleCamp: (camp: Omit<CattleCampRecord, 'id'>) => CattleCampRecord;
  updateCattleCamp: (id: string, updates: Partial<CattleCampRecord>) => void;
  
  addFodderDepot: (depot: Omit<FodderDepotRecord, 'id'>) => FodderDepotRecord;
  updateFodderDepot: (id: string, updates: Partial<FodderDepotRecord>) => void;
  
  addProcurement: (proc: Omit<EmergencyProcurementRequest, 'id'>) => EmergencyProcurementRequest;
  updateProcurement: (id: string, updates: Partial<EmergencyProcurementRequest>) => void;
  
  updateInventoryStock: (id: string, qtyChange: number) => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => InventoryItem;
  
  updateMockDrill: (id: string, updates: Partial<MockDrillPlan>) => void;
  addMockDrill: (drill: Omit<MockDrillPlan, 'id'>) => MockDrillPlan;
  
  updatePersonnel: (id: string, updates: Partial<HRPersonnel>) => void;
  deployPersonnel: (personnelId: string, incidentId: string, role: string, location: string) => void;
  
  addRescueVictim: (victim: Omit<RescueVictim, 'id'>) => RescueVictim;
  updateRescueVictim: (id: string, updates: Partial<RescueVictim>) => void;
  
  addIncident: (incident: Omit<DisasterIncident, 'id'>) => DisasterIncident;
  updateIncident: (id: string, updates: Partial<DisasterIncident>, action?: string, remarks?: string) => void;
  
  updateIFMSBill: (id: string, updates: Partial<IFMSBill>) => void;
  addIfmsBill: (bill: any) => void;
  updateInventoryItem: (id: string, updates: Partial<InventoryItem>) => void;
  fundAllotments: FundAllotment[];

  // Dialog triggers
  openAuditModal: (entityType: string, entityId: string) => void;
  closeAuditModal: () => void;
  auditModalOpen: boolean;
  currentAuditFilter: { entityType?: string; entityId?: string } | null;

  openESignModal: (title: string, documentRef: string, onSigned: (signatureMeta: { signatureId: string; signedAt: string; hash: string }) => void) => void;
  closeESignModal: () => void;
  eSignModalState: { isOpen: boolean; title: string; docRef: string; onSigned?: (meta: any) => void };

  openDocViewer: (title: string, docType: string, data: any) => void;
  closeDocViewer: () => void;
  docViewerState: { isOpen: boolean; title: string; docType: string; data: any };
}

const DMISContext = createContext<DMISContextType | undefined>(undefined);

export const DMISProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('Patwari');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<string>('2024-25');
  const [activeModule, setActiveModule] = useState<string>('agri-subsidy');

  // Load from localStorage or defaults
  const [farmerApplications, setFarmerApplications] = useState<FarmerApplication[]>(() => {
    const saved = localStorage.getItem('dmis_farmer_apps');
    return saved ? JSON.parse(saved) : INITIAL_FARMER_APPLICATIONS;
  });

  const [demands, setDemands] = useState<ConsolidatedDemand[]>(() => {
    const saved = localStorage.getItem('dmis_demands');
    return saved ? JSON.parse(saved) : INITIAL_DEMANDS;
  });

  const [cattleCamps, setCattleCamps] = useState<CattleCampRecord[]>(() => {
    const saved = localStorage.getItem('dmis_cattle_camps');
    return saved ? JSON.parse(saved) : INITIAL_CATTLE_CAMPS;
  });

  const [fodderDepots, setFodderDepots] = useState<FodderDepotRecord[]>(() => {
    const saved = localStorage.getItem('dmis_fodder_depots');
    return saved ? JSON.parse(saved) : INITIAL_FODDER_DEPOTS;
  });

  const [procurements, setProcurements] = useState<EmergencyProcurementRequest[]>(() => {
    const saved = localStorage.getItem('dmis_procurements');
    return saved ? JSON.parse(saved) : INITIAL_PROCUREMENTS;
  });

  const [inventory, setInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('dmis_inventory');
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY;
  });

  const [mockDrills, setMockDrills] = useState<MockDrillPlan[]>(() => {
    const saved = localStorage.getItem('dmis_mock_drills');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_DRILLS;
  });

  const [personnel, setPersonnel] = useState<HRPersonnel[]>(() => {
    const saved = localStorage.getItem('dmis_personnel');
    return saved ? JSON.parse(saved) : INITIAL_HR_PERSONNEL;
  });

  const [rescueVictims, setRescueVictims] = useState<RescueVictim[]>(() => {
    const saved = localStorage.getItem('dmis_rescue_victims');
    return saved ? JSON.parse(saved) : INITIAL_RESCUE_VICTIMS;
  });

  const [incidents, setIncidents] = useState<DisasterIncident[]>(() => {
    const saved = localStorage.getItem('dmis_incidents');
    return saved ? JSON.parse(saved) : INITIAL_INCIDENTS;
  });

  const [ifmsBills, setIfmsBills] = useState<IFMSBill[]>(() => {
    const saved = localStorage.getItem('dmis_ifms_bills');
    return saved ? JSON.parse(saved) : INITIAL_IFMS_BILLS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('dmis_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // Modals state
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [currentAuditFilter, setCurrentAuditFilter] = useState<{ entityType?: string; entityId?: string } | null>(null);

  const [eSignModalState, setESignModalState] = useState<{
    isOpen: boolean;
    title: string;
    docRef: string;
    onSigned?: (meta: any) => void;
  }>({ isOpen: false, title: '', docRef: '' });

  const [docViewerState, setDocViewerState] = useState<{
    isOpen: boolean;
    title: string;
    docType: string;
    data: any;
  }>({ isOpen: false, title: '', docType: '', data: null });

  // Persistence side-effects
  useEffect(() => {
    localStorage.setItem('dmis_farmer_apps', JSON.stringify(farmerApplications));
  }, [farmerApplications]);

  useEffect(() => {
    localStorage.setItem('dmis_demands', JSON.stringify(demands));
  }, [demands]);

  useEffect(() => {
    localStorage.setItem('dmis_cattle_camps', JSON.stringify(cattleCamps));
  }, [cattleCamps]);

  useEffect(() => {
    localStorage.setItem('dmis_fodder_depots', JSON.stringify(fodderDepots));
  }, [fodderDepots]);

  useEffect(() => {
    localStorage.setItem('dmis_procurements', JSON.stringify(procurements));
  }, [procurements]);

  useEffect(() => {
    localStorage.setItem('dmis_inventory', JSON.stringify(inventory));
  }, [inventory]);

  useEffect(() => {
    localStorage.setItem('dmis_mock_drills', JSON.stringify(mockDrills));
  }, [mockDrills]);

  useEffect(() => {
    localStorage.setItem('dmis_personnel', JSON.stringify(personnel));
  }, [personnel]);

  useEffect(() => {
    localStorage.setItem('dmis_rescue_victims', JSON.stringify(rescueVictims));
  }, [rescueVictims]);

  useEffect(() => {
    localStorage.setItem('dmis_incidents', JSON.stringify(incidents));
  }, [incidents]);

  useEffect(() => {
    localStorage.setItem('dmis_ifms_bills', JSON.stringify(ifmsBills));
  }, [ifmsBills]);

  useEffect(() => {
    localStorage.setItem('dmis_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const currentUser = MOCK_USERS[role] || MOCK_USERS.Patwari;

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // Auto switch primary module context according to persona
    if (newRole === 'Citizen') setActiveModule('citizen-portal');
    else if (newRole === 'Patwari') setActiveModule('agri-subsidy');
    else if (newRole === 'Tehsildar') setActiveModule('tehsildar-workflow');
    else if (newRole === 'ReliefOIC') setActiveModule('relief-oic');
    else if (newRole === 'Collector') setActiveModule('collector-dashboard');
    else if (newRole === 'DMRD_AO' || newRole === 'DMRD_FA' || newRole === 'DMRD_Secretary') setActiveModule('state-finance');
    else if (newRole === 'IFMS_DDO') setActiveModule('ifms-dbt');
    else if (newRole === 'ProcurementOfficer') setActiveModule('procurement');
    else if (newRole === 'WarehouseOfficer') setActiveModule('inventory');
    else if (newRole === 'RescueCommander') setActiveModule('rescue-victim');
    else if (newRole === 'DrillCoordinator') setActiveModule('mock-drill');
    else if (newRole === 'HROfficer') setActiveModule('hrm');
    else if (newRole === 'SystemAdmin') setActiveModule('user-admin');
  };

  const addAuditLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newEntry: AuditLogEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      ipAddress: '10.24.112.' + Math.floor(Math.random() * 200 + 10),
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const updateFarmerApplication = (
    id: string,
    updates: Partial<FarmerApplication>,
    actionName = 'Updated Record',
    remarks = 'Record updated'
  ) => {
    setFarmerApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const fromStatus = app.status;
          const toStatus = updates.status || app.status;
          addAuditLog({
            entityType: 'FarmerApplication',
            entityId: app.applicationNo,
            action: actionName,
            fromStatus,
            toStatus,
            performedBy: currentUser.fullName,
            role: currentUser.userType,
            remarks: updates.remarks || remarks,
          });
          return {
            ...app,
            ...updates,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return app;
      })
    );
  };

  const batchVerifyFarmers = (villageId: number, officerName: string): number => {
    let count = 0;
    setFarmerApplications((prev) =>
      prev.map((app) => {
        if (app.status === 'SubmittedPatwari') {
          count++;
          addAuditLog({
            entityType: 'FarmerApplication',
            entityId: app.applicationNo,
            action: 'Tehsildar Batch Verification & Recalculate Limits',
            fromStatus: 'SubmittedPatwari',
            toStatus: 'VerifiedTehsildar',
            performedBy: officerName,
            role: 'Tehsildar',
            remarks: 'SDRF Norm Ceiling check applied: max 2.0 Ha @ Rs 8,500/Ha for SMF category.',
          });
          // Apply SDRF norm ceiling check (as in sp_RecalculateSubsidyAndCheckLimits)
          const admissibleArea = app.farmerCategory === 'SMF' ? Math.min(app.affectedAreaHa, 2.0) : app.affectedAreaHa;
          const rate = 8500;
          return {
            ...app,
            admissibleSubsidyAmount: Math.round(admissibleArea * rate),
            status: 'VerifiedTehsildar',
            verifiedByTehsildar: true,
            lastUpdated: new Date().toISOString().split('T')[0],
          };
        }
        return app;
      })
    );
    return count;
  };

  const addFarmerApplication = (app: FarmerApplication) => {
    setFarmerApplications((prev) => [app, ...prev]);
    addAuditLog({
      entityType: 'FarmerApplication',
      entityId: app.applicationNo,
      action: 'Application Submitted',
      fromStatus: 'New',
      toStatus: app.status,
      performedBy: currentUser.fullName,
      role: currentUser.userType,
      remarks: 'Application created and ingested into DMIS 2.0 workflow.',
    });
  };

  const updateDemand = (
    id: string,
    updates: Partial<ConsolidatedDemand>,
    actionName = 'Updated Demand',
    remarks = 'Demand updated'
  ) => {
    setDemands((prev) =>
      prev.map((dem) => {
        if (dem.id === id) {
          const fromStatus = dem.status;
          const toStatus = updates.status || dem.status;
          addAuditLog({
            entityType: 'ConsolidatedDemand',
            entityId: dem.demandNo,
            action: actionName,
            fromStatus,
            toStatus,
            performedBy: currentUser.fullName,
            role: currentUser.userType,
            remarks: updates.aoRemarks || updates.faRemarks || updates.secretaryRemarks || remarks,
          });
          return { ...dem, ...updates };
        }
        return dem;
      })
    );
  };

  const createDemand = (demandData: Omit<ConsolidatedDemand, 'id'>): ConsolidatedDemand => {
    const newDemand: ConsolidatedDemand = {
      ...demandData,
      id: `dem-${Date.now()}`,
    };
    setDemands((prev) => [newDemand, ...prev]);
    addAuditLog({
      entityType: 'ConsolidatedDemand',
      entityId: newDemand.demandNo,
      action: 'Consolidated Demand Prepared',
      fromStatus: 'Draft',
      toStatus: newDemand.status,
      performedBy: currentUser.fullName,
      role: currentUser.userType,
      remarks: `Consolidated demand of Rs ${newDemand.totalAmountCr} Cr generated for ${newDemand.totalFarmers} farmers.`,
    });
    return newDemand;
  };

  const addCattleCamp = (campData: Omit<CattleCampRecord, 'id'>): CattleCampRecord => {
    const newCamp: CattleCampRecord = {
      ...campData,
      id: `cc-${Date.now()}`,
    };
    setCattleCamps((prev) => [newCamp, ...prev]);
    addAuditLog({
      entityType: 'CattleCamp',
      entityId: newCamp.registrationNo,
      action: 'Cattle Camp Registration Submitted',
      toStatus: newCamp.status,
      performedBy: currentUser.fullName,
      role: currentUser.userType,
      remarks: `Registration received for ${newCamp.campName} (${newCamp.totalAnimals} animals).`,
    });
    return newCamp;
  };

  const updateCattleCamp = (id: string, updates: Partial<CattleCampRecord>) => {
    setCattleCamps((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          addAuditLog({
            entityType: 'CattleCamp',
            entityId: c.registrationNo,
            action: 'Cattle Camp Status Updated',
            fromStatus: c.status,
            toStatus: updates.status || c.status,
            performedBy: currentUser.fullName,
            role: currentUser.userType,
            remarks: `Status transitioned to ${updates.status || c.status}`,
          });
          return { ...c, ...updates };
        }
        return c;
      })
    );
  };

  const addFodderDepot = (depotData: Omit<FodderDepotRecord, 'id'>): FodderDepotRecord => {
    const newDepot: FodderDepotRecord = {
      ...depotData,
      id: `fd-${Date.now()}`,
    };
    setFodderDepots((prev) => [newDepot, ...prev]);
    addAuditLog({
      entityType: 'FodderDepot',
      entityId: newDepot.registrationNo,
      action: 'Fodder Depot Application Registered',
      toStatus: newDepot.status,
      performedBy: currentUser.fullName,
      role: currentUser.userType,
      remarks: `Fodder depot ${newDepot.depotName} registered.`,
    });
    return newDepot;
  };

  const updateFodderDepot = (id: string, updates: Partial<FodderDepotRecord>) => {
    setFodderDepots((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const addProcurement = (procData: Omit<EmergencyProcurementRequest, 'id'>): EmergencyProcurementRequest => {
    const newProc: EmergencyProcurementRequest = {
      ...procData,
      id: `proc-${Date.now()}`,
    };
    setProcurements((prev) => [newProc, ...prev]);
    addAuditLog({
      entityType: 'EmergencyProcurement',
      entityId: newProc.requestId,
      action: 'Procurement Request Created',
      toStatus: newProc.status,
      performedBy: currentUser.fullName,
      role: currentUser.userType,
      remarks: `Urgent requirement for ${newProc.quantityRequested} ${newProc.unit} of ${newProc.itemName}.`,
    });
    return newProc;
  };

  const updateProcurement = (id: string, updates: Partial<EmergencyProcurementRequest>) => {
    setProcurements((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          addAuditLog({
            entityType: 'EmergencyProcurement',
            entityId: p.requestId,
            action: 'Procurement Milestone Updated',
            fromStatus: p.status,
            toStatus: updates.status || p.status,
            performedBy: currentUser.fullName,
            role: currentUser.userType,
            remarks: `Procurement updated to ${updates.status || p.status}`,
          });
          return { ...p, ...updates };
        }
        return p;
      })
    );
  };

  const updateInventoryStock = (id: string, qtyChange: number) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newTotal = Math.max(0, item.totalStock + qtyChange);
          const newAvail = Math.max(0, item.availableQty + qtyChange);
          return { ...item, totalStock: newTotal, availableQty: newAvail };
        }
        return item;
      })
    );
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id'>): InventoryItem => {
    const newItem: InventoryItem = {
      ...itemData,
      id: `inv-${Date.now()}`,
    };
    setInventory((prev) => [newItem, ...prev]);
    return newItem;
  };

  const updateMockDrill = (id: string, updates: Partial<MockDrillPlan>) => {
    setMockDrills((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const addMockDrill = (drillData: Omit<MockDrillPlan, 'id'>): MockDrillPlan => {
    const newDrill: MockDrillPlan = {
      ...drillData,
      id: `drill-${Date.now()}`,
    };
    setMockDrills((prev) => [newDrill, ...prev]);
    return newDrill;
  };

  const updatePersonnel = (id: string, updates: Partial<HRPersonnel>) => {
    setPersonnel((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deployPersonnel = (personnelId: string, incidentId: string, roleName: string, location: string) => {
    setPersonnel((prev) =>
      prev.map((p) => {
        if (p.id === personnelId) {
          return {
            ...p,
            status: 'Deployed',
            currentDeployment: {
              incidentId,
              role: roleName,
              location,
              reportingTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
              expectedDuration: '3 Days',
              mobileCheckedIn: false,
            },
          };
        }
        return p;
      })
    );
  };

  const addRescueVictim = (victimData: Omit<RescueVictim, 'id'>): RescueVictim => {
    const newVictim: RescueVictim = {
      ...victimData,
      id: `resc-${Date.now()}`,
    };
    setRescueVictims((prev) => [newVictim, ...prev]);
    return newVictim;
  };

  const updateRescueVictim = (id: string, updates: Partial<RescueVictim>) => {
    setRescueVictims((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  };

  const addIncident = (incidentData: Omit<DisasterIncident, 'id'>): DisasterIncident => {
    const newInc: DisasterIncident = {
      ...incidentData,
      id: `inc-${Date.now()}`,
    };
    setIncidents((prev) => [newInc, ...prev]);
    return newInc;
  };

  const updateIncident = (id: string, updates: Partial<DisasterIncident>, action?: string, remarks?: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === id) {
          if (action) {
            addAuditLog({
              entityType: 'DisasterIncident',
              entityId: inc.incidentNo || inc.id,
              action: action,
              fromStatus: inc.status,
              toStatus: updates.status || inc.status,
              performedBy: currentUser.fullName,
              role: currentUser.userType,
              remarks: remarks || `Incident updated to ${updates.status || inc.status}`,
            });
          }
          return { ...inc, ...updates };
        }
        return inc;
      })
    );
  };

  const updateIFMSBill = (id: string, updates: Partial<IFMSBill>) => {
    setIfmsBills((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const [fundAllotments] = useState<FundAllotment[]>([
    {
      id: 'fa-01',
      headOfAccount: '2245-02-101-01-35-00-31',
      description: 'Agriculture Input Subsidy for SMF / OSMF Farmers (Kharif)',
      totalAllottedCr: 45.0,
      expenditureCr: 38.5,
      balanceCr: 6.5,
    },
    {
      id: 'fa-02',
      headOfAccount: '2245-02-102-02-35-00-31',
      description: 'Cattle Camps, Fodder Depots & Animal Subsidy',
      totalAllottedCr: 20.0,
      expenditureCr: 14.2,
      balanceCr: 5.8,
    },
    {
      id: 'fa-03',
      headOfAccount: '2245-02-104-03-35-00-31',
      description: 'Emergency Rescue Boats, Pumps, Tents & Safety Logistics',
      totalAllottedCr: 15.0,
      expenditureCr: 8.9,
      balanceCr: 6.1,
    },
  ]);

  const addIfmsBill = (billData: any) => {
    const newBill: IFMSBill = {
      id: `bill-${Date.now()}`,
      billNo: billData.billNumber || billData.billNo || `IFMS-JPR-2025-B${Math.floor(100 + Math.random() * 900)}`,
      sanctionNo: billData.sanctionNo || 'DM-JPR/SDRF/2025/AS-1021',
      ddoCode: billData.ddoCode || 'DDO-2083-REV',
      budgetHead: billData.headOfAccount || billData.budgetHead || '2245-02-101-01-35-00-31',
      totalBeneficiaries: billData.totalBeneficiaries || 1,
      totalAmountInr: billData.totalAmount || billData.totalAmountInr || 0,
      billDate: billData.billDate || new Date().toISOString().split('T')[0],
      status: 'Treasury Accepted',
      failureCount: 0,
      paidCount: billData.totalBeneficiaries || 1,
      utrReference: `UTR${Date.now().toString().slice(-8)}`,
    };
    setIfmsBills((prev) => [newBill, ...prev]);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const avail = updates.quantityAvailable !== undefined ? updates.quantityAvailable : (updates.availableQty !== undefined ? updates.availableQty : item.availableQty);
          return {
            ...item,
            ...updates,
            availableQty: avail,
            quantityAvailable: avail,
          };
        }
        return item;
      })
    );
  };

  const openAuditModal = (entityType: string, entityId: string) => {
    setCurrentAuditFilter({ entityType, entityId });
    setAuditModalOpen(true);
  };

  const closeAuditModal = () => {
    setAuditModalOpen(false);
    setCurrentAuditFilter(null);
  };

  const openESignModal = (
    title: string,
    docRef: string,
    onSigned: (meta: { signatureId: string; signedAt: string; hash: string }) => void
  ) => {
    setESignModalState({ isOpen: true, title, docRef, onSigned });
  };

  const closeESignModal = () => {
    setESignModalState({ isOpen: false, title: '', docRef: '' });
  };

  const openDocViewer = (title: string, docType: string, data: any) => {
    setDocViewerState({ isOpen: true, title, docType, data });
  };

  const closeDocViewer = () => {
    setDocViewerState({ isOpen: false, title: '', docType: '', data: null });
  };

  return (
    <DMISContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        language,
        setLanguage,
        selectedFinancialYear,
        setSelectedFinancialYear,
        districts: RAJASTHAN_DISTRICTS,
        activeModule,
        setActiveModule,
        farmerApplications,
        demands,
        cattleCamps,
        fodderDepots,
        procurements,
        inventory,
        mockDrills,
        personnel,
        rescueVictims,
        incidents,
        ifmsBills,
        auditLogs,
        addAuditLog,
        updateFarmerApplication,
        batchVerifyFarmers,
        addFarmerApplication,
        updateDemand,
        createDemand,
        addCattleCamp,
        updateCattleCamp,
        addFodderDepot,
        updateFodderDepot,
        addProcurement,
        updateProcurement,
        updateInventoryStock,
        addInventoryItem,
        updateMockDrill,
        addMockDrill,
        updatePersonnel,
        deployPersonnel,
        addRescueVictim,
        updateRescueVictim,
        addIncident,
        updateIncident,
        updateIFMSBill,
        addIfmsBill,
        updateInventoryItem,
        fundAllotments,
        openAuditModal,
        closeAuditModal,
        auditModalOpen,
        currentAuditFilter,
        openESignModal,
        closeESignModal,
        eSignModalState,
        openDocViewer,
        closeDocViewer,
        docViewerState,
      }}
    >
      {children}
    </DMISContext.Provider>
  );
};

export const useDMIS = () => {
  const context = useContext(DMISContext);
  if (!context) throw new Error('useDMIS must be used within a DMISProvider');
  return context;
};
