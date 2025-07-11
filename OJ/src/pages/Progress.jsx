import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const problems = {
  '1': { title: 'Two Sum', difficulty: 'Easy' },
  '2': { title: 'Palindrome Check', difficulty: 'Easy' },
  '3': { title: 'Binary Search', difficulty: 'Medium' },
  '4': { title: 'Longest Substring Without Repeating Characters', difficulty: 'Hard' },
  '5': { title: 'Count Digits', difficulty: 'Easy' },
  '6': { title: 'Rotate Matrix', difficulty: 'Medium' },
  '7': { title: 'Longest Palindromic Substring', difficulty: 'Medium' },
  '8': { title: 'Subarray Sum Equals K', difficulty: 'Medium' },
  '9': { title: 'Word Break', difficulty: 'Hard' },
  '10': { title: 'Maximal Rectangle', difficulty: 'Hard' },
};

const COLORS = ['#34d399', '#fbbf24', '#f87171'];

export default function ProgressPage() {
  const [solved, setSolved] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const { darkMode } = useTheme();

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

  const barData = [
    { name: 'Easy', solved: easy, total: Object.values(problems).filter(p => p.difficulty === 'Easy').length },
    { name: 'Medium', solved: medium, total: Object.values(problems).filter(p => p.difficulty === 'Medium').length },
    { name: 'Hard', solved: hard, total: Object.values(problems).filter(p => p.difficulty === 'Hard').length }
  ];

  const toggleExpand = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className={`pt-20 px-4 sm:px-6 md:px-10 min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-black text-white' : 'bg-white text-black'
    }`}>
      <div className="max-w-6xl mx-auto">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2  underline underline-offset-8 decoration-pink-400">
            Your Progress: 
          </h1>
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your problem-solving journey and achievements
          </p>
        </motion.div>

        
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`rounded-xl p-6 shadow-md border transition-all duration-300 ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium mb-1">Total Solved</h3>
                <p className="text-3xl font-bold">{solved.length}</p>
              </div>
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                <svg className="w-6 h-6 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </motion.div>

          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`rounded-xl p-6 shadow-md border transition-all duration-300 ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}
          >
            <h3 className="text-sm font-medium mb-3">Difficulty Distribution</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    innerRadius={30}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      borderColor: darkMode ? '#374151' : '#E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className={`rounded-xl p-6 shadow-md border transition-all duration-300 ${
              darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
            }`}
          >
            <h3 className="text-sm font-medium mb-3">Completion Progress</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#1F2937' : '#FFFFFF',
                      borderColor: darkMode ? '#374151' : '#E5E7EB',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Bar dataKey="solved" name="Solved">
                    {barData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className={`rounded-xl p-6 shadow-md border mb-10 transition-all duration-300 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
          }`}
        >
          <h2 className="text-lg font-semibold mb-4">Difficulty Breakdown</h2>
          <div className="grid grid-cols-3 gap-4">
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-green-900/20' : 'bg-green-100'
            }`}>
              <div className="text-2xl font-bold text-green-500">{easy}</div>
              <div className="text-sm">Easy</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-yellow-900/20' : 'bg-yellow-100'
            }`}>
              <div className="text-2xl font-bold text-yellow-500">{medium}</div>
              <div className="text-sm">Medium</div>
            </div>
            <div className={`p-4 rounded-lg text-center ${
              darkMode ? 'bg-red-900/20' : 'bg-red-100'
            }`}>
              <div className="text-2xl font-bold text-red-500">{hard}</div>
              <div className="text-sm">Hard</div>
            </div>
          </div>
        </motion.div>

        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className={`rounded-xl p-6 shadow-md border transition-all duration-300 ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-100 border-gray-200'
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Submission History</h2>
            <span className={`text-sm px-3 py-1 rounded-full ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}>
              {submissions.length} total
            </span>
          </div>

          {submissions.length === 0 ? (
            <div className={`p-8 text-center rounded-lg ${
              darkMode ? 'bg-gray-800/30' : 'bg-gray-200'
            }`}>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                No submissions yet. Solve some problems to see your history here!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.slice().reverse().map((sub, idx) => {
                const isExpanded = expandedIndex === idx;
                const problem = problems[sub.problemId] || { title: 'Unknown', difficulty: 'Unknown' };

                const difficultyColor = problem.difficulty === 'Easy'
                  ? 'text-green-500'
                  : problem.difficulty === 'Medium'
                  ? 'text-yellow-500'
                  : 'text-red-500';

                const resultBadge = sub.result === 'Passed'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-700'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-700';

                return (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`rounded-lg overflow-hidden transition-all duration-200 ${
                      darkMode ? 'bg-gray-800/60 border-white/10' : 'bg-white border-gray-200'
                    } ${isExpanded ? 'ring-2 ring-purple-500/30 border-0' : 'border'}`}
                  >
                    <div
                      onClick={() => toggleExpand(idx)}
                      className={`flex items-center justify-between p-4 cursor-pointer ${
                        darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${difficultyColor}`}></div>
                        <div>
                          <p className={`font-medium ${
                            darkMode ? 'text-gray-100' : 'text-gray-900'
                          }`}>
                            {problem.title}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {new Date(sub.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${difficultyColor} ${
                          darkMode ? 'bg-opacity-20' : 'bg-opacity-10'
                        }`}>
                          {problem.difficulty}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${resultBadge}`}>
                          {sub.result}
                        </span>
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
                          <div className={`p-4 border-t ${
                            darkMode ? 'border-gray-700' : 'border-gray-200'
                          }`}>
                            <h4 className="text-sm font-medium mb-2">Submitted Code</h4>
                            <pre className={`p-3 rounded text-sm overflow-x-auto ${
                              darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {sub.code || '// No code available'}
                            </pre>
                          </div>

                          {Array.isArray(sub.details) && sub.details.length > 0 && (
                            <div className={`p-4 border-t ${
                              darkMode ? 'border-gray-700 bg-gray-900/40' : 'border-gray-200 bg-gray-50'
                            }`}>
                              <h4 className="text-sm font-medium mb-3">Test Results</h4>
                              <div className="grid gap-2">
                                {sub.details.map((test, tIdx) => (
                                  <div
                                    key={tIdx}
                                    className={`p-2 rounded border text-xs ${
                                      test.passed 
                                        ? darkMode ? 'border-green-500/30 bg-green-900/20' : 'border-green-400/30 bg-green-100'
                                        : darkMode ? 'border-red-500/30 bg-red-900/20' : 'border-red-400/30 bg-red-100'
                                    }`}
                                  >
                                    <div className="flex justify-between">
                                      <span>Test Case {tIdx + 1}</span>
                                      <span className={test.passed ? 'text-green-500' : 'text-red-500'}>
                                        {test.passed ? 'Passed' : 'Failed'}
                                      </span>
                                    </div>
                                    <div className="mt-1 grid grid-cols-3 gap-1">
                                      <div>
                                        <div className="font-semibold">Input</div>
                                        <code className="truncate">{test.input}</code>
                                      </div>
                                      <div>
                                        <div className="font-semibold">Expected</div>
                                        <code>{test.expected}</code>
                                      </div>
                                      <div>
                                        <div className="font-semibold">Output</div>
                                        <code className={test.passed ? 'text-green-500' : 'text-red-500'}>
                                          {test.output}
                                        </code>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}