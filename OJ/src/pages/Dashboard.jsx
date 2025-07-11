import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { LogOut, User, Mail, ArrowRightCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });
  const { darkMode } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
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
    { title: 'Problem List', path: '/problems' },
    { title: 'Your Progress', path: '/progress' },
    { title: 'Unsolved Problems', path: '/unsolved' },
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      darkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <div className="relative w-full max-w-2xl">
        
        <div className="absolute inset-0 rounded-3xl p-[2px] bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 blur-sm opacity-60 z-0" />

       
        <div className={`relative z-10 rounded-3xl p-8 space-y-6 backdrop-blur-md transition-all duration-300 border shadow-xl ${
          darkMode
            ? 'bg-black/80 border-white/10'
            : 'bg-white border-gray-200'
        }`}>
          <h1 className={`text-4xl font-bold tracking-wide ${
            darkMode ? 'text-white' : 'text-black'
          }`}>
            🧠 <span className="underline underline-offset-8 decoration-pink-500">Dashboard</span>
          </h1>

          <p className={`text-base ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Welcome to your Dahboard — track your progress and dive into solving problems! 🚀
          </p>

          
          <div className={`rounded-xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border ${
            darkMode ? 'bg-black border-white/10' : 'bg-white border-gray-200'
          }`}>
            <div className="space-y-1">
              <p className={`flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-gray-700'
              }`}>
                <User className="text-pink-500" size={18} />
                <span className="font-semibold">Name:</span> {user.name}
              </p>
              <p className={`flex items-center gap-2 ${
                darkMode ? 'text-white' : 'text-gray-700'
              }`}>
                <Mail className="text-blue-500" size={18} />
                <span className="font-semibold">Email:</span> {user.email}
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-5 py-2 bg-red-500 rounded-lg font-medium text-white hover:scale-105 border shadow  transition flex items-center gap-2"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {sections.map((sec, idx) => (
              <div
                key={idx}
                onClick={() => navigate(sec.path)}
                className={`rounded-xl p-4 cursor-pointer transition-all hover:scale-105 border shadow ${
                  darkMode 
                    ? 'bg-black hover:bg-gray-900 border-white/10 text-white'
                    : 'bg-gray-200 hover:bg-gray-300 border-gray-300 text-black'
                }`}
              >
                <h3 className="text-lg font-semibold flex items-center justify-center gap-2">
                  {sec.title}
                  <ArrowRightCircle className="text-pink-500" size={18} />
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
