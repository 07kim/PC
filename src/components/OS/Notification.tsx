'use client';

import { motion } from 'framer-motion';
import { X, Info } from 'lucide-react';

interface Props {
  title: string;
  message: string;
  onClose: () => void;
}

export const Notification = ({ title, message, onClose }: Props) => {
  return (
    <motion.div
      initial={{ x: 300, opacity: 0, scale: 0.8 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 300, opacity: 0, scale: 0.8 }}
      style={{
        position: 'absolute', bottom: 40, right: 15, width: 260,
        background: '#ffffe1', border: '1px solid #000', borderRadius: 8,
        padding: '10px 12px', zIndex: 100005, boxShadow: '3px 3px 6px rgba(0,0,0,0.3)',
        fontSize: 12, color: '#000', cursor: 'pointer'
      }}
      onClick={onClose}
    >
      {/* Balloon Tip Beak */}
      <div style={{
        position: 'absolute', bottom: -10, right: 20, width: 0, height: 0,
        borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
        borderTop: '10px solid #000'
      }} />
      <div style={{
        position: 'absolute', bottom: -9, right: 21, width: 0, height: 0,
        borderLeft: '9px solid transparent', borderRight: '9px solid transparent',
        borderTop: '9px solid #ffffe1', zIndex: 1
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 'bold', color: '#000' }}>
          <Info size={16} color="#0055e0" /> {title}
        </div>
        <X size={14} style={{ opacity: 0.6 }} />
      </div>
      <div style={{ lineHeight: 1.4, color: '#333' }}>{message}</div>
    </motion.div>
  );
};
