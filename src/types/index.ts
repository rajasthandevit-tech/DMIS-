export type UserRole =
  | 'Citizen'
  | 'Patwari'
  | 'Tehsildar'
  | 'ReliefOIC'
  | 'Collector'
  | 'DMRD_AO'
  | 'DMRD_FA'
  | 'DMRD_Secretary'
  | 'IFMS_DDO'
  | 'ProcurementOfficer'
  | 'WarehouseOfficer'
  | 'RescueCommander'
  | 'DrillCoordinator'
  | 'HROfficer'
  | 'SystemAdmin';

export type Language = 'en' | 'hi';

export interface District {
  id: number;
  code: string;
  name: string;
  nameHi: string;
  division: string;
  tehsils: Tehsil[];
}

export interface Tehsil {
  id: number;
  code: string;
  name: string;
  nameHi: string;
  districtId: number;
  villages: Village[];
}

export interface Village {
  id: number;
  code: string;
  name: string;
  nameHi: string;
  tehsilId: number;
  gramPanchayat: string;
  censusCode?: string;
  totalAreaHa: number;
  population: number;
}

export interface UserProfile {
  userId: string;
  ssoId: string;
  fullName: string;
  fullNameHi: string;
  email: string;
  mobileNo: string;
  designation: string;
  department: string;
  userType: UserRole;
  districtId?: number;
  tehsilId?: number;
  villageId?: number;
  districtName?: string;
  tehsilName?: string;
  villageName?: string;
  isActive: boolean;
  isAdditionalCharge?: boolean;
}

export type ApplicationWorkflowStatus =
  | 'Draft'
  | 'SubmittedPatwari'
  | 'VerifiedTehsildar'
  | 'ReturnedToPatwari'
  | 'ConsolidatedOIC'
  | 'ApprovedCollector'
  | 'SanctionedDMRD'
  | 'SentToTreasury'
  | 'Paid'
  | 'PaymentFailed'
  | 'Rejected';

export interface Beneficiary {
  id: string;
  janAadhaarFamilyId: string;
  janAadhaarMemberId: string;
  aadhaarVaultRef: string; // Masked e.g. XXXX-XXXX-9012
  fullName: string;
  fatherSpouseName: string;
  gender: 'Male' | 'Female' | 'Other';
  dob: string;
  mobileNo: string;
  district: string;
  tehsil: string;
  village: string;
  bankName: string;
  accountNoMasked: string;
  ifscCode: string;
  isBankVerified: boolean;
}

export interface FarmerApplication {
  id: string;
  applicationNo: string;
  beneficiary: Beneficiary;
  calamityType: 'Flood' | 'Drought' | 'Hailstorm' | 'Heavy Rain' | 'Cyclone';
  season: string; // e.g. 'Kharif 2024'
  farmerCategory: 'SMF' | 'OSMF'; // Small & Marginal or Other
  khasraNo: string;
  totalAreaHa: number;
  affectedAreaHa: number;
  cropType: string;
  lossPercentage: number;
  calculatedSubsidyAmount: number;
  admissibleSubsidyAmount: number;
  dataSource: 'eDharti' | 'Satellite' | 'ExcelFallback';
  status: ApplicationWorkflowStatus;
  submissionDate: string;
  lastUpdated: string;
  remarks?: string;
  rejectionReason?: string;
  verifiedByPatwari?: boolean;
  verifiedByTehsildar?: boolean;
  isDuplicateFlagged?: boolean;
  duplicateReason?: string;
  attachments: { name: string; type: string; url: string; verified: boolean; hash: string }[];
}

export interface ConsolidatedDemand {
  id: string;
  demandNo: string;
  district: string;
  districtId: number;
  season: string;
  calamity: string;
  type: 'Normal' | 'Direct' | 'Revised';
  totalFarmers: number;
  totalAreaHa: number;
  totalAmountCr: number;
  totalAmountInr: number;
  status: 'PreparedOIC' | 'CollectorSigned' | 'ForwardedDMRD' | 'AOVerified' | 'FARecommended' | 'SecretaryApproved' | 'BudgetAllocated' | 'Returned';
  submissionDate: string;
  collectorSignedDate?: string;
  collectorSignedBy?: string;
  eSignRef?: string;
  aoRemarks?: string;
  faRemarks?: string;
  secretaryRemarks?: string;
  budgetHead?: string;
  allotmentLetterNo?: string;
  allotmentAmountCr?: number;
}

export interface CattleCampRecord {
  id: string;
  campName: string;
  registrationNo: string;
  operatorType: 'GP' | 'NGO' | 'Trust' | 'Society';
  organizationName: string;
  district: string;
  tehsil: string;
  village: string;
  gramPanchayat: string;
  registeredDate: string;
  largeAnimals: number;
  smallAnimals: number;
  totalAnimals: number;
  dailyFodderReqQuintal: number;
  waterArrangement: boolean;
  shadeArrangement: boolean;
  fencingAvailable: boolean;
  veterinaryDoctorAssigned: string;
  inspectionDate?: string;
  inspectionEvidenceGeoTag?: string;
  status: 'Applied' | 'VerifiedTehsildar' | 'ApprovedCollector' | 'Active' | 'Closed' | 'Rejected' | 'Sanctioned';
  bankName: string;
  accountNoMasked: string;
  ifscCode: string;
  sanctionedAmount?: number;
  sanctionOrderNo?: string;
  sanctionDate?: string;
}

