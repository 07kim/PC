'use client';

import { useState, useCallback, useEffect } from 'react';
import { File, WindowState } from '@/types/os';
import storyData from '@/data/story.json';

export const useOS = () => {
  // Maintenance.exe を初期状態から除外
  const initialFiles = (storyData.initial_files as File[]).filter(f => f.appId !== 'maintenance');
  const [files, setFiles] = useState<File[]>(initialFiles);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  
  const [systemTime, setSystemTime] = useState<Date>(new Date());
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [isHacked, setIsHacked] = useState(false);
  const [isGlitched, setIsGlitched] = useState(false);
  const [isRebooting, setIsRebooting] = useState(false);
  const [gameEnded, setGameEnded] = useState<'good' | 'bad' | null>(null);
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setSystemTime(prev => new Date(prev.getTime() + 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const focusWindow = useCallback((id: string) => {
    setWindows(prev => {
      const maxZ = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : 10;
      return prev.map(w => ({
        ...w,
        zIndex: w.id === id ? maxZ + 1 : w.zIndex,
        isMinimized: w.id === id ? false : w.isMinimized
      }));
    });
    setActiveWindowId(id);
  }, []);

  const openWindow = useCallback((file: File) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === file.id);
      if (existing) {
        focusWindow(file.id);
        return prev;
      }

      const maxZ = prev.length > 0 ? Math.max(...prev.map(w => w.zIndex)) : 10;
      const stackIndex = (maxZ - 10) % 5;
      
      const newWindow: WindowState = {
        ...file,
        title: file.name,
        zIndex: maxZ + 1,
        isMinimized: false,
        x: 100 + stackIndex * 30,
        y: 60 + stackIndex * 30
      };
      setActiveWindowId(file.id);
      return [...prev, newWindow];
    });
  }, [focusWindow]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ));
    setActiveWindowId(null);
  }, []);

  const toggleMaximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
    ));
  }, []);

  const downloadApp = useCallback((appId: string) => {
    if (appId === 'secret') {
      const secretFile: File = {
        id: 'secret_app_file',
        appId: 'secret_app',
        name: 'マル秘.exe',
        type: 'app',
        content: '',
        position: { x: 340, y: 150 }
      };
      setFiles(prev => {
        if (prev.find(f => f.id === 'secret_app_file')) return prev;
        return [...prev, secretFile];
      });
      return;
    }

    const appFile = (storyData.initial_files as File[]).find(f => f.appId === appId);
    if (appFile) {
      setFiles(prev => {
        if (prev.find(f => f.appId === appId)) return prev;
        return [...prev, appFile];
      });
    }
  }, []);

  const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, x, y } : w
    ));
  }, []);

  const restoreFile = useCallback((id: string) => {
    const fileToRestore = storyData.trash_files.find((f: any) => f.id === id);
    if (fileToRestore) {
      setFiles(prev => {
        if (prev.find(f => f.id === id)) return prev;
        const restoredFile = { 
          ...fileToRestore, 
          position: { x: 240, y: 150 } 
        } as File;
        return [...prev, restoredFile];
      });
    }
  }, []);

  const updateFileContent = useCallback((id: string, content: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, content } : f));
    setWindows(prev => prev.map(w => w.id === id ? { ...w, content } : w));
  }, []);

  const unlockWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isUnlocked: true } : w));
    setFiles(prev => prev.map(f => f.id === id ? { ...f, isUnlocked: true } : f));
  }, []);

  const changeSystemTime = useCallback((newDate: Date) => {
    setSystemTime(newDate);
  }, []);

  const triggerHack = useCallback(() => {
    setIsGlitched(true);
    setTimeout(() => {
      setIsHacked(true);
      setGameEnded('bad');
    }, 2000);
  }, []);

  const addSecretFile = useCallback(() => {
    // secret_txt は廃止されたため何もしない
  }, []);

  const addEvidenceFile = useCallback(() => {
    const evidenceFile: File = {
      id: 'evidence_log',
      appId: 'evidence_log',
      name: 'operation_report_0415.txt',
      type: 'text',
      content: `=========================================================
SYSTEM LOG DUMP - D-DROP OPERATION DATABASE
=========================================================
[TIMESTAMP] 2021-04-15 15:10:00 UTC+9
[NODE_ID] N-8842-8843 (LOCAL_ROUTER_BYPASS)
[STATUS] DECRYPTED

>> OPERATION_PHASE_RECORDS
[SEQ: 001] 04-10 14:02 : ターゲット捕捉 (GPS_TRACE_ID: 994-A)
  LOCATION: 習志野市内 国道沿い
  ACTION: 車両(成田 330 X 10-24)にて対象を確保。通信機器の電波遮断ポーチへの封入完了。
  
[SEQ: 002] 04-10 15:35 : 拠点への搬入完了
  LOCATION: メゾン津田沼 302号室
  ACTION: 窓ガラスへの防音シート貼付、および監視カメラ(CAM-01〜04)の設置・稼働確認。
  NOTE: ターゲットへの鎮静剤投与を実施。脈拍・呼吸は正常値を維持。

[SEQ: 003] 04-11 22:15 : ネットワーク偽装工作
  ACTION: D-DROPプロキシチェーンを構築。接続元IPをウクライナ経由のダミーノードへ偽装。
  NOTE: 警察のNシステムおよび監視カメラ網のデータクリーニングを外部委託(支払済: 0.5 BTC)。

[SEQ: 004] 04-12 11:20 : ロジスティクス・エラー報告
  ERROR_ID: LOG-404
  DETAIL: Sato(実行犯/システム管理)が、Amazon経由での機材手配において、配送先を誤って『メゾン津田沼 2-17-1 302号室』に直接指定。
  RESOLUTION: 置き配指定への変更、および受け取り時の顔面マスキングを指示。リスクスコアが上昇。

[SEQ: 005] 04-13 19:40 : 脅迫プロトコル開始
  ACTION: ターゲットの親族宛にTorネットワーク経由で接触。要求額(1.2億)および指定ウォレットアドレスを送付。
  
[SEQ: 006] 04-14 08:30 : サイバー防御フェーズ
  ACTION: プロバイダからの照会パケットを検知。ルーティングテーブルを書き換え、トラフィックを分散化。

>> ENTITY_RELATION_DATA
[OP-01] 指示役・交渉担当
  ALIAS: K.Suzuki
  DEVICE: ENCRYPTED_TOR_PHONE

[OP-02] 実行犯・拠点提供・システム管理
  ALIAS: Sato
  NAME: 佐藤裕也
  BASE_ADDR: メゾン津田沼 2-17-1 302
  NOTE: 本拠点の契約名義人。エラー(SEQ: 004)の原因。

[OP-03] 車両手配・見張り役
  ALIAS: M.Tanaka
  NOTE: トラックの調達および現場周辺の巡回を担当。

>> SYSTEM_AUTOMATION
SCHEDULED_TASK: 2021-04-16 00:00 - ウォレット着金確認後、対象の再移送フェーズへ移行。本ログファイルを含むローカルディスクの完全消去(Zero-fill)を実行予定。

=========================================================
END OF LOG
=========================================================`,
      position: { x: 440, y: 150 },
      isUnlocked: true
    };
    setFiles(prev => {
      if (prev.find(f => f.id === 'evidence_log')) return prev;
      return [...prev, evidenceFile];
    });
  }, []);

  const [extraMails, setExtraMails] = useState<any[]>([]);

  const addEmail = useCallback((email: any) => {
    setExtraMails(prev => [email, ...prev]);
  }, []);

  const triggerGoodEnd = useCallback(() => {
    setGameEnded('good');
  }, []);

  return {
    windows,
    activeWindowId,
    openWindow,
    closeWindow,
    minimizeWindow,
    toggleMaximizeWindow,
    focusWindow,
    updateWindowPosition,
    files,
    restoreFile,
    updateFileContent,
    unlockWindow,
    systemTime,
    changeSystemTime,
    isHacked,
    isGlitched,
    isRebooting,
    gameEnded,
    triggerHack,
    addSecretFile,
    downloadApp,
    addEvidenceFile,
    extraMails,
    addEmail,
    folders: {},
    triggerGoodEnd,
    showQuickSettings,
    setShowQuickSettings,
    isMaintenanceDownloaded: files.some(f => f.appId === 'maintenance')
  };
};
