import React, { useState } from 'react';
import { useDMIS } from '../../context/DMISContext';
import {
  Layers,
  MapPin,
  Flame,
  Milk,
  Boxes,
  Users,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Info,
} from 'lucide-react';

interface MapPoint {
  id: string;
  name: string;
  district: string;
  x: number; // percentage on SVG
  y: number;
  type: 'incident' | 'camp' | 'warehouse' | 'rescue' | 'team';
  status: string;
  details: string;
}

export const GISMapComponent: React.FC<{
  height?: string;
  selectedDistrict?: string;
  onSelectDistrict?: (dist: string) => void;
}> = ({ height = '500px', selectedDistrict, onSelectDistrict }) => {
  const { language, incidents, cattleCamps, inventory, personnel, rescueVictims, setActiveModule } = useDMIS();

  const [activeLayers, setActiveLayers] = useState<{
    incidents: boolean;
    camps: boolean;
    warehouses: boolean;
    rescue: boolean;
    teams: boolean;
  }>({
    incidents: true,
    camps: true,
    warehouses: true,
    rescue: true,
    teams: true,
  });

  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Rajasthan districts centroids mapped for SVG display
  const districtRegions = [
    { name: 'Jaipur', code: 'JPR', x: 58, y: 44, risk: 'Moderate Flood / Hail' },
    { name: 'Jodhpur', code: 'JDH', x: 38, y: 50, risk: 'Drought Vulnerable' },
    { name: 'Kota', code: 'KOT', x: 68, y: 72, risk: 'Critical Chambal Flood' },
    { name: 'Barmer', code: 'BRM', x: 22, y: 64, risk: 'Severe Drought / Flash Flood' },
    { name: 'Jaisalmer', code: 'JSL', x: 18, y: 42, risk: 'Extreme Heat & Drought' },
    { name: 'Bikaner', code: 'BKN', x: 38, y: 30, risk: 'Arid Storm Zone' },
    { name: 'Udaipur', code: 'UDP', x: 44, y: 78, risk: 'Hilly Flash Flooding' },
    { name: 'Ajmer', code: 'AJM', x: 52, y: 54, risk: 'Moderate Rainfall' },
    { name: 'Alwar', code: 'ALW', x: 67, y: 36, risk: 'Hailstorm Area' },
    { name: 'Nagaur', code: 'NAG', x: 45, y: 44, risk: 'Drought Area' },
    { name: 'Bundi', code: 'BND', x: 64, y: 66, risk: 'River Overflow' },
    { name: 'Baran', code: 'BRN', x: 76, y: 74, risk: 'Parbati Basin Flood' },
  ];

  // Dynamic point markers from context
  const points: MapPoint[] = [
    {
      id: 'p-inc-01',
      name: 'Kota Riverfront Chambal Overflow',
      district: 'Kota',
      x: 69,
      y: 73,
      type: 'incident',
      status: 'Critical Flood',
      details: '8,500 population affected; 4 SDRF rescue boats deployed.',
    },
    {
      id: 'p-inc-02',
      name: 'Chomu Hailstorm Damage Zone',
      district: 'Jaipur',
      x: 57,
      y: 42,
      type: 'incident',
      status: 'High Damage',
      details: 'Vegetable & pulses loss across 1,450 hectares.',
    },
    {
      id: 'p-camp-01',
      name: 'Pashu Rahat Shivir Jaitpura',
      district: 'Jaipur',
      x: 59,
      y: 43,
      type: 'camp',
      status: 'Active (120 Animals)',
      details: 'Daily fodder supply: 45 Quintals. Vet doctor assigned.',
    },
    {
      id: 'p-camp-02',
      name: 'Hinglaj Goshala Relief Camp',
      district: 'Jaisalmer',
      x: 19,
      y: 44,
      type: 'camp',
      status: 'Active (390 Animals)',
      details: '310 large cattle, water tankering operational.',
    },
    {
      id: 'p-wh-01',
      name: 'Jaipur Central Disaster Store',
      district: 'Jaipur',
      x: 58,
      y: 45,
      type: 'warehouse',
      status: 'Stock Available',
      details: 'Tarpaulins: 820 Nos, Pumps: 18 Nos, Blankets: 2,900.',
    },
    {
      id: 'p-wh-02',
      name: 'Kota District Relief Depot',
      district: 'Kota',
      x: 67,
      y: 71,
      type: 'warehouse',
      status: 'Buffer Stock',
      details: 'Life Jackets: 240 Nos, Boats: 6 Nos, Dewatering pumps: 8.',
    },
    {
      id: 'p-resc-01',
      name: 'SDRF Rescue Unit Chambal',
      district: 'Kota',
      x: 70,
      y: 72,
      type: 'rescue',
      status: '112 Rescued',
      details: 'Commandant R.K. Bishnoi unit active on water route.',
    },
  ];

  const toggleLayer = (layer: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
      {/* Map Control Bar */}
      <div className="bg-[#1A365D] text-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-amber-500">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-xs tracking-wide">
            {language === 'hi' ? 'राजधराा जीआईएस - आपदा मानचित्र एवं परतें' : 'Rajdharaa State GIS - Disaster Risk & Operations Map'}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600/80 text-white font-mono font-semibold">
            LIVE TELEMETRY
          </span>
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => toggleLayer('incidents')}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
              activeLayers.incidents ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Incidents ({incidents.length})</span>
          </button>

          <button
            onClick={() => toggleLayer('camps')}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
              activeLayers.camps ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Milk className="w-3 h-3" />
            <span>Cattle Camps ({cattleCamps.length})</span>
          </button>

          <button
            onClick={() => toggleLayer('warehouses')}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
              activeLayers.warehouses ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Boxes className="w-3 h-3" />
            <span>Warehouses (6)</span>
          </button>

          <button
            onClick={() => toggleLayer('rescue')}
            className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer ${
              activeLayers.rescue ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>Rescue Ops</span>
          </button>

          {/* Zoom controls */}
          <div className="flex items-center gap-0.5 ml-2 bg-slate-800 rounded p-0.5">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
              className="p-1 text-slate-300 hover:text-white transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
              className="p-1 text-slate-300 hover:text-white transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-300 hover:text-white transition cursor-pointer"
              title="Reset View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div
        className="relative bg-[#EBF2F7] overflow-hidden select-none"
        style={{ height }}
      >
        <div
          className="w-full h-full relative transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
        >
          {/* Stylized Rajasthan Polygon Map Representation */}
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#D3E2EE" strokeWidth="0.5" />
              </pattern>
              <linearGradient id="desertGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fde68a" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#fed7aa" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            <rect width="100" height="100" fill="url(#grid)" />

            {/* Rajasthan State Boundary Silhouette */}
            <path
              d="M 38 18 
                 L 48 16 
                 L 58 22 
                 L 68 28 
                 L 74 34 
                 L 72 45 
                 L 80 62 
                 L 76 80 
                 L 66 86 
                 L 54 84 
                 L 44 88 
                 L 36 82 
                 L 26 76 
                 L 14 62 
                 L 8 46 
                 L 18 34 
                 L 30 24 Z"
              fill="url(#desertGrad)"
              stroke="#0F233C"
              strokeWidth="0.8"
              strokeLinejoin="round"
              className="drop-shadow-md"
            />

            {/* River Chambal Path Indicator */}
            <path
              d="M 52 84 Q 65 78 72 66 T 82 54"
              fill="none"
              stroke="#0284c7"
              strokeWidth="1.2"
              strokeDasharray="2,1"
            />

            {/* District centroids and borders representation */}
            {districtRegions.map((dist) => {
              const isSelected = selectedDistrict === dist.name;
              return (
                <g
                  key={dist.code}
                  className="cursor-pointer group"
                  onClick={() => onSelectDistrict && onSelectDistrict(dist.name)}
                >
                  <circle
                    cx={dist.x}
                    cy={dist.y}
                    r={isSelected ? 4.5 : 3.2}
                    fill={isSelected ? '#D97706' : '#1E3A8A'}
                    fillOpacity="0.85"
                    stroke="#FFFFFF"
                    strokeWidth="0.6"
                    className="transition-all hover:scale-125"
                  />
                  <text
                    x={dist.x}
                    y={dist.y - 4}
                    textAnchor="middle"
                    fontSize="2.8"
                    fontWeight="700"
                    fill="#0F172A"
                    className="select-none pointer-events-none drop-shadow-xs"
                  >
                    {dist.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Dynamic Map Point Markers Overlay */}
          {points.map((pt) => {
            const isVisible =
              (pt.type === 'incident' && activeLayers.incidents) ||
              (pt.type === 'camp' && activeLayers.camps) ||
              (pt.type === 'warehouse' && activeLayers.warehouses) ||
              (pt.type === 'rescue' && activeLayers.rescue);

            if (!isVisible) return null;

            return (
              <div
                key={pt.id}
                onClick={() => setSelectedPoint(pt)}
                style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 hover:scale-125 transition-transform"
              >
                {pt.type === 'incident' && (
                  <div className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white animate-bounce">
                    <Flame className="w-3 h-3" />
                  </div>
                )}
                {pt.type === 'camp' && (
                  <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white">
                    <Milk className="w-3 h-3" />
                  </div>
                )}
                {pt.type === 'warehouse' && (
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white">
                    <Boxes className="w-3 h-3" />
                  </div>
                )}
                {pt.type === 'rescue' && (
                  <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg ring-2 ring-white">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Selected Marker Detail Card */}
        {selectedPoint && (
          <div className="absolute bottom-4 left-4 max-w-xs bg-white rounded-xl shadow-xl border border-slate-200 p-3.5 z-20 text-xs animate-in slide-in-from-bottom-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900 text-sm block">{selectedPoint.name}</span>
                <span className="text-[11px] text-blue-700 font-semibold">{selectedPoint.district} District</span>
              </div>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <p className="font-semibold text-slate-800">Status: {selectedPoint.status}</p>
              <p className="text-[11px] text-slate-600">{selectedPoint.details}</p>
            </div>
            <div className="mt-2.5 flex items-center justify-end gap-1.5">
              <button
                onClick={() => {
                  if (selectedPoint.type === 'incident') setActiveModule('incident-seoc');
                  if (selectedPoint.type === 'camp') setActiveModule('cattle-fodder');
                  if (selectedPoint.type === 'warehouse') setActiveModule('inventory');
                  if (selectedPoint.type === 'rescue') setActiveModule('rescue-victim');
                }}
                className="px-2.5 py-1 bg-[#1A365D] text-white rounded text-[11px] font-semibold hover:bg-slate-800 transition cursor-pointer"
              >
                Open in Module
              </button>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-lg shadow-md border border-slate-200 text-[11px] space-y-1 z-10">
          <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider mb-1">
            Rajdharaa Map Legend
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span>Active Disaster Incident</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Cattle Camp / Fodder Depot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Relief Warehouse / Store</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
            <span>SDRF Rescue Unit Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
