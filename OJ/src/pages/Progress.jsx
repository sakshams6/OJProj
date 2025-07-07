import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const problems = {
  '1': {
    title: 'Two Sum',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.'
    ],
    input: '4\n2 7 11 15\n9',
    output: '[0,1]',
    explaination: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
  },
  '2': {
    title: 'Palindrome Check',
    difficulty: 'Easy',
    description: `Determine whether a given string is a palindrome.`,
    constraints: [
      '1 <= s.length <= 10^5',
      's consists only of lowercase English letters.'
    ],
    input: 'racecar',
    output: 'true',
    explaination: '"racecar" is a palindrome.'
  },
  '3': {
    title: 'Binary Search',
    difficulty: 'Medium',
    description: `Implement binary search on a sorted array to find the index of a target element.`,
    constraints: [
      '1 <= nums.length <= 10^5',
      'nums is sorted in ascending order.',
      '-10^9 <= nums[i], target <= 10^9'
    ],
    input: '6\n-1 0 3 5 9 12\n9',
    output: '4',
    explaination: '9 is at index 4 in the array.'
  },
  '4': {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Hard',
    description: `Given a string s, find the length of the longest substring without repeating characters.`,
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ],
    input: 'abcabcbb',
    output: '3',
    explaination: '"abc" is the longest substring without repeating characters.'
  },
  '5': {
    title: 'Count Digits',
    difficulty: 'Easy',
    description: `Given an integer, count how many of its digits divide it evenly.`,
    constraints: [
      '1 <= n <= 10^9'
    ],
    input: '1012',
    output: '3',
    explaination: 'Digits 1, 1, and 2 divide 1012 evenly.'
  },
  '6': {
    title: 'Rotate Matrix',
    difficulty: 'Medium',
    description: `Rotate a given n x n 2D matrix 90 degrees clockwise.`,
    constraints: [
      '1 <= n <= 1000',
      'Matrix values are integers'
    ],
    input: '2\n1 2\n3 4',
    output: '3 1\n4 2',
    explaination: 'The matrix after 90-degree rotation becomes: [[3,1],[4,2]]'
  },
  '7': {
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    description: `Given a string s, return the longest palindromic substring in s.`,
    constraints: [
      '1 <= s.length <= 1000'
    ],
    input: 'babad',
    output: 'bab',
    explaination: 'Both "bab" and "aba" are valid, but we return "bab".'
  },
  '8': {
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    description: `Given an array of integers and an integer k, return the total number of continuous subarrays whose sum equals to k.`,
    constraints: [
      '1 <= nums.length <= 20,000',
      '-1000 <= nums[i] <= 1000',
      '-10^7 <= k <= 10^7'
    ],
    input: '5\n1 2 3 4 5\n9',
    output: '2',
    explaination: 'Subarrays [2,3,4] and [4,5] both sum to 9.'
  },
  '9': {
    title: 'Word Break',
    difficulty: 'Hard',
    description: `Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.`,
    constraints: [
      '1 <= s.length <= 300',
      '1 <= wordDict.length <= 1000'
    ],
    input: 'leetcode\n2\nleet code',
    output: 'true',
    explaination: '"leetcode" can be segmented into "leet code".'
  },
  '10': {
    title: 'Maximal Rectangle',
    difficulty: 'Hard',
    description: `Given a 2D binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.`,
    constraints: [
      '1 <= m, n <= 200'
    ],
    input: '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0',
    output: '6',
    explaination: 'The maximal rectangle with all 1s has area = 6.'
  }
};


const COLORS = ['#34d399', '#fbbf24', '#f87171'];

