-- =============================================================================
-- KIIT ANUMAAN — Initial DSA Seed Data
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Topics Seed Data
-- ---------------------------------------------------------------------------
insert into public.topics (id, name, slug, description, category, order_index)
values
  ('arrays', 'Arrays', 'arrays', 'Core linear collection problems, prefix sums, and element manipulation.', 'DSA', 1),
  ('strings', 'Strings', 'strings', 'String parsing, anagrams, palindromes, and substring patterns.', 'DSA', 2),
  ('hashing', 'Hashing', 'hashing', 'Fast lookup, frequency maps, set operations, and hash tables.', 'DSA', 3),
  ('two-pointers', 'Two Pointers', 'two-pointers', 'Opposite-end and fast-slow pointer techniques on sorted/linear data.', 'DSA', 4),
  ('sliding-window', 'Sliding Window', 'sliding-window', 'Dynamic and fixed size window techniques for sub-arrays/sub-strings.', 'DSA', 5),
  ('binary-search', 'Binary Search', 'binary-search', 'Logarithmic search on monotonic spaces and rotated arrays.', 'DSA', 6),
  ('sorting', 'Sorting & Selection', 'sorting', 'Comparison sorts, custom comparators, and quick select.', 'DSA', 7),
  ('kadane', 'Kadane''s Algorithm', 'kadane', 'Optimal dynamic subarray sum and product optimizations.', 'DSA', 8),
  ('intervals', 'Interval Operations', 'intervals', 'Merging, overlapping, and inserting interval ranges.', 'DSA', 9)
on conflict (id) do update set
  name = excluded.name,
  slug = excluded.slug,
  description = excluded.description,
  category = excluded.category,
  order_index = excluded.order_index;

-- ---------------------------------------------------------------------------
-- 2. Questions Seed Data
-- ---------------------------------------------------------------------------

-- 1. Two Sum
insert into public.questions (
  id, topic_id, title, slug, difficulty, description,
  examples, constraints, starter_code, solution, test_cases,
  company, tags, order_index
) values (
  'two-sum',
  'arrays',
  'Two Sum',
  'two-sum',
  'Easy',
  'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.',
  '[{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."}, {"input": "nums = [3,2,4], target = 6", "output": "[1,2]", "explanation": "nums[1] + nums[2] == 6, so we return [1, 2]."}, {"input": "nums = [3,3], target = 6", "output": "[0,1]"}]'::jsonb,
  ARRAY[
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.'
  ],
  '{
    "python": "def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    seen = {}\n    for i, n in enumerate(nums):\n        diff = target - n\n        if diff in seen:\n            return [seen[diff], i]\n        seen[n] = i\n    return []\n",
    "javascript": "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n",
    "java": "import java.util.HashMap;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        HashMap<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) {\n                return new int[] { map.get(diff), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[] {};\n    }\n}\n",
    "cpp": "#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (seen.count(diff)) return {seen[diff], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};\n"
  }'::jsonb,
  'Use a hash map to store each number and its index. For each element, check if target - current exists in map in O(1) time, yielding an O(n) total time solution.',
  '[
    {"id": 1, "input": "[2,7,11,15]\n9", "expectedOutput": "[0, 1]"},
    {"id": 2, "input": "[3,2,4]\n6", "expectedOutput": "[1, 2]"},
    {"id": 3, "input": "[3,3]\n6", "expectedOutput": "[0, 1]"}
  ]'::jsonb,
  ARRAY['Amazon', 'Google', 'Microsoft', 'Meta', 'Apple'],
  ARRAY['Array', 'Hash Table'],
  1
) on conflict (id) do update set
  title = excluded.title,
  topic_id = excluded.topic_id,
  difficulty = excluded.difficulty,
  description = excluded.description,
  examples = excluded.examples,
  constraints = excluded.constraints,
  starter_code = excluded.starter_code,
  test_cases = excluded.test_cases,
  company = excluded.company,
  tags = excluded.tags;

