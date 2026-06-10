import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';
import DateInput from '../../components/DateInput';

export default function ManageMatches() {
  const { data, refresh, withLoading } = useAdminData();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ district_id: '', tournament_id: '', match_level_id: '', group_id: '', team_a_id: '', team_b_id: '', venue_id: '', venue: '', match_date: '', match_time: '', overs: '', status: 'upcoming' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  // Inline add states
  const [adding, setAdding] = useState({});
  const [newVal, setNewVal] = useState({});

  const matches = data?.matches || [];
  const tournaments = data?.tournaments || [];
  const teams = data?.teams || [];
  const groups = data?.groups || [];
  const venues = data?.venues || [];
  const oversList = data?.overs || [];
  const matchLevels = data?.matchLevels || [];
  const districts = data?.districts || [];

  const resetForm = () => {
    setForm({ district_id: '', tournament_id: '', match_level_id: '', group_id: '', team_a_id: '', team_b_id: '', venue_id: '', venue: '', match_date: '', match_time: '', overs: '', status: 'upcoming' });
    setEditId(null); setShowForm(false); setAdding({}); setNewVal({});
  };

  const handleSubmit = async () => {
    await withLoading(async () => {
      const payload = { ...form };
      if (payload.match_time && payload.match_date) {
        payload.match_date = `${payload.match_date} ${payload.match_time}`;
      }
      if (editId) await api.put(`/matches/${editId}`, payload);
      else await api.post('/matches', payload);
      resetForm(); refresh('matches');
    });
  };

  const handleEdit = (m) => {
    const [date, time] = (m.match_date || '').split(' ');
    setForm({ district_id: m.tournament?.district_id || '', tournament_id: m.tournament_id || '', match_level_id: m.match_level_id || '', group_id: m.group_id || '', team_a_id: m.team_a_id || '', team_b_id: m.team_b_id || '', venue_id: m.venue_id || '', venue: m.venue || '', match_date: date || m.match_date || '', match_time: time || '', overs: m.overs || '', status: m.status });
    setEditId(m.id); setShowForm(true);
  };

  const handleDelete = async (id) => { await withLoading(async () => { await api.delete(`/matches/${id}`); refresh('matches'); }); };

  // Inline add handlers
  const addDistrict = async () => {
    if (!newVal.district) return;
    await withLoading(async () => {
      const res = await api.post('/districts', { district_name: newVal.district });
      refresh('districts'); setForm({ ...form, district_id: res.data.id }); setNewVal({ ...newVal, district: '' }); setAdding({ ...adding, district: false });
    });
  };
  const addTournament = async () => {
    if (!newVal.tournament) return;
    await withLoading(async () => {
      const res = await api.post('/tournaments', { name: newVal.tournament, district_id: form.district_id, status: 'upcoming' });
      refresh('tournaments'); setForm({ ...form, tournament_id: res.data.id }); setNewVal({ ...newVal, tournament: '' }); setAdding({ ...adding, tournament: false });
    });
  };
  const addMatchLevel = async () => {
    if (!newVal.matchLevel) return;
    await withLoading(async () => {
      const res = await api.post('/match-levels', { name: newVal.matchLevel });
      refresh('matchLevels'); setForm({ ...form, match_level_id: res.data.id }); setNewVal({ ...newVal, matchLevel: '' }); setAdding({ ...adding, matchLevel: false });
    });
  };
  const addGroup = async () => {
    if (!newVal.group || !form.tournament_id) return;
    await withLoading(async () => {
      const res = await api.post('/groups', { group_name: newVal.group, tournament_id: form.tournament_id });
      refresh('groups'); setForm({ ...form, group_id: res.data.id }); setNewVal({ ...newVal, group: '' }); setAdding({ ...adding, group: false });
    });
  };
  const addVenue = async () => {
    if (!newVal.venueName) return;
    await withLoading(async () => {
      const res = await api.post('/venues', { venue_name: newVal.venueName, location: newVal.venueLocation || '', tournament_id: form.tournament_id || null });
      refresh('venues'); refresh('tournaments'); setForm({ ...form, venue_id: res.data.id, venue: res.data.venue_name }); setNewVal({ ...newVal, venueName: '', venueLocation: '' }); setAdding({ ...adding, venue: false });
    });
  };

  // Filtered data based on selections
  const filteredTournaments = tournaments.filter(t => !form.district_id || t.district_id == form.district_id);
  const filteredGroups = groups.filter(g => g.tournament_id == form.tournament_id);
  const selectedTournament = tournaments.find(t => t.id == form.tournament_id);
  const filteredTeams = selectedTournament?.teams?.length ? selectedTournament.teams : teams;
  const filteredVenues = selectedTournament?.venues?.length ? selectedTournament.venues : venues;

  const filtered = matches.filter(m => {
    const matchSearch = (m.team_a?.team_name + ' ' + m.team_b?.team_name).toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const canSubmit = form.district_id && form.tournament_id && form.match_level_id && form.group_id && form.team_a_id && form.team_b_id && (form.venue_id || form.venue) && form.match_date && form.overs;

  const statusColors = {
    upcoming: { bg: 'rgba(115,3,192,0.1)', color: '#a78bfa', border: 'rgba(115,3,192,0.2)' },
    live: { bg: 'rgba(236,56,188,0.1)', color: '#ec38bc', border: 'rgba(236,56,188,0.3)' },
    completed: { bg: 'rgba(34,197,94,0.1)', color: '#22c55e', border: 'rgba(34,197,94,0.2)' },
  };

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Matches</h1>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>{matches.length} total matches</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">New Match</span>
            <span className="sm:hidden">New</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 sm:p-4 rounded-xl text-center" style={{ background: 'rgba(236,56,188,0.05)', border: '1px solid rgba(236,56,188,0.15)' }}>
          <p className="text-xl sm:text-2xl font-bold" style={{ color: '#ec38bc' }}>{matches.filter(m => m.status === 'live').length}</p>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>Live</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl text-center" style={{ background: 'rgba(115,3,192,0.05)', border: '1px solid rgba(115,3,192,0.15)' }}>
          <p className="text-xl sm:text-2xl font-bold" style={{ color: '#a78bfa' }}>{matches.filter(m => m.status === 'upcoming').length}</p>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>Upcoming</p>
        </div>
        <div className="p-3 sm:p-4 rounded-xl text-center" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.15)' }}>
          <p className="text-xl sm:text-2xl font-bold" style={{ color: '#22c55e' }}>{matches.filter(m => m.status === 'completed').length}</p>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>Completed</p>
        </div>
      </div>

      {/* Match Creation Form */}
      {showForm && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h3 className="text-sm font-semibold text-white">{editId ? '✏️ Edit Match' : '🏏 Create New Match'}</h3>
            <button onClick={resetForm} className="p-2 rounded-lg hover:bg-white/5">
              <svg className="w-4 h-4" fill="none" stroke="#666" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="p-5 space-y-5">
            {/* 1. District */}
            <FieldSection label="District" required adding={adding.district} onToggleAdd={() => setAdding({ ...adding, district: !adding.district })}>
              {adding.district && (
                <InlineAdd value={newVal.district || ''} onChange={v => setNewVal({ ...newVal, district: v })} onAdd={addDistrict} onCancel={() => setAdding({ ...adding, district: false })} placeholder="District name" />
              )}
              <PillSelect items={districts} labelKey="district_name" value={form.district_id} onChange={v => setForm({ ...form, district_id: v, tournament_id: '', group_id: '' })} color="#3b82f6" />
            </FieldSection>

            {/* 2. Tournament (filtered by district) */}
            {form.district_id && (
              <FieldSection label="Tournament" required adding={adding.tournament} onToggleAdd={() => setAdding({ ...adding, tournament: !adding.tournament })}>
                {adding.tournament && (
                  <InlineAdd value={newVal.tournament || ''} onChange={v => setNewVal({ ...newVal, tournament: v })} onAdd={addTournament} onCancel={() => setAdding({ ...adding, tournament: false })} placeholder="Tournament name" />
                )}
                <PillSelect items={filteredTournaments} labelKey="name" value={form.tournament_id} onChange={v => setForm({ ...form, tournament_id: v, group_id: '' })} color="#f59e0b" />
                {filteredTournaments.length === 0 && <p className="text-xs" style={{ color: '#555' }}>No tournaments in this district. Add one above.</p>}
              </FieldSection>
            )}

            {/* 3. Match Level / Round */}
            {form.tournament_id && (
              <FieldSection label="Match Level / Round" required adding={adding.matchLevel} onToggleAdd={() => setAdding({ ...adding, matchLevel: !adding.matchLevel })}>
                {adding.matchLevel && (
                  <InlineAdd value={newVal.matchLevel || ''} onChange={v => setNewVal({ ...newVal, matchLevel: v })} onAdd={addMatchLevel} onCancel={() => setAdding({ ...adding, matchLevel: false })} placeholder="e.g. League, Quarter Final, Semi Final" />
                )}
                <PillSelect items={matchLevels} labelKey="name" value={form.match_level_id} onChange={v => setForm({ ...form, match_level_id: v })} color="#22c55e" />
              </FieldSection>
            )}

            {/* 4. Group */}
            {form.tournament_id && (
              <FieldSection label="Group" required adding={adding.group} onToggleAdd={() => setAdding({ ...adding, group: !adding.group })}>
                {adding.group && (
                  <InlineAdd value={newVal.group || ''} onChange={v => setNewVal({ ...newVal, group: v })} onAdd={addGroup} onCancel={() => setAdding({ ...adding, group: false })} placeholder="e.g. Group A" />
                )}
                <PillSelect items={filteredGroups} labelKey="group_name" value={form.group_id} onChange={v => setForm({ ...form, group_id: v })} color="#7303c0" />
                {filteredGroups.length === 0 && !adding.group && <p className="text-xs" style={{ color: '#555' }}>No groups for this tournament. Add one.</p>}
              </FieldSection>
            )}

            {/* 5. Teams */}
            {form.group_id && (
              <div className="space-y-3">
                <label className="text-xs font-medium text-white/70">Teams <span className="text-red-400">*</span></label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Team A */}
                  <div>
                    <p className="text-xs mb-2" style={{ color: '#888' }}>Team 1</p>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                      {filteredTeams.map(t => (
                        <button key={t.id} type="button" onClick={() => setForm({ ...form, team_a_id: t.id })}
                          className="p-2.5 rounded-xl text-center transition-all text-xs truncate"
                          style={{ background: form.team_a_id == t.id ? 'rgba(115,3,192,0.2)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.team_a_id == t.id ? 'rgba(115,3,192,0.5)' : 'rgba(255,255,255,0.06)'}`, color: form.team_a_id == t.id ? 'white' : '#888' }}>
                          {t.team_name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Team B */}
                  <div>
                    <p className="text-xs mb-2" style={{ color: '#888' }}>Team 2</p>
                    <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                      {filteredTeams.filter(t => t.id != form.team_a_id).map(t => (
                        <button key={t.id} type="button" onClick={() => setForm({ ...form, team_b_id: t.id })}
                          className="p-2.5 rounded-xl text-center transition-all text-xs truncate"
                          style={{ background: form.team_b_id == t.id ? 'rgba(255,96,34,0.2)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.team_b_id == t.id ? 'rgba(255,96,34,0.5)' : 'rgba(255,255,255,0.06)'}`, color: form.team_b_id == t.id ? 'white' : '#888' }}>
                          {t.team_name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Venue */}
            {form.team_a_id && form.team_b_id && (
              <FieldSection label="Venue" required adding={adding.venue} onToggleAdd={() => setAdding({ ...adding, venue: !adding.venue })}>
                {adding.venue && (
                  <div className="mb-3 p-3 rounded-xl space-y-2" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(236,56,188,0.2)' }}>
                    <input value={newVal.venueName || ''} onChange={e => setNewVal({ ...newVal, venueName: e.target.value })} placeholder="Venue name" className="w-full px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    <input value={newVal.venueLocation || ''} onChange={e => setNewVal({ ...newVal, venueLocation: e.target.value })} placeholder="Location (optional)" className="w-full px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    <div className="flex gap-2">
                      <button type="button" onClick={addVenue} className="flex-1 py-2 text-sm text-white rounded-lg" style={{ background: '#22c55e' }}>Add</button>
                      <button type="button" onClick={() => setAdding({ ...adding, venue: false })} className="px-3 py-2 text-sm rounded-lg" style={{ color: '#888' }}>Cancel</button>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                  {filteredVenues.map(v => (
                    <button key={v.id} type="button" onClick={() => setForm({ ...form, venue_id: v.id, venue: v.venue_name })}
                      className="p-2.5 rounded-xl text-left transition-all text-xs"
                      style={{ background: form.venue_id == v.id ? 'rgba(255,96,34,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.venue_id == v.id ? 'rgba(255,96,34,0.3)' : 'rgba(255,255,255,0.06)'}`, color: form.venue_id == v.id ? 'white' : '#888' }}>
                      <span className="block truncate">{v.venue_name}</span>
                      {v.location && <span className="block text-xs truncate" style={{ color: '#555' }}>{v.location}</span>}
                    </button>
                  ))}
                </div>
              </FieldSection>
            )}

            {/* 7. Overs */}
            {(form.venue_id || form.venue) && (
              <div>
                <label className="text-xs font-medium block mb-2 text-white/70">Overs <span className="text-red-400">*</span></label>
                {oversList.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {oversList.map(o => (
                      <button key={o.id} type="button" onClick={() => setForm({ ...form, overs: o.name })}
                        className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ background: form.overs == o.name ? 'rgba(236,56,188,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.overs == o.name ? 'rgba(236,56,188,0.4)' : 'rgba(255,255,255,0.08)'}`, color: form.overs == o.name ? '#ec38bc' : '#888' }}>
                        {o.name} ov
                      </button>
                    ))}
                  </div>
                ) : (
                  <input type="number" value={form.overs} onChange={e => setForm({ ...form, overs: e.target.value })} placeholder="e.g. 20" className="w-full px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                )}
              </div>
            )}

            {/* 8. Date & Time */}
            {form.overs && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium block mb-2 text-white/70">Date <span className="text-red-400">*</span></label>
                  <DateInput value={form.match_date} onChange={v => setForm({ ...form, match_date: v })} placeholder="Select date" />
                </div>
                <div>
                  <label className="text-xs font-medium block mb-2 text-white/70">Time</label>
                  <input type="time" value={form.match_time} onChange={e => setForm({ ...form, match_time: e.target.value })} className="w-full px-4 py-3 text-white text-sm focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
              </div>
            )}

            {/* Create Match Button */}
            {form.match_date && (
              <button onClick={handleSubmit} disabled={!canSubmit} className="w-full py-3.5 text-sm font-semibold text-white rounded-xl transition-all active:scale-[0.98] disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
                {editId ? '✓ Update Match' : '🏏 Create Match'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter & Search */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['', 'live', 'upcoming', 'completed'].map(s => (
          <button key={s} onClick={() => setFilterStatus(s)} className="shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition-all"
            style={{ background: filterStatus === s ? 'rgba(115,3,192,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${filterStatus === s ? 'rgba(115,3,192,0.3)' : 'rgba(255,255,255,0.06)'}`, color: filterStatus === s ? '#ec38bc' : '#666' }}>
            {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All'}
          </button>
        ))}
        <div className="relative ml-auto">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-8 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none w-36 sm:w-44 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
          <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5" fill="none" stroke="#555" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
      </div>

      {/* Match List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="text-3xl">🏏</span>
            <p className="text-sm mt-2" style={{ color: '#555' }}>No matches found</p>
          </div>
        )}
        {filtered.map(m => (
          <div key={m.id} className="p-4 rounded-xl transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>VS</div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm truncate">{m.team_a?.team_name} vs {m.team_b?.team_name}</p>
                  <p className="text-xs mt-0.5 truncate" style={{ color: '#555' }}>
                    {m.tournament?.name} {m.group && `• ${m.group.group_name}`} {m.match_level && `• ${m.match_level.name}`} • {m.overs}ov
                  </p>
                  <p className="text-xs truncate" style={{ color: '#444' }}>{m.match_date || 'TBD'} • {m.venue_info?.venue_name || m.venue || 'TBD'}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs px-2.5 py-1 rounded-lg font-medium flex items-center gap-1.5" style={{ background: statusColors[m.status]?.bg, color: statusColors[m.status]?.color, border: `1px solid ${statusColors[m.status]?.border}` }}>
                  {m.status === 'live' && <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#ec38bc' }} />}
                  {m.status}
                </span>
                <button onClick={() => handleEdit(m)} className="p-2 rounded-lg transition-all hover:bg-white/5" style={{ color: '#888' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                </button>
                <button onClick={() => handleDelete(m.id)} className="p-2 rounded-lg transition-all hover:bg-white/5" style={{ color: '#ff6b6b' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reusable field section with label + inline add button
function FieldSection({ label, required, adding, onToggleAdd, children }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-white/70">{label} {required && <span className="text-red-400">*</span>}</label>
        <button type="button" onClick={onToggleAdd} className="text-xs px-2 py-1 rounded-lg transition-all" style={{ color: '#ec38bc', background: 'rgba(236,56,188,0.1)' }}>
          {adding ? '✕ Cancel' : '+ New'}
        </button>
      </div>
      {children}
    </div>
  );
}

// Reusable inline add input
function InlineAdd({ value, onChange, onAdd, onCancel, placeholder }) {
  return (
    <div className="mb-3 flex gap-2">
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className="flex-1 px-3 py-2.5 text-white text-sm placeholder-gray-600 focus:outline-none rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), onAdd())} />
      <button type="button" onClick={onAdd} className="px-4 py-2.5 text-sm text-white rounded-lg font-medium" style={{ background: '#22c55e' }}>Add</button>
      <button type="button" onClick={onCancel} className="px-3 py-2.5 text-sm rounded-lg" style={{ color: '#888', background: 'rgba(255,255,255,0.03)' }}>✕</button>
    </div>
  );
}

// Reusable pill/card selector
function PillSelect({ items, labelKey, value, onChange, color }) {
  return (
    <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
      {items.map(item => (
        <button key={item.id} type="button" onClick={() => onChange(item.id)}
          className="px-3 py-2 rounded-xl text-xs font-medium transition-all"
          style={{ background: value == item.id ? `${color}22` : 'rgba(255,255,255,0.02)', border: `1px solid ${value == item.id ? `${color}66` : 'rgba(255,255,255,0.06)'}`, color: value == item.id ? 'white' : '#888' }}>
          {item[labelKey]}
        </button>
      ))}
    </div>
  );
}
