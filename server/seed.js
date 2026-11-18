const fs = require('fs'), bcrypt = require('bcryptjs'), pool = require('./db');
(async () => {
  await pool.query(fs.readFileSync(__dirname + '/schema.sql', 'utf8'));
  if (+(await pool.query('select count(*) from users')).rows[0].count === 0) {
    const h = await bcrypt.hash('Password123', 10);
    await pool.query("insert into users(name,email,password,role) values('Admin','admin@thanzilearn.mw',$1,'admin'),('Supervisor','supervisor@thanzilearn.mw',$1,'supervisor')", [h]);
  }
  if (+(await pool.query('select count(*) from courses')).rows[0].count === 0) {
    const qs = [
      { q: 'Which is one of the key moments for hand hygiene?', options: ['Before touching a patient', 'Only at the end of a shift', 'Only when hands look dirty'], answer: 0 },
      { q: 'What should you do with a used needle?', options: ['Recap it carefully', 'Put it straight into a sharps container', 'Leave it on the tray'], answer: 1 },
      { q: 'When should a sharps container be emptied or sealed?', options: ['When about three-quarters full', 'Only when overflowing', 'Never'], answer: 0 }];
    const [c] = (await pool.query("insert into courses(title,description,category,questions) values('Infection prevention basics','Hand hygiene, protective equipment and safe sharps handling for everyday clinical work.','Patient safety',$1) returning id", [JSON.stringify(qs)])).rows;
    const ls = [
      ['Hand hygiene', 'Clean hands are the single most effective way to stop infections spreading.\n\nClean your hands: before touching a patient, before a clean or aseptic procedure, after any risk of body fluid exposure, after touching a patient, and after touching things around the patient.\n\nUse alcohol-based hand rub when hands look clean, and soap and water when they are visibly dirty.'],
      ['Protective equipment (PPE)', 'Choose PPE by the risk: gloves for contact with blood or body fluids, a mask and eye protection for splashes or droplets, a gown or apron to protect clothing.\n\nPut PPE on before the task, remove it carefully afterwards without touching the outside, and clean your hands straight away.'],
      ['Safe sharps handling', 'Never recap used needles. Place sharps in a puncture-resistant container immediately after use, at the point of care.\n\nSeal and replace the container when it is about three-quarters full. Report every needle-stick injury to your supervisor right away.']];
    for (const [i, l] of ls.entries()) await pool.query('insert into lessons(course_id,position,title,body) values($1,$2,$3,$4)', [c.id, i + 1, l[0], l[1]]);
  }
  console.log('Database ready'); process.exit();
})();
