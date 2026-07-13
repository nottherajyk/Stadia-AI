'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import KPIWidget from '@/components/KPIWidget';
import ProgressRing from '@/components/ProgressRing';
import StatusChip from '@/components/StatusChip';
import styles from './page.module.css';

interface EnergyStat {
  label: string;
  value: string;
}

interface Suggestion {
  id: string;
  title: string;
  desc: string;
  savings: string;
}

const energyStats: EnergyStat[] = [
  { label: 'Total Grid Consumption', value: '1.6 MW' },
  { label: 'Solar Panel Generation', value: '0.8 MW' },
  { label: 'HVAC Consumption', value: '1.0 MW' },
  { label: 'Stadium Floodlights', value: '0.8 MW' },
  { label: 'Concession / Displays', value: '0.6 MW' },
];

const initialSuggestions: Suggestion[] = [
  { id: '1', title: 'Reduce HVAC in Sections 200-204', desc: 'Low occupancy zone during current match phase.', savings: 'Save 12% energy' },
  { id: '2', title: 'Switch to Eco-LED mode in Lot C', desc: 'Slightly dim lighting levels in empty parking sectors.', savings: 'Save 340 kWh' },
  { id: '3', title: 'Activate rain water greywater recycling', desc: 'Optimize HVAC cooler tower water intake.', savings: 'Save 2,000L water' },
];

export default function SustainabilityDashboardPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>(initialSuggestions);
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

  const handleApply = (id: string) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className={styles.page} ref={containerRef}>
        <div className={styles.container}>
          {/* Header */}
          <header className={`${styles.header} ${styles.animateItem}`}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Sustainability Dashboard</h1>
              <p className={styles.subtitle}>AI energy grids, water recycling, and environmental stats</p>
            </div>
            <div>
              <StatusChip label="Eco Mode Active" status="success" />
            </div>
          </header>

          {/* Hero Carbon Banner */}
          <section className={styles.animateItem}>
            <GlassCard variant="success">
              <div className={styles.carbonWrapper}>
                <div className={styles.carbonIcon}>🌱</div>
                <div className={styles.carbonDetails}>
                  <span className={styles.carbonTitle}>Carbon Footprint Offset</span>
                  <span className={styles.carbonValue}>12.4 Tonnes CO₂</span>
                  <span className={styles.carbonSub}>Saved today (Equivalent to planting 620 trees)</span>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Environmental KPIs */}
          <section className={`${styles.kpiGrid} ${styles.animateItem}`}>
            <KPIWidget label="Air Quality Index" value={42} icon="🍃" color="success" />
            <KPIWidget label="Noise Level" value={78} suffix=" dB" icon="🔊" color="primary" />
            <KPIWidget label="Temp Delta (Stadium)" value={0.3} suffix=" °C" icon="🌡️" color="warning" />
            <KPIWidget label="Green Energy Share" value={33} icon="⚡" format="percent" color="secondary" />
          </section>

          {/* Main Grid */}
          <div className={styles.mainGrid}>
            {/* Left Column: Energy & Water */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Energy Grid */}
              <div className={styles.animateItem}>
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Energy Dashboard</h3>
                  <div className={styles.energyContainer}>
                    <ProgressRing
                      value={33}
                      size={130}
                      strokeWidth={10}
                      color="#22C55E"
                      label="Renewable"
                      showPercent
                    />
                    <div className={styles.energyBreakdown}>
                      {energyStats.map((stat) => (
                        <div key={stat.label} className={styles.breakdownRow}>
                          <span className={styles.breakdownLabel}>{stat.label}</span>
                          <span className={styles.breakdownValue}>{stat.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Water Management */}
              <div className={styles.animateItem}>
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Water & Waste Recyclability</h3>
                  
                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '12px' }}>
                    Water Management
                  </h4>
                  <div className={styles.waterGrid}>
                    <div className={styles.waterCard}>
                      <span className={styles.waterValue}>45K L</span>
                      <span className={styles.waterLabel}>Total Used</span>
                    </div>
                    <div className={styles.waterCard}>
                      <span className={styles.waterValue}>18K L</span>
                      <span className={styles.waterLabel}>Recycled</span>
                    </div>
                    <div className={styles.waterCard}>
                      <span className={styles.waterValue}>92%</span>
                      <span className={styles.waterLabel}>Efficiency</span>
                    </div>
                  </div>

                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '12px' }}>
                    Waste Recycling breakdown
                  </h4>
                  {/* Segmented Waste Bar */}
                  <div className={styles.wasteSegments}>
                    <div className={styles.wasteSegment} style={{ width: '61%', backgroundColor: '#22C55E' }} title="Recycled (61%)">
                      61%
                    </div>
                    <div className={styles.wasteSegment} style={{ width: '18%', backgroundColor: '#8B5CF6' }} title="Composted (18%)">
                      18%
                    </div>
                    <div className={styles.wasteSegment} style={{ width: '21%', backgroundColor: '#EF4444' }} title="Landfill (21%)">
                      21%
                    </div>
                  </div>
                  <div className={styles.wasteLegend}>
                    <div className={styles.legendItem}>
                      <div className={styles.legendDot} style={{ backgroundColor: '#22C55E' }} />
                      <span>Recycled (Paper, Merch) — 1.7 Tonnes</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={styles.legendDot} style={{ backgroundColor: '#8B5CF6' }} />
                      <span>Composted (Food waste) — 0.5 Tonnes</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div className={styles.legendDot} style={{ backgroundColor: '#EF4444' }} />
                      <span>Landfill / General — 0.6 Tonnes</span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Right Column: AI Optimization Suggestions */}
            <div className={styles.animateItem}>
              <GlassCard>
                <h3 className={styles.sectionTitle}>AI Optimization Logs</h3>
                <div className={styles.suggestionsList}>
                  {suggestions.length > 0 ? (
                    suggestions.map((sug) => (
                      <div key={sug.id} className={styles.suggestionCard}>
                        <div className={styles.suggestionDetails}>
                          <span className={styles.suggestionTitle}>{sug.title}</span>
                          <p className={styles.suggestionDesc}>{sug.desc}</p>
                          <span className={styles.suggestionSavings}>{sug.savings}</span>
                        </div>
                        <button onClick={() => handleApply(sug.id)} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                          Apply
                        </button>
                      </div>
                    ))
                  ) : (
                    <div style={{ textAlign: 'center', padding: '24px 0', color: '#94A3B8' }}>
                      ✨ All green optimizations applied. Stadium at peak efficiency.
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
