'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import StatusChip from '@/components/StatusChip';
import styles from './page.module.css';

interface Incident {
  id: string;
  type: 'medical' | 'security' | 'facilities' | 'crowd' | 'resolved';
  icon: string;
  title: string;
  time: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  desc: string;
}

interface VolunteerTask {
  id: string;
  title: string;
  assignee: string;
  priority: 'high' | 'medium' | 'low';
  status: 'assigned' | 'unassigned' | 'completed';
}

const initialIncidents: Incident[] = [
  {
    id: '1',
    type: 'medical',
    icon: '🔴',
    title: 'Medical: First aid required at Section 112',
    time: '2 min ago',
    priority: 'critical',
    desc: 'Spectator experiencing mild chest tightness. Medical team alpha dispatched with AED.',
  },
  {
    id: '2',
    type: 'security',
    icon: '🟡',
    title: 'Security: Unauthorized access attempt VIP entry',
    time: '8 min ago',
    priority: 'high',
    desc: 'Unaccredited individual attempting access. Security team intercepting at Gate C VIP terminal.',
  },
  {
    id: '3',
    type: 'resolved',
    icon: '🟢',
    title: 'Resolved: Lost child reunited at Gate C',
    time: '15 min ago',
    priority: 'medium',
    desc: 'Child reunited successfully. Case closed by Volunteer Lead Maria S.',
  },
  {
    id: '4',
    type: 'facilities',
    icon: '🟡',
    title: 'Facilities: Restroom maintenance Block E',
    time: '22 min ago',
    priority: 'medium',
    desc: 'Water leak reported in level 2 restroom. Plumbing crew on route.',
  },
  {
    id: '5',
    type: 'crowd',
    icon: '🔴',
    title: 'Crowd: Overcrowding North Stand Section 108',
    time: '35 min ago',
    priority: 'critical',
    desc: 'Section bottleneck forming. Redirecting flow through auxiliary tunnels.',
  },
  {
    id: '6',
    type: 'resolved',
    icon: '🟢',
    title: 'Resolved: Power restored to media center',
    time: '1 hour ago',
    priority: 'high',
    desc: 'Secondary generator failure rectified. System operating on stable redundant grid.',
  },
];

const initialTasks: VolunteerTask[] = [
  { id: '1', title: 'Guide fans to Gate D overflow', assignee: 'Team Alpha', priority: 'high', status: 'assigned' },
  { id: '2', title: 'Water distribution Section 200', assignee: 'None', priority: 'medium', status: 'unassigned' },
  { id: '3', title: 'Translation support Gate B', assignee: 'Maria S.', priority: 'medium', status: 'assigned' },
  { id: '4', title: 'Wheelchair assistance Level 2', assignee: 'Team Beta', priority: 'high', status: 'assigned' },
  { id: '5', title: 'Lost & Found desk coverage', assignee: 'None', priority: 'low', status: 'unassigned' },
];

