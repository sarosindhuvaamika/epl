import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';

export default function ManageTeams() {
  const { data, refresh, withLoading } = useAdminData();
  const [form, setForm] = useState({ team_name: '', district_id: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const teams = data?.teams || [];
  const districts = data?.districts || [];

  const resetForm = () => { setForm({ team_name: '', district_id: '' }); setEditId(null); setShowForm(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await withLoading(async () => {
      if (editId) await api.put(`/teams/${editId}`, form);
      else await api.post('/teams', form);
      resetForm(); refresh('teams');
    });
  };

  const handleEdit = (t) => { setForm({ team_name: t.team_name, district_id: t.district_id || '' }); setEditId(t.id); setShowForm(true); };
  const handleDelete = async (id) => { await withLoading(async () => { await api.delete(`/teams/${id}`); refresh('teams'); }); };

  const filtered = teams.filter(t => t.team_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Teams</h1>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>{teams.length} registered teams</p>
        </div>
        {!showForm && (
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            <span className="hidden sm:inline">Add Team</span>
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="p-5 rounded-xl" style={{ background: '#111128', border: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">{editId ? 'Edit Team' : 'New Team'}</h3>
            <button onClick={resetForm} className="p-1.5 rounded-lg hover:bg-white/5"><svg className="w-4 h-4" fill="none" stroke="#666" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input value={form.team_name} onChange={e => setForm({ ...form, team_name: e.target.value })} placeholder="Team Name" className="w-full px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} required />
            <select value={form.district_id} onChange={e => setForm({ ...form, district_id: e.target.value })} className="w-full px-4 py-3 text-white text-sm focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <option value="">Select District (optional)</option>
              {districts.map(d => <option key={d.id} value={d.id}>{d.district_name}</option>)}
            </select>
            <div className="flex gap-2 pt-1">
              <button className="flex-1 sm:flex-none px-6 py-3 text-white text-sm font-medium rounded-xl transition-all active:scale-95" style={{ background: editId ? 'linear-gradient(135deg, #7303c0, #5b02a0)' : 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>{editId ? '✓ Update' : '+ Add Team'}</button>
              <button type="button" onClick={resetForm} className="px-4 py-3 text-sm rounded-xl" style={{ color: '#888', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teams..." className="w-full pl-10 pr-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }} />
        <svg className="absolute left-3.5 top-3.5 w-4 h-4" fill="none" stroke="#555" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.length === 0 && <p className="text-center py-12 col-span-2" style={{ color: '#555' }}>No teams found</p>}
        {filtered.map(t => (
          <div key={t.id} className="p-4 rounded-xl flex items-center justify-between transition-all" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>{t.team_name?.charAt(0)}</span>
              <div className="min-w-0">
                <p className="text-white font-medium text-sm truncate">{t.team_name}</p>
                <p className="text-xs" style={{ color: '#555' }}>{t.district?.district_name || 'No district'}</p>
              </div>
            </div>
            <div className="flex gap-1 shrink-0 ml-2">
              <button onClick={() => handleEdit(t)} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: '#888' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
              <button onClick={() => handleDelete(t.id)} className="p-2 rounded-lg hover:bg-white/5 transition-all" style={{ color: '#ff6b6b' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
