'use client';

import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import KPIWidget from '@/components/KPIWidget';
import StatusChip from '@/components/StatusChip';
import styles from './page.module.css';

/* ───────────── Mock Data ───────────── */

const heatmapData: number[][] = [
  [0.3, 0.5, 0.7, 0.9, 0.95, 0.8, 0.6, 0.4],
  [0.4, 0.6, 0.85, 0.92, 0.88, 0.75, 0.5, 0.3],
  [0.2, 0.45, 0.7, 0.82, 0.78, 0.65, 0.4, 0.25],
  [0.35, 0.55, 0.6, 0.7, 0.72, 0.58, 0.45, 0.3],
  [0.5, 0.65, 0.78, 0.85, 0.9, 0.7, 0.55, 0.35],
  [0.15, 0.3, 0.45, 0.55, 0.5, 0.4, 0.28, 0.18],
];

const yLabels = ['North Stand', 'Upper East', 'Lower East', 'Lower West', 'Upper West', 'South Stand'];
const xLabels = ['Sec A', 'Sec B', 'Sec C', 'Sec D', 'Sec E', 'Sec F', 'Sec G', 'Sec H'];

const queueData = [
  { name: 'Gate A', time: 4, maxTime: 15, level: 'low' as const },
  { name: 'Gate B', time: 7, maxTime: 15, level: 'medium' as const },
  { name: 'Gate C', time: 12, maxTime: 15, level: 'high' as const },
  { name: 'Food Court North', time: 8, maxTime: 15, level: 'medium' as const },
  { name: 'Food Court South', time: 5, maxTime: 15, level: 'low' as const },
  { name: 'Merch Store', time: 10, maxTime: 15, level: 'high' as const },
];

const timelineData = [
  { time: '8:00 PM', value: 85 },
  { time: '8:30 PM', value: 92 },
  { time: '9:00 PM', value: 88 },
  { time: '9:30 PM', value: 75 },
  { time: '10:00 PM', value: 45 },
  { time: '10:30 PM', value: 20 },
];

const recommendations = [
  {
    icon: '🚪',
    iconVariant: 'danger',
    title: 'Open Gate D to reduce North congestion',
    desc: 'North Stand density has exceeded 92%. Opening Gate D will distribute crowd flow and reduce wait times by ~40%.',
    priority: 'critical',
    actionLabel: 'Open Gate D',
    actionVariant: 'danger',
  },
  {
    icon: '👷',
    iconVariant: 'warning',
    title: 'Deploy 2 additional staff to Food Court',
    desc: 'Queue times at Food Court North are rising. Adding 2 staff members can reduce service time from 8 to 4 minutes.',
    priority: 'high',
    actionLabel: 'Deploy Staff',
    actionVariant: 'warning',
  },
  {
    icon: '🅿️',
    iconVariant: 'default',
    title: 'Activate overflow parking Lot C',
    desc: 'Lots A and B are at 94% capacity. Activating Lot C preemptively will prevent gridlock during post-match exit.',
    priority: 'medium',
    actionLabel: 'Activate Lot C',
    actionVariant: 'default',
  },
  {
    icon: '🏥',
    iconVariant: 'success',
    title: 'Pre-position medical team near Section 108',
    desc: 'AI predicts elevated crowd density and temperature near Section 108. Pre-positioning a medical response team is advised.',
    priority: 'high',
    actionLabel: 'Position Team',
    actionVariant: 'success',
  },
];

/* ───────────── Helpers ───────────── */

function densityToColor(value: number): string {
  if (value <= 0.4) {
    const t = value / 0.4;
    const r = Math.round(34 + t * (245 - 34));
    const g = Math.round(197 + t * (158 - 197));
    const b = Math.round(94 + t * (11 - 94));
    return `rgb(${r}, ${g}, ${b})`;
  }
  const t = (value - 0.4) / 0.6;
  const r = Math.round(245 + t * (239 - 245));
  const g = Math.round(158 + t * (68 - 158));
  const b = Math.round(11 + t * (68 - 11));
  return `rgb(${r}, ${g}, ${b})`;
}

/* ───────────── Component ───────────── */

