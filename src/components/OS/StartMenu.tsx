'use client';

import { LogOut, Power, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (id: string, name: string, type: any) => void;
  onShutdown: () => void;
  onLogoff: () => void;
  isMaintenanceDownloaded?: boolean;
}

// XP風SVGアイコン
const IEIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32">
    <defs>
      <radialGradient id="ie_globe" cx="40%" cy="35%">
        <stop offset="0%" stopColor="#80d0ff" />
        <stop offset="60%" stopColor="#1060dd" />
        <stop offset="100%" stopColor="#082080" />
      </radialGradient>
    </defs>
    <circle cx="16" cy="16" r="13" fill="url(#ie_globe)" />
    <ellipse cx="16" cy="16" rx="6" ry="13" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
    <line x1="3" y1="16" x2="29" y2="16" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
    <ellipse cx="16" cy="16" rx="13" ry="5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
  </svg>
);

const MailIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32">
    <rect x="2" y="7" width="28" height="18" rx="2" fill="#ffe8a0" stroke="#c0a020" strokeWidth="1" />
    <polyline points="2,7 16,19 30,7" fill="none" stroke="#c0a020" strokeWidth="1.5" />
    <line x1="2" y1="25" x2="11" y2="16" stroke="#c0a020" strokeWidth="1" />
    <line x1="30" y1="25" x2="21" y2="16" stroke="#c0a020" strokeWidth="1" />
    <rect x="1" y="6" width="30" height="3" rx="1" fill="#ffd050" stroke="#c0a020" strokeWidth="0.8" />
  </svg>
);

const FolderIcon = () => (
  <svg width="20" height="20" viewBox="0 0 32 32">
    <rect x="2" y="12" width="28" height="18" rx="2" fill="#f0b030" stroke="#c08020" strokeWidth="0.8" />
    <path d="M2,12 Q2,8 6,8 L13,8 L15,12 Z" fill="#ffd870" stroke="#c08020" strokeWidth="0.8" />
    <rect x="4" y="16" width="24" height="10" rx="1" fill="rgba(255,255,255,0.15)" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="24" height="24" viewBox="0 0 32 32">
    <path d="M16,2 L28,7 L28,18 Q28,26 16,30 Q4,26 4,18 L4,7 Z" fill="#1060cc" stroke="#0040aa" strokeWidth="1" />
    <path d="M16,5 L25,9 L25,18 Q25,24 16,27 Q7,24 7,18 L7,9 Z" fill="#3080ee" />
    <path d="M12,16 L15,19 L20,12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);



export const StartMenu = ({ isOpen, onClose, onOpenApp, onShutdown, onLogoff, isMaintenanceDownloaded }: Props) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 30,
            left: 0,
            width: 380,
            height: 500,
            background: '#fff',
            border: '1px solid #0055e0',
            borderRadius: '5px 5px 0 0',
            zIndex: 100001,
            boxShadow: '5px -5px 20px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'Tahoma, sans-serif',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ヘッダー */}
          <div style={{
            height: 54,
            background: 'linear-gradient(to bottom, #2060d0 0%, #1a50c0 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: 10,
            borderBottom: '1px solid rgba(255,255,255,0.3)',
          }}>
            {/* ユーザーアイコン */}
            <div style={{
              width: 40, height: 40,
              background: 'linear-gradient(135deg, #c0d8f8, #7090d0)',
              borderRadius: 3, border: '2px solid rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20,
            }}>
              👤
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: 13, color: '#fff', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>SY</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)' }}>Administrator</div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>
            {/* 左ペイン（よく使うアプリ） */}
            <div style={{ width: '52%', padding: '6px 0', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
              {/* ピン留めアプリ */}
              <AppItem icon={<IEIcon />} name="Internet Explorer" sub="（インターネット）" onClick={() => { onOpenApp('browser', 'Internet Explorer', 'browser'); onClose(); }} />
              <AppItem icon={<MailIcon />} name="Outlook Express" sub="（メール）" onClick={() => { onOpenApp('mail', 'Outlook Express', 'mail'); onClose(); }} />
              
              <div style={{ height: 1, background: 'linear-gradient(to right, transparent, #ccc, transparent)', margin: '4px 8px' }} />
              
              {isMaintenanceDownloaded && (
                <AppItem icon={<ShieldIcon />} name="D-DROP Decryptor" sub="" onClick={() => { onOpenApp('maintenance', 'D-DROP Decryptor', 'app'); onClose(); }} />
              )}
              
              <div style={{ flex: 1 }} />
              
              {/* すべてのプログラム */}
              <div style={{
                borderTop: '1px solid #ccc',
                padding: '6px 10px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', fontSize: 11, fontWeight: 'bold', color: '#000',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#316ac5'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span>すべてのプログラム(P)</span>
                <span style={{ color: '#316ac5' }}>▶</span>
              </div>
            </div>

            {/* 右ペイン（場所） */}
            <div style={{
              width: '48%',
              background: 'linear-gradient(to bottom, #d8e8f8 0%, #c8d8f0 100%)',
              borderLeft: '1px solid #91b0df',
              padding: '6px 0',
              display: 'flex', flexDirection: 'column', gap: 1,
            }}>
              <PlaceItem icon={<FolderIcon />} name="エクスプローラー" bold onClick={() => { onOpenApp('explorer', 'エクスプローラー', 'desktop'); onClose(); }} />
              
              <div style={{ height: 1, background: 'rgba(0,50,150,0.2)', margin: '3px 6px' }} />
              
              <PlaceItem icon={<Settings size={18} color="#4060b0" />} name="設定" onClick={() => { onOpenApp('settings', '設定', 'app'); onClose(); }} />
            </div>
          </div>

          {/* フッター */}
          <div style={{
            height: 40,
            background: 'linear-gradient(to bottom, #1450b8, #1060cc)',
            borderTop: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 10px',
            gap: 10,
          }}>
            <FooterBtn
              icon={<LogOut size={14} />}
              text="ログオフ(L)"
              onClick={() => { onClose(); onLogoff(); }}
            />
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.2)' }} />
            <FooterBtn
              icon={<Power size={14} />}
              text="終了(U)"
              onClick={() => { onClose(); onShutdown(); }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

function AppItem({ icon, name, sub, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', padding: '5px 8px', gap: 8, cursor: 'pointer', userSelect: 'none' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#316ac5';
        e.currentTarget.style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color = 'inherit';
      }}
    >
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <span style={{ fontSize: 11, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</span>
        {sub && <span style={{ fontSize: 9, color: '#888', whiteSpace: 'nowrap' }}>{sub}</span>}
      </div>
    </div>
  );
}

function PlaceItem({ icon, name, bold, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', padding: '4px 10px', gap: 8, cursor: 'pointer', userSelect: 'none' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = '#316ac5';
        (e.currentTarget.querySelector('span') as HTMLElement).style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent';
        (e.currentTarget.querySelector('span') as HTMLElement).style.color = '#00156e';
      }}
    >
      <div style={{ flexShrink: 0, width: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
      <span style={{ fontSize: 11, fontWeight: bold ? 'bold' : 'normal', color: '#00156e', whiteSpace: 'nowrap' }}>{name}</span>
    </div>
  );
}

function FooterBtn({ icon, text, onClick }: any) {
  return (
    <div
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#fff', cursor: 'pointer', fontSize: 11, fontWeight: 'bold', padding: '3px 6px', borderRadius: 2 }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <div style={{ background: 'rgba(255,150,50,0.9)', padding: 2, borderRadius: 2, border: '1px solid rgba(255,255,255,0.4)', display: 'flex' }}>{icon}</div>
      {text}
    </div>
  );
}
