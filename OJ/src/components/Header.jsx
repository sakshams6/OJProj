import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 w-full h-[60px] z-50 bg-white/90 dark:bg-black/60 backdrop-blur-md border-b border-gray-200/30 dark:border-white/10 shadow-sm dark:shadow-gray-900/20">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4">
        
        <Link to="/" className="text-gray-800 dark:text-white text-xl font-bold tracking-tight">
          <span className="text-pink-500">Algo</span>Arena ⚔️
        </Link>

        
        <nav className="hidden md:flex gap-4 text-sm text-gray-700 dark:text-white font-medium items-center">
          <Link 
            to="/dashboard" 
            className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          >
            Dashboard
          </Link>
          <Link 
            to="/problems" 
            className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          >
            Problems
          </Link>
          <Link 
            to="/progress" 
            className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          >
            Progress
          </Link>
          <Link 
            to="/unsolved" 
            className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
          >
            Unsolved
          </Link>
          
          
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 transition-all duration-200"
            title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-200"
          >
            <LogOut size={14} />
            Logout
          </button>
        </nav>

        
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-white transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pb-4 pt-2 bg-white/95 dark:bg-black/90 backdrop-blur-md border-t border-gray-200/30 dark:border-white/10">
          <nav className="space-y-3">
            <Link 
              to="/dashboard" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 px-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              to="/problems" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 px-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
            >
              Problems
            </Link>
            <Link 
              to="/progress" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 px-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
            >
              Progress
            </Link>
            <Link 
              to="/unsolved" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block py-2 px-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-pink-500 dark:hover:text-pink-400 transition-colors"
            >
              Unsolved
            </Link>
            
            
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 w-full py-2 px-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-yellow-500 dark:hover:text-yellow-400 transition-colors"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            </button>

            
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-3 w-full py-2 px-3 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}