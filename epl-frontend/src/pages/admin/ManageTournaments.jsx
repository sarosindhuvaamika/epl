import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';
import DateInput from '../../components/DateInput';

export default function ManageTournaments() {
  const { data, refresh } = useAdminData();
  const [form, setForm] = useState({ name: '', district_id: '', start_date: '', end_date: '', status: 'upcoming' });
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);

  const tournaments = data?.tournaments || [];
  const districts = data?.districts || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) await api.put(`/tournaments/${editId}`, form);
    else await api.post('/tournaments', form);
    setForm({ name: '', district_id: '', start_date: '', end_date: '', status: 'upcoming' });
    setEditId(null);
    setShowForm(false);
    refresh('tournaments');
  };

  const handleEdit = (t) => {
    setForm({ name: t.name, district_id: t.district_id || '', start_date: t.start_date || '', end_date: t.end_date || '', status: t.status });
    setEditId(t.id);
    setShowForm(true);
  };

  const handleCancel = () => {
    setForm({ name: '', district_id: '', start_date: '', end_date: '', status: 'upcoming' });
    setEditId(null);
    setShowForm(false);
  };

  const handleDelete = async (id) => { await api.delete(`/tournaments/${id}`); refresh('tournaments'); };

  const filtered = tournaments.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  const inputStyle = { background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' };

  const statusColors = {
    upcoming: { bg: 'rgba(115,3,192,0.15)', color: '#b4b2be' },
    ongoing: { bg: 'rgba(236,56,188,0.15)', color: '#ec38bc' },
    completed: { bg: 'rgba(255,96,34,0.15)', color: '#ff6022' },
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(115,3,192,0.2)' }}>
            <span className="text-lg">🏆</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{tournaments.length}</p>
            <p className="text-xs" style={{ color: '#b4b2be' }}>Total</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(236,56,188,0.2)' }}>
            <span className="text-lg">🔴</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{tournaments.filter(t => t.status === 'ongoing').length}</p>
            <p className="text-xs" style={{ color: '#b4b2be' }}>Ongoing</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,96,34,0.2)' }}>
            <span className="text-lg">⏳</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{tournaments.filter(t => t.status === 'upcoming').length}</p>
            <p className="text-xs" style={{ color: '#b4b2be' }}>Upcoming</p>
          </div>
        </div>
        <div className="p-4 flex items-center gap-3" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(104,102,120,0.3)' }}>
            <span className="text-lg">✅</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{tournaments.filter(t => t.status === 'completed').length}</p>
            <p className="text-xs" style={{ color: '#b4b2be' }}>Completed</p>
          </div>
        </div>
      </div>

      {/* Add Button / Form Toggle */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)', borderRadius: '10px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Tournament
        </button>
      )}

      {/* Form - Slide Down */}
      {showForm && (
        <div className="overflow-hidden" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
          {/* Form Header */}
          <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1.5px solid #686678', background: 'linear-gradient(90deg, rgba(115,3,192,0.15), transparent)' }}>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs" style={{ background: editId ? '#7303c0' : '#ff6022' }}>{editId ? '✏️' : '➕'}</span>
              {editId ? 'Edit Tournament' : 'Create New Tournament'}
            </h3>
            <button onClick={handleCancel} className="text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-5">
            <div className="space-y-4">
              {/* Tournament Name */}
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#b4b2be' }}>Tournament Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. EPL Season 5 - Knockout Stage" className="w-full px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all text-sm" style={inputStyle} onFocus={e => e.target.style.borderColor = '#7303c0'} onBlur={e => e.target.style.borderColor = '#686678'} required />
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* District */}
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#b4b2be' }}>District</label>
                  <select value={form.district_id} onChange={e => setForm({ ...form, district_id: e.target.value })} className="w-full px-4 py-3 text-white focus:outline-none text-sm" style={inputStyle}>
                    <option value="">All Districts</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.district_name}</option>)}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="text-xs font-medium block mb-1.5" style={{ color: '#b4b2be' }}>Status</label>
                  <div className="flex gap-2">
                    {['upcoming', 'ongoing', 'completed'].map(s => (
                      <button key={s} type="button" onClick={() => setForm({ ...form, status: s })} className="flex-1 py-2.5 text-xs font-medium rounded-lg transition-all capitalize" style={{ background: form.status === s ? (s === 'upcoming' ? '#7303c0' : s === 'ongoing' ? '#ec38bc' : '#ff6022') : '#03001e', color: 'white', border: `1.5px solid ${form.status === s ? 'transparent' : '#686678'}`, borderRadius: '10px' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#b4b2be' }}>Duration</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs block mb-1" style={{ color: '#686678' }}>From</span>
                    <DateInput value={form.start_date} onChange={v => setForm({ ...form, start_date: v })} placeholder="Start date" />
                  </div>
                  <div>
                    <span className="text-xs block mb-1" style={{ color: '#686678' }}>To</span>
                    <DateInput value={form.end_date} onChange={v => setForm({ ...form, end_date: v })} placeholder="End date" />
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-2 mt-5 pt-4" style={{ borderTop: '1.5px solid #686678' }}>
              <button type="submit" className="px-6 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2" style={{ background: editId ? '#7303c0' : 'linear-gradient(135deg, #ff6022, #ec38bc)', borderRadius: '10px' }}>
                {editId ? '💾 Update Tournament' : '🚀 Create Tournament'}
              </button>
              <button type="button" onClick={handleCancel} className="px-6 py-2.5 text-sm font-medium hover:opacity-80 transition-all" style={{ color: '#b4b2be', background: 'transparent', border: '1.5px solid #686678', borderRadius: '10px' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white">All Tournaments ({filtered.length})</h3>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search..." className="px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none w-48" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }} />
        </div>
        <div className="space-y-2">
          {filtered.length === 0 && <p className="text-center py-8" style={{ color: '#686678' }}>No tournaments found</p>}
          {filtered.map(t => (
            <div key={t.id} className="flex flex-col sm:flex-row justify-between sm:items-center px-4 py-4 gap-2 transition-all" style={{ background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
                  <span className="text-white text-sm font-bold">🏆</span>
                </div>
                <div>
                  <p className="text-white font-medium">{t.name}</p>
                  <p className="text-xs" style={{ color: '#686678' }}>{t.district?.district_name || 'All Districts'} {t.start_date && `• ${t.start_date}`} {t.end_date && `→ ${t.end_date}`}</p>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: statusColors[t.status]?.bg, color: statusColors[t.status]?.color }}>{t.status}</span>
                <button onClick={() => handleEdit(t)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(236,56,188,0.1)', color: '#ec38bc' }}>Edit</button>
                <button onClick={() => handleDelete(t.id)} className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all hover:opacity-80" style={{ background: 'rgba(255,96,34,0.1)', color: '#ff6022' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
