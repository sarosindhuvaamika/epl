export default function Loader({ dark = false, mini = false }) {
  if (mini) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center" style={{ background: 'rgba(10,10,26,0.7)', backdropFilter: 'blur(4px)' }}>
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: '#ec38bc', borderRightColor: '#7303c0' }}></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent animate-spin" style={{ borderBottomColor: '#ff6022', borderLeftColor: '#ec38bc', animationDirection: 'reverse', animationDuration: '0.6s' }}></div>
          </div>
          <p className="text-xs font-medium" style={{ color: '#888' }}>Processing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-transparent animate-spin" style={{ borderTopColor: '#ec38bc', borderRightColor: '#7303c0' }}></div>
        <div className="absolute inset-2 rounded-full border-2 border-transparent animate-spin" style={{ borderBottomColor: '#ff6022', borderLeftColor: '#ec38bc', animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
      <p className={`mt-4 text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>Loading...</p>
    </div>
  );
}
