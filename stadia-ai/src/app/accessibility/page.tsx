'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import KPIWidget from '@/components/KPIWidget';
import StatusChip from '@/components/StatusChip';
import styles from './page.module.css';

interface Elevator {
  id: string;
  name: string;
  location: string;
  floors: string;
  status: 'active' | 'warning' | 'danger' | 'neutral' | 'success';
  statusLabel: string;
  wait: string;
}

const initialElevators: Elevator[] = [
  { id: '1', name: 'Elevator 1 (North)', location: 'Gate A Lobby', floors: 'L1 ↔ L3', status: 'success', statusLabel: 'Operational', wait: '30s' },
  { id: '2', name: 'Elevator 2 (North)', location: 'Gate B Concourse', floors: 'L1 ↔ L2', status: 'success', statusLabel: 'Operational', wait: '15s' },
  { id: '3', name: 'Elevator 3 (East)', location: 'Gate C Seating', floors: 'L1 ↔ L3', status: 'warning', statusLabel: 'Busy', wait: '1m 20s' },
  { id: '4', name: 'Elevator 4 (East)', location: 'Gate D Lobby', floors: 'L1 ↔ L2', status: 'success', statusLabel: 'Operational', wait: '10s' },
  { id: '5', name: 'Elevator 5 (South)', location: 'Gate E Concourse', floors: 'L1 ↔ L3', status: 'success', statusLabel: 'Operational', wait: '45s' },
  { id: '6', name: 'Elevator 6 (South)', location: 'Gate F Seating', floors: 'L1 ↔ L2', status: 'warning', statusLabel: 'Busy', wait: '1m 40s' },
  { id: '7', name: 'Elevator 7 (West)', location: 'Gate G Lobby', floors: 'L1 ↔ L3', status: 'success', statusLabel: 'Operational', wait: '20s' },
  { id: '8', name: 'Elevator 8 (West)', location: 'Gate H Concourse', floors: 'L1 ↔ L2', status: 'danger', statusLabel: 'Maintenance', wait: 'N/A' },
];

