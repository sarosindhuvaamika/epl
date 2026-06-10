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
    // Refresh all data to keep relationships in sync
    api.get('/admin/data').then(res => {
      setData(res.data);
    });
  }, []);

  return (
    <AdminDataContext.Provider value={{ data, loading, loadAll, refresh }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export const useAdminData = () => useContext(AdminDataContext);
