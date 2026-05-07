export interface File {
  id: string;
  name: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'trash' | 'folder' | 'browser' | 'mail' | 'paint' | 'music' | 'app' | 'documents' | 'pictures' | 'explorer' | 'desktop';
  folder?: string;
  appId?: string;
  content?: string;
  src?: string;
  isLocked?: boolean;
  password?: string;
  isUnlocked?: boolean;
  isHidden?: boolean;
  isCorrupted?: boolean;
  position: { x: number; y: number };
  icon?: string;
}

export interface WindowState extends File {
  title: string;
  zIndex: number;
  isMinimized: boolean;
  isMaximized?: boolean;
  x?: number;
  y?: number;
}

export interface FolderData {
  [key: string]: File[];
}
