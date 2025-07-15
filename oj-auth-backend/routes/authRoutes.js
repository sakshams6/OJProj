const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authmiddleware');
const User = require('../models/user');


router.post('/register', registerUser);
router.post('/login', loginUser);


router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});


router.post('/solved', authMiddleware, async (req, res) => {
  const { problemId, action } = req.body;

  if (!problemId || !['add', 'remove'].includes(action)) {
    return res.status(400).json({ success: false, msg: 'Problem ID and valid action are required' });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    if (action === 'add') {
      if (!user.solvedProblems.includes(problemId)) {
        user.solvedProblems.push(problemId);
      }
    } else if (action === 'remove') {
      user.solvedProblems = user.solvedProblems.filter(p => p !== problemId);
    }

    await user.save();
    res.json({ success: true, msg: `Problem ${action === 'add' ? 'marked as solved' : 'removed from solved'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});



router.get('/solved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('solvedProblems');

    if (!user) {
      return res.status(404).json({ success: false, msg: 'User not found' });
    }

    res.json({ success: true, solvedProblems: user.solvedProblems });
  } catch (err) {
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
});


module.exports = router;
