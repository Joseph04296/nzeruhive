const pool = require('./db');
const Q = (q, options, answer) => ({ q, options, answer });
const courses = [
  { title: 'Safe medication administration', category: 'Patient safety', description: 'The five rights, allergy checks and recording, for safer medicine rounds.',
    lessons: [
      ['The five rights', 'Before giving any medicine, confirm the right patient, right drug, right dose, right route and right time.\n\nCheck the patient\'s name and identification and read the label every time, not just the first time.'],
      ['Allergies and high-risk medicines', 'Ask about allergies and check the chart before every new medicine.\n\nTake extra care with high-risk medicines such as insulin, anticoagulants and injectable potassium. Use a second check where your facility requires it, and never guess a dose.'],
      ['Record and report', 'Record each dose immediately after giving it, never before.\n\nIf you make an error or a patient has a reaction, look after the patient first, then report it to your supervisor and document it. Reporting errors helps prevent the next one.']],
    questions: [Q('Which of these is one of the five rights?', ['Right patient', 'Right colour', 'Right shift'], 0), Q('When should you record a dose?', ['Before giving it', 'Immediately after giving it', 'At the end of the week'], 1), Q('You are unsure about a dose. What do you do?', ['Give the usual dose', 'Stop and check with the prescriber or pharmacist', 'Ask another patient'], 1)] },
  { title: 'TB basics for frontline staff', category: 'Infectious disease', description: 'How TB spreads, how to spot possible cases, and how to protect yourself and others.',
    lessons: [
      ['How TB spreads', 'TB spreads through the air when a person with active lung TB coughs, speaks or sings. It is not spread by sharing plates or by touch.\n\nPeople with HIV, malnutrition or diabetes, and close contacts of a TB patient, are at higher risk.'],
      ['Recognising possible TB', 'Common symptoms are cough, fever, night sweats and weight loss. Ask every patient about these symptoms.\n\nRefer anyone with symptoms for testing, following your national TB guidelines. A chest X-ray can help screening, but diagnosis needs confirmatory testing.'],
      ['Protecting yourself and others', 'Keep windows and doors open for ventilation. Ask coughing patients to cover their mouth or wear a mask, and separate suspected TB patients from others in waiting areas.\n\nWear a respirator (such as an N95) when caring for people with infectious TB.']],
    questions: [Q('How does TB mainly spread?', ['Through the air', 'By sharing cups', 'By handshakes'], 0), Q('Which are common TB symptoms?', ['Cough, fever, night sweats, weight loss', 'Only a rash', 'Only a headache'], 0), Q('What helps protect staff and patients?', ['Closing all windows', 'Good ventilation', 'Crowding the waiting area'], 1)] },
  { title: 'AI in healthcare: the basics', category: 'Digital health', description: 'What AI tools can and cannot do, and how to use their results carefully.',
    lessons: [
      ['What AI can and cannot do', 'Healthcare AI tools find patterns in large sets of data, such as chest X-rays. They can flag possible findings quickly, but they do not understand the patient.\n\nThey support clinicians. They do not replace clinical judgement.'],
      ['Using AI results carefully', 'Treat an AI result as one input, alongside history, examination and other tests.\n\nAI can be wrong: a false positive flags disease that is not there, and a false negative misses disease that is. It may perform worse on patients unlike the data it learned from. If a result does not fit the patient, question it.'],
      ['Privacy and responsibility', 'Protect patient data used with AI tools: share only what is needed and follow your facility\'s data rules. Never put identifiable patient information into public tools.\n\nThe clinician remains responsible for decisions.']],
    questions: [Q('How should an AI result be treated?', ['As the final diagnosis', 'As one input alongside clinical judgement', 'As always correct'], 1), Q('What is a false negative?', ['Missing disease that is present', 'Flagging disease that is not there', 'A correct result'], 0), Q('Can you put identifiable patient data into a public AI tool?', ['Yes, it is fine', 'No, never', 'Only at weekends'], 1)] }
];
(async () => {
  for (const c of courses) {
    if ((await pool.query('select 1 from courses where title=$1', [c.title])).rowCount) continue;
    const { rows: [r] } = await pool.query('insert into courses(title,description,category,questions) values($1,$2,$3,$4) returning id', [c.title, c.description, c.category, JSON.stringify(c.questions)]);
    for (const [i, l] of c.lessons.entries()) await pool.query('insert into lessons(course_id,position,title,body) values($1,$2,$3,$4)', [r.id, i + 1, l[0], l[1]]);
  }
  console.log('Courses added'); process.exit();
})();
