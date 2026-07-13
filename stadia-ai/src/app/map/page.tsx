'use client';

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import StatusChip from '@/components/StatusChip';
import styles from './page.module.css';

/* ──────────────────────────────────────
   Mock Data — Lusail Stadium, FIFA 2026
   ────────────────────────────────────── */

interface ZoneData {
  id: string;
  name: string;
  capacity: number;
  currentCrowd: number;
  densityColor: string;
  heatmapColor: string;
  nearestFacilities: { name: string; icon: string; eta: string }[];
  etaFromCurrent: string;
}

const zones: ZoneData[] = [
  {
    id: 'north',
    name: 'North Stand',
    capacity: 22000,
    currentCrowd: 19800,
    densityColor: 'rgba(239, 68, 68, 0.35)',
    heatmapColor: '#EF4444',
    nearestFacilities: [
      { name: 'Gate A', icon: '🚪', eta: '2 min' },
      { name: 'Food Court 1', icon: '🍔', eta: '4 min' },
      { name: 'Restroom N1', icon: '🚻', eta: '1 min' },
      { name: 'Medical Bay 1', icon: '🏥', eta: '3 min' },
    ],
    etaFromCurrent: '4 min',
  },
  {
    id: 'south',
    name: 'South Stand',
    capacity: 22000,
    currentCrowd: 14300,
    densityColor: 'rgba(245, 158, 11, 0.3)',
    heatmapColor: '#F59E0B',
    nearestFacilities: [
      { name: 'Gate E', icon: '🚪', eta: '2 min' },
      { name: 'Food Court 3', icon: '🍔', eta: '3 min' },
      { name: 'Restroom S1', icon: '🚻', eta: '2 min' },
      { name: 'Medical Bay 3', icon: '🏥', eta: '5 min' },
    ],
    etaFromCurrent: '6 min',
  },
  {
    id: 'east',
    name: 'East Stand',
    capacity: 18000,
    currentCrowd: 16200,
    densityColor: 'rgba(239, 68, 68, 0.25)',
    heatmapColor: '#F97316',
    nearestFacilities: [
      { name: 'Gate C', icon: '🚪', eta: '1 min' },
      { name: 'Food Court 2', icon: '🍔', eta: '5 min' },
      { name: 'Restroom E1', icon: '🚻', eta: '2 min' },
      { name: 'Medical Bay 2', icon: '🏥', eta: '4 min' },
    ],
    etaFromCurrent: '3 min',
  },
  {
    id: 'west',
    name: 'West Stand',
    capacity: 18000,
    currentCrowd: 9900,
    densityColor: 'rgba(34, 197, 94, 0.25)',
    heatmapColor: '#22C55E',
    nearestFacilities: [
      { name: 'Gate G', icon: '🚪', eta: '1 min' },
      { name: 'Food Court 4', icon: '🍔', eta: '2 min' },
      { name: 'Restroom W1', icon: '🚻', eta: '1 min' },
      { name: 'Medical Bay 4', icon: '🏥', eta: '6 min' },
    ],
    etaFromCurrent: '2 min',
  },
];

const gates = [
  { id: 'A', cx: 400, cy: 42 },
  { id: 'B', cx: 570, cy: 95 },
  { id: 'C', cx: 680, cy: 210 },
  { id: 'D', cx: 570, cy: 325 },
  { id: 'E', cx: 400, cy: 378 },
  { id: 'F', cx: 230, cy: 325 },
  { id: 'G', cx: 120, cy: 210 },
  { id: 'H', cx: 230, cy: 95 },
];

const foodCourts = [
  { id: 'fc1', cx: 310, cy: 85, label: 'Food Court 1' },
  { id: 'fc2', cx: 640, cy: 165, label: 'Food Court 2' },
  { id: 'fc3', cx: 490, cy: 340, label: 'Food Court 3' },
  { id: 'fc4', cx: 160, cy: 260, label: 'Food Court 4' },
];

