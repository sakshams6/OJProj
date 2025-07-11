import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

const allProblems = [
  { id: '1', title: '1. Two Sum', difficulty: 'Easy' },
  { id: '2', title: '2. Palindrome Check', difficulty: 'Easy' },
  { id: '3', title: '3. Binary Search', difficulty: 'Medium' },
  { id: '4', title: '4. Longest Substring Without Repeating Characters', difficulty: 'Hard' },
  { id: '5', title: '5. Count Digits', difficulty: 'Easy' },
  { id: '6', title: '6. Rotate Matrix', difficulty: 'Medium' },
  { id: '7', title: '7. Longest Palindromic Substring', difficulty: 'Medium' },
  { id: '8', title: '8. Subarray Sum Equals K', difficulty: 'Medium' },
  { id: '9', title: '9. Word Break', difficulty: 'Hard' },
  { id: '10', title: '10. Maximal Rectangle', difficulty: 'Hard' }
];

export default function ProblemList() {
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const { darkMode } = useTheme();

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5050/api/solved', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (data.success) {
          setSolvedProblems(data.solvedProblems);
        }
      } catch (err) {
        console.error('Failed to fetch solved problems:', err);
      }
    };

    fetchSolvedProblems();
  }, []);

  const filteredProblems = allProblems.filter(problem =>
    selectedDifficulty === 'All' ? true : problem.difficulty === selectedDifficulty
  );

  return (
    <div className={`min-h-screen transition-colors duration-300 px-4 sm:px-8 pt-20 ${
      darkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <h1 className="text-3xl font-bold text-center mb-6 underline decoration-pink-500">
        Problems List
      </h1>

      
      <div className="flex justify-center gap-3 mb-8 flex-wrap">
        {['All', 'Easy', 'Medium', 'Hard'].map(level => (
          <button
            key={level}
            onClick={() => setSelectedDifficulty(level)}
            className={`px-5 py-2 rounded-full text-sm font-semibold border transition duration-200 ease-in-out
              ${
                selectedDifficulty === level
                  ? 'bg-pink-500 text-white border-pink-400 shadow-lg'
                  : darkMode
                  ? 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
          >
            {level}
          </button>
        ))}
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {filteredProblems.map(problem => {
          const isSolved = solvedProblems.includes(problem.id);

          return (
            <div
              key={problem.id}
              className={`backdrop-blur-sm rounded-2xl p-5 border shadow-md transition-all duration-200 hover:scale-[1.015] hover:shadow-pink-400/20 ${
                darkMode
                  ? 'bg-white/5 border-white/10'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              <Link
                to={`/problems/${problem.id}`}
                className={`text-lg font-semibold hover:underline ${
                  darkMode ? 'text-pink-400' : 'text-pink-700'
                }`}
              >
                {problem.title}
              </Link>

              
              <div className="mt-2">
                <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full
                  ${
                    problem.difficulty === 'Easy'
                      ? darkMode
                        ? 'bg-green-600/30 text-green-300'
                        : 'bg-green-100 text-green-800'
                      : problem.difficulty === 'Medium'
                      ? darkMode
                        ? 'bg-yellow-600/30 text-yellow-300'
                        : 'bg-yellow-100 text-yellow-800'
                      : darkMode
                      ? 'bg-red-600/30 text-red-300'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>

              
              <div className="mt-3">
                <span className={`inline-block text-sm px-3 py-1 rounded-full font-semibold
                  ${
                    isSolved
                      ? darkMode
                        ? 'bg-green-500/10 text-green-300'
                        : 'bg-green-100 text-green-800'
                      : darkMode
                      ? 'bg-red-500/10 text-red-300'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {isSolved ? 'Solved' : 'Unsolved'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
