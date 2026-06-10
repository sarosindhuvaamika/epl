import { useEffect, useState } from 'react';
import api from '../api';
import Loader from '../components/Loader';
import PageHero from '../components/PageHero';
import { useTheme } from '../context/ThemeContext';

export default function Districts() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark, colors } = useTheme();

  useEffect(() => { api.get('/districts').then(res => setDistricts(res.data)).finally(() => setLoading(false)); }, []);

  if (loading) return <Loader dark={isDark} />;

  return (
    <div>
      <PageHero />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        {districts.map(d => (
          <div key={d.id} className="p-5 rounded-xl text-center transition-all hover:scale-[1.02]" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
            <h3 className="font-bold text-lg" style={{ color: colors.text }}>{d.district_name}</h3>
          </div>
        ))}
        {districts.length === 0 && <p style={{ color: colors.textMuted }}>No districts added yet.</p>}
        </div>
      </div>
    </div>
  );
}
