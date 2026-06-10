import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';
import PageHero from '../components/PageHero';
import { useTheme } from '../context/ThemeContext';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark, colors } = useTheme();

  useEffect(() => { api.get('/matches').then(res => setMatches(res.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <Loader dark={isDark} />;

  return (
    <div>
      <PageHero />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-3">
        {matches.map(m => (
          <Link key={m.id} to={`/matches/${m.id}`} className="block p-5 rounded-xl transition-all hover:scale-[1.01]" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-lg" style={{ color: colors.text }}>{m.team_a?.team_name}</span>
                <span className="mx-3" style={{ color: colors.textMuted }}>vs</span>
                <span className="font-bold text-lg" style={{ color: colors.text }}>{m.team_b?.team_name}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{
                background: m.status === 'live' ? 'rgba(236,56,188,0.15)' : m.status === 'completed' ? 'rgba(255,96,34,0.15)' : 'rgba(115,3,192,0.15)',
                color: m.status === 'live' ? '#ec38bc' : m.status === 'completed' ? '#ff6022' : colors.textSecondary
              }}>
                {m.status === 'live' && <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 animate-pulse" style={{ background: '#ec38bc' }}></span>}
                {m.status}
              </span>
            </div>
            <p className="text-sm mt-2" style={{ color: colors.textMuted }}>{m.tournament?.name} • {m.venue} • {m.match_date} • {m.overs} overs</p>
            {m.winner && <p className="text-sm mt-1 font-medium" style={{ color: '#ec38bc' }}>🏆 Winner: {m.winner.team_name}</p>}
          </Link>
        ))}
        {matches.length === 0 && <p style={{ color: colors.textMuted }}>No matches scheduled yet.</p>}
        </div>
      </div>
    </div>
  );
}
