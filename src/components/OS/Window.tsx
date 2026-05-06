'use client';

import { useState } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X, Minus, Square, Lock } from 'lucide-react';

interface Props {
  window: any;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  onUnlock: (password: string) => void;
  children: React.ReactNode;
}

// ウィンドウタイプ別のXP風アイコン
const WindowTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'browser':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="7" fill="#1060cc" />
          <ellipse cx="8" cy="8" rx="3" ry="7" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
          <line x1="1" y1="8" x2="15" y2="8" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
        </svg>
      );
    case 'mail':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="1" y="3" width="14" height="10" rx="1" fill="#ffe878" stroke="#c09818" strokeWidth="0.8" />
          <polyline points="1,3 8,9 15,3" fill="none" stroke="#c09818" strokeWidth="1" />
        </svg>
      );
    case 'text':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <polygon points="2,1 11,1 14,4 14,15 2,15" fill="#fff" stroke="#8aabcc" strokeWidth="0.8" />
          <polygon points="11,1 14,4 11,4" fill="#c0d4e8" stroke="#8aabcc" strokeWidth="0.8" />
          <line x1="4" y1="7" x2="12" y2="7" stroke="#b0c0d8" strokeWidth="1" />
          <line x1="4" y1="10" x2="12" y2="10" stroke="#b0c0d8" strokeWidth="1" />
          <line x1="4" y1="13" x2="9" y2="13" stroke="#b0c0d8" strokeWidth="1" />
        </svg>
      );
    case 'folder':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="1" y="6" width="14" height="9" rx="1" fill="#f0b030" stroke="#c08020" strokeWidth="0.8" />
          <path d="M1,6 Q1,4 3,4 L7,4 L8,6 Z" fill="#ffd870" stroke="#c08020" strokeWidth="0.8" />
        </svg>
      );
    case 'trash':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="3" y="5" width="10" height="9" rx="1" fill="#c8d8f0" stroke="#4060a0" strokeWidth="0.8" />
          <rect x="2" y="3" width="12" height="3" rx="0.5" fill="#a0b8e0" stroke="#4060a0" strokeWidth="0.8" />
          <rect x="6" y="1" width="4" height="3" rx="0.5" fill="#8090b8" stroke="#4060a0" strokeWidth="0.8" />
        </svg>
      );
    case 'image':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="1" y="2" width="14" height="12" rx="1" fill="#87ceeb" stroke="#7090c0" strokeWidth="0.8" />
          <circle cx="12" cy="5" r="2" fill="#ffd700" />
          <polygon points="1,14 6,7 10,10 13,7 15,14" fill="#5a9a5a" />
        </svg>
      );
    default:
      return (
        <svg width="16" height="16" viewBox="0 0 16 16">
          <rect x="1" y="1" width="14" height="14" rx="2" fill="#3080ee" />
          <rect x="2" y="2" width="12" height="8" rx="1" fill="rgba(255,255,255,0.9)" />
        </svg>
      );
  }
};

