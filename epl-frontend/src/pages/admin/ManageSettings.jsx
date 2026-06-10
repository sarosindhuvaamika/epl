import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';

const sections = [
  { key: 'districts', label: 'Districts', icon: '📍', color: '#3b82f6' },
  { key: 'tournaments', label: 'Tournaments', icon: '🏆', color: '#f59e0b' },
  { key: 'assignTeams', label: 'Assign Teams', icon: '👥', color: '#ec38bc' },
  { key: 'groups', label: 'Groups', icon: '📋', color: '#7303c0' },
  { key: 'venues', label: 'Venues', icon: '🏟️', color: '#ff6022' },
  { key: 'overs', label: 'Overs', icon: '🎯', color: '#22c55e' },
  { key: 'matchLevel', label: 'Match Level', icon: '🏅', color: '#16a34a' },
];

const inputStyle = { background: 'rgba(3,0,30,0.6)', border: '1.5px solid rgba(104,102,120,0.4)', borderRadius: '12px', backdropFilter: 'blur(10px)' };

export default function ManageSettings() {
  const [activeSection, setActiveSection] = useState('districts');
  const active = sections.find(s => s.key === activeSection);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 h-auto lg:h-[calc(100vh-180px)]">
      {/* Mobile - Horizontal scroll tabs */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)} className="shrink-0 px-3 py-2.5 text-xs font-medium rounded-xl flex items-center gap-2 transition-all"
            style={{
              color: activeSection === s.key ? 'white' : '#b4b2be',
              background: activeSection === s.key ? `linear-gradient(135deg, ${s.color}55, ${s.color}22)` : 'rgba(39,37,63,0.8)',
              border: activeSection === s.key ? `1px solid ${s.color}66` : '1px solid rgba(104,102,120,0.3)',
            }}>
            <span className="text-sm">{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop - Left Pane sidebar */}
      <div className="hidden lg:block w-52 shrink-0 py-4 px-2 overflow-y-auto relative" style={{ background: 'linear-gradient(180deg, rgba(39,37,63,0.95), rgba(3,0,30,0.95))', border: '1.5px solid rgba(104,102,120,0.3)', borderRadius: '16px', backdropFilter: 'blur(20px)' }}>
        <div className="absolute top-0 left-0 w-full h-24 opacity-30 pointer-events-none" style={{ background: 'radial-gradient(ellipse at top, rgba(115,3,192,0.4), transparent)', borderRadius: '16px 16px 0 0' }} />
        <p className="text-xs font-bold uppercase tracking-wider px-3 mb-3 relative" style={{ color: '#686678' }}>Settings</p>
        <div className="space-y-1 relative">
          {sections.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)} className="w-full text-left px-3 py-3 text-sm font-medium transition-all duration-200 rounded-xl flex items-center gap-3"
              style={{
                color: activeSection === s.key ? 'white' : '#b4b2be',
                background: activeSection === s.key ? `linear-gradient(135deg, ${s.color}33, ${s.color}11)` : 'transparent',
                border: activeSection === s.key ? `1px solid ${s.color}44` : '1px solid transparent',
                transform: activeSection === s.key ? 'scale(1.02)' : 'scale(1)',
              }}>
              <span className="text-base w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: activeSection === s.key ? `${s.color}22` : 'rgba(104,102,120,0.15)' }}>{s.icon}</span>
              <span>{s.label}</span>
              {activeSection === s.key && <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Right Pane - Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Section Header */}
        <div className="mb-4 p-4 lg:p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(39,37,63,0.9), rgba(3,0,30,0.8))', border: '1.5px solid rgba(104,102,120,0.3)', borderRadius: '14px', backdropFilter: 'blur(20px)' }}>
          <div className="absolute inset-0 opacity-10" style={{ background: `radial-gradient(circle at top right, ${active.color}, transparent 70%)` }} />
          <div className="relative flex items-center gap-3">
            <span className="text-xl lg:text-2xl w-10 h-10 lg:w-11 lg:h-11 rounded-xl flex items-center justify-center" style={{ background: `${active.color}22`, border: `1px solid ${active.color}33` }}>{active.icon}</span>
            <div>
              <h2 className="text-base lg:text-lg font-bold text-white">{active.label}</h2>
              <p className="text-xs" style={{ color: '#686678' }}>Manage {active.label.toLowerCase()} for your matches</p>
            </div>
          </div>
        </div>

        {activeSection === 'districts' && <DistrictsSection />}
        {activeSection === 'tournaments' && <TournamentsSection />}
        {activeSection === 'assignTeams' && <AssignTeamsSection />}
        {activeSection === 'groups' && <GroupsSection />}
        {activeSection === 'venues' && <VenuesSection />}
        {activeSection === 'overs' && <OversSection />}
        {activeSection === 'matchLevel' && <MatchLevelSection />}
      </div>
    </div>
  );
}

