export default function Loader({ dark = false }) {
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