export default function AccessibilityHubPage() {
  const [elevators, setElevators] = useState<Elevator[]>(initialElevators);
  const [voiceActive, setVoiceActive] = useState(false);
  const [voiceVolume, setVoiceVolume] = useState(70);
  const [voiceLang, setVoiceLang] = useState('en');
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
              <h1 className={styles.title}>Accessibility Hub</h1>
              <p className={styles.subtitle}>Inclusive routing, elevator status, and voice assistance</p>
            </div>
            <div>
              <StatusChip label="All Systems Active" status="active" />
            </div>
          </header>

          {/* Quick Stats */}
          <section className={`${styles.kpiGrid} ${styles.animateItem}`}>
            <KPIWidget label="Accessible Routes Active" value={24} icon="♿" color="primary" />
            <KPIWidget label="Elevators Operational" value={7} suffix="/8" icon="🛗" color="success" />
            <KPIWidget label="Wheelchair Spaces Ready" value={142} icon="♿" color="secondary" />
          </section>

          {/* Main Grid */}
          <div className={styles.mainGrid}>
            {/* Left Column: Routing & Elevators */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Wheelchair Routing */}
              <div className={styles.animateItem}>
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Wheelchair Accessible Routes</h3>
                  <div className={styles.mapWrapper}>
                    <svg className={styles.routeSvg} viewBox="0 0 400 220" fill="none">
                      {/* Stadium footprint backdrop */}
                      <ellipse cx="200" cy="110" rx="160" ry="90" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                      <ellipse cx="200" cy="110" rx="110" ry="60" stroke="rgba(255,255,255,0.03)" strokeWidth="3" />
                      {/* Center pitch */}
                      <rect x="150" y="85" width="100" height="50" rx="2" fill="none" stroke="rgba(34, 197, 94, 0.05)" strokeWidth="2" />
                      
                      {/* Elevator Nodes */}
                      <circle cx="90" cy="110" r="5" fill="#3B82F6" className={styles.pulsingNode} />
                      <circle cx="310" cy="110" r="5" fill="#3B82F6" className={styles.pulsingNode} />
                      
                      {/* Accessible Routes */}
                      {/* Route 1: Gate A to Section 108 */}
                      <path d="M 60 50 Q 120 70 200 60 T 310 110" fill="none" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" className={styles.routeLine} />
                      {/* Route 2: Gate C to Section 204 */}
                      <path d="M 340 50 Q 280 80 200 130 T 90 110" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" className={styles.routeLine} style={{ animationDelay: '1s' }} />
                      
                      {/* Marker labels */}
                      <text x="50" y="42" fill="#fff" fontSize="10" fontFamily="monospace">Gate A</text>
                      <text x="330" y="42" fill="#fff" fontSize="10" fontFamily="monospace">Gate C</text>
                      <text x="75" y="125" fill="#3B82F6" fontSize="9" fontFamily="monospace">Elevator 1</text>
                      <text x="295" y="125" fill="#3B82F6" fontSize="9" fontFamily="monospace">Elevator 3</text>
                    </svg>
                  </div>
                  <div className={styles.routeList}>
                    <div className={styles.routeItem}>
                      <span className={styles.routeName}>🔵 Gate A to Section 108 (Direct Flat Concourse)</span>
                      <span className={styles.routeTime}>3 mins</span>
                    </div>
                    <div className={styles.routeItem}>
                      <span className={styles.routeName}>🟣 Gate C to Level 2 Wheelchair Deck (Elevator 3 Link)</span>
                      <span className={styles.routeTime}>5 mins (incl. elevator)</span>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Elevator Status */}
              <div className={styles.animateItem}>
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Live Elevator Network</h3>
                  <div className={styles.elevatorGrid}>
                    {elevators.map((elev) => (
                      <div key={elev.id} className={styles.elevatorCard}>
                        <div className={styles.elevatorHeader}>
                          <span className={styles.elevatorName}>{elev.name}</span>
                          <StatusChip label={elev.statusLabel} status={elev.status} size="sm" />
                        </div>
                        <div className={styles.elevatorDetailRow}>
                          <span>Location:</span>
                          <span className={styles.elevatorDetailValue}>{elev.location}</span>
                        </div>
                        <div className={styles.elevatorDetailRow}>
                          <span>Floors:</span>
                          <span className={styles.elevatorDetailValue}>{elev.floors}</span>
                        </div>
                        <div className={styles.elevatorDetailRow}>
                          <span>Est. Wait:</span>
                          <span className={styles.elevatorDetailValue} style={{ color: elev.status === 'success' ? '#22C55E' : elev.status === 'warning' ? '#F59E0B' : '#EF4444' }}>
                            {elev.wait}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Right Column: Facilities & Voice */}
            <div className={styles.animateItem}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Accessible Facilities */}
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Accessible Concessions</h3>
                  
                  <div className={styles.facilityCategory}>
                    <h4 className={styles.facilityCatTitle}>Wheelchair Seating Decks</h4>
                    <div className={styles.facilityList}>
                      <div className={styles.facilityItem}>
                        <span className={styles.facilityName}>North Deck Section 101</span>
                        <span className={styles.facilityLocation}>Level 1</span>
                      </div>
                      <div className={styles.facilityItem}>
                        <span className={styles.facilityName}>East Deck Section 204</span>
                        <span className={styles.facilityLocation}>Level 2</span>
                      </div>
                      <div className={styles.facilityItem}>
                        <span className={styles.facilityName}>South Deck Section 312</span>
                        <span className={styles.facilityLocation}>Level 3</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.facilityCategory}>
                    <h4 className={styles.facilityCatTitle}>Accessible Restrooms</h4>
                    <div className={styles.facilityList}>
                      <div className={styles.facilityItem}>
                        <span className={styles.facilityName}>Block A Concourse</span>
                        <span className={styles.facilityLocation}>L1 · Near Gate A</span>
                      </div>
                      <div className={styles.facilityItem}>
                        <span className={styles.facilityName}>Block C Lobby</span>
                        <span className={styles.facilityLocation}>L2 · Near Lift 3</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.facilityCategory}>
                    <h4 className={styles.facilityCatTitle}>Inclusive Services</h4>
                    <div className={styles.facilityList}>
                      <div className={styles.facilityItem}>
                        <span className={styles.facilityName}>Sensory Room (Quiet Area)</span>
                        <span className={styles.facilityLocation}>Level 1 · Gate G</span>
                      </div>
                      <div className={styles.facilityItem}>
                        <span className={styles.facilityName}>Assistive Listening Kits</span>
                        <span className={styles.facilityLocation}>Guest Services</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Voice Guidance */}
                <GlassCard>
                  <h3 className={styles.sectionTitle}>Voice Guidance Support</h3>
                  <div className={styles.voiceWrapper}>
                    <div className={styles.voiceControlRow}>
                      <span className={styles.toggleLabel}>Voice Assist System</span>
                      <button
                        type="button"
                        onClick={() => setVoiceActive(!voiceActive)}
                        className={`btn ${voiceActive ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ padding: '6px 14px' }}
                      >
                        {voiceActive ? 'ON' : 'OFF'}
                      </button>
                    </div>
                    
                    <div className={styles.voiceControlRow}>
                      <span className={styles.toggleLabel}>Volume level</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={voiceVolume}
                        onChange={(e) => setVoiceVolume(parseInt(e.target.value))}
                        className={styles.sliderInput}
                      />
                    </div>

                    <div className={styles.voiceControlRow}>
                      <span className={styles.toggleLabel}>Language</span>
                      <select
                        value={voiceLang}
                        onChange={(e) => setVoiceLang(e.target.value)}
                        className={styles.selectInput}
                      >
                        <option value="en">English (US)</option>
                        <option value="es">Español (ES)</option>
                        <option value="fr">Français (FR)</option>
                        <option value="ar">العربية (AR)</option>
                      </select>
                    </div>

                    <h4 className={styles.commandListTitle}>Sample Audio Prompts</h4>
                    <div className={styles.commandList}>
                      <div className={styles.commandItem}>"Navigate to nearest elevator"</div>
                      <div className={styles.commandItem}>"Egress route for Section 108"</div>
                      <div className={styles.commandItem}>"Locate wheelchair deck 204"</div>
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
