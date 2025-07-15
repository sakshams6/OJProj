const express = require('express');
const axios = require('axios');
require('dotenv').config();


const router = express.Router();
const COMPILER_URL = process.env.COMPILER_URL || 'http://compiler-service:6000';

router.post('/', async (req, res) => {
  const { code, input = '', language = 'cpp' } = req.body;

 
  try {
    const response = await axios.post(`${COMPILER_URL}/compile`, {
      code,
      language,
      testCases: [
        { input, output: '' } 
      ]
    });


    const { results } = response.data;

    res.status(200).json({
      success: true,
      output: results[0].output
    });

  } catch (err) {
    console.error('Error running custom input:', err.message);
    res.status(500).json({ success: false, msg: 'Failed to run code with custom input' });
  }
});

module.exports = router;
