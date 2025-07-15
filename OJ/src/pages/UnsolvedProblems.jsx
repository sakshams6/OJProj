import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const problems = {
  '1': { title: 'Two Sum', difficulty: 'Easy', tags: ['Array', 'HashMap'] },
  '2': { title: 'Palindrome Check', difficulty: 'Easy', tags: ['String', 'Two Pointers'] },
  '3': { title: 'Binary Search', difficulty: 'Medium', tags: ['Array', 'Binary Search'] },
  '4': { title: 'Longest Substring Without Repeating Characters', difficulty: 'Hard', tags: ['String', 'Sliding Window'] },
  '5': { title: 'Count Digits', difficulty: 'Easy', tags: ['Math', 'Brute Force'] },
  '6': { title: 'Rotate Matrix', difficulty: 'Medium', tags: ['Matrix', 'Simulation'] },
  '7': { title: 'Longest Palindromic Substring', difficulty: 'Medium', tags: ['DP', 'String'] },
  '8': { title: 'Subarray Sum Equals K', difficulty: 'Medium', tags: ['HashMap', 'Prefix Sum'] },
  '9': { title: 'Word Break', difficulty: 'Hard', tags: ['DP', 'String', 'Backtracking'] },
  '10': { title: 'Maximal Rectangle', difficulty: 'Hard', tags: ['Matrix', 'DP', 'Stack'] }
};

export default function UnsolvedProblems() {
  const [solved, setSolved] = useState([]);
  const [unsolved, setUnsolved] = useState([]);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await axios.get('/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const solvedIds = res.data.user.solvedProblems || [];
        setSolved(solvedIds);

        const allProblemIds = Object.keys(problems);
        const unsolvedList = allProblemIds.filter(id => !solvedIds.includes(id));
        setUnsolved(unsolvedList);
      } catch (err) {
        console.error('❌ Failed to fetch profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const difficultyColors = (level) => {
    const base = 'text-xs font-medium inline-block px-2 py-1 rounded-full border';
    if (darkMode) {
      return {
        Easy: `${base} text-green-400 border-green-500`,
        Medium: `${base} text-yellow-300 border-yellow-400`,
        Hard: `${base} text-red-400 border-red-500`,
      }[level];
    } else {
      return {
        Easy: `${base} text-green-700 border-green-400 bg-green-100`,
        Medium: `${base} text-yellow-800 border-yellow-400 bg-yellow-100`,
        Hard: `${base} text-red-700 border-red-400 bg-red-100`,
      }[level];
    }
  };

  return (
    <div className={`pt-20 min-h-screen transition-colors duration-300 px-4 sm:px-6 md:px-10 ${
      darkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <h1 className="text-4xl font-bold mb-8 underline underline-offset-8 decoration-pink-400">
        Unsolved Problems:
      </h1>

      {unsolved.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">🎉 You’ve solved all the problems!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          {unsolved.map((id) => {
            const problem = problems[id];
            return (
              <div
                key={id}
                className={`rounded-xl p-6 transition hover:scale-[1.015] shadow-md border cursor-pointer ${
                  darkMode
                    ? 'bg-white/5 border-white/10 hover:bg-white/10'
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <h2 className={`text-xl font-semibold mb-2 ${
                  darkMode ? 'text-pink-300' : 'text-purple-800'
                }`}>
                  {problem.title}
                </h2>

                <p className={difficultyColors(problem.difficulty)}>
                  {problem.difficulty}
                </p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {problem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`text-xs px-2 py-1 rounded-full border ${
                        darkMode
                          ? 'bg-white/10 text-white border-white/10'
                          : 'bg-gray-200 text-gray-700 border-gray-300'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
