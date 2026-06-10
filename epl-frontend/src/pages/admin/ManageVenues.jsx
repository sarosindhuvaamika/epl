import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';

export default function ManageVenues() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ venue_name: '', location: '' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');

  const venues = data?.venues || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/venues/${editId}`, form);
    else await api.post('/venues', form);
    setForm({ venue_name: '', location: '' }); setEditId(null); refresh('venues');
  };

  const handleEdit = (v) => { setForm({ venue_name: v.venue_name, location: v.location || '' }); setEditId(v.id); };
  const handleDelete = async (id) => { await api.delete(`/venues/${id}`); refresh('venues'); };

  const filtered = venues.filter(v => v.venue_name.toLowerCase().includes(search.toLowerCase()));
  const inputStyle = { background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,96,34,0.2)' }}><span className="text-lg">🏟️</span></div>
          <div><p className="text-2xl font-bold text-white">{venues.length}</p><p className="text-xs" style={{ color: '#b4b2be' }}>Total Venues</p></div>
        </div>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Venue' : '➕ Add New Venue'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={form.venue_name} onChange={e => setForm({ ...form, venue_name: e.target.value })} placeholder="Venue Name" className="flex-1 min-w-[200px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} required />
          <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location (optional)" className="flex-1 min-w-[200px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} />
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add Venue'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ venue_name: '', location: '' }); }} className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>

      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">All Venues ({filtered.length})</h3>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." className="px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none w-48" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {filtered.length === 0 && <p className="text-center py-8 col-span-2" style={{ color: '#686678' }}>No venues found</p>}
          {filtered.map(v => (
            <div key={v.id} className="flex justify-between items-center px-4 py-3" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,96,34,0.15)' }}><span className="text-sm">🏟️</span></span>
                <div><p className="text-white font-medium text-sm">{v.venue_name}</p><p className="text-xs" style={{ color: '#686678' }}>{v.location || 'No location'}</p></div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleEdit(v)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:opacity-80" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc' }}>Edit</button>
                <button onClick={() => handleDelete(v.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:opacity-80" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
