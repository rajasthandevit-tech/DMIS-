import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import {
  Users,
  ShieldCheck,
  Milk,
  FileText,
  Flame,
  Search,
  CheckCircle2,
  PhoneCall,
  MapPin,
  Calendar,
  Upload,
  AlertCircle,
  HelpCircle,
  Building,
} from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const {
    language,
    districts,
    cattleCamps,
    addCattleCamp,
    addFodderDepot,
    farmerApplications,
    addFarmerApplication,
    addIncident,
  } = useDMIS();

  const [activeTab, setActiveTab] = useState<'home' | 'cattle-camp' | 'fodder-depot' | 'other-relief' | 'report-incident' | 'track-status'>('home');
  const [successModal, setSuccessModal] = useState<{ isOpen: boolean; title: string; refNo: string } | null>(null);

  // Track status state
  const [trackQuery, setTrackQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any | null>(null);

  // Cattle camp form state
  const [campForm, setCampForm] = useState({
    campName: '',
    operatorType: 'GP' as const,
    organizationName: '',
    district: 'Jaipur',
    tehsil: 'Chomu',
    village: 'Rampura',
    gramPanchayat: 'Rampura GP',
    largeAnimals: 80,
    smallAnimals: 20,
    waterArrangement: true,
    shadeArrangement: true,
    fencingAvailable: true,
    veterinaryDoctorAssigned: 'Dr. Ramesh Sharma, Veterinary Officer',
    bankName: 'State Bank of India',
    accountNo: '34567890123',
    ifsc: 'SBIN0001234',
    responsiblePersonName: 'Mohan Lal Sharma',
    contactNumber: '9829012345',
  });

  // Fodder depot form state
  const [depotForm, setDepotForm] = useState({
    depotName: '',
    operatorType: 'Cooperative' as const,
    organizationName: '',
    district: 'Jaisalmer',
    tehsil: 'Sam',
    village: 'Dhanana',
    openingBalanceQuintals: 300,
    contactPerson: 'Suresh Kumar',
    mobileNo: '9828445566',
    bankName: 'Bank of India',
    accountNo: '660410110003261',
    ifsc: 'BKID0000604',
  });

  // Other relief form state
  const [reliefForm, setReliefForm] = useState({
    janAadhaar: '123456789012',
    name: 'Radheshyam Meena',
    mobile: '9414556677',
    district: 'Kota',
    tehsil: 'Ladpura',
    village: 'Gondi Phal',
    reliefCategory: 'House Damage Assistance',
    calamityType: 'Flood',
    lossDescription: 'Pucca boundary wall and tin roof damaged due to flood waters.',
    requestedAmount: 25000,
    bankName: 'State Bank of India',
    accountNo: '334455667788',
    ifsc: 'SBIN0001456',
  });

  // Report incident form state
  const [incidentForm, setIncidentForm] = useState({
    type: 'Flood' as const,
    district: 'Kota',
    tehsil: 'Ladpura',
    locality: 'Riverfront Basti',
    callerName: 'Sarpanch Ratan Lal',
    callerContact: '9829001122',
    severity: 'High' as const,
    description: 'Chambal water entered 15 homes after heavy gate opening.',
  });

  const handleCattleCampSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regNo = `PCC/JAI/2025/${Math.floor(1000 + Math.random() * 9000)}`;
    addCattleCamp({
      campName: campForm.campName || 'Adarsh Pashu Rahat Shivir',
      registrationNo: regNo,
      operatorType: campForm.operatorType,
      organizationName: campForm.organizationName || campForm.responsiblePersonName,
      district: campForm.district,
      tehsil: campForm.tehsil,
      village: campForm.village,
      gramPanchayat: campForm.gramPanchayat,
      registeredDate: new Date().toISOString().split('T')[0],
      largeAnimals: Number(campForm.largeAnimals),
      smallAnimals: Number(campForm.smallAnimals),
      totalAnimals: Number(campForm.largeAnimals) + Number(campForm.smallAnimals),
      dailyFodderReqQuintal: Math.round(((Number(campForm.largeAnimals) * 10) + (Number(campForm.smallAnimals) * 5)) / 100),
      waterArrangement: campForm.waterArrangement,
      shadeArrangement: campForm.shadeArrangement,
      fencingAvailable: campForm.fencingAvailable,
      veterinaryDoctorAssigned: campForm.veterinaryDoctorAssigned,
      status: 'Applied',
      bankName: campForm.bankName,
      accountNoMasked: `XXXX-XXXX-${campForm.accountNo.slice(-4)}`,
      ifscCode: campForm.ifsc,
    });
    setSuccessModal({
      isOpen: true,
      title: 'Cattle Camp Registration Submitted!',
      refNo: regNo,
    });
  };

  const handleFodderDepotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regNo = `RJ/FOD/2025/${Math.floor(1000 + Math.random() * 9000)}`;
    addFodderDepot({
      depotName: depotForm.depotName || 'Gram Seva Fodder Depot',
      registrationNo: regNo,
      operatorType: depotForm.operatorType,
      organizationName: depotForm.organizationName || depotForm.contactPerson,
      district: depotForm.district,
      tehsil: depotForm.tehsil,
      village: depotForm.village,
      registeredDate: new Date().toISOString().split('T')[0],
      openingBalanceQuintals: Number(depotForm.openingBalanceQuintals),
      contactPerson: depotForm.contactPerson,
      mobileNo: depotForm.mobileNo,
      bankName: depotForm.bankName,
      accountNo: depotForm.accountNo,
      ifsc: depotForm.ifsc,
      status: 'Pending Verification',
    });
    setSuccessModal({
      isOpen: true,
      title: 'Fodder Depot Application Submitted!',
      refNo: regNo,
    });
  };

  const handleOtherReliefSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const regNo = `RA/2025-26/${Math.floor(20000 + Math.random() * 9000)}`;
    addFarmerApplication({
      id: `app-citizen-${Date.now()}`,
      applicationNo: regNo,
      beneficiary: {
        id: `ben-${Date.now()}`,
        janAadhaarFamilyId: reliefForm.janAadhaar,
        janAadhaarMemberId: '01',
        aadhaarVaultRef: 'XXXX-XXXX-8821',
        fullName: reliefForm.name,
        fatherSpouseName: 'Kalu Ram',
        gender: 'Male',
        dob: '1985-05-10',
        mobileNo: reliefForm.mobile,
        district: reliefForm.district,
        tehsil: reliefForm.tehsil,
        village: reliefForm.village,
        bankName: reliefForm.bankName,
        accountNoMasked: `XXXX-XXXX-${reliefForm.accountNo.slice(-4)}`,
        ifscCode: reliefForm.ifsc,
        isBankVerified: true,
      },
      calamityType: reliefForm.calamityType as any,
      season: 'Kharif 2024',
      farmerCategory: 'SMF',
      khasraNo: '188/1',
      totalAreaHa: 1.5,
      affectedAreaHa: 1.5,
      cropType: 'General Relief / House Damage',
      lossPercentage: 60,
      calculatedSubsidyAmount: reliefForm.requestedAmount,
      admissibleSubsidyAmount: reliefForm.requestedAmount,
      dataSource: 'ExcelFallback',
      status: 'SubmittedPatwari',
      submissionDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      remarks: reliefForm.lossDescription,
      attachments: [{ name: 'Jan_Aadhaar_Document.pdf', type: 'application/pdf', url: '#', verified: true, hash: 'sha256-4b82..' }],
    });
    setSuccessModal({
      isOpen: true,
      title: 'Relief Assistance Request Registered!',
      refNo: regNo,
    });
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const incNo = `INC-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    addIncident({
      incidentNo: incNo,
      type: incidentForm.type,
      district: incidentForm.district,
      tehsil: incidentForm.tehsil,
      locality: incidentForm.locality,
      geoCoordinates: { lat: 25.18, lng: 75.83 },
      reportedDate: new Date().toLocaleString('en-IN'),
      severity: incidentForm.severity,
      callerName: incidentForm.callerName,
      callerContact: incidentForm.callerContact,
      description: incidentForm.description,
      affectedPopulationEstimate: 500,
      affectedAreaHa: 150,
      assignedNodalOfficer: 'SEOC Incident Duty Officer',
      departmentsDeployed: ['Emergency Control Room'],
      status: 'Reported',
    });
    setSuccessModal({
      isOpen: true,
      title: 'Disaster Incident Logged in SEOC!',
      refNo: incNo,
    });
  };

  const handleTrackSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;

    // Search in applications or cattle camps
    const foundApp = farmerApplications.find(
      (a) =>
        a.applicationNo.toLowerCase().includes(trackQuery.toLowerCase()) ||
        a.beneficiary.janAadhaarFamilyId === trackQuery ||
        a.beneficiary.fullName.toLowerCase().includes(trackQuery.toLowerCase())
    );

    if (foundApp) {
      setSearchResult({
        type: 'Relief Assistance',
        refNo: foundApp.applicationNo,
        applicant: foundApp.beneficiary.fullName,
        scheme: foundApp.cropType,
        district: foundApp.beneficiary.district,
        amount: `₹ ${foundApp.admissibleSubsidyAmount.toLocaleString('en-IN')}`,
        status: foundApp.status,
        date: foundApp.submissionDate,
        remarks: foundApp.remarks || 'Under active administrative workflow processing.',
      });
      return;
    }

    const foundCamp = cattleCamps.find(
      (c) =>
        c.registrationNo.toLowerCase().includes(trackQuery.toLowerCase()) ||
        c.campName.toLowerCase().includes(trackQuery.toLowerCase())
    );

    if (foundCamp) {
      setSearchResult({
        type: 'Cattle Camp Registration',
        refNo: foundCamp.registrationNo,
        applicant: foundCamp.organizationName,
        scheme: `Cattle Camp (${foundCamp.totalAnimals} animals)`,
        district: foundCamp.district,
        amount: foundCamp.sanctionedAmount ? `₹ ${foundCamp.sanctionedAmount.toLocaleString('en-IN')}` : 'Under Sanction',
        status: foundCamp.status,
        date: foundCamp.registeredDate,
        remarks: `Assigned Vet: ${foundCamp.veterinaryDoctorAssigned}`,
      });
      return;
    }

    setSearchResult({ notFound: true });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Citizen Navigation Tabs */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'home' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{language === 'hi' ? 'नागरिक मुख्य पृष्ठ' : 'Citizen Home'}</span>
        </button>

        <button
          onClick={() => setActiveTab('cattle-camp')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'cattle-camp' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Milk className="w-4 h-4 text-amber-500" />
          <span>{language === 'hi' ? 'पशु शिविर पंजीकरण' : 'Cattle Camp Registration'}</span>
        </button>

        <button
          onClick={() => setActiveTab('fodder-depot')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'fodder-depot' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4 text-emerald-600" />
          <span>{language === 'hi' ? 'चारा डिपो पंजीकरण' : 'Fodder Depot Registration'}</span>
        </button>

        <button
          onClick={() => setActiveTab('other-relief')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'other-relief' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4 text-blue-600" />
          <span>{language === 'hi' ? 'राहत सहायता आवेदन' : 'Apply for Relief Assistance'}</span>
        </button>

        <button
          onClick={() => setActiveTab('report-incident')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'report-incident' ? 'bg-red-700 text-white shadow' : 'text-red-700 bg-red-50 hover:bg-red-100'
          }`}
        >
          <Flame className="w-4 h-4 text-red-500" />
          <span>{language === 'hi' ? 'आपदा घटना रिपोर्ट करें' : 'Report Incident to SEOC'}</span>
        </button>

        <button
          onClick={() => setActiveTab('track-status')}
          className={`px-3.5 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'track-status' ? 'bg-[#1A365D] text-white shadow' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Search className="w-4 h-4 text-amber-500" />
          <span>{language === 'hi' ? 'आवेदन स्थिति ट्रैक करें' : 'Track Application Status'}</span>
        </button>
      </div>

      {/* 1. HOME VIEW */}
      {activeTab === 'home' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Hero Banner with Rajasthan Gov Theme */}
          <div className="bg-gradient-to-r from-[#1A365D] via-[#1e4273] to-[#254f8a] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="max-w-2xl relative z-10 space-y-2.5">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Prepared for Disasters. Ready to Respond.</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
                {language === 'hi'
                  ? 'आपदा प्रबंधन, सहायता एवं नागरिक सुरक्षा विभाग'
                  : 'Disaster Management, Relief & Civil Defence Department'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                Single integrated digital window for disaster mitigation, cattle camp sanctions, direct financial assistance, emergency rescue coordination, and transparent relief disbursal across Rajasthan.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('other-relief')}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer shadow"
                >
                  {language === 'hi' ? 'राहत आवेदन प्रस्तुत करें' : 'Apply for Relief Assistance'}
                </button>
                <button
                  onClick={() => setActiveTab('track-status')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                >
                  {language === 'hi' ? 'स्थिति जांचें (Status Track)' : 'Check Application Status'}
                </button>
              </div>
            </div>

            {/* Subtle background graphic */}
            <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
              <ShieldCheck className="w-80 h-80 text-white" />
            </div>
          </div>

          {/* Quick Stats Telemetry (as on pages 72 & 89) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-2xl font-black text-[#1A365D]">33</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Districts Covered</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-2xl font-black text-amber-600">1,240</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Relief & Cattle Camps</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-2xl font-black text-emerald-600">18,506</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Relief Beneficiaries</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <p className="text-2xl font-black text-blue-600">24x7</p>
              <p className="text-xs text-slate-500 font-semibold mt-1">Emergency Operations</p>
            </div>
          </div>

          {/* Citizen Services Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div
              onClick={() => setActiveTab('cattle-camp')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-amber-400 hover:shadow-md transition cursor-pointer space-y-2.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Milk className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Cattle Camp Registration</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Gram Panchayats, Goshalas, and NGOs can register cattle camps online with animal capacity and fodder demands.
              </p>
              <span className="inline-block text-xs font-bold text-amber-600 group-hover:underline">
                Register Camp →
              </span>
            </div>

            <div
              onClick={() => setActiveTab('fodder-depot')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-emerald-400 hover:shadow-md transition cursor-pointer space-y-2.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Fodder Depot Registration</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Cooperative societies and local bodies can register subsidized fodder supply depots with banking particulars.
              </p>
              <span className="inline-block text-xs font-bold text-emerald-600 group-hover:underline">
                Apply for Depot →
              </span>
            </div>

            <div
              onClick={() => setActiveTab('other-relief')}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 hover:shadow-md transition cursor-pointer space-y-2.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Gratuitous & Housing Relief</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Financial compensation for damaged houses (pucca/kuccha), loss of livestock, artisans, and family gratuitous assistance.
              </p>
              <span className="inline-block text-xs font-bold text-blue-600 group-hover:underline">
                Submit Claim →
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 2. CATTLE CAMP REGISTRATION FORM (Pages 74-76) */}
      {activeTab === 'cattle-camp' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <Milk className="w-5 h-5 text-amber-500" />
              <span>Cattle Camp Registration - Applicant & Camp Details</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Submit proposal for sanction of Cattle Camp under SDRF norms. Verification will be performed on spot by Tehsildar.
            </p>
          </div>

          <form onSubmit={handleCattleCampSubmit} className="space-y-5 text-xs">
            {/* Camp Basics */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">1. Camp Information</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Name of the Cattle Camp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={campForm.campName}
                    onChange={(e) => setCampForm({ ...campForm, campName: e.target.value })}
                    placeholder="e.g. Pashu Rahat Shivir Jaitpura"
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Operator Type</label>
                  <select
                    value={campForm.operatorType}
                    onChange={(e) => setCampForm({ ...campForm, operatorType: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="GP">Gram Panchayat (GP)</option>
                    <option value="NGO">Registered NGO</option>
                    <option value="Trust">Goshala Trust</option>
                    <option value="Society">Cooperative Society</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Administrative Location */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">2. Proposed Location</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District</label>
                  <select
                    value={campForm.district}
                    onChange={(e) => setCampForm({ ...campForm, district: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {districts.map((d) => (
                      <option key={d.code} value={d.name}>
                        {d.name} ({d.nameHi})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tehsil</label>
                  <input
                    type="text"
                    value={campForm.tehsil}
                    onChange={(e) => setCampForm({ ...campForm, tehsil: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Village / Gram Panchayat</label>
                  <input
                    type="text"
                    value={campForm.village}
                    onChange={(e) => setCampForm({ ...campForm, village: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Animal Strength & Facilities */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">3. Animal Capacity & Facilities</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Large Animals (Cows/Buffaloes)</label>
                  <input
                    type="number"
                    min="0"
                    value={campForm.largeAnimals}
                    onChange={(e) => setCampForm({ ...campForm, largeAnimals: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Small Animals (Calves/Goats)</label>
                  <input
                    type="number"
                    min="0"
                    value={campForm.smallAnimals}
                    onChange={(e) => setCampForm({ ...campForm, smallAnimals: Number(e.target.value) })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Capacity</label>
                  <input
                    type="text"
                    readOnly
                    value={`${Number(campForm.largeAnimals) + Number(campForm.smallAnimals)} Animals`}
                    className="w-full p-2 border border-slate-200 rounded-lg bg-slate-100 font-black text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campForm.waterArrangement}
                    onChange={(e) => setCampForm({ ...campForm, waterArrangement: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>Drinking Water Tank Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campForm.shadeArrangement}
                    onChange={(e) => setCampForm({ ...campForm, shadeArrangement: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>Proper Shade / Shed Available</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={campForm.fencingAvailable}
                    onChange={(e) => setCampForm({ ...campForm, fencingAvailable: e.target.checked })}
                    className="rounded text-blue-600 w-4 h-4"
                  />
                  <span>Security Fencing Installed</span>
                </label>
              </div>
            </div>

            {/* Banking Details */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">4. Bank & DBT Particulars</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                  <input
                    type="text"
                    value={campForm.bankName}
                    onChange={(e) => setCampForm({ ...campForm, bankName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                  <input
                    type="password"
                    value={campForm.accountNo}
                    onChange={(e) => setCampForm({ ...campForm, accountNo: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={campForm.ifsc}
                    onChange={(e) => setCampForm({ ...campForm, ifsc: e.target.value.toUpperCase() })}
                    className="w-full p-2 border border-slate-300 rounded-lg bg-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                id="cattle-camp-submit-btn"
                className="px-6 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-lg transition shadow-md cursor-pointer"
              >
                Submit Camp Proposal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. FODDER DEPOT FORM */}
      {activeTab === 'fodder-depot' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Fodder Depot Registration (चारा डिपो पंजीकरण)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Apply for authorized drought/disaster fodder depot sanction and subsidy allotment.
            </p>
          </div>

          <form onSubmit={handleFodderDepotSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Name of Fodder Depot *</label>
                <input
                  type="text"
                  required
                  value={depotForm.depotName}
                  onChange={(e) => setDepotForm({ ...depotForm, depotName: e.target.value })}
                  placeholder="e.g. Sam Cooperative Fodder Center"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Organization / Contact Person *</label>
                <input
                  type="text"
                  required
                  value={depotForm.contactPerson}
                  onChange={(e) => setDepotForm({ ...depotForm, contactPerson: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <select
                  value={depotForm.district}
                  onChange={(e) => setDepotForm({ ...depotForm, district: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {districts.map((d) => (
                    <option key={d.code} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Tehsil</label>
                <input
                  type="text"
                  value={depotForm.tehsil}
                  onChange={(e) => setDepotForm({ ...depotForm, tehsil: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Opening Stock (Quintals)</label>
                <input
                  type="number"
                  value={depotForm.openingBalanceQuintals}
                  onChange={(e) => setDepotForm({ ...depotForm, openingBalanceQuintals: Number(e.target.value) })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  value={depotForm.bankName}
                  onChange={(e) => setDepotForm({ ...depotForm, bankName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Account No</label>
                <input
                  type="text"
                  value={depotForm.accountNo}
                  onChange={(e) => setDepotForm({ ...depotForm, accountNo: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  value={depotForm.ifsc}
                  onChange={(e) => setDepotForm({ ...depotForm, ifsc: e.target.value.toUpperCase() })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                className="px-6 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition shadow cursor-pointer"
              >
                Register Fodder Depot
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 4. OTHER RELIEF ASSISTANCE APPLICATION (Pages 82, 91-92) */}
      {activeTab === 'other-relief' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Apply for Relief Assistance (राहत सहायता आवेदन)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Integrated with Jan Aadhaar & e-Dharti for instant verification and direct bank transfer.
            </p>
          </div>

          <form onSubmit={handleOtherReliefSubmit} className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <label className="block font-bold text-blue-900 mb-1">Jan Aadhaar Family ID *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    maxLength={12}
                    value={reliefForm.janAadhaar}
                    onChange={(e) => setReliefForm({ ...reliefForm, janAadhaar: e.target.value })}
                    className="p-2 border border-blue-300 rounded-lg bg-white font-mono font-bold"
                  />
                  <button
                    type="button"
                    onClick={() => alert('Jan Aadhaar verified! Family Head: Radheshyam Meena (Member 01), Bank: SBI (Masked: XXXX-8821)')}
                    className="px-3 py-2 bg-blue-800 text-white rounded-lg font-semibold hover:bg-blue-900 transition cursor-pointer"
                  >
                    Verify Jan Aadhaar
                  </button>
                </div>
              </div>
              <div className="text-[11px] text-blue-800">
                <span className="font-semibold text-emerald-700">✓ Jan Aadhaar Web Service Active</span>
                <p>Aadhaar Vault tokens used exclusively.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Applicant Name</label>
                <input
                  type="text"
                  value={reliefForm.name}
                  onChange={(e) => setReliefForm({ ...reliefForm, name: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile Number</label>
                <input
                  type="text"
                  value={reliefForm.mobile}
                  onChange={(e) => setReliefForm({ ...reliefForm, mobile: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">District</label>
                <select
                  value={reliefForm.district}
                  onChange={(e) => setReliefForm({ ...reliefForm, district: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {districts.map((d) => (
                    <option key={d.code} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Relief Category</label>
                <select
                  value={reliefForm.reliefCategory}
                  onChange={(e) => setReliefForm({ ...reliefForm, reliefCategory: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="House Damage Assistance">House Damage Assistance (मकान क्षति)</option>
                  <option value="Gratuitous Relief">Gratuitous Relief (अग्रिम अनुग्रह सहायता)</option>
                  <option value="Livestock Loss Assistance">Livestock Loss (पशु हानि सहायता)</option>
                  <option value="Artisan Equipment Loss">Artisan / Handloom Equipment (दस्तकार सहायता)</option>
                  <option value="Fishery Assistance">Fishery / Boat Loss (मत्स्य पालन सहायता)</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Calamity Type</label>
                <select
                  value={reliefForm.calamityType}
                  onChange={(e) => setReliefForm({ ...reliefForm, calamityType: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Flood">Flood (बाढ़)</option>
                  <option value="Hailstorm">Hailstorm (ओलावृष्टि)</option>
                  <option value="Heavy Rain">Heavy Rain (अतिवृष्टि)</option>
                  <option value="Drought">Drought (सूखा)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Loss Description & Incident Details</label>
              <textarea
                rows={3}
                value={reliefForm.lossDescription}
                onChange={(e) => setReliefForm({ ...reliefForm, lossDescription: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                id="other-relief-submit-btn"
                className="px-6 py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-lg transition shadow cursor-pointer"
              >
                Submit Relief Application
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 5. REPORT INCIDENT TO SEOC (Page 246) */}
      {activeTab === 'report-incident' && (
        <div className="bg-white rounded-2xl border border-red-200 shadow-sm p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-red-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-red-700 flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-600" />
                <span>Report Disaster Incident to State Control Room (SEOC)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Citizen / NGO / Field user urgent reporting channel directly connected to SDRF & District Collectors.
              </p>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold bg-red-100 text-red-700 rounded-full border border-red-300">
              Priority Channel
            </span>
          </div>

          <form onSubmit={handleIncidentSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Disaster Type *</label>
                <select
                  value={incidentForm.type}
                  onChange={(e) => setIncidentForm({ ...incidentForm, type: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Flood">Flash Flood / River Overflow</option>
                  <option value="Dam Breach">Dam / Canal Breach</option>
                  <option value="Hailstorm">Severe Hailstorm</option>
                  <option value="Heavy Rain">Cloudburst / Inundation</option>
                  <option value="Fire">Wildfire / Industrial Fire</option>
                  <option value="Cyclone">Cyclone / Gale Winds</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">District *</label>
                <select
                  value={incidentForm.district}
                  onChange={(e) => setIncidentForm({ ...incidentForm, district: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  {districts.map((d) => (
                    <option key={d.code} value={d.name}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Severity Level</label>
                <select
                  value={incidentForm.severity}
                  onChange={(e) => setIncidentForm({ ...incidentForm, severity: e.target.value as any })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white font-bold"
                >
                  <option value="Critical">Critical (Immediate Rescue Needed)</option>
                  <option value="High">High (Severe Damage / Threat)</option>
                  <option value="Medium">Medium (Moderate Inundation)</option>
                  <option value="Low">Low (Watch / Advisory)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Caller / Informer Name *</label>
                <input
                  type="text"
                  required
                  value={incidentForm.callerName}
                  onChange={(e) => setIncidentForm({ ...incidentForm, callerName: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Mobile / Contact *</label>
                <input
                  type="text"
                  required
                  value={incidentForm.callerContact}
                  onChange={(e) => setIncidentForm({ ...incidentForm, callerContact: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Locality / Landmarks / GPS Location *</label>
              <input
                type="text"
                required
                value={incidentForm.locality}
                onChange={(e) => setIncidentForm({ ...incidentForm, locality: e.target.value })}
                placeholder="e.g. Near Barrage Bridge, Sector 2, Ladpura Basti"
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Incident Situation Description *</label>
              <textarea
                rows={3}
                required
                value={incidentForm.description}
                onChange={(e) => setIncidentForm({ ...incidentForm, description: e.target.value })}
                className="w-full p-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="submit"
                id="report-incident-btn"
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black rounded-lg transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Flame className="w-4 h-4" />
                <span>Submit Alert to SEOC (24x7)</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 6. TRACK APPLICATION STATUS (Pages 80, 81) */}
      {activeTab === 'track-status' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-3xl mx-auto space-y-6 animate-in fade-in">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-lg font-bold text-[#1A365D] flex items-center gap-2">
              <Search className="w-5 h-5 text-amber-500" />
              <span>Track Relief Application Status (आवेदन स्थिति खोज)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Search by Application Reference Number, Jan Aadhaar Family ID, or Beneficiary Name.
            </p>
          </div>

          <form onSubmit={handleTrackSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={trackQuery}
                onChange={(e) => setTrackQuery(e.target.value)}
                placeholder="Enter Application No (e.g. RA/2025-26/10001) or Jan Aadhaar (123456789012)..."
                className="w-full p-2.5 pl-9 border border-slate-300 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#1A365D] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition cursor-pointer"
            >
              Search
            </button>
          </form>

          {searchResult && (
            <div className="mt-4">
              {searchResult.notFound ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-xs text-center">
                  No record found matching the reference ID or Jan Aadhaar. Please recheck your digits.
                </div>
              ) : (
                <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-in fade-in">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">{searchResult.type}</span>
                      <span className="font-mono font-bold text-sm text-[#1A365D]">{searchResult.refNo}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      {searchResult.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <p className="text-slate-400 text-[10px]">Beneficiary / Operator</p>
                      <p className="font-bold text-slate-800">{searchResult.applicant}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">District / Scheme</p>
                      <p className="font-semibold text-slate-800">{searchResult.district}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Amount Sanctioned</p>
                      <p className="font-black text-emerald-700">{searchResult.amount}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-[10px]">Submitted Date</p>
                      <p className="font-mono text-slate-600">{searchResult.date}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                    <p className="font-semibold text-slate-900 mb-0.5">Workflow Remarks:</p>
                    <p className="italic text-slate-600">"{searchResult.remarks}"</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Success Modal (matches pages 77-79, 88) */}
      {successModal?.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl border border-emerald-300 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center animate-in zoom-in">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">Request Submitted Successfully!</h3>
              <p className="text-xs text-slate-500">
                {language === 'hi'
                  ? 'आपका अनुरोध सफलतापूर्वक दर्ज कर लिया गया है।'
                  : 'Your record has been transmitted into DMIS 2.0 workflow.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800">
              <p className="text-[10px] text-slate-400 uppercase font-sans">Reference / Proposal No.</p>
              <p className="font-black text-sm text-[#1A365D] mt-0.5">{successModal.refNo}</p>
            </div>

            <button
              onClick={() => {
                setSuccessModal(null);
                setActiveTab('home');
              }}
              className="w-full py-2 bg-[#1A365D] hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
