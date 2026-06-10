import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const gradients = {
  '/': 'linear-gradient(135deg, #7303c0 0%, #ec38bc 50%, #ff6022 100%)',
  '/matches': 'linear-gradient(135deg, #03001e 0%, #7303c0 50%, #ec38bc 100%)',
  '/tournaments': 'linear-gradient(135deg, #ec38bc 0%, #7303c0 50%, #03001e 100%)',
  '/districts': 'linear-gradient(135deg, #ff6022 0%, #ec38bc 50%, #7303c0 100%)',
  '/points-table': 'linear-gradient(135deg, #03001e 0%, #ec38bc 50%, #ff6022 100%)',
  '/stats': 'linear-gradient(135deg, #7303c0 0%, #03001e 50%, #ec38bc 100%)',
  '/about': 'linear-gradient(135deg, #ff6022 0%, #7303c0 50%, #03001e 100%)',
  '/login': 'linear-gradient(135deg, #03001e 0%, #27253f 50%, #7303c0 100%)',
  '/register': 'linear-gradient(135deg, #03001e 0%, #27253f 50%, #7303c0 100%)',
};

const titles = {
  '/': { title: 'Welcome to EPL', subtitle: 'Exterro Premier League — Corporate Cricket at its Best' },
  '/matches': { title: 'Matches', subtitle: 'View all scheduled, live and completed matches' },
  '/tournaments': { title: 'Tournaments', subtitle: 'Explore all cricket tournaments' },
  '/districts': { title: 'Districts', subtitle: 'Browse all participating districts' },
  '/points-table': { title: 'Points Table', subtitle: 'Team standings and rankings' },
  '/stats': { title: 'Player Stats', subtitle: 'Top performers in batting, bowling and fielding' },
  '/about': { title: 'About Us', subtitle: 'Learn more about the Exterro Premier League' },
  '/login': { title: 'Sign In', subtitle: 'Access your EPL account' },
  '/register': { title: 'Create Account', subtitle: 'Join the Exterro Premier League community' },
};

export default function PageHero({ title: customTitle, subtitle: customSubtitle, breadcrumbs: customBreadcrumbs }) {
  const location = useLocation();
  const { colors } = useTheme();
  const path = location.pathname;

  const gradient = gradients[path] || gradients['/'];
  const pageInfo = titles[path] || { title: 'EPL', subtitle: '' };
  const displayTitle = customTitle || pageInfo.title;
  const displaySubtitle = customSubtitle || pageInfo.subtitle;

  // Auto-generate breadcrumbs
  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) return customBreadcrumbs;
    const parts = path.split('/').filter(Boolean);
    const crumbs = [{ label: 'Home', path: '/' }];
    let current = '';
    parts.forEach(part => {
      current += `/${part}`;
      const label = part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' ');
      crumbs.push({ label, path: current });
    });
    return crumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <div className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0" style={{ background: gradient, opacity: 0.9 }}></div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%),
                          radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 40%),
                          radial-gradient(circle at 60% 80%, rgba(255,255,255,0.15) 0%, transparent 30%)`,
      }}></div>

      {/* Decorative Shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(30%, -50%)' }}></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-30%, 50%)' }}></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs mb-3">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.path} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="w-3 h-3 opacity-50" fill="none" stroke="white" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              )}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-white font-medium opacity-90">{crumb.label}</span>
              ) : (
                <Link to={crumb.path} className="text-white/60 hover:text-white transition-colors">{crumb.label}</Link>
              )}
            </span>
          ))}
        </nav>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-white">{displayTitle}</h1>
        {displaySubtitle && <p className="text-sm md:text-base mt-1 text-white/70">{displaySubtitle}</p>}
      </div>
    </div>
  );
}
