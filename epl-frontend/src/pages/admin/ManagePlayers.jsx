import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';

export default function ManagePlayers() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ name: '', emp_id: '', email_id: '', phone_no: '', team_id: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [showForm, setShowForm] = useState(false);

  const players = data?.players || [];
  const teams = data?.teams || [];

  const resetForm = () => { setForm({ name: '', emp_id: '', email_id: '', phone_no: '', team_id: '' }); setEditId(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/players/${editId}`, form);
    else await api.post('/players', form);
    resetForm(); refresh('players');
  };

  const handleEdit = (p) => { setForm({ name: p.name, emp_id: p.emp_id || '', email_id: p.email_id || '', phone_no: p.phone_no, team_id: p.team_id || '' }); setEditId(p.id); setShowForm(true); };
  const handleDelete = async (id) => { await api.delete(`/players/${id}`); refresh('players'); };

  const filtered = players.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.emp_id && p.emp_id.toLowerCase().includes(search.toLowerCase()));
    const matchTeam = !filterTeam || p.team_id == filterTeam;
    return matchSearch && matchTeam;
  });

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Players</h1>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>{players.length} registered players</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">Add Player</span>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-5 rounded-xl" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">{editId ? 'Edit Player' : 'New Player'}</h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-white/5"><svg className="w-4 h-4" fill="none" stroke="#666" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Player Name *" className="px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} required />
              <input value={form.phone_no} onChange={e => setForm({ ...form, phone_no: e.target.value })} placeholder="Phone *" className="px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} required />
              <input value={form.emp_id} onChange={e => setForm({ ...form, emp_id: e.target.value })} placeholder="Employee ID" className="px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
              <input value={form.email_id} onChange={e => setForm({ ...form, email_id: e.target.value })} placeholder="Email" className="px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
            </div>
            <select value={form.team_id} onChange={e => setForm({ ...form, team_id: e.target.value })} className="w-full px-4 py-3 text-white text-sm focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <option value="">Select Team (optional)</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
            </select>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 sm:flex-none px-6 py-3 text-white text-sm font-medium rounded-xl transition-all active:scale-95" style={{ background: editId ? 'linear-gradient(135deg, #7303c0, #5b02a0)' : 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>{editId ? '✓ Update' : '+ Add Player'}</button>
              <button type="button" onClick={resetForm} className="px-4 py-3 text-sm rounded-xl" style={{ color: '#888', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search players..." className="w-full pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} />
          <svg className="absolute left-3.5 top-3.5 w-4 h-4" fill="none" stroke="#555" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)} className="px-4 py-3 text-sm text-white focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <option value="">All Teams</option>
          {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
        </select>
      </div>

      {/* Player count */}
      <p className="text-xs" style={{ color: '#555' }}>Showing {filtered.length} of {players.length} players</p>

      {/* Players List */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <span className="text-3xl">🧑</span>
            <p className="text-sm mt-2" style={{ color: '#555' }}>No players found</p>
          </div>
        )}
        {filtered.map(p => (
          <div key={p.id} className="p-3 sm:p-4 rounded-xl flex items-center justify-between transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>{p.name?.charAt(0)}</span>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm truncate">{p.name}</p>
                <p className="text-xs truncate" style={{ color: '#555' }}>
                  {p.team?.team_name || 'Unassigned'} {p.emp_id && `• ${p.emp_id}`}
                </p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0 ml-2">
              <button onClick={() => handleEdit(p)} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: '#888' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: '#ff6b6b' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
