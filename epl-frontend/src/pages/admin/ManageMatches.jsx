import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';
import DateInput from '../../components/DateInput';

export default function ManageMatches() {
  const { data, refresh } = useAdminData();
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ tournament_id: '', group_id: '', team_a_id: '', team_b_id: '', match_date: '', venue: '', venue_id: '', overs: 20, status: 'upcoming' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const matches = data?.matches || [];
  const tournaments = data?.tournaments || [];
  const teams = data?.teams || [];
  const groups = data?.groups || [];
  const venues = data?.venues || [];
  const overs = data?.overs || [];

  const resetForm = () => {
    setForm({ tournament_id: '', group_id: '', team_a_id: '', team_b_id: '', match_date: '', venue: '', venue_id: '', overs: 20, status: 'upcoming' });
    setEditId(null); setStep(1); setShowForm(false);
  };

  const handleSubmit = async () => {
    if (editId) await api.put(`/matches/${editId}`, form);
    else await api.post('/matches', form);
    resetForm(); refresh('matches');
  };

  const handleEdit = (m) => {
    setForm({ tournament_id: m.tournament_id || '', group_id: m.group_id || '', team_a_id: m.team_a_id || '', team_b_id: m.team_b_id || '', match_date: m.match_date || '', venue: m.venue || '', venue_id: m.venue_id || '', overs: m.overs || 20, status: m.status });
    setEditId(m.id); setShowForm(true); setStep(1);
  };

  const handleDelete = async (id) => { await api.delete(`/matches/${id}`); refresh('matches'); };

  const filtered = matches.filter(m => {
    const matchSearch = (m.team_a?.team_name + ' ' + m.team_b?.team_name).toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredGroups = groups.filter(g => !form.tournament_id || g.tournament_id == form.tournament_id);

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

      {/* Stats Row */}
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

      {/* Match Creation Wizard */}
      {showForm && (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.08)' }}>
          {/* Wizard Header */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <h3 className="text-sm font-semibold text-white">{editId ? 'Edit Match' : 'Create New Match'}</h3>
              <p className="text-xs mt-0.5" style={{ color: '#555' }}>Step {step} of 3</p>
            </div>
            <button onClick={resetForm} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="#666" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-5 pt-4">
            <div className="flex gap-2">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 h-1 rounded-full transition-all duration-300" style={{ background: s <= step ? 'linear-gradient(90deg, #7303c0, #ec38bc)' : 'rgba(255,255,255,0.06)' }} />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs" style={{ color: step >= 1 ? '#ec38bc' : '#444' }}>Tournament</span>
              <span className="text-xs" style={{ color: step >= 2 ? '#ec38bc' : '#444' }}>Teams</span>
              <span className="text-xs" style={{ color: step >= 3 ? '#ec38bc' : '#444' }}>Details</span>
            </div>
          </div>

          {/* Step Content */}
          <div className="p-5">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-2 text-white/70">Select Tournament *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tournaments.map(t => (
                      <button key={t.id} type="button" onClick={() => setForm({ ...form, tournament_id: t.id })}
                        className="p-3 rounded-xl text-left transition-all text-sm"
                        style={{ background: form.tournament_id == t.id ? 'rgba(115,3,192,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.tournament_id == t.id ? 'rgba(115,3,192,0.4)' : 'rgba(255,255,255,0.06)'}`, color: form.tournament_id == t.id ? 'white' : '#888' }}>
                        <span className="font-medium">{t.name}</span>
                        <span className="block text-xs mt-0.5" style={{ color: '#555' }}>{t.status}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-2 text-white/70">Group (optional)</label>
                  <select value={form.group_id} onChange={e => setForm({ ...form, group_id: e.target.value })} className="w-full px-4 py-3 text-white text-sm focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <option value="">No Group</option>
                    {filteredGroups.map(g => <option key={g.id} value={g.id}>{g.group_name}</option>)}
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium block mb-2 text-white/70">Team A *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {teams.map(t => (
                      <button key={t.id} type="button" onClick={() => setForm({ ...form, team_a_id: t.id })}
                        className="p-3 rounded-xl text-center transition-all text-sm truncate"
                        style={{ background: form.team_a_id == t.id ? 'rgba(115,3,192,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.team_a_id == t.id ? 'rgba(115,3,192,0.4)' : 'rgba(255,255,255,0.06)'}`, color: form.team_a_id == t.id ? 'white' : '#888' }}>
                        {t.team_name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-center py-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc' }}>VS</span>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-2 text-white/70">Team B *</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                    {teams.filter(t => t.id != form.team_a_id).map(t => (
                      <button key={t.id} type="button" onClick={() => setForm({ ...form, team_b_id: t.id })}
                        className="p-3 rounded-xl text-center transition-all text-sm truncate"
                        style={{ background: form.team_b_id == t.id ? 'rgba(255,96,34,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.team_b_id == t.id ? 'rgba(255,96,34,0.4)' : 'rgba(255,255,255,0.06)'}`, color: form.team_b_id == t.id ? 'white' : '#888' }}>
                        {t.team_name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium block mb-2 text-white/70">Match Date</label>
                    <DateInput value={form.match_date} onChange={v => setForm({ ...form, match_date: v })} placeholder="Select date" />
                  </div>
                  <div>
                    <label className="text-xs font-medium block mb-2 text-white/70">Overs</label>
                    {overs.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {overs.map(o => (
                          <button key={o.id} type="button" onClick={() => setForm({ ...form, overs: o.name })}
                            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                            style={{ background: form.overs == o.name ? 'rgba(236,56,188,0.15)' : 'rgba(255,255,255,0.03)', border: `1px solid ${form.overs == o.name ? 'rgba(236,56,188,0.4)' : 'rgba(255,255,255,0.08)'}`, color: form.overs == o.name ? '#ec38bc' : '#888' }}>
                            {o.name}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <input type="number" value={form.overs} onChange={e => setForm({ ...form, overs: e.target.value })} className="w-full px-4 py-3 text-white text-sm focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium block mb-2 text-white/70">Venue</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {venues.map(v => (
                      <button key={v.id} type="button" onClick={() => setForm({ ...form, venue_id: v.id, venue: v.venue_name })}
                        className="p-3 rounded-xl text-left transition-all text-sm"
                        style={{ background: form.venue_id == v.id ? 'rgba(255,96,34,0.1)' : 'rgba(255,255,255,0.02)', border: `1px solid ${form.venue_id == v.id ? 'rgba(255,96,34,0.3)' : 'rgba(255,255,255,0.06)'}`, color: form.venue_id == v.id ? 'white' : '#888' }}>
                        <span className="block truncate">{v.venue_name}</span>
                        {v.location && <span className="block text-xs mt-0.5 truncate" style={{ color: '#555' }}>{v.location}</span>}
                      </button>
                    ))}
                  </div>
                  <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value, venue_id: '' })} placeholder="Or type venue name" className="w-full mt-2 px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
              </div>
            )}
          </div>

          {/* Wizard Footer */}
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => step > 1 ? setStep(step - 1) : resetForm()} className="px-4 py-2.5 text-sm font-medium rounded-xl transition-all" style={{ color: '#888', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {step > 1 ? '← Back' : 'Cancel'}
            </button>
            {step < 3 ? (
              <button onClick={() => setStep(step + 1)} className="px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}
                disabled={step === 1 && !form.tournament_id || step === 2 && (!form.team_a_id || !form.team_b_id)}>
                Next →
              </button>
            ) : (
              <button onClick={handleSubmit} className="px-5 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:opacity-90 active:scale-95" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)' }}>
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
                    {m.tournament?.name} {m.group && `• ${m.group.group_name}`} • {m.overs}ov
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