export type CattleCamp = CattleCampRecord;

export interface FodderDepotRecord {
  id: string;
  depotName: string;
  registrationNo: string;
  operatorType: 'GP' | 'Cooperative' | 'Private';
  organizationName: string;
  district: string;
  tehsil: string;
  village: string;
  registeredDate: string;
  openingBalanceQuintals: number;
  contactPerson: string;
  mobileNo: string;
  bankName: string;
  accountNo: string;
  ifsc: string;
  status: 'Pending Verification' | 'Approved' | 'Rejected';
}

export interface Quotation {
  id: string;
  vendorName: string;
  vendorGst: string;
  quotedAmount: number;
  isL1: boolean;
  technicalQualified: boolean;
  submissionDate: string;
}

export interface ProcurementProposal {
  id: string;
  proposalNo: string;
  title: string;
  category: string;
  district: string;
  department: string;
  estimatedCost: number;
  status: string;
  emergencyJustification: string;
  items: {
    itemName: string;
    quantity: number;
    unit: string;
    specifications: string;
  }[];
  quotations: Quotation[];
  poNumber?: string;
  poDate?: string;
  selectedVendor?: string;
  finalSanctionedAmount?: number;
  deliveryDate?: string;
  grnNo?: string;
  grnDate?: string;
  inspectionOfficer?: string;
  eSignRef?: string;
}

export interface EmergencyProcurementRequest {
  id: string;
  requestId: string;
  disasterEvent: string;
  district: string;
  tehsil: string;
  incidentDate: string;
  category: 'Equipment' | 'Shelter' | 'Food' | 'Medicine' | 'Safety' | string;
  itemName: string;
  unit: string;
  quantityRequested: number;
  estimatedCost: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Normal';
  deliveryLocation: string;
  requiredBy: string;
  justification: string;
  availableStockWarehouse: number;
  stockGap: number;
  procurementMethod: 'Direct Emergency Purchase' | 'Limited Quotation' | 'Empanelled Vendor' | 'GeM Procurement' | string;
  selectedVendor?: {
    code: string;
    name: string;
    gstin: string;
    contact: string;
    quotedRate: number;
  } | string;
  quotations: any[];
  poNumber?: string;
  poDate?: string;
  grnNumber?: string;
  grnDate?: string;
  quantityDelivered?: number;
  quantityAccepted?: number;
  qualityStatus?: 'Good' | 'Fair' | 'Rejected';
  invoiceNo?: string;
  utrNumber?: string;
  paymentStatus?: 'Pending' | 'Approved' | 'Paid';
  status: 'Submitted' | 'Inventory Checked' | 'Vendor Selected' | 'Approved' | 'PO Generated' | 'Delivered' | 'GRN Approved' | 'Closed' | string;
  // Alternative fields for flexibility
  proposalNo?: string;
  title?: string;
  department?: string;
  emergencyJustification?: string;
  items?: { itemName: string; quantity: number; unit: string; specifications: string }[];
  finalSanctionedAmount?: number;
}

export interface InventoryItem {
  id: string;
  itemCode: string;
  itemName: string;
  category: 'Equipment' | 'Shelter' | 'Food' | 'Medicine' | 'Safety' | 'General';
  unit: string;
  itemType: 'Consumable' | 'Non-Consumable';
  minStock: number;
  reorderLevel: number;
  totalStock: number;
  availableQty: number;
  reservedQty: number;
  inTransitQty: number;
  warehouse: string;
  batchNo: string;
  expiryDate?: string;
  unitCost: number;
  shelfLocation: string; // e.g., "Rack A-03, Bin 02"
  // Aliases for module convenience
  warehouseLocation?: string;
  quantityAvailable?: number;
  minThreshold?: number;
  status?: string;
}

export interface MockDrillPlan {
  id: string;
  drillTitle: string;
  drillType: 'Earthquake' | 'Flood' | 'Cyclone' | 'Fire' | 'Chemical Leakage' | 'Multi-Hazard' | string;
  severityLevel: 'Level 1 (Minor)' | 'Level 2 (District)' | 'Level 3 (Major State)' | string;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  district: string;
  venue: string;
  geoCoordinates: { lat: number; lng: number };
  objectives: string;
  expectedScenario: string;
  participatingAgencies: any[];
  raciMatrix?: {
    roleName: string;
    responsibleAgency: string;
    status: string;
  }[];
  resourcePlan?: {
    manpower: number;
    vehicles: number;
    equipment: number;
    rescueTeams: number;
  };
  milestones?: {
    seq: number;
    time: string;
    activity: string;
    team: string;
    status: 'Completed' | 'In Progress' | 'Pending';
  }[];
  scorecard?: {
    responseTimeScore: number;
    coordinationScore: number;
    medicalReadinessScore: number;
    overallScore: number;
    gapsIdentified: string[];
    correctiveActions: {
      action: string;
      officer: string;
      priority: 'High' | 'Medium' | 'Low';
      targetDate: string;
      status: 'Open' | 'In Progress' | 'Closed';
    }[];
  };
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Live Active' | 'Completed' | 'Cancelled' | 'Scheduled' | string;
  // Module aliases
  drillNo?: string;
  title?: string;
  scenario?: string;
  date?: string;
  leadAgency?: string;
  evaluationScore?: number;
  learningsDocUrl?: string;
  targetLocations?: string[];
}

