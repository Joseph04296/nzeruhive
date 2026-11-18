import { useCallback, useEffect, useState } from 'react';
import { api } from '../services/api';

export default function usePublicCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/courses');
      setCourses(Array.isArray(data) ? data : []);
    } catch (requestError) {
      setCourses([]);
      setError(requestError.message || 'We could not load the course catalogue.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { courses, loading, error, reload: load };
}
