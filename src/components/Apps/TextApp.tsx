'use client';

import { useState } from 'react';

interface Props {
  fileId: string;
  content: string;
  onUpdate?: (id: string, newContent: string) => void;
  isSecret?: boolean;
}

export const TextApp = ({ fileId, content, onUpdate, isSecret }: Props) => {
  const [val, setVal] = useState(content);

  if (isSecret) {
    return (
      <div style={{ height: '100%', background: '#000', display: 'flex', flexDirection: 'column', padding: 24, fontFamily: 'monospace', overflowY: 'auto' }}>
        <div style={{ color: '#0f0', fontSize: 13, lineHeight: 2, whiteSpace: 'pre-wrap' }}>
          {content}
        </div>
        <div style={{ color: '#0f0', marginTop: 24, fontSize: 11, opacity: 0.5 }}>
          [SYSTEM STATUS: ENCRYPTED CONNECTION ESTABLISHED]
        </div>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#fff',
    }}>
      <textarea
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          onUpdate?.(fileId, e.target.value);
        }}
        style={{
          flex: 1,
          border: 'none',
          resize: 'none',
          outline: 'none',
          padding: '8px 10px',
          fontFamily: '"Segoe UI", "MS UI Gothic", Meiryo, sans-serif',
          fontSize: 13,
          lineHeight: 1.75,
          color: '#1a1a1a',
          background: '#ffffff',
          whiteSpace: 'pre-wrap'
        }}
      />
    </div>
  );
};
