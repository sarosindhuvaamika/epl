import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/matches', label: 'Matches', icon: '🏏' },
  { path: '/tournaments', label: 'Tournaments', icon: '🏆' },
  { path: '/points-table', label: 'Points Table', icon: '📊' },
  { path: '/stats', label: 'Stats', icon: '📈' },
  { path: '/districts', label: 'Districts', icon: '📍' },
  { path: '/about', label: 'About Us', icon: 'ℹ️' },
];

export default function Navbar() {
  const { user } = useAuth();
  const { isDark, colors } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block transition-all duration-300" style={{
        background: scrolled ? colors.navBgScrolled : colors.navBg,
        backdropFilter: 'blur(20px)',
        boxShadow: scrolled ? (isDark ? '0 4px 30px rgba(0,0,0,0.3)' : '0 4px 30px rgba(115,3,192,0.15)') : 'none',
        borderBottom: isDark ? '1px solid rgba(104,102,120,0.15)' : '1px solid rgba(115,3,192,0.1)',
      }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img src="/exterro.svg" alt="Exterro" className="h-7 transition-transform group-hover:scale-105" />
              <div className="hidden lg:flex flex-col leading-tight">
                <span className="font-bold text-sm text-white">Premier League</span>
                <span className="text-xs" style={{ color: '#b4b2be' }}>Cricket Tournament</span>
              </div>
            </Link>

            {/* Right - Nav + User */}
            <div className="flex items-center gap-6">
              {/* Navigation */}
              <div className="flex items-center gap-1">
                {navLinks.map(link => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-4 py-2 text-sm font-medium transition-all duration-200 rounded-lg group"
                    style={{ color: isActive(link.path) ? 'white' : '#b4b2be' }}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {isActive(link.path) && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4/5 h-0.5 rounded-full" style={{ background: 'linear-gradient(90deg, #7303c0, #ec38bc)' }}></span>
                    )}
                    <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(115,3,192,0.1)' }}></span>
                  </Link>
                ))}
              </div>

              {/* User */}
              {user ? (
                <div className="flex items-center gap-3">
                  {user.role === 'admin' && (
                    <Link to="/admin" className="relative px-3 py-1.5 text-xs font-semibold rounded-lg overflow-hidden" style={{ color: '#ff6022' }}>
                      <span className="absolute inset-0 rounded-lg" style={{ background: 'rgba(255,96,34,0.1)', border: '1px solid rgba(255,96,34,0.2)' }}></span>
                      <span className="relative flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Admin
                      </span>
                    </Link>
                  )}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(39,37,63,0.6)', border: '1px solid rgba(104,102,120,0.2)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-white">{user.username}</span>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Top Navbar */}
      <nav className="md:hidden" style={{ background: '#03001e', borderBottom: '1px solid rgba(104,102,120,0.3)' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src="/exterro.svg" alt="Exterro" className="h-6" />
            <span className="text-white font-bold text-sm">EPL</span>
          </Link>
          <div className="flex items-center gap-2">
            {user && user.role === 'admin' && (
              <Link to="/admin" className="px-2 py-1 rounded-lg text-[10px] font-semibold" style={{ color: '#ff6022', background: 'rgba(255,96,34,0.1)' }}>Admin</Link>
            )}
            {user && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
                {user.username?.charAt(0).toUpperCase()}
              </div>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="w-8 h-8 flex items-center justify-center rounded-lg" style={{ background: menuOpen ? 'rgba(115,3,192,0.2)' : 'transparent' }}>
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#b4b2be" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="#b4b2be" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        <div className={`overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`} style={{ background: '#03001e', borderTop: menuOpen ? '1px solid rgba(104,102,120,0.2)' : 'none' }}>
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ color: isActive(link.path) ? 'white' : '#b4b2be', background: isActive(link.path) ? 'rgba(115,3,192,0.2)' : 'transparent' }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
                {isActive(link.path) && <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#ec38bc' }}></span>}
              </Link>
            ))}
            {user ? (
              <div className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(104,102,120,0.2)' }}>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{user.username}</p>
                    <p className="text-[10px]" style={{ color: '#686678' }}>{user.role}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-2 mt-2" style={{ borderTop: '1px solid rgba(104,102,120,0.2)' }}>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50" style={{ background: '#03001e', borderTop: '1px solid rgba(104,102,120,0.3)' }}>
        <div className="flex items-center justify-around px-2 py-2">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all"
              style={{ background: isActive(link.path) ? 'rgba(115,3,192,0.2)' : 'transparent' }}
            >
              <span className="text-base">{link.icon}</span>
              <span className="text-[10px] font-medium" style={{ color: isActive(link.path) ? '#ec38bc' : '#b4b2be' }}>{link.label}</span>
            </Link>
          ))}
        </div>
      </nav>

    </>
  );
}
