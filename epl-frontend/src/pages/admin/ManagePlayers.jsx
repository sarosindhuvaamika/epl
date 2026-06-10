import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';

export default function ManagePlayers() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ name: '', emp_id: '', email_id: '', phone_no: '', team_id: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [filterTeam, setFilterTeam] = useState('');

  const players = data?.players || [];
  const teams = data?.teams || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/players/${editId}`, form);
    else await api.post('/players', form);
    setForm({ name: '', emp_id: '', email_id: '', phone_no: '', team_id: '' }); setEditId(null); refresh('players');
  };

  const handleEdit = (p) => { setForm({ name: p.name, emp_id: p.emp_id || '', email_id: p.email_id || '', phone_no: p.phone_no, team_id: p.team_id || '' }); setEditId(p.id); };
  const handleDelete = async (id) => { await api.delete(`/players/${id}`); refresh('players'); };

  const filtered = players.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.emp_id && p.emp_id.toLowerCase().includes(search.toLowerCase()));
    const matchTeam = !filterTeam || p.team_id == filterTeam;
    return matchSearch && matchTeam;
  });

  const inputStyle = { background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(115,3,192,0.2)' }}><span className="text-lg">🧑</span></div>
          <div><p className="text-2xl font-bold text-white">{players.length}</p><p className="text-xs" style={{ color: '#b4b2be' }}>Total Players</p></div>
        </div>
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(236,56,188,0.2)' }}><span className="text-lg">👥</span></div>
          <div><p className="text-2xl font-bold text-white">{teams.length}</p><p className="text-xs" style={{ color: '#b4b2be' }}>Teams</p></div>
        </div>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Player' : '➕ Add New Player'}</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Player Name" className="px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} required />
          <input value={form.emp_id} onChange={e => setForm({ ...form, emp_id: e.target.value })} placeholder="Emp ID" className="px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} />
          <input value={form.email_id} onChange={e => setForm({ ...form, email_id: e.target.value })} placeholder="Email" className="px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} />
          <input value={form.phone_no} onChange={e => setForm({ ...form, phone_no: e.target.value })} placeholder="Phone" className="px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} required />
          <select value={form.team_id} onChange={e => setForm({ ...form, team_id: e.target.value })} className="px-4 py-2.5 text-white focus:outline-none" style={inputStyle}>
            <option value="">Select Team</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
          </select>
          <div className="flex gap-2">
            <button className="flex-1 px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add'}</button>
            {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', emp_id: '', email_id: '', phone_no: '', team_id: '' }); }} className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
          </div>
        </form>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
          <h3 className="text-sm font-semibold text-white">All Players ({filtered.length})</h3>
          <div className="flex gap-2">
            <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)} className="px-3 py-1.5 text-sm text-white focus:outline-none" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
              <option value="">All Teams</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.team_name}</option>)}
            </select>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." className="px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none w-40" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} />
          </div>
        </div>
        <div className="space-y-2">
          {filtered.length === 0 && <p className="text-center py-8" style={{ color: '#686678' }}>No players found</p>}
          {filtered.map(p => (
            <div key={p.id} className="flex justify-between items-center px-4 py-3" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)', color: 'white' }}>{p.name?.charAt(0)}</span>
                <div>
                  <span className="text-white font-medium text-sm">{p.name}</span>
                  <p className="text-xs" style={{ color: '#686678' }}>{p.team?.team_name || 'Unassigned'} • {p.emp_id || 'No ID'}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(p)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:opacity-80" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc' }}>Edit</button>
                <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:opacity-80" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
