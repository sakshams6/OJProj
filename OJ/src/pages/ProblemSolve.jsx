import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import {jwtDecode} from 'jwt-decode';
import { useTheme } from '../context/ThemeContext';

const problems = {
  '1': {
    title: 'Two Sum',
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
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
    description: "Determine whether a given string is a palindrome.",
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
    description: "Implement binary search on a sorted array to find the index of a target element.",
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
    description: "Given a string s, find the length of the longest substring without repeating characters.",
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
    description: "Given an integer, count how many of its digits divide it evenly.",
    constraints: [
      '1 <= n <= 10^9'
    ],
    input: '1012',
    output: '3',
    explaination: 'Digits 1, 1, and 2 divide 1012 evenly.'
  },
  '6': {
    title: 'Rotate Matrix',
    description: "Rotate a given n x n 2D matrix 90 degrees clockwise.",
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
    description: "Given a string s, return the longest palindromic substring in s.",
    constraints: [
      '1 <= s.length <= 1000'
    ],
    input: 'babad',
    output: 'bab',
    explaination: 'Both "bab" and "aba" are valid, but we return "bab".'
  },
  '8': {
    title: 'Subarray Sum Equals K',
    description: "Given an array of integers and an integer k, return the total number of continuous subarrays whose sum equals to k.",
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
    description: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
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
    description: "Given a 2D binary matrix filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.",
    constraints: [
      '1 <= m, n <= 200'
    ],
    input: '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0',
    output: '6',
    explaination: 'The maximal rectangle with all 1s has area = 6.'
  }
};

const defaultCodeTemplates = {
  cpp: '// C++ code here\n#include <iostream>\n#include <vector>\n\nusing namespace std;\n\nint main() {\n    // Your solution here\n    \n    return 0;\n}',
  python: '# Python code here\ndef main():\n    // Your solution here\n    pass\n\nif __name__ == "__main__":\n    main()'
};

export default function ProblemSolve() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [isSolved, setIsSolved] = useState(false);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [customInput, setCustomInput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useTheme();
  const [review, setReview] = useState('');
  const [hint, setHint] = useState('');
  const [loadingReview, setLoadingReview] = useState(false);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    const selected = problems[id];
    if (selected) {
      setProblem(selected);
      setLoading(false);
    } else {
      setError('Problem not found');
      setLoading(false);
    }
    fetchSolvedStatus();
  }, [id]);

  useEffect(() => {
    setCode(defaultCodeTemplates[language]);
  }, [language]);

  const fetchSolvedStatus = async () => {
  try {
    const res = await axios.get('/profile');
    const solved = res.data.user.solvedProblems || [];
    setIsSolved(solved.includes(id));
  } catch (err) {
    console.error('Error fetching solved status:', err);
  }
};

const markAsSolved = async () => {
  try {
    await axios.post('/solved', { problemId: id, action: 'add' });
    setIsSolved(true);
  } catch (err) {
    console.error('Error marking as solved:', err);
  }
};

const markAsUnsolved = async () => {
  try {
    await axios.post('/solved', { problemId: id, action: 'remove' });
    setIsSolved(false);
  } catch (err) {
    console.error('Error marking as unsolved:', err);
  }
};

const runCode = async () => {
  try {
    setOutput('⌛ Running...');
    const res = await axios.post('/compile', {
      code,
      input: customInput,
      language
    });
    setOutput(res.data.output || 'No output');
  } catch (err) {
    console.error('Error running code:', err);
    setOutput(`❌ Error: ${err.response?.data?.error || err.message || 'Unknown error during execution'}`);
  }
};

const handleCodeReview = async () => {
  try {
    setLoadingReview(true);
    const res = await axios.post('/code-review', {
      code,
      language: language || 'cpp',
    });
    setReview(res.data.review);
  } catch (err) {
    setReview('Failed to get review');
    console.error(err);
  } finally {
    setLoadingReview(false);
  }
};

const handleHint = async () => {
  try {
    setLoadingHint(true);
    const res = await axios.post('/get-hint', {
      problemTitle: problem.title,
      problemDescription: problem.description,
      userCode: code,
    });
    setHint(res.data.hint);
  } catch (err) {
    setHint('Failed to get hint');
    console.error(err);
  } finally {
    setLoadingHint(false);
  }
};

