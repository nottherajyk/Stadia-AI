'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './KPIWidget.module.css';

interface KPIWidgetProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  trend?: number;
  icon?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  format?: 'number' | 'percent' | 'compact';
}

export default function KPIWidget({
  label,
  value,
  suffix = '',
  prefix = '',
  trend,
  icon,
  color = 'primary',
  format = 'number',
}: KPIWidgetProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          hasAnimated.current = true;
          const duration = 1500;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(animate);
          };

          requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  const formatValue = (v: number) => {
    if (format === 'compact') {
      if (v >= 1000000) return (v / 1000000).toFixed(1) + 'M';
      if (v >= 1000) return (v / 1000).toFixed(1) + 'K';
    }
    if (format === 'percent') return v + '%';
    return v.toLocaleString();
  };

  return (
    <div ref={ref} className={`${styles.widget} ${styles[color]}`}>
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.label}>{label}</span>
      </div>
      <div className={styles.value}>
        {prefix}
        <span className={styles.number}>{formatValue(displayValue)}</span>
        {suffix}
      </div>
      {trend !== undefined && (
        <div className={`${styles.trend} ${trend >= 0 ? styles.trendUp : styles.trendDown}`}>
          <span className={styles.trendArrow}>{trend >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend)}%</span>
          <span className={styles.trendLabel}>vs last hour</span>
        </div>
      )}
    </div>
  );
}
