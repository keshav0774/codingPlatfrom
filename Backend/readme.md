keshav = Code@2026!Builds$;

"firstName":"Ayush",
   "lastname":"Gangwar",
   "emailId":"ayush997@gmail.com",
    "password":"GANgwar@#74651"
   "role":"Admin"


 "firstName":"KESHAV",
   "lastname":"MISHRA",
   "emailId":"keshav0774@gmail.com",
   "password":"SAMsung@2104",
   "role":"Admin"


USER INFO {
  firstName: 'Parth Mishra',
  emailId: 'parth.mishra251110@gmail.com',
  password: 'MIShra@0774'
}



{
  "title": "Binary Tree Level Order Traversal",
  "description": "Given the root of a binary tree, return the level order traversal of its nodes' values (left to right, level by level).",
  "difficulty": "Medium",
  "tags": "tree",
  "visibleTestCases": [
  {
    "input": "[3,9,20,null,null,15,7]",
    "output": "[[3],[9,20],[15,7]]",
    "explanation": "Level order traversal of the tree"
  },
  {
    "input": "[1]",
    "output": "[[1]]",
    "explanation": "Single node tree"
  }
],

  "hiddenTestCases": [
    {
      "input": "10\n1 2 3 4 5 6 7 8 9 10",
      "output": "1\n2 3\n4 5 6 7\n8 9 10"
    }
  ],
  "startCode": [
    {
      "language": "cpp",
      "initialCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        // write your code here\n        return {};\n    }\n};"
    }
  ],
  "referenceSolution": [
    {
      "language": "cpp",
      "completeCode": "#include <bits/stdc++.h>\nusing namespace std;\n\nstruct TreeNode {\n    int val;\n    TreeNode* left;\n    TreeNode* right;\n    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}\n};\n\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        vector<vector<int>> res;\n        if (!root) return res;\n        queue<TreeNode*> q;\n        q.push(root);\n        while (!q.empty()) {\n            int sz = q.size();\n            vector<int> level;\n            for (int i = 0; i < sz; i++) {\n                TreeNode* node = q.front(); q.pop();\n                level.push_back(node->val);\n                if (node->left) q.push(node->left);\n                if (node->right) q.push(node->right);\n            }\n            res.push_back(level);\n        }\n        return res;\n    }\n};\n\nint main() {\n    int n;\n    cin >> n;\n    if (n == 0) return 0;\n\n    vector<int> arr(n);\n    for (int i = 0; i < n; i++) cin >> arr[i];\n\n    TreeNode* root = new TreeNode(arr[0]);\n    queue<TreeNode*> q;\n    q.push(root);\n    int i = 1;\n\n    while (!q.empty() && i < n) {\n        TreeNode* cur = q.front(); q.pop();\n        if (arr[i] != -1) {\n            cur->left = new TreeNode(arr[i]);\n            q.push(cur->left);\n        }\n        i++;\n        if (i < n && arr[i] != -1) {\n            cur->right = new TreeNode(arr[i]);\n            q.push(cur->right);\n        }\n        i++;\n    }\n\n    Solution sol;\n    auto ans = sol.levelOrder(root);\n    for (auto &lvl : ans) {\n        for (int x : lvl) cout << x << \" \";\n        cout << \"\\n\";\n    }\n    return 0;\n}"
    }
  ]
}








_id
6980eb22ad4eb76cd00117f7
title
"Middle Node of Linked List"
description
"Given the head of a singly linked list, return the middle node of the …"
difficulty
"Easy"
tags
"linkedlist"

visibleTestCases
Array (2)

0
Object
input
"[1,2,3,4,5]"
output
"[3,4,5]"
explanation
"The middle node is 3, returning the list from node 3 gives [3,4,5]"
_id
6980eb22ad4eb76cd00117f8

1
Object
input
"[1,2,3,4,5,6]"
output
"[4,5,6]"
explanation
"There are two middle nodes 3 and 4, we return the second one (4)"
_id
6980eb22ad4eb76cd00117f9

hiddenTestCases
Array (2)

0
Object
input
"[5,10,15,20,25,30,35]"
output
"[20,25,30,35]"
_id
6980eb22ad4eb76cd00117fa

1
Object
input
"[]"
output
"[]"
_id
6980eb22ad4eb76cd00117fb

startCode
Array (4)

0
Object
language
"c++"
initialCode
"#include <iostream>
#include <vector>
#include <string>
#include <sstr…"
_id
6980eb22ad4eb76cd00117fc

1
Object
language
"java"
initialCode
"import java.util.*;

class Solution {
    static class ListNode {
    …"
_id
6980eb22ad4eb76cd00117fd

2
Object
language
"javascript"
initialCode
"function ListNode(val) {
    this.val = val;
    this.next = null;
}

…"
_id
6980eb22ad4eb76cd00117fe

3
Object
language
"python"
initialCode
"import sys

class ListNode:
    def __init__(self, val=0, next=None):
…"
_id
6980eb22ad4eb76cd00117ff

referenceSolution
Array (4)

0
Object
language
"c++"
completeCode
"#include <iostream>
#include <vector>
#include <string>
#include <sstr…"
_id
6980eb22ad4eb76cd0011800

1
Object
language
"java"
completeCode
"import java.util.*;

class Solution {
    static class ListNode {
    …"
_id
6980eb22ad4eb76cd0011801

2
Object
language
"javascript"
completeCode
"function ListNode(val) {
    this.val = val;
    this.next = null;
}

…"
_id
6980eb22ad4eb76cd0011802

3
Object
language
"python"
completeCode
"import sys

class ListNode:
    def __init__(self, val=0, next=None):
…"
_id
6980eb22ad4eb76cd0011803
problemCreator
69785fde5714e7b8a48e4852
createdAt
2026-02-02T18:21:22.661+00:00
updatedAt
2026-02-02T18:21:22.661+00:00
__v
0