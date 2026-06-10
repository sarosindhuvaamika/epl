import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';
import PageHero from '../components/PageHero';
import { useTheme } from '../context/ThemeContext';

export default function MatchDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark, colors } = useTheme();

  useEffect(() => { api.get(`/matches/${id}/scorecard`).then(res => setData(res.data)).finally(() => setLoading(false)); }, [id]);

  if (loading) return <Loader dark={isDark} />;
  if (!data) return <div className="text-center py-10" style={{ color: colors.textMuted }}>Match not found.</div>;

  const { match, innings } = data;

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Matches', path: '/matches' },
    { label: `${match.team_a?.team_name} vs ${match.team_b?.team_name}`, path: `/matches/${id}` },
  ];

  return (
    <div>
      <PageHero title={`${match.team_a?.team_name} vs ${match.team_b?.team_name}`} subtitle={`${match.venue} • ${match.match_date} • ${match.overs} overs`} breadcrumbs={breadcrumbs} />
      <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Match Info */}
      <div className="rounded-xl p-5 mb-6" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{
            background: match.status === 'live' ? 'rgba(236,56,188,0.15)' : match.status === 'completed' ? 'rgba(255,96,34,0.15)' : 'rgba(115,3,192,0.15)',
            color: match.status === 'live' ? '#ec38bc' : match.status === 'completed' ? '#ff6022' : colors.textSecondary
          }}>{match.status}</span>
          {match.toss_won_by && <span className="text-sm" style={{ color: colors.textSecondary }}>Toss: {match.toss_won_by === 'team_a' ? match.team_a?.team_name : match.team_b?.team_name} elected to {match.toss_decision}</span>}
          {match.winner && <span className="text-sm font-bold" style={{ color: '#ec38bc' }}>🏆 {match.winner.team_name} won</span>}
        </div>
      </div>

      {Object.keys(innings).map(inningsNum => (
        <div key={inningsNum} className="mb-6">
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Innings {inningsNum}</h2>
          {Object.keys(innings[inningsNum]).map(teamId => {
            const teamInnings = innings[inningsNum][teamId];
            const totalRuns = teamInnings.reduce((sum, p) => sum + p.runs_scored, 0);
            const totalWickets = teamInnings.filter(p => p.how_out && p.how_out !== 'not_out').length;
            return (
              <div key={teamId} className="rounded-xl p-4 mb-4" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
                <h3 className="font-bold text-lg mb-3" style={{ color: colors.text }}>{teamInnings[0]?.team?.team_name || 'Team'} - {totalRuns}/{totalWickets}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm mb-4">
                    <thead><tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                      <th className="text-left p-2" style={{ color: colors.textSecondary }}>Batter</th>
                      <th style={{ color: colors.textSecondary }}>R</th><th style={{ color: colors.textSecondary }}>B</th>
                      <th style={{ color: colors.textSecondary }}>4s</th><th style={{ color: colors.textSecondary }}>6s</th>
                      <th style={{ color: colors.textSecondary }}>SR</th><th className="text-left" style={{ color: colors.textSecondary }}>How Out</th>
                    </tr></thead>
                    <tbody>
                      {teamInnings.filter(p => p.balls_faced > 0 || p.runs_scored > 0 || p.how_out).map(p => (
                        <tr key={p.id} style={{ borderBottom: `1px solid ${isDark ? 'rgba(104,102,120,0.2)' : 'rgba(0,0,0,0.05)'}` }}>
                          <td className="p-2 font-medium" style={{ color: colors.text }}>{p.player?.name}</td>
                          <td className="text-center" style={{ color: colors.text }}>{p.runs_scored}</td>
                          <td className="text-center" style={{ color: colors.textSecondary }}>{p.balls_faced}</td>
                          <td className="text-center" style={{ color: colors.textSecondary }}>{p.fours}</td>
                          <td className="text-center" style={{ color: colors.textSecondary }}>{p.sixes}</td>
                          <td className="text-center" style={{ color: colors.textSecondary }}>{p.balls_faced ? ((p.runs_scored / p.balls_faced) * 100).toFixed(1) : '0.0'}</td>
                          <td className="text-left" style={{ color: colors.textMuted }}>{p.how_out || 'not out'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <h4 className="font-semibold mb-2" style={{ color: '#ec38bc' }}>Bowling</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead><tr style={{ borderBottom: `1px solid ${colors.cardBorder}` }}>
                      <th className="text-left p-2" style={{ color: colors.textSecondary }}>Bowler</th>
                      <th style={{ color: colors.textSecondary }}>O</th><th style={{ color: colors.textSecondary }}>M</th>
                      <th style={{ color: colors.textSecondary }}>R</th><th style={{ color: colors.textSecondary }}>W</th>
                      <th style={{ color: colors.textSecondary }}>Wd</th><th style={{ color: colors.textSecondary }}>NB</th>
                    </tr></thead>
                    <tbody>
                      {teamInnings.filter(p => p.overs_bowled > 0).map(p => (
                        <tr key={p.id + '-bowl'} style={{ borderBottom: `1px solid ${isDark ? 'rgba(104,102,120,0.2)' : 'rgba(0,0,0,0.05)'}` }}>
                          <td className="p-2 font-medium" style={{ color: colors.text }}>{p.player?.name}</td>
                          <td className="text-center" style={{ color: colors.textSecondary }}>{p.overs_bowled}</td>
                          <td className="text-center" style={{ color: colors.textSecondary }}>{p.maidens}</td>
                          <td className="text-center" style={{ color: colors.text }}>{p.runs_conceded}</td>
                          <td className="text-center" style={{ color: '#ec38bc' }}>{p.wickets_taken}</td>
                          <td className="text-center" style={{ color: colors.textMuted }}>{p.wides}</td>
                          <td className="text-center" style={{ color: colors.textMuted }}>{p.no_balls}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      ))}
      {Object.keys(innings).length === 0 && <p style={{ color: colors.textMuted }}>Scorecard not available yet.</p>}
      </div>
    </div>
  );
}
