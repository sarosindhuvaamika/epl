import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Register() {
  const [form, setForm] = useState({ username: '', password: '', phone_no: '' });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isDark, colors } = useTheme();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!form.username.trim()) errors.username = 'Username is required';
    else if (form.username.trim().length < 3) errors.username = 'Username must be at least 3 characters';
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (!form.phone_no.trim()) errors.phone_no = 'Phone number is required';
    else if (!/^\d{10,15}$/.test(form.phone_no.trim())) errors.phone_no = 'Enter a valid phone number (10-15 digits)';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.username, form.password, form.phone_no);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0" style={{ background: isDark ? 'transparent' : 'linear-gradient(135deg, rgba(255,96,34,0.03) 0%, rgba(115,3,192,0.05) 50%, rgba(236,56,188,0.03) 100%)' }}></div>

      {/* Animated floating shapes */}
      <div className="absolute top-16 left-16 w-64 h-64 rounded-full opacity-20 animate-pulse" style={{ background: 'linear-gradient(135deg, #ec38bc, #7303c0)', filter: 'blur(70px)' }}></div>
      <div className="absolute bottom-16 right-16 w-72 h-72 rounded-full opacity-15 animate-pulse" style={{ background: 'linear-gradient(135deg, #ff6022, #ec38bc)', filter: 'blur(80px)', animationDelay: '1.5s' }}></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10" style={{ background: 'linear-gradient(135deg, #7303c0, #ec38bc)', filter: 'blur(90px)' }}></div>

      {/* Geometric shapes */}
      <div className="absolute bottom-24 left-16 w-14 h-14 rotate-12 opacity-10" style={{ border: '2px solid #ec38bc', borderRadius: '4px' }}></div>
      <div className="absolute top-24 right-20 w-10 h-10 opacity-10" style={{ border: '2px solid #7303c0', borderRadius: '50%' }}></div>
      <div className="absolute bottom-1/3 right-12 w-16 h-16 -rotate-12 opacity-10" style={{ border: '2px solid #ff6022', borderRadius: '8px' }}></div>
      <div className="absolute top-20 left-1/3 w-8 h-8 opacity-15" style={{ background: '#7303c0', borderRadius: '50%' }}></div>
      <div className="absolute bottom-16 right-1/3 w-5 h-5 rotate-45 opacity-10" style={{ background: '#ec38bc' }}></div>
      <div className="absolute top-1/3 left-12 w-10 h-10 opacity-10" style={{ border: '2px solid #ec38bc', borderRadius: '50%' }}></div>

      {/* Cricket themed decorative elements */}
      <div className="absolute bottom-1/4 left-10 text-4xl opacity-5 -rotate-6">🏏</div>
      <div className="absolute top-1/4 right-8 text-5xl opacity-5 rotate-12">🏆</div>
      <div className="absolute bottom-12 right-1/4 text-3xl opacity-5 -rotate-12">⚾</div>

      <form onSubmit={handleSubmit} className="relative p-8 rounded-2xl w-full max-w-md" style={{ background: isDark ? colors.card : 'rgba(255,255,255,0.8)', border: `1.5px solid ${isDark ? colors.cardBorder : 'rgba(115,3,192,0.1)'}`, boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 24px 80px rgba(115,3,192,0.1), 0 8px 24px rgba(0,0,0,0.05)', backdropFilter: 'blur(16px)' }} noValidate>
        <div className="flex justify-center mb-4">
          <img src={isDark ? '/exterro.svg' : '/exterro-dark.svg'} alt="Exterro" className="h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center" style={{ color: colors.text }}>Create Account</h2>

        {error && (
          <div className="mb-4 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="text-xs font-medium block mb-1" style={{ color: colors.textSecondary }}>Username</label>
          <input
            type="text"
            placeholder="Choose a username"
            value={form.username}
            onChange={e => handleChange('username', e.target.value)}
            className="w-full rounded-lg p-3 focus:outline-none transition-colors"
            style={{ background: colors.inputBg, border: `1.5px solid ${fieldErrors.username ? '#ff6022' : colors.inputBorder}`, color: colors.text }}
            disabled={loading}
          />
          {fieldErrors.username && <p className="text-red-500 text-xs mt-1">{fieldErrors.username}</p>}
        </div>

        <div className="mb-4">
          <label className="text-xs font-medium block mb-1" style={{ color: colors.textSecondary }}>Password</label>
          <input
            type="password"
            placeholder="Min 6 characters"
            value={form.password}
            onChange={e => handleChange('password', e.target.value)}
            className="w-full rounded-lg p-3 focus:outline-none transition-colors"
            style={{ background: colors.inputBg, border: `1.5px solid ${fieldErrors.password ? '#ff6022' : colors.inputBorder}`, color: colors.text }}
            disabled={loading}
          />
          {fieldErrors.password && <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>}
        </div>

        <div className="mb-6">
          <label className="text-xs font-medium block mb-1" style={{ color: colors.textSecondary }}>Phone Number</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            value={form.phone_no}
            onChange={e => handleChange('phone_no', e.target.value)}
            className="w-full rounded-lg p-3 focus:outline-none transition-colors"
            style={{ background: colors.inputBg, border: `1.5px solid ${fieldErrors.phone_no ? '#ff6022' : colors.inputBorder}`, color: colors.text }}
            disabled={loading}
          />
          {fieldErrors.phone_no && <p className="text-red-500 text-xs mt-1">{fieldErrors.phone_no}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          style={{ background: loading ? '#686678' : 'linear-gradient(135deg, #7303c0, #ec38bc)' }}
        >
          {loading && (
            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="text-center mt-4 text-sm" style={{ color: colors.textMuted }}>
          Already have an account? <Link to="/login" className="font-medium" style={{ color: '#7303c0' }}>Sign In</Link>
        </p>
      </form>
    </div>
  );
}
