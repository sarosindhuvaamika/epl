import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import api from '../api';
import Loader from '../components/Loader';
import { useTheme } from '../context/ThemeContext';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDark, colors } = useTheme();

  useEffect(() => {
    Promise.all([api.get('/matches'), api.get('/tournaments')])
      .then(([mRes, tRes]) => { setMatches(mRes.data); setTournaments(tRes.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader dark={isDark} />;

  const liveMatches = matches.filter(m => m.status === 'live');
  const recentMatches = matches.filter(m => m.status === 'completed').slice(-5);

  return (
    <div>
      {/* Hero Slider */}
      <div className="relative">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop={true}
          className="home-slider"
        >
          <SwiperSlide>
            <div className="relative h-[300px] md:h-[420px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7303c0 0%, #ec38bc 50%, #ff6022 100%)' }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.4) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 0%, transparent 40%)' }}></div>
              <div className="absolute top-8 right-8 w-48 h-48 md:w-72 md:h-72 rounded-full opacity-10" style={{ background: 'white' }}></div>
              <div className="relative text-center px-6">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">🏏 Exterro Premier League</h1>
                <p className="text-base md:text-xl text-white/80">Corporate Cricket at its Best</p>
                <Link to="/matches" className="inline-block mt-5 px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>View Matches →</Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative h-[300px] md:h-[420px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #03001e 0%, #7303c0 50%, #ec38bc 100%)' }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 60% 30%, rgba(255,255,255,0.3) 0%, transparent 40%), radial-gradient(circle at 20% 70%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-5" style={{ background: 'white', transform: 'translate(-30%, 40%)' }}></div>
              <div className="relative text-center px-6">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">🏆 Season 2025</h1>
                <p className="text-base md:text-xl text-white/80">Bigger, Better, More Exciting</p>
                <Link to="/tournaments" className="inline-block mt-5 px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>Explore Tournaments →</Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative h-[300px] md:h-[420px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #ff6022 0%, #ec38bc 50%, #7303c0 100%)' }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.4) 0%, transparent 40%), radial-gradient(circle at 10% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)' }}></div>
              <div className="absolute top-0 left-1/2 w-40 h-40 md:w-60 md:h-60 rounded-full opacity-10" style={{ background: 'white', transform: 'translate(-50%, -40%)' }}></div>
              <div className="relative text-center px-6">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">📊 Live Scorecard</h1>
                <p className="text-base md:text-xl text-white/80">Ball-by-ball updates in real time</p>
                <Link to="/stats" className="inline-block mt-5 px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>View Stats →</Link>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative h-[300px] md:h-[420px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #03001e 0%, #27253f 40%, #7303c0 100%)' }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)' }}></div>
              <div className="absolute bottom-0 right-0 w-56 h-56 md:w-80 md:h-80 rounded-full opacity-5" style={{ background: 'white', transform: 'translate(20%, 30%)' }}></div>
              <div className="relative text-center px-6">
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">👥 Join the Action</h1>
                <p className="text-base md:text-xl text-white/80">Register your team and compete</p>
                <Link to="/points-table" className="inline-block mt-5 px-6 py-2.5 text-sm font-medium text-white rounded-xl transition-all hover:scale-105" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)' }}>Points Table →</Link>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Live Matches */}
      {liveMatches.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ color: colors.text }}>
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: '#ec38bc' }}></span> Live Matches
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {liveMatches.map(m => (
              <Link key={m.id} to={`/matches/${m.id}`} className="block p-5 rounded-xl transition-all hover:scale-[1.02]" style={{ background: colors.card, border: `1.5px solid rgba(236,56,188,0.3)` }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold" style={{ color: colors.text }}>{m.team_a?.team_name}</span>
                  <span style={{ color: colors.textMuted }}>vs</span>
                  <span className="font-bold" style={{ color: colors.text }}>{m.team_b?.team_name}</span>
                </div>
                <p className="text-sm mt-2" style={{ color: colors.textMuted }}>{m.venue} • {m.match_date}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tournaments */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>🏆 Tournaments</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tournaments.map(t => (
            <Link key={t.id} to={`/tournaments/${t.id}`} className="block p-5 rounded-xl transition-all hover:scale-[1.02]" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
              <h3 className="font-bold text-lg" style={{ color: colors.text }}>{t.name}</h3>
              <p className="text-sm" style={{ color: colors.textMuted }}>{t.district?.district_name || 'All Districts'}</p>
              <span className="text-xs px-2.5 py-1 rounded-full mt-2 inline-block font-medium" style={{
                background: t.status === 'ongoing' ? 'rgba(236,56,188,0.15)' : t.status === 'completed' ? 'rgba(255,96,34,0.15)' : 'rgba(115,3,192,0.15)',
                color: t.status === 'ongoing' ? '#ec38bc' : t.status === 'completed' ? '#ff6022' : colors.textSecondary
              }}>
                {t.status}
              </span>
            </Link>
          ))}
        </div>
        {tournaments.length === 0 && <p style={{ color: colors.textMuted }}>No tournaments yet.</p>}
      </section>

      {/* Recent Matches */}
      <section>
        <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>📋 Recent Matches</h2>
        <div className="space-y-3">
          {recentMatches.map(m => (
            <Link key={m.id} to={`/matches/${m.id}`} className="block p-4 rounded-xl transition-all hover:scale-[1.01]" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
              <div className="flex justify-between items-center">
                <span className="font-semibold" style={{ color: colors.text }}>{m.team_a?.team_name} vs {m.team_b?.team_name}</span>
                <span className="text-sm font-medium" style={{ color: '#ec38bc' }}>{m.winner?.team_name ? `🏆 ${m.winner.team_name}` : 'No result'}</span>
              </div>
              <p className="text-sm" style={{ color: colors.textMuted }}>{m.tournament?.name} • {m.match_date}</p>
            </Link>
          ))}
          {recentMatches.length === 0 && <p style={{ color: colors.textMuted }}>No matches played yet.</p>}
        </div>
      </section>
      </div>
    </div>
  );
}