export const Window = ({ window: win, isActive, onClose, onMinimize, onMaximize, onFocus, onUnlock, children }: Props) => {
  const [password, setPassword] = useState('');
  const dragControls = useDragControls();

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    onUnlock(password);
    setPassword('');
  };

  const isMaximized = win.isMaximized;

  return (
    <motion.div
      drag={!isMaximized}
      dragControls={dragControls}
      dragListener={false}
      dragMomentum={false}
      onMouseDown={onFocus}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        zIndex: win.zIndex,
        top: isMaximized ? 0 : win.y,
        left: isMaximized ? 0 : win.x,
        width: isMaximized ? '100%' : win.width ?? 720,
        height: isMaximized ? '100%' : win.height ?? 520,
      }}
      transition={{ duration: 0.15, ease: 'easeOut' }}
      className="xp-window"
      style={{
        position: 'absolute',
        display: win.isMinimized ? 'none' : 'flex',
        flexDirection: 'column',
        userSelect: 'none',
        pointerEvents: 'auto',
        borderRadius: isMaximized ? 0 : '7px 7px 0 0',
        boxShadow: isActive
          ? '0 8px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.5)'
          : '0 4px 12px rgba(0,0,0,0.4)',
        border: `1px solid ${isActive ? '#0050cc' : '#6080b8'}`,
        overflow: 'hidden',
      }}
    >
      {/* タイトルバー */}
      <div
        className="xp-title-bar"
        onPointerDown={(e) => !isMaximized && dragControls.start(e)}
        onDoubleClick={onMaximize}
        style={{
          flexShrink: 0,
          height: 28,
          cursor: isMaximized ? 'default' : 'move',
          borderRadius: isMaximized ? 0 : '5px 5px 0 0',
          background: isActive
            ? 'linear-gradient(to bottom, #0a6cf5 0%, #3a9cf8 12%, #0a6cf5 30%, #0058e3 85%, #002e92 100%)'
            : 'linear-gradient(to bottom, #7697da 0%, #9db8f2 12%, #7697da 30%, #6888c8 85%, #4a68a4 100%)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 4px 0 6px',
          gap: 5,
        }}
      >
        {/* アイコン */}
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <WindowTypeIcon type={win.type} />
        </div>
        {/* タイトル */}
        <span style={{
          flex: 1,
          fontSize: 12,
          fontWeight: 'bold',
          color: '#fff',
          fontFamily: 'Tahoma, sans-serif',
          textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {win.title || win.name}
        </span>
        {/* ボタン群 */}
        <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
          <TitleBtn onClick={onMinimize} type="min"><Minus size={11} strokeWidth={3} /></TitleBtn>
          <TitleBtn onClick={onMaximize} type="max"><Square size={9} strokeWidth={2.5} /></TitleBtn>
          <TitleBtn onClick={onClose} type="close"><X size={12} strokeWidth={3} /></TitleBtn>
        </div>
      </div>

      {/* コンテンツエリア */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {win.isLocked && !win.isUnlocked ? (
          <div style={{
            position: 'absolute', inset: 0, background: '#ece9d8', zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Tahoma, sans-serif',
          }}>
            <div style={{
              background: '#fff', border: '1px solid #0055e0', borderRadius: 6, padding: '28px 32px',
              boxShadow: '4px 4px 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', alignItems: 'center',
              minWidth: 280,
            }}>
              <div style={{ marginBottom: 16 }}>
                <svg width="48" height="48" viewBox="0 0 48 48">
                  <rect x="12" y="20" width="24" height="22" rx="3" fill="#0055e0" />
                  <path d="M14,20 L14,14 Q14,6 24,6 Q34,6 34,14 L34,20" fill="none" stroke="#0055e0" strokeWidth="4" strokeLinecap="round" />
                  <circle cx="24" cy="30" r="3" fill="#fff" />
                  <line x1="24" y1="32" x2="24" y2="37" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <h3 style={{ fontSize: 14, color: '#0055e0', marginBottom: 8, fontWeight: 'bold' }}>認証が必要です</h3>
              <p style={{ fontSize: 11, color: '#666', marginBottom: 20, textAlign: 'center' }}>
                この機密文書を開くには<br />パスワードを入力してください。
              </p>
              <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
                <input
                  autoFocus
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="パスワード"
                  style={{
                    padding: '7px 10px',
                    border: '1px solid #7f9db9',
                    fontSize: 12,
                    outline: 'none',
                    fontFamily: 'Tahoma, sans-serif',
                  }}
                />
                <button type="submit" style={{
                  padding: '6px',
                  background: 'linear-gradient(to bottom, #f0f0f0, #dcdcdc)',
                  border: '1px solid #7f9db9',
                  fontSize: 12,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'Tahoma, sans-serif',
                }}>
                  解除
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            {children}
          </div>
        )}
      </div>
    </motion.div>
  );
};

function TitleBtn({ onClick, type, children }: { onClick: () => void; type: 'min' | 'max' | 'close'; children: React.ReactNode }) {
  const baseColor = type === 'close'
    ? 'linear-gradient(to bottom, #e04343 0%, #f87070 12%, #e04343 30%, #cc0000 85%, #8b1e1e 100%)'
    : 'linear-gradient(to bottom, #3596f3 0%, #70b8f8 12%, #3596f3 30%, #1a78e4 85%, #1050b8 100%)';

  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{
        width: 22,
        height: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: baseColor,
        border: '1px solid rgba(255,255,255,0.4)',
        borderRadius: 3,
        color: '#fff',
        cursor: 'pointer',
        boxShadow: 'inset 1px 1px 1px rgba(255,255,255,0.3), inset -1px -1px 1px rgba(0,0,0,0.2)',
        flexShrink: 0,
      }}
    >
      {children}
    </button>
  );
}
