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
  const { code, problemId, language = 'cpp' } = req.body;
  const userId = req.user.id;

  if (!code) return res.status(400).json({ success: false, msg: 'Code is required' });
  if (!problemId) return res.status(400).json({ success: false, msg: 'Problem ID is required' });
  if (!problems[problemId]) return res.status(400).json({ success: false, msg: `Problem ${problemId} not found` });

  const ext = language === 'python' ? 'py' : 'cpp';
  const filename = `temp_${uuid()}.${ext}`;
  const tempDir = path.join(__dirname, '../temp');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

  const filepath = path.join(tempDir, filename);
  const binary = `${filepath}.out`;
  const testCases = problems[problemId].testCases;

  try {
    fs.writeFileSync(filepath, code);

    if (language === 'cpp') {
      const compileCmd = `g++ -std=c++11 "${filepath}" -o "${binary}"`;
      exec(compileCmd, async (err, stdout, stderr) => {
        if (err) {
          fs.unlinkSync(filepath);
          return res.status(200).json({ success: false, output: '❌ Compilation Error:\n' + stderr });
        }

        const results = await runTestCases(`${binary}`, testCases, filepath, true);
        handleResults(results, userId, problemId, code, filepath, binary, res);
      });
    } else if (language === 'python') {
      const results = await runTestCases(`python3 "${filepath}"`, testCases, filepath, false);
      handleResults(results, userId, problemId, code, filepath, null, res);
    } else {
      return res.status(400).json({ success: false, msg: 'Unsupported language' });
    }

  } catch (err) {
    console.error('🔥 Internal Error:', err);
    return res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
});

async function runTestCases(executable, testCases, filepath, isCompiled) {
  let allPassed = true;
  let results = [];

  for (let i = 0; i < testCases.length; i++) {
    const input = testCases[i].input;
    const expected = testCases[i].output.trim();
    const inputFilePath = `${filepath}_input.txt`;
    fs.writeFileSync(inputFilePath, input);

    try {
      const execCmd = `${executable} < "${inputFilePath}"`;
      const { stdout } = await execShell(execCmd);
      const cleanedOutput = stdout.trim();
      const passed = cleanedOutput === expected;
      if (!passed) allPassed = false;

      results.push({ input, expected, output: cleanedOutput, passed });
    } catch (err) {
      results.push({ input, expected, output: '❌ Runtime Error', passed: false });
      allPassed = false;
    }

    if (fs.existsSync(inputFilePath)) fs.unlinkSync(inputFilePath);
  }

  return { results, allPassed };
}

async function handleResults({ results, allPassed }, userId, problemId, code, filepath, binary, res) {
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
          details: results
        }
      }
    });
  } catch (saveErr) {
    console.error('⚠️ Error saving submission:', saveErr);
  }

 
  if (fs.existsSync(filepath)) fs.unlinkSync(filepath);
  if (binary && fs.existsSync(binary)) fs.unlinkSync(binary);

  return res.status(200).json({
    success: true,
    passed: passedCount,
    total: totalCount,
    details: results,
    allPassed
  });
}

function execShell(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 5000 }, (err, stdout, stderr) => {
      if (err) return reject({ err, stderr });
      resolve({ stdout, stderr });
    });
  });
}

module.exports = router;
