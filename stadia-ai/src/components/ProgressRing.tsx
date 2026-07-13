'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './ProgressRing.module.css';

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  showPercent?: boolean;
}

export default function ProgressRing({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = '#3B82F6',
  label,
  showPercent = true,
}: ProgressRingProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = (animatedValue / max) * 100;
  const offset = circumference - (percent / 100) * circumference;

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          hasAnimated.current = true;
          const duration = 1200;
          const start = performance.now();

          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setAnimatedValue(Math.round(eased * value));
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

  return (
    <div ref={ref} className={styles.container}>
      <svg width={size} height={size} className={styles.svg}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={styles.progress}
          style={{
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      <div className={styles.center}>
        {showPercent && (
          <span className={styles.percent}>{Math.round(percent)}%</span>
        )}
        {label && <span className={styles.label}>{label}</span>}
      </div>
    </div>
  );
}
