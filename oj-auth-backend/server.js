require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const path = require('path'); // <--- Path is no longer needed if not serving static files
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const submitRoute = require('./routes/submit');
const aiRoutes = require('./routes/ai');
const compileRoute = require('./routes/compile');

const app = express();

// CORS Configuration (Updated for Vercel frontend and API subdomain)
app.use(cors({
  origin: [
    'https://algoarena.space', // Your Vercel-hosted frontend domain (HTTPS)
    'https://www.algoarena.space', // Your www Vercel-hosted frontend domain (HTTPS)
    // You might also need your Vercel deploy preview URL for testing, e.g.:
    // 'https://your-project-name-xxxx.vercel.app' 
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes - These are your backend's primary function
app.use('/api', authRoutes);
app.use('/api/submit', submitRoute);
app.use('/api', aiRoutes);
app.use('/api/compile', compileRoute);

// Simple test route for backend health check
app.get('/api/test', (req, res) => {
  res.send('Server test route working');
});


// --- FRONTEND STATIC FILE SERVING: REMOVED ---
// These lines are removed because Vercel (Nginx) now serves the frontend
// and your backend only handles API calls.
// app.use(express.static(path.join(__dirname, 'frontend_build')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'frontend_build', 'index.html'));
// });
// --- END REMOVED SECTION ---


connectDB(); // Database connection
const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));