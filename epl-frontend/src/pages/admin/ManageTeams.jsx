import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';

export default function ManageTeams() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ team_name: '', district_id: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const teams = data?.teams || [];
  const districts = data?.districts || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/teams/${editId}`, form);
    else await api.post('/teams', form);
    setForm({ team_name: '', district_id: '' }); setEditId(null); refresh('teams');
  };

  const handleEdit = (t) => { setForm({ team_name: t.team_name, district_id: t.district_id || '' }); setEditId(t.id); };
  const handleDelete = async (id) => { await api.delete(`/teams/${id}`); refresh('teams'); };

  const filtered = teams.filter(t => t.team_name.toLowerCase().includes(search.toLowerCase()));
  const inputStyle = { background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(115,3,192,0.2)' }}><span className="text-lg">👥</span></div>
          <div><p className="text-2xl font-bold text-white">{teams.length}</p><p className="text-xs" style={{ color: '#b4b2be' }}>Total Teams</p></div>
        </div>
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(236,56,188,0.2)' }}><span className="text-lg">📍</span></div>
          <div><p className="text-2xl font-bold text-white">{districts.length}</p><p className="text-xs" style={{ color: '#b4b2be' }}>Districts</p></div>
        </div>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Team' : '➕ Add New Team'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={form.team_name} onChange={e => setForm({ ...form, team_name: e.target.value })} placeholder="Team Name" className="flex-1 min-w-[200px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} required />
          <select value={form.district_id} onChange={e => setForm({ ...form, district_id: e.target.value })} className="px-4 py-2.5 text-white focus:outline-none" style={inputStyle}>
            <option value="">Select District</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.district_name}</option>)}
          </select>
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add Team'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ team_name: '', district_id: '' }); }} className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">All Teams ({filtered.length})</h3>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search teams..." className="px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none w-48" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filtered.length === 0 && <p className="text-center py-8 col-span-2" style={{ color: '#686678' }}>No teams found</p>}
          {filtered.map(t => (
            <div key={t.id} className="flex justify-between items-center px-4 py-3" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)', color: 'white' }}>{t.team_name?.charAt(0)}</span>
                <div><p className="text-white font-medium text-sm">{t.team_name}</p><p className="text-xs" style={{ color: '#686678' }}>{t.district?.district_name || 'No district'}</p></div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(t)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:opacity-80" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc' }}>Edit</button>
                <button onClick={() => handleDelete(t.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:opacity-80" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
