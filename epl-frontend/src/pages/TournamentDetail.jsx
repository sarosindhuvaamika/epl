import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';
import PageHero from '../components/PageHero';
import { useTheme } from '../context/ThemeContext';

export default function TournamentDetail() {
  const { id } = useParams();
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDark, colors } = useTheme();

  useEffect(() => { api.get(`/tournaments/${id}`).then(res => setTournament(res.data)).finally(() => setLoading(false)); }, [id]);

  if (loading) return <Loader dark={isDark} />;
  if (!tournament) return <div className="text-center py-10" style={{ color: colors.textMuted }}>Tournament not found.</div>;

  const breadcrumbs = [
    { label: 'Home', path: '/' },
    { label: 'Tournaments', path: '/tournaments' },
    { label: tournament.name, path: `/tournaments/${id}` },
  ];

  return (
    <div>
      <PageHero title={tournament.name} subtitle={`${tournament.district?.district_name || 'All Districts'} • ${tournament.start_date || ''} - ${tournament.end_date || ''}`} breadcrumbs={breadcrumbs} />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold mb-4" style={{ color: colors.text }}>Matches</h2>
      <div className="space-y-3">
        {tournament.matches?.map(m => (
          <Link key={m.id} to={`/matches/${m.id}`} className="block p-4 rounded-xl transition-all hover:scale-[1.01]" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
            <div className="flex items-center justify-between">
              <span className="font-bold" style={{ color: colors.text }}>{m.team_a?.team_name} vs {m.team_b?.team_name}</span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{
                background: m.status === 'live' ? 'rgba(236,56,188,0.15)' : m.status === 'completed' ? 'rgba(255,96,34,0.15)' : 'rgba(115,3,192,0.15)',
                color: m.status === 'live' ? '#ec38bc' : m.status === 'completed' ? '#ff6022' : colors.textSecondary
              }}>{m.status}</span>
            </div>
          </Link>
        ))}
        {(!tournament.matches || tournament.matches.length === 0) && <p style={{ color: colors.textMuted }}>No matches in this tournament.</p>}
        </div>
      </div>
    </div>
  );
}
