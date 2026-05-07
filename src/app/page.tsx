'use client';
// Deployment Trigger: 2026-05-06


import { useState, useEffect, useCallback, useRef } from 'react';
import storyData from '@/data/story.json';
import { useOS } from '@/hooks/useOS';
import { DesktopIcon } from '@/components/OS/DesktopIcon';
import { Window } from '@/components/OS/Window';
import { Taskbar } from '@/components/OS/Taskbar';
import { SystemAssistant } from '@/components/OS/SystemAssistant';
import { Notification } from '@/components/OS/Notification';
import { StartMenu } from '@/components/OS/StartMenu';
import { ContextMenu } from '@/components/OS/ContextMenu';
import { TrashApp } from '@/components/Apps/TrashApp';
import { TextApp } from '@/components/Apps/TextApp';
import { BrowserApp } from '@/components/Apps/BrowserApp';
import { ImageApp } from '@/components/Apps/ImageApp';
import { MailApp } from '@/components/Apps/MailApp';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldAlert, Terminal, Lock, Clock as ClockIcon, Wifi, Volume2, Power, Moon, Monitor, User, Settings, Folder, ArrowLeft, ArrowRight, ArrowUp, Search, Grid, Share2, Image as ImageIcon, FileText, Music, Trash2, FileAudio, FileImage, LogOut, RefreshCw } from 'lucide-react';

// SystemDialog Component
function SystemDialog({ title, message, onClose, x, y, type = 'error', children }: { title: string, message: string, onClose: () => void, x?: number, y?: number, type?: 'error' | 'info', children?: React.ReactNode }) {
  const isPositioned = x !== undefined && y !== undefined;
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: 'absolute', 
        top: isPositioned ? y + 10 : '50%', 
        left: isPositioned ? x + 10 : '50%', 
        transform: isPositioned ? 'none' : 'translate(-50%, -50%)',
        width: 380, background: '#ece9d8', border: '1px solid #0055e0', zIndex: 300000,
        boxShadow: '4px 4px 20px rgba(0,0,0,0.5)', fontFamily: 'Tahoma, sans-serif',
        padding: '2px', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ background: 'linear-gradient(to right, #0058ee, #3a93ff)', color: '#fff', padding: '3px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: 12 }}>
        <span>{title}</span>
        <button onClick={onClose} style={{ width: 16, height: 16, background: '#e04343', border: '1px solid #fff', color: '#fff', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>×</button>
      </div>
      <div style={{ padding: '20px 25px', display: 'flex', gap: 15, alignItems: 'center' }}>
        <div style={{ 
          width: 32, height: 32, 
          background: type === 'error' ? '#ff3333' : '#0055e0', 
          borderRadius: '50%', border: '2px solid #fff', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', 
          color: '#fff', fontWeight: 'bold', fontSize: 20 
        }}>
          {type === 'error' ? '×' : 'i'}
        </div>
        <div style={{ fontSize: 11, color: '#000', flex: 1, whiteSpace: 'pre-wrap' }}>{message}</div>
      </div>
      {children && <div style={{ padding: '0 25px 15px 25px' }}>{children}</div>}
      <div style={{ padding: '0 25px 15px 25px', display: 'flex', justifyContent: 'center' }}>
        <button 
          onClick={onClose} 
          style={{ 
            padding: '4px 20px', background: '#ece9d8', border: '1px solid #7f9db9', 
            fontSize: 11, cursor: 'pointer', boxShadow: '1px 1px 0 #fff inset' 
          }}
        >
          OK
        </button>
      </div>
    </motion.div>
  );
}

// QuickAction Component
function QuickAction({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{ 
        width: 60, height: 60, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? '#0055e0' : 'rgba(0,0,0,0.05)', color: active ? '#fff' : '#333',
        cursor: 'pointer', transition: 'all 0.2s'
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 11, fontWeight: 'bold', opacity: 0.8 }}>{label}</span>
    </div>
  );
}

