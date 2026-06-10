import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';

const VisitorContext = createContext();

export function VisitorProvider({ children }) {
  const [totalVisits, setTotalVisits] = useState(0);
  const [liveVisitors, setLiveVisitors] = useState(1);
  const [pageViews, setPageViews] = useState({});
  const location = useLocation();
  const sessionIdRef = useRef(null);

  // Generate stable session ID
  useEffect(() => {
    let id = sessionStorage.getItem('epl_session_id');
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem('epl_session_id', id);
    }
    sessionIdRef.current = id;
  }, []);

  // Fetch stats from backend
  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/stats');
      setTotalVisits(res.data.total_visits);
      setLiveVisitors(res.data.live_visitors);
      setPageViews(res.data.page_views);
    } catch (e) {}
  }, []);

  // Initial stats fetch
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Track page visit on navigation
  useEffect(() => {
    const sessionId = sessionIdRef.current;
    if (!sessionId) return;

    const path = location.pathname;

    // Send to backend
    api.post('/track', { page_path: path, session_id: sessionId }).then(() => {
      fetchStats();
    }).catch(() => {});
  }, [location.pathname, fetchStats]);

  // Heartbeat for live visitor tracking
  useEffect(() => {
    const sendHeartbeat = () => {
      const sessionId = sessionIdRef.current;
      if (!sessionId) return;
      api.post('/heartbeat', { session_id: sessionId }).catch(() => {});
    };

    // Initial heartbeat
    sendHeartbeat();

    // Every 10 seconds
    const interval = setInterval(() => {
      sendHeartbeat();
      fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchStats]);

  const getPageViews = useCallback((path) => {
    return pageViews[path] || 0;
  }, [pageViews]);

  return (
    <VisitorContext.Provider value={{ totalVisits, liveVisitors, pageViews, getPageViews }}>
      {children}
    </VisitorContext.Provider>
  );
}

export const useVisitors = () => useContext(VisitorContext);
