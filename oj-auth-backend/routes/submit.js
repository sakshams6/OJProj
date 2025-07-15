require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');
const problems = require('../data/problems');
const authMiddleware = require('../middleware/authmiddleware');
const User = require('../models/user');
const compilerUrl = process.env.COMPILER_URL || 'http://compiler-service:6000';

router.post('/', authMiddleware, async (req, res) => {
  console.log('📥 Submission received:', req.body);
  const { code, problemId, language = 'cpp' } = req.body;
  const userId = req.user.id;

  if (!code) return res.status(400).json({ success: false, msg: 'Code is required' });
  if (!problemId) return res.status(400).json({ success: false, msg: 'Problem ID is required' });
  if (!problems[problemId]) return res.status(400).json({ success: false, msg: `Problem ${problemId} not found` });

  const testCases = problems[problemId].testCases;

  try {
    
    const response = await axios.post(`${compilerUrl}/compile`, {
  code,
  language,
  testCases
});

    const { results, allPassed } = response.data;

    
    try {
      await User.findByIdAndUpdate(userId, {
        $push: {
          submissions: {
            problemId,
            code,
            result: allPassed ? 'Passed' : 'Failed',
            timestamp: new Date(),
            details: results
          }
        }
      });
    } catch (saveErr) {
      console.error('⚠️ Error saving submission:', saveErr);
    }

    return res.status(200).json({
      success: true,
      passed: results.filter(r => r.passed).length,
      total: results.length,
      details: results,
      allPassed
    });

  } catch (err) {
    console.error('🔥 Error calling compiler-service:', err.message);
    return res.status(500).json({ success: false, msg: 'Internal Error (compiler)' });
  }
});

module.exports = router;