export default function Home() {
  const {
    windows,
    activeWindowId,
    files,
    isGlitched,
    openWindow,
    closeWindow,
    focusWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    updateWindowPosition,
    restoreFile,
    updateFileContent,
    unlockWindow,
    systemTime,
    changeSystemTime,
    isHacked,
    isRebooting,
    gameEnded,
    triggerHack,
    addSecretFile,
    downloadApp,
    addEvidenceFile,
    extraMails,
    addEmail,
    triggerGoodEnd,
    showQuickSettings,
    setShowQuickSettings,
    isMaintenanceDownloaded
  } = useOS();

  const [trueEndClear, setTrueEndClear] = useState(false);
  const [isHackingActive, setIsHackingActive] = useState(false);

  // ログイン画面 ステート
  const [loginPhase, setLoginPhase] = useState<'intro' | 'login' | 'desktop' | 'shutdown_confirm' | 'shutdown' | 'logoff_confirm' | 'logoff' | 'power_off'>('intro');
  const [showAltLogin, setShowAltLogin] = useState(false);
  const [altUser, setAltUser] = useState('');
  const [altPass, setAltPass] = useState('');
  const [altError, setAltError] = useState(false);
  const [joiMode, setJoiMode] = useState(false);

  const handleMainLogin = () => {
    setLoginPhase('desktop');
  };

  const handleAltLogin = () => {
    if (altUser === 'JOI' && altPass === 'joi') {
      setJoiMode(true);
      setLoginPhase('desktop');
    } else {
      setAltError(true);
    }
  };

  const handleShutdown = () => setLoginPhase('shutdown_confirm');
  const handleLogoff = () => setLoginPhase('logoff_confirm');

  useEffect(() => {
    if (loginPhase === 'shutdown') {
      const timer = setTimeout(() => {
        setLoginPhase('power_off');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [loginPhase]);

  const [systemDialog, setSystemDialog] = useState<{ title: string; message: string; x?: number; y?: number, type?: 'error' | 'info' } | null>(null);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [desktopWallpaper, setDesktopWallpaper] = useState('bliss'); // 'bliss' | 'hacked' | 'black'
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; items?: any[] } | null>(null);

  const desktopMenuItems = [
    { label: 'アイコンの整列(I)', disabled: true },
    { separator: true },
    { label: '新規作成(W)', disabled: true },
    { separator: true },
    { label: 'プロパティ(R)', action: () => setSystemDialog({ title: '画面のプロパティ', message: 'このディスプレイの設定は変更できません。', type: 'info' }) }
  ];

  // Tabキーによるフォーカス移動を完全に防止（エラー回避 & レイアウト保護）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    // 捕獲フェーズでイベントを捉える
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, []);

  // Time manipulation dialog state
  const [tempYear, setTempYear] = useState('2026');
  const [tempMonth, setTempMonth] = useState('05');
  const [tempDay, setTempDay] = useState('04');
  const [tempHour, setTempHour] = useState('15');
  const [tempMinute, setTempMinute] = useState('10');
  const [tempSecond, setTempSecond] = useState('00');

  const handleSetTime = () => {
    const newDate = new Date(`${tempYear}-${tempMonth}-${tempDay}T${tempHour}:${tempMinute}:${tempSecond}`);
    changeSystemTime(newDate);
    // setShowTimePicker(false); // Commented out to prevent error
    setSystemDialog({
      title: '日付と時刻',
      message: `システム時刻を ${tempYear}/${tempMonth}/${tempDay} ${tempHour}:${tempMinute} に変更しました。`,
      type: 'info'
    });
  };

  useEffect(() => {
    (window as any).triggerHacking = () => setIsHackingActive(true);
    return () => {
      delete (window as any).triggerHacking;
    };
  }, []);

  return (
    <>
    {/* ===== イントロ画面 ===== */}
    {loginPhase === 'intro' && (
      <div
        onClick={() => setLoginPhase('login')}
        onKeyDown={(e) => e.key === 'Enter' && setLoginPhase('login')}
        tabIndex={0}
        style={{
          height: '100vh', width: '100vw', background: '#0a0a0a',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'Tahoma, sans-serif', cursor: 'pointer', userSelect: 'none',
          position: 'relative', overflow: 'hidden'
        }}
      >
        {/* ノイズ演出 */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.01) 0px, rgba(255,255,255,0.01) 1px, transparent 1px, transparent 2px)',
          pointerEvents: 'none'
        }} />

        {/* メインテキスト */}
        <div style={{ textAlign: 'center', padding: '0 40px', maxWidth: 600, zIndex: 1 }}>
          <div style={{
            fontSize: 11, letterSpacing: 4, color: '#444', marginBottom: 32,
            textTransform: 'uppercase', fontFamily: 'monospace'
          }}>--- log entry ---</div>

          <div style={{
            fontSize: 22, color: '#ccc', lineHeight: 1.9, fontWeight: 'normal',
          }}>
            ネットオークションでジャンク品のPCを買った。<br />
            <span style={{ color: '#999', fontSize: 18 }}>元の持ち主が誰なのかは、分からない。</span>
          </div>

          <div style={{
            marginTop: 40, fontSize: 14, color: '#555', lineHeight: 2
          }}>
            起動してみたら、まだデータが残っていた。
          </div>

          <div style={{
            marginTop: 56, fontSize: 11, color: '#333', letterSpacing: 2,
            animation: 'pulse 2s ease-in-out infinite'
          }}>クリックして起動する</div>
        </div>

        {/* 底部ライン */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 1, background: 'linear-gradient(to right, transparent, #333, transparent)'
        }} />
      </div>
    )}

    {/* ===== ログイン画面 ===== */}
    {(loginPhase === 'login' || loginPhase === 'logoff') && (
      <div style={{
        height: '100vh', width: '100vw', overflow: 'hidden',
        background: 'linear-gradient(180deg, #1a3a6e 0%, #2255aa 40%, #1a4080 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Tahoma, sans-serif', position: 'relative'
      }}>
        {/* 上部区切り線 */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #1166cc, #66aaff, #1166cc)' }} />
        {/* ウィンドウズ XP風ロゴ */}
        <div style={{ marginBottom: 30, textAlign: 'center' }}>
          <div style={{ fontSize: 26, fontWeight: 'bold', color: '#fff', textShadow: '2px 2px 8px rgba(0,0,0,0.7)', letterSpacing: 2 }}>Windows XP</div>
          <div style={{ fontSize: 12, color: '#aaccff', marginTop: 4 }}>Professional</div>
        </div>

        {/* メインログインパネル */}
        {!showAltLogin ? (
          <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '30px 40px', width: 340, backdropFilter: 'blur(10px)' }}>
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.2)', borderRadius: '50%', margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(255,255,255,0.4)' }}>
                <User size={36} color="#cce0ff" />
              </div>
              <div style={{ fontSize: 16, fontWeight: 'bold', color: '#fff', marginBottom: 4 }}>SY</div>
            </div>
            <button
              onClick={handleMainLogin}
              style={{ width: '100%', padding: '10px', background: 'linear-gradient(to bottom, #3a7ad5, #1a55a5)', color: '#fff', border: '1px solid #6699cc', borderRadius: 4, fontSize: 14, fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}
            >
              → ログオン
            </button>
          </div>
        ) : (
          // 別のアカウントログイン
          <div style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 8, padding: '24px 32px', width: 340, backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 14, fontWeight: 'bold', color: '#cce0ff', marginBottom: 16 }}>別のアカウントでログオン</div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ fontSize: 11, color: '#aaccff', display: 'block', marginBottom: 4 }}>ユーザー名(U):</label>
              <input
                value={altUser} onChange={e => { setAltUser(e.target.value); setAltError(false); }}
                style={{ width: '100%', padding: '6px 8px', background: '#fff', border: altError ? '2px solid #ff6666' : '1px solid #aaa', borderRadius: 3, fontSize: 12, boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 11, color: '#aaccff', display: 'block', marginBottom: 4 }}>パスワード(P):</label>
              <input
                type="password" value={altPass} onChange={e => { setAltPass(e.target.value); setAltError(false); }}
                onKeyDown={e => e.key === 'Enter' && handleAltLogin()}
                style={{ width: '100%', padding: '6px 8px', background: '#fff', border: altError ? '2px solid #ff6666' : '1px solid #aaa', borderRadius: 3, fontSize: 12, boxSizing: 'border-box' }}
              />
              {altError && <div style={{ color: '#ff8888', fontSize: 11, marginTop: 4 }}>ユーザー名またはパスワードが正しくありません。</div>}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleAltLogin} style={{ flex: 1, padding: '8px', background: 'linear-gradient(to bottom, #3a7ad5, #1a55a5)', color: '#fff', border: '1px solid #6699cc', borderRadius: 3, fontSize: 12, fontWeight: 'bold', cursor: 'pointer' }}>ログオン</button>
              <button onClick={() => { setShowAltLogin(false); setAltUser(''); setAltPass(''); setAltError(false); }} style={{ flex: 1, padding: '8px', background: 'rgba(255,255,255,0.15)', color: '#cce0ff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 3, fontSize: 12, cursor: 'pointer' }}>キャンセル</button>
            </div>
          </div>
        )}

        {/* 別のアカウントを追加 */}
        {!showAltLogin && (
          <button
            onClick={() => setShowAltLogin(true)}
            style={{ marginTop: 16, background: 'transparent', border: 'none', color: '#88aacc', fontSize: 11, cursor: 'pointer', textDecoration: 'underline' }}
          >
            別のアカウントを追加
          </button>
        )}

        {/* フッター */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'linear-gradient(to right, #1166cc, #66aaff, #1166cc)' }} />
        <div style={{ position: 'absolute', bottom: 10, right: 20, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>アクセシビリティ(A)   Ctrl+Alt+Delete を押してください</div>
      </div>
    )}

    {/* ===== シャットダウン確認ダイアログ ===== */}
    {loginPhase === 'shutdown_confirm' && (
      <div style={{ height: '100vh', width: '100vw', background: 'linear-gradient(180deg, #1a3a6e 0%, #2255aa 40%, #1a4080 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tahoma, sans-serif' }}>
        <div style={{ width: 360, background: '#ece9d8', border: '2px solid #0055cc', borderRadius: 6, padding: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          <div style={{ background: 'linear-gradient(to right, #0058ee, #3a93ff)', color: '#fff', padding: '4px 10px', fontSize: 12, fontWeight: 'bold', borderRadius: '3px 3px 0 0' }}>コンピュータの終了</div>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
              <Power size={32} color="#0055cc" />
              <div style={{ fontSize: 12, color: '#000', lineHeight: 1.6 }}>
                保存されていないデータは失われますが、コンピュータを終了しますか？
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button onClick={() => setLoginPhase('shutdown')} style={{ padding: '4px 20px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 12, cursor: 'pointer', fontWeight: 'bold' }}>はい(Y)</button>
              <button onClick={() => setLoginPhase('desktop')} style={{ padding: '4px 20px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 12, cursor: 'pointer' }}>いいえ(N)</button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* ===== シャットダウン画面 ===== */}
    {loginPhase === 'shutdown' && (
      <div style={{ height: '100vh', width: '100vw', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tahoma, sans-serif' }}>
        <div style={{ width: 300, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: 'linear-gradient(to right, #1166cc, #4499ff)', width: '0%', animation: 'progressFill 3.5s ease-in forwards' }} />
        </div>
        <div style={{ fontSize: 14, color: '#fff', fontWeight: 'bold' }}>終了しています...</div>
        <div style={{ fontSize: 11, color: '#888', marginTop: 8 }}>コンピュータの電源を安全に切るためお待ちください。</div>
      </div>
    )}

    {/* ===== 電源オフ ===== */}
    {loginPhase === 'power_off' && (
      <div style={{ height: '100vh', width: '100vw', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', background: 'transparent', border: '1px solid #333', color: '#555', cursor: 'pointer', fontSize: 12 }}>電源を入れる (再起動)</button>
        </div>
      </div>
    )}

    {/* ===== ログオフ確認 ===== */}
    {loginPhase === 'logoff_confirm' && (
      <div style={{ height: '100vh', width: '100vw', background: 'linear-gradient(180deg, #1a3a6e 0%, #2255aa 40%, #1a4080 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tahoma, sans-serif' }}>
        <div style={{ width: 360, background: '#ece9d8', border: '2px solid #0055cc', borderRadius: 6, padding: 2, boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
          <div style={{ background: 'linear-gradient(to right, #0058ee, #3a93ff)', color: '#fff', padding: '4px 10px', fontSize: 12, fontWeight: 'bold', borderRadius: '3px 3px 0 0' }}>Windows XP</div>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
              <LogOut size={32} color="#0055cc" />
              <div style={{ fontSize: 12, color: '#000', lineHeight: 1.6 }}>
                保存されていないデータは失われますが、ログオフしますか？
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <button onClick={() => { setLoginPhase('logoff'); setTimeout(() => setLoginPhase('login'), 1200); }} style={{ padding: '4px 20px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 12, cursor: 'pointer', fontWeight: 'bold' }}>はい(Y)</button>
              <button onClick={() => setLoginPhase('desktop')} style={{ padding: '4px 20px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 12, cursor: 'pointer' }}>いいえ(N)</button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* ===== ログオフ中 ===== */}
    {loginPhase === 'logoff' && (
      <div style={{ height: '100vh', width: '100vw', background: 'linear-gradient(180deg, #1a3a6e 0%, #2255aa 40%, #1a4080 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Tahoma, sans-serif' }}>
        <div style={{ fontSize: 14, color: '#cce0ff', fontWeight: 'bold', marginBottom: 16 }}>ログオフしています...</div>
        <div style={{ width: 200, height: 4, background: 'rgba(255,255,255,0.2)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', background: '#66aaff', animation: 'progressFlow 1s linear infinite', width: '50%' }} />
        </div>
      </div>
    )}

    {/* ===== デスクトップ ===== */}
    {loginPhase === 'desktop' && (
    <main
      className="xp-os-container"
      style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', background: '#000' }}
      onClick={() => {
        setContextMenu(null);
        setShowStartMenu(false);
      }}
    >
      {isHackingActive && <HackingSequence onComplete={() => setIsHackingActive(false)} />}
      {/* ── Desktop ── */}
      <div
        className={`xp-desktop ${isGlitched ? 'glitch-active' : ''}`}
        style={{
          flex: 1,
          // XP Bliss風草原背景
          background: (desktopWallpaper === 'hacked' || isHacked)
            ? `url(https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=1920&q=80) center/cover`
            : desktopWallpaper === 'black'
            ? '#000'
            : joiMode
            ? `url(https://chibatech.jp/about/institute/dl53f300000014tt-img/dl53f30000003emf.jpg) center/cover no-repeat`
            : `url(/bliss.webp) center/cover no-repeat`,
          filter: isHacked ? 'grayscale(100%) contrast(150%) brightness(0.8)' : 'none',
          position: 'relative',
          overflow: 'hidden'
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          setContextMenu({ x: e.clientX, y: e.clientY, items: desktopMenuItems });
        }}
      >
        {/* Desktop Icons */}
        {files.filter(f => f.folder === 'desktop' || !f.folder).map((file) => (
          <div
            key={file.id}
            onContextMenu={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setContextMenu({ 
                x: e.clientX, 
                y: e.clientY,
                items: file.type === 'trash' ? [
                  { label: '開く(O)', action: () => openWindow(file) },
                  { label: 'ゴミ箱を空にする(B)', action: () => setSystemDialog({ title: 'ゴミ箱', message: 'ゴミ箱はすでに空です。', type: 'info' }), disabled: true },
                  { separator: true },
                  { label: 'ショートカットの作成(S)', disabled: true },
                  { label: '削除(D)', disabled: true },
                  { label: '名前の変更(M)', disabled: true },
                  { separator: true },
                  { label: 'プロパティ(R)', action: () => setSystemDialog({ title: 'ゴミ箱', message: 'ゴミ箱 (システムフォルダ)', type: 'info' }) }
                ] : [
                  { label: '開く(O)', action: () => openWindow(file) },
                  { label: '編集(E)', action: () => openWindow(file) },
                  { label: '送る(N)', disabled: true },
                  { separator: true },
                  { label: '切り取り(T)', disabled: true },
                  { label: 'コピー(C)', disabled: true },
                  { separator: true },
                  { label: '削除(D)', disabled: true },
                  { label: '名前の変更(M)', disabled: true },
                  { separator: true },
                  { label: 'プロパティ(R)', action: () => setSystemDialog({ title: 'プロパティ', message: `${file.name} のプロパティを表示できません。`, type: 'info' }) }
                ]
              });
            }}
          >
            <DesktopIcon
              file={isHacked ? { ...file, name: '見ツケタ' } : file}
              onDoubleClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                if (file.isCorrupted) {
                  setSystemDialog({ title: 'エラー', message: 'ファイルが破損しているため開くことができません。', x: e.clientX, y: e.clientY, type: 'error' });
                } else {
                  openWindow(file);
                }
              }}
            />
          </div>
        ))}

        {/* Windows */}
        <AnimatePresence>
          {windows.map((win) => (
            <Window
              key={win.id}
              window={win}
              isActive={activeWindowId === win.id}
              onClose={() => closeWindow(win.id)}
              onMinimize={() => minimizeWindow(win.id)}
              onMaximize={() => toggleMaximizeWindow(win.id)}
              onFocus={() => focusWindow(win.id)}
              onUnlock={(id) => {
                if (id === 'secret_txt') {
                  const isPast = systemTime.getFullYear() <= 2021;
                  if (isPast) {
                    unlockWindow(id);
                    triggerGoodEnd();
                  } else {
                    triggerHack();
                  }
                } else {
                  unlockWindow(id);
                }
              }}
            >
              {win.type === 'trash' && (
                <TrashApp
                  files={storyData.trash_files.filter((tf: any) => !files.find(f => f.id === tf.id))}
                  onRestore={restoreFile}
                />
              )}
              {win.type === 'text' && (
                <TextApp 
                  fileId={win.id} 
                  content={win.content ?? ''} 
                  onUpdate={updateFileContent} 
                  isSecret={win.id === 'secret_txt'}
                />
              )}
              {win.type === 'image' && (
                <ImageApp src={win.content ?? ''} title={win.title} />
              )}
              {win.type === 'mail' && (
                <MailApp 
                  extraMails={extraMails} 
                  onEmailRead={(id) => {
                    if (id === 'auth_code') {
                      setSystemDialog(null);
                    }
                  }} 
                />
              )}
              {win.type === 'browser' && (
                <BrowserApp 
                  systemTime={systemTime} 
                  onReportViewed={addSecretFile} 
                  onTrueEndClear={() => setTrueEndClear(true)}
                  files={files}
                  hasEvidenceFile={files.some(f => f.id === 'evidence_log')}
                  onDownload={(appId) => {
                    downloadApp(appId);
                    setSystemDialog({
                      title: 'ダウンロード完了',
                      message: `${appId === 'maintenance' ? 'D-DROP Decryptor' : appId === 'secret' ? 'マル秘.exe' : appId} のダウンロードが完了しました。`,
                      type: 'info'
                    });
                  }}
                />
              )}
              
              {/* Scenario Specific Apps */}
              {(win.appId === 'maintenance' || win.id === 'maintenance') && (
                <MaintenanceApp onAuthRequest={() => {
                  addEmail({
                    id: `auth_${Date.now()}`,
                    folder: 'inbox',
                    from: 'D-DROP セキュリティ',
                    fromEmail: 'auth@d-drop.net',
                    to: 'ADMIN_IRIS',
                    toEmail: 'sato_archive@iris.local',
                    subject: '【D-DROP】ワンタイムパスワードのお知らせ',
                    date: new Date().toLocaleString(),
                    unread: true,
                    content: 'ADMIN_IRIS 様\n\nリアルタイム認証のリクエストを受け付けました。\n下記の認証コードを入力して、D-DROP Decryptor のロックを解除してください。\n\n認証コード：4821\n\n※コードの有効期限は10分間です。'
                  });
                  setSystemDialog({
                    title: '新着メール',
                    message: 'D-DROP セキュリティから認証コードが届きました。',
                    type: 'info'
                  });
                }} />
              )}
              {(win.appId === 'legacy_viewer' || win.id === 'legacy_viewer') && (
                <LegacyViewerApp systemTime={systemTime} />
              )}
              {(win.appId === 'secret_app' || win.id === 'secret_app_file') && (
                <SecretApp systemTime={systemTime} onDownloadEvidence={addEvidenceFile} setSystemDialog={setSystemDialog} />
              )}
              {(win.appId === 'explorer' || win.type === 'documents' || win.type === 'pictures' || win.type === 'music' || win.type === 'explorer' || win.type === 'desktop') && (
                <ExplorerApp 
                  folderId={(win.type === 'explorer' || win.appId === 'explorer') ? (win as any).folderId || win.id : win.id} 
                  files={files} 
                  openWindow={(file, e) => {
                    if (file.type === 'folder') return; // ExplorerApp handles internal navigation
                    if (file.isCorrupted) {
                      setSystemDialog({ 
                        title: 'エラー', 
                        message: 'ファイルが破損しているため開くことができません。',
                        x: e?.clientX,
                        y: e?.clientY,
                        type: 'error'
                      });
                    } else {
                      openWindow(file);
                    }
                  }} 
                />
              )}
              {(win.appId === 'settings' || win.id === 'settings') && (
                <ControlPanelApp 
                  onTimeChange={changeSystemTime}
                  systemTime={systemTime}
                  desktopWallpaper={desktopWallpaper}
                  setDesktopWallpaper={setDesktopWallpaper}
                  ownerName="佐藤 (Sato)"
                  initialPage={(win as any).folderId || 'main'}
                  onShowDialog={(title, message, type, x, y) => setSystemDialog({ title, message, type, x, y })}
                />
              )}
            </Window>
          ))}
        </AnimatePresence>

        {/* System Dialog (Replaces Browser Notifications) */}
        <AnimatePresence>
          {systemDialog && (
            <SystemDialog
              title={systemDialog.title}
              message={systemDialog.message}
              x={systemDialog.x}
              y={systemDialog.y}
              type={systemDialog.type}
              onClose={() => setSystemDialog(null)}
            />
          )}
        </AnimatePresence>

      {/* True End Overlay */}
      {trueEndClear && (
        <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 2000000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#333', fontFamily: 'sans-serif' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} style={{ textAlign: 'center', maxWidth: 600, padding: 40 }}>
            <div style={{ color: '#0055e0', fontSize: 14, fontWeight: 'bold', marginBottom: 10, letterSpacing: 2 }}>MISSION COMPLETE</div>
            <h1 style={{ fontSize: 42, color: '#003366', marginBottom: 30, borderBottom: '3px solid #0055e0', paddingBottom: 10 }}>TRUE END: JUSTICE</h1>
            <div style={{ textAlign: 'left', background: '#f5f5f5', padding: 30, borderRadius: 10, border: '1px solid #ddd', marginBottom: 40, lineHeight: 1.8 }}>
              <p style={{ fontSize: 16, marginBottom: 15 }}><strong>【号外】習志野市少女誘拐事件、5年越しの解決</strong></p>
              <p style={{ fontSize: 14 }}>
                本日、市民から提供された匿名データを元に警察が捜査を行い、千葉県内の廃ビルから行方不明だった少女を無事保護しました。<br/>
                また、現場にいた実行犯の男3人を現行犯逮捕。犯行に使用されたネットワーク「D-DROP」の管理者も特定・指名手配されました。<br/><br/>
                あなたが警察に届けた証拠が、止まっていた時間を動かしました。
              </p>
            </div>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
              <button 
                onClick={() => window.location.reload()}
                style={{ background: '#333', color: '#fff', border: 'none', padding: '12px 30px', cursor: 'pointer', fontWeight: 'bold', borderRadius: 4 }}
              >
                最初からやり直す
              </button>
              <a 
                href="https://forms.gle/mVf9rxniy3EyY8BR7" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ background: '#0055e0', color: '#fff', textDecoration: 'none', padding: '12px 30px', fontWeight: 'bold', borderRadius: 4, display: 'flex', alignItems: 'center' }}
              >
                感想フォームへ
              </a>
              <button 
                onClick={() => setTrueEndClear(false)}
                style={{ background: '#fff', color: '#333', border: '1px solid #ccc', padding: '12px 30px', cursor: 'pointer', fontWeight: 'bold', borderRadius: 4 }}
              >
                まだまだ遊ぶ
              </button>
            </div>
          </motion.div>
        </div>
      )}

        {/* Hacked Overlay */}
        {isHacked && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 100000, background: 'rgba(0,0,0,0.9)', color: '#ff0000', padding: 40, fontFamily: 'monospace' }}>
            <h1 style={{ fontSize: 40, marginBottom: 20 }}>💀 POISON PILL ACTIVATED</h1>
            <p style={{ fontSize: 20, lineHeight: 1.5 }}>
              ようやく見つけたか、ネズミくん。このPCを開いたということは、君は『余計な好奇心』を持った誰かだ。<br/>
              今、君の情報を警察に転送した。『5年前の事件の証拠を、今まさに消去している犯人』としてね。
            </p>
            <div style={{ marginTop: 40, border: '1px solid #ff0000', padding: 20 }}>
              LOCATION: Tsudanuma, Narashino, Chiba<br/>
              STATUS: WIPING DATA...<br/>
              [####################] 100%<br/>
              ALL EVIDENCE ERASED.
            </div>
            <div style={{ marginTop: 40, fontSize: 30, textAlign: 'center' }}>GAME OVER - BAD END</div>
          </div>
        )}

        {/* Good End Overlay */}
        {gameEnded === 'good' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ position: 'absolute', inset: 0, zIndex: 100000, background: '#fff', color: '#000', padding: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
          >
            <h1 style={{ fontSize: 32, color: '#0055e0', marginBottom: 30 }}>【速報】5年前の誘拐事件、少女が無事救出</h1>
            <p style={{ fontSize: 18, maxWidth: 600, lineHeight: 1.8 }}>
              本日、千葉県習志野市内の廃ビルにおいて、5年前から行方不明となっていた少女が発見されました。警察が匿名の通報に基づき突入したところ、犯人の拠点と思われる部屋で監禁されていたとのことです。<br/><br/>
              少女の命に別条はなく、現在は病院で保護されています。<br/>
              <strong>止まっていた時間が、あなたの手で正しく動き出しました。</strong>
            </p>
            <div style={{ marginTop: 60, fontSize: 24, fontWeight: 'bold' }}>TRUE ENDING: JUSTICE PREVAILS</div>
            <button onClick={() => window.location.reload()} style={{ marginTop: 40, padding: '10px 30px', background: '#0055e0', color: '#fff', border: 'none', cursor: 'pointer' }}>再起動</button>
          </motion.div>
        )}
      </div>

      {/* Quick Settings Sidebar (XP Style) */}
      <AnimatePresence>
        {showQuickSettings && (
          <>
            <div 
              style={{ position: 'fixed', inset: 0, zIndex: 110000 }} 
              onClick={() => setShowQuickSettings(false)} 
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 250 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 30, width: 320,
                background: '#ece9d8',
                borderLeft: '2px solid #7f9db9',
                zIndex: 120000,
                display: 'flex', flexDirection: 'column',
                color: '#000', boxShadow: '-5px 0 15px rgba(0,0,0,0.2)',
                fontFamily: 'Tahoma, sans-serif'
              }}
            >
              {/* XP Blue Header */}
              <div style={{
                height: 35,
                background: 'linear-gradient(to bottom, #0058ee 0%, #3595ff 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                padding: '0 15px',
                fontWeight: 'bold',
                fontSize: 13,
                textShadow: '1px 1px 1px rgba(0,0,0,0.5)'
              }}>
                システム設定のショートカット
              </div>

              <div style={{ padding: 20, flex: 1, overflowY: 'auto' }}>
                <div style={{ border: '1px solid #7f9db9', background: '#fff', padding: 15, marginBottom: 20, borderRadius: 3 }}>
                  <div style={{ fontSize: 32, fontWeight: 'bold', color: '#0055e0', textAlign: 'center' }}>
                    {systemTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.6, textAlign: 'center', marginTop: 5 }}>
                    {systemTime.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ border: '1px solid #7f9db9', padding: 10, background: 'rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: 12, fontWeight: 'bold', color: '#0055e0', marginBottom: 10 }}>ネットワークと通信</div>
                    <div style={{ display: 'flex', gap: 10 }}>
                      <QuickAction icon={<Wifi size={18} />} label="Wi-Fi" active />
                      <QuickAction icon={<Volume2 size={18} />} label="サウンド" />
                    </div>
                  </div>

                  <div style={{ border: '1px solid #7f9db9', padding: 10, background: 'rgba(0,0,0,0.03)' }}>
                    <div style={{ fontSize: 12, fontWeight: 'bold', color: '#0055e0', marginBottom: 10 }}>システムのメンテナンス</div>
                    <button 
                      onClick={() => {
                        setShowQuickSettings(false);
                        openWindow({ id: 'settings', name: 'Windows設定', type: 'app' } as any);
                      }}
                      style={{ 
                        width: '100%', padding: '8px', background: '#f5f5f5', color: '#333', 
                        border: '1px solid #7f9db9', cursor: 'pointer', fontSize: 11,
                        boxShadow: '1px 1px 0 #fff inset'
                      }}
                    >
                      Windows設定を開く...
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ padding: 15, borderTop: '1px solid #7f9db9', background: '#fff', fontSize: 11, color: '#666' }}>
                Windows XP SP3 (Build 2600)
              </div>
              {/* Quick Links */}
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button 
                  onClick={() => {
                    openWindow({ id: 'settings', appId: 'settings', name: '設定', type: 'app' } as any);
                    setShowQuickSettings(false);
                  }}
                  style={{ 
                    width: '100%', padding: '8px', background: 'rgba(255,255,255,0.1)', 
                    border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 11, 
                    cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 8
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                >
                  <Settings size={14} /> システムの設定を開く
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Taskbar 
        windows={windows} 
        activeWindowId={activeWindowId} 
        systemTime={systemTime}
        onTrayClick={() => setShowQuickSettings(true)}
        onWindowClick={focusWindow}
        onToggleStartMenu={() => setShowStartMenu(!showStartMenu)}
      />

      <StartMenu 
        isOpen={showStartMenu} 
        onClose={() => setShowStartMenu(false)}
        onOpenApp={(id: string, name: string, type: string) => {
          openWindow({ id, name, type: type as any, position: { x: 100, y: 100 } });
          setShowStartMenu(false);
        }}
        onShutdown={handleShutdown}
        onLogoff={handleLogoff}
        isMaintenanceDownloaded={isMaintenanceDownloaded}
      />

      {contextMenu && (
        <ContextMenu 
          x={contextMenu.x} 
          y={contextMenu.y} 
          items={contextMenu.items || desktopMenuItems}
          onClose={() => setContextMenu(null)} 
        />
      )}
    </main>
    )}
    </>
  );
}

// Internal Apps for Scenario
function MaintenanceApp({ onAuthRequest }: { onAuthRequest: () => void }) {
  const [phone, setPhone] = useState('');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSent, setIsSent] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const requestAuth = () => {
    if (phone.replace(/-/g, '') === '04063811510') {
      onAuthRequest();
      setIsSent(true);
      setError(null);
      setSuccess('登録済みのメールアドレスに認証コードを送信しました。');
    } else {
      setError('認証エラー：そのアカウント（電話番号）はシステムに存在しません。');
      setSuccess(null);
    }
  };

  const check = () => {
    if (!isSent) {
      setError('認証エラー：先に認証コードを送信してください。');
      return;
    }
    if (input === '4821') {
      setIsAuthenticating(true);
      setError(null);
      setSuccess(null);
      
      // Simulate high-tech authentication
      setTimeout(() => {
        setResult('URL: http://d-drop.net/portal\nID: if0e9E3dSj');
        setIsAuthenticating(false);
      }, 2500);
    } else {
      setError('認証エラー：ワンタイムパスワードが一致しません。');
    }
  };

  if (isAuthenticating) {
    return (
      <div style={{ height: '100%', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#0f0', fontFamily: 'monospace', overflow: 'hidden', userSelect: 'none' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, letterSpacing: 4, textShadow: '0 0 10px #0f0' }}>AUTHENTICATING...</div>
          <div style={{ width: 300, height: 4, background: '#111', border: '1px solid #0f0', position: 'relative', overflow: 'hidden', marginBottom: 10 }}>
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: 0, width: '50%', background: '#0f0', boxShadow: '0 0 10px #0f0' }}
            />
          </div>
          <div style={{ fontSize: 10 }}>ENCRYPTED CONNECTION ESTABLISHED</div>
          <div style={{ fontSize: 10, marginTop: 5 }}>D-DROP SECURE GATEWAY v4.2.9</div>
        </motion.div>
      </div>
    );
  }

  if (result) {
    return (
      <div style={{ height: '100%', background: '#0a0a0a', color: '#fff', padding: 30, fontFamily: 'monospace', userSelect: 'text' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div style={{ color: '#0f0', fontSize: 18, fontWeight: 'bold', marginBottom: 20, borderBottom: '2px solid #0f0', paddingBottom: 10 }}>
            <ShieldAlert size={20} style={{ marginRight: 10, verticalAlign: 'middle' }} />
            ACCESS GRANTED
          </div>
          <div style={{ background: 'rgba(0,255,0,0.05)', border: '1px solid rgba(0,255,0,0.3)', padding: 20, borderRadius: 5 }}>
            <p style={{ color: '#888', fontSize: 11, marginBottom: 15 }}>以下の秘匿情報をアーカイブ管理者に報告せよ。</p>
            <div style={{ fontSize: 16, lineHeight: 2, letterSpacing: 1 }}>
              {result.split('\n').map((line, i) => (
                <div key={i} style={{ display: 'flex' }}>
                  <span style={{ color: '#0f0', width: 40, userSelect: 'none' }}>&gt;</span>
                  <span style={{ wordBreak: 'break-all' }}>{line}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 30, fontSize: 10, color: '#444', userSelect: 'none' }}>
            警告: この情報は機密扱いです。閲覧後は速やかにアプリケーションを終了してください。
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: 'Tahoma, sans-serif' }}>
      <div style={{ marginBottom: 20, fontSize: 13, fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: 5 }}>D-DROP 2段階認証</div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
        <div>
          <label style={{ fontSize: 11, display: 'block', marginBottom: 5 }}>電話番号 (ID):</label>
          <div style={{ display: 'flex', gap: 5 }}>
            <input 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="090-XXXX-XXXX"
              style={{ flex: 1, padding: '5px 8px', border: '1px solid #7f9db9' }} 
            />
            <button 
              onClick={requestAuth} 
              style={{ ...xpBtnStyleSmall, width: 100 }}
            >
              コード送信
            </button>
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, display: 'block', marginBottom: 5, color: isSent ? '#000' : '#999' }}>認証コード:</label>
          <input 
            value={input} 
            onChange={e => setInput(e.target.value)} 
            placeholder="****"
            maxLength={4}
            disabled={!isSent}
            style={{ 
              width: '100%', padding: '8px', border: '1px solid #7f9db9', 
              fontSize: 16, textAlign: 'center', letterSpacing: 8,
              background: isSent ? '#fff' : '#f5f5f5'
            }} 
          />
        </div>

        <button onClick={check} style={xpBtnStyleFull}>ログイン(L)</button>
      </div>

      {error && (
        <div style={{ marginTop: 20, padding: 10, background: '#fff', border: '1px solid #f00', color: '#f00', fontSize: 11 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ marginTop: 20, padding: 10, background: '#fff', border: '1px solid #0055e0', color: '#0055e0', fontSize: 11 }}>
          {success}
        </div>
      )}
    </div>
  );
}

const xpBtnStyleSmall: React.CSSProperties = {
  padding: '5px', background: '#ece9d8', border: '1px solid #7f9db9', cursor: 'pointer',
  boxShadow: 'inset 1px 1px #fff, 1px 1px 1px rgba(0,0,0,0.1)', fontSize: 11
};

const xpBtnStyleFull: React.CSSProperties = {
  width: '100%', padding: '10px', background: '#ece9d8', border: '1px solid #7f9db9', cursor: 'pointer',
  boxShadow: 'inset 1px 1px #fff, 1px 1px 1px rgba(0,0,0,0.1)', fontSize: 12
};

function LegacyViewerApp({ systemTime }: { systemTime: Date }) {
  return (
    <div style={{ height: '100%', background: '#fff', padding: 15, fontFamily: 'sans-serif' }}>
      <div style={{ borderBottom: '2px solid #0055e0', paddingBottom: 5, marginBottom: 15, fontWeight: 'bold' }}>遺物チャットログ閲覧</div>
      <div style={{ fontSize: 11, color: '#666', marginBottom: 10 }}>システムログ: 2021/04/15 付近の記録を復元中...</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ background: '#f0f0f0', padding: 8, borderRadius: 5 }}>
          <strong>User_X:</strong> 仕事は終わったか？
        </div>
        <div style={{ background: '#e0f0ff', padding: 8, borderRadius: 5 }}>
          <strong>Sato:</strong> ああ、D-DROPに報告書を上げた。
        </div>
        <div style={{ background: '#f0f0f0', padding: 8, borderRadius: 5 }}>
          <strong>User_X:</strong> パスワードはどうした。
        </div>
        <div style={{ background: '#e0f0ff', padding: 8, borderRadius: 5 }}>
          <strong>Sato:</strong> パスワードは、俺たちが『仕事』を終えた瞬間の時刻だ。報告書を読み直せ。
        </div>
      </div>
    </div>
  );
}

function SecretApp({ systemTime, onDownloadEvidence, setSystemDialog }: { systemTime: Date, onDownloadEvidence?: () => void, setSystemDialog?: (dialog: any) => void }) {
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasTriggeredHack, setHasTriggeredHack] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const hours = systemTime.getHours();
  const minutes = systemTime.getMinutes();
  const isTargetTime = (hours === 15 && minutes >= 5 && minutes <= 15);
  const isPast = systemTime.getFullYear() <= 2021;

  useEffect(() => {
    if (!isPast && isUnlocked && !hasTriggeredHack) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setHasTriggeredHack(true);
            setTimeout(() => {
              (window as any).triggerHacking?.();
            }, 500);
            return 100;
          }
          return prev + (Math.random() * 15);
        });
      }, 300);
      return () => clearInterval(interval);
    }
  }, [isPast, isUnlocked, hasTriggeredHack]);

  useEffect(() => {
    if (isAuthenticating) {
      const timer = setTimeout(() => {
        setIsAuthenticating(false);
        setIsUnlocked(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticating]);

  const handleUnlock = () => {
    if (password === '28174') {
      if (isPast && isTargetTime) {
        setIsAuthenticating(true);
      } else {
        setShowWarning(true);
      }
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!isUnlocked) {
    if (isAuthenticating) {
      return (
        <div style={{ height: '100%', background: '#111', color: '#0f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace' }}>
          <RefreshCw className="animate-spin" size={48} style={{ marginBottom: 20 }} />
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>システム証明書を検証中...</div>
          <div style={{ fontSize: 12, marginTop: 10, opacity: 0.7 }}>[STATUS] VALID_TIME_DETECTED</div>
          <div style={{ fontSize: 12, marginTop: 5, opacity: 0.7 }}>Decrypting internal archives...</div>
        </div>
      );
    }
    
    return (
      <div style={{ height: '100%', background: '#111', color: '#fff', padding: 30, fontFamily: 'monospace', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <ShieldAlert size={48} color="#ff3333" style={{ marginBottom: 20 }} />
        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>暗号化されたパッケージを検出しました</div>
        <div style={{ width: '100%', maxWidth: 220 }}>
          <div style={{ fontSize: 11, marginBottom: 5, color: '#aaa' }}>アクセスパスワードを入力してください:</div>
          <input 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            placeholder="パスワード"
            style={{ width: '100%', background: '#000', border: '1px solid #444', color: '#fff', padding: '10px', textAlign: 'center', outline: 'none' }}
          />
          {error && <div style={{ color: '#f00', fontSize: 10, marginTop: 5, textAlign: 'center' }}>アクセスが拒否されました</div>}
          <button 
            onClick={handleUnlock}
            style={{ width: '100%', background: '#eee', color: '#000', border: '1px solid #999', marginTop: 10, padding: '8px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            復号を開始する
          </button>
        </div>

        {/* XP Style Warning Dialog */}
        {showWarning && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
            <div style={{ width: 280, background: '#ece9d8', border: '1px solid #0055e0', padding: 2, boxShadow: '4px 4px 10px rgba(0,0,0,0.5)', fontFamily: 'Tahoma, sans-serif' }}>
              <div style={{ background: 'linear-gradient(to right, #0058ee, #3a93ff)', color: '#fff', padding: '2px 8px', fontSize: 11, fontWeight: 'bold' }}>セキュリティ警告</div>
              <div style={{ padding: 15 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 15 }}>
                  <ShieldAlert size={32} color="#f00" />
                  <div style={{ fontSize: 11, color: '#000', lineHeight: 1.4 }}>
                    このファイルのセキュリティ証明書の期限が切れています(2021年)。<br/><br/>
                    このまま実行するとシステムが修復不可能なダメージを受ける可能性があります。<br/><br/>
                    それでも実行しますか？
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                  <button 
                    onClick={() => { setIsUnlocked(true); setShowWarning(false); }} 
                    style={{ padding: '3px 15px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 11, color: '#000', cursor: 'pointer' }}
                  >
                    実行(R)
                  </button>
                  <button 
                    onClick={() => setShowWarning(false)} 
                    style={{ padding: '3px 15px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 11, color: '#000', cursor: 'pointer' }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Branch Logic: Malware Mode (Present) vs True End Mode (Past)

  if (!isPast) {
    return (
      <div style={{ height: '100%', background: '#000', color: '#0f0', fontFamily: 'monospace', padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <motion.div
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          style={{ fontSize: 18, marginBottom: 30, letterSpacing: 2 }}
        >
          {progress < 100 ? "保護されたパッケージを復号中..." : "復号が完了しました"}
        </motion.div>
        
        <div style={{ width: '100%', maxWidth: 400, height: 25, border: '2px solid #0f0', padding: 3, position: 'relative' }}>
          <motion.div 
            style={{ height: '100%', background: '#0f0', width: `${Math.min(progress, 100)}%` }}
          />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 'bold', color: progress > 55 ? '#000' : '#0f0', mixBlendMode: 'difference' }}>
            {Math.floor(Math.min(progress, 100))}%
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', background: '#000', color: isTargetTime ? '#ff3333' : '#33ff33', fontFamily: 'monospace', padding: 20, overflow: 'hidden', position: 'relative' }}>
      {!isTargetTime ? (
        <div style={{ textAlign: 'center', marginTop: 50 }}>
          <div style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20, textShadow: '0 0 10px #33ff33' }}>SYSTEM_SYNC_WAITING</div>
          <p style={{ fontSize: 12 }}>SERVER_STATUS: 2021_ARCHIVE_ESTABLISHED</p>
          <p style={{ fontSize: 12 }}>STATUS: PENDING_TIME_MATCH (Target: 15:10)</p>
          <div style={{ marginTop: 30, opacity: 0.5 }}>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ x: -10 }}
                animate={{ x: 10 }}
                transition={{ duration: 0.1, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
                style={{ fontSize: 10 }}
              >
                {Math.random().toString(16).substring(2, 20)}
              </motion.div>
            ))}
          </div>
          <p style={{ marginTop: 40, color: '#666', fontSize: 10 }}>[HINT] 報告書の完了時刻と同期してください...</p>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ height: '100%', display: 'flex', flexDirection: 'column', color: '#fff' }}
        >
          <div style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15, borderBottom: '2px solid #33ff33', paddingBottom: 10, color: '#33ff33', letterSpacing: 2 }}>
            [CONFIDENTIAL] OPERATION "SUZURAN" DATABASE LOG
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.05)', padding: 25, borderRadius: 8, border: '1px solid #33ff33', overflowY: 'auto', lineHeight: 1.8 }}>
            <p style={{ color: '#ffcc00', fontWeight: 'bold', marginBottom: 15 }}>&gt; 内部アーカイブの復号に成功しました。</p>
            <p style={{ marginBottom: 20 }}>
              【作戦名: スズラン 実行ログ】<br/>
              04-10 14:00: 習志野市内の路上にてターゲット（10代女性）を確保。抵抗は軽微。<br/>
              04-10 15:30: 潜伏拠点へ移送完了。防音シートを窓と壁に設置。外部との接触は一切断つ。<br/>
              04-11 09:00: ターゲットの所持品（スマートフォン等）を回収し、電波遮断ポーチに保管。<br/>
              04-11 22:00: 警察の初動捜査を監視中。D-DROPのダミーノードを展開し、IPの偽装を強化。<br/>
              04-12 11:00: 食料品・機材の調達はSatoのAmazonアカウント経由でダミー住所へ注文している。だが、本日奴が手違いで『現在の潜伏拠点』を直接の配送先に指定しやがった。警察に怪しまれる前に確実に荷物を回収しろ。<br/>
              04-13 19:00: ターゲットの親族へ向けた脅迫文の送信準備。送信元は海外プロキシを経由する設定に変更。<br/>
              04-14 08:30: 警察のサイバー班がプロバイダへの照会を開始した模様。VPNのルーティングを変更し、足跡をかく乱。<br/><br/>
              【拠点情報データベース】<br/>
              ・主犯格アクセス元IP: 192.168.10.x (D-DROP_LOCAL_NET)<br/>
              ・最終同期地点: メゾン津田沼 302号室（Satoによるミス配送先と同一）<br/>
              ・確保済みの証拠隠蔽ツール: operation_report_0415.txt にバックアップ。
            </p>
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            {isDownloading ? (
              <div style={{ flex: 1, border: '1px solid #33ff33', padding: 3, position: 'relative', height: 40 }}>
                <motion.div 
                  style={{ height: '100%', background: '#33ff33', width: `${downloadProgress}%` }}
                />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: downloadProgress > 50 ? '#000' : '#33ff33', mixBlendMode: 'difference' }}>
                  EXTRACTING... {downloadProgress}%
                </div>
              </div>
            ) : (
              <button 
                onClick={() => {
                  setIsDownloading(true);
                  const interval = setInterval(() => {
                    setDownloadProgress(p => {
                      if (p >= 100) {
                        clearInterval(interval);
                        setTimeout(() => {
                          setIsDownloading(false);
                          setDownloadProgress(0);
                          if (onDownloadEvidence) onDownloadEvidence();
                          if (setSystemDialog) {
                            setSystemDialog({
                              title: '抽出完了',
                              message: 'レポートデータ (operation_report_0415.txt) をデスクトップに保存しました。',
                              type: 'info'
                            });
                          }
                        }, 500);
                        return 100;
                      }
                      return p + 10;
                    });
                  }, 100);
                }}
                style={{ flex: 1, background: '#008800', color: '#fff', border: 'none', padding: '12px', cursor: 'pointer', fontWeight: 'bold', borderRadius: 4, textShadow: '0 0 5px #000' }}
              >
                レポートデータを抽出して保存 (.txt)
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}

function ControlPanelApp({ 
  onTimeChange, 
  systemTime,
  desktopWallpaper, 
  setDesktopWallpaper,
  ownerName,
  onShowDialog,
  initialPage = 'main'
}: { 
  onTimeChange: (date: Date) => void, 
  systemTime: Date,
  desktopWallpaper: string, 
  setDesktopWallpaper: (val: string) => void,
  ownerName: string,
  onShowDialog: (title: string, message: string, type?: 'error' | 'info', x?: number, y?: number) => void,
  initialPage?: 'main' | 'display' | 'datetime' | 'network' | 'user'
}) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  
  const showRestriction = (title: string, e?: React.MouseEvent) => {
    onShowDialog('システム エラー', `${title} は管理者によって制限されています。`, 'error', e?.clientX, e?.clientY);
  };

  const [tYear, setTYear] = useState(systemTime.getFullYear().toString());
  const [tMonth, setTMonth] = useState((systemTime.getMonth() + 1).toString().padStart(2, '0'));
  const [tDay, setTDay] = useState(systemTime.getDate().toString().padStart(2, '0'));
  const [tHour, setTHour] = useState(systemTime.getHours().toString().padStart(2, '0'));
  const [tMinute, setTMinute] = useState(systemTime.getMinutes().toString().padStart(2, '0'));
  const [tSecond, setTSecond] = useState(systemTime.getSeconds().toString().padStart(2, '0'));

  const handleApplyTime = () => {
    const newDate = new Date(`${tYear}-${tMonth.padStart(2,'0')}-${tDay.padStart(2,'0')}T${tHour.padStart(2,'0')}:${tMinute.padStart(2,'0')}:${tSecond.padStart(2,'0')}`);
    if (isNaN(newDate.getTime())) {
      onShowDialog('エラー', '有効な日付を入力してください。', 'error');
      return;
    }
    onTimeChange(newDate);
    onShowDialog('日付と時刻', 'システム時刻を更新しました。', 'info');
  };

  const setTimeToNow = () => {
    const now = new Date();
    setTYear(now.getFullYear().toString());
    setTMonth((now.getMonth() + 1).toString().padStart(2, '0'));
    setTDay(now.getDate().toString().padStart(2, '0'));
    setTHour(now.getHours().toString().padStart(2, '0'));
    setTMinute(now.getMinutes().toString().padStart(2, '0'));
    setTSecond(now.getSeconds().toString().padStart(2, '0'));
  };

  const changeMonth = (delta: number) => {
    let m = parseInt(tMonth) + delta;
    let y = parseInt(tYear);
    if (m > 12) { m = 1; y++; }
    if (m < 1) { m = 12; y--; }
    setTMonth(m.toString().padStart(2, '0'));
    setTYear(y.toString());
  };

  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m, 0).getDate();
  };

  const renderMain = () => {
    const categories = [
      { id: 'datetime', icon: <ClockIcon size={32} color="#0055e0" />, title: '日付、時刻、地域と言語のオプション', desc: '日付、時刻、および数値の表示形式を変更します。' },
      { id: 'display', icon: <Monitor size={32} color="#0055e0" />, title: 'デスクトップの表示とテーマ', desc: '背景、スクリーンセーバー、ウィンドウのデザインを変更します。' },
      { id: 'network', icon: <Wifi size={32} color="#0055e0" />, title: 'ネットワークとインターネット接続', desc: 'インターネットへの接続方法を設定します。' },
      { id: 'user', icon: <User size={32} color="#0055e0" />, title: 'ユーザーアカウント', desc: 'パスワードや画像の設定を行います。', restricted: true },
      { id: 'accessibility', icon: <Settings size={32} color="#0055e0" />, title: 'アクセシビリティ オプション', desc: '視覚、聴覚、および移動のオプションを調整します。', disabled: true },
      { id: 'security', icon: <ShieldAlert size={32} color="#e04343" />, title: 'セキュリティ センター', desc: 'セキュリティ設定を管理してコンピュータを保護します。', disabled: true },
    ];

    return (
      <div style={{ padding: '30px 40px' }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 25 }}>作業を選んで実行するか、アイコンを選んでください</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {categories.map((cat, i) => (
            <div 
              key={i} 
              onClick={(e) => {
                if (cat.disabled) return;
                if ((cat as any).restricted) {
                  showRestriction(cat.title, e);
                } else {
                  setCurrentPage(cat.id as any);
                }
              }}
              style={{ 
                display: 'flex', gap: 15, padding: 12, border: '1px solid transparent', 
                cursor: cat.disabled ? 'default' : 'pointer', borderRadius: 4,
                opacity: cat.disabled ? 0.7 : 1,
                transition: 'all 0.1s'
              }}
              onMouseEnter={(e) => !cat.disabled && (e.currentTarget.style.background = '#e5f3ff', e.currentTarget.style.border = '1px solid #7f9db9')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent', e.currentTarget.style.border = '1px solid transparent')}
            >
              <div style={{ width: 48, height: 48, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {cat.icon}
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 'bold', color: '#003399', marginBottom: 3, textDecoration: !cat.disabled ? 'underline' : 'none' }}>{cat.title}</div>
                <div style={{ fontSize: 10, color: '#666', lineHeight: 1.4 }}>{cat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDisplay = () => (
    <div style={{ padding: '20px 30px' }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#003399', marginBottom: 20 }}>画面のプロパティ</div>
      <div style={{ display: 'flex', gap: 30 }}>
        <div style={{ width: 240, height: 180, border: '10px solid #333', borderRadius: 10, background: '#000', position: 'relative', overflow: 'hidden' }}>
          <div style={{ 
            width: '100%', height: '100%', 
            backgroundImage: desktopWallpaper === 'hacked' ? 'url(https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&w=400&q=80)' : desktopWallpaper === 'black' ? 'none' : 'url(/bliss.webp)',
            backgroundSize: 'cover', backgroundPosition: 'center'
          }} />
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: 10, background: '#245edb' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 'bold', marginBottom: 10 }}>背景(K):</div>
          <div style={{ border: '1px solid #7f9db9', background: '#fff', height: 120, overflowY: 'auto' }}>
            {['bliss', 'hacked', 'black'].map(wp => (
              <div 
                key={wp}
                onClick={() => setDesktopWallpaper(wp)}
                style={{ 
                  padding: '4px 10px', fontSize: 11, cursor: 'pointer',
                  background: desktopWallpaper === wp ? '#316ac5' : 'transparent',
                  color: desktopWallpaper === wp ? '#fff' : '#000'
                }}
              >
                {wp === 'bliss' ? '草原 (Bliss)' : wp === 'hacked' ? '不穏な影' : 'なし (漆黒)'}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
            <button style={{ padding: '4px 15px', fontSize: 11 }}>参照(B)...</button>
            <button style={{ padding: '4px 15px', fontSize: 11 }}>配置(D): [ 中央 ]</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDateTime = () => (
    <div style={{ padding: '15px 25px', color: '#000', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#003399', marginBottom: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>日付と時刻のプロパティ</span>
        <button 
          onClick={setTimeToNow} 
          style={{ padding: '3px 10px', fontSize: 10, cursor: 'pointer', background: '#ece9d8', border: '1px solid #7f9db9', borderRadius: 3 }}
        >
          現在時刻を取得
        </button>
      </div>

      <div style={{ display: 'flex', gap: 20, flex: 1 }}>
        {/* Date Section */}
        <div style={{ flex: 1.2, border: '1px solid #7f9db9', padding: '12px 15px', background: '#fff', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, marginBottom: 10, borderBottom: '1px solid #7f9db9', paddingBottom: 4, fontWeight: 'bold', color: '#003399' }}>日付(D)</div>
          
          <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center', justifyContent: 'center' }}>
            <input type="number" value={tYear} onChange={e => setTYear(e.target.value)} style={{ width: 55, padding: '2px 4px', fontSize: 11, border: '1px solid #7f9db9' }} />
            <span style={{ fontSize: 10 }}>年</span>
            <input type="number" value={tMonth} onChange={e => setTMonth(e.target.value)} style={{ width: 35, padding: '2px 4px', fontSize: 11, border: '1px solid #7f9db9' }} />
            <span style={{ fontSize: 10 }}>月</span>
            <input type="number" value={tDay} onChange={e => setTDay(e.target.value)} style={{ width: 35, padding: '2px 4px', fontSize: 11, border: '1px solid #7f9db9' }} />
            <span style={{ fontSize: 10 }}>日</span>
          </div>

          <div style={{ textAlign: 'center', border: '1px solid #ccc', padding: 5, flex: 1 }}>
            <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 11, background: '#f0f0f0', padding: '2px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={() => changeMonth(-1)} style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: 14 }}>◀</button>
              <span>{tYear}年 {tMonth}月</span>
              <button onClick={() => changeMonth(1)} style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: 14 }}>▶</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, fontSize: 10 }}>
              {['日','月','火','水','木','金','土'].map(d => <div key={d} style={{ color: d === '日' ? '#c00' : d === '土' ? '#00c' : '#666', fontWeight: 'bold', paddingBottom: 3 }}>{d}</div>)}
              {/* Offset for the first day of the month */}
              {Array.from({ length: new Date(parseInt(tYear), parseInt(tMonth) - 1, 1).getDay() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: getDaysInMonth(parseInt(tYear), parseInt(tMonth)) }).map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => setTDay((i + 1).toString().padStart(2, '0'))}
                  style={{ 
                    padding: '3px 0', 
                    cursor: 'pointer',
                    background: parseInt(tDay) === i + 1 ? '#316ac5' : 'transparent', 
                    color: parseInt(tDay) === i + 1 ? '#fff' : '#000',
                    borderRadius: 1
                  }}
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Time Section */}
        <div style={{ width: 190, border: '1px solid #7f9db9', padding: '12px 15px', background: '#fff', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', fontSize: 11, marginBottom: 12, borderBottom: '1px solid #7f9db9', paddingBottom: 4, fontWeight: 'bold', color: '#003399' }}>時刻(T)</div>
          
          <div style={{ width: 100, height: 100, borderRadius: '50%', border: '2px solid #333', position: 'relative', marginBottom: 15, background: '#fff' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', width: 4, height: 4, background: '#000', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }} />
            <div style={{ 
              position: 'absolute', top: '50%', left: '50%', width: '30%', height: 2, background: '#000', 
              transform: `rotate(${(parseInt(tHour) % 12 * 30) + (parseInt(tMinute) / 2) - 90}deg)`, 
              transformOrigin: '0 50%' 
            }} />
            <div style={{ 
              position: 'absolute', top: '50%', left: '50%', width: '40%', height: 1.5, background: '#444', 
              transform: `rotate(${(parseInt(tMinute) * 6) - 90}deg)`, 
              transformOrigin: '0 50%' 
            }} />
            <div style={{ 
              position: 'absolute', top: '50%', left: '50%', width: '45%', height: 1, background: '#c00', 
              transform: `rotate(${(parseInt(tSecond) * 6) - 90}deg)`, 
              transformOrigin: '0 50%' 
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, alignItems: 'center', background: '#f5f5f5', padding: '6px 10px', borderRadius: 3, border: '1px solid #ddd' }}>
            <input type="number" value={tHour} onChange={e => setTHour(e.target.value)} style={{ width: 35, padding: '2px', fontSize: 14, textAlign: 'center', border: '1px solid #7f9db9' }} />
            <span style={{ fontWeight: 'bold' }}>:</span>
            <input type="number" value={tMinute} onChange={e => setTMinute(e.target.value)} style={{ width: 35, padding: '2px', fontSize: 14, textAlign: 'center', border: '1px solid #7f9db9' }} />
            <span style={{ fontWeight: 'bold' }}>:</span>
            <input type="number" value={tSecond} onChange={e => setTSecond(e.target.value)} style={{ width: 35, padding: '2px', fontSize: 14, textAlign: 'center', border: '1px solid #7f9db9' }} />
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 10, paddingBottom: 5 }}>
        <button 
          onClick={handleApplyTime} 
          style={{ padding: '5px 20px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 11, fontWeight: 'bold', cursor: 'pointer' }}
        >
          適用(A)
        </button>
        <button 
          onClick={() => setCurrentPage('main')} 
          style={{ padding: '5px 20px', background: '#ece9d8', border: '1px solid #7f9db9', fontSize: 11, cursor: 'pointer' }}
        >
          キャンセル
        </button>
      </div>
    </div>
  );

  const renderNetwork = () => (
    <div style={{ padding: '20px 30px' }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#003399', marginBottom: 20 }}>ネットワーク接続</div>
      <div style={{ border: '1px solid #7f9db9', background: '#fff', padding: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
          <Wifi size={32} color="#00aa00" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 'bold' }}>ローカル エリア接続</div>
            <div style={{ fontSize: 10, color: '#666' }}>接続済み (100.0 Mbps)</div>
          </div>
        </div>
        <div style={{ fontSize: 11 }}>
          <div style={{ marginBottom: 5 }}>IP アドレス: 192.168.11.4</div>
          <div style={{ marginBottom: 5 }}>サブネット マスク: 255.255.255.0</div>
          <div style={{ marginBottom: 5 }}>デフォルト ゲートウェイ: 192.168.11.1</div>
        </div>
      </div>
    </div>
  );

  const renderUser = () => (
    <div style={{ padding: '20px 30px' }}>
      <div style={{ fontSize: 18, fontWeight: 'bold', color: '#003399', marginBottom: 20 }}>ユーザー アカウント</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, borderBottom: '1px solid #ccc', paddingBottom: 20 }}>
        <div style={{ width: 64, height: 64, border: '2px solid #7f9db9', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
          <User size={64} color="#215dc6" />
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 'bold' }}>{ownerName}</div>
          <div style={{ fontSize: 11, color: '#666' }}>Computer Administrator</div>
          <div style={{ fontSize: 11, color: '#666' }}>パスワード保護</div>
        </div>
      </div>
      <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 12, color: '#003399', textDecoration: 'underline', cursor: 'pointer' }}>名前を変更する</div>
        <div style={{ fontSize: 12, color: '#003399', textDecoration: 'underline', cursor: 'pointer' }}>パスワードを作成する</div>
        <div style={{ fontSize: 12, color: '#003399', textDecoration: 'underline', cursor: 'pointer' }}>画像を変更する</div>
      </div>
    </div>
  );

  const pathLabel = currentPage === 'main' ? '設定' 
    : currentPage === 'display' ? '設定 > 画面' 
    : currentPage === 'datetime' ? '設定 > 日付と時刻'
    : currentPage === 'network' ? '設定 > ネットワーク'
    : currentPage === 'user' ? '設定 > ユーザー'
    : '設定';

  return (
    <div style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, sans-serif', overflow: 'hidden' }}>
      <div style={{ background: '#ece9d8', padding: '10px 20px', borderBottom: '1px solid #7f9db9', fontSize: 13, fontWeight: 'bold', color: '#003399', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        {currentPage !== 'main' && (
          <button 
            onClick={() => setCurrentPage('main')}
            style={{ padding: '2px 8px', fontSize: 11, cursor: 'pointer' }}
          >
            ← 戻る
          </button>
        )}
        <span>{pathLabel}</span>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        {/* Left Sidebar (XP Blue Theme) */}
        <div style={{ width: 180, background: 'linear-gradient(to bottom, #7ba2e7 0%, #6375d6 100%)', padding: 15, color: '#fff', display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 4, marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
              コントロール パネル <span>▲</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 10 }}>
              <div 
                onClick={() => setCurrentPage('datetime')}
                style={{ cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 5 }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffcc00'}
                onMouseLeave={e => e.currentTarget.style.color = '#fff'}
              >
                <ClockIcon size={12} /> 日付と時刻の設定
              </div>
              <div 
                onClick={() => setCurrentPage('display')}
                style={{ cursor: 'pointer', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 5 }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffcc00'}
                onMouseLeave={e => e.currentTarget.style.color = '#fff'}
              >
                <Monitor size={12} /> デスクトップの背景
              </div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: 4, marginBottom: 10 }}>
              関連項目 <span>▲</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 10 }}>
              <div 
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ffcc00'}
                onMouseLeave={e => e.currentTarget.style.color = '#fff'}
                onClick={(e) => showRestriction('ヘルプとサポート', e)}
              >
                ヘルプとサポート
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
          {currentPage === 'main' && renderMain()}
          {currentPage === 'display' && renderDisplay()}
          {currentPage === 'datetime' && renderDateTime()}
          {currentPage === 'network' && renderNetwork()}
          {currentPage === 'user' && renderUser()}
        </div>
      </div>
    </div>
  );
}

// Helper for XP Style File Icons
function FileIcon({ type, size = 32 }: { type: string, size?: number }) {
  const iconSize = size;
  
  switch (type) {
    case 'trash':
      return <Trash2 size={iconSize} color="#215dc6" fill="rgba(33, 93, 198, 0.3)" strokeWidth={1.5} style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }} />;
    case 'image':
    case 'pictures':
      return (
        <div style={{ width: iconSize, height: iconSize, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <div style={{ width: '90%', height: '80%', background: '#fff', border: '2px solid #7f9db9', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            <ImageIcon size={iconSize * 0.6} color="#215dc6" />
          </div>
          <div style={{ position: 'absolute', bottom: '15%', left: '10%', right: '10%', height: '20%', background: 'rgba(33, 93, 198, 0.1)' }} />
        </div>
      );
    case 'music':
      return <Music size={iconSize} color="#215dc6" style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }} />;
    case 'folder':
    case 'documents':
    case 'explorer':
      return <Folder size={iconSize} color="#c09030" fill="#f0d060" style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))' }} />;
    case 'app':
      return (
        <div style={{ position: 'relative' }}>
          <Monitor size={iconSize} color="#333" style={{ filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))' }} />
          <div style={{ position: 'absolute', bottom: -2, right: -2, background: '#fff', border: '1px solid #666', borderRadius: 1, padding: 1, boxShadow: '1px 1px 2px rgba(0,0,0,0.2)' }}>
            <ArrowRight size={iconSize * 0.25} color="#008000" strokeWidth={4} />
          </div>
        </div>
      );
    case 'maintenance':
    case 'secret_app':
      return (
        <div style={{ position: 'relative' }}>
          <ShieldAlert size={iconSize} color="#ff3333" fill="rgba(255, 0, 0, 0.1)" style={{ filter: 'drop-shadow(1px 1px 2px rgba(255,0,0,0.4))' }} />
        </div>
      );
    default:
      return <FileText size={iconSize} color="#999" />;
  }
}

function ExplorerApp({ folderId, files, openWindow }: { folderId: string, files: any[], openWindow: (file: any, e?: React.MouseEvent) => void }) {
  const [currentFolderId, setCurrentFolderId] = useState(folderId);
  const [history, setHistory] = useState<string[]>([folderId]);
  
  useEffect(() => {
    setCurrentFolderId(folderId);
    setHistory(prev => [...prev, folderId]);
  }, [folderId]);

  const [showHiddenFiles, setShowHiddenFiles] = useState(false);
  const [explorerContextMenu, setExplorerContextMenu] = useState<{ x: number, y: number } | null>(null);

  const folderFiles = files.filter(f => {
    const isMatchedFolder = f.folder === currentFolderId;
    if (!isMatchedFolder) return false;
    if (!showHiddenFiles && f.isHidden) return false;
    return true;
  });

  const pathLabel = currentFolderId === 'documents' ? 'マイドキュメント' : currentFolderId === 'pictures' ? 'マイ ピクチャ' : currentFolderId === 'music' ? 'マイ ミュージック' : currentFolderId === 'desktop' ? 'デスクトップ' : currentFolderId;

  return (
    <div 
      style={{ height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', fontFamily: 'Tahoma, sans-serif', color: '#000', position: 'relative' }}
      onClick={() => setExplorerContextMenu(null)}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = e.currentTarget.getBoundingClientRect();
        setExplorerContextMenu({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
    >
      {/* Toolbar */}
      <div style={{ background: '#ece9d8', padding: '2px 4px', borderBottom: '1px solid #7f9db9', display: 'flex', gap: 5, alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 2, borderRight: '1px solid #999', paddingRight: 5 }}>
          <div 
            onClick={() => {
              if (history.length > 1) {
                const newHistory = [...history];
                newHistory.pop();
                const prev = newHistory[newHistory.length - 1];
                setHistory(newHistory);
                setCurrentFolderId(prev);
              }
            }}
            style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '2px 5px', cursor: history.length > 1 ? 'pointer' : 'default', opacity: history.length > 1 ? 1 : 0.5 }}
          >
            <div style={{ background: '#245edb', borderRadius: '50%', padding: 2 }}><ArrowLeft size={12} color="#fff" /></div>
            <span style={{ fontSize: 11 }}>戻る</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '2px 5px', cursor: 'pointer', opacity: 0.5 }}>
            <div style={{ background: '#245edb', borderRadius: '50%', padding: 2 }}><ArrowRight size={12} color="#fff" /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '2px 5px', cursor: 'pointer' }}>
            <div style={{ background: '#245edb', borderRadius: '50%', padding: 2 }}><ArrowUp size={12} color="#fff" /></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, paddingLeft: 5 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer' }}>
            <Search size={16} color="#4060b0" /> 検索
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, cursor: 'pointer' }}>
            <Folder size={16} color="#c09030" /> フォルダ
          </div>
        </div>
      </div>

      {/* Address Bar */}
      <div style={{ background: '#ece9d8', padding: '3px 8px', borderBottom: '1px solid #7f9db9', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span style={{ fontSize: 11, color: '#666' }}>アドレス(A)</span>
        <div style={{ background: '#fff', border: '1px solid #7f9db9', flex: 1, padding: '2px 5px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5 }}>
          <Folder size={14} color="#c09030" />
          <span>C:\Documents and Settings\Sato\{pathLabel}</span>
          <div style={{ flex: 1 }} />
          <span style={{ color: '#999' }}>▼</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, padding: '0 5px' }}>
          <span style={{ fontSize: 11 }}>移動</span>
          <div style={{ background: '#fff', border: '1px solid #7f9db9', padding: '1px 3px' }}><ArrowRight size={10} color="#008000" /></div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar (Other Places Only) */}
        <div style={{ width: 180, background: '#7ba2e7', padding: 10, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ borderRadius: '5px 5px 0 0', overflow: 'hidden' }}>
            <div style={{ background: '#fff', padding: '4px 10px', color: '#215dc6', fontSize: 11, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              フォルダ <span>▲</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.6)', padding: 10, display: 'flex', flexDirection: 'column', gap: 5, fontSize: 10, color: '#215dc6' }}>
              <div 
                onClick={(e) => { e.stopPropagation(); setCurrentFolderId('documents'); setHistory(prev => [...prev, 'documents']); }} 
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff6600'}
                onMouseLeave={e => e.currentTarget.style.color = '#215dc6'}
              >
                マイドキュメント
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setCurrentFolderId('desktop'); setHistory(prev => [...prev, 'desktop']); }} 
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff6600'}
                onMouseLeave={e => e.currentTarget.style.color = '#215dc6'}
              >
                デスクトップ
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setCurrentFolderId('music'); setHistory(prev => [...prev, 'music']); }} 
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff6600'}
                onMouseLeave={e => e.currentTarget.style.color = '#215dc6'}
              >
                マイ ミュージック
              </div>
              <div 
                onClick={(e) => { e.stopPropagation(); setCurrentFolderId('pictures'); setHistory(prev => [...prev, 'pictures']); }} 
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onMouseEnter={e => e.currentTarget.style.color = '#ff6600'}
                onMouseLeave={e => e.currentTarget.style.color = '#215dc6'}
              >
                マイ ピクチャ
              </div>
            </div>
          </div>
        </div>

        {/* File Area (Icon View) */}
        <div 
          style={{ flex: 1, background: '#fff', padding: 20, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 20, alignContent: 'flex-start', overflowY: 'auto' }}
        >
          {folderFiles.length === 0 ? (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 50, color: '#999', fontSize: 12 }}>このフォルダは空です。</div>
          ) : (
            folderFiles.map(file => (
              <div 
                key={file.id} 
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (file.type === 'folder') {
                    setCurrentFolderId(file.id);
                    setHistory(prev => [...prev, file.id]);
                  } else {
                    openWindow(file, e);
                  }
                }}
                style={{ 
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, cursor: 'pointer', padding: 10, borderRadius: 3, transition: 'background 0.1s',
                  opacity: file.isHidden ? 0.5 : 1
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#e5f3ff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <div style={{ position: 'relative' }}>
                  <FileIcon type={file.type} size={40} />
                </div>
                <div style={{ fontSize: 11, textAlign: 'center', wordBreak: 'break-all', maxWidth: '100%', lineHeight: 1.2 }}>{file.name}</div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Explorer Context Menu */}
      {explorerContextMenu && (
        <div style={{ 
          position: 'absolute', top: explorerContextMenu.y, left: explorerContextMenu.x, 
          background: '#fff', border: '1px solid #7f9db9', boxShadow: '2px 2px 5px rgba(0,0,0,0.2)', zIndex: 100,
          padding: 2, minWidth: 150
        }}>
          <div style={{ padding: '4px 10px', fontSize: 11, color: '#999', cursor: 'default', display: 'flex', justifyContent: 'space-between' }}>
            <span>表示(V)</span><span>▶</span>
          </div>
          <div style={{ padding: '4px 10px', fontSize: 11, color: '#999', cursor: 'default', display: 'flex', justifyContent: 'space-between' }}>
            <span>アイコンの整列(I)</span><span>▶</span>
          </div>
          <div style={{ padding: '4px 10px', fontSize: 11, color: '#000', cursor: 'default' }}>最新の情報に更新(E)</div>
          <div style={{ height: 1, background: '#ccc', margin: '2px 0' }} />
          <div style={{ padding: '4px 10px', fontSize: 11, color: '#999', cursor: 'default' }}>貼り付け(P)</div>
          <div style={{ padding: '4px 10px', fontSize: 11, color: '#999', cursor: 'default' }}>ショートカットの貼り付け(S)</div>
          <div style={{ height: 1, background: '#ccc', margin: '2px 0' }} />
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setShowHiddenFiles(!showHiddenFiles);
              setExplorerContextMenu(null);
            }}
            style={{ padding: '4px 10px', fontSize: 11, cursor: 'pointer', background: '#fff', color: '#000' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#316ac5'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#000'; }}
          >
            {showHiddenFiles ? '隠しファイルを表示しない' : '隠しファイルを表示する(H)'}
          </div>
          <div style={{ height: 1, background: '#ccc', margin: '2px 0' }} />
          <div style={{ padding: '4px 10px', fontSize: 11, color: '#999', cursor: 'default', display: 'flex', justifyContent: 'space-between' }}>
            <span>新規作成(W)</span><span>▶</span>
          </div>
          <div style={{ height: 1, background: '#ccc', margin: '2px 0' }} />
          <div style={{ padding: '4px 10px', fontSize: 11, color: '#000', cursor: 'default' }}>プロパティ(R)</div>
        </div>
      )}

      {/* Status Bar */}
      <div style={{ background: '#ece9d8', borderTop: '1px solid #7f9db9', padding: '2px 10px', fontSize: 11, display: 'flex', justifyContent: 'space-between', color: '#333' }}>
        <div>{folderFiles.length} 個のオブジェクト</div>
        <div style={{ borderLeft: '1px solid #999', paddingLeft: 10 }}><Monitor size={12} style={{ marginRight: 5 }} />マイ コンピュータ</div>
      </div>
    </div>
  );
}
function HackingSequence({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'hacking' | 'threat' | 'ending'>('hacking');
  const [windows, setWindows] = useState<{ id: number, x: number, y: number, type: 'terminal' | 'transfer', content: any }[]>([]);
  const [glitchLine, setGlitchLine] = useState(false);

  const hackingSteps = [
    { type: 'terminal' as const, x: 3, y: 8, content: [
      'INITIALIZING REMOTE EXPLOIT...',
      'TARGET: 192.168.x.x -> BRIDGING...',
      'PAYLOAD INJECTION: [=====>    ] 60%',
      'PAYLOAD INJECTION: [=========>] 100% DONE',
      'SHELL ACQUIRED. ROOT ACCESS GRANTED.',
    ]},
    { type: 'terminal' as const, x: 62, y: 12, content: [
      'DUMPING IDENTITY ARCHIVE...',
      'user.db [████████░░] 80%',
      'browser_history.db [██████████] 100%',
      'UPLOAD -> UNKNOWN_REMOTE: OK',
      'CLEARING LOCAL TRACES...',
    ]},
    { type: 'transfer' as const, x: 8, y: 55, content: 'USER_IDENTITY_ARCHIVE.tar.gz' },
    { type: 'transfer' as const, x: 60, y: 58, content: 'BROWSER_HISTORY_FULL_DUMP.db' },
    { type: 'terminal' as const, x: 32, y: 48, content: [
      'GEOLOCATION_DATA: EXTRACTING...',
      'GPS: [██████████] LOCKED',
      'REPORTING TO REMOTE SERVER...',
      '> TARGET_DETECTED: CONFIRMED',
      '> IDENTITY_TRANSFER: COMPLETE',
    ]},
  ];

  useEffect(() => {
    // グリッチ演出
    const glitchInterval = setInterval(() => setGlitchLine(v => !v), 180);
    let count = 0;
    const interval = setInterval(() => {
      if (count < hackingSteps.length) {
        setWindows(prev => [...prev, { id: count, ...hackingSteps[count] }]);
        count++;
      } else {
        clearInterval(interval);
        clearInterval(glitchInterval);
        setTimeout(() => setPhase('threat'), 1800);
      }
    }, 1600);
    return () => { clearInterval(interval); clearInterval(glitchInterval); };
  }, []);

  if (phase === 'ending') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 1000000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'monospace' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5 }} style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 84, letterSpacing: 12, color: '#cc0000', marginBottom: 20, fontWeight: 'bold', textShadow: '0 0 20px rgba(204,0,0,0.5)' }}>— B A D   E N D —</div>
          <h1 style={{ fontSize: 40, color: '#cc0000', marginBottom: 20, letterSpacing: 4, fontWeight: 'bold' }}>SYSTEM TAKEOVER COMPLETE</h1>
          <div style={{ color: '#777', fontSize: 13, lineHeight: 2, maxWidth: 480, margin: '0 auto', marginBottom: 40 }}>
            あなたのデジタル情報はすべて回収された。<br/>
            追跡されるIPアドレスはあなたのものだ。<br/>
            身代わりとして利用された。
          </div>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
            <button onClick={() => window.location.reload()} style={{ background: '#1a1a1a', color: '#ccc', border: '1px solid #444', padding: '12px 28px', cursor: 'pointer', fontFamily: 'monospace', fontSize: 13 }}>最初からやり直す</button>
            <a href="https://forms.gle/mVf9rxniy3EyY8BR7" target="_blank" rel="noopener noreferrer" style={{ background: '#cc0000', color: '#fff', textDecoration: 'none', padding: '12px 28px', fontFamily: 'monospace', fontSize: 13, display: 'flex', alignItems: 'center' }}>感想フォームへ</a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999999,
      overflow: 'hidden',
      background: phase === 'hacking' ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0.92)',
      transition: 'background 1.5s ease-in-out'
    }}>
      {/* スキャンライン */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)', zIndex: 1 }} />
      {/* グリッチ水平線 */}
      {glitchLine && <div style={{ position: 'absolute', top: `${Math.random() * 100}%`, left: 0, right: 0, height: 2, background: 'rgba(255,0,0,0.4)', zIndex: 2, mixBlendMode: 'screen' }} />}
      {/* Background Windows remain during threat phase */}
      {windows.map((win) => (
        <motion.div
          key={win.id}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={{
            position: 'absolute', left: `${win.x}%`, top: `${win.y}%`,
            width: win.type === 'terminal' ? 350 : 300, 
            height: win.type === 'terminal' ? 220 : 150, 
            background: '#000', border: '1px solid #0055e0',
            boxShadow: '10px 10px 30px rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column',
            zIndex: 100001
          }}
        >
          <div style={{ background: 'linear-gradient(to right, #0058ee, #3a93ff)', color: '#fff', padding: '3px 8px', fontSize: 10, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
            <span>{win.type === 'terminal' ? 'C:\\WINDOWS\\system32\\cmd.exe' : 'DATA_TRANSFER'}</span>
            <div style={{ width: 14, height: 14, background: '#e04343', border: '1px solid #fff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</div>
          </div>
          {win.type === 'terminal' && (
            <TypingTerminal code={win.content} />
          )}
          {win.type === 'transfer' && (
            <div style={{ flex: 1, padding: 15, color: '#0f0', fontFamily: 'monospace', fontSize: 10 }}>
              <div style={{ marginBottom: 10 }}>FILE: {win.content}</div>
              <div style={{ width: '100%', height: 20, border: '1px solid #0f0', padding: 2 }}>
                <motion.div 
                  initial={{ width: 0 }} 
                  animate={{ width: '100%' }} 
                  transition={{ duration: 15 }} 
                  style={{ height: '100%', background: '#0f0' }} 
                />
              </div>
              <div style={{ marginTop: 10 }}>UPLOADING_TO_UNKNOWN_SERVER...</div>
            </div>
          )}
        </motion.div>
      ))}

      {phase === 'threat' && (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, background: 'rgba(0,0,0,0.6)', pointerEvents: 'auto', zIndex: 200000 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{ 
              width: 700, height: 400, background: 'rgba(0,0,0,0.95)', border: '2px solid #0055e0',
              boxShadow: '0 0 100px rgba(0,85,224,0.6)', display: 'flex', flexDirection: 'column',
              zIndex: 200001
            }}
          >
            <div style={{ background: 'linear-gradient(to right, #0058ee, #3a93ff)', color: '#fff', padding: '5px 12px', fontSize: 12, fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
              <span>管理者: コマンド プロンプト - 緊急</span>
              <div style={{ width: 18, height: 18, background: '#e04343', border: '1px solid #fff', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</div>
            </div>
            <div style={{ flex: 1, padding: 30, color: '#f00', fontFamily: 'monospace', fontSize: 18, lineHeight: 2 }}>
              <div style={{ marginBottom: 30, fontWeight: 'bold', fontSize: 28, textAlign: 'center', textShadow: '0 0 10px #f00' }}>[ SYSTEM_TAKEOVER_COMPLETE ]</div>
              <TypingText text="無知な好奇心の報いだ。システムは完全に掌握した。&#10;お前のパソコンから、警察に全ての犯行ログを送信しておいた。&#10;&#10;追跡されるIPアドレスはお前のものだ。&#10;時期に逮捕されるだろう。&#10;&#10;お前が、私の身代わりだ。&#10;&#10;さよなら。" delay={100} />
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 8 }}
            onClick={() => setPhase('ending')}
            style={{ marginTop: 40, background: 'rgba(255,0,0,0.9)', color: '#fff', border: '1px solid #fff', padding: '12px 60px', cursor: 'pointer', fontFamily: 'monospace', fontWeight: 'bold', backdropFilter: 'blur(10px)', zIndex: 200002 }}
          >
            運命を受け入れる (ACCEPT_FATE)
          </motion.button>
        </div>
      )}
    </div>
  );
}

function TypingTerminal({ code }: { code: string[] }) {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentLineIdx = 0;
    let currentCharIdx = 0;
    let isTyping = true;

    const typeNext = () => {
      if (!isTyping) return;

      if (currentLineIdx >= code.length) {
        isTyping = false;
        return;
      }

      const rawLine = code[currentLineIdx];
      const isOverwrite = rawLine.startsWith('\r');
      const textToType = isOverwrite ? rawLine.substring(1) : rawLine;

      setDisplayedLines(prev => {
        const next = [...prev];
        
        if (currentCharIdx === 0) {
          if (isOverwrite && next.length > 0) {
            next[next.length - 1] = textToType[0];
          } else {
            next.push(textToType[0]);
          }
        } else {
          next[next.length - 1] = textToType.substring(0, currentCharIdx + 1);
        }
        return next;
      });

      currentCharIdx++;

      if (currentCharIdx >= textToType.length) {
        currentLineIdx++;
        currentCharIdx = 0;
        setTimeout(typeNext, 150);
      } else {
        setTimeout(typeNext, 15);
      }
    };

    const initialTimeout = setTimeout(typeNext, 100);
    return () => {
      isTyping = false;
      clearTimeout(initialTimeout);
    };
  }, [code]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedLines]);

  return (
    <div 
      ref={scrollRef}
      style={{ flex: 1, padding: 10, color: '#0f0', fontFamily: 'monospace', fontSize: 10, overflowY: 'auto', scrollbarWidth: 'none', backgroundColor: '#000' }}
    >
      {displayedLines.map((line, i) => (
        <div key={i} style={{ marginBottom: 4, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          &gt; {line}
        </div>
      ))}
      <motion.div 
        animate={{ opacity: [1, 0, 1] }} 
        transition={{ duration: 0.5, repeat: Infinity }}
        style={{ width: 6, height: 10, background: '#0f0', display: 'inline-block', verticalAlign: 'middle' }}
      />
    </div>
  );
}

function SecretAppTyping({ progress }: { progress: number }) {
  const [messages, setMessages] = useState<string[]>([]);
  const lastProgress = useRef(0);

  const logs = [
    { threshold: 5, text: "ブロックの整合性を確認中..." },
    { threshold: 15, text: "メタデータを抽出中..." },
    { threshold: 30, text: "ファイルヘッダーの検証... OK" },
    { threshold: 45, text: "暗号化レイヤーの剥離を開始" },
    { threshold: 55, text: "バッファオーバーフローを検出... 無視されました" },
    { threshold: 70, text: "仮想マシンの検知を回避" },
    { threshold: 85, text: "ペイロードを実行中..." },
    { threshold: 95, text: "最終的な整合性チェック..." }
  ];

  useEffect(() => {
    const newLogs = logs.filter(l => l.threshold <= progress && l.threshold > lastProgress.current);
    if (newLogs.length > 0) {
      setMessages(prev => [...prev, ...newLogs.map(l => l.text)]);
      lastProgress.current = progress;
    }
  }, [progress]);

  return (
    <div style={{ fontSize: 10, color: '#008800', fontFamily: 'monospace', textAlign: 'left', maxHeight: 100, overflowY: 'auto' }}>
      {messages.map((m, i) => (
        <div key={i} style={{ marginBottom: 4 }}>
          &gt; <TypingSpan text={m} />
        </div>
      ))}
    </div>
  );
}

function TypingSpan({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      setDisplayed(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(t);
    }, 20);
    return () => clearInterval(t);
  }, [text]);
  return <span>{displayed}</span>;
}

function TypingText({ text, delay }: { text: string, delay: number }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(timer);
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);

  return <div style={{ whiteSpace: 'pre-wrap' }}>&gt; {displayedText}<span style={{ display: 'inline-block', width: 10, height: 20, background: '#f00', marginLeft: 5, verticalAlign: 'middle' }} /></div>;
}
