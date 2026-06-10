import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';

export default function ManageDistricts() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const districts = data?.districts || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/districts/${editId}`, { district_name: name });
    else await api.post('/districts', { district_name: name });
    setName(''); setEditId(null); refresh('districts');
  };

  const handleEdit = (d) => { setName(d.district_name); setEditId(d.id); };
  const handleDelete = async (id) => { await api.delete(`/districts/${id}`); refresh('districts'); };

  const filtered = districts.filter(d => d.district_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(115,3,192,0.2)' }}><span className="text-lg">📍</span></div>
          <div><p className="text-2xl font-bold text-white">{districts.length}</p><p className="text-xs" style={{ color: '#b4b2be' }}>Total Districts</p></div>
        </div>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit District' : '➕ Add New District'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="District Name" className="flex-1 min-w-[200px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none transition-all" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} required />
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add District'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setName(''); }} className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">All Districts</h3>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." className="px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none w-48" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} />
        </div>
        <div className="space-y-2">
          {filtered.length === 0 && <p className="text-center py-8" style={{ color: '#686678' }}>No districts found</p>}
          {filtered.map((d, i) => (
            <div key={d.id} className="flex justify-between items-center px-4 py-3" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)', color: 'white' }}>{i + 1}</span>
                <span className="text-white font-medium">{d.district_name}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(d)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc' }}>Edit</button>
                <button onClick={() => handleDelete(d.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