const medicalStations = [
  { id: 'med1', cx: 490, cy: 85, label: 'Medical 1' },
  { id: 'med2', cx: 640, cy: 260, label: 'Medical 2' },
  { id: 'med3', cx: 310, cy: 340, label: 'Medical 3' },
  { id: 'med4', cx: 160, cy: 165, label: 'Medical 4' },
];

const restrooms = [
  { id: 'rr1', cx: 400, cy: 72 },
  { id: 'rr2', cx: 660, cy: 210 },
  { id: 'rr3', cx: 400, cy: 350 },
  { id: 'rr4', cx: 140, cy: 210 },
];

const parkingAreas = [
  { id: 'P1', x: 50, y: 10, w: 100, h: 40, label: 'Parking A' },
  { id: 'P2', x: 650, y: 10, w: 100, h: 40, label: 'Parking B' },
  { id: 'P3', x: 650, y: 370, w: 100, h: 40, label: 'Parking C' },
  { id: 'P4', x: 50, y: 370, w: 100, h: 40, label: 'Parking D' },
];

interface LegendItemData {
  id: string;
  label: string;
  icon: string;
  color: string;
}

const legendItems: LegendItemData[] = [
  { id: 'gates', label: 'Gates', icon: '🚪', color: '#3B82F6' },
  { id: 'seating', label: 'Seating Zones', icon: '💺', color: '#8B5CF6' },
  { id: 'food', label: 'Food Courts', icon: '🍔', color: '#F59E0B' },
  { id: 'restrooms', label: 'Restrooms', icon: '🚻', color: '#06B6D4' },
  { id: 'medical', label: 'Medical Stations', icon: '🏥', color: '#EF4444' },
  { id: 'accessibility', label: 'Accessibility', icon: '♿', color: '#22C55E' },
  { id: 'parking', label: 'Parking', icon: '🅿️', color: '#64748B' },
];

const etaBarData = [
  { icon: '🚪', label: 'Gate A', time: '3 min' },
  { icon: '🍔', label: 'Food Court', time: '5 min' },
  { icon: '🚻', label: 'Restrooms', time: '2 min' },
  { icon: '🏥', label: 'Medical', time: '4 min' },
];

/* ──────────────────────────────────────
   Page Component
   ────────────────────────────────────── */

