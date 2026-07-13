'use client';

import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import styles from './page.module.css';

interface Notification {
  id: string;
  category: 'crowd' | 'emergency' | 'transport' | 'weather' | 'medical';
  icon: string;
  title: string;
  desc: string;
  time: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  unread: boolean;
  status?: string;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    category: 'emergency',
    icon: '🚨',
    title: 'Medical emergency reported Section 112',
    desc: 'Medical team dispatched. Incident under management. Response team at 1.5 min distance.',
    time: '2 min ago',
    priority: 'critical',
    unread: true,
  },
  {
    id: '2',
    category: 'crowd',
    icon: '👥',
    title: 'North Stand approaching 95% capacity',
    desc: 'Automated turnstile slow-down activated. Redirecting inbound spectators to East Stand gates.',
    time: '5 min ago',
    priority: 'high',
    unread: true,
  },
  {
    id: '3',
    category: 'transport',
    icon: '🚇',
    title: 'Green Line delayed 3 minutes',
    desc: 'Slight congestion at Metro interchange. Additional shuttle buses deployed to cover delta.',
    time: '8 min ago',
    priority: 'medium',
    unread: true,
  },
  {
    id: '4',
    category: 'weather',
    icon: '🌡️',
    title: 'Temperature rising to 28°C - hydration advisory',
    desc: 'Broadcasting hydration messages on big screens. Free water stations set up at all concourses.',
    time: '12 min ago',
    priority: 'medium',
    unread: true,
  },
  {
    id: '5',
    category: 'medical',
    icon: '🏥',
    title: 'Defibrillator deployed at Gate C',
    desc: 'First responder team confirmed on-scene. Patient stabilized, ambulance routed to Gate C bay.',
    time: '15 min ago',
    priority: 'critical',
    unread: true,
  },
  {
    id: '6',
    category: 'crowd',
    icon: '👥',
    title: 'Gate B queue exceeding 10 minutes',
    desc: 'Staff redeployed from Gate A to Gate B to double ticket scanning capacity and reduce wait times.',
    time: '18 min ago',
    priority: 'high',
    unread: true,
  },
  {
    id: '7',
    category: 'transport',
    icon: '🚇',
    title: 'Parking Lot A reaching capacity (85%)',
    desc: 'Dynamic road signs updated to route incoming drivers to Lot C overflow area.',
    time: '22 min ago',
    priority: 'medium',
    unread: false,
  },
  {
    id: '8',
    category: 'medical',
    icon: '🏥',
    title: 'Heat exhaustion case treated - Section 204',
    desc: 'Fan treated at Section 204 first aid station. Discharged and returning to seat with water pack.',
    time: '25 min ago',
    priority: 'high',
    unread: false,
  },
  {
    id: '9',
    category: 'crowd',
    icon: '👥',
    title: 'Halftime rush expected in 5 minutes',
    desc: 'Concession staff alerted. Security positioned at main egress corridors for crowd control.',
    time: '28 min ago',
    priority: 'medium',
    unread: false,
  },
  {
    id: '10',
    category: 'transport',
    icon: '🚇',
    title: 'Additional shuttle dispatched to Airport route',
    desc: 'Increase frequency to accommodate early-leaving travelers and flight crews.',
    time: '32 min ago',
    priority: 'low',
    unread: false,
  },
  {
    id: '11',
    category: 'medical',
    icon: '🏥',
    title: 'First aid supplies restocked at Station 3',
    desc: 'Station fully stocked with ice packs, bandages, water bottles, and emergency kits.',
    time: '40 min ago',
    priority: 'low',
    unread: false,
  },
  {
    id: '12',
    category: 'emergency',
    icon: '🚨',
    title: 'All clear - false fire alarm Block F resolved',
    desc: 'Verified by local security detail. Sensor fault identified and bypassed. Normal operations.',
    time: '45 min ago',
    priority: 'high',
    unread: false,
  },
];

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [activeTab, setActiveTab] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      containerRef.current
        ?.querySelectorAll(`.${styles.notificationItem}`)
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
        gsap.to(`.${styles.notificationItem}`, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'power3.out',
        });
      }, containerRef);
    })();

    return () => ctx?.revert();
  }, [activeTab]);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleClearResolved = () => {
    setNotifications((prev) => prev.filter((n) => n.priority !== 'low' && n.unread));
  };

  const filteredNotifs = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const getTabCount = (tab: string) => {
    if (tab === 'all') return notifications.length;
    return notifications.filter((n) => n.category === tab).length;
  };

  return (
    <>
      <Navbar />
      <div className={styles.page} ref={containerRef}>
        <div className={styles.container}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerLeft}>
              <div className={styles.titleRow}>
                <h1 className={styles.title}>Notification Center</h1>
                {unreadCount > 0 && (
                  <span className={styles.unreadBadge}>
                    <span className={styles.unreadDot} />
                    {unreadCount} unread
                  </span>
                )}
              </div>
              <p className={styles.subtitle}>Real-time alerts, emergencies, and crowd coordinates</p>
            </div>
          </header>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            {['all', 'crowd', 'emergency', 'transport', 'weather', 'medical'].map((tab) => (
              <button
                key={tab}
                className={`${styles.filterTab} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => handleTabClick(tab)}
              >
                <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                <span className={styles.tabCount}>{getTabCount(tab)}</span>
              </button>
            ))}
          </div>

          {/* Notification List */}
          <div className={styles.notificationList}>
            {filteredNotifs.length > 0 ? (
              filteredNotifs.map((n) => (
                <div
                  key={n.id}
                  className={styles.notificationItem}
                  style={{ opacity: 1, transform: 'none' }} // Avoid zero-opacity render before GSAP kicks in
                >
                  <GlassCard padding="md" variant={n.unread ? 'highlighted' : 'default'}>
                    <div className={styles.notificationInner}>
                      {n.unread && <span className={styles.unreadIndicator} />}
                      <span className={`${styles.notifIcon} ${styles[n.category]}`}>{n.icon}</span>
                      
                      <div className={styles.notifBody}>
                        <div className={styles.notifHeader}>
                          <h4 className={`${styles.notifTitle} ${n.unread ? styles.unread : styles.read}`}>
                            {n.title}
                          </h4>
                          <div className={styles.notifMeta}>
                            <span className={styles.timestamp}>{n.time}</span>
                            <span className={`${styles.priorityBadge} ${styles[n.priority]}`}>
                              {n.priority}
                            </span>
                          </div>
                        </div>
                        <p className={styles.notifDesc}>{n.desc}</p>
                      </div>

                      <div className={styles.notifActions}>
                        {n.unread && (
                          <button
                            onClick={() => handleMarkRead(n.id)}
                            className={`${styles.actionBtn} ${styles.readBtn}`}
                            title="Mark as read"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={() => handleDismiss(n.id)}
                          className={`${styles.actionBtn} ${styles.dismissBtn}`}
                          title="Dismiss alert"
                        >
                          ✕
                        </button>
                      </div>

                      <div className={styles.timelineConnector} />
                    </div>
                  </GlassCard>
                </div>
              ))
            ) : (
              <div className={styles.emptyState}>
                <span className={styles.emptyIcon}>📭</span>
                <h3 className={styles.emptyTitle}>No notifications found</h3>
                <p className={styles.emptyDesc}>Everything looks clear in this category.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sticky Bottom Actions Bar */}
        <div className={styles.quickActions}>
          <div className={styles.quickActionsInner}>
            <div className={styles.quickActionsLeft}>
              <span>Status Vitals: Nominal</span>
            </div>
            <div className={styles.quickActionsRight}>
              <button onClick={handleMarkAllRead} className={styles.quickActionBtn}>
                Mark All Read
              </button>
              <button onClick={handleClearResolved} className={`${styles.quickActionBtn} ${styles.danger}`}>
                Clear Resolved
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
