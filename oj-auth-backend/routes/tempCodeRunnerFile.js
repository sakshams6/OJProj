require('dotenv').config(); 

const express = require('express');
const axios = require('axios');
const router = express.Router();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY in .env file!');
}

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';


router.post('/get-hint', async (req, res) => {
  const { problemTitle, problemDescription, userCode } = req.body;

  const prompt = `You're an expert competitive programming assistant.
Provide a helpful hint to solve the following problem **without revealing the full solution**.

Title: ${problemTitle}
Description:
${problemDescription}

${userCode ? `User's current code:\n${userCode}` : ''}
Hint:`;

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        }
      }
    );

    const hint = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No hint generated.';
    res.json({ hint });
  } catch (err) {
    console.error('❌ Hint Error:', err?.response?.data || err.message);
    res.status(500).json({ hint: '❌ Failed to generate hint from Gemini.' });
  }
});


router.post('/code-review', async (req, res) => {
  const { code, language } = req.body;

  const prompt = `You're an expert programming assistant.
Please review the following ${language} code and provide constructive feedback.

Code:
${code}

Review:`;  

  try {
    const response = await axios.post(
      GEMINI_URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY
        }
      }
    );

    const review = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No review generated.';
    res.json({ review });
  } catch (err) {
    console.error('❌ Review Error:', err?.response?.data || err.message);
    res.status(500).json({ review: '❌ Failed to generate code review from Gemini.' });
  }
});

module.exports = router;
