import { useEffect, useState } from 'react';
import api from '../api';
import Loader from '../components/Loader';
import PageHero from '../components/PageHero';
import { useTheme } from '../context/ThemeContext';

export default function Stats() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark, colors } = useTheme();
  const [activeTab, setActiveTab] = useState('batting');

  useEffect(() => {
    api.get('/matches').then(res => {
      // Fetch scorecards for completed matches
      const completed = res.data.filter(m => m.status === 'completed');
      Promise.all(completed.map(m => api.get(`/matches/${m.id}/scorecard`)))
        .then(results => setMatches(results.map(r => r.data)))
        .finally(() => setLoading(false));
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <Loader dark={isDark} />;

  // Aggregate player stats
  const playerStats = {};
  matches.forEach(({ innings }) => {
    Object.values(innings).forEach(teamInnings => {
      Object.values(teamInnings).forEach(players => {
        players.forEach(p => {
          if (!playerStats[p.player_id]) {
            playerStats[p.player_id] = { name: p.player?.name, team: p.team?.team_name, runs: 0, balls: 0, wickets: 0, overs: 0, catches: 0, stumpings: 0, runOuts: 0, innings: 0 };
          }
          const s = playerStats[p.player_id];
          s.runs += p.runs_scored;
          s.balls += p.balls_faced;
          s.wickets += p.wickets_taken;
          s.overs += parseFloat(p.overs_bowled) || 0;
          s.catches += p.catches;
          s.stumpings += p.stumpings;
          s.runOuts += p.run_outs;
          if (p.runs_scored > 0 || p.balls_faced > 0) s.innings++;
        });
      });
    });
  });

  const allPlayers = Object.values(playerStats);
  const topBatsmen = [...allPlayers].filter(p => p.runs > 0).sort((a, b) => b.runs - a.runs).slice(0, 10);
  const topBowlers = [...allPlayers].filter(p => p.wickets > 0).sort((a, b) => b.wickets - a.wickets).slice(0, 10);
  const topFielders = [...allPlayers].filter(p => (p.catches + p.stumpings + p.runOuts) > 0).sort((a, b) => (b.catches + b.stumpings + b.runOuts) - (a.catches + a.stumpings + a.runOuts)).slice(0, 10);

  const tabs = [
    { key: 'batting', label: '🏏 Batting' },
    { key: 'bowling', label: '⚾ Bowling' },
    { key: 'fielding', label: '🧤 Fielding' },
  ];

  return (
    <div>
      <PageHero />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className="px-4 py-2 text-sm font-medium rounded-lg transition-all" style={{
              background: activeTab === tab.key ? 'linear-gradient(135deg, #7303c0, #ec38bc)' : colors.card,
              color: activeTab === tab.key ? 'white' : colors.textSecondary,
              border: activeTab === tab.key ? 'none' : `1.5px solid ${colors.cardBorder}`,
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        {allPlayers.length === 0 ? (
          <p style={{ color: colors.textMuted }}>No match data available yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
            {activeTab === 'batting' && (
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: `1.5px solid ${colors.cardBorder}` }}>
                  <th className="text-left p-4 font-semibold" style={{ color: colors.textSecondary }}>#</th>
                  <th className="text-left p-4 font-semibold" style={{ color: colors.textSecondary }}>Player</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>Inn</th>
                  <th className="text-center p-4 font-semibold" style={{ color: '#ec38bc' }}>Runs</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>Balls</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>SR</th>
                </tr></thead>
                <tbody>
                  {topBatsmen.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${isDark ? 'rgba(104,102,120,0.2)' : 'rgba(0,0,0,0.05)'}` }}>
                      <td className="p-4 font-bold" style={{ color: i < 3 ? '#ff6022' : colors.textMuted }}>{i + 1}</td>
                      <td className="p-4"><span className="font-medium" style={{ color: colors.text }}>{p.name}</span><br /><span className="text-xs" style={{ color: colors.textMuted }}>{p.team}</span></td>
                      <td className="text-center p-4" style={{ color: colors.textSecondary }}>{p.innings}</td>
                      <td className="text-center p-4 font-bold" style={{ color: '#ec38bc' }}>{p.runs}</td>
                      <td className="text-center p-4" style={{ color: colors.textSecondary }}>{p.balls}</td>
                      <td className="text-center p-4" style={{ color: colors.textSecondary }}>{p.balls ? ((p.runs / p.balls) * 100).toFixed(1) : '0.0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'bowling' && (
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: `1.5px solid ${colors.cardBorder}` }}>
                  <th className="text-left p-4 font-semibold" style={{ color: colors.textSecondary }}>#</th>
                  <th className="text-left p-4 font-semibold" style={{ color: colors.textSecondary }}>Player</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>Overs</th>
                  <th className="text-center p-4 font-semibold" style={{ color: '#ec38bc' }}>Wickets</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>Econ</th>
                </tr></thead>
                <tbody>
                  {topBowlers.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${isDark ? 'rgba(104,102,120,0.2)' : 'rgba(0,0,0,0.05)'}` }}>
                      <td className="p-4 font-bold" style={{ color: i < 3 ? '#ff6022' : colors.textMuted }}>{i + 1}</td>
                      <td className="p-4"><span className="font-medium" style={{ color: colors.text }}>{p.name}</span><br /><span className="text-xs" style={{ color: colors.textMuted }}>{p.team}</span></td>
                      <td className="text-center p-4" style={{ color: colors.textSecondary }}>{p.overs.toFixed(1)}</td>
                      <td className="text-center p-4 font-bold" style={{ color: '#ec38bc' }}>{p.wickets}</td>
                      <td className="text-center p-4" style={{ color: colors.textSecondary }}>{p.overs > 0 ? ((p.runs || 0) / p.overs).toFixed(2) : '0.00'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'fielding' && (
              <table className="w-full text-sm">
                <thead><tr style={{ borderBottom: `1.5px solid ${colors.cardBorder}` }}>
                  <th className="text-left p-4 font-semibold" style={{ color: colors.textSecondary }}>#</th>
                  <th className="text-left p-4 font-semibold" style={{ color: colors.textSecondary }}>Player</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>Catches</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>Stumpings</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>Run Outs</th>
                  <th className="text-center p-4 font-semibold" style={{ color: '#ec38bc' }}>Total</th>
                </tr></thead>
                <tbody>
                  {topFielders.map((p, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${isDark ? 'rgba(104,102,120,0.2)' : 'rgba(0,0,0,0.05)'}` }}>
                      <td className="p-4 font-bold" style={{ color: i < 3 ? '#ff6022' : colors.textMuted }}>{i + 1}</td>
                      <td className="p-4"><span className="font-medium" style={{ color: colors.text }}>{p.name}</span><br /><span className="text-xs" style={{ color: colors.textMuted }}>{p.team}</span></td>
                      <td className="text-center p-4" style={{ color: colors.textSecondary }}>{p.catches}</td>
                      <td className="text-center p-4" style={{ color: colors.textSecondary }}>{p.stumpings}</td>
                      <td className="text-center p-4" style={{ color: colors.textSecondary }}>{p.runOuts}</td>
                      <td className="text-center p-4 font-bold" style={{ color: '#ec38bc' }}>{p.catches + p.stumpings + p.runOuts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
