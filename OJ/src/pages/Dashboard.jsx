import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token:', err);
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const sections = [
    { title: '1. Problem List', path: '/problems' },
    { title: '2. Your Progress', path: '/progress' },
    { title: '3. Unsolved Problems', path: '/unsolved' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-900 to-gray-900 flex items-center justify-center text-white px-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl text-center max-w-xl w-full space-y-6">
        <h1 className="text-4xl font-bold underline underline-offset-8 decoration-pink-400">
          🧠 Dashboard
        </h1>
        <p className="text-lg text-gray-300">
          Welcome to your secure dashboard! 🎯
        </p>

        {user && (
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-left text-white space-y-2">
            <p><span className="font-semibold">👤 Name:</span> {user.name}</p>
            <p><span className="font-semibold">📧 Email:</span> {user.email}</p>
          </div>
        )}

        {/* 🔹 Section Navigation */}
        <ul className="text-left text-white space-y-3 mt-6">
          {sections.map((sec, idx) => (
            <li
              key={idx}
              onClick={() => navigate(sec.path)}
              className="cursor-pointer hover:text-pink-300 text-lg transition-colors"
            >
              {sec.title}
            </li>
          ))}
        </ul>

        <button
          onClick={handleLogout}
          className="mt-6 px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg text-white font-semibold hover:from-red-600 hover:to-pink-600 transition transform hover:scale-105"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
