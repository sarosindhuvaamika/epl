import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VisitorProvider } from './context/VisitorContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import Tournaments from './pages/Tournaments';
import TournamentDetail from './pages/TournamentDetail';
import Districts from './pages/Districts';
import PointsTable from './pages/PointsTable';
import Stats from './pages/Stats';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { colors } = useTheme();

  return (
    <div className="min-h-screen" style={{ background: colors.bgGradient }}>
      {!isAdmin && (
        <div className="sticky top-0 z-50">
          <TopBar />
          <Navbar />
        </div>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/matches" element={<Matches />} />
        <Route path="/matches/:id" element={<MatchDetail />} />
        <Route path="/tournaments" element={<Tournaments />} />
        <Route path="/tournaments/:id" element={<TournamentDetail />} />
        <Route path="/districts" element={<Districts />} />
        <Route path="/points-table" element={<PointsTable />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <VisitorProvider>
            <AppLayout />
          </VisitorProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
