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
      setMessage('✅ Score updated successfully!');
      loadMatch(selectedMatch);
    } catch (err) {
      setMessage('❌ ' + (err.response?.data?.message || 'Error saving score'));
    }
  };

  const handleToss = async (e) => {
    e.preventDefault();
    const form = e.target;
    await api.put(`/matches/${selectedMatch}`, {
      toss_won_by: form.toss_won_by.value,
      toss_decision: form.toss_decision.value,
      status: 'live'
    });
    loadMatch(selectedMatch);
  };

  const handleEndMatch = async (winnerId) => {
    await api.put(`/matches/${selectedMatch}`, { winner_team_id: winnerId, status: 'completed' });
    loadMatch(selectedMatch);
  };

  const inputStyle = { background: '#03001e', border: '1.5px solid #686678', borderRadius: '10px' };
  const smallInputStyle = { background: '#03001e', border: '1.5px solid #686678', borderRadius: '8px' };

  return (
    <div className="space-y-6">
      {/* Match Selection */}
      <div className="p-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
        <h3 className="text-sm font-semibold mb-3" style={{ color: '#ec38bc' }}>🎯 Select Match</h3>
        <select onChange={e => e.target.value && loadMatch(e.target.value)} className="w-full px-4 py-2.5 text-white focus:outline-none" style={inputStyle}>
          <option value="">Choose a match to score...</option>
          {matches.map(m => (
            <option key={m.id} value={m.id}>{m.team_a?.team_name} vs {m.team_b?.team_name} ({m.match_date}) - {m.status}</option>
          ))}
        </select>
      </div>

      {matchData && (
        <>
          {/* Match Info Card */}
          <div className="p-5" style={{ background: 'linear-gradient(135deg, rgba(115,3,192,0.2), rgba(236,56,188,0.1))', border: '1.5px solid rgba(115,3,192,0.3)', borderRadius: '10px' }}>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xl font-bold text-white">{matchData.team_a?.team_name} <span style={{ color: '#686678' }}>vs</span> {matchData.team_b?.team_name}</h3>
                <p className="text-sm mt-1" style={{ color: '#b4b2be' }}>{matchData.venue} • {matchData.overs} overs</p>
              </div>
              <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: matchData.status === 'live' ? 'rgba(236,56,188,0.2)' : 'rgba(115,3,192,0.2)', color: matchData.status === 'live' ? '#ec38bc' : '#b4b2be' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: matchData.status === 'live' ? '#ec38bc' : '#b4b2be' }}></span>
                {matchData.status.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Toss */}
          {!matchData.toss_won_by && (
            <form onSubmit={handleToss} className="p-5" style={{ background: '#27253f', border: '1.5px solid rgba(255,96,34,0.3)', borderRadius: '10px' }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: '#ff6022' }}>🪙 Toss</h3>
              <div className="flex gap-2 items-end flex-wrap">
                <div className="flex-1 min-w-[150px]">
                  <label className="text-xs block mb-1" style={{ color: '#b4b2be' }}>Toss Won By</label>
                  <select name="toss_won_by" className="w-full px-4 py-2.5 text-white focus:outline-none" style={inputStyle} required>
                    <option value="team_a">{matchData.team_a?.team_name}</option>
                    <option value="team_b">{matchData.team_b?.team_name}</option>
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="text-xs block mb-1" style={{ color: '#b4b2be' }}>Elected to</label>
                  <select name="toss_decision" className="w-full px-4 py-2.5 text-white focus:outline-none" style={inputStyle} required>
                    <option value="bat">Bat</option>
                    <option value="bowl">Bowl</option>
                  </select>
                </div>
                <button className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#ff6022', borderRadius: '10px' }}>Save Toss & Start</button>
              </div>
            </form>
          )}

          {/* Innings Toggle */}
          <div className="flex gap-2">
            <button onClick={() => setInningsNum(1)} className="px-5 py-2.5 text-sm font-medium transition-all" style={{ background: inningsNum === 1 ? 'linear-gradient(135deg, #7303c0, #ec38bc)' : '#27253f', color: 'white', border: `1.5px solid ${inningsNum === 1 ? '#ec38bc' : '#686678'}`, borderRadius: '10px' }}>1st Innings</button>
            <button onClick={() => setInningsNum(2)} className="px-5 py-2.5 text-sm font-medium transition-all" style={{ background: inningsNum === 2 ? 'linear-gradient(135deg, #7303c0, #ec38bc)' : '#27253f', color: 'white', border: `1.5px solid ${inningsNum === 2 ? '#ec38bc' : '#686678'}`, borderRadius: '10px' }}>2nd Innings</button>
          </div>

          {/* Score Entry */}
          <form onSubmit={handleScore} className="p-5 space-y-5" style={{ background: '#27253f', border: '1.5px solid #686678', borderRadius: '10px' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Update Player Score — Innings {inningsNum}</h3>
              {message && <span className="text-xs px-3 py-1 rounded-full" style={{ background: message.includes('✅') ? 'rgba(34,197,94,0.15)' : 'rgba(255,96,34,0.15)', color: message.includes('✅') ? '#22c55e' : '#ff6022' }}>{message}</span>}
            </div>

            {/* Player Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs block mb-1" style={{ color: '#b4b2be' }}>Team</label>
                <select value={scoreForm.team_id} onChange={e => setScoreForm({ ...scoreForm, team_id: e.target.value })} className="w-full px-4 py-2.5 text-white focus:outline-none" style={inputStyle} required>
                  <option value="">Select Team</option>
                  <option value={matchData.team_a?.id}>{matchData.team_a?.team_name}</option>
                  <option value={matchData.team_b?.id}>{matchData.team_b?.team_name}</option>
                </select>
              </div>
              <div>
                <label className="text-xs block mb-1" style={{ color: '#b4b2be' }}>Player</label>
                <select value={scoreForm.player_id} onChange={e => setScoreForm({ ...scoreForm, player_id: e.target.value })} className="w-full px-4 py-2.5 text-white focus:outline-none" style={inputStyle} required>
                  <option value="">Select Player</option>
                  {[...(matchData.team_a?.players || []), ...(matchData.team_b?.players || [])]
                    .filter(p => !scoreForm.team_id || p.team_id == scoreForm.team_id)
                    .map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {/* Batting */}
            <div className="p-4" style={{ background: '#03001e', borderRadius: '10px', border: '1.5px solid #686678' }}>
              <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: '#ec38bc' }}>
                <span className="w-5 h-5 rounded flex items-center justify-center text-xs" style={{ background: 'rgba(236,56,188,0.2)' }}>🏏</span> Batting
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Runs</label><input type="number" value={scoreForm.runs_scored} onChange={e => setScoreForm({ ...scoreForm, runs_scored: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Balls</label><input type="number" value={scoreForm.balls_faced} onChange={e => setScoreForm({ ...scoreForm, balls_faced: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>4s</label><input type="number" value={scoreForm.fours} onChange={e => setScoreForm({ ...scoreForm, fours: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>6s</label><input type="number" value={scoreForm.sixes} onChange={e => setScoreForm({ ...scoreForm, sixes: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>How Out</label>
                  <select value={scoreForm.how_out} onChange={e => setScoreForm({ ...scoreForm, how_out: e.target.value })} className="w-full px-2 py-1.5 text-white text-xs focus:outline-none" style={smallInputStyle}>
                    <option value="">Not Out</option>
                    <option value="bowled">Bowled</option>
                    <option value="caught">Caught</option>
                    <option value="lbw">LBW</option>
                    <option value="run_out">Run Out</option>
                    <option value="stumped">Stumped</option>
                    <option value="hit_wicket">Hit Wicket</option>
                    <option value="retired_hurt">Retired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Bowling */}
            <div className="p-4" style={{ background: '#03001e', borderRadius: '10px', border: '1.5px solid #686678' }}>
              <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: '#ff6022' }}>
                <span className="w-5 h-5 rounded flex items-center justify-center text-xs" style={{ background: 'rgba(255,96,34,0.2)' }}>⚾</span> Bowling
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Overs</label><input type="number" step="0.1" value={scoreForm.overs_bowled} onChange={e => setScoreForm({ ...scoreForm, overs_bowled: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Maidens</label><input type="number" value={scoreForm.maidens} onChange={e => setScoreForm({ ...scoreForm, maidens: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Runs</label><input type="number" value={scoreForm.runs_conceded} onChange={e => setScoreForm({ ...scoreForm, runs_conceded: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Wickets</label><input type="number" value={scoreForm.wickets_taken} onChange={e => setScoreForm({ ...scoreForm, wickets_taken: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Wides</label><input type="number" value={scoreForm.wides} onChange={e => setScoreForm({ ...scoreForm, wides: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>No Balls</label><input type="number" value={scoreForm.no_balls} onChange={e => setScoreForm({ ...scoreForm, no_balls: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
              </div>
            </div>

            {/* Fielding */}
            <div className="p-4" style={{ background: '#03001e', borderRadius: '10px', border: '1.5px solid #686678' }}>
              <h4 className="text-xs font-semibold mb-3 flex items-center gap-2" style={{ color: '#7303c0' }}>
                <span className="w-5 h-5 rounded flex items-center justify-center text-xs" style={{ background: 'rgba(115,3,192,0.2)' }}>🧤</span> Fielding
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Catches</label><input type="number" value={scoreForm.catches} onChange={e => setScoreForm({ ...scoreForm, catches: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Stumpings</label><input type="number" value={scoreForm.stumpings} onChange={e => setScoreForm({ ...scoreForm, stumpings: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
                <div><label className="text-xs block mb-1" style={{ color: '#686678' }}>Run Outs</label><input type="number" value={scoreForm.run_outs} onChange={e => setScoreForm({ ...scoreForm, run_outs: +e.target.value })} className="w-full px-2 py-1.5 text-white text-sm focus:outline-none" style={smallInputStyle} /></div>
              </div>
            </div>

            <button className="px-6 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)', borderRadius: '10px' }}>💾 Save Score</button>
          </form>

          {/* End Match */}
          {matchData.status === 'live' && (
            <div className="p-5" style={{ background: '#27253f', border: '1.5px solid rgba(255,96,34,0.3)', borderRadius: '10px' }}>
              <h3 className="text-sm font-semibold mb-3 text-white">🏁 End Match</h3>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => handleEndMatch(matchData.team_a_id)} className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#7303c0', borderRadius: '10px' }}>🏆 {matchData.team_a?.team_name} Wins</button>
                <button onClick={() => handleEndMatch(matchData.team_b_id)} className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#7303c0', borderRadius: '10px' }}>🏆 {matchData.team_b?.team_name} Wins</button>
                <button onClick={() => handleEndMatch(null)} className="px-5 py-2.5 text-white text-sm font-medium hover:opacity-90 transition-all" style={{ background: '#686678', borderRadius: '10px' }}>🤝 No Result</button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
