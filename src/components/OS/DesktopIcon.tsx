'use client';

import { motion } from 'framer-motion';
import { File } from '@/types/os';

interface Props {
  file: File;
  onDoubleClick: (e: React.MouseEvent) => void;
}

// XP風SVGアイコン群
const XPIcons = {
  trash: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="trashBody" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c8d8f0" />
          <stop offset="100%" stopColor="#7090c0" />
        </linearGradient>
      </defs>
      {/* 本体 */}
      <rect x="6" y="10" width="20" height="18" rx="1" fill="url(#trashBody)" stroke="#4060a0" strokeWidth="0.8" />
      {/* ライン */}
      {[13, 16, 19].map(x => (
        <line key={x} x1={x} y1="13" x2={x} y2="25" stroke="#4060a0" strokeWidth="0.8" />
      ))}
      {/* 蓋 */}
      <rect x="4" y="7" width="24" height="4" rx="1" fill="#a0b8e0" stroke="#4060a0" strokeWidth="0.8" />
      {/* ハンドル */}
      <rect x="12" y="4" width="8" height="4" rx="1" fill="#8090b8" stroke="#4060a0" strokeWidth="0.8" />
    </svg>
  ),

  text: (id?: string) => {
    const isSecret = id === 'secret_txt';
    return (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="textPage" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#e8eef8" />
          </linearGradient>
        </defs>
        {/* 本体 */}
        <polygon points="4,2 22,2 28,8 28,30 4,30" fill="url(#textPage)" stroke="#8aabcc" strokeWidth="0.8" />
        {/* 折り目 */}
        <polygon points="22,2 28,8 22,8" fill="#c0d4e8" stroke="#8aabcc" strokeWidth="0.8" />
        {/* テキストライン */}
        {[13, 17, 21, 25].map((y, i) => (
          <line key={y} x1="8" y1={y} x2={i === 3 ? "20" : "24"} y2={y} stroke="#b0c0d8" strokeWidth="1.2" />
        ))}
        {/* ラベル */}
        {isSecret ? (
          <>
            <rect x="2" y="20" width="14" height="8" rx="1" fill="#cc0000" />
            <text x="9" y="27" fontSize="5" fontWeight="bold" fill="#fff" textAnchor="middle">秘</text>
          </>
        ) : (
          <>
            <rect x="2" y="22" width="14" height="7" rx="1" fill="#215dc6" />
            <text x="9" y="27.5" fontSize="5" fontWeight="bold" fill="#fff" textAnchor="middle">TXT</text>
          </>
        )}
      </svg>
    );
  },

  image: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="imgBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e8f0f8" />
          <stop offset="100%" stopColor="#c0d8f0" />
        </linearGradient>
      </defs>
      <rect x="2" y="4" width="28" height="24" rx="2" fill="url(#imgBg)" stroke="#7090c0" strokeWidth="0.8" />
      {/* 空 */}
      <rect x="2" y="4" width="28" height="10" rx="2" fill="#87ceeb" />
      <circle cx="24" cy="9" r="4" fill="#ffd700" />
      {/* 山 */}
      <polygon points="2,28 12,14 20,20 26,14 30,28" fill="#5a9a5a" />
      <rect x="2" y="28" width="28" height="0.5" fill="#4a8a4a" />
    </svg>
  ),

  folder: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="folderTop" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd870" />
          <stop offset="100%" stopColor="#e8a020" />
        </linearGradient>
        <linearGradient id="folderBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffe898" />
          <stop offset="100%" stopColor="#f0b030" />
        </linearGradient>
      </defs>
      <rect x="2" y="12" width="28" height="18" rx="2" fill="url(#folderBody)" stroke="#c08020" strokeWidth="0.8" />
      <path d="M2,12 Q2,8 6,8 L13,8 L15,12 Z" fill="url(#folderTop)" stroke="#c08020" strokeWidth="0.8" />
    </svg>
  ),

  browser: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <radialGradient id="globeBg" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#80c8ff" />
          <stop offset="60%" stopColor="#1060cc" />
          <stop offset="100%" stopColor="#082080" />
        </radialGradient>
      </defs>
      <circle cx="16" cy="16" r="14" fill="url(#globeBg)" stroke="#0040a0" strokeWidth="0.8" />
      {/* 経線 */}
      <ellipse cx="16" cy="16" rx="6" ry="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      <ellipse cx="16" cy="16" rx="10" ry="14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      {/* 緯線 */}
      <line x1="2" y1="16" x2="30" y2="16" stroke="rgba(255,255,255,0.4)" strokeWidth="0.8" />
      <ellipse cx="16" cy="16" rx="14" ry="5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.5" />
      <circle cx="16" cy="16" r="14" fill="none" stroke="#0050cc" strokeWidth="0.8" />
    </svg>
  ),

  mail: () => (
    <svg width="32" height="32" viewBox="0 0 32 32">
      <defs>
        <linearGradient id="mailBody" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#ddeeff" />
        </linearGradient>
      </defs>
      <rect x="2" y="6" width="28" height="20" rx="2" fill="url(#mailBody)" stroke="#6090c0" strokeWidth="0.8" />
      {/* 封筒フラップ */}
      <polyline points="2,6 16,18 30,6" fill="none" stroke="#4070a0" strokeWidth="1" />
      <line x1="2" y1="26" x2="12" y2="16" stroke="#4070a0" strokeWidth="0.8" />
      <line x1="30" y1="26" x2="20" y2="16" stroke="#4070a0" strokeWidth="0.8" />
    </svg>
  ),

  app: (iconId?: string) => {
    if (iconId === 'secret_app_file') {
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          {/* 暗い背景 */}
          <rect x="2" y="2" width="28" height="28" rx="4" fill="#111" stroke="#2a2a2a" strokeWidth="1" />
          {/* 赤い警告シールド */}
          <g transform="translate(4, 4)">
            <path 
              d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
              fill="none" stroke="#ff3333" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" 
              style={{ filter: 'drop-shadow(0px 0px 3px rgba(255,51,51,0.6))' }}
            />
            <line 
              x1="12" y1="8" x2="12" y2="12" 
              stroke="#ff3333" strokeWidth="2.5" strokeLinecap="round" 
              style={{ filter: 'drop-shadow(0px 0px 3px rgba(255,51,51,0.6))' }}
            />
            <circle 
              cx="12" cy="16" r="1.5" fill="#ff3333" 
              style={{ filter: 'drop-shadow(0px 0px 3px rgba(255,51,51,0.6))' }}
            />
          </g>
        </svg>
      );
    }
    if (iconId === 'ddrop_decryptor') {
      return (
        <svg width="32" height="32" viewBox="0 0 32 32">
          <rect x="2" y="2" width="28" height="28" rx="3" fill="#1a1a2e" stroke="#4040aa" strokeWidth="1" />
          <text x="16" y="20" fontSize="14" fontWeight="bold" fill="#6060cc" textAnchor="middle">D</text>
          <rect x="6" y="24" width="20" height="2" fill="#3030aa" rx="1" />
        </svg>
      );
    }
    return (
      <svg width="32" height="32" viewBox="0 0 32 32">
        <defs>
          <linearGradient id="appBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#80c0ff" />
            <stop offset="100%" stopColor="#0060cc" />
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="28" height="28" rx="4" fill="url(#appBg)" />
        <rect x="4" y="4" width="24" height="16" rx="2" fill="rgba(255,255,255,0.9)" />
        <rect x="4" y="20" width="24" height="8" rx="2" fill="rgba(255,255,255,0.2)" />
        <circle cx="10" cy="26" r="2" fill="rgba(255,255,255,0.6)" />
      </svg>
    );
  },
};

