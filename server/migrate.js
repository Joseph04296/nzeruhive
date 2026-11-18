const pool = require('./db');
const skills = {
  'Infection prevention basics': ['Clean your hands at the right moments', 'Choose and remove protective equipment safely', 'Handle sharps safely'],
  'Safe medication administration': ['Apply the five rights', 'Check allergies and spot high-risk medicines', 'Record and report errors'],
  'TB basics for frontline staff': ['Explain how TB spreads', 'Recognise possible TB symptoms', 'Reduce TB risk in your workplace'],
  'AI in healthcare: the basics': ['Explain what AI tools can and cannot do', 'Question AI results before acting on them', 'Protect patient data when using AI']
};
(async () => {
  await pool.query("alter table courses add column if not exists skills jsonb not null default '[]'");
  await pool.query('alter table lessons add column if not exists duration_min int not null default 5');
  for (const [t, s] of Object.entries(skills)) await pool.query("update courses set skills=$1 where title=$2 and skills='[]'::jsonb", [JSON.stringify(s), t]);
  console.log('Migration done'); process.exit();
})();
