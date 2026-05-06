'use client';

export const SystemAssistant = ({ isGlitched }: { isGlitched: boolean }) => {
  return (
    <div style={{ position: 'absolute', bottom: 40, right: 20, zIndex: 1000, opacity: isGlitched ? 0.5 : 1 }}>
      <div style={{ width: 64, height: 64, background: '#fff', border: '1px solid #ccc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
        🐬
      </div>
    </div>
  );
};