export type MockDrill = MockDrillPlan;

export interface HRPersonnel {
  id: string;
  employeeId: string;
  fullName: string;
  designation: string;
  department: string;
  district: string;
  contact: string;
  email: string;
  status: 'Available' | 'Deployed' | 'On Leave' | 'Training' | 'Reserved' | string;
  skills: string[];
  capabilityRating: number; // 1-5
  experienceYears: number;
  currentDeployment?: {
    incidentId: string;
    role: string;
    location: string;
    reportingTime: string;
    expectedDuration: string;
    mobileCheckedIn: boolean;
    checkInTime?: string;
    checkInLocation?: string;
  };
  // Aliases for module convenience
  cadre?: string;
  deploymentStatus?: string;
  contactNumber?: string;
}

export type HRMPersonnel = HRPersonnel;

export interface RescueVictim {
  id: string;
  caseId: string;
  incidentId: string;
  category: 'Rescued' | 'Missing' | 'Injured' | 'Deceased' | 'Unidentified' | string;
  fullName?: string;
  approxAge: number;
  gender: 'Male' | 'Female' | 'Other';
  clothingDescription: string;
  distinguishingMarks: string;
  rescueLocation: string;
  rescueTime: string;
  hospitalAssigned?: string;
  wardNo?: string;
  medicalCondition?: 'Critical' | 'Stable' | 'Discharged' | string;
  verifiedFamilyContact?: string;
  potentialMatches?: {
    missingId: string;
    name: string;
    scorePct: number;
    verified: boolean;
  }[];
  belongingsSealed?: {
    item: string;
    quantity: number;
    status: 'Sealed' | 'Handed Over';
  }[];
  chainOfCustody?: {
    stage: string;
    officer: string;
    time: string;
  }[];
  status: 'Registered' | 'Match Found' | 'Identity Verified' | 'Transferred' | 'Reunified / Closed' | 'In Relief Camp' | string;
  // Aliases for module convenience
  identificationTag?: string;
  age?: number;
  district?: string;
  incidentLocation?: string;
  rescuedByTeam?: string;
  rescuedTimestamp?: string;
  currentLocation?: string;
  kinContact?: string;
}

export interface DisasterIncident {
  id: string;
  incidentNo?: string;
  title?: string;
  type?: 'Flood' | 'Heavy Rain' | 'Dam Breach' | 'Drought' | 'Fire' | 'Earthquake' | 'Cyclone' | 'Hailstorm' | string;
  disasterType?: 'Flood' | 'Heavy Rain' | 'Dam Breach' | 'Drought' | 'Fire' | 'Earthquake' | 'Cyclone' | 'Hailstorm' | string;
  district: string;
  tehsil: string;
  locality?: string;
  locationDescription?: string;
  geoCoordinates?: { lat: number; lng: number };
  latitude?: number;
  longitude?: number;
  reportedDate?: string;
  reportedTime?: string;
  reportedBy?: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | string;
  callerName?: string;
  callerContact?: string;
  description?: string;
  affectedPopulationEstimate?: number;
  affectedPopulationEst?: number;
  affectedAreaHa?: number;
  fatalities?: number;
  injured?: number;
  cattleLoss?: number;
  assignedNodalOfficer?: string;
  assignedTeam?: string;
  departmentsDeployed?: string[];
  status: 'Reported' | 'SEOC Verified' | 'Response Mobilized' | 'Containment in Progress' | 'Resolved / Closed' | 'Active' | 'Dispatched' | 'Controlled' | 'Closed' | string;
}

export type IncidentRecord = DisasterIncident;

export interface FundAllotment {
  id: string;
  headOfAccount: string;
  description: string;
  totalAllottedCr: number;
  expenditureCr: number;
  balanceCr: number;
}

export interface IFMSBill {
  id: string;
  billNo: string;
  sanctionNo: string;
  ddoCode: string;
  budgetHead: string;
  totalBeneficiaries: number;
  totalAmountInr: number;
  billDate: string;
  status: 'Bill Generated' | 'DDO Authorized' | 'Treasury Accepted' | 'DBT Processed' | 'Payment Failed' | 'Reconciled';
  utrReference?: string;
  failureCount: number;
  paidCount: number;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  entityType: string;
  entityId: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  performedBy: string;
  role: string;
  remarks: string;
  ipAddress?: string;
}