-- 2. Best Time to Buy and Sell Stock
insert into public.questions (
  id, topic_id, title, slug, difficulty, description,
  examples, constraints, starter_code, solution, test_cases,
  company, tags, order_index
) values (
  'best-time-to-buy-and-sell-stock',
  'arrays',
  'Best Time to Buy and Sell Stock',
  'best-time-to-buy-and-sell-stock',
  'Easy',
  'You are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.\n\nReturn the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.',
  '[{"input": "prices = [7,1,5,3,6,4]", "output": "5", "explanation": "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5."}, {"input": "prices = [7,6,4,3,1]", "output": "0", "explanation": "In this case, no transactions are done and max profit = 0."}]'::jsonb,
  ARRAY[
    '1 <= prices.length <= 10^5',
    '0 <= prices[i] <= 10^4'
  ],
  '{
    "python": "def maxProfit(prices: list[int]) -> int:\n    min_price = float(''inf'')\n    max_profit = 0\n    for p in prices:\n        if p < min_price:\n            min_price = p\n        elif p - min_price > max_profit:\n            max_profit = p - min_price\n    return max_profit\n",
    "javascript": "function maxProfit(prices) {\n    let minPrice = Infinity;\n    let maxProfit = 0;\n    for (const p of prices) {\n        if (p < minPrice) minPrice = p;\n        else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n    }\n    return maxProfit;\n}\n",
    "java": "class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE;\n        int maxProfit = 0;\n        for (int p : prices) {\n            if (p < minPrice) minPrice = p;\n            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n        }\n        return maxProfit;\n    }\n}\n",
    "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minPrice = 1e9, maxProfit = 0;\n        for (int p : prices) {\n            minPrice = min(minPrice, p);\n            maxProfit = max(maxProfit, p - minPrice);\n        }\n        return maxProfit;\n    }\n};\n"
  }'::jsonb,
  'Keep track of the minimum price seen so far and the maximum profit reachable by selling today in O(n) time and O(1) space.',
  '[
    {"id": 1, "input": "[7,1,5,3,6,4]", "expectedOutput": "5"},
    {"id": 2, "input": "[7,6,4,3,1]", "expectedOutput": "0"}
  ]'::jsonb,
  ARRAY['Amazon', 'Microsoft', 'Google', 'Meta'],
  ARRAY['Array', 'Dynamic Programming'],
  2
) on conflict (id) do update set
  title = excluded.title,
  topic_id = excluded.topic_id,
  difficulty = excluded.difficulty,
  description = excluded.description,
  examples = excluded.examples,
  constraints = excluded.constraints,
  starter_code = excluded.starter_code,
  test_cases = excluded.test_cases,
  company = excluded.company,
  tags = excluded.tags;

-- 3. Contains Duplicate
insert into public.questions (
  id, topic_id, title, slug, difficulty, description,
  examples, constraints, starter_code, solution, test_cases,
  company, tags, order_index
) values (
  'contains-duplicate',
  'hashing',
  'Contains Duplicate',
  'contains-duplicate',
  'Easy',
  'Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.',
  '[{"input": "nums = [1,2,3,1]", "output": "true"}, {"input": "nums = [1,2,3,4]", "output": "false"}, {"input": "nums = [1,1,1,3,3,4,3,2,4,2]", "output": "true"}]'::jsonb,
  ARRAY[
    '1 <= nums.length <= 10^5',
    '-10^9 <= nums[i] <= 10^9'
  ],
  '{
    "python": "def containsDuplicate(nums: list[int]) -> bool:\n    seen = set()\n    for n in nums:\n        if n in seen:\n            return True\n        seen.add(n)\n    return False\n",
    "javascript": "function containsDuplicate(nums) {\n    const seen = new Set();\n    for (const n of nums) {\n        if (seen.has(n)) return true;\n        seen.add(n);\n    }\n    return false;\n}\n",
    "java": "import java.util.HashSet;\n\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        HashSet<Integer> seen = new HashSet<>();\n        for (int n : nums) {\n            if (!seen.add(n)) return true;\n        }\n        return false;\n    }\n}\n",
    "cpp": "#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true;\n            seen.insert(n);\n        }\n        return false;\n    }\n};\n"
  }'::jsonb,
  'Insert elements into a Hash Set while scanning. If an element is already present, return true.',
  '[
    {"id": 1, "input": "[1,2,3,1]", "expectedOutput": "true"},
    {"id": 2, "input": "[1,2,3,4]", "expectedOutput": "false"},
    {"id": 3, "input": "[1,1,1,3,3,4,3,2,4,2]", "expectedOutput": "true"}
  ]'::jsonb,
  ARRAY['Amazon', 'Apple', 'Adobe', 'Microsoft'],
  ARRAY['Array', 'Hash Table', 'Sorting'],
  3
) on conflict (id) do update set
  title = excluded.title,
  topic_id = excluded.topic_id,
  difficulty = excluded.difficulty,
  description = excluded.description,
  examples = excluded.examples,
  constraints = excluded.constraints,
  starter_code = excluded.starter_code,
  test_cases = excluded.test_cases,
  company = excluded.company,
  tags = excluded.tags;

