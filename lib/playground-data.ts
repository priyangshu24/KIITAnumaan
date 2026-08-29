// ---------------------------------------------------------------------------
// Playground Problem Bank — curated for KIIT placement companies
// ---------------------------------------------------------------------------

export type Difficulty = 'Easy' | 'Medium' | 'Hard'
export type Language = 'python' | 'cpp' | 'java' | 'javascript' | 'sql'
export type Company = 'All' | 'Amazon' | 'Microsoft' | 'HighRadius' | 'Deloitte' | 'Google' | 'Meta'
export type Topic = 'All' | 'Arrays' | 'Strings' | 'Sliding Window' | 'Hash Table' | 'Two Pointers' | 'Trees' | 'Graphs' | 'Dynamic Programming' | 'SQL' | 'Stack' | 'Heap' | 'Backtracking' | 'Linked List'

export interface TestCase {
  id: number
  input: string
  expectedOutput: string
  isHidden?: boolean
}

export interface Problem {
  id: string
  title: string
  difficulty: Difficulty
  companies: Company[]
  topics: Topic[]
  askedCount: number
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  testCases: TestCase[]
  starterCode: Record<Language, string>
  interviewSignal?: string[]
  similarProblems?: string[]
}

// Difficulty color mapping
export const difficultyColors: Record<Difficulty, { bg: string; text: string; border: string }> = {
  Easy: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10B981', border: 'rgba(16, 185, 129, 0.3)' },
  Medium: { bg: 'rgba(245, 158, 11, 0.1)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.3)' },
  Hard: { bg: 'rgba(239, 68, 68, 0.1)', text: '#EF4444', border: 'rgba(239, 68, 68, 0.3)' },
}

// Language display config
export const languageConfig: Record<Language, { label: string; monacoId: string }> = {
  python: { label: 'Python 3', monacoId: 'python' },
  cpp: { label: 'C++ 20', monacoId: 'cpp' },
  java: { label: 'Java 21', monacoId: 'java' },
  javascript: { label: 'JavaScript', monacoId: 'javascript' },
  sql: { label: 'SQL', monacoId: 'sql' },
}

