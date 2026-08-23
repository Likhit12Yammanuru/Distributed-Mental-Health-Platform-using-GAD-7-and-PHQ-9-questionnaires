import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [gadQuestions, setGadQuestions] = useState([]);
  const [phqQuestions, setPhqQuestions] = useState([]);
  const [gadAnswers, setGadAnswers] = useState([]);
  const [phqAnswers, setPhqAnswers] = useState([]);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const gadRes = await axios.get('http://localhost:4000/api/gad-questions');
        const phqRes = await axios.get('http://localhost:4000/api/phq-questions');
        setGadQuestions(gadRes.data);
        setPhqQuestions(phqRes.data);
        setGadAnswers(new Array(gadRes.data.length).fill(0));
        setPhqAnswers(new Array(phqRes.data.length).fill(0));
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const handleAnswerChange = (value) => {
    const val = parseInt(value);
    if (step < gadQuestions.length) {
      const newAnswers = [...gadAnswers];
      newAnswers[step] = val;
      setGadAnswers(newAnswers);
    } else {
      const phqIndex = step - gadQuestions.length;
      const newAnswers = [...phqAnswers];
      newAnswers[phqIndex] = val;
      setPhqAnswers(newAnswers);
    }
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/calculate-results', {
        gadScores: gadAnswers,
        phqScores: phqAnswers,
      });
      setResults(res.data);
    } catch (error) {
      console.error('Error calculating results:', error);
    }
  };

  if (loading) return <div>Loading questions...</div>;

  const totalSteps = gadQuestions.length + phqQuestions.length;

  return (
    <div className="chatbot-container" style={{ maxWidth: 600, margin: '0 auto', padding: '20px' }}>
      {!results ? (
        <>
          {step < totalSteps ? (
            <div>
              <h2>{step < gadQuestions.length ? 'GAD-7' : 'PHQ-9'} Question {step + 1}</h2>
              <p>
                {step < gadQuestions.length
                  ? gadQuestions[step].question
                  : phqQuestions[step - gadQuestions.length].question}
              </p>
              <select
                key={step} // 🔑 Fix: allows same values in different questions
                onChange={(e) => handleAnswerChange(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select your answer</option>
                <option value={0}>Not at all (0)</option>
                <option value={1}>Several days (1)</option>
                <option value={2}>More than half the days (2)</option>
                <option value={3}>Nearly every day (3)</option>
              </select>
            </div>
          ) : (
            <div>
              <h2>Submit your responses</h2>
              <button onClick={handleSubmit}>Submit</button>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2>Your Mental Health Results</h2>
          <p><strong>GAD-7 Total Score:</strong> {results.gadTotal}</p>
          <p><strong>GAD-7 Severity:</strong> {results.gadSeverity}</p>

          <p><strong>PHQ-9 Total Score:</strong> {results.phqTotal}</p>
          <p><strong>PHQ-9 Severity:</strong> {results.phqSeverity}</p>

          <hr />
          <p><strong>Combined Recommendation:</strong></p>
          <p>{results.recommendation}</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