-- 4. Maximum Subarray (Kadane's)
insert into public.questions (
  id, topic_id, title, slug, difficulty, description,
  examples, constraints, starter_code, solution, test_cases,
  company, tags, order_index
) values (
  'maximum-subarray',
  'kadane',
  'Maximum Subarray',
  'maximum-subarray',
  'Medium',
  'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
  '[{"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6", "explanation": "The subarray [4,-1,2,1] has the largest sum 6."}, {"input": "nums = [1]", "output": "1"}, {"input": "nums = [5,4,-1,7,8]", "output": "23"}]'::jsonb,
  ARRAY[
    '1 <= nums.length <= 10^5',
    '-10^4 <= nums[i] <= 10^4'
  ],
  '{
    "python": "def maxSubArray(nums: list[int]) -> int:\n    cur_sum = 0\n    max_sum = nums[0]\n    for n in nums:\n        cur_sum = max(n, cur_sum + n)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum\n",
    "javascript": "function maxSubArray(nums) {\n    let cur = nums[0];\n    let max = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        cur = Math.max(nums[i], cur + nums[i]);\n        max = Math.max(max, cur);\n    }\n    return max;\n}\n",
    "java": "class Solution {\n    public int maxSubArray(int[] nums) {\n        int cur = nums[0], max = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            cur = Math.max(nums[i], cur + nums[i]);\n            max = Math.max(max, cur);\n        }\n        return max;\n    }\n}\n",
    "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int cur = nums[0], maxS = nums[0];\n        for (size_t i = 1; i < nums.size(); i++) {\n            cur = max(nums[i], cur + nums[i]);\n            maxS = max(maxS, cur);\n        }\n        return maxS;\n    }\n};\n"
  }'::jsonb,
  'Kadane algorithm: maintaining running maximum subarray sum ending at current position in O(n) time.',
  '[
    {"id": 1, "input": "[-2,1,-3,4,-1,2,1,-5,4]", "expectedOutput": "6"},
    {"id": 2, "input": "[1]", "expectedOutput": "1"},
    {"id": 3, "input": "[5,4,-1,7,8]", "expectedOutput": "23"}
  ]'::jsonb,
  ARRAY['Amazon', 'Microsoft', 'Google', 'Cisco'],
  ARRAY['Array', 'Divide and Conquer', 'Dynamic Programming'],
  4
) on conflict (id) do update set
  title = excluded.title,
  topic_id = excluded.topic_id,
  difficulty = excluded.difficulty,
  description = excluded.description,
  examples = excluded.examples,
  constraints = excluded.constraints,
  starter_code = excluded.starter_code,
  test_cases = excluded.test_cases,
  company = excluded.company,
  tags = excluded.tags;

-- 5. Binary Search
insert into public.questions (
  id, topic_id, title, slug, difficulty, description,
  examples, constraints, starter_code, solution, test_cases,
  company, tags, order_index
) values (
  'binary-search',
  'binary-search',
  'Binary Search',
  'binary-search',
  'Easy',
  'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime complexity.',
  '[{"input": "nums = [-1,0,3,5,9,12], target = 9", "output": "4", "explanation": "9 exists in nums and its index is 4"}, {"input": "nums = [-1,0,3,5,9,12], target = 2", "output": "-1", "explanation": "2 does not exist in nums so return -1"}]'::jsonb,
  ARRAY[
    '1 <= nums.length <= 10^4',
    '-10^4 < nums[i], target < 10^4',
    'All the integers in nums are unique.',
    'nums is sorted in ascending order.'
  ],
  '{
    "python": "def search(nums: list[int], target: int) -> int:\n    low, high = 0, len(nums) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            low = mid + 1\n        else:\n            high = mid - 1\n    return -1\n",
    "javascript": "function search(nums, target) {\n    let low = 0, high = nums.length - 1;\n    while (low <= high) {\n        const mid = Math.floor((low + high) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) low = mid + 1;\n        else high = mid - 1;\n    }\n    return -1;\n}\n",
    "java": "class Solution {\n    public int search(int[] nums, int target) {\n        int low = 0, high = nums.length - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n}\n",
    "cpp": "#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int low = 0, high = nums.size() - 1;\n        while (low <= high) {\n            int mid = low + (high - low) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) low = mid + 1;\n            else high = mid - 1;\n        }\n        return -1;\n    }\n};\n"
  }'::jsonb,
  'Classic binary search maintaining low and high bounds.',
  '[
    {"id": 1, "input": "[-1,0,3,5,9,12]\n9", "expectedOutput": "4"},
    {"id": 2, "input": "[-1,0,3,5,9,12]\n2", "expectedOutput": "-1"}
  ]'::jsonb,
  ARRAY['Microsoft', 'Amazon', 'Apple', 'Google'],
  ARRAY['Array', 'Binary Search'],
  5
) on conflict (id) do update set
  title = excluded.title,
  topic_id = excluded.topic_id,
  difficulty = excluded.difficulty,
  description = excluded.description,
  examples = excluded.examples,
  constraints = excluded.constraints,
  starter_code = excluded.starter_code,
  test_cases = excluded.test_cases,
  company = excluded.company,
  tags = excluded.tags;

