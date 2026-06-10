import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';
import DateInput from '../../components/DateInput';

export default function ManageMatches() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ tournament_id: '', group_id: '', team_a_id: '', team_b_id: '', match_date: '', venue: '', venue_id: '', overs: 20, status: 'upcoming' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const matches = data?.matches || [];
  const tournaments = data?.tournaments || [];
  const teams = data?.teams || [];
  const groups = data?.groups || [];
  const venues = data?.venues || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/matches/${editId}`, form);
    else await api.post('/matches', form);
    setForm({ tournament_id: '', group_id: '', team_a_id: '', team_b_id: '', match_date: '', venue: '', venue_id: '', overs: 20, status: 'upcoming' });
    setEditId(null);
    refresh('matches');
  };

  const handleEdit = (m) => {
    setForm({ tournament_id: m.tournament_id || '', group_id: m.group_id || '', team_a_id: m.team_a_id || '', team_b_id: m.team_b_id || '', match_date: m.match_date || '', venue: m.venue || '', venue_id: m.venue_id || '', overs: m.overs || 20, status: m.status });
    setEditId(m.id);
  };

  const handleDelete = async (id) => { await api.delete(`/matches/${id}`); refresh('matches'); };

  const filtered = matches.filter(m => {
    const matchSearch = (m.team_a?.team_name + ' ' + m.team_b?.team_name).toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const filteredGroups = groups.filter(g => !form.tournament_id || g.tournament_id == form.tournament_id);
  const inputStyle = { background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' };

  const statusConfig = {
    upcoming: { bg: 'rgba(115,3,192,0.15)', color: '#b4b2be', dot: '#b4b2be' },
    live: { bg: 'rgba(236,56,188,0.15)', color: '#ec38bc', dot: '#ec38bc' },
    completed: { bg: 'rgba(255,96,34,0.15)', color: '#ff6022', dot: '#ff6022' },
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(115,3,192,0.2)' }}>
            <span className="text-lg">📅</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{matches.length}</p>
            <p className="text-xs" style={{ color: '#b4b2be' }}>Total</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(236,56,188,0.2)' }}>
            <span className="text-lg">🔴</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{matches.filter(m => m.status === 'live').length}</p>
            <p className="text-xs" style={{ color: '#b4b2be' }}>Live</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,96,34,0.2)' }}>
            <span className="text-lg">⏳</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{matches.filter(m => m.status === 'upcoming').length}</p>
            <p className="text-xs" style={{ color: '#b4b2be' }}>Upcoming</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(104,102,120,0.3)' }}>
            <span className="text-lg">✅</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{matches.filter(m => m.status === 'completed').length}</p>
            <p className="text-xs" style={{ color: '#b4b2be' }}>Completed</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Match' : '➕ Schedule New Match'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <select value={form.tournament_id} onChange={e => setForm({ ...form, tournament_id: e.target.value, group_id: '' })} className="px-4 py-2.5 text-white focus:outline-none" style={inputStyle} required>
            <option value="">Select Tournament</option>
            {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={form.group_id} onChange={e => setForm({ ...form, group_id: e.target.value })} className="px-4 py-2.5 text-white focus:outline-none" style={inputStyle}>
            <option value="">Group (optional)</option>
            {filteredGroups.map(g => <option key={g.id} value={g.id}>{g.group_name}</option>)}
          </select>
          <select value={form.team_a_id} onChange={e => setForm({ ...form, team_a_id: e.target.value })} className="px-4 py-2.5 text-white focus:outline-none" style={inputStyle} required>
            <option value="">Team A</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
          </select>
          <select value={form.team_b_id} onChange={e => setForm({ ...form, team_b_id: e.target.value })} className="px-4 py-2.5 text-white focus:outline-none" style={inputStyle} required>
            <option value="">Team B</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
          </select>
          <DateInput value={form.match_date} onChange={v => setForm({ ...form, match_date: v })} placeholder="Match date" />
          <select value={form.venue_id} onChange={e => setForm({ ...form, venue_id: e.target.value })} className="px-4 py-2.5 text-white focus:outline-none" style={inputStyle}>
            <option value="">Select Venue</option>
            {venues.map(v => <option key={v.id} value={v.id}>{v.venue_name}</option>)}
          </select>
          <input value={form.venue} onChange={e => setForm({ ...form, venue: e.target.value })} placeholder="Or type venue" className="px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} />
          <input type="number" value={form.overs} onChange={e => setForm({ ...form, overs: e.target.value })} placeholder="Overs" className="px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} />
          <div className="sm:col-span-2 lg:col-span-1 flex gap-2">
            <button className="flex-1 px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add Match'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ tournament_id: '', group_id: '', team_a_id: '', team_b_id: '', match_date: '', venue: '', venue_id: '', overs: 20, status: 'upcoming' }); }} className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
          </div>
        </form>
      </div>

      {/* List */}
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold text-white">All Matches ({filtered.length})</h3>
          <div className="flex gap-2">
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-1.5 text-sm text-white focus:outline-none" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
              <option value="">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
            </select>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." className="px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none w-40" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} />
          </div>
        </div>
        <div className="space-y-2">
          {filtered.length === 0 && <p className="text-center py-8" style={{ color: '#686678' }}>No matches found</p>}
          {filtered.map(m => (
            <div key={m.id} className="px-4 py-4 transition-all" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="flex items-center gap-3">
                  <div className="text-center shrink-0">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)', color: 'white' }}>VS</div>
                  </div>
                  <div>
                    <p className="text-white font-medium">{m.team_a?.team_name} <span style={{ color: '#686678' }}>vs</span> {m.team_b?.team_name}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#686678' }}>
                      {m.tournament?.name} {m.group && <span style={{ color: '#ec38bc' }}>• {m.group.group_name}</span>}
                    </p>
                    <p className="text-xs" style={{ color: '#686678' }}>
                      {m.match_date || 'TBD'} • {m.venue_info?.venue_name || m.venue || 'Venue TBD'} • {m.overs} overs
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: statusConfig[m.status]?.bg, color: statusConfig[m.status]?.color }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusConfig[m.status]?.dot }}></span>
                    {m.status}
                  </span>
                  <button onClick={() => handleEdit(m)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc' }}>Edit</button>
                  <button onClick={() => handleDelete(m.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
