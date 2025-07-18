require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path'); // <-- IMPORTANT: Added for path resolution
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const submitRoute = require('./routes/submit');
const aiRoutes = require('./routes/ai');
const compileRoute = require('./routes/compile');

const app = express();

// CORS Configuration (Updated with your frontend domain)
app.use(cors({
  origin: [
    'http://65.1.130.6', // Your backend IP (often for testing directly)
    'http://ec2-65-1-130-6.ap-south-1.compute.amazonaws.com', // Your backend DNS
    'http://algoarena.space' // <--- Your frontend domain (CRITICAL for CORS)
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// API Routes - These should come BEFORE static file serving to ensure API calls are handled first
app.use('/api', authRoutes);
app.use('/api/submit', submitRoute);
app.use('/api', aiRoutes);
app.use('/api/compile', compileRoute);

app.get('/api/test', (req, res) => {
  res.send('Server test route working');
});


// --- CRITICAL ADDITIONS FOR REACT FRONTEND (SPA ROUTING & SERVING) ---

// 1. Serve static files from the React build directory
// This assumes your 'build' folder is inside a 'client' folder relative to server.js
// If your build folder is directly in your backend project's root, it might be path.join(__dirname, 'build')
app.use(express.static(path.join(__dirname, 'client', 'build'))); // <-- ADDED THIS BLOCK


// 2. SPA Fallback Route: For any other GET request, serve index.html
// This ensures client-side routing (e.g., /problems/1) works on refresh
// This MUST come AFTER all your API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')); // <-- ADDED THIS BLOCK
});

// --- END CRITICAL ADDITIONS ---


connectDB();
const PORT = process.env.PORT || 5050;
// Use the PORT variable for consistency
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
// <-- Changed to use PORT variable