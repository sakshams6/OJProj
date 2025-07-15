const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

app.post('/compile', async (req, res) => {
  const { code, language = 'cpp', testCases = [] } = req.body;

  if (!code || !Array.isArray(testCases)) {
    return res.status(400).json({ success: false, msg: 'Invalid request' });
  }

  const id = uuid();
  const ext = language === 'python' ? 'py' : 'cpp';
  const codePath = path.join(tempDir, `${id}.${ext}`);
  const binaryPath = path.join(tempDir, `${id}.out`);

  try {
    fs.writeFileSync(codePath, code);

    let compileCmd;
    if (language === 'cpp') {
      compileCmd = `g++ -std=c++11 ${codePath} -o ${binaryPath}`;
      try {
        await execPromise(compileCmd);
      } catch (compileErr) {
        cleanup([codePath]);
        return res.status(200).json({ success: false, output: '❌ Compilation Error:\n' + compileErr.stderr });
      }
    }

    let allPassed = true;
    const results = [];

    for (const testCase of testCases) {
      const inputPath = path.join(tempDir, `${uuid()}_input.txt`);
      fs.writeFileSync(inputPath, testCase.input);

      let runCmd;
      if (language === 'cpp') {
        runCmd = `${binaryPath} < ${inputPath}`;
      } else {
        runCmd = `python3 ${codePath} < ${inputPath}`;
      }

      try {
        const { stdout } = await execPromise(runCmd);
        const cleanedOutput = stdout.trim();
        const expected = testCase.output.trim();
        const passed = cleanedOutput === expected;
        if (!passed) allPassed = false;

        results.push({
          input: testCase.input,
          expected,
          output: cleanedOutput,
          passed
        });

      } catch (runErr) {
        allPassed = false;
        results.push({
          input: testCase.input,
          expected: testCase.output,
          output: '❌ Runtime Error',
          passed: false
        });
      }

      fs.existsSync(inputPath) && fs.unlinkSync(inputPath);
    }

    cleanup([codePath, binaryPath]);

    return res.status(200).json({ success: true, results, allPassed });

  } catch (err) {
    console.error('Compiler Service Error:', err);
    cleanup([codePath, binaryPath]);
    return res.status(500).json({ success: false, msg: 'Internal error' });
  }
});

function execPromise(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { timeout: 5000 }, (err, stdout, stderr) => {
      if (err) reject({ stderr });
      else resolve({ stdout });
    });
  });
}

function cleanup(files) {
  files.forEach(file => {
    if (file && fs.existsSync(file)) fs.unlinkSync(file);
  });
}

const PORT = 6000;
app.listen(PORT, () => {
  console.log(`🧠 Compiler service running on port ${PORT}`);
});
