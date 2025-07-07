import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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


const difficultyColors = {
  Easy: 'text-green-400 border-green-500',
  Medium: 'text-yellow-300 border-yellow-400',
  Hard: 'text-red-400 border-red-500',
};

export default function UnsolvedProblems() {
  const [solved, setSolved] = useState([]);
  const [unsolved, setUnsolved] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      try {
        const res = await axios.get('http://localhost:5050/api/profile', {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-900 to-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 underline underline-offset-8 decoration-pink-400">
         Unsolved Problems:
      </h1>

      {unsolved.length === 0 ? (
        <p className="text-gray-400">🎉 You’ve solved all the problems!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unsolved.map((id) => {
            const problem = problems[id];
            return (
              <div
                key={id}
                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition shadow-md"
              >
                <h2 className="text-xl font-semibold text-pink-300 mb-1">
                  {problem.title}
                </h2>

                <p className={`text-sm font-medium inline-block mb-2 px-2 py-1 border rounded-full ${difficultyColors[problem.difficulty]}`}>
                  {problem.difficulty}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {problem.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-white/10 px-2 py-1 rounded-full text-white border border-white/10"
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