const submitCode = async () => {
  try {
    setSubmitting(true);
    setOutput('⌛ Submitting...');

    const res = await axios.post('/submit', {
      code,
      problemId: id,
      language
    });

    if (!res.data || !Array.isArray(res.data.details)) {
      throw new Error('Invalid response format from server');
    }

    const resultOutput = (
      <div>
        <p className={`${darkMode ? 'text-green-300' : 'text-green-600'} font-semibold mb-2`}>
          {res.data.allPassed ? '✅ All tests passed!' : `✅ Passed ${res.data.passed}/${res.data.total} test cases`}
        </p>
        {res.data.details.map((test, i) => (
          <div key={i} className={`mb-4 p-4 rounded-lg border text-sm ${
            test.passed
              ? darkMode
                ? 'border-green-500 bg-green-900/20 text-green-300'
                : 'border-green-500 bg-green-100 text-green-800'
              : darkMode
                ? 'border-red-500 bg-red-900/20 text-red-300'
                : 'border-red-500 bg-red-100 text-red-800'
          }`}>
            <p className="font-bold mb-1">Test Case {i + 1}</p>
            <p><strong>Input:</strong> {test.input || 'N/A'}</p>
            <p><strong>Expected:</strong> {test.expected || 'N/A'}</p>
            <p><strong>Got:</strong> {test.output || 'N/A'}</p>
            <p className="mt-1 font-medium">
              Result: <span>{test.passed ? '✅ Passed' : '❌ Failed'}</span>
            </p>
          </div>
        ))}
      </div>
    );

    setOutput(resultOutput);

    if (res.data.allPassed) {
      await markAsSolved();
    }
  } catch (err) {
    console.error('❌ Submission Error:', err);
    setOutput(`❌ ${err.response?.data?.msg || err.message || 'Error during submission'}`);
  } finally {
    setSubmitting(false);
  }
};

