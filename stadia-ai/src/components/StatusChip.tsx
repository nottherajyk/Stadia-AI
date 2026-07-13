'use client';

import styles from './StatusChip.module.css';

interface StatusChipProps {
  label: string;
  status: 'active' | 'warning' | 'danger' | 'neutral' | 'success';
  pulse?: boolean;
  size?: 'sm' | 'md';
}

export default function StatusChip({
  label,
  status,
  pulse = false,
  size = 'md',
}: StatusChipProps) {
  return (
    <span className={`${styles.chip} ${styles[status]} ${styles[size]}`}>
      <span className={`${styles.dot} ${pulse ? styles.pulse : ''}`} />
      {label}
    </span>
  );
}
