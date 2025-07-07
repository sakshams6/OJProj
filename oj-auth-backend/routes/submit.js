
const express = require('express');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');
const problems = require('../data/problems');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/user'); 

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  console.log('📥 Submission received:', req.body);
  const { code, problemId } = req.body;
  const userId = req.user.id; 

  if (!code) return res.status(400).json({ success: false, msg: 'Code is required' });
  if (!problemId) return res.status(400).json({ success: false, msg: 'Problem ID is required' });
  if (!problems[problemId]) return res.status(400).json({ success: false, msg: `Problem ${problemId} not found` });

  const filename = `temp_${uuid()}.cpp`;
  const tempDir = path.join(__dirname, '../temp');

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const filepath = path.join(tempDir, filename);
  const binary = `${filepath}.out`;
  const testCases = problems[problemId].testCases;

  try {
    fs.writeFileSync(filepath, code);

    const compileCmd = `g++ -std=c++11 "${filepath}" -o "${binary}"`;
    exec(compileCmd, async (err, stdout, stderr) => {
      if (err) {
        fs.unlinkSync(filepath);
        return res.status(200).json({ success: false, output: '❌ Compilation Error:\n' + stderr });
      }

      let allPassed = true;
      let results = [];

      for (let i = 0; i < testCases.length; i++) {
        const input = testCases[i].input;
        const expected = testCases[i].output.trim();
        const inputFilePath = `${filepath}_input.txt`;
        fs.writeFileSync(inputFilePath, input);

        try {
          const execCmd = `${binary} < "${inputFilePath}"`;
          const { stdout: programOutput } = await execShell(execCmd);
          const cleanedOutput = programOutput.trim();

          const passed = cleanedOutput === expected;
          if (!passed) allPassed = false;

          results.push({ input, expected, output: cleanedOutput, passed });
        } catch (err) {
          results.push({ input, expected, output: '❌ Runtime Error', passed: false });
          allPassed = false;
        }

        if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
      }

      
      fs.unlinkSync(filepath);
      if (fs.existsSync(binary)) fs.unlinkSync(binary);

      const passedCount = results.filter(r => r.passed).length;
      const totalCount = results.length;

     
      try {
        await User.findByIdAndUpdate(userId, {
          $push: {
            submissions: {
              problemId,
              code,
              result: allPassed ? 'Passed' : 'Failed',
              timestamp: new Date(),
              details:results
            }
          }
        });
      } catch (saveErr) {
        console.error('⚠️ Error saving submission:', saveErr);
      }

      return res.status(200).json({
        success: true,
        passed: passedCount,
        total: totalCount,
        details: results,
        allPassed
      });
    });
  } catch (err) {
    console.error('🔥 Internal Error:', err);
    return res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
});

function execShell(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 5000 }, (err, stdout, stderr) => {
      if (err) return reject(stderr);
      resolve({ stdout, stderr });
    });
  });
}

module.exports = router;
