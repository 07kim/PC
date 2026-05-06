'use client';

import { useState } from 'react';
import { File as LucideFile, RefreshCw } from 'lucide-react';
import { ContextMenu } from '@/components/OS/ContextMenu';

interface Props {
  files: any[];
  onRestore: (id: string) => void;
}

export const TrashApp = ({ files, onRestore }: Props) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number, fileId: string } | null>(null);

  const handleContextMenu = (e: React.MouseEvent, fileId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({ x: e.clientX, y: e.clientY, fileId });
  };

  const menuItems = (fileId: string) => [
    { label: '元に戻す(R)', action: () => { onRestore(fileId); setContextMenu(null); } },
    { label: '切り取り(T)', disabled: true },
    { label: '削除(D)', disabled: true },
    { separator: true },
    { label: 'プロパティ(P)', disabled: true }
  ];

  return (
    <div 
      style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#fff' }}
      onClick={() => setContextMenu(null)}
    >
      <div style={{ padding: '4px 8px', background: '#ece9d8', borderBottom: '1px solid #aca899', fontSize: 11, display: 'flex', gap: 10 }}>
        <div>ファイル(F)</div>
        <div>編集(E)</div>
        <div>表示(V)</div>
      </div>
      <div style={{ flex: 1, padding: 20, display: 'flex', flexWrap: 'wrap', gap: 20, alignContent: 'flex-start' }}>
        {files.length === 0 ? (
          <div style={{ width: '100%', textAlign: 'center', color: '#999', marginTop: 40 }}>このフォルダは空です。</div>
        ) : (
          files.map(file => (
            <div 
              key={file.id} 
              onContextMenu={(e) => handleContextMenu(e, file.id)}
              style={{ width: 80, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, cursor: 'default' }}
            >
              <div style={{ position: 'relative' }}>
                <LucideFile size={40} color="#999" />
                <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#fff', borderRadius: '50%' }}>
                  <RefreshCw size={12} color="#0055e0" />
                </div>
              </div>
              <span style={{ fontSize: 11, textAlign: 'center', wordBreak: 'break-all' }}>{file.name}</span>
            </div>
          ))
        )}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          items={menuItems(contextMenu.fileId)}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
};
