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

export default function ManageSettings() {
  const [activeSection, setActiveSection] = useState('districts');
  const active = sections.find(s => s.key === activeSection);

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-5 h-auto lg:h-[calc(100vh-180px)] pb-20 lg:pb-0">
      {/* Mobile - Horizontal scroll tabs */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)} className="shrink-0 px-3 py-2.5 text-xs font-medium rounded-xl flex items-center gap-2 transition-all active:scale-95"
            style={{ color: activeSection === s.key ? 'white' : '#888', background: activeSection === s.key ? `${s.color}22` : 'rgba(255,255,255,0.02)', border: `1px solid ${activeSection === s.key ? `${s.color}55` : 'rgba(255,255,255,0.06)'}` }}>
            <span className="text-sm">{s.icon}</span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop - Left Pane */}
      <div className="hidden lg:block w-52 shrink-0 py-4 px-2 overflow-y-auto" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '16px' }}>
        <p className="text-xs font-bold uppercase tracking-wider px-3 mb-3" style={{ color: '#555' }}>Settings</p>
        <div className="space-y-1">
          {sections.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)} className="w-full text-left px-3 py-2.5 text-sm font-medium transition-all duration-200 rounded-xl flex items-center gap-3"
              style={{ color: activeSection === s.key ? 'white' : '#777', background: activeSection === s.key ? `${s.color}15` : 'transparent', border: `1px solid ${activeSection === s.key ? `${s.color}33` : 'transparent'}` }}>
              <span className="text-base">{s.icon}</span>
              <span>{s.label}</span>
              {activeSection === s.key && <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: s.color }} />}
            </button>
          ))}
        </div>
      </div>

      {/* Right Pane */}
      <div className="flex-1 overflow-y-auto">
        <div className="mb-5 p-4 rounded-xl relative overflow-hidden" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at top right, ${active.color}, transparent 60%)` }} />
          <div className="relative flex items-center gap-3">
            <span className="text-2xl w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${active.color}15`, border: `1px solid ${active.color}33` }}>{active.icon}</span>
            <div>
              <h2 className="text-lg font-bold text-white">{active.label}</h2>
              <p className="text-xs" style={{ color: '#555' }}>Manage {active.label.toLowerCase()}</p>
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

