import { useEffect, useState } from 'react';
import api from '../api';
import Loader from '../components/Loader';
import PageHero from '../components/PageHero';
import { useTheme } from '../context/ThemeContext';

export default function PointsTable() {
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark, colors } = useTheme();

  useEffect(() => {
    Promise.all([api.get('/matches'), api.get('/teams')])
      .then(([mRes, tRes]) => { setMatches(mRes.data); setTeams(tRes.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader dark={isDark} />;

  // Calculate points: Win = 2pts, Loss = 0, No Result = 1
  const standings = teams.map(team => {
    const teamMatches = matches.filter(m => m.status === 'completed' && (m.team_a_id === team.id || m.team_b_id === team.id));
    const wins = teamMatches.filter(m => m.winner_team_id === team.id).length;
    const losses = teamMatches.filter(m => m.winner_team_id && m.winner_team_id !== team.id).length;
    const noResult = teamMatches.filter(m => !m.winner_team_id).length;
    const points = wins * 2 + noResult;
    return { ...team, played: teamMatches.length, wins, losses, noResult, points };
  }).filter(t => t.played > 0).sort((a, b) => b.points - a.points || b.wins - a.wins);

  return (
    <div>
      <PageHero />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {standings.length === 0 ? (
          <p style={{ color: colors.textMuted }}>No completed matches yet to generate points table.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: `1.5px solid ${colors.cardBorder}` }}>
                  <th className="text-left p-4 font-semibold" style={{ color: colors.textSecondary }}>#</th>
                  <th className="text-left p-4 font-semibold" style={{ color: colors.textSecondary }}>Team</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>P</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>W</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>L</th>
                  <th className="text-center p-4 font-semibold" style={{ color: colors.textSecondary }}>NR</th>
                  <th className="text-center p-4 font-semibold" style={{ color: '#ec38bc' }}>Pts</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((team, i) => (
                  <tr key={team.id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(104,102,120,0.2)' : 'rgba(0,0,0,0.05)'}` }}>
                    <td className="p-4 font-bold" style={{ color: i < 4 ? '#ec38bc' : colors.textMuted }}>{i + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)' }}>{team.team_name?.charAt(0)}</span>
                        <span className="font-medium" style={{ color: colors.text }}>{team.team_name}</span>
                      </div>
                    </td>
                    <td className="text-center p-4" style={{ color: colors.textSecondary }}>{team.played}</td>
                    <td className="text-center p-4 font-medium" style={{ color: '#22c55e' }}>{team.wins}</td>
                    <td className="text-center p-4" style={{ color: '#ff6022' }}>{team.losses}</td>
                    <td className="text-center p-4" style={{ color: colors.textMuted }}>{team.noResult}</td>
                    <td className="text-center p-4 font-bold" style={{ color: '#ec38bc' }}>{team.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
