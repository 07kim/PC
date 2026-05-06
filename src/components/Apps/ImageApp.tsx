'use client';

interface Props {
  src: string;
  title: string;
}

export const ImageApp = ({ src, title }: Props) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      background: '#e0e0e0',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        overflow: 'auto'
      }}>
        <img 
          src={src} 
          alt={title} 
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        />
      </div>
    </div>
  );
};
