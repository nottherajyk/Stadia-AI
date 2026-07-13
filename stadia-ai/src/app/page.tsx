'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import KPIWidget from '@/components/KPIWidget';
import styles from './page.module.css';

const features = [
  {
    icon: '📊',
    title: 'Operations Dashboard',
    desc: 'Real-time monitoring of stadium vitals, match events, weather conditions, and crowd statistics.',
    link: '/dashboard',
  },
  {
    icon: '🤖',
    title: 'AI Assistant',
    desc: 'Conversational assistant with voice input providing navigational help, recommendations, and route info.',
    link: '/assistant',
  },
  {
    icon: '🗺️',
    title: 'Interactive Map',
    desc: 'Live SVG stadium plan detailing gates, concessions, medical facilities, accessibility routes, and ETAs.',
    link: '/map',
  },
  {
    icon: '👥',
    title: 'Crowd Intelligence',
    desc: 'Deep learning models predictive of gate queues, stand bottlenecks, and emergency egress routing.',
    link: '/crowd',
  },
  {
    icon: '♿',
    title: 'Accessibility Hub',
    desc: 'Smart routes optimized for wheelchairs, live elevators statuses, sensory room guidance, and voice tools.',
    link: '/accessibility',
  },
  {
    icon: '🚇',
    title: 'Smart Transportation',
    desc: 'Real-time updates on metro schedules, shuttle lines, parking fill rates, and fastest route calculation.',
    link: '/transport',
  },
];