export default function OperationsCenterPage() {
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents);
  const [tasks, setTasks] = useState<VolunteerTask[]>(initialTasks);
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
              <h1 className={styles.title}>Operations Center</h1>
              <StatusChip label="Active" status="active" pulse />
            </div>
            <div>
              <span className={styles.lastUpdated}>Zone Lead Panel</span>
            </div>
          </header>

          {/* Executive AI Summary */}
          <section className={styles.animateItem}>
            <GlassCard variant="highlighted">
              <div className={styles.summaryContainer}>
                <div className={styles.summaryIcon}>🤖</div>
                <div className={styles.summaryContent}>
                  <h3 className={styles.summaryTitle}>Executive AI Summary</h3>
                  <p className={styles.summaryText}>
                    Stadium operations running at 94% efficiency. 3 active incidents being managed. North gate experiencing moderate congestion. Medical team response time averaging 2.3 minutes. Security detail positioned at critical choke points. All systems nominal.
                  </p>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* Grid Layout */}
          <div className={styles.mainGrid}>
            {/* Left Column: Incidents Timeline */}
            <div className={styles.animateItem}>
              <GlassCard>
                <h3 className={styles.sectionTitle}>Real-time Incident Feed</h3>
                <div className={styles.incidentList}>
                  {incidents.map((incident) => (
                    <div key={incident.id} className={styles.incidentItem}>
                      <span className={styles.incidentIcon}>{incident.icon}</span>
                      <div className={styles.incidentDetails}>
                        <div className={styles.incidentHeader}>
                          <span className={styles.incidentName}>{incident.title}</span>
                          <div className={styles.incidentMeta}>
                            <span className={styles.incidentTime}>{incident.time}</span>
                            <span className={`badge badge-${incident.priority === 'critical' ? 'danger' : incident.priority === 'high' ? 'warning' : 'primary'}`}>
                              {incident.priority}
                            </span>
                          </div>
                        </div>
                        <p className={styles.incidentDesc}>{incident.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Right Column: Side panels */}
            <div className={styles.animateItem}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Volunteer Tasks */}
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Volunteer Task Board</h3>
                  <div className={styles.taskList}>
                    {tasks.map((task) => (
                      <div key={task.id} className={styles.taskItem}>
                        <div className={styles.taskHeader}>
                          <span className={styles.taskName}>{task.title}</span>
                          <StatusChip
                            label={task.status}
                            status={task.status === 'assigned' ? 'active' : task.status === 'completed' ? 'success' : 'neutral'}
                            size="sm"
                          />
                        </div>
                        <div className={styles.taskMeta}>
                          <span className={styles.taskAssignee}>👤 {task.assignee}</span>
                          <span className={`badge badge-${task.priority === 'high' ? 'danger' : 'warning'}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

                {/* Medical Alerts Panel */}
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Medical Vitals</h3>
                  <div className={styles.medicalStats}>
                    <div className={styles.medStat}>
                      <span className={styles.medStatValue}>2.3</span>
                      <span className={styles.medStatLabel}>Resp Time (m)</span>
                    </div>
                    <div className={styles.medStat}>
                      <span className={styles.medStatValue}>2</span>
                      <span className={styles.medStatLabel}>Active Cases</span>
                    </div>
                    <div className={styles.medStat}>
                      <span className={styles.medStatValue}>12/15</span>
                      <span className={styles.medStatLabel}>Staff Ready</span>
                    </div>
                  </div>
                  <h4 className={styles.recentAlertsTitle}>Recent Medical Despatches</h4>
                  <div className={styles.medAlertsList}>
                    <div className={styles.medAlertItem}>
                      <span>Section 112 Dispatch</span>
                      <span style={{ color: '#EF4444' }}>Critical</span>
                    </div>
                    <div className={styles.medAlertItem}>
                      <span>Section 204 Treated</span>
                      <span style={{ color: '#22C55E' }}>Resolved</span>
                    </div>
                  </div>
                </GlassCard>

                {/* Security Grid */}
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Security Status</h3>
                  <div className={styles.securityGrid}>
                    <div className={styles.securityCard}>
                      <span className={styles.securityValue} style={{ color: '#22C55E' }}>234/240</span>
                      <span className={styles.securityLabel}>Cameras Live</span>
                    </div>
                    <div className={styles.securityCard}>
                      <span className={styles.securityValue} style={{ color: '#22C55E' }}>100%</span>
                      <span className={styles.securityLabel}>Gate Scanners</span>
                    </div>
                    <div className={styles.securityCard}>
                      <span className={styles.securityValue} style={{ color: '#22C55E' }}>LOW</span>
                      <span className={styles.securityLabel}>Threat Level</span>
                    </div>
                    <div className={styles.securityCard}>
                      <span className={styles.securityValue} style={{ color: '#3B82F6' }}>156</span>
                      <span className={styles.securityLabel}>Personnel</span>
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
