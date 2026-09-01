import React from 'react';
import styles from './GlassPanel.module.css';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, className = '' }) => {
  return <div className={`${styles.panel} glass ${className}`}>{children}</div>;
};

