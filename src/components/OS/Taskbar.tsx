'use client';

import { Wifi, Volume2, Monitor } from 'lucide-react';

interface Props {
  windows: any[];
  activeWindowId: string | null;
  systemTime: Date;
  onTrayClick: (type: 'clock' | 'wifi') => void;
  onWindowClick: (id: string) => void;
  onToggleStartMenu: () => void;
}

export const Taskbar = ({ windows, activeWindowId, systemTime, onTrayClick, onWindowClick, onToggleStartMenu }: Props) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="xp-taskbar" style={{
      height: 30, 
      background: 'linear-gradient(to bottom, #245edb 0%, #3f8cf3 9%, #245edb 18%, #245edb 92%, #1941a5 100%)',
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      zIndex: 100000,
      borderTop: '1px solid #003fc7',
      position: 'relative',
      userSelect: 'none'
    }}>
      {/* Start Button */}
      <div 
        className="xp-start-button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleStartMenu();
        }}
      >
        <Monitor size={18} fill="#fff" stroke="#fff" />
        <span>start</span>
      </div>

      {/* Window Tabs */}
      <div style={{ flex: 1, display: 'flex', gap: 2, padding: '0 10px', height: '100%', alignItems: 'center', overflow: 'hidden' }}>
        {windows.map(win => (
          <div
            key={win.id}
            className={`xp-taskbar-tab ${activeWindowId === win.id ? 'active' : ''}`}
            onClick={() => onWindowClick(win.id)}
          >
            <div style={{ 
              width: 14, height: 14, 
              background: 'linear-gradient(135deg, #fff 0%, #ddd 100%)', 
              borderRadius: 2,
              border: '1px solid #999',
              flexShrink: 0
            }} />
            <span style={{ 
              whiteSpace: 'nowrap', 
              overflow: 'hidden', 
              textOverflow: 'ellipsis',
              textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
            }}>
              {win.title}
            </span>
          </div>
        ))}
      </div>

      {/* System Tray */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onTrayClick('clock');
        }}
        style={{
          height: '100%', padding: '0 10px', 
          background: 'linear-gradient(to bottom, #0972da 0%, #0d92e1 100%)', 
          borderLeft: '1px solid #085cb1',
          boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.2)',
          display: 'flex', alignItems: 'center', gap: 12, color: '#fff',
          cursor: 'pointer'
        }}
      >
        <Wifi size={14} style={{ opacity: 0.9 }} />
        <Volume2 size={14} style={{ opacity: 0.9 }} />
        <div 
          style={{ 
            fontSize: 11, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 4, 
            fontWeight: 'normal',
            textShadow: '1px 1px 1px rgba(0,0,0,0.3)'
          }}
        >
          {formatTime(systemTime)}
        </div>
      </div>
    </div>
  );
};
