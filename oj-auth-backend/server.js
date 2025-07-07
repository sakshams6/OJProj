

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const compileRoute = require('./routes/compile');
const submitRoute = require('./routes/submit');

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',  
  credentials: true                
}));
app.use(express.json());
app.use('/api', authRoutes);
app.use('/api/compile', compileRoute);

app.use('/api/submit', submitRoute);




app.get('/test', (req, res) => {
  res.send('✅ Server test route working');
});
connectDB();

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
