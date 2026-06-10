import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AdminDataProvider, useAdminData } from '../../context/AdminDataContext';
import { Navigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import ManageTeams from './ManageTeams';
import ManagePlayers from './ManagePlayers';
import ManageMatches from './ManageMatches';
import ManageSettings from './ManageSettings';
import Scoring from './Scoring';

const tabs = [
  { key: 'Dashboard', label: 'Dashboard', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
  )},
  { key: 'Scoring', label: 'Live Scoring', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
  )},
  { key: 'Matches', label: 'Matches', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
  )},
  { key: 'Teams', label: 'Teams', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  )},
  { key: 'Players', label: 'Players', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
  )},
  { key: 'Settings', label: 'Match Settings', icon: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
  )},
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
  const { data, loading, actionLoading, loadAll } = useAdminData();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    loadAll();
    const adminActive = sessionStorage.getItem('admin_active');
    if (!adminActive) sessionStorage.setItem('admin_active', 'true');
    const handleUnload = () => { sessionStorage.removeItem('admin_active'); localStorage.removeItem('token'); };
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'Dashboard': return <DashboardHome data={data} onNavigate={setActiveTab} />;
      case 'Scoring': return <Scoring />;
      case 'Matches': return <ManageMatches />;
      case 'Teams': return <ManageTeams />;
      case 'Players': return <ManagePlayers />;
      case 'Settings': return <ManageSettings />;
    }
  };

  const handleTabClick = (key) => { setActiveTab(key); setSidebarOpen(false); };

  return (
    <div className="flex flex-col h-screen" style={{ background: '#0a0a1a' }}>
      {/* Top Navbar */}
      <header className="px-4 py-3 flex items-center justify-between shrink-0 z-40" style={{ background: '#111128', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <button className="lg:hidden text-white/60 hover:text-white p-1" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
              <span className="text-white text-sm font-bold">E</span>
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-white leading-tight">EPL Admin</p>
              <p className="text-xs" style={{ color: '#666' }}>Cricket Management</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse bg-green-400"></span>
            <span className="text-xs" style={{ color: '#888' }}>System Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
              {user.username?.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm hidden sm:inline text-white/70">{user.username}</span>
          </div>
          <button onClick={logout} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all hover:bg-white/10" style={{ color: '#ff6b6b', border: '1px solid rgba(255,107,107,0.2)' }}>Logout</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}

        {/* Sidebar */}
        <aside className={`fixed lg:static inset-y-0 left-0 top-[57px] z-30 w-64 lg:w-56 flex flex-col shrink-0 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`} style={{ background: '#111128', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
          <nav className="flex-1 py-4 px-3 space-y-1">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => handleTabClick(tab.key)}
                className="w-full text-left px-3 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl flex items-center gap-3"
                style={{
                  color: activeTab === tab.key ? 'white' : '#777',
                  background: activeTab === tab.key ? 'rgba(115,3,192,0.15)' : 'transparent',
                  border: activeTab === tab.key ? '1px solid rgba(115,3,192,0.3)' : '1px solid transparent',
                }}>
                <span style={{ color: activeTab === tab.key ? '#ec38bc' : '#555' }}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Bottom section */}
          <div className="p-4 mx-3 mb-3 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(115,3,192,0.1), rgba(236,56,188,0.05))', border: '1px solid rgba(115,3,192,0.15)' }}>
            <p className="text-xs font-medium text-white/80">Quick Tip</p>
            <p className="text-xs mt-1" style={{ color: '#666' }}>Use Live Scoring to update match scores in real-time</p>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ background: '#0a0a1a' }}>
          {loading ? <Loader dark /> : renderTab()}
        </main>
      </div>

      {/* Action Loading Overlay */}
      {actionLoading && <Loader mini />}

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around py-2 px-2" style={{ background: '#111128', borderTop: '1px solid rgba(255,255,255,0.06)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
        {tabs.slice(0, 5).map(tab => (
          <button key={tab.key} onClick={() => handleTabClick(tab.key)} className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-all"
            style={{ color: activeTab === tab.key ? '#ec38bc' : '#555' }}>
            <span className="w-5 h-5">{tab.icon}</span>
            <span className="text-[10px]">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DashboardHome({ data, onNavigate }) {
  const matches = data?.matches || [];
  const teams = data?.teams || [];
  const players = data?.players || [];
  const tournaments = data?.tournaments || [];

  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'upcoming');

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Welcome */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm mt-1" style={{ color: '#666' }}>Manage your cricket tournament from here</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard icon="🏏" value={matches.length} label="Matches" color="#7303c0" />
        <StatCard icon="👥" value={teams.length} label="Teams" color="#ec38bc" />
        <StatCard icon="🧑" value={players.length} label="Players" color="#ff6022" />
        <StatCard icon="🏆" value={tournaments.length} label="Tournaments" color="#f59e0b" />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold text-white/80 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickAction icon="⚡" label="Start Scoring" desc="Score a live match" onClick={() => onNavigate('Scoring')} color="#ec38bc" />
          <QuickAction icon="📅" label="New Match" desc="Schedule a match" onClick={() => onNavigate('Matches')} color="#7303c0" />
          <QuickAction icon="👥" label="Add Team" desc="Register a team" onClick={() => onNavigate('Teams')} color="#ff6022" />
          <QuickAction icon="🧑" label="Add Player" desc="Register a player" onClick={() => onNavigate('Players')} color="#22c55e" />
        </div>
      </div>

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Now
          </h2>
          <div className="space-y-2">
            {liveMatches.map(m => (
              <div key={m.id} className="p-4 rounded-xl transition-all" style={{ background: 'rgba(236,56,188,0.05)', border: '1px solid rgba(236,56,188,0.2)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{m.team_a?.team_name} vs {m.team_b?.team_name}</p>
                    <p className="text-xs mt-1" style={{ color: '#666' }}>{m.tournament?.name} • {m.overs} overs</p>
                  </div>
                  <button onClick={() => onNavigate('Scoring')} className="px-3 py-1.5 text-xs font-medium rounded-lg" style={{ background: 'rgba(236,56,188,0.15)', color: '#ec38bc', border: '1px solid rgba(236,56,188,0.3)' }}>
                    Score →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Matches */}
      {upcomingMatches.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white/80 mb-3">Upcoming Matches</h2>
          <div className="space-y-2">
            {upcomingMatches.slice(0, 5).map(m => (
              <div key={m.id} className="p-4 rounded-xl flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm" style={{ background: 'rgba(115,3,192,0.1)', border: '1px solid rgba(115,3,192,0.2)' }}>VS</div>
                  <div>
                    <p className="text-white text-sm font-medium">{m.team_a?.team_name} vs {m.team_b?.team_name}</p>
                    <p className="text-xs" style={{ color: '#555' }}>{m.match_date || 'TBD'} • {m.venue_info?.venue_name || m.venue || 'TBD'}</p>
                  </div>
                </div>
                <span className="text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(115,3,192,0.1)', color: '#b4b2be' }}>{m.overs}ov</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div className="p-4 rounded-xl relative overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="absolute top-0 right-0 w-16 h-16 opacity-5" style={{ background: `radial-gradient(circle, ${color}, transparent)` }} />
      <span className="text-lg">{icon}</span>
      <p className="text-2xl font-bold text-white mt-2">{value}</p>
      <p className="text-xs mt-0.5" style={{ color: '#666' }}>{label}</p>
    </div>
  );
}

function QuickAction({ icon, label, desc, onClick, color }) {
  return (
    <button onClick={onClick} className="p-4 rounded-xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] group" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = `${color}44`}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
      <span className="text-2xl">{icon}</span>
      <p className="text-sm font-medium text-white mt-2">{label}</p>
      <p className="text-xs mt-0.5" style={{ color: '#555' }}>{desc}</p>
    </button>
  );
}
