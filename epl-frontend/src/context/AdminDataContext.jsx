import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api';

const AdminDataContext = createContext();

export function AdminDataProvider({ children }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const loadAll = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    try {
      const res = await api.get('/admin/data');
      setData(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(() => {
    api.get('/admin/data').then(res => {
      setData(res.data);
    });
  }, []);

  const withLoading = useCallback(async (fn) => {
    setActionLoading(true);
    try {
      return await fn();
    } finally {
      setActionLoading(false);
    }
  }, []);

  return (
    <AdminDataContext.Provider value={{ data, loading, actionLoading, loadAll, refresh, withLoading }}>
      {children}
    </AdminDataContext.Provider>
  );
}

export const useAdminData = () => useContext(AdminDataContext);
