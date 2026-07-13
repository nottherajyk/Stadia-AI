'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

const navItems = [
  { href: '/', label: 'Home', icon: '⚡' },
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/assistant', label: 'AI Assistant', icon: '🤖' },
  { href: '/map', label: 'Stadium Map', icon: '🗺️' },
  { href: '/crowd', label: 'Crowd Intel', icon: '👥' },
  { href: '/operations', label: 'Operations', icon: '🎯' },
  { href: '/accessibility', label: 'Access', icon: '♿' },
  { href: '/transport', label: 'Transport', icon: '🚇' },
  { href: '/sustainability', label: 'Green', icon: '🌱' },
  { href: '/notifications', label: 'Alerts', icon: '🔔' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <circle cx="14" cy="14" r="12" stroke="url(#grad)" strokeWidth="2" />
                <circle cx="14" cy="14" r="6" fill="url(#grad)" opacity="0.8" />
                <path d="M14 2 L14 26 M2 14 L26 14" stroke="url(#grad)" strokeWidth="1" opacity="0.3" />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#3B82F6" />
                    <stop offset="50%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#8B5CF6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className={styles.logoText}>StadiaAI</span>
          </Link>

          <div className={`${styles.links} ${mobileOpen ? styles.linksOpen : ''}`}>
            {navItems.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.link} ${pathname === item.href ? styles.active : ''}`}
              >
                <span className={styles.linkIcon}>{item.icon}</span>
                <span className={styles.linkLabel}>{item.label}</span>
                {pathname === item.href && <div className={styles.activeGlow} />}
              </Link>
            ))}
          </div>

          <div className={styles.actions}>
            <button className={styles.cmdBtn} aria-label="Command palette">
              <span>⌘K</span>
            </button>
            <StatusDot />
          </div>

          <button
            className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}
    </>
  );
}

function StatusDot() {
  return (
    <div className={styles.statusDot}>
      <span className={styles.dotInner} />
      <span className={styles.dotPulse} />
    </div>
  );
}
