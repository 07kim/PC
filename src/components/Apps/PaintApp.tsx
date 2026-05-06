'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Pencil, Eraser, Square, Circle, Minus, Trash2 } from 'lucide-react';

type Tool = 'pen' | 'eraser' | 'line' | 'rect' | 'ellipse';

const COLORS = ['#000000', '#ffffff', '#ff0000', '#00aa00', '#0000ff', '#ffff00', '#ff8800', '#ff00ff', '#00ffff', '#888888', '#884400', '#004488'];
const SIZES = [1, 3, 6, 12];

export const PaintApp = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tool, setTool] = useState<Tool>('pen');
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  const [drawing, setDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const snapshotRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getPos(e);
    setDrawing(true);
    setStartPos(pos);
    const ctx = canvasRef.current!.getContext('2d')!;
    snapshotRef.current = ctx.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    if (tool === 'pen' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(pos.x, pos.y);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const pos = getPos(e);
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#ffffff';
      ctx.lineTo(pos.x, pos.y);
      ctx.stroke();
    } else {
      ctx.putImageData(snapshotRef.current!, 0, 0);
      ctx.strokeStyle = color;
      ctx.beginPath();
      if (tool === 'line') {
        ctx.moveTo(startPos.x, startPos.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'rect') {
        ctx.strokeRect(startPos.x, startPos.y, pos.x - startPos.x, pos.y - startPos.y);
      } else if (tool === 'ellipse') {
        const rx = Math.abs(pos.x - startPos.x) / 2;
        const ry = Math.abs(pos.y - startPos.y) / 2;
        ctx.ellipse(startPos.x + (pos.x - startPos.x) / 2, startPos.y + (pos.y - startPos.y) / 2, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const handleMouseUp = () => setDrawing(false);

  const clearCanvas = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const TOOLS: { key: Tool; icon: React.ReactNode; label: string }[] = [
    { key: 'pen', icon: <Pencil size={16} />, label: 'ペン' },
    { key: 'eraser', icon: <Eraser size={16} />, label: '消しゴム' },
    { key: 'line', icon: <Minus size={16} />, label: '直線' },
    { key: 'rect', icon: <Square size={16} />, label: '四角形' },
    { key: 'ellipse', icon: <Circle size={16} />, label: '楕円' },
  ];

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#ece9d8', userSelect: 'none' }}>
      {/* Toolbar */}
      <div style={{ padding: '4px 8px', borderBottom: '1px solid #aca899', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        {/* Tools */}
        <div style={{ display: 'flex', gap: 2 }}>
          {TOOLS.map(t => (
            <button key={t.key} title={t.label} onClick={() => setTool(t.key)}
              style={{ padding: 4, background: tool === t.key ? '#316ac5' : '#ece9d8', color: tool === t.key ? '#fff' : '#333', border: '1px solid', borderColor: tool === t.key ? '#1a4cb0' : '#aca899', cursor: 'pointer', borderRadius: 2 }}>
              {t.icon}
            </button>
          ))}
        </div>
        <div style={{ width: 1, height: 20, background: '#aca899' }} />
        {/* Sizes */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {SIZES.map(s => (
            <div key={s} onClick={() => setSize(s)} style={{ width: s + 8, height: s + 8, borderRadius: '50%', background: size === s ? '#316ac5' : '#444', cursor: 'pointer', border: size === s ? '2px solid #1a4cb0' : '1px solid #888' }} />
          ))}
        </div>
        <div style={{ width: 1, height: 20, background: '#aca899' }} />
        {/* Colors */}
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', maxWidth: 120 }}>
          {COLORS.map(c => (
            <div key={c} onClick={() => setColor(c)}
              style={{ width: 14, height: 14, background: c, border: color === c ? '2px solid #333' : '1px solid #888', cursor: 'pointer', boxSizing: 'border-box' }} />
          ))}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <button onClick={clearCanvas} title="クリア" style={{ padding: '3px 6px', background: '#ece9d8', border: '1px solid #aca899', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
            <Trash2 size={12} /> クリア
          </button>
        </div>
      </div>
      {/* Canvas area */}
      <div style={{ flex: 1, overflow: 'auto', background: '#808080', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: 8 }}>
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: tool === 'eraser' ? 'cell' : 'crosshair', display: 'block', boxShadow: '2px 2px 6px rgba(0,0,0,0.5)' }}
        />
      </div>
      {/* Status */}
      <div style={{ height: 20, background: '#ece9d8', borderTop: '1px solid #aca899', display: 'flex', alignItems: 'center', padding: '0 8px', fontSize: 11, color: '#555' }}>
        ツール: {TOOLS.find(t => t.key === tool)?.label} ／ サイズ: {size}px ／ 色: {color}
      </div>
    </div>
  );
};
