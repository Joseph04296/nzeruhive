export const CATEGORY_TAXONOMY = [
  { slug: 'technology', name: 'Technology' },
  { slug: 'business-finance', name: 'Business & Finance' },
  { slug: 'healthcare', name: 'Healthcare' },
  { slug: 'science-research', name: 'Science & Research' },
  { slug: 'education', name: 'Education' },
  { slug: 'agriculture', name: 'Agriculture' },
  { slug: 'engineering', name: 'Engineering' },
  { slug: 'personal-development', name: 'Personal Development' },
];

export const slugify = (value = '') =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