function AssignTeamsSection() {
  const { data, refresh } = useAdminData();
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [error, setError] = useState('');

  const tournaments = data?.tournaments || [];
  const teams = data?.teams || [];
  const tournament = tournaments.find(t => t.id == selectedTournament);
  const tournamentTeams = tournament?.teams || [];
  const tournamentGroups = tournament?.groups || [];
  const availableTeams = teams.filter(t => !tournamentTeams.find(tt => tt.id === t.id));
  const groupTeamCount = selectedGroup ? tournamentTeams.filter(t => t.pivot?.group_id == selectedGroup).length : 0;

  const addTeam = async () => {
    if (!selectedTeam || !selectedTournament) return;
    setError('');
    try {
      await api.post(`/tournaments/${selectedTournament}/teams`, { team_id: selectedTeam, group_id: selectedGroup || null });
      setSelectedTeam(''); refresh('tournaments');
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding team');
    }
  };

  const removeTeam = async (teamId) => {
    await api.delete(`/tournaments/${selectedTournament}/teams/${teamId}`);
    refresh('tournaments');
  };

  return (
    <div className="space-y-4">
      <FormCard title="Assign Teams to Tournament" editId={null}>
        <div className="space-y-3">
          <select value={selectedTournament} onChange={e => { setSelectedTournament(e.target.value); setSelectedGroup(''); }} className="w-full px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle}>
            <option value="">Select Tournament</option>
            {tournaments.map(t => <option key={t.id} value={t.id}>{t.name} ({t.district?.district_name || 'All'})</option>)}
          </select>
          {selectedTournament && (
            <>
              <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} className="w-full px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle}>
                <option value="">Assign to Group (optional)</option>
                {tournamentGroups.map(g => <option key={g.id} value={g.id}>{g.group_name}</option>)}
              </select>
              <div className="flex gap-2">
                <select value={selectedTeam} onChange={e => setSelectedTeam(e.target.value)} className="flex-1 px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle}>
                  <option value="">Select Team to Add</option>
                  {availableTeams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
                </select>
                <button type="button" onClick={addTeam} disabled={selectedGroup && groupTeamCount >= 5} className="px-5 py-3 text-white text-sm font-medium rounded-xl transition-all active:scale-95 disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #ec38bc, #7303c0)' }}>Add</button>
              </div>
              {selectedGroup && <p className="text-xs" style={{ color: groupTeamCount >= 5 ? '#ef4444' : '#686678' }}>{groupTeamCount}/5 teams in this group</p>}
              {error && <p className="text-xs px-3 py-2 rounded-lg" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>{error}</p>}
            </>
          )}
        </div>
      </FormCard>

      {selectedTournament && (
        <div className="p-4 lg:p-5" style={{ background: 'linear-gradient(135deg, rgba(39,37,63,0.95), rgba(27,25,45,0.95))', border: '1.5px solid rgba(104,102,120,0.3)', borderRadius: '14px' }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-white">Teams in {tournament?.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(236,56,188,0.15)', color: '#ec38bc', border: '1px solid rgba(236,56,188,0.3)' }}>{tournamentTeams.length}</span>
          </div>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {tournamentTeams.length === 0 && <p className="text-center py-6 text-sm" style={{ color: '#686678' }}>No teams assigned yet</p>}
            {tournamentTeams.map((t, i) => (
              <div key={t.id} className="flex justify-between items-center px-3 sm:px-4 py-3" style={{ background: 'rgba(3,0,30,0.5)', border: '1.5px solid rgba(104,102,120,0.2)', borderRadius: '12px' }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(236,56,188,0.15)', color: '#ec38bc', border: '1px solid rgba(236,56,188,0.25)' }}>{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-white font-medium text-sm truncate">{t.team_name}</p>
                    <p className="text-xs truncate" style={{ color: '#686678' }}>{t.pivot?.group_id ? tournamentGroups.find(g => g.id == t.pivot.group_id)?.group_name || '' : 'No group'}</p>
                  </div>
                </div>
                <button onClick={() => removeTeam(t.id)} className="p-2 text-xs font-medium rounded-lg transition-all" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022', border: '1px solid rgba(255,96,34,0.2)' }}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function GroupsSection() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ group_name: '', tournament_id: '' });
  const [editId, setEditId] = useState(null);

  const groups = data?.groups || [];
  const tournaments = data?.tournaments || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/groups/${editId}`, form);
    else await api.post('/groups', form);
    setForm({ group_name: '', tournament_id: '' }); setEditId(null); refresh('groups');
  };
  const handleDelete = async (id) => { await api.delete(`/groups/${id}`); refresh('groups'); };

  return (
    <div className="space-y-4">
      <FormCard title={editId ? 'Edit Group' : 'Add Group'} editId={editId}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.group_name} onChange={e => setForm({ ...form, group_name: e.target.value })} placeholder="Group Name" className="w-full px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle} required />
          <select value={form.tournament_id} onChange={e => setForm({ ...form, tournament_id: e.target.value })} className="w-full px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle} required>
            <option value="">Select Tournament</option>
            {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <FormButtons editId={editId} onCancel={() => { setEditId(null); setForm({ group_name: '', tournament_id: '' }); }} />
        </form>
      </FormCard>
      <ItemList items={groups} labelKey="group_name" subKey={g => g.tournament?.name} onEdit={g => { setForm({ group_name: g.group_name, tournament_id: g.tournament_id }); setEditId(g.id); }} onDelete={handleDelete} color="#7303c0" />
    </div>
  );
}

function VenuesSection() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ venue_name: '', location: '' });
  const [editId, setEditId] = useState(null);

  const venues = data?.venues || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/venues/${editId}`, form);
    else await api.post('/venues', form);
    setForm({ venue_name: '', location: '' }); setEditId(null); refresh('venues');
  };
  const handleDelete = async (id) => { await api.delete(`/venues/${id}`); refresh('venues'); };

  return (
    <div className="space-y-4">
      <FormCard title={editId ? 'Edit Venue' : 'Add Venue'} editId={editId}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.venue_name} onChange={e => setForm({ ...form, venue_name: e.target.value })} placeholder="Venue Name" className="w-full px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle} required />
          <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location (optional)" className="w-full px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle} />
          <FormButtons editId={editId} onCancel={() => { setEditId(null); setForm({ venue_name: '', location: '' }); }} />
        </form>
      </FormCard>
      <ItemList items={venues} labelKey="venue_name" subKey={v => v.location || 'No location'} onEdit={v => { setForm({ venue_name: v.venue_name, location: v.location || '' }); setEditId(v.id); }} onDelete={handleDelete} color="#ff6022" />
    </div>
  );
}

function OversSection() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const overs = data?.overs || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/overs/${editId}`, { name });
    else await api.post('/overs', { name });
    setName(''); setEditId(null); refresh('overs');
  };
  const handleDelete = async (id) => { await api.delete(`/overs/${id}`); refresh('overs'); };

  return (
    <div className="space-y-4">
      <FormCard title={editId ? 'Edit Overs' : 'Add Overs'} editId={editId}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 20, 10, 5" className="w-full px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle} required />
          <FormButtons editId={editId} onCancel={() => { setEditId(null); setName(''); }} />
        </form>
      </FormCard>
      <ItemList items={overs} labelKey="name" onEdit={o => { setName(o.name); setEditId(o.id); }} onDelete={handleDelete} color="#ec38bc" />
    </div>
  );
}

function MatchLevelSection() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const matchLevels = data?.matchLevels || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/match-levels/${editId}`, { name });
    else await api.post('/match-levels', { name });
    setName(''); setEditId(null); refresh('matchLevels');
  };
  const handleDelete = async (id) => { await api.delete(`/match-levels/${id}`); refresh('matchLevels'); };

  return (
    <div className="space-y-4">
      <FormCard title={editId ? 'Edit Match Level' : 'Add Match Level'} editId={editId}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. League, Quarter Final, Semi Final, Final" className="w-full px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle} required />
          <FormButtons editId={editId} onCancel={() => { setEditId(null); setName(''); }} />
        </form>
      </FormCard>
      <ItemList items={matchLevels} labelKey="name" onEdit={m => { setName(m.name); setEditId(m.id); }} onDelete={handleDelete} color="#22c55e" />
    </div>
  );
}

