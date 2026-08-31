# Distributed-Mental-Health-Platform-using-GAD-7-and-PHQ-9-questionnaires
Developed a distributed web-based mental health assessment platform using React.js, Node.js, and Express.js microservices for PHQ-9 and GAD-7 screening. Implemented RESTful APIs, stateless architecture, instant severity classification, and a CSV-based recommendation engine while ensuring privacy through secure, PII-free browser-based processing.

Frontend:

cd frontend
npm install
npm run dev

Questionnaire service:

cd backend/questionnaire-service
node index.js

Result service:

cd services/result-service
node index.js