export const PROBLEMS: Problem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    companies: ['Amazon', 'Microsoft', 'HighRadius', 'Google'],
    topics: ['Arrays', 'Hash Table'],
    askedCount: 48,
    description: 'Given an array of integers `nums` and an integer `target`, return *indices of the two numbers* such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the *same* element twice.\n\nYou can return the answer in any order.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0, 1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1, 2]' },
      { input: 'nums = [3,3], target = 6', output: '[0, 1]' },
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    testCases: [
      { id: 1, input: '[2,7,11,15]\n9', expectedOutput: '[0, 1]' },
      { id: 2, input: '[3,2,4]\n6', expectedOutput: '[1, 2]' },
      { id: 3, input: '[3,3]\n6', expectedOutput: '[0, 1]' },
      { id: 4, input: '[1,5,8,3,9,2]\n11', expectedOutput: '[1,4]', isHidden: true },
    ],
    starterCode: {
      python: 'def two_sum(nums: list[int], target: int) -> list[int]:\n    # Your code here\n    pass\n\nnums = list(map(int, input().strip("[] ").split(",")))\ntarget = int(input())\nprint(two_sum(nums, target))',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}\n\nint main() {\n    int n, target;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cin >> target;\n    auto res = twoSum(nums, target);\n    cout << "[" << res[0] << ", " << res[1] << "]" << endl;\n    return 0;\n}',
      java: 'import java.util.*;\n\npublic class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n}',
      javascript: 'function twoSum(nums, target) {\n    // Your code here\n    return [];\n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));',
      sql: '-- Not applicable for this problem',
    },
    interviewSignal: ['Asked in Amazon OA frequently for SDE-1 roles', 'HighRadius uses this as a warm-up in tech rounds', 'Microsoft uses variants with sorted arrays'],
    similarProblems: ['Three Sum', 'Two Sum II - Sorted Array', 'Four Sum'],
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta'],
    topics: ['Strings', 'Sliding Window', 'Hash Table'],
    askedCount: 24,
    description: 'Given a string `s`, find the length of the **longest substring** without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with the length of 3.' },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    testCases: [
      { id: 1, input: 'abcabcbb', expectedOutput: '3' },
      { id: 2, input: 'bbbbb', expectedOutput: '1' },
      { id: 3, input: 'pwwkew', expectedOutput: '3' },
      { id: 4, input: 'dvdf', expectedOutput: '3', isHidden: true },
    ],
    starterCode: {
      python: 'def length_of_longest_substring(s: str) -> int:\n    # Your code here\n    pass\n\ns = input()\nprint(length_of_longest_substring(s))',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    // Your code here\n    return 0;\n}\n\nint main() {\n    string s;\n    getline(cin, s);\n    cout << lengthOfLongestSubstring(s) << endl;\n    return 0;\n}',
      java: 'import java.util.*;\n\npublic class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Your code here\n        return 0;\n    }\n}',
      javascript: 'function lengthOfLongestSubstring(s) {\n    // Your code here\n    return 0;\n}\n\nconsole.log(lengthOfLongestSubstring("abcabcbb"));',
      sql: '-- Not applicable for this problem',
    },
    interviewSignal: ['Asked by Amazon frequently for SDE-1 roles', 'Recently reported in Microsoft virtual rounds'],
    similarProblems: ['Minimum Window Substring', 'Longest Repeating Character Replacement'],
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft', 'Google'],
    topics: ['Arrays', 'Two Pointers'],
    askedCount: 18,
    description: 'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return *an array of the non-overlapping intervals* that cover all the intervals in the input.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' },
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= start_i <= end_i <= 10^4'],
    testCases: [
      { id: 1, input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { id: 2, input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' },
      { id: 3, input: '[[1,4],[0,4]]', expectedOutput: '[[0,4]]', isHidden: true },
    ],
    starterCode: {
      python: 'def merge(intervals: list[list[int]]) -> list[list[int]]:\n    # Your code here\n    pass\n\nimport json\nintervals = json.loads(input())\nprint(json.dumps(merge(intervals)))',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<vector<int>> merge(vector<vector<int>>& intervals) {\n    // Your code here\n    return {};\n}\n\nint main() {\n    return 0;\n}',
      java: 'import java.util.*;\n\npublic class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your code here\n        return new int[][]{};\n    }\n}',
      javascript: 'function merge(intervals) {\n    // Your code here\n    return [];\n}\n\nconsole.log(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]])));',
      sql: '-- Not applicable for this problem',
    },
    interviewSignal: ['Common in Amazon SDE-1 OA (sorting + greedy)', 'Microsoft asks variants with meeting rooms'],
    similarProblems: ['Insert Interval', 'Meeting Rooms II'],
  },
  {
    id: 'max-subarray',
    title: "Maximum Subarray (Kadane's Algorithm)",
    difficulty: 'Medium',
    companies: ['Amazon', 'HighRadius', 'Deloitte'],
    topics: ['Arrays', 'Dynamic Programming'],
    askedCount: 32,
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return *its sum*.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    testCases: [
      { id: 1, input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { id: 2, input: '[1]', expectedOutput: '1' },
      { id: 3, input: '[5,4,-1,7,8]', expectedOutput: '23' },
    ],
    starterCode: {
      python: 'def max_sub_array(nums: list[int]) -> int:\n    # Your code here\n    pass\n\nimport json\nnums = json.loads(input())\nprint(max_sub_array(nums))',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Your code here\n    return 0;\n}\n\nint main() {\n    int n; cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cout << maxSubArray(nums) << endl;\n    return 0;\n}',
      java: 'public class Solution {\n    public int maxSubArray(int[] nums) {\n        // Your code here\n        return 0;\n    }\n}',
      javascript: 'function maxSubArray(nums) {\n    // Your code here\n    return 0;\n}\n\nconsole.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));',
      sql: '-- Not applicable for this problem',
    },
    interviewSignal: ["HighRadius asks Kadane's in aptitude + tech combo", 'Amazon OA warm-up problem'],
    similarProblems: ['Maximum Product Subarray', 'Best Time to Buy and Sell Stock'],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    companies: ['Amazon', 'Microsoft', 'HighRadius'],
    topics: ['Stack', 'Strings'],
    askedCount: 36,
    description: "Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['` and `']'`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: ['1 <= s.length <= 10^4', "s consists of parentheses only '()[]{}' ."],
    testCases: [
      { id: 1, input: '()', expectedOutput: 'true' },
      { id: 2, input: '()[]{}', expectedOutput: 'true' },
      { id: 3, input: '(]', expectedOutput: 'false' },
      { id: 4, input: '([)]', expectedOutput: 'false', isHidden: true },
    ],
    starterCode: {
      python: 'def is_valid(s: str) -> bool:\n    # Your code here\n    pass\n\ns = input()\nprint(str(is_valid(s)).lower())',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nbool isValid(string s) {\n    // Your code here\n    return false;\n}\n\nint main() {\n    string s;\n    cin >> s;\n    cout << (isValid(s) ? "true" : "false") << endl;\n    return 0;\n}',
      java: 'import java.util.*;\n\npublic class Solution {\n    public boolean isValid(String s) {\n        // Your code here\n        return false;\n    }\n}',
      javascript: 'function isValid(s) {\n    // Your code here\n    return false;\n}\n\nconsole.log(isValid("()[]{}"));',
      sql: '-- Not applicable for this problem',
    },
    interviewSignal: ['HighRadius tech round warm-up', 'Microsoft phone screen classic'],
    similarProblems: ['Generate Parentheses', 'Minimum Remove to Make Valid Parentheses'],
  },
  {
    id: 'binary-tree-level-order',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft'],
    topics: ['Trees', 'Graphs'],
    askedCount: 16,
    description: "Given the `root` of a binary tree, return the **level order traversal** of its nodes' values (i.e., from left to right, level by level).",
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]' },
      { input: 'root = [1]', output: '[[1]]' },
      { input: 'root = []', output: '[]' },
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    testCases: [
      { id: 1, input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]' },
      { id: 2, input: '[1]', expectedOutput: '[[1]]' },
      { id: 3, input: '[]', expectedOutput: '[]' },
    ],
    starterCode: {
      python: 'from collections import deque\nfrom typing import Optional\n\nclass TreeNode:\n    def __init__(self, val=0, left=None, right=None):\n        self.val = val\n        self.left = left\n        self.right = right\n\ndef level_order(root: Optional[TreeNode]) -> list[list[int]]:\n    # Your code here - BFS\n    pass',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode *left, *right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nvector<vector<int>> levelOrder(TreeNode* root) {\n    // Your code here - BFS\n    return {};\n}',
      java: 'import java.util.*;\n\nclass TreeNode {\n    int val;\n    TreeNode left, right;\n    TreeNode(int x) { val = x; }\n}\n\npublic class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        // Your code here - BFS\n        return new ArrayList<>();\n    }\n}',
      javascript: 'function levelOrder(root) {\n    // Your code here - BFS\n    return [];\n}',
      sql: '-- Not applicable for this problem',
    },
    interviewSignal: ['Amazon asks BFS variants in onsite rounds', 'Microsoft bar-raiser round tree question'],
    similarProblems: ['Binary Tree Zigzag Level Order Traversal', 'Binary Tree Right Side View'],
  },
  {
    id: 'top-k-customers-sql',
    title: 'Top K Customers by Revenue',
    difficulty: 'Medium',
    companies: ['HighRadius', 'Deloitte'],
    topics: ['SQL'],
    askedCount: 22,
    description: 'Write a SQL query to find the **top 5 customers** by total revenue from the `orders` table.\n\n**Schema:**\n```\ncustomers (customer_id INT, name VARCHAR, city VARCHAR)\norders (order_id INT, customer_id INT, amount DECIMAL, order_date DATE)\n```\n\nReturn columns: `name`, `city`, `total_revenue`\nOrder by total_revenue descending. Limit to 5 rows.',
    examples: [
      { input: 'See schema above', output: 'name | city | total_revenue\nJohn | NYC | 15000\n...' },
    ],
    constraints: ['Use standard SQL (MySQL/PostgreSQL compatible).', 'Handle NULL amounts by treating them as 0.'],
    testCases: [
      { id: 1, input: 'SELECT query', expectedOutput: '5 rows with name, city, total_revenue' },
    ],
    starterCode: {
      python: '# Use SQL tab for this problem',
      cpp: '// Use SQL tab for this problem',
      java: '// Use SQL tab for this problem',
      javascript: '// Use SQL tab for this problem',
      sql: '-- Write your SQL query here\nSELECT \n    c.name,\n    c.city,\n    -- Calculate total revenue\nFROM customers c\nJOIN orders o ON c.customer_id = o.customer_id\n-- Complete the query\n',
    },
    interviewSignal: ['HighRadius tech round - SQL joins + aggregation', 'Deloitte analyst - business analytics SQL'],
    similarProblems: ['Revenue by Product Category', 'Monthly Active Users'],
  },
  {
    id: 'sliding-window-max',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    companies: ['Amazon', 'Google', 'Microsoft'],
    topics: ['Sliding Window', 'Heap', 'Stack'],
    askedCount: 12,
    description: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn *the max sliding window*.',
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Window [1,3,-1] -> max 3, [3,-1,-3] -> max 3, [-1,-3,5] -> max 5, etc.' },
      { input: 'nums = [1], k = 1', output: '[1]' },
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    testCases: [
      { id: 1, input: '[1,3,-1,-3,5,3,6,7]\n3', expectedOutput: '[3,3,5,5,6,7]' },
      { id: 2, input: '[1]\n1', expectedOutput: '[1]' },
      { id: 3, input: '[1,-1]\n1', expectedOutput: '[1,-1]', isHidden: true },
    ],
    starterCode: {
      python: 'from collections import deque\n\ndef max_sliding_window(nums: list[int], k: int) -> list[int]:\n    # Your code here - monotonic deque\n    pass\n\nimport json\nnums = json.loads(input())\nk = int(input())\nprint(json.dumps(max_sliding_window(nums, k)))',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nvector<int> maxSlidingWindow(vector<int>& nums, int k) {\n    // Your code here - monotonic deque\n    return {};\n}',
      java: 'import java.util.*;\n\npublic class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        // Your code here - monotonic deque\n        return new int[]{};\n    }\n}',
      javascript: 'function maxSlidingWindow(nums, k) {\n    // Your code here - monotonic deque\n    return [];\n}\n\nconsole.log(maxSlidingWindow([1,3,-1,-3,5,3,6,7], 3));',
      sql: '-- Not applicable for this problem',
    },
    interviewSignal: ['Amazon onsite Round 2 - deque/monotonic stack', 'Google phone screen - O(n) required'],
    similarProblems: ['Min Stack', 'Longest Subarray With Maximum OR'],
  },
  {
    id: 'permutation-string',
    title: 'Permutation in String',
    difficulty: 'Medium',
    companies: ['Amazon', 'Microsoft'],
    topics: ['Strings', 'Sliding Window'],
    askedCount: 16,
    description: "Given two strings `s1` and `s2`, return `true` if `s2` contains a **permutation** of `s1`, or `false` otherwise.\n\nIn other words, return `true` if one of `s1`'s permutations is the substring of `s2`.",
    examples: [
      { input: 's1 = "ab", s2 = "eidbaooo"', output: 'true', explanation: 's2 contains one permutation of s1 ("ba").' },
      { input: 's1 = "ab", s2 = "eidboaoo"', output: 'false' },
    ],
    constraints: ['1 <= s1.length, s2.length <= 10^4', 's1 and s2 consist of lowercase English letters.'],
    testCases: [
      { id: 1, input: 'ab\neidbaooo', expectedOutput: 'true' },
      { id: 2, input: 'ab\neidboaoo', expectedOutput: 'false' },
      { id: 3, input: 'adc\ndcda', expectedOutput: 'true', isHidden: true },
    ],
    starterCode: {
      python: 'def check_inclusion(s1: str, s2: str) -> bool:\n    # Your code here - sliding window + frequency count\n    pass\n\ns1 = input()\ns2 = input()\nprint(str(check_inclusion(s1, s2)).lower())',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nbool checkInclusion(string s1, string s2) {\n    // Your code here\n    return false;\n}\n\nint main() {\n    string s1, s2;\n    cin >> s1 >> s2;\n    cout << (checkInclusion(s1, s2) ? "true" : "false") << endl;\n    return 0;\n}',
      java: 'public class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        // Your code here\n        return false;\n    }\n}',
      javascript: 'function checkInclusion(s1, s2) {\n    // Your code here\n    return false;\n}\n\nconsole.log(checkInclusion("ab", "eidbaooo"));',
      sql: '-- Not applicable for this problem',
    },
    interviewSignal: ['Amazon SDE-1 - sliding window pattern', 'Microsoft - anagram detection variant'],
    similarProblems: ['Find All Anagrams in a String', 'Minimum Window Substring'],
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'Hard',
    companies: ['Amazon', 'Microsoft', 'Google', 'Meta'],
    topics: ['Hash Table', 'Linked List'],
    askedCount: 14,
    description: 'Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with **positive** size capacity.\n- `int get(int key)` Return the value of the key if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the key if the key exists. Otherwise, add the key-value pair to the cache. If the number of keys exceeds the capacity, **evict the least recently used key**.\n\nThe functions `get` and `put` must each run in **O(1)** average time complexity.',
    examples: [
      { input: '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]', output: '[null,null,null,1,null,-1,null,-1,3,4]' },
    ],
    constraints: ['1 <= capacity <= 3000', '0 <= key <= 10^4', '0 <= value <= 10^5', 'At most 2 * 10^5 calls will be made to get and put.'],
    testCases: [
      { id: 1, input: '2\nput 1 1\nput 2 2\nget 1\nput 3 3\nget 2\nput 4 4\nget 1\nget 3\nget 4', expectedOutput: '1\n-1\n-1\n3\n4' },
    ],
    starterCode: {
      python: 'class LRUCache:\n    def __init__(self, capacity: int):\n        # Your code here\n        pass\n\n    def get(self, key: int) -> int:\n        # Your code here\n        pass\n\n    def put(self, key: int, value: int) -> None:\n        # Your code here\n        pass\n\n# Test\ncache = LRUCache(2)\ncache.put(1, 1)\ncache.put(2, 2)\nprint(cache.get(1))\ncache.put(3, 3)\nprint(cache.get(2))\ncache.put(4, 4)\nprint(cache.get(1))\nprint(cache.get(3))\nprint(cache.get(4))',
      cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nclass LRUCache {\npublic:\n    LRUCache(int capacity) {\n        // Your code here\n    }\n    int get(int key) {\n        // Your code here\n        return -1;\n    }\n    void put(int key, int value) {\n        // Your code here\n    }\n};',
      java: 'import java.util.*;\n\nclass LRUCache {\n    public LRUCache(int capacity) {\n        // Your code here\n    }\n    public int get(int key) {\n        // Your code here\n        return -1;\n    }\n    public void put(int key, int value) {\n        // Your code here\n    }\n}',
      javascript: 'class LRUCache {\n    constructor(capacity) {\n        // Your code here\n    }\n    get(key) {\n        // Your code here\n        return -1;\n    }\n    put(key, value) {\n        // Your code here\n    }\n}\n\nconst cache = new LRUCache(2);\ncache.put(1, 1);\ncache.put(2, 2);\nconsole.log(cache.get(1));\ncache.put(3, 3);\nconsole.log(cache.get(2));\ncache.put(4, 4);\nconsole.log(cache.get(1));\nconsole.log(cache.get(3));\nconsole.log(cache.get(4));',
      sql: '-- Not applicable for this problem',
    },
    interviewSignal: ['Amazon asks this in onsite round 2 for SDE-1', 'Microsoft Design round staple question'],
    similarProblems: ['LFU Cache', 'Design In-Memory File System'],
  },
]
