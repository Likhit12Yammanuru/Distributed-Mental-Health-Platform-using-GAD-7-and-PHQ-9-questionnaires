// backend/questionnaire-service/index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 4000; // You can choose another port

// Enable CORS for cross-origin requests
app.use(cors());

// Dummy data for questionnaire (you can later update with actual questions)
const gadQuestions = require('./gad_questions.json');
const phqQuestions = require('./phq_questions.json');

// API endpoint to get GAD and PHQ questions
app.get('/api/gad-questions', (req, res) => {
  res.json(gadQuestions);
});

app.get('/api/phq-questions', (req, res) => {
  res.json(phqQuestions);
});

// Start the server
app.listen(port, () => {
  console.log(`Questionnaire service listening at http://localhost:${port}`);
});
