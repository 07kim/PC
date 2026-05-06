'use client';

import { Wifi } from 'lucide-react';

interface Props {
  type: 'clock' | 'wifi';
  onClose: () => void;
}

export const TrayFlyout = ({ type, onClose }: Props) => {
  return (
    <div style={{
      position: 'absolute', bottom: 35, right: 10, width: 200,
      background: '#fff', border: '1px solid #0055e0', zIndex: 100001,
      boxShadow: '2px -2px 5px rgba(0,0,0,0.2)', padding: 10, fontSize: 12
    }}>
      {type === 'wifi' ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Wifi size={24} color="#0055e0" />
          <div>
            <strong>接続済み</strong><br/>
            IRIS_SECURE_GATEWAY
          </div>
        </div>
      ) : (
        <div>システム時刻の設定はタスクバーから行ってください。</div>
      )}
      <button onClick={onClose} style={{ marginTop: 10, width: '100%' }}>閉じる</button>
    </div>
  );
};