// ─── DISTRICTS ───
function DistrictsSection() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const districts = data?.districts || [];

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/districts/${editId}`, { district_name: name });
      else await api.post('/districts', { district_name: name });
      setName(''); setEditId(null); refresh('districts');
    } catch (err) { setError(err.response?.data?.message || 'Already exists'); }
  };
  const handleDelete = async (id) => { await api.delete(`/districts/${id}`); refresh('districts'); };

  return (
    <div className="space-y-4">
      <GlowCard>
        <form onSubmit={handleSubmit} className="space-y-3">
          <GlowInput value={name} onChange={setName} placeholder="Enter district name" icon="📍" />
          {error && <ErrorBadge message={error} />}
          <ActionButton editing={editId} onCancel={() => { setEditId(null); setName(''); }} />
        </form>
      </GlowCard>
      <CardGrid items={districts} labelKey="district_name" color="#3b82f6" onEdit={d => { setName(d.district_name); setEditId(d.id); }} onDelete={handleDelete} />
    </div>
  );
}

// ─── TOURNAMENTS ───
function TournamentsSection() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ name: '', district_id: '', status: 'upcoming' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const tournaments = data?.tournaments || [];
  const districts = data?.districts || [];

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/tournaments/${editId}`, form);
      else await api.post('/tournaments', form);
      setForm({ name: '', district_id: '', status: 'upcoming' }); setEditId(null); refresh('tournaments');
    } catch (err) { setError(err.response?.data?.message || 'Already exists'); }
  };
  const handleDelete = async (id) => { await api.delete(`/tournaments/${id}`); refresh('tournaments'); };

  return (
    <div className="space-y-4">
      <GlowCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlowInput value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Tournament name" icon="🏆" />
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: '#888' }}>District <span className="text-red-400">*</span></label>
            <PillPicker items={districts} labelKey="district_name" value={form.district_id} onChange={v => setForm({ ...form, district_id: v })} color="#3b82f6" />
          </div>
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: '#888' }}>Status</label>
            <div className="flex gap-2">
              {['upcoming', 'ongoing', 'completed'].map(s => (
                <button key={s} type="button" onClick={() => setForm({ ...form, status: s })} className="flex-1 py-2.5 text-xs font-medium rounded-xl capitalize transition-all active:scale-95"
                  style={{ background: form.status === s ? (s === 'upcoming' ? 'rgba(115,3,192,0.15)' : s === 'ongoing' ? 'rgba(236,56,188,0.15)' : 'rgba(34,197,94,0.15)') : 'rgba(255,255,255,0.02)', border: `1px solid ${form.status === s ? (s === 'upcoming' ? 'rgba(115,3,192,0.4)' : s === 'ongoing' ? 'rgba(236,56,188,0.4)' : 'rgba(34,197,94,0.4)') : 'rgba(255,255,255,0.06)'}`, color: form.status === s ? 'white' : '#666' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {error && <ErrorBadge message={error} />}
          <ActionButton editing={editId} onCancel={() => { setEditId(null); setForm({ name: '', district_id: '', status: 'upcoming' }); }} />
        </form>
      </GlowCard>
      <CardGrid items={tournaments} labelKey="name" subKey={t => `${t.district?.district_name || 'All'} • ${t.status}`} color="#f59e0b" onEdit={t => { setForm({ name: t.name, district_id: t.district_id || '', status: t.status }); setEditId(t.id); }} onDelete={handleDelete} />
    </div>
  );
}

// ─── ASSIGN TEAMS ───
function AssignTeamsSection() {
  const { data, refresh } = useAdminData();
  const [selectedTournament, setSelectedTournament] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [error, setError] = useState('');

  const [filterGroup, setFilterGroup] = useState('all');

  const tournaments = data?.tournaments || [];
  const teams = data?.teams || [];
  const tournament = tournaments.find(t => t.id == selectedTournament);
  const tournamentTeams = tournament?.teams || [];
  const tournamentGroups = tournament?.groups || [];
  const availableTeams = teams.filter(t => !tournamentTeams.find(tt => tt.id === t.id));
  const groupTeamCount = selectedGroup ? tournamentTeams.filter(t => t.pivot?.group_id == selectedGroup).length : 0;
  const displayedTeams = filterGroup === 'all' ? tournamentTeams : tournamentTeams.filter(t => t.pivot?.group_id == filterGroup);

  const addTeam = async () => {
    if (!selectedTeam || !selectedTournament) return;
    setError('');
    try {
      await api.post(`/tournaments/${selectedTournament}/teams`, { team_id: selectedTeam, group_id: selectedGroup || null });
      setSelectedTeam(''); refresh('tournaments');
    } catch (err) { setError(err.response?.data?.message || 'Error'); }
  };
  const removeTeam = async (teamId) => { await api.delete(`/tournaments/${selectedTournament}/teams/${teamId}`); refresh('tournaments'); };

  return (
    <div className="space-y-4">
      <GlowCard>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: '#888' }}>Select Tournament</label>
            <PillPicker items={tournaments} labelKey="name" subKey={t => t.district?.district_name} value={selectedTournament} onChange={v => { setSelectedTournament(v); setSelectedGroup(''); }} color="#f59e0b" />
          </div>
          {selectedTournament && (
            <>
              <div>
                <label className="text-xs font-medium block mb-2" style={{ color: '#888' }}>Assign to Group <span className="text-red-400">*</span></label>
                <PillPicker items={tournamentGroups} labelKey="group_name" value={selectedGroup} onChange={setSelectedGroup} color="#7303c0" />
                {selectedGroup && <p className="text-xs mt-2" style={{ color: groupTeamCount >= 5 ? '#ef4444' : '#555' }}>⚡ {groupTeamCount}/5 teams in this group</p>}
              </div>
              <div>
                <label className="text-xs font-medium block mb-2" style={{ color: '#888' }}>Pick Team</label>
                <PillPicker items={availableTeams} labelKey="team_name" value={selectedTeam} onChange={setSelectedTeam} color="#ec38bc" />
                {availableTeams.length === 0 && <p className="text-xs mt-1" style={{ color: '#555' }}>All teams assigned ✓</p>}
              </div>
              {error && <ErrorBadge message={error} />}
              <button type="button" onClick={addTeam} disabled={!selectedTeam || !selectedGroup || (selectedGroup && groupTeamCount >= 5)} className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-all active:scale-[0.98] disabled:opacity-30" style={{ background: 'linear-gradient(135deg, #ec38bc, #7303c0)' }}>
                + Assign Team
              </button>
            </>
          )}
        </div>
      </GlowCard>

      {selectedTournament && tournamentTeams.length > 0 && (
        <div className="p-4 rounded-xl" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-white">Assigned Teams</h3>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(236,56,188,0.15)', color: '#ec38bc' }}>{tournamentTeams.length}</span>
          </div>
          {/* Group filter tabs */}
          <div className="flex gap-2 overflow-x-auto mb-4 pb-1" style={{ scrollbarWidth: 'none' }}>
            <button type="button" onClick={() => setFilterGroup('all')} className="shrink-0 px-3 py-2 text-xs font-medium rounded-xl transition-all active:scale-95"
              style={{ background: filterGroup === 'all' ? 'rgba(236,56,188,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${filterGroup === 'all' ? 'rgba(236,56,188,0.4)' : 'rgba(255,255,255,0.06)'}`, color: filterGroup === 'all' ? 'white' : '#666' }}>
              All ({tournamentTeams.length})
            </button>
            {tournamentGroups.map(g => {
              const count = tournamentTeams.filter(t => t.pivot?.group_id == g.id).length;
              return (
                <button key={g.id} type="button" onClick={() => setFilterGroup(g.id)} className="shrink-0 px-3 py-2 text-xs font-medium rounded-xl transition-all active:scale-95"
                  style={{ background: filterGroup === g.id ? 'rgba(115,3,192,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${filterGroup === g.id ? 'rgba(115,3,192,0.4)' : 'rgba(255,255,255,0.06)'}`, color: filterGroup === g.id ? 'white' : '#666' }}>
                  {g.group_name} ({count}/5)
                </button>
              );
            })}
          </div>
          {/* Filtered team list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {displayedTeams.length === 0 && <p className="text-center py-6 col-span-2 text-xs" style={{ color: '#555' }}>No teams in this group</p>}
            {displayedTeams.map(t => (
              <div key={t.id} className="flex items-center justify-between p-3 rounded-xl transition-all group" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)', color: 'white' }}>{t.team_name?.charAt(0)}</span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{t.team_name}</p>
                    <p className="text-xs truncate" style={{ color: '#555' }}>{tournamentGroups.find(g => g.id == t.pivot?.group_id)?.group_name || ''}</p>
                  </div>
                </div>
                <button onClick={() => removeTeam(t.id)} className="p-1.5 rounded-lg opacity-50 group-hover:opacity-100 transition-all hover:bg-red-500/10">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="#ff6b6b" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GROUPS ───
function GroupsSection() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ group_name: '', tournament_id: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const groups = data?.groups || [];
  const tournaments = data?.tournaments || [];

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/groups/${editId}`, form);
      else await api.post('/groups', form);
      setForm({ group_name: '', tournament_id: '' }); setEditId(null); refresh('groups');
    } catch (err) { setError(err.response?.data?.message || 'Already exists in this tournament'); }
  };
  const handleDelete = async (id) => { await api.delete(`/groups/${id}`); refresh('groups'); };

  return (
    <div className="space-y-4">
      <GlowCard>
        <form onSubmit={handleSubmit} className="space-y-4">
          <GlowInput value={form.group_name} onChange={v => setForm({ ...form, group_name: v })} placeholder="Group name (e.g. Group A)" icon="📋" />
          <div>
            <label className="text-xs font-medium block mb-2" style={{ color: '#888' }}>Tournament</label>
            <PillPicker items={tournaments} labelKey="name" value={form.tournament_id} onChange={v => setForm({ ...form, tournament_id: v })} color="#f59e0b" />
          </div>
          {error && <ErrorBadge message={error} />}
          <ActionButton editing={editId} onCancel={() => { setEditId(null); setForm({ group_name: '', tournament_id: '' }); }} />
        </form>
      </GlowCard>
      <CardGrid items={groups} labelKey="group_name" subKey={g => g.tournament?.name} color="#7303c0" onEdit={g => { setForm({ group_name: g.group_name, tournament_id: g.tournament_id }); setEditId(g.id); }} onDelete={handleDelete} />
    </div>
  );
}

// ─── VENUES ───
function VenuesSection() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ venue_name: '', location: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const venues = data?.venues || [];

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/venues/${editId}`, form);
      else await api.post('/venues', form);
      setForm({ venue_name: '', location: '' }); setEditId(null); refresh('venues');
    } catch (err) { setError(err.response?.data?.message || 'Already exists'); }
  };
  const handleDelete = async (id) => { await api.delete(`/venues/${id}`); refresh('venues'); };

  return (
    <div className="space-y-4">
      <GlowCard>
        <form onSubmit={handleSubmit} className="space-y-3">
          <GlowInput value={form.venue_name} onChange={v => setForm({ ...form, venue_name: v })} placeholder="Venue name" icon="🏟️" />
          <GlowInput value={form.location} onChange={v => setForm({ ...form, location: v })} placeholder="Location (optional)" icon="📌" />
          {error && <ErrorBadge message={error} />}
          <ActionButton editing={editId} onCancel={() => { setEditId(null); setForm({ venue_name: '', location: '' }); }} />
        </form>
      </GlowCard>
      <CardGrid items={venues} labelKey="venue_name" subKey={v => v.location || 'No location'} color="#ff6022" onEdit={v => { setForm({ venue_name: v.venue_name, location: v.location || '' }); setEditId(v.id); }} onDelete={handleDelete} />
    </div>
  );
}

// ─── OVERS ───
function OversSection() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const overs = data?.overs || [];

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/overs/${editId}`, { name });
      else await api.post('/overs', { name });
      setName(''); setEditId(null); refresh('overs');
    } catch (err) { setError(err.response?.data?.message || 'Already exists'); }
  };
  const handleDelete = async (id) => { await api.delete(`/overs/${id}`); refresh('overs'); };

  return (
    <div className="space-y-4">
      <GlowCard>
        <form onSubmit={handleSubmit} className="space-y-3">
          <GlowInput value={name} onChange={setName} placeholder="e.g. 20, 10, 5" icon="🎯" />
          {error && <ErrorBadge message={error} />}
          <ActionButton editing={editId} onCancel={() => { setEditId(null); setName(''); }} />
        </form>
      </GlowCard>
      <CardGrid items={overs} labelKey="name" color="#22c55e" onEdit={o => { setName(o.name); setEditId(o.id); }} onDelete={handleDelete} />
    </div>
  );
}

// ─── MATCH LEVEL ───
function MatchLevelSection() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const matchLevels = data?.matchLevels || [];

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    try {
      if (editId) await api.put(`/match-levels/${editId}`, { name });
      else await api.post('/match-levels', { name });
      setName(''); setEditId(null); refresh('matchLevels');
    } catch (err) { setError(err.response?.data?.message || 'Already exists'); }
  };
  const handleDelete = async (id) => { await api.delete(`/match-levels/${id}`); refresh('matchLevels'); };

  return (
    <div className="space-y-4">
      <GlowCard>
        <form onSubmit={handleSubmit} className="space-y-3">
          <GlowInput value={name} onChange={setName} placeholder="e.g. League, Quarter Final, Semi Final" icon="🏅" />
          {error && <ErrorBadge message={error} />}
          <ActionButton editing={editId} onCancel={() => { setEditId(null); setName(''); }} />
        </form>
      </GlowCard>
      <CardGrid items={matchLevels} labelKey="name" color="#16a34a" onEdit={m => { setName(m.name); setEditId(m.id); }} onDelete={handleDelete} />
    </div>
  );
}

// ═══════════════════════════════════════
// GLAMOROUS REUSABLE COMPONENTS
// ═══════════════════════════════════════

function GlowCard({ children }) {
  return (
    <div className="p-5 rounded-2xl relative overflow-hidden" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="absolute -top-12 -right-12 w-32 h-32 opacity-[0.03] pointer-events-none" style={{ background: 'radial-gradient(circle, #ec38bc, transparent)' }} />
      <div className="relative">{children}</div>
    </div>
  );
}

function GlowInput({ value, onChange, placeholder, icon }) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-base transition-transform" style={{ transform: focused ? 'translateY(-50%) scale(1.1)' : 'translateY(-50%) scale(1)' }}>{icon}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full pl-12 pr-4 py-3.5 text-white text-sm placeholder-gray-600 focus:outline-none rounded-xl transition-all duration-300"
        style={{ background: focused ? 'rgba(115,3,192,0.05)' : 'rgba(255,255,255,0.02)', border: `1.5px solid ${focused ? 'rgba(115,3,192,0.4)' : 'rgba(255,255,255,0.08)'}`, boxShadow: focused ? '0 0 20px rgba(115,3,192,0.1)' : 'none' }} />
    </div>
  );
}

function PillPicker({ items, labelKey, subKey, value, onChange, color, allowNone, noneLabel }) {
  return (
    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
      {allowNone && (
        <button type="button" onClick={() => onChange('')} className="px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
          style={{ background: !value ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)', border: `1px solid ${!value ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`, color: !value ? 'white' : '#666' }}>
          {noneLabel}
        </button>
      )}
      {items.map(item => (
        <button key={item.id} type="button" onClick={() => onChange(item.id)}
          className="px-3.5 py-2 rounded-xl text-xs font-medium transition-all active:scale-95"
          style={{ background: value == item.id ? `${color}20` : 'rgba(255,255,255,0.02)', border: `1px solid ${value == item.id ? `${color}55` : 'rgba(255,255,255,0.06)'}`, color: value == item.id ? 'white' : '#777', boxShadow: value == item.id ? `0 0 12px ${color}15` : 'none' }}>
          <span>{item[labelKey]}</span>
          {subKey && <span className="block text-[10px] mt-0.5" style={{ color: value == item.id ? `${color}` : '#555' }}>{typeof subKey === 'function' ? subKey(item) : item[subKey]}</span>}
        </button>
      ))}
    </div>
  );
}

function ActionButton({ editing, onCancel }) {
  return (
    <div className="flex gap-2 pt-2">
      <button type="submit" className="flex-1 sm:flex-none px-7 py-3 text-white text-sm font-semibold rounded-xl transition-all active:scale-95 relative overflow-hidden group"
        style={{ background: editing ? 'linear-gradient(135deg, #7303c0, #5b02a0)' : 'linear-gradient(135deg, #ec38bc, #7303c0)', boxShadow: `0 4px 20px ${editing ? 'rgba(115,3,192,0.3)' : 'rgba(236,56,188,0.25)'}` }}>
        <span className="relative z-10">{editing ? '✓ Update' : '+ Add'}</span>
        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </button>
      {editing && <button type="button" onClick={onCancel} className="px-5 py-3 text-sm font-medium rounded-xl transition-all active:scale-95" style={{ color: '#888', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>}
    </div>
  );
}

function ErrorBadge({ message }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl animate-pulse" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
      <span className="text-sm">⚠️</span>
      <span className="text-xs font-medium" style={{ color: '#f87171' }}>{message}</span>
    </div>
  );
}

function CardGrid({ items, labelKey, subKey, color, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const filtered = items.filter(i => (i[labelKey] || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-4 rounded-2xl" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded-lg font-semibold" style={{ background: `${color}15`, color, border: `1px solid ${color}33` }}>{filtered.length}</span>
          <span className="text-sm font-medium text-white/70">items</span>
        </div>
        <div className="relative">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 text-xs text-white placeholder-gray-600 focus:outline-none w-32 sm:w-40 rounded-lg transition-all focus:w-44" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} />
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5" fill="none" stroke="#555" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto">
        {filtered.length === 0 && <p className="text-center py-8 col-span-2 text-sm" style={{ color: '#444' }}>No items found</p>}
        {filtered.map(item => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl transition-all group hover:scale-[1.01]" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = `${color}33`}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'}>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: `${color}15`, color }}>{(item[labelKey] || '?').charAt(0).toUpperCase()}</span>
              <div className="min-w-0">
                <p className="text-white text-sm font-medium truncate">{item[labelKey]}</p>
                {subKey && <p className="text-xs truncate" style={{ color: '#555' }}>{typeof subKey === 'function' ? subKey(item) : ''}</p>}
              </div>
            </div>
            <div className="flex gap-1 shrink-0 ml-2 opacity-40 group-hover:opacity-100 transition-opacity">
              <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-white/5 transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="#a78bfa" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button onClick={() => onDelete(item.id)} className="p-1.5 rounded-lg hover:bg-white/5 transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="#ff6b6b" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