export default function LandingPage() {
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
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          delay: 0.1,
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
      <div className={styles.page} ref={containerRef}>
        <div className={styles.gridOverlay} />
        
        {/* Hero Section */}
        <section className={styles.container}>
          <div className={styles.hero}>
            <div className={`${styles.heroContent} ${styles.animateItem}`}>
              <div className={styles.fifaTag}>
                <span>🏆 Official FIFA 2026 Operations</span>
              </div>
              <h1 className={styles.title}>
                The AI Operating System <br />
                <span className="text-gradient">for Smart Stadiums</span>
              </h1>
              <p className={styles.desc}>
                StadiaAI coordinates fans, venue staff, transportation operators, and security responders. High-fidelity crowd prediction and intelligent operations powered by next-generation AI.
              </p>
              <div className={styles.ctas}>
                <Link href="/dashboard" className="btn btn-gradient">
                  Launch Dashboard
                </Link>
                <Link href="/assistant" className="btn btn-secondary">
                  Talk to Assistant
                </Link>
              </div>
            </div>
            
            <div className={`${styles.heroVisual} ${styles.animateItem}`}>
              <div className={styles.stadiumWrapper}>
                <svg className={styles.stadiumSvg} viewBox="0 0 200 200" fill="none">
                  {/* Outer glow ring */}
                  <ellipse cx="100" cy="100" rx="90" ry="60" stroke="#3B82F6" strokeWidth="2" strokeOpacity="0.4" className={styles.stadiumLine} />
                  {/* Inner rings */}
                  <ellipse cx="100" cy="100" rx="75" ry="48" stroke="#06B6D4" strokeWidth="1.5" strokeOpacity="0.6" className={styles.stadiumLine} />
                  <ellipse cx="100" cy="100" rx="60" ry="36" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.5" className={styles.stadiumLine} />
                  
                  {/* Seating outline */}
                  <ellipse cx="100" cy="100" rx="45" ry="25" stroke="#3B82F6" strokeWidth="2" fill="rgba(19, 21, 26, 0.6)" className={styles.stadiumPulse} />
                  
                  {/* Pitch outline */}
                  <rect x="75" y="87" width="50" height="26" rx="2" fill="#22C55E" fillOpacity="0.2" stroke="#22C55E" strokeWidth="1.5" strokeOpacity="0.8" className={styles.stadiumPulse} />
                  <line x1="100" y1="87" x2="100" y2="113" stroke="#22C55E" strokeWidth="1" strokeOpacity="0.8" />
                  <circle cx="100" cy="100" r="5" stroke="#22C55E" strokeWidth="1" fill="none" strokeOpacity="0.8" />
                  
                  {/* Glowing sensor dots around perimeter */}
                  <circle cx="100" cy="40" r="3" fill="#06B6D4" className={styles.stadiumPulse} />
                  <circle cx="100" cy="160" r="3" fill="#06B6D4" className={styles.stadiumPulse} />
                  <circle cx="25" cy="100" r="3" fill="#3B82F6" className={styles.stadiumPulse} />
                  <circle cx="175" cy="100" r="3" fill="#3B82F6" className={styles.stadiumPulse} />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Live KPI Strip */}
        <section className={`${styles.container} ${styles.kpiSection} ${styles.animateItem}`}>
          <div className={styles.kpiGrid}>
            <KPIWidget label="Fans in Stadium" value={67240} icon="👥" format="compact" color="primary" />
            <KPIWidget label="Crowd Capacity" value={87} icon="Stadium" format="percent" color="secondary" />
            <KPIWidget label="Active Incidents" value={3} icon="🚨" color="danger" />
            <KPIWidget label="Avg Temperature" value={24} icon="🌡️" suffix="°C" color="warning" />
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.container}>
          <div className={styles.featuresSection}>
            <div className={`${styles.sectionHeader} ${styles.animateItem}`}>
              <h2 className={styles.sectionTitle}>Full Stadium Command Modules</h2>
              <p className={styles.sectionDesc}>Navigate and control every aspect of FIFA World Cup 2026 stadium operations</p>
            </div>
            
            <div className={styles.featuresGrid}>
              {features.map((feature, i) => (
                <div key={feature.title} className={`${styles.featureCard} ${styles.animateItem}`}>
                  <GlassCard hover onClick={() => window.location.href = feature.link}>
                    <div className={styles.featureIcon}>{feature.icon}</div>
                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                    <p className={styles.featureDesc}>{feature.desc}</p>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AI Branding Section */}
        <section className={`${styles.container} ${styles.aiSection} ${styles.animateItem}`}>
          <div className={styles.aiContainer}>
            <div className={styles.aiContent}>
              <div className={styles.aiBadge}>🤖 Core Intelligence</div>
              <h2 className={styles.aiTitle}>Real-Time Predictive Decision Support</h2>
              <p className={styles.aiDesc}>
                StadiaAI features integrated language models trained specifically for sports operations. It synthesizes crowd trends, monitors facility anomalies, coordinates responders, and automatically updates emergency routes.
              </p>
              <div className={styles.aiFeatureList}>
                <div className={styles.aiFeatureItem}>
                  <span className={styles.aiFeatureBullet}>✓</span> Multilingual fan & staff translation
                </div>
                <div className={styles.aiFeatureItem}>
                  <span className={styles.aiFeatureBullet}>✓</span> Direct medical dispatch routing
                </div>
                <div className={styles.aiFeatureItem}>
                  <span className={styles.aiFeatureBullet}>✓</span> Crowd evacuation queue prediction
                </div>
                <div className={styles.aiFeatureItem}>
                  <span className={styles.aiFeatureBullet}>✓</span> Climate control & HVAC optimization
                </div>
              </div>
            </div>
            <div className={styles.aiVisual}>
              <div className={styles.aiSphere} />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.footer}>
          <div className={`${styles.container} ${styles.footerInner}`}>
            <div className={styles.footerLeft}>
              <span className={styles.footerLogo}>StadiaAI</span>
              <span className={styles.copyright}>© 2026 FIFA World Cup Smart Operations. All rights reserved.</span>
            </div>
            <div className={styles.footerLinks}>
              <Link href="/dashboard" className={styles.footerLink}>Dashboard</Link>
              <Link href="/assistant" className={styles.footerLink}>Assistant</Link>
              <Link href="/map" className={styles.footerLink}>Stadium Map</Link>
              <Link href="/operations" className={styles.footerLink}>Operations</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
