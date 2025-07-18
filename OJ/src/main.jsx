import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { SubmissionsProvider } from './context/SubmissionsContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <SubmissionsProvider>
        <App />
      </SubmissionsProvider>
    </ThemeProvider>
  </React.StrictMode>,
);