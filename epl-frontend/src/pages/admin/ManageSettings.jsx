import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';

const sections = [
  { key: 'groups', label: '📋 Groups' },
  { key: 'venues', label: '🏟️ Venues' },
  { key: 'overs', label: '🎯 Overs' },
  { key: 'matchLevel', label: '🏅 Match Level' },
  { key: 'tournaments', label: '🏆 Tournaments' },
  { key: 'districts', label: '📍 Districts' },
];

const inputStyle = { background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' };

export default function ManageSettings() {
  const [activeSection, setActiveSection] = useState('groups');

  return (
    <div className="space-y-4">
      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2">
        {sections.map(s => (
          <button key={s.key} onClick={() => setActiveSection(s.key)} className="px-3 py-2 text-xs font-medium rounded-lg transition-all"
            style={{ background: activeSection === s.key ? 'linear-gradient(135deg, #7303c0, #ec38bc)' : '#27253f', color: 'white', border: activeSection === s.key ? 'none' : '1.5px solid #686678' }}>
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === 'groups' && <GroupsSection />}
      {activeSection === 'venues' && <VenuesSection />}
      {activeSection === 'overs' && <OversSection />}
      {activeSection === 'matchLevel' && <MatchLevelSection />}
      {activeSection === 'tournaments' && <TournamentsSection />}
      {activeSection === 'districts' && <DistrictsSection />}
    </div>
  );
}

function GroupsSection() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ group_name: '', tournament_id: '' });
  const [editId, setEditId] = useState(null);

  const groups = data?.groups || [];
  const tournaments = data?.tournaments || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/groups/${editId}`, form);
    else await api.post('/groups', form);
    setForm({ group_name: '', tournament_id: '' }); setEditId(null); refresh('groups');
  };
  const handleDelete = async (id) => { await api.delete(`/groups/${id}`); refresh('groups'); };

  return (
    <div className="space-y-4">
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Group' : '➕ Add Group'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={form.group_name} onChange={e => setForm({ ...form, group_name: e.target.value })} placeholder="Group Name" className="flex-1 min-w-[180px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} required />
          <select value={form.tournament_id} onChange={e => setForm({ ...form, tournament_id: e.target.value })} className="px-4 py-2.5 text-white focus:outline-none min-w-[160px]" style={inputStyle} required>
            <option value="">Select Tournament</option>
            {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ group_name: '', tournament_id: '' }); }} className="px-5 py-2.5 text-white text-sm" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>
      <ItemList items={groups} labelKey="group_name" subKey={g => g.tournament?.name} onEdit={g => { setForm({ group_name: g.group_name, tournament_id: g.tournament_id }); setEditId(g.id); }} onDelete={handleDelete} />
    </div>
  );
}

function VenuesSection() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ venue_name: '', location: '' });
  const [editId, setEditId] = useState(null);

  const venues = data?.venues || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/venues/${editId}`, form);
    else await api.post('/venues', form);
    setForm({ venue_name: '', location: '' }); setEditId(null); refresh('venues');
  };
  const handleDelete = async (id) => { await api.delete(`/venues/${id}`); refresh('venues'); };

  return (
    <div className="space-y-4">
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Venue' : '➕ Add Venue'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={form.venue_name} onChange={e => setForm({ ...form, venue_name: e.target.value })} placeholder="Venue Name" className="flex-1 min-w-[180px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} required />
          <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location (optional)" className="flex-1 min-w-[180px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} />
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ venue_name: '', location: '' }); }} className="px-5 py-2.5 text-white text-sm" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>
      <ItemList items={venues} labelKey="venue_name" subKey={v => v.location || 'No location'} onEdit={v => { setForm({ venue_name: v.venue_name, location: v.location || '' }); setEditId(v.id); }} onDelete={handleDelete} />
    </div>
  );
}

