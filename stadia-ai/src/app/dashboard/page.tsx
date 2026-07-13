'use client';

import { useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import KPIWidget from '@/components/KPIWidget';
import StatusChip from '@/components/StatusChip';
import ProgressRing from '@/components/ProgressRing';
import styles from './page.module.css';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const healthStats = [
  { label: 'Security', value: 98, color: '#22C55E' },
  { label: 'Medical', value: 96, color: '#3B82F6' },
  { label: 'Facilities', value: 91, color: '#06B6D4' },
  { label: 'Transport', value: 89, color: '#F59E0B' },
];

const crowdZones = [
  { zone: 'North', density: 92, color: '#EF4444' },
  { zone: 'South', density: 78, color: '#22C55E' },
  { zone: 'East', density: 85, color: '#F59E0B' },
  { zone: 'West', density: 71, color: '#3B82F6' },
];

const queueData = [
  { location: 'Gate A', time: 4, max: 15, color: '#22C55E' },
  { location: 'Gate B', time: 7, max: 15, color: '#F59E0B' },
  { location: 'Food Court', time: 12, max: 15, color: '#EF4444' },
  { location: 'Restrooms', time: 3, max: 15, color: '#22C55E' },
  { location: 'Merch Store', time: 8, max: 15, color: '#F59E0B' },
];

const matchEvents = [
  { minute: "23'", icon: '⚽', text: 'Vinícius Jr. — Goal (Brazil)' },
  { minute: "38'", icon: '⚽', text: 'Kai Havertz — Goal (Germany)' },
  { minute: "54'", icon: '⚽', text: 'Rodrygo — Goal (Brazil)' },
  { minute: "61'", icon: '🟨', text: 'Rüdiger — Yellow Card' },
  { minute: "66'", icon: '🔄', text: 'Sané ↔ Musiala (Germany)' },
];

const aiActions = [
  { icon: '🔮', label: 'Predict Crowd Flow' },
  { icon: '⚡', label: 'Optimize Queues' },
  { icon: '🗺️', label: 'Route Analysis' },
  { icon: '📋', label: 'Generate Report' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  /* GSAP staggered entrance animation */
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      /* Show everything immediately */
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
          stagger: 0.09,
          ease: 'power3.out',
          delay: 0.15,
        });
      }, containerRef);
    })();

    return () => {
      ctx?.revert();
    };
  }, []);

  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <div className={styles.container} ref={containerRef}>
          {/* ── Header ───────────────────────────── */}
          <header className={`${styles.header} ${styles.animateItem}`}>
            <div className={styles.headerLeft}>
              <h1 className={styles.title}>Operations Dashboard</h1>
              <StatusChip label="Live" status="active" pulse />
            </div>
            <div className={styles.headerRight}>
              <span className={styles.lastUpdated}>Updated 12s ago</span>
            </div>
          </header>

          {/* ── KPI Row ──────────────────────────── */}
          <section className={`${styles.kpiRow} ${styles.animateItem}`} aria-label="Key metrics">
            <KPIWidget
              label="Total Fans"
              value={67240}
              icon="👥"
              format="compact"
              trend={12}
              color="primary"
            />
            <KPIWidget
              label="Crowd Capacity"
              value={87}
              icon="🏟️"
              format="percent"
              color="secondary"
            />
            <KPIWidget
              label="Queue Wait"
              value={4}
              suffix=" min"
              icon="⏱️"
              color="warning"
            />
            <KPIWidget
              label="Active Incidents"
              value={3}
              icon="🚨"
              trend={-25}
              color="danger"
            />
          </section>

          {/* ── Main Grid (Health + Match) ────────── */}
          <div className={styles.mainGrid}>
            {/* Stadium Health */}
            <div className={styles.animateItem}>
              <GlassCard>
                <div className={styles.healthCard}>
                  <div className={styles.healthRing}>
                    <ProgressRing
                      value={94}
                      size={140}
                      strokeWidth={10}
                      color="#22C55E"
                      label="Health"
                      showPercent
                    />
                    <span className={styles.healthLabel}>Stadium Health</span>
                  </div>
                  <div className={styles.healthStats}>
                    {healthStats.map((stat) => (
                      <div key={stat.label} className={styles.healthStatRow}>
                        <span className={styles.healthStatLabel}>{stat.label}</span>
                        <div className={styles.healthStatBar}>
                          <div
                            className={styles.healthStatFill}
                            style={{
                              width: `${stat.value}%`,
                              background: stat.color,
                              boxShadow: `0 0 8px ${stat.color}40`,
                            }}
                          />
                        </div>
                        <span className={styles.healthStatValue}>{stat.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Match Overview */}
            <div className={styles.animateItem}>
              <GlassCard>
                <div className={styles.matchCard}>
                  <div className={styles.matchHeader}>
                    <div className={styles.team}>
                      <div
                        className={styles.teamLogo}
                        style={{ background: 'linear-gradient(135deg, #009739, #FEDD00)' }}
                      >
                        🇧🇷
                      </div>
                      <span className={styles.teamName}>Brazil</span>
                    </div>
                    <div className={styles.scoreBlock}>
                      <span className={styles.score}>2 – 1</span>
                      <span className={styles.matchMinute}>
                        <span className={styles.minutePulse} />
                        67&apos;
                      </span>
                    </div>
                    <div className={styles.team}>
                      <div
                        className={styles.teamLogo}
                        style={{ background: 'linear-gradient(135deg, #000, #DD0000)' }}
                      >
                        🇩🇪
                      </div>
                      <span className={styles.teamName}>Germany</span>
                    </div>
                  </div>
                  <p className={styles.matchVenue}>Lusail Stadium · Group F · Matchday 2</p>
                  <div className={styles.matchEvents}>
                    <span className={styles.matchEventsTitle}>Match Events</span>
                    {matchEvents.map((evt, i) => (
                      <div key={i} className={styles.event}>
                        <span className={styles.eventMinute}>{evt.minute}</span>
                        <span className={styles.eventIcon}>{evt.icon}</span>
                        <span>{evt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          {/* ── Crowd Density + Queue Times ──────── */}
          <div className={styles.mainGrid}>
            {/* Crowd Density */}
            <div className={styles.animateItem}>
              <GlassCard>
                <h3 className={styles.sectionTitle}>Crowd Density by Zone</h3>
                <div className={styles.densityGrid}>
                  {crowdZones.map((z) => (
                    <div key={z.zone} className={styles.densityZone}>
                      <span className={styles.densityValue}>{z.density}%</span>
                      <div
                        className={styles.densityBar}
                        style={{
                          height: `${z.density}%`,
                          background: `linear-gradient(180deg, ${z.color}, ${z.color}66)`,
                          boxShadow: `0 0 12px ${z.color}30`,
                        }}
                      />
                      <span className={styles.densityLabel}>{z.zone}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Queue Times */}
            <div className={styles.animateItem}>
              <GlassCard>
                <h3 className={styles.sectionTitle}>Queue Wait Times</h3>
                <div className={styles.queueList}>
                  {queueData.map((q) => (
                    <div key={q.location} className={styles.queueItem}>
                      <span className={styles.queueLabel}>{q.location}</span>
                      <div className={styles.queueBarWrapper}>
                        <div
                          className={styles.queueBar}
                          style={{
                            width: `${(q.time / q.max) * 100}%`,
                            background: `linear-gradient(90deg, ${q.color}88, ${q.color})`,
                            boxShadow: `0 0 10px ${q.color}30`,
                          }}
                        >
                          <span className={styles.queueTime}>{q.time} min</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          {/* ── Bottom Grid (Weather + AI Actions) ─ */}
          <div className={styles.bottomGrid}>
            {/* Weather Widget */}
            <div className={styles.animateItem}>
              <GlassCard padding="md">
                <div className={styles.weatherCard}>
                  <div className={styles.weatherMain}>
                    <span className={styles.weatherIcon}>⛅</span>
                    <div>
                      <div className={styles.weatherTemp}>24°C</div>
                      <div className={styles.weatherCondition}>Partly Cloudy</div>
                    </div>
                  </div>
                  <div className={styles.weatherDetails}>
                    <div className={styles.weatherDetail}>
                      💧 Humidity:&nbsp;
                      <span className={styles.weatherDetailValue}>45%</span>
                    </div>
                    <div className={styles.weatherDetail}>
                      🌬️ Wind:&nbsp;
                      <span className={styles.weatherDetailValue}>12 km/h</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Quick AI Actions */}
            <div className={styles.animateItem}>
              <GlassCard padding="md">
                <h3 className={styles.sectionTitle}>Quick AI Actions</h3>
                <div className={styles.actionsGrid}>
                  {aiActions.map((action) => (
                    <button key={action.label} className={styles.actionBtn} type="button">
                      <span className={styles.actionIcon}>{action.icon}</span>
                      <span className={styles.actionLabel}>{action.label}</span>
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
