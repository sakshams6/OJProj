const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    minlength: [2, 'Name must be at least 2 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true
  },
  password: {
    type: String,
    required: [true, 'Please provide a password']
  },
  submissions: {
  type: [
    {
      problemId: String,
      code: String,
      timestamp: Date,
      result: String,
      details: [
        {
          input: String,
          expected: String,
          output: String,
          passed: Boolean
        }
      ]
    }
  ],
  default: []
},

  solvedProblems: {
  type: [String], 
  default: []
}

});


userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