-- 6. Valid Anagram
insert into public.questions (
  id, topic_id, title, slug, difficulty, description,
  examples, constraints, starter_code, solution, test_cases,
  company, tags, order_index
) values (
  'valid-anagram',
  'strings',
  'Valid Anagram',
  'valid-anagram',
  'Easy',
  'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.\n\nAn Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
  '[{"input": "s = \"anagram\", t = \"nagaram\"", "output": "true"}, {"input": "s = \"rat\", t = \"car\"", "output": "false"}]'::jsonb,
  ARRAY[
    '1 <= s.length, t.length <= 5 * 10^4',
    's and t consist of lowercase English letters.'
  ],
  '{
    "python": "def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t):\n        return False\n    count = {}\n    for char in s:\n        count[char] = count.get(char, 0) + 1\n    for char in t:\n        if char not in count or count[char] == 0:\n            return False\n        count[char] -= 1\n    return True\n",
    "javascript": "function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const map = {};\n    for (const c of s) map[c] = (map[c] || 0) + 1;\n    for (const c of t) {\n        if (!map[c]) return false;\n        map[c]--;\n    }\n    return true;\n}\n",
    "java": "class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (char c : s.toCharArray()) count[c - ''a'']++;\n        for (char c : t.toCharArray()) {\n            if (--count[c - ''a''] < 0) return false;\n        }\n        return true;\n    }\n}\n",
    "cpp": "#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.length() != t.length()) return false;\n        vector<int> count(26, 0);\n        for (char c : s) count[c - ''a'']++;\n        for (char c : t) {\n            if (--count[c - ''a''] < 0) return false;\n        }\n        return true;\n    }\n};\n"
  }'::jsonb,
  'Frequency map or 26-element array counting characters.',
  '[
    {"id": 1, "input": "\"anagram\"\n\"nagaram\"", "expectedOutput": "true"},
    {"id": 2, "input": "\"rat\"\n\"car\"", "expectedOutput": "false"}
  ]'::jsonb,
  ARRAY['Uber', 'Google', 'Amazon', 'Bloomberg'],
  ARRAY['Hash Table', 'String', 'Sorting'],
  6
) on conflict (id) do update set
  title = excluded.title,
  topic_id = excluded.topic_id,
  difficulty = excluded.difficulty,
  description = excluded.description,
  examples = excluded.examples,
  constraints = excluded.constraints,
  starter_code = excluded.starter_code,
  test_cases = excluded.test_cases,
  company = excluded.company,
  tags = excluded.tags;

-- 7. Valid Palindrome
insert into public.questions (
  id, topic_id, title, slug, difficulty, description,
  examples, constraints, starter_code, solution, test_cases,
  company, tags, order_index
) values (
  'valid-palindrome',
  'two-pointers',
  'Valid Palindrome',
  'valid-palindrome',
  'Easy',
  'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.\n\nGiven a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
  '[{"input": "s = \"A man, a plan, a canal: Panama\"", "output": "true", "explanation": "\"amanaplanacanalpanama\" is a palindrome."}, {"input": "s = \"race a car\"", "output": "false", "explanation": "\"raceacar\" is not a palindrome."}, {"input": "s = \" \"", "output": "true", "explanation": "s is an empty string \"\" after removing non-alphanumeric characters, which is a palindrome."}]'::jsonb,
  ARRAY[
    '1 <= s.length <= 2 * 10^5',
    's consists only of printable ASCII characters.'
  ],
  '{
    "python": "def isPalindrome(s: str) -> bool:\n    filtered = [c.lower() for c in s if c.isalnum()]\n    return filtered == filtered[::-1]\n",
    "javascript": "function isPalindrome(s) {\n    const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '''');\n    let l = 0, r = cleaned.length - 1;\n    while (l < r) {\n        if (cleaned[l] !== cleaned[r]) return false;\n        l++; r--;\n    }\n    return true;\n}\n",
    "java": "class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l)) != Character.toLowerCase(s.charAt(r))) return false;\n            l++; r--;\n        }\n        return true;\n    }\n}\n",
    "cpp": "#include <string>\n#include <cctype>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !isalnum(s[l])) l++;\n            while (l < r && !isalnum(s[r])) r--;\n            if (tolower(s[l]) != tolower(s[r])) return false;\n            l++; r--;\n        }\n        return true;\n    }\n};\n"
  }'::jsonb,
  'Two-pointer check advancing past non-alphanumerics and comparing lowercase chars.',
  '[
    {"id": 1, "input": "\"A man, a plan, a canal: Panama\"", "expectedOutput": "true"},
    {"id": 2, "input": "\"race a car\"", "expectedOutput": "false"},
    {"id": 3, "input": "\" \"", "expectedOutput": "true"}
  ]'::jsonb,
  ARRAY['Meta', 'Microsoft', 'Spotify', 'Amazon'],
  ARRAY['Two Pointers', 'String'],
  7
) on conflict (id) do update set
  title = excluded.title,
  topic_id = excluded.topic_id,
  difficulty = excluded.difficulty,
  description = excluded.description,
  examples = excluded.examples,
  constraints = excluded.constraints,
  starter_code = excluded.starter_code,
  test_cases = excluded.test_cases,
  company = excluded.company,
  tags = excluded.tags;

