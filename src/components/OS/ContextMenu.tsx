'use client';

interface Props {
  x: number;
  y: number;
  items: any[];
  onClose: () => void;
}

export const ContextMenu = ({ x, y, items, onClose }: Props) => {
  return (
    <div style={{
      position: 'fixed', top: y, left: x, width: 180, background: '#fff',
      border: '1px solid #aca899', zIndex: 999999, boxShadow: '2px 2px 4px rgba(0,0,0,0.3)',
      padding: 2, fontSize: 12, fontFamily: 'Tahoma, sans-serif'
    }}>
      {items.map((item, i) => (
        item.separator ? (
          <div key={i} style={{ height: 1, background: '#aca899', margin: '3px 1px' }} />
        ) : (
          <div 
            key={i} 
            onClick={(e) => {
              e.stopPropagation();
              if (!item.disabled) {
                item.action?.();
                onClose();
              }
            }}
            style={{ 
              padding: '3px 20px', 
              cursor: item.disabled ? 'default' : 'pointer',
              color: item.disabled ? '#aca899' : '#000',
              display: 'flex',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              if (!item.disabled) {
                e.currentTarget.style.background = '#316ac5';
                e.currentTarget.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!item.disabled) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#000';
              }
            }}
          >
            {item.label}
          </div>
        )
      ))}
    </div>
  );
};
