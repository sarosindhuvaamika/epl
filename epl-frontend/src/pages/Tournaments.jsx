import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Loader from '../components/Loader';
import PageHero from '../components/PageHero';
import { useTheme } from '../context/ThemeContext';

export default function Tournaments() {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark, colors } = useTheme();

  useEffect(() => { api.get('/tournaments').then(res => setTournaments(res.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <Loader dark={isDark} />;

  return (
    <div>
      <PageHero />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tournaments.map(t => (
          <Link key={t.id} to={`/tournaments/${t.id}`} className="p-5 rounded-xl transition-all hover:scale-[1.02]" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
            <h3 className="font-bold text-lg" style={{ color: colors.text }}>{t.name}</h3>
            <p className="text-sm" style={{ color: colors.textMuted }}>{t.district?.district_name || 'All Districts'}</p>
            <p className="text-sm" style={{ color: colors.textMuted }}>{t.start_date} - {t.end_date}</p>
            <span className="text-xs px-2.5 py-1 rounded-full mt-3 inline-block font-medium" style={{
              background: t.status === 'ongoing' ? 'rgba(236,56,188,0.15)' : t.status === 'completed' ? 'rgba(255,96,34,0.15)' : 'rgba(115,3,192,0.15)',
              color: t.status === 'ongoing' ? '#ec38bc' : t.status === 'completed' ? '#ff6022' : colors.textSecondary
            }}>
              {t.status}
            </span>
          </Link>
        ))}
        {tournaments.length === 0 && <p style={{ color: colors.textMuted }}>No tournaments created yet.</p>}
        </div>
      </div>
    </div>
  );
}
