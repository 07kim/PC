'use client';

import { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

const TRACKS = [
  { id: '1', title: '夜の庭', artist: 'Unknown Artist', duration: '3:24', genre: 'Ambient' },
  { id: '2', title: 'また会う日まで', artist: 'Unknown Artist', duration: '4:11', genre: 'Pop' },
  { id: '3', title: 'Rain in April', artist: 'Unknown Artist', duration: '2:58', genre: 'Instrumental' },
  { id: '4', title: '記録 (2018.08.03)', artist: 'Unknown Artist', duration: '1:03', genre: 'Voice Memo' },
];

export const MusicApp = () => {
  const [selectedId, setSelectedId] = useState<string | null>('1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [progress, setProgress] = useState(0);

  const selectedTrack = TRACKS.find(t => t.id === selectedId);

  const handlePlay = () => setIsPlaying(p => !p);

  const handlePrev = () => {
    const idx = TRACKS.findIndex(t => t.id === selectedId);
    setSelectedId(TRACKS[Math.max(0, idx - 1)].id);
    setProgress(0);
  };

  const handleNext = () => {
    const idx = TRACKS.findIndex(t => t.id === selectedId);
    setSelectedId(TRACKS[Math.min(TRACKS.length - 1, idx + 1)].id);
    setProgress(0);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#1a1a2e', color: '#eee', fontFamily: '"MS PGothic", sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #16213e, #0f3460)', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 60, height: 60, background: '#0f3460', border: '2px solid #e94560', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>
          🎵
        </div>
        <div>
          <div style={{ fontWeight: 'bold', fontSize: 16 }}>{selectedTrack?.title ?? '---'}</div>
          <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{selectedTrack?.artist}</div>
          <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>{selectedTrack?.genre}</div>
        </div>
      </div>

      {/* Progress */}
      <div style={{ padding: '8px 20px', background: '#16213e', display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, color: '#aaa' }}>
        <span>0:00</span>
        <div style={{ flex: 1, height: 4, background: '#333', borderRadius: 2, cursor: 'pointer' }}
          onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); setProgress((e.clientX - rect.left) / rect.width * 100); }}>
          <div style={{ height: '100%', width: progress + '%', background: '#e94560', borderRadius: 2, transition: 'width 0.1s' }} />
        </div>
        <span>{selectedTrack?.duration ?? '0:00'}</span>
      </div>

      {/* Controls */}
      <div style={{ padding: '8px 20px 16px', background: '#16213e', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24 }}>
        <button onClick={handlePrev} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}><SkipBack size={22} /></button>
        <button onClick={handlePlay} style={{ background: '#e94560', border: 'none', color: '#fff', cursor: 'pointer', borderRadius: '50%', width: 42, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
        <button onClick={handleNext} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}><SkipForward size={22} /></button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 16 }}>
          <Volume2 size={14} color="#aaa" />
          <input type="range" min={0} max={100} value={volume} onChange={e => setVolume(Number(e.target.value))}
            style={{ width: 70, accentColor: '#e94560' }} />
        </div>
      </div>

      {/* Playlist & Subtitles */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Subtitle / Lyrics area (only shown if playing track 4) */}
        {isPlaying && selectedId === '4' && (
          <div style={{ padding: '12px 20px', background: '#0a0a16', borderBottom: '1px solid #e94560', color: '#ff4444', fontSize: 12, lineHeight: 1.6, fontStyle: 'italic' }}>
            音声ログ再生中...<br />
            『彼らがノードを移した。新しいアクセスキーは... H-N-D-X-9-9 ... 繰り返す...』
          </div>
        )}

        <div style={{ padding: '6px 12px', background: '#0f3460', fontSize: 11, color: '#aaa', display: 'grid', gridTemplateColumns: '1fr auto', borderBottom: '1px solid #333' }}>
          <span>タイトル / アーティスト</span>
          <span>時間</span>
        </div>
        {TRACKS.map((track, i) => (
          <div
            key={track.id}
            onDoubleClick={() => { setSelectedId(track.id); setIsPlaying(true); setProgress(0); }}
            onClick={() => setSelectedId(track.id)}
            style={{
              padding: '8px 16px', cursor: 'pointer', fontSize: 12,
              background: selectedId === track.id ? 'rgba(233,69,96,0.15)' : i % 2 === 0 ? '#1a1a2e' : '#16213e',
              borderLeft: selectedId === track.id ? '3px solid #e94560' : '3px solid transparent',
              display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center',
            }}
          >
            <div>
              <div style={{ color: selectedId === track.id ? '#e94560' : '#eee', fontWeight: selectedId === track.id ? 'bold' : 'normal' }}>{track.title}</div>
              <div style={{ fontSize: 10, color: '#888', marginTop: 2 }}>{track.artist} — {track.genre}</div>
            </div>
            <div style={{ color: '#666', fontSize: 11 }}>{track.duration}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '4px 12px', background: '#0f0f1a', fontSize: 10, color: '#555' }}>
        {TRACKS.length} 曲 ／ 再生中: {isPlaying ? selectedTrack?.title : '停止中'}
      </div>
    </div>
  );
};