function TournamentsSection() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ name: '', district_id: '', status: 'upcoming' });
  const [editId, setEditId] = useState(null);

  const tournaments = data?.tournaments || [];
  const districts = data?.districts || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/tournaments/${editId}`, form);
    else await api.post('/tournaments', form);
    setForm({ name: '', district_id: '', status: 'upcoming' }); setEditId(null); refresh('tournaments');
  };
  const handleDelete = async (id) => { await api.delete(`/tournaments/${id}`); refresh('tournaments'); };

  return (
    <div className="space-y-4">
      <FormCard title={editId ? 'Edit Tournament' : 'Add Tournament'} editId={editId}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tournament Name" className="w-full px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle} required />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={form.district_id} onChange={e => setForm({ ...form, district_id: e.target.value })} className="w-full px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle}>
              <option value="">All Districts</option>
              {districts.map(d => <option key={d.id} value={d.id}>{d.district_name}</option>)}
            </select>
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full px-4 py-3 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle}>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <FormButtons editId={editId} onCancel={() => { setEditId(null); setForm({ name: '', district_id: '', status: 'upcoming' }); }} />
        </form>
      </FormCard>
      <ItemList items={tournaments} labelKey="name" subKey={t => `${t.district?.district_name || 'All'} • ${t.status}`} onEdit={t => { setForm({ name: t.name, district_id: t.district_id || '', status: t.status }); setEditId(t.id); }} onDelete={handleDelete} color="#f59e0b" />
    </div>
  );
}

function DistrictsSection() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const districts = data?.districts || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/districts/${editId}`, { district_name: name });
    else await api.post('/districts', { district_name: name });
    setName(''); setEditId(null); refresh('districts');
  };
  const handleDelete = async (id) => { await api.delete(`/districts/${id}`); refresh('districts'); };

  return (
    <div className="space-y-4">
      <FormCard title={editId ? 'Edit District' : 'Add District'} editId={editId}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="District Name" className="w-full px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors" style={inputStyle} required />
          <FormButtons editId={editId} onCancel={() => { setEditId(null); setName(''); }} />
        </form>
      </FormCard>
      <ItemList items={districts} labelKey="district_name" onEdit={d => { setName(d.district_name); setEditId(d.id); }} onDelete={handleDelete} color="#3b82f6" />
    </div>
  );
}

