import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AdminDataContext = createContext();

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.get('/admin/data');
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback((key) => {
    // Refresh a specific resource without full loader
    const endpoints = {
      districts: '/districts',
      teams: '/teams',
      players: '/players',
      tournaments: '/tournaments',
      matches: '/matches',
      groups: '/groups',
      venues: '/venues',
      overs: '/overs',
      matchLevels: '/match-levels',
    };
    if (endpoints[key]) {
      api.get(endpoints[key]).then(res => {
        setData(prev => prev ? { ...prev, [key]: res.data } : prev);
      });
    }
  }, []);

  return (
    <AdminDataContext.Provider value={{ data, loading, loadAll, refresh }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export const useAdminData = () => useContext(AdminDataContext);
