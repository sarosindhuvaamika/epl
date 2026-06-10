import PageHero from '../components/PageHero';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { colors } = useTheme();

  return (
    <div>
      <PageHero />
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* About Section */}
        <div className="p-6 rounded-xl" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.text }}>About EPL</h2>
          <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
            The Exterro Premier League (EPL) is a corporate cricket tournament that brings together employees from various districts to compete in the spirit of sportsmanship and camaraderie. Founded with the vision of promoting fitness and team bonding, EPL has grown into one of the most anticipated events in the Exterro calendar.
          </p>
        </div>

        {/* Mission */}
        <div className="p-6 rounded-xl" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(115,3,192,0.08)' }}>
              <span className="text-2xl block mb-2">🤝</span>
              <h3 className="font-semibold text-sm mb-1" style={{ color: colors.text }}>Team Bonding</h3>
              <p className="text-xs" style={{ color: colors.textMuted }}>Strengthening relationships across teams and departments</p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(236,56,188,0.08)' }}>
              <span className="text-2xl block mb-2">🏃</span>
              <h3 className="font-semibold text-sm mb-1" style={{ color: colors.text }}>Fitness</h3>
              <p className="text-xs" style={{ color: colors.textMuted }}>Promoting physical activity and healthy competition</p>
            </div>
            <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(255,96,34,0.08)' }}>
              <span className="text-2xl block mb-2">🌟</span>
              <h3 className="font-semibold text-sm mb-1" style={{ color: colors.text }}>Excellence</h3>
              <p className="text-xs" style={{ color: colors.textMuted }}>Inspiring everyone to bring their best on and off the field</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="p-6 rounded-xl" style={{ background: colors.card, border: `1.5px solid ${colors.cardBorder}` }}>
          <h2 className="text-xl font-bold mb-3" style={{ color: colors.text }}>Contact Us</h2>
          <div className="space-y-2 text-sm" style={{ color: colors.textSecondary }}>
            <p>📧 Email: epl@exterro.com</p>
            <p>📍 Location: Exterro, India</p>
            <p>🌐 Website: www.exterro.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