-- 8. Merge Intervals
insert into public.questions (
  id, topic_id, title, slug, difficulty, description,
  examples, constraints, starter_code, solution, test_cases,
  company, tags, order_index
) values (
  'merge-intervals',
  'intervals',
  'Merge Intervals',
  'merge-intervals',
  'Medium',
  'Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
  '[{"input": "intervals = [[1,3],[2,6],[8,10],[15,18]]", "output": "[[1,6],[8,10],[15,18]]", "explanation": "Since intervals [1,3] and [2,6] overlap, merge them into [1,6]."}, {"input": "intervals = [[1,4],[4,5]]", "output": "[[1,5]]", "explanation": "Intervals [1,4] and [4,5] are considered overlapping."}]'::jsonb,
  ARRAY[
    '1 <= intervals.length <= 10^4',
    'intervals[i].length == 2',
    '0 <= start_i <= end_i <= 10^4'
  ],
  '{
    "python": "def merge(intervals: list[list[int]]) -> list[list[int]]:\n    intervals.sort(key=lambda x: x[0])\n    merged = []\n    for inv in intervals:\n        if not merged or merged[-1][1] < inv[0]:\n            merged.append(inv)\n        else:\n            merged[-1][1] = max(merged[-1][1], inv[1])\n    return merged\n",
    "javascript": "function merge(intervals) {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const merged = [];\n    for (const inv of intervals) {\n        if (merged.length === 0 || merged[merged.length - 1][1] < inv[0]) {\n            merged.push(inv);\n        } else {\n            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], inv[1]);\n        }\n    }\n    return merged;\n}\n",
    "java": "import java.util.*;\n\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));\n        List<int[]> merged = new ArrayList<>();\n        for (int[] inv : intervals) {\n            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < inv[0]) {\n                merged.add(inv);\n            } else {\n                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], inv[1]);\n            }\n        }\n        return merged.toArray(new int[merged.size()][]);\n    }\n}\n",
    "cpp": "#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> merged;\n        for (const auto& inv : intervals) {\n            if (merged.empty() || merged.back()[1] < inv[0]) {\n                merged.push_back(inv);\n            } else {\n                merged.back()[1] = max(merged.back()[1], inv[1]);\n            }\n        }\n        return merged;\n    }\n};\n"
  }'::jsonb,
  'Sort intervals by start time and iterate through comparing current interval start with last merged end.',
  '[
    {"id": 1, "input": "[[1,3],[2,6],[8,10],[15,18]]", "expectedOutput": "[[1,6],[8,10],[15,18]]"},
    {"id": 2, "input": "[[1,4],[4,5]]", "expectedOutput": "[[1,5]]"}
  ]'::jsonb,
  ARRAY['Google', 'Amazon', 'Meta', 'Microsoft', 'Oracle'],
  ARRAY['Array', 'Sorting'],
  8
) on conflict (id) do update set
  title = excluded.title,
  topic_id = excluded.topic_id,
  difficulty = excluded.difficulty,
  description = excluded.description,
  examples = excluded.examples,
  constraints = excluded.constraints,
  starter_code = excluded.starter_code,
  test_cases = excluded.test_cases,
  company = excluded.company,
  tags = excluded.tags;
