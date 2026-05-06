'use client';

import { File } from '@/types/os';
import { DesktopIcon } from '@/components/OS/DesktopIcon';

interface Props {
  folderId: string;
  files: File[];
  onOpen: (file: File) => void;
}

export const FolderApp = ({ folderId, files, onOpen }: Props) => {
  return (
    <div style={{
      height: '100%',
      background: '#fff',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ padding: '4px 10px', background: '#ece9d8', borderBottom: '1px solid #7f9db9', fontSize: 11, display: 'flex', gap: 10 }}>
        <div style={{ background: '#fff', border: '1px solid #7f9db9', padding: '1px 10px', flex: 1 }}>
          C:\Documents and Settings\Sato\{folderId}
        </div>
      </div>
      <div style={{
        flex: 1,
        padding: 20,
        display: 'flex',
        flexWrap: 'wrap',
        alignContent: 'flex-start',
        gap: 16,
        overflowY: 'auto'
      }}>
        {files.length === 0 ? (
          <div style={{ color: '#999', fontSize: 12, width: '100%', textAlign: 'center', marginTop: 40 }}>
            このフォルダは空です。
          </div>
        ) : (
          files.map(file => (
            <div key={file.id} style={{ position: 'relative', width: 80, height: 80 }}>
              <DesktopIcon
                file={{...file, position: { x: 0, y: 0 }}}
                onDoubleClick={() => onOpen(file)}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