function FormCard({ title, editId, children }) {
  return (
    <div className="p-4 lg:p-5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(39,37,63,0.95), rgba(27,25,45,0.95))', border: '1.5px solid rgba(104,102,120,0.3)', borderRadius: '14px', backdropFilter: 'blur(20px)' }}>
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle, ${editId ? '#7303c0' : '#ff6022'}, transparent)` }} />
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 relative">
        <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{ background: editId ? 'rgba(115,3,192,0.2)' : 'rgba(255,96,34,0.2)', border: `1px solid ${editId ? 'rgba(115,3,192,0.3)' : 'rgba(255,96,34,0.3)'}` }}>
          {editId ? '✏️' : '➕'}
        </span>
        <span style={{ color: '#ec38bc' }}>{title}</span>
      </h3>
      <div className="relative">{children}</div>
    </div>
  );
}

function FormButtons({ editId, onCancel }) {
  return (
    <div className="flex gap-2 pt-1">
      <button className="flex-1 sm:flex-none px-6 py-3 text-white text-sm font-medium hover:opacity-90 transition-all active:scale-95 shadow-lg" style={{ background: editId ? 'linear-gradient(135deg, #7303c0, #5b02a0)' : 'linear-gradient(135deg, #ff6022, #ec38bc)', borderRadius: '12px', boxShadow: editId ? '0 4px 15px rgba(115,3,192,0.3)' : '0 4px 15px rgba(255,96,34,0.3)' }}>
        {editId ? '✓ Update' : '+ Add'}
      </button>
      {editId && <button type="button" onClick={onCancel} className="flex-1 sm:flex-none px-5 py-3 text-sm font-medium hover:opacity-80 transition-all rounded-xl" style={{ color: '#b4b2be', background: 'rgba(104,102,120,0.2)', border: '1px solid rgba(104,102,120,0.3)' }}>Cancel</button>}
    </div>
  );
}

function ItemList({ items, labelKey, subKey, onEdit, onDelete, color }) {
  const [search, setSearch] = useState('');
  const filtered = items.filter(i => (i[labelKey] || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 lg:p-5" style={{ background: 'linear-gradient(135deg, rgba(39,37,63,0.95), rgba(27,25,45,0.95))', border: '1.5px solid rgba(104,102,120,0.3)', borderRadius: '14px', backdropFilter: 'blur(20px)' }}>
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">All</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${color}22`, color, border: `1px solid ${color}33` }}>{filtered.length}</span>
        </div>
        <div className="relative">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none w-32 sm:w-44 transition-all" style={{ background: 'rgba(3,0,30,0.6)', border: '1.5px solid rgba(104,102,120,0.3)', borderRadius: '10px' }} />
          <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5" fill="none" stroke="#686678" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>
      <div className="space-y-2 max-h-72 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <span className="text-2xl block mb-2">🔍</span>
            <p className="text-sm" style={{ color: '#686678' }}>No items found</p>
          </div>
        )}
        {filtered.map((item, i) => (
          <div key={item.id} className="flex justify-between items-center px-3 sm:px-4 py-3 transition-all duration-200" style={{ background: 'rgba(3,0,30,0.5)', border: '1.5px solid rgba(104,102,120,0.2)', borderRadius: '12px' }}>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>{i + 1}</span>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm truncate">{item[labelKey]}</p>
                {subKey && <p className="text-xs mt-0.5 truncate" style={{ color: '#686678' }}>{typeof subKey === 'function' ? subKey(item) : item[subKey]}</p>}
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0 ml-2">
              <button onClick={() => onEdit(item)} className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-lg transition-all" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc', border: '1px solid rgba(236,56,188,0.2)' }}>
                <span className="hidden sm:inline">Edit</span>
                <svg className="sm:hidden w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button onClick={() => onDelete(item.id)} className="p-2 sm:px-3 sm:py-1.5 text-xs font-medium rounded-lg transition-all" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022', border: '1px solid rgba(255,96,34,0.2)' }}>
                <span className="hidden sm:inline">Delete</span>
                <svg className="sm:hidden w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
