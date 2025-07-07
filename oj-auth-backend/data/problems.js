module.exports = {
  '1': {
    title: 'Two Sum',
    difficulty: 'Easy',
    testCases: [
      { input: '4\n2 7 11 15\n9\n', output: 'Indices: 0 and 1\n' },
      { input: '3\n3 2 4\n6\n', output: 'Indices: 1 and 2\n' },
      { input: '5\n1 2 3 4 5\n9\n', output: 'Indices: 3 and 4\n' },
      { input: '2\n5 5\n10\n', output: 'Indices: 0 and 1\n' },
      { input: '6\n1 3 5 6 9 11\n12\n', output: 'Indices: 1 and 4\n' },
      { input: '3\n0 4 3\n7\n', output: 'Indices: 1 and 2\n' }
    ]
  },
  '2': {
    title: 'Palindrome Check',
    difficulty: 'Easy',
    testCases: [
      { input: 'racecar\n', output: 'Yes\n' },
      { input: 'madam\n', output: 'Yes\n' },
      { input: 'hello\n', output: 'No\n' },
      { input: 'a\n', output: 'Yes\n' },
      { input: 'abcba\n', output: 'Yes\n' },
      { input: 'abccba\n', output: 'Yes\n' }
    ]
  },
  '3': {
    title: 'Binary Search',
    difficulty: 'Medium',
    testCases: [
      { input: '6\n-1 0 3 5 9 12\n9\n', output: '4\n' },
      { input: '6\n-1 0 3 5 9 12\n2\n', output: '-1\n' },
      { input: '1\n1\n1\n', output: '0\n' },
      { input: '5\n1 2 3 4 5\n3\n', output: '2\n' },
      { input: '4\n10 20 30 40\n25\n', output: '-1\n' },
      { input: '6\n1 3 5 7 9 11\n7\n', output: '3\n' }
    ]
  },
  '4': {
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Hard',
    testCases: [
      { input: 'abcabcbb\n', output: '3\n' },
      { input: 'bbbbb\n', output: '1\n' },
      { input: 'pwwkew\n', output: '3\n' },
      { input: 'abcdefg\n', output: '7\n' },
      { input: 'abba\n', output: '2\n' },
      { input: 'aab\n', output: '2\n' }
    ]
  },
  '5': {
    title: 'Count Digits',
    difficulty: 'Easy',
    testCases: [
      { input: '1012\n', output: '3\n' },
      { input: '12\n', output: '2\n' },
      { input: '12345\n', output: '3\n' },
      { input: '111\n', output: '3\n' },
      { input: '10\n', output: '1\n' },
      { input: '99\n', output: '2\n' }
    ]
  },
  '6': {
    title: 'Rotate Matrix',
    difficulty: 'Medium',
    testCases: [
      { input: '2\n1 2\n3 4\n', output: '3 1\n4 2\n' },
      { input: '3\n1 2 3\n4 5 6\n7 8 9\n', output: '7 4 1\n8 5 2\n9 6 3\n' },
      { input: '1\n5\n', output: '5\n' },
      { input: '2\n0 0\n0 0\n', output: '0 0\n0 0\n' },
      { input: '2\n1 0\n0 1\n', output: '0 1\n1 0\n' },
      { input: '2\n5 1\n2 3\n', output: '2 5\n3 1\n' }
    ]
  },
  '7': {
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    testCases: [
      { input: 'babad\n', output: 'bab\n' },
      { input: 'cbbd\n', output: 'bb\n' },
      { input: 'a\n', output: 'a\n' },
      { input: 'ac\n', output: 'a\n' },
      { input: 'forgeeksskeegfor\n', output: 'geeksskeeg\n' },
      { input: 'abacdfgdcaba\n', output: 'aba\n' }
    ]
  },
  '8': {
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    testCases: [
      { input: '5\n1 1 1 1 1\n2\n', output: '4\n' },
      { input: '6\n1 2 3 4 5 6\n9\n', output: '2\n' },
      { input: '3\n1 2 1\n3\n', output: '2\n' },
      { input: '4\n1 1 1 1\n2\n', output: '3\n' },
      { input: '3\n1 -1 0\n0\n', output: '3\n' },
      { input: '5\n1 2 3 4 5\n15\n', output: '1\n' }
    ]
  },
  '9': {
    title: 'Word Break',
    difficulty: 'Hard',
    testCases: [
      { input: 'leetcode\n2\nleet code\n', output: 'true\n' },
      { input: 'applepenapple\n2\napple pen\n', output: 'true\n' },
      { input: 'catsandog\n5\ncats dog sand and cat\n', output: 'false\n' },
      { input: 'a\n1\na\n', output: 'true\n' },
      { input: 'aaaaaaa\n2\na aa\n', output: 'true\n' },
      { input: 'pineapplepenapple\n3\npine apple pen\n', output: 'true\n' }
    ]
  },
  '10': {
    title: 'Maximal Rectangle',
    difficulty: 'Hard',
    testCases: [
      { input: '4 5\n1 0 1 0 0\n1 0 1 1 1\n1 1 1 1 1\n1 0 0 1 0\n', output: '6\n' },
      { input: '2 2\n0 0\n0 0\n', output: '0\n' },
      { input: '2 2\n1 1\n1 1\n', output: '4\n' },
      { input: '3 3\n1 0 1\n1 1 1\n1 1 1\n', output: '6\n' },
      { input: '1 4\n1 1 1 1\n', output: '4\n' },
      { input: '3 1\n1\n1\n1\n', output: '3\n' }
    ]
  }
};
