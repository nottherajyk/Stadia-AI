'use client';

import { ReactNode } from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  children: ReactNode;
  variant?: 'default' | 'highlighted' | 'danger' | 'success' | 'warning';
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export default function GlassCard({
  children,
  variant = 'default',
  className = '',
  padding = 'lg',
  hover = true,
  glow = false,
  onClick,
}: GlassCardProps) {
  return (
    <div
      className={`${styles.card} ${styles[variant]} ${styles[`pad-${padding}`]} ${hover ? styles.hoverable : ''} ${glow ? styles.glow : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
}
