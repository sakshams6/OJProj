import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ProblemList from './pages/ProblemList';
import ProblemSolve from './pages/ProblemSolve';
import Progress from './pages/Progress';
import UnsolvedProblems from './pages/UnsolvedProblems';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />

      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-tr from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center text-white px-4">
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl text-center max-w-md w-full">
                <h1 className="text-4xl font-extrabold mb-4 underline decoration-pink-400 underline-offset-8">
                  🚀 Welcome to Algo Arena
                </h1>
                <p className="text-lg mb-8 text-gray-200">
                  Your gateway to mastering coding through problems.
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-pink-600 transition transform hover:scale-105"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg text-white font-semibold hover:from-pink-600 hover:to-purple-600 transition transform hover:scale-105"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          }
        />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Problem Routes */}
        <Route path="/problems" element={<PrivateRoute><ProblemList /></PrivateRoute>} />
        <Route path="/problems/:id" element={<PrivateRoute><ProblemSolve /></PrivateRoute>} />

        {/* Progress & Unsolved */}
        <Route path="/progress" element={<PrivateRoute><Progress /></PrivateRoute>} />
        <Route path="/unsolved" element={<PrivateRoute><UnsolvedProblems /></PrivateRoute>} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
