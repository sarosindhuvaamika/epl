import { useEffect, useState } from 'react';
import api from '../../api';
import Loader from '../../components/Loader';

export default function ManageSeasons() {
  const [seasons, setSeasons] = useState([]);
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = (showLoader = true) => { if (showLoader) setLoading(true); api.get('/seasons').then(res => setSeasons(res.data)).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/seasons/${editId}`, { season_name: name });
    else await api.post('/seasons', { season_name: name });
    setName(''); setEditId(null); load(false);
  };

  const handleEdit = (s) => { setName(s.season_name); setEditId(s.id); };
  const handleDelete = async (id) => { await api.delete(`/seasons/${id}`); load(false); };

  const filtered = seasons.filter(s => s.season_name.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <Loader dark />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,96,34,0.2)' }}><span className="text-lg">📆</span></div>
          <div><p className="text-2xl font-bold text-white">{seasons.length}</p><p className="text-xs" style={{ color: '#b4b2be' }}>Total Seasons</p></div>
        </div>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Season' : '➕ Add New Season'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Season Name (e.g. Season 2024)" className="flex-1 min-w-[200px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} required />
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add Season'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setName(''); }} className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">All Seasons</h3>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." className="px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none w-48" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} />
        </div>
        <div className="space-y-2">
          {filtered.length === 0 && <p className="text-center py-8" style={{ color: '#686678' }}>No seasons found</p>}
          {filtered.map((s, i) => (
            <div key={s.id} className="flex justify-between items-center px-4 py-3" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #ff6022, #ec38bc)', color: 'white' }}>{i + 1}</span>
                <span className="text-white font-medium">{s.season_name}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(s)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc' }}>Edit</button>
                <button onClick={() => handleDelete(s.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
