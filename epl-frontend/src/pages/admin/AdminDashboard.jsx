import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminDataProvider, useAdminData } from '../../context/AdminDataContext';
import { Navigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import ManageTeams from './ManageTeams';
import ManagePlayers from './ManagePlayers';
import ManageMatches from './ManageMatches';
import ManageTournaments from './ManageTournaments';
import ManageDistricts from './ManageDistricts';
import ManageGroups from './ManageGroups';
import ManageVenues from './ManageVenues';
import Scoring from './Scoring';

const tabs = [
  { key: 'Scoring', label: '🏏 Scoring' },
  { key: 'Matches', label: '📅 Matches' },
  { key: 'Tournaments', label: '🏆 Tournaments' },
  { key: 'Groups', label: '📋 Groups' },
  { key: 'Teams', label: '👥 Teams' },
  { key: 'Players', label: '🧑 Players' },
  { key: 'Venues', label: '🏟️ Venues' },
  { key: 'Districts', label: '📍 Districts' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  return (
    <AdminDataProvider>
      <AdminDashboardInner />
    </AdminDataProvider>
  );
}

function AdminDashboardInner() {
  const { user, logout } = useAuth();
  const { data, loading, loadAll } = useAdminData();
  const [activeTab, setActiveTab] = useState('Scoring');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadAll();
    const adminActive = sessionStorage.getItem('admin_active');
    if (!adminActive) {
      sessionStorage.setItem('admin_active', 'true');
    }
    const handleUnload = () => {
      sessionStorage.removeItem('admin_active');
      localStorage.removeItem('token');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'Scoring': return <Scoring />;
      case 'Matches': return <ManageMatches />;
      case 'Tournaments': return <ManageTournaments />;
      case 'Groups': return <ManageGroups />;
      case 'Teams': return <ManageTeams />;
      case 'Players': return <ManagePlayers />;
      case 'Venues': return <ManageVenues />;
      case 'Districts': return <ManageDistricts />;
    }
  };

  const handleTabClick = (key) => {
    setActiveTab(key);
    setSidebarOpen(false);
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: '#03001e' }}>
      {/* Top Navbar */}
      <header className="px-4 py-3 flex items-center justify-between shrink-0 z-40 border-b" style={{ background: '#27253f', borderColor: '#686678' }}>
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-white/70 hover:text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div className="flex flex-col items-start">
            <img src="/exterro.svg" alt="Exterro" className="h-6" />
            <span className="text-xs font-bold" style={{ color: '#ec38bc' }}>EPL Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
            {user.username?.charAt(0).toUpperCase()}
          </span>
          <span className="text-sm hidden sm:inline" style={{ color: '#b4b2be' }}>{user.username}</span>
          <button onClick={logout} className="px-3 py-1 rounded text-xs font-medium transition-colors hover:opacity-90" style={{ background: '#ff6022', color: 'white', borderRadius: '10px' }}>Logout</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Left Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 top-[56px] z-30 w-64 flex flex-col shrink-0 transform transition-transform duration-200 border-r ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`} style={{ background: '#27253f', borderColor: '#686678' }}>
          <nav className="flex-1 py-3 overflow-y-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className="w-full text-left px-4 py-3 text-sm font-medium transition-all"
                style={{
                  color: activeTab === tab.key ? 'white' : '#b4b2be',
                  background: activeTab === tab.key ? 'linear-gradient(90deg, rgba(115,3,192,0.3), transparent)' : 'transparent',
                  borderRight: activeTab === tab.key ? '3px solid #ec38bc' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (activeTab !== tab.key) e.target.style.background = 'rgba(104,102,120,0.2)'; }}
                onMouseLeave={e => { if (activeTab !== tab.key) e.target.style.background = 'transparent'; }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Right Content Pane */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ background: '#03001e' }}>
          <h1 className="text-2xl font-bold mb-4 text-white">{tabs.find(t => t.key === activeTab)?.label}</h1>
          {loading ? <Loader dark /> : renderTab()}
        </main>
      </div>
    </div>
  );
}
