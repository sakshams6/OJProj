import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';

const SubmissionsContext = createContext();

export const useSubmissions = () => useContext(SubmissionsContext);

export const SubmissionsProvider = ({ children }) => {
  const [solvedProblems, setSolvedProblems] = useState([]);

  useEffect(() => {
    const fetchSolvedProblems = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        // This API call is based on your previous code
        const res = await axios.get('/profile');
        if (res.data && res.data.user) {
           setSolvedProblems(res.data.user.solvedProblems || []);
        }
      } catch (err) {
        console.error('Failed to fetch solved problems:', err);
      }
    };

    fetchSolvedProblems();
  }, []);

  const addSolvedProblem = (problemId) => {
    // This function adds a new solved problem ID to our list
    if (!solvedProblems.includes(problemId)) {
      setSolvedProblems(prevSolved => [...prevSolved, problemId]);
    }
  };

  const value = { solvedProblems, addSolvedProblem };

  return (
    <SubmissionsContext.Provider value={value}>
      {children}
    </SubmissionsContext.Provider>
  );
};