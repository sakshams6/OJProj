import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

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

  const handleFilterChange = (difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const filteredProblems = allProblems.filter(problem => {
    if (selectedDifficulty === 'All') return true;
    return problem.difficulty === selectedDifficulty;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-900 to-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold mb-8 underline underline-offset-8 decoration-pink-400">📝 Problem List</h1>

      <div className="mb-6 space-x-3">
        {['All', 'Easy', 'Medium', 'Hard'].map(level => (
          <button
            key={level}
            onClick={() => handleFilterChange(level)}
            className={`px-4 py-1 rounded-full text-sm font-medium border transition 
              ${
                selectedDifficulty === level
                  ? 'bg-pink-500 text-white border-pink-400'
                  : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20'
              }`}
          >
            {level}
          </button>
        ))}
      </div>

      <ul className="list-disc list-inside space-y-4 text-lg">
        {filteredProblems.map(problem => (
          <li key={problem.id} className="flex items-center justify-between">
            <div className="space-x-2">
              <Link
                to={`/problems/${problem.id}`}
                className="text-gray-300 hover:text-white underline"
              >
                {problem.title}
              </Link>
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ml-2 ${
                problem.difficulty === 'Easy' ? 'bg-green-600/30 text-green-300' :
                problem.difficulty === 'Medium' ? 'bg-yellow-600/30 text-yellow-300' :
                'bg-red-600/30 text-red-300'
              }`}>
                {problem.difficulty}
              </span>
            </div>
            <span className={`text-sm px-3 py-1 rounded-full font-medium ${
              solvedProblems.includes(problem.id)
                ? 'bg-green-600/20 text-green-400'
                : 'bg-red-600/20 text-red-400'
            }`}>
              {solvedProblems.includes(problem.id) ? ' Solved' : ' Unsolved'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
