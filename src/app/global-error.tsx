"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          fontFamily: 'system-ui, sans-serif' 
        }}>
          <h2>عذراً، حدث خطأ غير متوقع في النظام!</h2>
          <button 
            onClick={() => reset()} 
            style={{ 
              padding: '10px 20px', 
              marginTop: '20px', 
              cursor: 'pointer',
              background: '#0b5c47',
              color: 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            حاول مرة أخرى
          </button>
        </div>
      </body>
    </html>
  );
}