export default function CrowdIntelligencePage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let cancelled = false;

    (async () => {
      const gsap = (await import('gsap')).default;
      if (cancelled) return;

      const ctx = gsap.context(() => {
        // Header
        gsap.from(`.${styles.header}`, {
          y: -30,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
        });

        // KPI widgets stagger
        gsap.from(`.${styles.kpiRow} > *`, {
          y: 40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.2,
        });

        // Main grid cards
        gsap.from(`.${styles.mainGrid} > *`, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.5,
        });

        // Heatmap cells stagger
        gsap.from(`.${styles.heatmapCell}`, {
          scale: 0,
          opacity: 0,
          duration: 0.3,
          stagger: 0.015,
          ease: 'back.out(1.5)',
          delay: 0.8,
        });

        // Timeline card
        gsap.from(`.${styles.timelineCard}`, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          delay: 1.0,
        });

        // Recommendation cards
        gsap.from(`.${styles.recsGrid} > *`, {
          y: 40,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 1.3,
        });
      }, pageRef);

      return () => ctx.revert();
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className={styles.page} ref={pageRef}>
        <div className={styles.container}>
          {/* ─── Header ─── */}
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Crowd Intelligence</h1>
              <p className={styles.subtitle}>
                Real-time crowd analytics and predictions
              </p>
            </div>
            <StatusChip label="Live Monitoring" status="active" pulse />
          </header>

          {/* ─── KPI Row ─── */}
          <section className={styles.kpiRow} aria-label="Key performance indicators">
            <KPIWidget
              label="Total Attendance"
              value={67240}
              icon="👥"
              format="compact"
              color="primary"
              trend={5}
            />
            <KPIWidget
              label="Avg Density"
              value={78}
              suffix="%"
              icon="📊"
              format="number"
              color="warning"
              trend={-3}
            />
            <KPIWidget
              label="Peak Zone"
              value={108}
              prefix="Sec "
              icon="📍"
              format="number"
              color="danger"
            />
            <KPIWidget
              label="Predicted Exit Time"
              value={2245}
              icon="🕙"
              format="number"
              color="secondary"
            />
          </section>

          {/* ─── Heatmap + Queue Analytics ─── */}
          <div className={styles.mainGrid}>
            {/* Heatmap */}
            <GlassCard className={styles.heatmapCard}>
              <div>
                <h2 className={styles.sectionTitle}>Density Heatmap</h2>
                <p className={styles.sectionSubtitle}>
                  Lusail Stadium — FIFA World Cup 2026 Semi-Final
                </p>
              </div>

              <div className={styles.heatmapWrapper}>
                <div className={styles.heatmapYLabels}>
                  {yLabels.map((label) => (
                    <span key={label} className={styles.heatmapYLabel}>
                      {label}
                    </span>
                  ))}
                </div>

                <div className={styles.heatmapGrid}>
                  {heatmapData.flat().map((value, i) => (
                    <div
                      key={i}
                      className={styles.heatmapCell}
                      style={{
                        backgroundColor: densityToColor(value),
                        opacity: 0.7 + value * 0.3,
                      }}
                      title={`${Math.round(value * 100)}% density`}
                      aria-label={`Section density ${Math.round(value * 100)}%`}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.heatmapXLabels}>
                {xLabels.map((label) => (
                  <span key={label} className={styles.heatmapXLabel}>
                    {label}
                  </span>
                ))}
              </div>

              <div className={styles.heatmapLegend}>
                <span className={styles.legendLabel}>Low</span>
                <div className={styles.legendBar} />
                <span className={styles.legendLabel}>High</span>
              </div>
            </GlassCard>

            {/* Queue Analytics */}
            <GlassCard>
              <h2 className={styles.sectionTitle}>Queue Analytics</h2>
              <p className={styles.sectionSubtitle}>
                Real-time wait times across entry points
              </p>

              <div className={styles.queueList}>
                {queueData.map((q) => (
                  <div key={q.name} className={styles.queueItem}>
                    <div className={styles.queueMeta}>
                      <span className={styles.queueName}>{q.name}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className={`${styles.queueBadge} ${styles[q.level]}`}>
                          {q.level}
                        </span>
                        <span className={styles.queueTime}>{q.time} min</span>
                      </div>
                    </div>
                    <div className={styles.queueBarTrack}>
                      <div
                        className={`${styles.queueBarFill} ${styles[q.level]}`}
                        style={{ width: `${(q.time / q.maxTime) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* ─── Crowd Prediction Timeline ─── */}
          <GlassCard className={styles.timelineCard}>
            <h2 className={styles.sectionTitle}>Crowd Flow Prediction</h2>
            <p className={styles.sectionSubtitle}>
              AI-projected crowd levels for the next 3 hours
            </p>

            <div className={styles.timelineViz}>
              <div className={styles.timelineGridLines}>
                {[100, 75, 50, 25, 0].map((val) => (
                  <div key={val} className={styles.timelineGridLine}>
                    <span className={styles.timelineGridLineLabel}>{val}%</span>
                  </div>
                ))}
              </div>

              <div className={styles.timelinePoints}>
                {timelineData.map((point) => {
                  const isPeak = point.value === Math.max(...timelineData.map((d) => d.value));
                  return (
                    <div key={point.time} className={styles.timelinePoint}>
                      <div
                        className={`${styles.timelineBar} ${isPeak ? styles.peak : ''}`}
                        style={{ height: `${point.value}%` }}
                      >
                        <span className={styles.timelineValue}>{point.value}%</span>
                      </div>
                      <span className={styles.timelineLabel}>{point.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>

          {/* ─── AI Recommendations ─── */}
          <div className={styles.recsHeader}>
            <div>
              <h2 className={styles.sectionTitle}>AI Recommendations</h2>
              <p className={styles.sectionSubtitle}>
                Proactive actions suggested by StadiaAI neural engine
              </p>
            </div>
            <StatusChip label="4 Active" status="warning" />
          </div>

          <div className={styles.recsGrid}>
            {recommendations.map((rec, i) => (
              <GlassCard key={i} className={styles.recCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div className={`${styles.recIcon} ${styles[rec.iconVariant]}`}>
                    {rec.icon}
                  </div>
                  <span className={`${styles.recPriority} ${styles[rec.priority]}`}>
                    {rec.priority}
                  </span>
                </div>
                <h3 className={styles.recTitle}>{rec.title}</h3>
                <p className={styles.recDesc}>{rec.desc}</p>
                <button className={`${styles.recAction} ${styles[rec.actionVariant]}`}>
                  {rec.actionLabel}
                  <span>→</span>
                </button>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
