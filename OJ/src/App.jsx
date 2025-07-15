import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ProblemList from './pages/ProblemList';
import ProblemSolve from './pages/ProblemSolve';
import Progress from './pages/Progress';
import UnsolvedProblems from './pages/UnsolvedProblems';
import Header from './components/Header';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

function App() {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const isExpired = decoded.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } catch (err) {
        console.error('Invalid token');
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  }, []);

  return (
    
      <Router>
        <Header />
        <Routes>
          
          <Route
            path="/"
            element={
              <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-gray-800 dark:to-black flex flex-col items-center justify-center text-white px-4">
                <div className="bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-3xl p-10 shadow-2xl text-center max-w-md w-full">
                  <h1 className="text-4xl font-extrabold mb-4 underline decoration-pink-400 underline-offset-8 text-white dark:text-gray-100">
                    🚀 Welcome to Algo Arena
                  </h1>
                  <p className="text-lg mb-8 text-gray-200 dark:text-gray-300">
                    Your gateway to mastering coding through problems.
                  </p>
                  <div className="flex justify-center gap-4">
                    <Link
                      to="/login"
                      className="px-6 py-2 bg-blue-600 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="px-6 py-2 bg-blue-600 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition transform hover:scale-105"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              </div>
            }
          />

         
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          
          <Route path="/problems" element={<PrivateRoute><ProblemList /></PrivateRoute>} />
          <Route path="/problems/:id" element={<PrivateRoute><ProblemSolve /></PrivateRoute>} />

          
          <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
          <Route path="/unsolved" element={<PrivateRoute><UnsolvedProblems /></PrivateRoute>} />

          
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    
  );
}

export default App;