export default function StadiumMapPage() {
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [heatmapOn, setHeatmapOn] = useState(false);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>({
    gates: true,
    seating: true,
    food: true,
    restrooms: true,
    medical: true,
    accessibility: true,
    parking: true,
  });
  const [animatedCrowds, setAnimatedCrowds] = useState<Record<string, number>>({});

  const toggleLayer = useCallback((id: string) => {
    setVisibleLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const handleZoneClick = useCallback((zone: ZoneData) => {
    setSelectedZone((prev) => (prev?.id === zone.id ? null : zone));
  }, []);

  /* Count-up animation for zone crowd numbers */
  useEffect(() => {
    if (!selectedZone) return;
    const target = selectedZone.currentCrowd;
    const duration = 800;
    const start = performance.now();
    let raf: number;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedCrowds((prev) => ({
        ...prev,
        [selectedZone.id]: Math.round(eased * target),
      }));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [selectedZone]);

  /* GSAP entrance animation */
  useEffect(() => {
    let ctx: unknown;
    (async () => {
      try {
        const gsap = (await import('gsap')).default;
        ctx = gsap.context(() => {
          gsap.from(`.${styles.mapContainer}`, {
            opacity: 0,
            y: 30,
            duration: 0.8,
            ease: 'power3.out',
          });
          gsap.from(`.${styles.sidebar} > *`, {
            opacity: 0,
            x: 20,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
            delay: 0.3,
          });
        });
      } catch {
        /* gsap optional */
      }
    })();
    return () => {
      if (ctx && typeof (ctx as { revert: () => void }).revert === 'function') {
        (ctx as { revert: () => void }).revert();
      }
    };
  }, []);

  const totalCapacity = 80000;
  const totalCrowd = zones.reduce((a, z) => a + z.currentCrowd, 0);
  const occupancyPct = Math.round((totalCrowd / totalCapacity) * 100);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container}>
          {/* ── Header ── */}
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Interactive Stadium Map</h1>
              <div className={styles.subtitle}>
                <span>Lusail Stadium — FIFA World Cup 2026</span>
                <StatusChip label="Live" status="success" pulse />
              </div>
            </div>
            <div className={styles.headerRight}>
              <StatusChip label={`${occupancyPct}% Occupied`} status={occupancyPct > 80 ? 'warning' : 'active'} />
            </div>
          </header>

          {/* ── Main Layout ── */}
          <div className={styles.mainLayout}>
            {/* ── Map Area ── */}
            <section className={styles.mapArea}>
              <div className={styles.mapContainer}>
                {/* Heatmap Toggle */}
                <div className={styles.heatmapToggle}>
                  <button
                    className={`${styles.heatmapBtn} ${heatmapOn ? styles.heatmapBtnActive : ''}`}
                    onClick={() => setHeatmapOn(!heatmapOn)}
                    aria-pressed={heatmapOn}
                    aria-label="Toggle crowd density heatmap"
                  >
                    <span className={styles.heatDot} />
                    {heatmapOn ? 'Heatmap ON' : 'Heatmap OFF'}
                  </button>
                </div>

                {/* Map Controls */}
                <div className={styles.mapControls}>
                  <button className={styles.controlBtn} aria-label="Zoom in" title="Zoom in">+</button>
                  <button className={styles.controlBtn} aria-label="Zoom out" title="Zoom out">−</button>
                  <button className={styles.controlBtn} aria-label="Reset view" title="Reset view">⟲</button>
                </div>

                {/* Stadium SVG */}
                <svg
                  className={styles.stadiumSvg}
                  viewBox="0 0 800 420"
                  xmlns="http://www.w3.org/2000/svg"
                  role="img"
                  aria-label="Bird's eye view of Lusail Stadium with interactive zones"
                >
                  <defs>
                    <linearGradient id="mapGrad" x1="0" y1="0" x2="800" y2="420" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.03" />
                      <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
                    </linearGradient>
                    <radialGradient id="heatNorth" cx="400" cy="120" r="120" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heatSouth" cx="400" cy="300" r="120" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heatEast" cx="560" cy="210" r="110" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heatWest" cx="240" cy="210" r="110" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
                    </radialGradient>
                    <clipPath id="stadiumClip">
                      <ellipse cx="400" cy="210" rx="280" ry="170" />
                    </clipPath>
                  </defs>

                  {/* Background grid */}
                  <rect width="800" height="420" fill="url(#mapGrad)" />
                  <g opacity="0.06">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <line key={`vl-${i}`} x1={i * 40} y1="0" x2={i * 40} y2="420" stroke="#fff" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: 11 }).map((_, i) => (
                      <line key={`hl-${i}`} x1="0" y1={i * 40} x2="800" y2={i * 40} stroke="#fff" strokeWidth="0.5" />
                    ))}
                  </g>

                  {/* Parking areas */}
                  {visibleLayers.parking &&
                    parkingAreas.map((p) => (
                      <g key={p.id}>
                        <rect
                          className={styles.parkingArea}
                          x={p.x}
                          y={p.y}
                          width={p.w}
                          height={p.h}
                        />
                        <text className={styles.parkingLabel} x={p.x + p.w / 2} y={p.y + p.h / 2}>
                          🅿️ {p.label}
                        </text>
                      </g>
                    ))}

                  {/* Stadium outline */}
                  <ellipse
                    className={styles.stadiumOutline}
                    cx="400"
                    cy="210"
                    rx="280"
                    ry="170"
                  />

                  {/* Seating zones */}
                  {visibleLayers.seating && (
                    <g clipPath="url(#stadiumClip)">
                      {/* North Stand — top */}
                      <path
                        d="M 200 100 Q 400 40 600 100 L 550 160 Q 400 110 250 160 Z"
                        className={`${styles.zoneSection} ${selectedZone?.id === 'north' ? styles.zoneSectionSelected : ''}`}
                        fill={zones[0].densityColor}
                        onClick={() => handleZoneClick(zones[0])}
                        role="button"
                        tabIndex={0}
                        aria-label="North Stand zone — 90% capacity"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleZoneClick(zones[0]); }}
                      />
                      <text className={styles.zoneLabel} x="400" y="105">North</text>
                      <text className={styles.zoneCapacity} x="400" y="120">90%</text>

                      {/* South Stand — bottom */}
                      <path
                        d="M 200 320 Q 400 380 600 320 L 550 260 Q 400 310 250 260 Z"
                        className={`${styles.zoneSection} ${selectedZone?.id === 'south' ? styles.zoneSectionSelected : ''}`}
                        fill={zones[1].densityColor}
                        onClick={() => handleZoneClick(zones[1])}
                        role="button"
                        tabIndex={0}
                        aria-label="South Stand zone — 65% capacity"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleZoneClick(zones[1]); }}
                      />
                      <text className={styles.zoneLabel} x="400" y="305">South</text>
                      <text className={styles.zoneCapacity} x="400" y="320">65%</text>

                      {/* East Stand — right */}
                      <path
                        d="M 600 100 Q 680 210 600 320 L 550 260 Q 610 210 550 160 Z"
                        className={`${styles.zoneSection} ${selectedZone?.id === 'east' ? styles.zoneSectionSelected : ''}`}
                        fill={zones[2].densityColor}
                        onClick={() => handleZoneClick(zones[2])}
                        role="button"
                        tabIndex={0}
                        aria-label="East Stand zone — 90% capacity"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleZoneClick(zones[2]); }}
                      />
                      <text className={styles.zoneLabel} x="605" y="205">East</text>
                      <text className={styles.zoneCapacity} x="605" y="220">90%</text>

                      {/* West Stand — left */}
                      <path
                        d="M 200 100 Q 120 210 200 320 L 250 260 Q 190 210 250 160 Z"
                        className={`${styles.zoneSection} ${selectedZone?.id === 'west' ? styles.zoneSectionSelected : ''}`}
                        fill={zones[3].densityColor}
                        onClick={() => handleZoneClick(zones[3])}
                        role="button"
                        tabIndex={0}
                        aria-label="West Stand zone — 55% capacity"
                        onKeyDown={(e) => { if (e.key === 'Enter') handleZoneClick(zones[3]); }}
                      />
                      <text className={styles.zoneLabel} x="195" y="205">West</text>
                      <text className={styles.zoneCapacity} x="195" y="220">55%</text>
                    </g>
                  )}

                  {/* Playing field */}
                  <rect
                    className={styles.field}
                    x="280"
                    y="155"
                    width="240"
                    height="110"
                    rx="4"
                  />
                  {/* Center line */}
                  <line className={styles.fieldLine} x1="400" y1="155" x2="400" y2="265" />
                  {/* Center circle */}
                  <circle className={styles.fieldCenterCircle} cx="400" cy="210" r="25" />
                  <circle className={styles.fieldCenterDot} cx="400" cy="210" r="3" />
                  {/* Penalty areas */}
                  <rect className={styles.fieldLine} x="280" y="180" width="40" height="60" />
                  <rect className={styles.fieldLine} x="480" y="180" width="40" height="60" />
                  {/* Goal areas */}
                  <rect className={styles.fieldLine} x="280" y="195" width="18" height="30" />
                  <rect className={styles.fieldLine} x="502" y="195" width="18" height="30" />

                  {/* Heatmap overlay */}
                  <g className={`${styles.heatmapOverlay} ${heatmapOn ? styles.heatmapVisible : ''}`} clipPath="url(#stadiumClip)">
                    <ellipse cx="400" cy="120" rx="140" ry="80" fill="url(#heatNorth)" />
                    <ellipse cx="400" cy="300" rx="140" ry="80" fill="url(#heatSouth)" />
                    <ellipse cx="560" cy="210" rx="80" ry="100" fill="url(#heatEast)" />
                    <ellipse cx="240" cy="210" rx="80" ry="100" fill="url(#heatWest)" />
                  </g>

                  {/* Gates */}
                  {visibleLayers.gates &&
                    gates.map((g) => (
                      <g key={g.id} className={styles.gateMarker}>
                        <circle className={styles.gateCircle} cx={g.cx} cy={g.cy} r="12" />
                        <text className={styles.gateLabel} x={g.cx} y={g.cy}>
                          {g.id}
                        </text>
                      </g>
                    ))}

                  {/* Food courts */}
                  {visibleLayers.food &&
                    foodCourts.map((f) => (
                      <g key={f.id} className={styles.facilityMarker}>
                        <circle className={styles.facilityBg} cx={f.cx} cy={f.cy} r="10" fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.5)" strokeWidth="1" />
                        <text className={styles.facilityIcon} x={f.cx} y={f.cy}>🍔</text>
                      </g>
                    ))}

                  {/* Medical stations */}
                  {visibleLayers.medical &&
                    medicalStations.map((m) => (
                      <g key={m.id} className={styles.facilityMarker}>
                        <circle className={styles.facilityBg} cx={m.cx} cy={m.cy} r="10" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" strokeWidth="1" />
                        <text className={styles.facilityIcon} x={m.cx} y={m.cy}>🏥</text>
                      </g>
                    ))}

                  {/* Restrooms */}
                  {visibleLayers.restrooms &&
                    restrooms.map((r) => (
                      <g key={r.id} className={styles.facilityMarker}>
                        <circle className={styles.facilityBg} cx={r.cx} cy={r.cy} r="10" fill="rgba(6,182,212,0.2)" stroke="rgba(6,182,212,0.5)" strokeWidth="1" />
                        <text className={styles.facilityIcon} x={r.cx} y={r.cy}>🚻</text>
                      </g>
                    ))}

                  {/* Accessibility markers */}
                  {visibleLayers.accessibility && (
                    <>
                      <g className={styles.facilityMarker}>
                        <circle className={styles.facilityBg} cx={310} cy={165} r="9" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)" strokeWidth="1" />
                        <text className={styles.facilityIcon} x={310} y={165} fontSize="11">♿</text>
                      </g>
                      <g className={styles.facilityMarker}>
                        <circle className={styles.facilityBg} cx={490} cy={260} r="9" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)" strokeWidth="1" />
                        <text className={styles.facilityIcon} x={490} y={260} fontSize="11">♿</text>
                      </g>
                      <g className={styles.facilityMarker}>
                        <circle className={styles.facilityBg} cx={310} cy={260} r="9" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)" strokeWidth="1" />
                        <text className={styles.facilityIcon} x={310} y={260} fontSize="11">♿</text>
                      </g>
                      <g className={styles.facilityMarker}>
                        <circle className={styles.facilityBg} cx={490} cy={165} r="9" fill="rgba(34,197,94,0.2)" stroke="rgba(34,197,94,0.5)" strokeWidth="1" />
                        <text className={styles.facilityIcon} x={490} y={165} fontSize="11">♿</text>
                      </g>
                    </>
                  )}
                </svg>

                {/* Compass */}
                <div className={styles.compass} aria-hidden="true">
                  <span className={styles.compassN}>N</span>
                </div>

                {/* Stadium info badge */}
                <div className={styles.stadiumInfoBadge}>
                  <span className={styles.stadiumInfoText}>Total Occupancy</span>
                  <span className={styles.stadiumInfoValue}>
                    {totalCrowd.toLocaleString()} / {totalCapacity.toLocaleString()}
                  </span>
                </div>
              </div>
            </section>

            {/* ── Sidebar ── */}
            <aside className={styles.sidebar}>
              {/* Legend Panel */}
              <GlassCard padding="md">
                <h3 className={styles.legendTitle}>Map Legend</h3>
                <div className={styles.legendItems}>
                  {legendItems.map((item) => (
                    <div
                      key={item.id}
                      className={`${styles.legendItem} ${
                        visibleLayers[item.id] ? styles.legendItemActive : styles.legendItemInactive
                      }`}
                      onClick={() => toggleLayer(item.id)}
                      role="switch"
                      aria-checked={visibleLayers[item.id]}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleLayer(item.id); } }}
                    >
                      <span className={styles.legendIcon}>{item.icon}</span>
                      <span className={styles.legendLabel}>{item.label}</span>
                      <div
                        className={`${styles.legendToggle} ${
                          visibleLayers[item.id] ? styles.legendToggleActive : ''
                        }`}
                      />
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Zone Detail Panel */}
              {selectedZone && (
                <div className={styles.zoneDetailPanel}>
                  <GlassCard padding="md" variant="highlighted">
                    <div className={styles.zoneDetailHeader}>
                      <h3 className={styles.zoneDetailTitle}>{selectedZone.name}</h3>
                      <button
                        className={styles.zoneDetailClose}
                        onClick={() => setSelectedZone(null)}
                        aria-label="Close zone detail"
                      >
                        ✕
                      </button>
                    </div>

                    <div className={styles.zoneStats}>
                      <div className={styles.zoneStat}>
                        <div className={styles.zoneStatLabel}>Capacity</div>
                        <div className={styles.zoneStatValue}>
                          {Math.round((selectedZone.currentCrowd / selectedZone.capacity) * 100)}%
                        </div>
                      </div>
                      <div className={styles.zoneStat}>
                        <div className={styles.zoneStatLabel}>Crowd</div>
                        <div className={styles.zoneStatValue}>
                          {(animatedCrowds[selectedZone.id] ?? 0).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className={styles.capacityBar}>
                      <div
                        className={styles.capacityFill}
                        style={{
                          width: `${Math.round(
                            (selectedZone.currentCrowd / selectedZone.capacity) * 100
                          )}%`,
                          background:
                            selectedZone.currentCrowd / selectedZone.capacity > 0.8
                              ? 'linear-gradient(90deg, #F59E0B, #EF4444)'
                              : selectedZone.currentCrowd / selectedZone.capacity > 0.6
                              ? 'linear-gradient(90deg, #22C55E, #F59E0B)'
                              : 'linear-gradient(90deg, #22C55E, #06B6D4)',
                        }}
                      />
                    </div>

                    <div className={styles.facilitiesSection}>
                      <div className={styles.facilitiesTitle}>Nearest Facilities</div>
                      {selectedZone.nearestFacilities.map((f, i) => (
                        <div key={i} className={styles.facilityRow}>
                          <span className={styles.facilityRowLeft}>
                            <span>{f.icon}</span>
                            {f.name}
                          </span>
                          <span className={styles.facilityRowEta}>{f.eta}</span>
                        </div>
                      ))}
                    </div>

                    <div className={styles.etaSection}>
                      <div className={styles.etaLabel}>ETA from current location</div>
                      <div className={styles.etaValue}>{selectedZone.etaFromCurrent}</div>
                    </div>
                  </GlassCard>
                </div>
              )}
            </aside>
          </div>
        </div>

        {/* ── Live ETA Bar ── */}
        <nav className={styles.etaBar} aria-label="Live ETAs to key locations">
          <div className={styles.etaBarInner}>
            <span className={styles.etaBarTitle}>Live ETA</span>
            <div className={styles.etaBarItems}>
              {etaBarData.map((item, i) => (
                <div key={i} className={styles.etaBarItem}>
                  <span className={styles.etaBarItemIcon}>{item.icon}</span>
                  <span className={styles.etaBarItemLabel}>{item.label}</span>
                  <span className={styles.etaBarItemTime}>{item.time}</span>
                </div>
              ))}
            </div>
          </div>
        </nav>
      </main>
    </>
  );
}