if (loading) {
  return (
    <div className={`min-h-screen pt-20 flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <p className={`text-xl ${darkMode ? 'text-white' : 'text-black'}`}>Loading problem...</p>
    </div>
  );
}

if (error || !problem) {
  return (
    <div className={`min-h-screen pt-20 flex items-center justify-center ${darkMode ? 'bg-black' : 'bg-white'}`}>
      <p className={`text-xl ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
        {error || 'Problem not found'}
      </p>
    </div>
  );
}

  return (
    <div className={`min-h-screen pt-20 flex flex-col md:flex-row transition-colors duration-300 ${darkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* LEFT: Problem description */}
      <div className={`md:w-1/2 p-6 md:p-10 border-b md:border-b-0 md:border-r ${darkMode ? 'border-white/10' : 'border-gray-200'}`}>
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-3xl font-bold underline underline-offset-8 decoration-pink-500">
            {problem.title}
          </h2>
          {isSolved && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'}`}>
              Solved
            </span>
          )}
        </div>

        <p className={`mb-6 text-lg whitespace-pre-line ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          {problem.description}
        </p>

        <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-blue-300' : 'text-gray-800'}`}>Constraints:</h3>
        <ul className={`list-disc list-inside space-y-1 mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
          {problem.constraints.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>

        <div className="space-y-4">
          <div>
            <h4 className={`font-medium mb-1 ${darkMode ? 'text-purple-300' : 'text-gray-800'}`}>Example Input:</h4>
            <pre className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
              {problem.input}
            </pre>
          </div>
          <div>
            <h4 className={`font-medium mb-1 ${darkMode ? 'text-purple-300' : 'text-gray-800'}`}>Example Output:</h4>
            <pre className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-800'}`}>
              {problem.output}
            </pre>
          </div>
          <div>
            <h4 className={`font-medium mb-1 ${darkMode ? 'text-purple-300' : 'text-gray-800'}`}>Explanation:</h4>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{problem.explaination}</p>
          </div>
        </div>
        {isSolved ? (
          <button
            onClick={markAsUnsolved}
            className="mt-6 px-5 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
          >
            Mark as Unsolved
          </button>
        ) : (
          <button
            onClick={markAsSolved}
            className="mt-6 px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition transform hover:scale-105"
          >
            Mark as Solved
          </button>
        )}
      </div>

      
      <div className={`md:w-1/2 p-6 md:p-10 transition ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
        <h2 className="text-xl font-semibold mb-4">🧑‍💻 Code Editor</h2>

        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Language:
          </label>
          <select
            className={`w-full px-3 py-2 rounded-lg focus:outline-none ${darkMode ? 'bg-gray-800 border-white/10 text-white' : 'bg-white border-gray-300 text-black'}`}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="cpp">C++</option>
            <option value="python">Python</option>
          </select>
        </div>

        
        <textarea
          rows={18}
          placeholder={`Write your ${language === 'cpp' ? 'C++' : 'Python'} code here...`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={`w-full p-4 mb-4 rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-800 text-white border-white/10 focus:ring-purple-500/50' : 'bg-white text-black border-gray-300 focus:ring-purple-400/50'}`}
        />

       
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Custom Input
          </label>
          <textarea
            rows={4}
            placeholder="Enter custom input here..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            className={`w-full p-3 rounded-lg font-mono text-sm resize-none focus:outline-none focus:ring-2 ${darkMode ? 'bg-gray-800 text-white border-white/10 focus:ring-purple-500/50' : 'bg-white text-black border-gray-300 focus:ring-purple-400/50'}`}
          />
        </div>

        
        <div className="flex gap-3 mb-4">
          <button
            onClick={runCode}
            disabled={!code.trim()}
            className={`px-6 py-2 rounded-lg font-semibold transition hover:scale-105 ${darkMode ? 'bg-red-600 text-white' : 'bg-red-600 text-white'} ${!code.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            Run Code
          </button>
          <button
            onClick={submitCode}
            disabled={submitting || !code.trim()}
            className={`px-6 py-2 rounded-lg font-semibold transition hover:scale-105 ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-700 hover:bg-blue-600 text-white'} ${submitting || !code.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>

        
        <section className={`mt-8 p-5 rounded-xl border ${darkMode ? 'bg-gray-900 border-white/10' : 'bg-white border-gray-200'} transition`}>
          <h3 className="text-xl font-bold mb-4"> AI Assistant</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <button
              onClick={handleHint}
              disabled={loadingHint}
              className={`flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition ${loadingHint ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loadingHint ? 'Generating...' : '💡 Get Hint'}
            </button>
            <button
              onClick={handleCodeReview}
              disabled={loadingReview}
              className={`flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition ${loadingReview ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loadingReview ? 'Reviewing...' : '🧠 Code Review'}
            </button>
          </div>

          {hint?.trim().length > 0 && (
            <div className={`p-4 rounded-lg whitespace-pre-wrap mt-3 border ${darkMode ? 'bg-yellow-900 border-yellow-500 text-yellow-100' : 'bg-yellow-100 border-yellow-300 text-yellow-800'}`}>
              <strong>Hint:</strong>
              <pre className="whitespace-pre-wrap">{hint}</pre>
            </div>
          )}

          {review?.trim().length > 0 && (
            <div className={`p-4 rounded-lg whitespace-pre-wrap mt-4 border ${darkMode ? 'bg-blue-900 border-blue-500 text-blue-100' : 'bg-blue-100 border-blue-300 text-blue-800'}`}>
              <strong>Code Review:</strong>
              <pre className="whitespace-pre-wrap">{review}</pre>
            </div>
          )}
        </section>

        
        
          {output && (
            <>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                {typeof output === 'string' && output.includes('⌛') ? 'Status' : 'Result'}
              </h3>
              <div className="font-mono text-sm">
                {typeof output === 'string' ? (
                  <pre className={`whitespace-pre-wrap ${output.startsWith('❌') ? (darkMode ? 'text-red-400' : 'text-red-600') : ''}`}>
                    {output}
                  </pre>
                ) : (
                  output
                )}
              </div>
            </>
          )}
        </div>
      </div>
    
  );
}