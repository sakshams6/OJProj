const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const { v4: uuid } = require('uuid');
const path = require('path');

const router = express.Router();

router.post('/', async (req, res) => {
  const { code, input = '' } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, msg: 'No code provided' });
  }

  const id = uuid();
  const codePath = path.join(__dirname, '../temp', `${id}.cpp`);
  const inputPath = path.join(__dirname, '../temp', `${id}.txt`);
  const outputPath = path.join(__dirname, '../temp', `${id}.out`);

  try {
    
    fs.writeFileSync(codePath, code);
    fs.writeFileSync(inputPath, input);

    
    const cmd = `g++ -std=c++11 ${codePath} -o ${outputPath} && ${outputPath} < ${inputPath}`;

    exec(cmd, (error, stdout, stderr) => {
      
      [codePath, inputPath, outputPath].forEach((file) => {
        if (fs.existsSync(file)) fs.unlinkSync(file);
      });

      if (error) {
        return res.status(200).json({ success: false, output: stderr || error.message });
      }

      res.status(200).json({ success: true, output: stdout });
    });

  } catch (err) {
    res.status(500).json({ success: false, msg: 'Internal Server Error' });
  }
});

module.exports = router;
