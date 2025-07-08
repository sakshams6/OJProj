import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { jwtDecode } from 'jwt-decode';

const problems = {
  '1': {
    title: 'Two Sum',
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
    description: `Determine whether a given string is a palindrome.`,
    constraints: [
      '1 <= s.length <= 10^5',
      's consists only of lowercase English letters.'
    ],
    input: 'racecar',
    output: 'Yes',
    explaination: '"racecar" is a palindrome.'
  },
  '3': {
    title: 'Binary Search',
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
    description: `Given a 2D binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.`,
    constraints: [
      '1 <= m, n <= 200'
    ],
    input: '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0',
    output: '6',
    explaination: 'The maximal rectangle with all 1s has area = 6.'
  }
};
  


export default function ProblemSolve() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [code, setCode] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('cpp'); 
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const selected = problems[id];
    if (selected) setProblem(selected);
    fetchSolvedStatus();
  }, [id]);

  const fetchSolvedStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get('http://localhost:5050/api/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const solved = res.data.user.solvedProblems || [];
      setIsSolved(solved.includes(id));
    } catch (err) {
      console.error('Error fetching solved status:', err);
    }
  };

  const markAsSolved = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5050/api/solved',
        { problemId: id, action: 'add' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSolved(true);
    } catch (err) {
      console.error('Error marking as solved:', err);
    }
  };

  const markAsUnsolved = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5050/api/solved',
        { problemId: id, action: 'remove' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsSolved(false);
    } catch (err) {
      console.error('Error marking as unsolved:', err);
    }
  };

  const runCode = async () => {
    try {
      const res = await axios.post('http://localhost:5050/api/compile', {
        code,
        input: customInput,
        language
      });
      setOutput(res.data.output);
    } catch (err) {
      console.error('Error running code:', err);
      setOutput('❌ Error during compilation or execution.');
    }
  };

  const submitCode = async () => {
    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setOutput('❌ Please log in to submit code.');
        return;
      }

      const res = await axios.post(
        'http://localhost:5050/api/submit',
        { code, problemId: id, language},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOutput(
        <div>
          <p className="text-green-400 font-semibold mb-2">
            ✅ Passed {res.data.passed}/{res.data.total} test cases
          </p>
          {res.data.details.map((test, i) => (
            <div
              key={i}
              className={`mb-4 p-4 rounded-lg border ${
                test.passed ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'
              }`}
            >
              <p className="font-bold mb-1">Test Case {i + 1}</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap"><strong>Input:</strong>{'\n' + test.input}</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap"><strong>Expected:</strong> {test.expected}</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap"><strong>Got:</strong> {test.output}</p>
              <p className="text-sm mt-1 font-medium">
                Result: <span className={test.passed ? 'text-green-400' : 'text-red-400'}>{test.passed ? '✅ Passed' : '❌ Failed'}</span>
              </p>
            </div>
          ))}
        </div>
      );

      if (res.data.allPassed) {
        markAsSolved();
      }
    } catch (err) {
      console.error('❌ Submission Error:', err);
      if (err.response?.data?.msg) {
        setOutput('❌ ' + err.response.data.msg);
      } else if (err.message) {
        setOutput('❌ ' + err.message);
      } else {
        setOutput('❌ Error during submission.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {problem ? (
        <>
          <div className="md:w-1/2 p-6 md:p-10 border-r border-white/10">
            <h2 className="text-3xl font-bold mb-4 underline underline-offset-8 decoration-pink-400">
              {problem.title}
            </h2>
            <p className="mb-6 text-gray-300 text-lg whitespace-pre-line">{problem.description}</p>

            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-lg text-purple-400">Constraints:</h3>
              <ul className="list-disc list-inside text-gray-300">
                {problem.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>

            <div className="text-sm text-gray-400 mt-4 space-y-1">
              <p><span className="text-purple-300 font-medium">Input:</span> {problem.input}</p>
              <p><span className="text-purple-300 font-medium">Output:</span> {problem.output}</p>
              <p><span className="text-purple-300 font-medium">Explaination:</span> {problem.explaination}</p>
            </div>

            {isSolved ? (
              <button
                onClick={markAsUnsolved}
                className="mt-6 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
              >
                ❌ Mark as Unsolved
              </button>
            ) : (
              <button
                onClick={markAsSolved}
                className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
              >
                ✔️ Mark as Solved
              </button>
            )}
          </div>

          <div className="md:w-1/2 p-6 md:p-10 bg-gray-800">
            <h2 className="text-xl font-semibold mb-2">🧑‍💻 Code Editor</h2>

            {/* Language selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-purple-300">Language:</label>
              <select
                className="bg-gray-900 border border-white/10 text-white px-3 py-2 rounded-lg focus:outline-none"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="cpp">C++</option>
                <option value="python">Python</option>
              </select>
            </div>

            <textarea
              rows="20"
              className="w-full bg-black border border-white/10 rounded-xl p-4 text-white font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-400/50"
              placeholder="// Write your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            ></textarea>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1 text-purple-300">Custom Input:</label>
              <textarea
                rows="4"
                className="w-full bg-gray-950 border border-white/10 rounded-lg p-3 text-white font-mono resize-none focus:outline-none focus:ring-2 focus:ring-purple-400/50"
                placeholder="Enter custom input here..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              ></textarea>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={runCode}
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-lg hover:from-pink-600 hover:to-purple-600 transition transform hover:scale-105"
              >
                Run Code
              </button>

              <button
                onClick={submitCode}
                disabled={submitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition transform hover:scale-105 disabled:opacity-50"
              >
                {submitting ? '⏳ Submitting...' : '🚀 Submit Code'}
              </button>
            </div>

            {output && (
              <div className="mt-6 bg-gray-900 border border-white/10 p-4 rounded-lg max-h-80 overflow-y-auto">
                <h3 className="text-lg font-semibold mb-2 text-green-400">Output:</h3>
                <div className="text-white">{output}</div>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="p-10 text-center w-full text-red-300">
          <p>❌ Problem not found</p>
        </div>
      )}
    </div>
  );
}