function OversSection() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const overs = data?.overs || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/overs/${editId}`, { name });
    else await api.post('/overs', { name });
    setName(''); setEditId(null); refresh('overs');
  };
  const handleDelete = async (id) => { await api.delete(`/overs/${id}`); refresh('overs'); };

  return (
    <div className="space-y-4">
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Overs' : '➕ Add Overs'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. 20, 10, 5" className="flex-1 min-w-[180px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} required />
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setName(''); }} className="px-5 py-2.5 text-white text-sm" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>
      <ItemList items={overs} labelKey="name" onEdit={o => { setName(o.name); setEditId(o.id); }} onDelete={handleDelete} />
    </div>
  );
}

function MatchLevelSection() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const matchLevels = data?.matchLevels || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/match-levels/${editId}`, { name });
    else await api.post('/match-levels', { name });
    setName(''); setEditId(null); refresh('matchLevels');
  };
  const handleDelete = async (id) => { await api.delete(`/match-levels/${id}`); refresh('matchLevels'); };

  return (
    <div className="space-y-4">
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Match Level' : '➕ Add Match Level'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. League, Quarter Final, Semi Final, Final" className="flex-1 min-w-[180px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} required />
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setName(''); }} className="px-5 py-2.5 text-white text-sm" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>
      <ItemList items={matchLevels} labelKey="name" onEdit={m => { setName(m.name); setEditId(m.id); }} onDelete={handleDelete} />
    </div>
  );
}

function TournamentsSection() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ name: '', district_id: '', status: 'upcoming' });
  const [editId, setEditId] = useState(null);

  const tournaments = data?.tournaments || [];
  const districts = data?.districts || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/tournaments/${editId}`, form);
    else await api.post('/tournaments', form);
    setForm({ name: '', district_id: '', status: 'upcoming' }); setEditId(null); refresh('tournaments');
  };
  const handleDelete = async (id) => { await api.delete(`/tournaments/${id}`); refresh('tournaments'); };

  return (
    <div className="space-y-4">
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit Tournament' : '➕ Add Tournament'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Tournament Name" className="flex-1 min-w-[180px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} required />
          <select value={form.district_id} onChange={e => setForm({ ...form, district_id: e.target.value })} className="px-4 py-2.5 text-white focus:outline-none min-w-[160px]" style={inputStyle}>
            <option value="">All Districts</option>
            {districts.map(d => <option key={d.id} value={d.id}>{d.district_name}</option>)}
          </select>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="px-4 py-2.5 text-white focus:outline-none" style={inputStyle}>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
          </select>
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: '', district_id: '', status: 'upcoming' }); }} className="px-5 py-2.5 text-white text-sm" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>
      <ItemList items={tournaments} labelKey="name" subKey={t => `${t.district?.district_name || 'All'} • ${t.status}`} onEdit={t => { setForm({ name: t.name, district_id: t.district_id || '', status: t.status }); setEditId(t.id); }} onDelete={handleDelete} />
    </div>
  );
}

function DistrictsSection() {
  const { data, refresh } = useAdminData();
  const [name, setName] = useState('');
  const [editId, setEditId] = useState(null);

  const districts = data?.districts || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/districts/${editId}`, { district_name: name });
    else await api.post('/districts', { district_name: name });
    setName(''); setEditId(null); refresh('districts');
  };
  const handleDelete = async (id) => { await api.delete(`/districts/${id}`); refresh('districts'); };

  return (
    <div className="space-y-4">
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>{editId ? '✏️ Edit District' : '➕ Add District'}</h3>
        <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
          <input value={name} onChange={e => setName(e.target.value)} placeholder="District Name" className="flex-1 min-w-[180px] px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none" style={inputStyle} required />
          <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90" style={{ background: editId ? '#7303c0' : '#ff6022', borderRadius: '10px' }}>{editId ? 'Update' : 'Add'}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setName(''); }} className="px-5 py-2.5 text-white text-sm" style={{ background: '#686678', borderRadius: '10px' }}>Cancel</button>}
        </form>
      </div>
      <ItemList items={districts} labelKey="district_name" onEdit={d => { setName(d.district_name); setEditId(d.id); }} onDelete={handleDelete} />
    </div>
  );
}

function ItemList({ items, labelKey, subKey, onEdit, onDelete }) {
  const [search, setSearch] = useState('');
  const filtered = items.filter(i => (i[labelKey] || '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white">All ({filtered.length})</h3>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." className="px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none w-40" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} />
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filtered.length === 0 && <p className="text-center py-6" style={{ color: '#686678' }}>No items found</p>}
        {filtered.map(item => (
          <div key={item.id} className="flex justify-between items-center px-4 py-3" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
            <div>
              <p className="text-white font-medium text-sm">{item[labelKey]}</p>
              {subKey && <p className="text-xs" style={{ color: '#686678' }}>{typeof subKey === 'function' ? subKey(item) : item[subKey]}</p>}
            </div>
            <div className="flex gap-1">
              <button onClick={() => onEdit(item)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:opacity-80" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc' }}>Edit</button>
              <button onClick={() => onDelete(item.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg hover:opacity-80" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
