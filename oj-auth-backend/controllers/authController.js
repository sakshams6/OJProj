const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, msg: 'Please fill all required fields' });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ success: false, msg: 'Name must be at least 2 characters long' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, msg: 'User already exists' });
    }

    const user = new User({ name: name.trim(), email, password });
    await user.save();

    res.status(201).json({
      success: true,
      msg: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Registration error:', err);

    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, msg: errors.join(', ') });
    }

    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};



exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, msg: 'Please enter both email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, msg: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, msg: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id,name: user.name, email: user.email},
      process.env.JWT_SECRET || 'secret', // replace 'secret' with actual env
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      msg: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, msg: 'Server Error' });
  }
};