export default function ProgressPage() {
  const [solved, setSolved] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await axios.get('http://localhost:5050/api/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSolved(res.data.user.solvedProblems || []);
        setSubmissions(res.data.user.submissions || []);
      } catch (err) {
        console.error('Error fetching progress:', err);
      }
    };

    fetchProgress();
  }, []);

  const easy = solved.filter(id => problems[id]?.difficulty === 'Easy').length;
  const medium = solved.filter(id => problems[id]?.difficulty === 'Medium').length;
  const hard = solved.filter(id => problems[id]?.difficulty === 'Hard').length;

  const pieData = [
    { name: 'Easy', value: easy },
    { name: 'Medium', value: medium },
    { name: 'Hard', value: hard }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-neutral-900 to-gray-900 text-white p-6 md:p-10">
      <h1 className="text-4xl font-bold mb-8 underline underline-offset-8 decoration-pink-500">
        Your Progress:
      </h1>

      {/* Summary + Pie Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">🎯 Summary</h2>
          <ul className="space-y-2 text-base">
            <li><span className="font-semibold text-white">Total Solved:</span> {solved.length}</li>
            <li className="text-green-400">🟢 Easy: {easy}</li>
            <li className="text-yellow-400">🟡 Medium: {medium}</li>
            <li className="text-red-400">🔴 Hard: {hard}</li>
          </ul>
        </div>

        <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">📈 Difficulty Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Submissions */}
      <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-lg">
        <h2 className="text-xl font-semibold mb-6">📜 Previous Submissions</h2>

        {submissions.length === 0 ? (
          <p className="text-gray-400">No submissions yet.</p>
        ) : (
          submissions
            .slice()
            .reverse()
            .map((sub, idx) => {
              const isExpanded = expandedIndex === idx;
              const problem = problems[sub.problemId] || {};
              const difficultyColor =
                problem.difficulty === 'Easy' ? 'text-green-300' :
                problem.difficulty === 'Medium' ? 'text-yellow-300' :
                'text-red-300';

              return (
                <div
                  key={idx}
                  className="mb-4 bg-gray-800/60 border border-white/10 rounded-lg hover:bg-gray-800 transition-all duration-200"
                >
                  <div
                    onClick={() => toggleExpand(idx)}
                    className="flex items-center justify-between p-4 cursor-pointer"
                  >
                    <div>
                      <p className="text-lg font-semibold text-purple-300">
                        {problem.title || 'Unknown Problem'}
                      </p>
                      <p className={`text-sm ${difficultyColor}`}>
                        🧠 {problem.difficulty || 'Unknown'} | 🕒 {new Date(sub.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                      sub.result === 'Passed' ? 'bg-green-700/30 text-green-400' : 'bg-red-700/30 text-red-400'
                    }`}>
                      {sub.result}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        {/* Code */}
                        <pre className="p-4 text-sm bg-black/40 text-gray-200 whitespace-pre-wrap overflow-x-auto border-t border-white/10">
{`${sub.code}`}
                        </pre>

                        {/* Test Cases */}
                        {sub.details?.length > 0 && (
                          <div className="p-4 space-y-3 border-t border-white/10">
                            <p className="text-md font-semibold text-gray-300 mb-1">🧪 Test Cases:</p>
                            {sub.details.map((test, tIdx) => (
                              <div
                                key={tIdx}
                                className={`p-3 rounded bg-gray-700/50 border ${
                                  test.passed ? 'border-green-500' : 'border-red-500'
                                }`}
                              >
                                <p className="text-sm">
                                  <span className="font-semibold">Input:</span>{' '}
                                  <code className="text-gray-200">{test.input}</code>
                                </p>
                                <p className="text-sm">
                                  <span className="font-semibold">Expected:</span>{' '}
                                  <code className="text-green-300">{test.expected}</code>
                                </p>
                                <p className="text-sm">
                                  <span className="font-semibold">Output:</span>{' '}
                                  <code className={test.passed ? 'text-green-400' : 'text-red-400'}>{test.output}</code>
                                </p>
                                <p className={`text-xs mt-1 font-medium ${test.passed ? 'text-green-500' : 'text-red-500'}`}>
                                  {test.passed ? '✅ Passed' : '❌ Failed'}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
