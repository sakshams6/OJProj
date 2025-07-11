const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  systemInstruction: 'You are a helpful AI assistant specialized in code review and hints.',
});


router.post('/code-review', async (req, res) => {
  const { code, language } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required.' });
  }

  try {
    const prompt = `Review this ${language} code and give specific, constructive feedback: but feedback should not be more than 6-7 lines do tell time and space complexity and write the rview beautifully dont say to not use namespace std\n\n${code}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ review: text });
  } catch (err) {
    console.error('❌ Code review error:', err.message);
    res.status(500).json({ error: 'Failed to generate code review.' });
  }
});


router.post('/get-hint', async (req, res) => {
  const { problemTitle, problemDescription, userCode } = req.body;

  if (!problemTitle || !problemDescription || !userCode) {
    return res.status(400).json({ error: 'Missing required fields for hint.' });
  }

  try {
    const prompt = `
You are assisting a student with this problem.

Problem Title: ${problemTitle}

Description:
${problemDescription}

User's Code:
${userCode}

Give a helpful HINT that leads them toward the solution, but DO NOT give the full answer or fix the code do give hints but not more than 5 lines do hint them on which data structure to use write hint beautifully.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ hint: text });
  } catch (err) {
    console.error('❌ Hint generation error:', err.message);
    res.status(500).json({ error: 'Failed to generate hint.' });
  }
});

module.exports = router;