export const DesktopIcon = ({ file, onDoubleClick }: Props) => {
  const renderIcon = () => {
    switch (file.type) {
      case 'trash': return <XPIcons.trash />;
      case 'text': return XPIcons.text(file.id);
      case 'image': return <XPIcons.image />;
      case 'folder': return <XPIcons.folder />;
      case 'browser': return <XPIcons.browser />;
      case 'mail': return <XPIcons.mail />;
      case 'app': return XPIcons.app(file.id);
      default: return XPIcons.text(undefined);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      onDoubleClick={onDoubleClick}
      className="desktop-icon-container"
      style={{
        position: 'absolute',
        left: file.position.x,
        top: file.position.y,
        width: 72,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'default',
        padding: '4px 2px',
        borderRadius: 3,
        zIndex: 10,
        userSelect: 'none',
      }}
      whileHover={{
        backgroundColor: 'rgba(49, 106, 197, 0.4)',
        outline: '1px solid rgba(255, 255, 255, 0.5)',
      }}
    >
      <div style={{ width: 32, height: 32, marginBottom: 4, filter: file.isCorrupted ? 'grayscale(100%) brightness(0.5)' : 'drop-shadow(1px 2px 2px rgba(0,0,0,0.4))' }}>
        {renderIcon()}
      </div>
      <span style={{
        fontSize: 11,
        color: '#fff',
        textAlign: 'center',
        textShadow: '1px 1px 2px #000, -1px -1px 2px #000',
        wordBreak: 'break-all',
        lineHeight: 1.2,
        padding: '0 2px',
        maxWidth: 72,
      }}>
        {file.name}
      </span>
    </motion.div>
  );
};
