const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');
const path = require('path');

const router = express.Router();

router.post('/', async (req, res) => {
  const { code, input = '', language = 'cpp' } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, msg: 'No code provided' });
  }

  const id = uuid();
  const tempDir = path.join(__dirname, '../temp');
  const ext = language === 'python' ? 'py' : 'cpp';
  const codePath = path.join(tempDir, `${id}.${ext}`);
  const inputPath = path.join(tempDir, `${id}.txt`);
  const outputPath = path.join(tempDir, `${id}.out`);

  try {
    fs.writeFileSync(codePath, code);
    fs.writeFileSync(inputPath, input);

    let cmd;

    if (language === 'cpp') {
      cmd = `g++ -std=c++11 ${codePath} -o ${outputPath} && ${outputPath} < ${inputPath}`;
    } else if (language === 'python') {
      cmd = `python3 ${codePath} < ${inputPath}`;
    } else {
      return res.status(400).json({ success: false, msg: 'Unsupported language' });
    }

    exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
      // Clean up temp files
      [codePath, inputPath, outputPath].forEach((file) => {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      });

      if (error) {
        return res.status(200).json({ success: false, output: stderr || error.message });
      }

      res.status(200).json({ success: true, output: stdout });
    });

  } catch (err) {
    console.error('Execution Error:', err);
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
});

module.exports = router;
