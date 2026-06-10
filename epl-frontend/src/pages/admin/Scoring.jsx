import { useState } from 'react';
import api from '../../api';
import { useAdminData } from '../../context/AdminDataContext';

export default function Scoring() {
  const { data } = useAdminData();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [inningsNum, setInningsNum] = useState(1);
  const [scoreForm, setScoreForm] = useState({
    player_id: '', team_id: '', innings_number: 1,
    runs_scored: 0, balls_faced: 0, fours: 0, sixes: 0, how_out: '',
    overs_bowled: 0, maidens: 0, runs_conceded: 0, wickets_taken: 0, wides: 0, no_balls: 0,
    catches: 0, stumpings: 0, run_outs: 0
  });
  const [message, setMessage] = useState('');
  const [activeSection, setActiveSection] = useState('batting');

  const matches = (data?.matches || []).filter(m => m.status === 'live' || m.status === 'upcoming');

  const loadMatch = async (id) => {
    setSelectedMatch(id);
    const res = await api.get(`/matches/${id}`);
    setMatchData(res.data);
  };

  const handleScore = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post(`/matches/${selectedMatch}/score`, { ...scoreForm, innings_number: inningsNum });
      setMessage('Score updated successfully!');
      loadMatch(selectedMatch);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving score');
    }
  };

  const handleToss = async (e) => {
    e.preventDefault();
    const form = e.target;
    await api.put(`/matches/${selectedMatch}`, { toss_won_by: form.toss_won_by.value, toss_decision: form.toss_decision.value, status: 'live' });
    loadMatch(selectedMatch);
  };

  const handleEndMatch = async (winnerId) => {
    await api.put(`/matches/${selectedMatch}`, { winner_team_id: winnerId, status: 'completed' });
    loadMatch(selectedMatch);
  };

  // No match selected - show match picker
  if (!matchData) {
    return (
      <div className="space-y-5 pb-20 lg:pb-0">
        <div>
          <h1 className="text-xl font-bold text-white">Live Scoring</h1>
          <p className="text-xs mt-0.5" style={{ color: '#666' }}>Select a match to start scoring</p>
        </div>

        {matches.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl">🏏</span>
            <p className="text-sm mt-3 text-white/60">No live or upcoming matches</p>
            <p className="text-xs mt-1" style={{ color: '#555' }}>Schedule a match first to start scoring</p>
          </div>
        ) : (
          <div className="space-y-2">
            {matches.map(m => (
              <button key={m.id} onClick={() => loadMatch(m.id)} className="w-full p-4 rounded-xl text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${m.status === 'live' ? 'rgba(236,56,188,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: m.status === 'live' ? 'rgba(236,56,188,0.15)' : 'rgba(115,3,192,0.1)' }}>
                      <span className="text-sm">🏏</span>
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{m.team_a?.team_name} vs {m.team_b?.team_name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#555' }}>{m.match_date || 'TBD'} • {m.overs} overs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.status === 'live' && <span className="w-2 h-2 rounded-full animate-pulse bg-pink-500" />}
                    <span className="text-xs px-2 py-1 rounded-lg" style={{ background: m.status === 'live' ? 'rgba(236,56,188,0.1)' : 'rgba(115,3,192,0.1)', color: m.status === 'live' ? '#ec38bc' : '#a78bfa' }}>{m.status}</span>
                    <svg className="w-4 h-4" fill="none" stroke="#555" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const allPlayers = [...(matchData.team_a?.players || []), ...(matchData.team_b?.players || [])];
  const filteredPlayers = allPlayers.filter(p => !scoreForm.team_id || p.team_id == scoreForm.team_id);

  return (
    <div className="space-y-4 pb-20 lg:pb-0">
      {/* Back + Match Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => { setMatchData(null); setSelectedMatch(null); }} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="#888" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{matchData.team_a?.team_name} vs {matchData.team_b?.team_name}</p>
          <p className="text-xs" style={{ color: '#555' }}>{matchData.overs} overs • {matchData.venue || 'Venue TBD'}</p>
        </div>
        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg shrink-0" style={{ background: matchData.status === 'live' ? 'rgba(236,56,188,0.1)' : 'rgba(115,3,192,0.1)', color: matchData.status === 'live' ? '#ec38bc' : '#a78bfa', border: `1px solid ${matchData.status === 'live' ? 'rgba(236,56,188,0.2)' : 'rgba(115,3,192,0.2)'}` }}>
          {matchData.status === 'live' && <span className="w-1.5 h-1.5 rounded-full animate-pulse bg-pink-500" />}
          {matchData.status.toUpperCase()}
        </span>
      </div>

      {/* Toss Section */}
      {!matchData.toss_won_by && (
        <form onSubmit={handleToss} className="p-4 rounded-xl" style={{ background: 'rgba(255,96,34,0.03)', border: '1px solid rgba(255,96,34,0.15)' }}>
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <span>🪙</span> Toss
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <select name="toss_won_by" className="px-4 py-3 text-white text-sm focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} required>
              <option value="">Won by...</option>
              <option value="team_a">{matchData.team_a?.team_name}</option>
              <option value="team_b">{matchData.team_b?.team_name}</option>
            </select>
            <select name="toss_decision" className="px-4 py-3 text-white text-sm focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} required>
              <option value="bat">Elected to Bat</option>
              <option value="bowl">Elected to Bowl</option>
            </select>
            <button className="px-5 py-3 text-white text-sm font-medium rounded-xl transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #ff6022, #ec38bc)' }}>Start Match</button>
          </div>
        </form>
      )}

      {/* Innings Toggle */}
      <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        {[1, 2].map(n => (
          <button key={n} onClick={() => setInningsNum(n)} className="flex-1 py-2.5 text-sm font-medium rounded-lg transition-all"
            style={{ background: inningsNum === n ? 'linear-gradient(135deg, #7303c0, #ec38bc)' : 'transparent', color: inningsNum === n ? 'white' : '#666' }}>
            {n === 1 ? '1st' : '2nd'} Innings
          </button>
        ))}
      </div>

      {/* Score Entry */}
      <form onSubmit={handleScore} className="space-y-4">
        {/* Player Selection */}
        <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h4 className="text-xs font-semibold text-white/60 mb-3">SELECT PLAYER</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select value={scoreForm.team_id} onChange={e => setScoreForm({ ...scoreForm, team_id: e.target.value, player_id: '' })} className="px-4 py-3 text-white text-sm focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} required>
              <option value="">Select Team</option>
              <option value={matchData.team_a?.id}>{matchData.team_a?.team_name}</option>
              <option value={matchData.team_b?.id}>{matchData.team_b?.team_name}</option>
            </select>
            <select value={scoreForm.player_id} onChange={e => setScoreForm({ ...scoreForm, player_id: e.target.value })} className="px-4 py-3 text-white text-sm focus:outline-none rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} required>
              <option value="">Select Player</option>
              {filteredPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[{ key: 'batting', label: '🏏 Batting' }, { key: 'bowling', label: '⚾ Bowling' }, { key: 'fielding', label: '🧤 Fielding' }].map(s => (
            <button key={s.key} type="button" onClick={() => setActiveSection(s.key)} className="flex-1 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all"
              style={{ background: activeSection === s.key ? 'rgba(115,3,192,0.15)' : 'transparent', color: activeSection === s.key ? 'white' : '#666', border: activeSection === s.key ? '1px solid rgba(115,3,192,0.3)' : '1px solid transparent' }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Batting */}
        {activeSection === 'batting' && (
          <div className="p-4 rounded-xl space-y-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <NumberInput label="Runs" value={scoreForm.runs_scored} onChange={v => setScoreForm({ ...scoreForm, runs_scored: v })} color="#ec38bc" />
              <NumberInput label="Balls" value={scoreForm.balls_faced} onChange={v => setScoreForm({ ...scoreForm, balls_faced: v })} color="#7303c0" />
              <NumberInput label="Fours" value={scoreForm.fours} onChange={v => setScoreForm({ ...scoreForm, fours: v })} color="#ff6022" />
              <NumberInput label="Sixes" value={scoreForm.sixes} onChange={v => setScoreForm({ ...scoreForm, sixes: v })} color="#f59e0b" />
            </div>
            <div>
              <label className="text-xs font-medium block mb-2" style={{ color: '#666' }}>Dismissal</label>
              <div className="flex flex-wrap gap-2">
                {['', 'bowled', 'caught', 'lbw', 'run_out', 'stumped', 'hit_wicket', 'retired_hurt'].map(d => (
                  <button key={d} type="button" onClick={() => setScoreForm({ ...scoreForm, how_out: d })}
                    className="px-3 py-2 text-xs rounded-lg transition-all capitalize"
                    style={{ background: scoreForm.how_out === d ? 'rgba(236,56,188,0.15)' : 'rgba(255,255,255,0.02)', border: `1px solid ${scoreForm.how_out === d ? 'rgba(236,56,188,0.4)' : 'rgba(255,255,255,0.06)'}`, color: scoreForm.how_out === d ? '#ec38bc' : '#666' }}>
                    {d || 'Not Out'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Bowling */}
        {activeSection === 'bowling' && (
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <NumberInput label="Overs" value={scoreForm.overs_bowled} onChange={v => setScoreForm({ ...scoreForm, overs_bowled: v })} color="#ff6022" step="0.1" />
              <NumberInput label="Maidens" value={scoreForm.maidens} onChange={v => setScoreForm({ ...scoreForm, maidens: v })} color="#7303c0" />
              <NumberInput label="Runs" value={scoreForm.runs_conceded} onChange={v => setScoreForm({ ...scoreForm, runs_conceded: v })} color="#ec38bc" />
              <NumberInput label="Wickets" value={scoreForm.wickets_taken} onChange={v => setScoreForm({ ...scoreForm, wickets_taken: v })} color="#22c55e" />
              <NumberInput label="Wides" value={scoreForm.wides} onChange={v => setScoreForm({ ...scoreForm, wides: v })} color="#f59e0b" />
              <NumberInput label="No Balls" value={scoreForm.no_balls} onChange={v => setScoreForm({ ...scoreForm, no_balls: v })} color="#ef4444" />
            </div>
          </div>
        )}

        {/* Fielding */}
        {activeSection === 'fielding' && (
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="grid grid-cols-3 gap-3">
              <NumberInput label="Catches" value={scoreForm.catches} onChange={v => setScoreForm({ ...scoreForm, catches: v })} color="#7303c0" />
              <NumberInput label="Stumpings" value={scoreForm.stumpings} onChange={v => setScoreForm({ ...scoreForm, stumpings: v })} color="#ec38bc" />
              <NumberInput label="Run Outs" value={scoreForm.run_outs} onChange={v => setScoreForm({ ...scoreForm, run_outs: v })} color="#ff6022" />
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3">
          <button type="submit" className="flex-1 sm:flex-none px-6 py-3 text-sm font-medium text-white rounded-xl transition-all active:scale-95" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>
            💾 Save Score
          </button>
          {message && (
            <span className="text-xs px-3 py-2 rounded-lg" style={{ background: message.includes('success') ? 'rgba(34,197,94,0.1)' : 'rgba(255,96,34,0.1)', color: message.includes('success') ? '#22c55e' : '#ff6022', border: `1px solid ${message.includes('success') ? 'rgba(34,197,94,0.2)' : 'rgba(255,96,34,0.2)'}` }}>
              {message}
            </span>
          )}
        </div>
      </form>

      {/* End Match */}
      {matchData.status === 'live' && (
        <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-semibold text-white mb-3">End Match</h3>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => handleEndMatch(matchData.team_a_id)} className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all active:scale-95" style={{ background: 'rgba(115,3,192,0.2)', border: '1px solid rgba(115,3,192,0.3)' }}>
              🏆 {matchData.team_a?.team_name}
            </button>
            <button onClick={() => handleEndMatch(matchData.team_b_id)} className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium text-white rounded-xl transition-all active:scale-95" style={{ background: 'rgba(255,96,34,0.2)', border: '1px solid rgba(255,96,34,0.3)' }}>
              🏆 {matchData.team_b?.team_name}
            </button>
            <button onClick={() => handleEndMatch(null)} className="flex-1 sm:flex-none px-4 py-2.5 text-sm font-medium rounded-xl transition-all active:scale-95" style={{ color: '#888', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              🤝 No Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function NumberInput({ label, value, onChange, color, step = "1" }) {
  return (
    <div className="text-center">
      <label className="text-xs block mb-2" style={{ color: '#666' }}>{label}</label>
      <div className="flex items-center justify-center gap-1">
        <button type="button" onClick={() => onChange(Math.max(0, (+value || 0) - (step == "0.1" ? 0.1 : 1)))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg className="w-3 h-3" fill="none" stroke="#888" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
        <input type="number" step={step} value={value} onChange={e => onChange(+e.target.value)}
          className="w-12 text-center py-1.5 text-white text-sm font-bold focus:outline-none rounded-lg" style={{ background: `${color}11`, border: `1px solid ${color}33`, color }} />
        <button type="button" onClick={() => onChange((+value || 0) + (step == "0.1" ? 0.1 : 1))}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all active:scale-90" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg className="w-3 h-3" fill="none" stroke="#888" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
      </div>
    </div>
  );
}
