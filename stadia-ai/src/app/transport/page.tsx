'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import KPIWidget from '@/components/KPIWidget';
import StatusChip from '@/components/StatusChip';
import styles from './page.module.css';

interface MetroLine {
  name: string;
  color: string;
  next: string;
  frequency: string;
  capacity: number;
}

interface ShuttleRoute {
  name: string;
  buses: number;
  next: string;
  progress: number;
}

interface ParkingLot {
  name: string;
  available: number;
  total: number;
  fillPercent: number;
  color: string;
}

const metroLines: MetroLine[] = [
  { name: 'Red Line (South)', color: '#EF4444', next: '3 min', frequency: '4 min freq', capacity: 78 },
  { name: 'Blue Line (North)', color: '#3B82F6', next: '6 min', frequency: '5 min freq', capacity: 65 },
  { name: 'Green Line (East)', color: '#22C55E', next: '1 min', frequency: '3 min freq', capacity: 92 },
  { name: 'Gold Line (West)', color: '#F59E0B', next: '8 min', frequency: '6 min freq', capacity: 45 },
];

const shuttleRoutes: ShuttleRoute[] = [
  { name: 'Stadium ↔ International Airport', buses: 4, next: '12 mins', progress: 40 },
  { name: 'Stadium ↔ Downtown Hub', buses: 6, next: '5 mins', progress: 80 },
  { name: 'Stadium ↔ Hotel District', buses: 3, next: '8 mins', progress: 60 },
];

const parkingLots: ParkingLot[] = [
  { name: 'Lot A (North)', available: 234, total: 1500, fillPercent: 85, color: '#EF4444' },
  { name: 'Lot B (East)', available: 567, total: 1500, fillPercent: 62, color: '#F59E0B' },
  { name: 'Lot C (South)', available: 1203, total: 1823, fillPercent: 34, color: '#22C55E' },
  { name: 'VIP Deck', available: 45, total: 500, fillPercent: 91, color: '#EF4444' },
];

export default function TransportationHubPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      containerRef.current
        ?.querySelectorAll(`.${styles.animateItem}`)
        .forEach((el) => {
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.transform = 'none';
        });
      return;
    }

    let ctx: ReturnType<typeof import('gsap')['default']['context']> | undefined;

    (async () => {
      const gsap = (await import('gsap')).default;
      ctx = gsap.context(() => {
        gsap.to(`.${styles.animateItem}`, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.1,
        });
      }, containerRef);
    })();

    return () => ctx?.revert();
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.page} ref={containerRef}>
        <div className={styles.container}>
          {/* Header */}
          <header className={`${styles.header} ${styles.animateItem}`}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Transportation Hub</h1>
              <p className={styles.subtitle}>Smart metro schedules, shuttle logs, and parking updates</p>
            </div>
            <div>
              <StatusChip label="Live Tracking" status="active" pulse />
            </div>
          </header>

          {/* KPIs */}
          <section className={`${styles.kpiGrid} ${styles.animateItem}`}>
            <KPIWidget label="Metro Capacity" value={73} icon="🚇" format="percent" color="primary" />
            <KPIWidget label="Shuttle ETA" value={8} suffix=" min" icon="🚌" color="secondary" />
            <KPIWidget label="Parking Available" value={2049} icon="🅿️" color="success" />
            <KPIWidget label="Avg Exit Time" value={35} suffix=" min" icon="⏱️" color="warning" />
          </section>

          {/* Main Grid */}
          <div className={styles.mainGrid}>
            {/* Left Column: Metro + Shuttle */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Metro Lines */}
              <div className={styles.animateItem}>
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Metro Line Timetable</h3>
                  <div className={styles.metroList}>
                    {metroLines.map((line) => (
                      <div key={line.name} className={styles.metroCard}>
                        <div
                          className={styles.metroLineIndicator}
                          style={{
                            backgroundColor: line.color,
                            boxShadow: `0 0 10px ${line.color}50`,
                          }}
                        />
                        <div className={styles.metroDetails}>
                          <span className={styles.metroLineName}>{line.name}</span>
                          <span className={styles.metroFrequency}>{line.frequency}</span>
                        </div>
                        <div className={styles.metroVitals}>
                          <div style={{ textAlign: 'right' }}>
                            <span className={styles.metroETA}>{line.next}</span>
                            <div className={styles.metroCap}>Cap: {line.capacity}%</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>

              {/* Shuttle Bus tracker */}
              <div className={styles.animateItem}>
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Express Shuttle Log</h3>
                  <div className={styles.shuttleList}>
                    {shuttleRoutes.map((shuttle) => (
                      <div key={shuttle.name} className={styles.shuttleItem}>
                        <div className={styles.shuttleHeader}>
                          <span className={styles.shuttleName}>{shuttle.name}</span>
                          <span className={styles.shuttleETA}>Next in {shuttle.next}</span>
                        </div>
                        <span className={styles.shuttleBuses}>🚍 {shuttle.buses} buses active on route</span>
                        <div className={styles.shuttleProgressBg}>
                          <div className={styles.shuttleProgressBar} style={{ width: `${shuttle.progress}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Right Column: Parking + Ride Share */}
            <div className={styles.animateItem}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* AI Route Recommendation */}
                <GlassCard variant="highlighted">
                  <div className={styles.aiRouteBox}>
                    <div className={styles.aiRouteIcon}>🤖</div>
                    <div className={styles.aiRouteContent}>
                      <h4 style={{ color: '#fff', margin: 0, fontSize: '0.95rem' }}>AI Route Recommendation</h4>
                      <p className={styles.aiRouteText}>
                        Based on current crowd flow, we recommend taking the Green Line from South Exit. Current wait is 1 min. Estimated travel to Downtown: 18 min.
                      </p>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'fit-content' }}>
                        View Directions
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* Parking Lots */}
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Parking Lot Occupancy</h3>
                  <div className={styles.parkingGrid}>
                    {parkingLots.map((lot) => (
                      <div key={lot.name} className={styles.parkingCard}>
                        <div className={styles.parkingHeader}>
                          <span className={styles.parkingName}>{lot.name}</span>
                          <span className={styles.parkingAvailable}>{lot.available} slots</span>
                        </div>
                        <div className={styles.parkingFillBar}>
                          <div
                            className={styles.parkingFillProgress}
                            style={{
                              width: `${lot.fillPercent}%`,
                              backgroundColor: lot.color,
                              boxShadow: `0 0 8px ${lot.color}40`,
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '0.75rem', alignSelf: 'flex-end', color: lot.color }}>
                          {lot.fillPercent}% full
                        </span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Ride Share zones */}
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Ride Share Pickups</h3>
                  <div className={styles.rideshareList}>
                    <div className={styles.rideshareItem}>
                      <span className={styles.rideshareZone}>Zone 1 (Gate A Side)</span>
                      <span className={styles.rideshareTime}>4m wait</span>
                      <span className={styles.rideshareSurge} style={{ color: '#22C55E' }}>1.0x surge</span>
                    </div>
                    <div className={styles.rideshareItem}>
                      <span className={styles.rideshareZone}>Zone 2 (Gate D Loop)</span>
                      <span className={styles.rideshareTime}>7m wait</span>
                      <span className={styles.rideshareSurge} style={{ color: '#F59E0B' }}>1.3x surge</span>
                    </div>
                    <div className={styles.rideshareItem}>
                      <span className={styles.rideshareZone}>Zone 3 (South Loop)</span>
                      <span className={styles.rideshareTime}>3m wait</span>
                      <span className={styles.rideshareSurge} style={{ color: '#22C55E' }}>1.0x surge</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
