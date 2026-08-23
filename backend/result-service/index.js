const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Load recommendations from CSV
let recommendations = [];

fs.createReadStream('recommendations_full.csv')
  .pipe(csv())
  .on('data', (data) => {
    // Normalize by trimming spaces
    recommendations.push({
      GADSeverity: data.GADSeverity.trim(),
      PHQSeverity: data.PHQSeverity.trim(),
      Recommendation: data.Recommendation.trim(),
    });
  })
  .on('end', () => {
    console.log('Recommendations loaded');
  });

app.post('/api/calculate-results', (req, res) => {
  const { gadScores, phqScores } = req.body;

  const gadTotal = gadScores.reduce((a, b) => a + b, 0);
  const phqTotal = phqScores.reduce((a, b) => a + b, 0);
  const gadSeverity = getGADSeverity(gadTotal).trim();
  const phqSeverity = getPHQSeverity(phqTotal).trim();

  // Debug log for match checking (optional)
  console.log('Looking for:', gadSeverity, '+', phqSeverity);

  // Match the normalized severities
  const match = recommendations.find(
    (row) =>
      row.GADSeverity === gadSeverity &&
      row.PHQSeverity === phqSeverity
  );

  const combinedRecommendation = match
    ? match.Recommendation
    : 'No recommendation available for this combination.';

  res.json({
    gadTotal,
    gadSeverity,
    phqTotal,
    phqSeverity,
    recommendation: combinedRecommendation,
  });
});

function getGADSeverity(score) {
  if (score <= 4) return 'Minimal Anxiety';
  if (score <= 9) return 'Mild Anxiety';
  if (score <= 14) return 'Moderate Anxiety';
  return 'Severe Anxiety';
}

function getPHQSeverity(score) {
  if (score <= 4) return 'Minimal Depression';
  if (score <= 9) return 'Mild Depression';
  if (score <= 14) return 'Moderate Depression';
  if (score <= 19) return 'Moderately Severe Depression';
  return 'Severe Depression';
}

app.listen(port, () => {
  console.log(`Result service listening at http://localhost:${port}`);
});
