import { useCallback, useEffect, useState } from 'react';
import { CATEGORY_TAXONOMY, slugify } from '../data/categories';
import { api } from '../services/api';

function deriveCategories(courses) {
  const counts = new Map();

  courses.forEach((course) => {
    const name = (course.category || '').trim();
    if (!name) return;
    const current = counts.get(name) || {
      id: slugify(name),
      slug: slugify(name),
      name,
      course_count: 0,
    };
    current.course_count += 1;
    counts.set(name, current);
  });

  if (counts.size) return [...counts.values()];

  // Taxonomy is known, but counts are not invented — cards simply invite browsing.
  return CATEGORY_TAXONOMY.map((category) => ({ ...category, course_count: null }));
}

export default function useHomeData() {
  const [data, setData] = useState({
    categories: [],
    courses: [],
    institutions: [],
    learningPaths: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    let home = {};
    try {
      home = await api('/home');
    } catch {
      // The aggregated endpoint is optional in this phase.
      home = {};
    }

    let courses = [];
    try {
      courses = Array.isArray(home.featured_courses)
        ? home.featured_courses
        : await api('/courses');
    } catch (requestError) {
      setError(requestError.message);
    }

    const safeCourses = Array.isArray(courses) ? courses : [];
    const categories = Array.isArray(home.categories) ? home.categories : deriveCategories(safeCourses);

    setData({
      categories,
      courses: safeCourses,
      institutions: Array.isArray(home.featured_institutions) ? home.featured_institutions : [],
      learningPaths: Array.isArray(home.learning_paths) ? home.learning_paths : [],
    });
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...data, loading, error, reload: load };
}
