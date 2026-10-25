/**
 * ==========================================================================
 * STUDY BATTLE - Comprehensive Study Guide & Curriculum Database (study-data.js)
 * High-quality explanations, code walkthroughs, and practical examples
 * for all 6 subjects and programming languages.
 * ==========================================================================
 */

const STUDY_GUIDE_DATA = {
  // =========================================================================
  // 1. PYTHON
  // =========================================================================
  'python': {
    subjectName: 'Python',
    icon: '🐍',
    category: 'languages',
    difficulty: 'Beginner to Intermediate',
    description: 'Master Python syntax, clean data structures, functional constructs, and object-oriented architecture.',
    topics: {
      'Variables & Data Types': {
        title: 'Variables & Data Types in Python',
        badge: 'Core Fundamentals',
        difficulty: 'Beginner',
        readTime: '4 min read',
        summary: 'Understand dynamic typing, primitive data types, and the critical distinction between mutable and immutable objects.',
        overview: `Python is a dynamically typed, high-level language. You do not need to explicitly declare the type of a variable; Python infers it at runtime. However, understanding **mutability** (whether an object's value can be changed in-place) is fundamental to writing bug-free Python code.
        
Immutable types cannot be changed once created. Any modification creates a brand-new object in memory. Mutable types can be altered in-place without changing their memory address.`,
        keyConcepts: [
          {
            term: 'Dynamic Typing',
            description: 'Variables can be reassigned to values of different types at any time without type casting.'
          },
          {
            term: 'Primitive Types',
            description: '<code>int</code>, <code>float</code>, <code>str</code>, <code>bool</code>, and <code>NoneType</code>.'
          },
          {
            term: 'Immutable Sequences',
            description: '<code>tuple</code> and <code>str</code> cannot be altered after creation. This makes them hashable and safe as dictionary keys.'
          },
          {
            term: 'Mutable Collections',
            description: '<code>list</code>, <code>dict</code>, and <code>set</code> can have elements added, removed, or updated in-place.'
          }
        ],
        syntax: `# Variable assignment (No keywords required)
variable_name = value

# Type inspection
type(variable_name)
id(variable_name)  # Memory address pointer`,
        examples: [
          {
            title: 'Example 1: Mutability Difference (List vs Tuple)',
            explanation: 'Observe how mutating a list succeeds, while modifying a tuple raises a TypeError.',
            code: `# 1. Mutable: List
player_scores = [10, 20, 30]
player_scores[0] = 99  # Allowed: In-place update
player_scores.append(40)
print("Updated List:", player_scores)

# 2. Immutable: Tuple
player_coordinates = (100, 250)
try:
    player_coordinates[0] = 999  # Raises TypeError!
except TypeError as error:
    print("Tuple Error:", error)`,
            output: `Updated List: [99, 20, 30, 40]
Tuple Error: 'tuple' object does not support item assignment`
          },
          {
            title: 'Example 2: String Slicing & Type Casting',
            explanation: 'Strings are immutable sequences in Python supporting slice notation [start:stop:step].',
            code: `raw_input = "  Gladiator-Level-04  "
clean_text = raw_input.strip()

# Slice extraction
title = clean_text[:9]     # "Gladiator"
level_num = int(clean_text[-2:])  # Cast "04" to integer 4

print(f"Gladiator: {title} | Numerical Level: {level_num + 1}")`,
            output: `Gladiator: Gladiator | Numerical Level: 5`
          }
        ],
        pitfalls: [
          'Confusing assignment with copying: <code>b = a</code> does not copy a list; both point to the same memory address! Use <code>b = a.copy()</code> instead.',
          'Using mutable default arguments in functions (e.g. <code>def add(item, lst=[])</code>). The list persists across function calls!'
        ],
        proTips: [
          'Use <code>is</code> to compare identity (memory address, like <code>x is None</code>) and <code>==</code> to compare value equality.',
          'Leverage type hints (<code>def calculate(xp: int) -> bool:</code>) introduced in Python 3.5+ to document expectations.'
        ],
        keyTakeaways: [
          'Integers, floats, strings, and tuples are IMMUTABLE.',
          'Lists, dictionaries, and sets are MUTABLE.',
          'Tuples can be dictionary keys; lists cannot because lists are unhashable.'
        ]
      },

      'Functions & Scope': {
        title: 'Functions & Scope (LEGB Rule)',
        badge: 'Modular Programming',
        difficulty: 'Beginner',
        readTime: '5 min read',
        summary: 'Master defining functions, default arguments, *args, **kwargs, and the LEGB variable resolution hierarchy.',
        overview: `Functions in Python are first-class citizens: they can be assigned to variables, passed as arguments, and returned from other functions.
        
When Python searches for the value of a variable inside a function, it follows the **LEGB rule**:
1. **L**ocal: Inside the current function.
2. **E**nclosing: Inside any outer nesting functions.
3. **G**lobal: Module-level variables.
4. **B**uilt-in: Python core names (like <code>len</code>, <code>range</code>, <code>print</code>).`,
        keyConcepts: [
          {
            term: '*args (Positional Variadic)',
            description: 'Packs an arbitrary number of positional arguments into a <code>tuple</code>.'
          },
          {
            term: '**kwargs (Keyword Variadic)',
            description: 'Packs arbitrary named arguments into a <code>dict</code>.'
          },
          {
            term: 'global keyword',
            description: 'Instructs Python to modify an existing variable at the module level rather than creating a new local shadow.'
          },
          {
            term: 'nonlocal keyword',
            description: 'Binds a variable to the nearest enclosing non-global scope (crucial for closures).'
          }
        ],
        syntax: `def function_name(param1, *args, default_val=10, **kwargs):
    """Docstring explaining purpose"""
    return result`,
        examples: [
          {
            title: 'Example 1: Flexible Functions with *args and **kwargs',
            explanation: 'Building a flexible battle reward calculator that takes any number of bonus multipliers.',
            code: `def calculate_bounty(base_xp, *bonuses, **gladiator_metadata):
    total_xp = base_xp + sum(bonuses)
    
    # Check if a streak multiplier was passed in kwargs
    if gladiator_metadata.get('streak_active'):
        total_xp = int(total_xp * 1.5)
        
    print(f"Gladiator {gladiator_metadata.get('name', 'Anonymous')}: {total_xp} XP Awarded!")
    return total_xp

# Usage:
calculate_bounty(100, 20, 15, 10, name="Alex Hunter", streak_active=True)`,
            output: `Gladiator Alex Hunter: 217 XP Awarded!`
          },
          {
            title: 'Example 2: Scope Demonstration & Nonlocal Closure',
            explanation: 'Using nonlocal to maintain private state inside a counter function.',
            code: `def create_xp_tracker(starting_xp=0):
    current_xp = starting_xp  # Enclosing scope
    
    def add_xp(points):
        nonlocal current_xp  # Modifies enclosing variable
        current_xp += points
        return current_xp
        
    return add_xp

player1_tracker = create_xp_tracker(100)
print("After Battle 1:", player1_tracker(50))
print("After Battle 2:", player1_tracker(75))`,
            output: `After Battle 1: 150
After Battle 2: 225`
          }
        ],
        pitfalls: [
          'Attempting to modify a global variable without the <code>global</code> keyword will raise an <code>UnboundLocalError</code> if referenced before assignment.',
          'Placing positional arguments after default arguments in the function signature triggers a SyntaxError.'
        ],
        proTips: [
          'Always keep functions small and focused on a single responsibility.',
          'Use docstrings (<code>"""Docstring"""</code>) to document parameters and return types.'
        ],
        keyTakeaways: [
          'LEGB: Local → Enclosing → Global → Built-in.',
          '*args gives you a tuple; **kwargs gives you a dictionary.',
          'Functions are first-class objects and can be returned or passed around.'
        ]
      },

      'List Comprehensions': {
        title: 'List & Dict Comprehensions in Python',
        badge: 'Pythonic Mastery',
        difficulty: 'Intermediate',
        readTime: '4 min read',
        summary: 'Write concise, high-performance transformations for lists, dictionaries, and sets using idiomatic Python syntax.',
        overview: `List comprehensions provide an elegant, readable, and faster way to create new lists from existing iterables. Behind the scenes, Python optimizes list comprehensions at the C bytecode level, making them significantly faster than equivalent manual <code>for</code> loops with <code>append()</code> calls.
        
They can also include conditional filters (<code>if</code>) and conditional value expressions (<code>x if condition else y</code>).`,
        keyConcepts: [
          {
            term: 'Basic Syntax',
            description: '<code>[expression for item in iterable]</code>'
          },
          {
            term: 'Filtering Syntax',
            description: '<code>[expression for item in iterable if condition]</code>'
          },
          {
            term: 'Ternary Syntax',
            description: '<code>[val_if_true if condition else val_if_false for item in iterable]</code>'
          },
          {
            term: 'Dictionary Comprehension',
            description: '<code>{key_expr: val_expr for item in iterable}</code>'
          }
        ],
        syntax: `# Standard List Comprehension:
[transform(item) for item in iterable if condition(item)]

# Dictionary Comprehension:
{key: value for key, value in iterable}`,
        examples: [
          {
            title: 'Example 1: Filtering & Transforming Quiz Scores',
            explanation: 'Extract passing scores (>= 70), add a +5 point curve, and filter out failing attempts.',
            code: `raw_scores = [65, 88, 92, 45, 78, 100, 58]

# Traditional way: 5 lines of code
# passing_curved = []
# for s in raw_scores:
#     if s >= 70:
#         passing_curved.append(s + 5)

# Pythonic List Comprehension: 1 line!
passing_curved = [score + 5 for score in raw_scores if score >= 70]

print("Original:", raw_scores)
print("Passing Curved:", passing_curved)`,
            output: `Original: [65, 88, 92, 45, 78, 100, 58]
Passing Curved: [93, 97, 83, 105]`
          },
          {
            title: 'Example 2: Dictionary Comprehension for Subject XP',
            explanation: 'Transforming a list of subject names into an initialized user progress dictionary.',
            code: `subjects = ['Python', 'JavaScript', 'Java', 'DBMS']

# Build dictionary mapping Subject -> Initialized Stats
curriculum_tracker = {sub: {'level': 1, 'mastered': False} for sub in subjects}

print("Generated Curriculum Object:")
import json
print(json.dumps(curriculum_tracker, indent=2))`,
            output: `Generated Curriculum Object:
{
  "Python": {
    "level": 1,
    "mastered": false
  },
  "JavaScript": {
    "level": 1,
    "mastered": false
  },
  "Java": {
    "level": 1,
    "mastered": false
  },
  "DBMS": {
    "level": 1,
    "mastered": false
  }
}`
          }
        ],
        pitfalls: [
          'Over-nesting comprehensions (e.g. 3 nested loops in one line). When readability suffers, refactor to standard loops!',
          'Confusing the placement of <code>if</code>: Filter conditions belong at the END; ternary conditional values belong at the FRONT.'
        ],
        proTips: [
          'If you only need to iterate over the items once (e.g., inside <code>sum()</code>), use a Generator Expression with parentheses <code>(x for x in data)</code> to save RAM.',
          'Set comprehensions <code>{x for x in list}</code> automatically deduplicate entries.'
        ],
        keyTakeaways: [
          'Faster than traditional for-loops with .append().',
          'Clean, expressive one-liners for mapping and filtering.',
          'Can be extended to dictionaries using <code>{k: v for ...}</code> and sets using <code>{v for ...}</code>.'
        ]
      },

      'OOP Basics & Classes': {
        title: 'Object-Oriented Programming (OOP) & Classes',
        badge: 'Architecture',
        difficulty: 'Intermediate',
        readTime: '6 min read',
        summary: 'Understand classes, constructors (__init__), instance methods, self pointer, and inheritance in Python.',
        overview: `Object-Oriented Programming is a paradigm centered around blueprinting software into **classes** and instantiating individual **objects**. In Python, everything is an object.
        
A class defines the attributes (data) and methods (behavior) that its instances share. The <code>self</code> parameter represents the specific instance being operated on.`,
        keyConcepts: [
          {
            term: '__init__ Constructor',
            description: 'Special dunder (double underscore) method invoked automatically when a new object is created.'
          },
          {
            term: 'The self Parameter',
            description: 'Explicit reference to the instance executing the method. Always required as the first argument of instance methods.'
          },
          {
            term: 'Encapsulation',
            description: 'Grouping data and functions that manipulate that data. Private attributes use a leading underscore (<code>_protected</code> or <code>__private</code>).'
          },
          {
            term: 'Inheritance & super()',
            description: 'Creating specialized child classes that inherit behaviors and attributes from a parent class.'
          }
        ],
        syntax: `class ClassName(ParentClass):
    def __init__(self, attribute1, attribute2):
        self.attribute1 = attribute1
        self.attribute2 = attribute2

    def action(self):
        return f"{self.attribute1} performed an action"`,
        examples: [
          {
            title: 'Example 1: Gladiator Class Definition & Methods',
            explanation: 'Defining a Gladiator class with health, level, and attack actions.',
            code: `class Gladiator:
    def __init__(self, name, rank="Novice"):
        self.name = name
        self.rank = rank
        self.health = 100
        self.xp = 0

    def attack(self, target):
        damage = 25
        target.health -= damage
        self.xp += 15
        return f"⚔️ {self.name} dealt {damage} damage to {target.name}! ({target.health} HP left)"

    def is_alive(self):
        return self.health > 0

# Instantiating objects
p1 = Gladiator("Alex", "Grandmaster")
p2 = Gladiator("Shadow Bot", "Apprentice")

print(p1.attack(p2))
print(f"Shadow Bot Status: {'Alive' if p2.is_alive() else 'Defeated'}")`,
            output: `⚔️ Alex dealt 25 damage to Shadow Bot! (75 HP left)
Shadow Bot Status: Alive`
          },
          {
            title: 'Example 2: Inheritance with super()',
            explanation: 'Specializing a base Gladiator into a CodeGladiator with custom attributes.',
            code: `class CodeGladiator(Gladiator):
    def __init__(self, name, programming_language):
        # Call the parent class constructor
        super().__init__(name, rank="Code Master")
        self.language = programming_language

    def cast_spell(self):
        return f"✨ {self.name} compiled a bug-free {self.language} algorithm!"

hero = CodeGladiator("Sophia", "Python")
print(f"Name: {hero.name} | Language: {hero.language} | Rank: {hero.rank}")
print(hero.cast_spell())`,
            output: `Name: Sophia | Language: Python | Rank: Code Master
✨ Sophia compiled a bug-free Python algorithm!`
          }
        ],
        pitfalls: [
          'Forgetting <code>self</code> as the first argument in method definitions leads to <code>TypeError: takes 0 positional arguments but 1 was given</code>.',
          'Modifying mutable class-level attributes directly instead of instance-level attributes (<code>self.items</code>).'
        ],
        proTips: [
          'Implement <code>__str__</code> and <code>__repr__</code> dunder methods to return clean debugging representations of your objects.',
          'Use <code>@dataclass</code> decorator (from <code>dataclasses</code> module) for classes primarily used to store data.'
        ],
        keyTakeaways: [
          '<code>__init__</code> initializes instance variables.',
          '<code>self</code> links methods to the calling object.',
          'Inheritance allows code reuse and hierarchy modeling.'
        ]
      }
    }
  },

  // =========================================================================
  // 2. JAVASCRIPT
  // =========================================================================
  'javascript': {
    subjectName: 'JavaScript',
    icon: '⚡',
    category: 'languages',
    difficulty: 'Intermediate',
    description: 'Modern ES6+ syntax, asynchronous programming, closures, event-driven architecture, and DOM mastery.',
    topics: {
      'ES6 Syntax & Scopes': {
        title: 'Modern ES6+ Syntax, let/const & Block Scoping',
        badge: 'Modern Standards',
        difficulty: 'Beginner',
        readTime: '5 min read',
        summary: 'Learn why const and let replaced var, arrow functions, template literals, and destructuring.',
        overview: `ECMAScript 2015 (ES6) modernized JavaScript. The most important fundamental change was introducing <code>let</code> and <code>const</code>, which are **block-scoped**, solving years of bugs caused by function-scoped and hoisted <code>var</code> declarations.
        
ES6 also introduced arrow functions, destructuring assignment, spread/rest operators (<code>...</code>), and template literals.`,
        keyConcepts: [
          {
            term: 'const vs let',
            description: '<code>const</code> declares a block-scoped binding that cannot be reassigned. <code>let</code> allows reassignment. Both avoid hoisting pitfalls.'
          },
          {
            term: 'Arrow Functions',
            description: 'Compact syntax: <code>(param) => expression</code>. Crucially, arrow functions lexically bind <code>this</code> from their enclosing scope.'
          },
          {
            term: 'Destructuring',
            description: 'Unpack properties from objects or values from arrays into distinct variables in one clean statement.'
          },
          {
            term: 'Spread & Rest (...) ',
            description: 'Spread expands iterables into individual arguments; rest collects remaining arguments into an array.'
          }
        ],
        syntax: `// Block-scoped constant
const MAX_STREAK = 7;

// Arrow function with implicit return
const calculateBonus = (xp, multiplier = 1.2) => xp * multiplier;

// Object destructuring
const { name, level } = user;`,
        examples: [
          {
            title: 'Example 1: Scoping Difference (var vs let)',
            explanation: 'Demonstrating how block scope preserves i inside asynchronous timeouts.',
            code: `// With let: Each loop iteration gets its own block-scoped variable 'i'
for (let i = 1; i <= 3; i++) {
  setTimeout(() => {
    console.log(\`Gladiator Tick: #\${i}\`);
  }, 50 * i);
}

// Destructuring & Template Literal Example
const gladiator = { username: 'AlexHunter', rank: 'Gladiator', points: 1250 };
const { username, points } = gladiator;
console.log(\`User \${username} has accumulated \${points.toLocaleString()} XP!\`);`,
            output: `User AlexHunter has accumulated 1,250 XP!
Gladiator Tick: #1
Gladiator Tick: #2
Gladiator Tick: #3`
          },
          {
            title: 'Example 2: Object & Array Spread Operations',
            explanation: 'Cloning and updating state immutably using the spread operator.',
            code: `const baseSettings = { sound: true, timer: 'strict', theme: 'navy' };

// Create updated settings immutably without mutating original
const userCustomSettings = {
  ...baseSettings,
  theme: 'high-contrast',
  vibration: false
};

console.log('Original Settings:', baseSettings.theme);
console.log('User Settings:', userCustomSettings.theme);`,
            output: `Original Settings: navy
User Settings: high-contrast`
          }
        ],
        pitfalls: [
          'Declaring an object with <code>const</code> does NOT freeze its properties! You can still do <code>obj.prop = 5</code>. Use <code>Object.freeze(obj)</code> for true immutability.',
          'Using arrow functions as object methods when you need access to the object via <code>this</code> (arrow functions do not bind their own <code>this</code>).'
        ],
        proTips: [
          'Default to <code>const</code> for everything. Only switch to <code>let</code> when you know reassignment is required.',
          'Never use <code>var</code> in modern JavaScript development.'
        ],
        keyTakeaways: [
          '<code>const</code> and <code>let</code> are block-scoped (inside {}).',
          'Arrow functions provide clean syntax and lexical <code>this</code>.',
          'Destructuring and spread operators streamline state management.'
        ]
      },

      'Async/Await & Promises': {
        title: 'Asynchronous JavaScript: Promises & Async/Await',
        badge: 'Asynchronous Flow',
        difficulty: 'Intermediate',
        readTime: '6 min read',
        summary: 'Master non-blocking asynchronous execution, Promise chaining, the Event Loop, and clean async/await error handling.',
        overview: `JavaScript runs on a single-threaded event loop. To prevent long-running tasks (like network HTTP requests or timers) from freezing the user interface, JavaScript handles them asynchronously.
        
A **Promise** is an object representing the eventual completion or failure of an asynchronous operation. <code>async/await</code> is syntactic sugar built on top of Promises, allowing you to write asynchronous code that reads like clean synchronous code.`,
        keyConcepts: [
          {
            term: 'Promise States',
            description: '<code>pending</code> (initial), <code>fulfilled</code> (operation succeeded), or <code>rejected</code> (operation failed).'
          },
          {
            term: 'async keyword',
            description: 'Declares an asynchronous function. Async functions ALWAYS return a Promise implicitly.'
          },
          {
            term: 'await keyword',
            description: 'Pauses execution of the async function until the Promise resolves or rejects. Can only be used inside async functions.'
          },
          {
            term: 'try...catch Error Handling',
            description: 'Catches Promise rejections cleanly without messy .catch() callbacks.'
          }
        ],
        syntax: `async function fetchBattleData(subjectId) {
  try {
    const response = await fetch(\`/api/subjects/\${subjectId}\`);
    if (!response.ok) throw new Error('Network error');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch failed:', error.message);
  }
}`,
        examples: [
          {
            title: 'Example 1: Simulating an Asynchronous Battle Matchmaker',
            explanation: 'Using Promises and await to simulate opponent search and battle initialization.',
            code: `function findOpponent(subject) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const matchFound = true;
      if (matchFound) {
        resolve({ opponent: 'CyberBot 9000', rank: 'Gold', subject });
      } else {
        reject(new Error('Matchmaking timed out'));
      }
    }, 150);
  });
}

async function startArenaBattle() {
  console.log('🔍 Searching for an arena opponent...');
  try {
    const match = await findOpponent('JavaScript ES6');
    console.log(\`⚔️ Match Found! You vs \${match.opponent} [\${match.rank}]\`);
  } catch (err) {
    console.error('Arena Error:', err.message);
  }
}

startArenaBattle();`,
            output: `🔍 Searching for an arena opponent...
⚔️ Match Found! You vs CyberBot 9000 [Gold]`
          },
          {
            title: 'Example 2: Concurrent Execution with Promise.all()',
            explanation: 'Running multiple independent async tasks in parallel for optimal performance.',
            code: `const fetchUserData = () => Promise.resolve({ user: 'Alex', xp: 1250 });
const fetchCurriculum = () => Promise.resolve(['Python', 'JS', 'Java']);

async function loadDashboard() {
  // Fire both requests concurrently in parallel
  const [userData, curriculum] = await Promise.all([
    fetchUserData(),
    fetchCurriculum()
  ]);

  console.log(\`Dashboard Ready for \${userData.user}. Loaded \${curriculum.length} subjects.\`);
}

loadDashboard();`,
            output: `Dashboard Ready for Alex. Loaded 3 subjects.`
          }
        ],
        pitfalls: [
          'Awaiting sequentially in a loop when requests are independent: use <code>Promise.all()</code> to fetch concurrently.',
          'Forgetting to handle rejections with <code>try...catch</code>, leading to unhandled promise rejection warnings in the browser console.'
        ],
        proTips: [
          'Use <code>Promise.allSettled()</code> if you want to inspect results of all promises even if one fails.',
          'Always check <code>response.ok</code> when using the Fetch API, as 404 and 500 status codes do not reject the promise!'
        ],
        keyTakeaways: [
          'Async functions always return a Promise.',
          '<code>await</code> unwraps the Promise resolution value or throws on rejection.',
          'Use <code>try/catch</code> blocks around <code>await</code> calls for bulletproof error handling.'
        ]
      },

      'Closures & Higher Order Functions': {
        title: 'Closures & Higher Order Functions in JS',
        badge: 'Functional Programming',
        difficulty: 'Intermediate',
        readTime: '5 min read',
        summary: 'Understand lexical scoping, function factories, private variables, and methods like map, filter, and reduce.',
        overview: `A **closure** is the combination of a function bundled together with references to its surrounding state (the **lexical environment**). In JavaScript, every inner function retains access to variables declared in its outer enclosing function, even after the outer function has finished executing!
        
A **Higher Order Function (HOF)** is any function that takes another function as an argument or returns a function.`,
        keyConcepts: [
          {
            term: 'Lexical Scoping',
            description: 'Where variables are declared in source code determines where they are accessible.'
          },
          {
            term: 'Data Encapsulation',
            description: 'Closures enable private variables that cannot be accessed or manipulated directly from outside.'
          },
          {
            term: 'Array.prototype.map()',
            description: 'Transforms every item in an array into a new item.'
          },
          {
            term: 'Array.prototype.filter()',
            description: 'Returns a new array containing only items that satisfy a truthy condition.'
          },
          {
            term: 'Array.prototype.reduce()',
            description: 'Accumulates array items down into a single result (e.g. sum, object map).'
          }
        ],
        syntax: `function createCounter() {
  let count = 0; // Private variable
  return {
    increment: () => ++count,
    getCount: () => count
  };
}`,
        examples: [
          {
            title: 'Example 1: Secure Private Streak Counter via Closure',
            explanation: 'The streak variable cannot be modified from the global window; only via the returned API.',
            code: `function createStreakTracker(initialStreak = 0) {
  let streak = initialStreak; // Private state
  
  return {
    winBattle: () => {
      streak += 1;
      return streak;
    },
    resetStreak: () => {
      streak = 0;
      return streak;
    },
    getStreak: () => streak
  };
}

const myStreak = createStreakTracker(3);
console.log('Streak after win 1:', myStreak.winBattle());
console.log('Streak after win 2:', myStreak.winBattle());
console.log('Current Streak Value:', myStreak.getStreak());`,
            output: `Streak after win 1: 4
Streak after win 2: 5
Current Streak Value: 5`
          },
          {
            title: 'Example 2: Higher Order Functions (map, filter, reduce)',
            explanation: 'Processing battle logs using functional array methods.',
            code: `const battleScores = [
  { topic: 'Closures', score: 100 },
  { topic: 'Async', score: 60 },
  { topic: 'DOM', score: 90 },
  { topic: 'ES6', score: 40 }
];

// 1. Filter: Passing scores only (>= 70)
const passingBattles = battleScores.filter(b => b.score >= 70);

// 2. Map: Extract topic names
const passedTopics = passingBattles.map(b => b.topic);

// 3. Reduce: Calculate average score
const totalPoints = battleScores.reduce((acc, curr) => acc + curr.score, 0);
const averageScore = totalPoints / battleScores.length;

console.log('Passed Topics:', passedTopics);
console.log('Overall Average Score:', averageScore);`,
            output: `Passed Topics: [ 'Closures', 'DOM' ]
Overall Average Score: 72.5`
          }
        ],
        pitfalls: [
          'Holding large closures in memory that are never garbage collected can cause memory leaks.',
          'Mutating the accumulator in <code>reduce()</code> unexpectedly instead of returning the modified accumulator.'
        ],
        proTips: [
          'Use closures to build function factories, like custom logging or permission checkers: <code>hasRole("admin")</code>.',
          'Prefer declarative methods (<code>filter</code>, <code>map</code>) over imperative <code>for</code> loops for cleaner code.'
        ],
        keyTakeaways: [
          'Closures remember their outer environment even after outer function return.',
          'Enables truly private state without classes.',
          'Higher order functions make data transformation clean and declarative.'
        ]
      },

      'DOM Manipulation & Events': {
        title: 'DOM Manipulation & Event Delegation in JavaScript',
        badge: 'Frontend Engineering',
        difficulty: 'Intermediate',
        readTime: '5 min read',
        summary: 'Learn selecting DOM elements, dynamic rendering, keyboard/click event handling, and high-performance event delegation.',
        overview: `The Document Object Model (DOM) is the tree-structured representation of your HTML document that JavaScript can inspect, traverse, and modify in real time.
        
Instead of attaching separate event listeners to hundreds of child elements, **Event Delegation** utilizes event bubbling: attach a single listener to a common ancestor element and inspect <code>e.target</code> to detect which child was clicked.`,
        keyConcepts: [
          {
            term: 'Element Selection',
            description: '<code>document.querySelector()</code> (first match) and <code>document.querySelectorAll()</code> (NodeList of all matches).'
          },
          {
            term: 'Event Bubbling',
            description: 'Events travel upward from the innermost target element through its ancestors up to <code>document</code>.'
          },
          {
            term: 'Event Delegation',
            description: 'Attaching one listener to a parent container to handle events triggered by current or future child elements.'
          },
          {
            term: 'e.preventDefault()',
            description: 'Prevents the browser default behavior (e.g. form reload, following an anchor tag).'
          }
        ],
        syntax: `// Selecting an element
const button = document.querySelector('#launchBattleBtn');

// Adding event listener
button.addEventListener('click', (event) => {
  event.preventDefault();
  // Action logic
});

// Event delegation pattern
container.addEventListener('click', (event) => {
  const item = event.target.closest('.quiz-option');
  if (!item) return;
  // Handle option click
});`,
        examples: [
          {
            title: 'Example 1: High-Performance Event Delegation',
            explanation: 'Handling multiple question options with a single container listener.',
            code: `// Simulating container handling option selection
const optionsContainer = document.querySelector('.options-list');

optionsContainer.addEventListener('click', (event) => {
  // Find nearest button matching .option-btn
  const btn = event.target.closest('.option-btn');
  if (!btn) return; // Click occurred outside buttons

  // Remove selected state from all sibling buttons
  optionsContainer.querySelectorAll('.option-btn').forEach(b => {
    b.classList.remove('selected');
  });

  // Highlight clicked button
  btn.classList.add('selected');
  console.log(\`Selected Option: \${btn.dataset.index}\`);
});`,
            output: `// Clicking button A -> "Selected Option: 0"
// Clicking button B -> "Selected Option: 1"`
          },
          {
            title: 'Example 2: Dynamic Element Creation & Insertion',
            explanation: 'Constructing elements in memory and appending to minimize reflows.',
            code: `function renderStatPill(label, value, parentEl) {
  const pill = document.createElement('div');
  pill.className = 'stat-pill';
  pill.innerHTML = \`
    <span class="pill-label">\${label}:</span>
    <strong class="pill-val">\${value}</strong>
  \`;
  parentEl.appendChild(pill);
}

// Memory-efficient batch rendering using DocumentFragment
const fragment = document.createDocumentFragment();
// Appending to fragment does not trigger page repaints until attached!`,
            output: `// Renders: <div class="stat-pill"><span class="pill-label">XP:</span><strong class="pill-val">1250</strong></div>`
          }
        ],
        pitfalls: [
          'Attaching event listeners inside loops on hundreds of elements: this consumes extra memory and causes lag. Always use delegation!',
          'Forgetting that <code>querySelectorAll</code> returns a NodeList, not an Array (convert using <code>Array.from()</code> if array methods are needed).'
        ],
        proTips: [
          'Use <code>element.closest(selector)</code> inside delegated event handlers to reliably find the targeted wrapper.',
          'Batch DOM updates using <code>DocumentFragment</code> to minimize browser layout reflows and repaints.'
        ],
        keyTakeaways: [
          'Event delegation is cleaner, faster, and works seamlessly with dynamically added elements.',
          'Always clean up event listeners on removed components to prevent memory leaks.',
          'Use CSS classes for styling changes (<code>classList.add/toggle</code>) instead of inline styles.'
        ]
      }
    }
  },

  // =========================================================================
  // 3. JAVA
  // =========================================================================
  'java': {
    subjectName: 'Java',
    icon: '☕',
    category: 'languages',
    difficulty: 'Intermediate',
    description: 'Object-oriented software engineering, Java Collections Framework, interfaces, and resilient exception handling.',
    topics: {
      'Classes & Encapsulation': {
        title: 'Classes, Objects & Encapsulation in Java',
        badge: 'OOP Architecture',
        difficulty: 'Beginner',
        readTime: '5 min read',
        summary: 'Understand classes, constructors, private fields, getter/setter patterns, and access modifiers in strongly-typed Java.',
        overview: `Java is a strictly typed, class-based object-oriented language. Every line of executable code in Java must live inside a class.
        
**Encapsulation** is the principle of hiding internal object details and protecting them from unauthorized mutation. In Java, fields are typically marked <code>private</code>, and interaction is permitted only through validated <code>public</code> getter and setter methods.`,
        keyConcepts: [
          {
            term: 'Access Modifiers',
            description: '<code>public</code> (visible everywhere), <code>private</code> (visible only inside the declaring class), <code>protected</code> (visible in package and subclasses), and package-private (default).'
          },
          {
            term: 'Constructors',
            description: 'Special methods bearing the exact name of the class with no return type, used to initialize newly allocated objects.'
          },
          {
            term: 'Getters and Setters',
            description: 'Public methods providing controlled, validated read and write access to private fields.'
          },
          {
            term: 'Static vs Instance',
            description: '<code>static</code> members belong to the class itself (shared across all instances); non-static members belong to individual object instances.'
          }
        ],
        syntax: `public class Player {
    // Private encapsulated fields
    private String name;
    private int xp;

    // Constructor
    public Player(String name, int xp) {
        this.name = name;
        this.xp = xp;
    }

    // Getter
    public String getName() { return name; }

    // Validated Setter
    public void setXp(int xp) {
        if (xp >= 0) this.xp = xp;
    }
}`,
        examples: [
          {
            title: 'Example 1: Encapsulated Student Profile Class',
            explanation: 'Protecting player score against invalid negative values via setter validation.',
            code: `public class Student {
    private String username;
    private int score;

    public Student(String username, int initialScore) {
        this.username = username;
        setScore(initialScore);
    }

    public void setScore(int score) {
        if (score < 0) {
            System.out.println("❌ Invalid Score: Score cannot be negative!");
            return;
        }
        this.score = score;
    }

    public int getScore() { return this.score; }
    public String getUsername() { return this.username; }

    public static void main(String[] args) {
        Student s = new Student("Alex", 85);
        System.out.println(s.getUsername() + " current score: " + s.getScore());
        s.setScore(-10); // Protected against invalid input
    }
}`,
            output: `Alex current score: 85
❌ Invalid Score: Score cannot be negative!`
          }
        ],
        pitfalls: [
          'Making class attributes <code>public</code> directly: this destroys encapsulation and allows any code to corrupt object state.',
          'Confusing <code>==</code> with <code>.equals()</code> for String comparison in Java. <code>==</code> compares memory references; <code>.equals()</code> compares string character values!'
        ],
        proTips: [
          'Always mark immutable fields as <code>final</code>.',
          'Override <code>toString()</code> in every domain class to facilitate readable logging and debugging.'
        ],
        keyTakeaways: [
          'Keep fields private; provide public getters/setters with validation.',
          'Always compare Strings and objects using <code>.equals()</code>, not <code>==</code>.',
          'Java requires explicit type declarations for all variables and method returns.'
        ]
      },

      'Collections Framework': {
        title: 'Java Collections Framework (List, Set, Map)',
        badge: 'Data Structures',
        difficulty: 'Intermediate',
        readTime: '6 min read',
        summary: 'Explore ArrayList, LinkedList, HashSet, and HashMap, and know which data structure to choose for maximum performance.',
        overview: `The Java Collections Framework (JCF) provides an extensive set of standardized interfaces and high-performance classes to store and manipulate groups of objects in memory.
        
Understanding the time complexity (Big-O) differences between <code>ArrayList</code> (fast indexing, slow arbitrary inserts) and <code>HashMap</code> (O(1) constant time lookups) is essential for technical interviews and efficient backend systems.`,
        keyConcepts: [
          {
            term: 'List (ArrayList)',
            description: 'Ordered collection allowing duplicates. Backed by a resizable array. O(1) random access by index.'
          },
          {
            term: 'Set (HashSet)',
            description: 'Unordered collection with guaranteed uniqueness (no duplicates allowed). Fast O(1) membership check.'
          },
          {
            term: 'Map (HashMap)',
            description: 'Key-value pairs with unique keys. O(1) average lookup, insertion, and deletion time.'
          },
          {
            term: 'Generics (<T>)',
            description: 'Enforces compile-time type safety so collections only accept the intended type (e.g. <code>ArrayList&lt;String&gt;</code>).'
          }
        ],
        syntax: `// List creation with Generics
List<String> subjects = new ArrayList<>();

// Unique Set
Set<Integer> uniqueIds = new HashSet<>();

// Key-Value Mapping
Map<String, Integer> xpMap = new HashMap<>();`,
        examples: [
          {
            title: 'Example 1: Using List and HashMap for Leaderboard Stats',
            explanation: 'Tracking user XP scores using a HashMap and retrieving entries.',
            code: `import java.util.*;

public class ArenaLeaderboard {
    public static void main(String[] args) {
        // Map: Key=Username, Value=XP
        Map<String, Integer> playerXp = new HashMap<>();
        playerXp.put("AlexHunter", 1250);
        playerXp.put("CyberKnight", 1800);
        playerXp.put("CodeSorceress", 2100);

        // O(1) Lookup
        String target = "CyberKnight";
        if (playerXp.containsKey(target)) {
            System.out.println(target + " has " + playerXp.get(target) + " XP");
        }

        // Iteration
        for (Map.Entry<String, Integer> entry : playerXp.entrySet()) {
            System.out.println("Gladiator: " + entry.getKey() + " | XP: " + entry.getValue());
        }
    }
}`,
            output: `CyberKnight has 1800 XP
Gladiator: AlexHunter | XP: 1250
Gladiator: CyberKnight | XP: 1800
Gladiator: CodeSorceress | XP: 2100`
          }
        ],
        pitfalls: [
          'Using primitive types like <code>int</code> directly in Generics: Java requires wrapper objects like <code>Integer</code>, <code>Double</code>, etc. (<code>List&lt;Integer&gt;</code>).',
          'Modifying a collection while iterating over it with a standard for-each loop will trigger a <code>ConcurrentModificationException</code>.'
        ],
        proTips: [
          'Always code to the interface: write <code>List&lt;String&gt; list = new ArrayList&lt;&gt;();</code> instead of <code>ArrayList&lt;String&gt; list = ...</code>.',
          'Specify initial capacity in <code>HashMap</code> if you know you are inserting thousands of elements to avoid costly internal rehashing.'
        ],
        keyTakeaways: [
          'Use <code>ArrayList</code> when you need an ordered sequence with index access.',
          'Use <code>HashSet</code> when items must be unique.',
          'Use <code>HashMap</code> for fast key-value lookups.'
        ]
      },

      'Exceptions & Memory Management': {
        title: 'Java Exception Handling & Garbage Collection',
        badge: 'Resilient Software',
        difficulty: 'Intermediate',
        readTime: '5 min read',
        summary: 'Master try-catch-finally, checked vs unchecked exceptions, custom exceptions, and the Java Garbage Collector.',
        overview: `Exceptions in Java signal unexpected runtime events. Proper exception handling ensures your application degrades gracefully instead of crashing abruptly.
        
Java differentiates between **Checked Exceptions** (must be caught or declared in the method signature, e.g. <code>IOException</code>) and **Unchecked Exceptions** (subclasses of <code>RuntimeException</code>, e.g. <code>NullPointerException</code>).
Java also features an automatic **Garbage Collector (GC)** that sweeps and frees memory for objects that are no longer reachable from root pointers.`,
        keyConcepts: [
          {
            term: 'try-catch-finally',
            description: '<code>try</code> wraps risky code; <code>catch</code> intercepts specific errors; <code>finally</code> executes unconditionally (great for closing streams).'
          },
          {
            term: 'try-with-resources',
            description: 'Automatically closes objects implementing <code>AutoCloseable</code> without requiring a manual finally block.'
          },
          {
            term: 'NullPointerException (NPE)',
            description: 'Triggered when attempting to invoke a method or access a field on a null reference pointer.'
          },
          {
            term: 'Garbage Collection (JVM)',
            description: 'JVM monitors heap memory and deletes unreferenced objects automatically, preventing memory leaks.'
          }
        ],
        syntax: `try (FileReader fr = new FileReader("battle.txt")) {
    // Auto-closed resources
} catch (IOException e) {
    System.err.println("File read failed: " + e.getMessage());
} finally {
    // Cleanup guaranteed
}`,
        examples: [
          {
            title: 'Example 1: Custom Exception & Input Guarding',
            explanation: 'Throwing and catching custom checked business exceptions.',
            code: `class InsufficientXpException extends Exception {
    public InsufficientXpException(String msg) { super(msg); }
}

public class ArenaBattleStore {
    public static void purchaseBadge(int currentXp, int cost) throws InsufficientXpException {
        if (currentXp < cost) {
            throw new InsufficientXpException("Deficit of " + (cost - currentXp) + " XP!");
        }
        System.out.println("✅ Badge purchased successfully!");
    }

    public static void main(String[] args) {
        try {
            purchaseBadge(150, 500);
        } catch (InsufficientXpException e) {
            System.out.println("⚠️ Store Error: " + e.getMessage());
        }
    }
}`,
            output: `⚠️ Store Error: Deficit of 350 XP!`
          }
        ],
        pitfalls: [
          'Catching generic <code>Exception</code> or <code>Throwable</code> blindly and swallowing it with an empty catch block: this hides serious bugs.',
          'Assuming garbage collection is instantaneous: memory leaks can still occur in Java if unused objects remain referenced in static lists.'
        ],
        proTips: [
          'Always use try-with-resources for files, sockets, and database connections.',
          'Use Java 8+ <code>Optional&lt;T&gt;</code> to clearly signal when a returned value may be absent, avoiding NPEs.'
        ],
        keyTakeaways: [
          'Checked exceptions must be declared (throws) or caught (try/catch).',
          'Unchecked exceptions (RuntimeException) reflect programming logic errors.',
          'The JVM Garbage Collector manages heap memory automatically.'
        ]
      }
    }
  },

  // =========================================================================
  // 4. HTML & CSS
  // =========================================================================
  'html-css': {
    subjectName: 'HTML & CSS',
    icon: '🎨',
    category: 'web',
    difficulty: 'Beginner',
    description: 'Semantic markup, modern layout systems (Flexbox & CSS Grid), responsive design, and CSS variables.',
    topics: {
      'Semantic HTML5 Tags': {
        title: 'Semantic HTML5 Architecture & Accessibility',
        badge: 'Structural Markup',
        difficulty: 'Beginner',
        readTime: '4 min read',
        summary: 'Learn why semantic elements like header, nav, main, article, and section beat generic div soup for SEO and accessibility.',
        overview: `Semantic HTML means using HTML elements according to their intended meaning rather than purely their visual appearance. Instead of building web pages out of nested <code>&lt;div&gt;</code> tags ("div soup"), HTML5 provides purposeful structural elements.
        
Semantic markup is critical for screen readers (accessibility/a11y), browser parsing, and search engine optimization (SEO).`,
        keyConcepts: [
          {
            term: '&lt;header&gt; & &lt;footer&gt;',
            description: 'Introductory content/navigation at the top and metadata/links at the bottom of the page or section.'
          },
          {
            term: '&lt;nav&gt; & &lt;main&gt;',
            description: '<code>&lt;nav&gt;</code> identifies navigational links; <code>&lt;main&gt;</code> encapsulates the singular primary content of the document.'
          },
          {
            term: '&lt;section&gt; vs &lt;article&gt;',
            description: 'An <code>&lt;article&gt;</code> is standalone and distributable (like a blog post); a <code>&lt;section&gt;</code> groups thematically related content.'
          },
          {
            term: 'Accessible Headings',
            description: 'Use a single <code>&lt;h1&gt;</code> per page followed by an unbroken hierarchical sequence (h2, h3, h4).'
          }
        ],
        syntax: `<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <header><nav>...</nav></header>
    <main>
      <section>
        <article>...</article>
      </section>
    </main>
    <footer>...</footer>
  </body>
</html>`,
        examples: [
          {
            title: 'Example 1: Semantic Card Structure vs Generic Div Soup',
            explanation: 'Comparing clean semantic markup to confusing div nesting.',
            code: `<!-- ❌ Poor: Generic Div Soup (Unfriendly to Screen Readers) -->
<div class="card">
  <div class="card-head">Battle Results</div>
  <div class="card-text">You earned 150 XP</div>
</div>

<!-- ✅ Best Practice: Semantic Structure -->
<article class="battle-card" aria-labelledby="card-title">
  <header>
    <h2 id="card-title">Battle Results</h2>
    <span class="badge">Victory</span>
  </header>
  <p>You earned <strong>150 XP</strong> in Python List Comprehensions.</p>
  <footer>
    <time datetime="2026-10-23">October 23, 2026</time>
  </footer>
</article>`,
            output: `// Accessible, clean DOM structure understood by assistive screen readers and SEO indexers.`
          }
        ],
        pitfalls: [
          'Using multiple <code>&lt;h1&gt;</code> elements scattered across a single web page (damages SEO hierarchy).',
          'Using non-semantic elements like <code>&lt;div&gt;</code> as buttons without <code>role="button"</code> or keyboard event listeners.'
        ],
        proTips: [
          'Always supply meaningful <code>alt</code> attributes for images (or <code>alt=""</code> if purely decorative).',
          'Use the <code>&lt;time datetime="..."&gt;</code> element for machine-readable dates.'
        ],
        keyTakeaways: [
          'Semantic tags describe content meaning to both developers and machines.',
          'Greatly improves accessibility for visually impaired users.',
          'Boosts organic search engine ranking.'
        ]
      },

      'Flexbox & CSS Grid': {
        title: 'Modern CSS Layouts: Flexbox vs CSS Grid',
        badge: 'Layout Engines',
        difficulty: 'Intermediate',
        readTime: '6 min read',
        summary: 'Master one-dimensional layouts with Flexbox and two-dimensional matrix layouts with CSS Grid.',
        overview: `Modern web layouts rely on two complementary CSS layout models:
1. **Flexbox**: Designed for **one-dimensional** layouts (laying out items in a single row OR a single column). Ideal for navbars, button groups, and vertical card alignment.
2. **CSS Grid**: Designed for **two-dimensional** layouts (arranging items across rows AND columns simultaneously). Ideal for page-level layouts, dashboard widgets, and gallery grids.`,
        keyConcepts: [
          {
            term: 'display: flex',
            description: 'Activates flex formatting. Governed by main axis (justify-content) and cross axis (align-items).'
          },
          {
            term: 'justify-content & align-items',
            description: '<code>justify-content</code> controls alignment along the main axis; <code>align-items</code> along the cross axis.'
          },
          {
            term: 'display: grid',
            description: 'Activates grid formatting. Defined via <code>grid-template-columns</code> and <code>grid-template-rows</code>.'
          },
          {
            term: 'repeat() & minmax()',
            description: '<code>repeat(auto-fit, minmax(280px, 1fr))</code> creates a fully responsive grid without a single media query!'
          }
        ],
        syntax: `/* Flexbox Example (1D) */
.nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* CSS Grid Example (2D) */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}`,
        examples: [
          {
            title: 'Example 1: Flexbox Navigation Bar',
            explanation: 'Centering a logo, links, and action buttons effortlessly.',
            code: `.public-header {
  display: flex;
  align-items: center;       /* Vertical center */
  justify-content: space-between; /* Space out items */
  padding: 1rem 2rem;
  background: #0f1123;
}

.public-actions {
  display: flex;
  gap: 1rem;                 /* Clean spacing without margins */
}`,
            output: `/* Produces a sleek, perfectly spaced top navigation bar */`
          },
          {
            title: 'Example 2: Auto-Responsive Subject Grid with CSS Grid',
            explanation: 'A grid that wraps cards smoothly across desktop, tablet, and mobile automatically.',
            code: `.subject-grid {
  display: grid;
  /* Automatically fits as many 280px+ columns as possible, stretching to fill remaining space */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}`,
            output: `/* 4 columns on large monitors, 2 on tablet, 1 on mobile automatically! */`
          }
        ],
        pitfalls: [
          'Using CSS Grid for simple horizontal button bars where Flexbox is much cleaner.',
          'Forgetting that <code>margin: auto</code> inside a Flexbox container automatically absorbs all available free space.'
        ],
        proTips: [
          'Use the <code>gap</code> property on both Flex and Grid to eliminate manual negative margin hacks.',
          'To center an element both vertically and horizontally with Grid: <code>display: grid; place-items: center;</code> in 2 lines!'
        ],
        keyTakeaways: [
          'Flexbox = 1D (Row or Column).',
          'CSS Grid = 2D (Rows AND Columns).',
          'Use <code>repeat(auto-fit, minmax(...))</code> for responsive grids without media queries.'
        ]
      },

      'Box Model & CSS Variables': {
        title: 'The CSS Box Model & Custom Properties (Variables)',
        badge: 'Styling Systems',
        difficulty: 'Beginner',
        readTime: '4 min read',
        summary: 'Understand margin, border, padding, content, box-sizing, and maintainable design systems with CSS Variables.',
        overview: `Every element on a web page is rendered as a rectangular box. The **CSS Box Model** consists of four concentric layers:
1. **Content**: Text, images, or child elements.
2. **Padding**: Transparent space between the content and border.
3. **Border**: Borderline surrounding the padding.
4. **Margin**: Transparent space outside the border separating it from neighbors.

Modern CSS uses **CSS Custom Properties (Variables)** to define consistent colors, typography, and spacing tokens in <code>:root</code>, making themes and high-contrast modes easy to implement.`,
        keyConcepts: [
          {
            term: 'box-sizing: border-box',
            description: 'Forces width and height to include padding and borders, avoiding layout overflows. Essential modern reset.'
          },
          {
            term: 'CSS Custom Properties',
            description: 'Declared with <code>--variable-name: value;</code> and accessed via <code>var(--variable-name)</code>.'
          },
          {
            term: 'Cascade & Scoping',
            description: 'Variables defined in <code>:root</code> are global; variables redefined inside a class override globally for that subtree.'
          }
        ],
        syntax: `:root {
  --accent-purple: #8b5cf6;
  --bg-dark: #0f1123;
  --radius-md: 8px;
}

*, *::before, *::after {
  box-sizing: border-box; /* Universal Box-Sizing */
}

.button-primary {
  background: var(--accent-purple);
  border-radius: var(--radius-md);
}`,
        examples: [
          {
            title: 'Example 1: Theme Toggling with CSS Variables',
            explanation: 'Swapping entire color schemes by redefining CSS custom properties on the body.',
            code: `/* Default Theme */
:root {
  --bg-body: #0b0f19;
  --text-main: #f8fafc;
  --accent: #8b5cf6;
}

/* High Contrast Dark Mode */
body.theme-high-contrast {
  --bg-body: #000000;
  --text-main: #ffffff;
  --accent: #00ffff; /* Neon cyan for maximum contrast */
}

body {
  background-color: var(--bg-body);
  color: var(--text-main);
  transition: background-color 0.3s ease;
}`,
            output: `/* Instant dark/high-contrast mode toggle by adding class to <body> */`
          }
        ],
        pitfalls: [
          'Forgetting <code>* { box-sizing: border-box; }</code> causes elements with 100% width and 20px padding to overflow their parent containers.',
          'Missing fallback values when consuming variables: <code>var(--color, #fff)</code>.'
        ],
        proTips: [
          'Define all design system tokens (colors, font sizes, radiuses, shadows) in <code>:root</code>.',
          'CSS variables can be manipulated dynamically from JavaScript with <code>element.style.setProperty(\'--accent\', color)</code>.'
        ],
        keyTakeaways: [
          'Always use <code>box-sizing: border-box</code>.',
          'Padding is INSIDE the border; margin is OUTSIDE the border.',
          'CSS variables make design systems consistent and theming simple.'
        ]
      }
    }
  },

  // =========================================================================
  // 5. UI/UX DESIGN
  // =========================================================================
  'ui-ux': {
    subjectName: 'UI/UX Design',
    icon: '📐',
    category: 'web',
    difficulty: 'Beginner',
    description: 'Design psychology, visual hierarchy, usability heuristics, color theory, and WCAG accessibility standards.',
    topics: {
      'Visual Hierarchy & Typography': {
        title: 'Visual Hierarchy, Typography & Layout Balance',
        badge: 'UI Principles',
        difficulty: 'Beginner',
        readTime: '4 min read',
        summary: 'Guide user attention through scale, contrast, whitespace, typography sizing scales, and visual weight.',
        overview: `**Visual hierarchy** is the arrangement and presentation of design elements in the order of their visual importance. Users rarely read every word on a screen; they scan in F-shaped or Z-shaped patterns.
        
A strong visual hierarchy ensures users instantly understand where to look first, what action to take next, and how different pieces of information relate.`,
        keyConcepts: [
          {
            term: 'Size & Scale',
            description: 'Larger elements draw the eye first. Major headings (H1) should immediately communicate page identity.'
          },
          {
            term: 'Contrast & Weight',
            description: 'High contrast text and bold font weights pop out, while subdued secondary text recedes into the background.'
          },
          {
            term: 'Whitespace (Negative Space)',
            description: 'Uncluttered space around elements prevents cognitive overload and clarifies visual grouping.'
          },
          {
            term: 'Type Scale',
            description: 'Using a proportional mathematical scale (e.g. Major Third 1.25x) creates harmonious typography.'
          }
        ],
        syntax: `/* Example Modular Type Scale */
h1 { font-size: 2.25rem; font-weight: 800; line-height: 1.2; }
h2 { font-size: 1.75rem; font-weight: 700; line-height: 1.3; }
p  { font-size: 1rem;    font-weight: 400; line-height: 1.6; }
.caption { font-size: 0.8rem; color: var(--text-muted); }`,
        examples: [
          {
            title: 'Example 1: Scannable Hero Card Layout',
            explanation: 'Using size, color contrast, and spacing to lead the user directly to the primary Call To Action (CTA).',
            code: `<div class="hero-card">
  <!-- 1. Category Tag (Subtle, upper-case) -->
  <span class="badge">🔥 ARENA HIGHLIGHT</span>

  <!-- 2. Primary Headline (Largest visual weight) -->
  <h1>Master JavaScript Closures</h1>

  <!-- 3. Supporting Description (Medium contrast, readable line-height) -->
  <p>Learn how lexical scoping protects private state in enterprise apps.</p>

  <!-- 4. Primary Call To Action (High contrast, standout background) -->
  <button class="btn btn-primary btn-lg">Start 5-Minute Battle →</button>
</div>`,
            output: `/* Clean visual flow: Tag -> Title -> Summary -> Action Button */`
          }
        ],
        pitfalls: [
          'Using too many competing font weights or colors on a single screen, which causes visual noise and analysis paralysis.',
          'Line lengths exceeding 75-80 characters, which makes long-form text tiring to read.'
        ],
        proTips: [
          'Limit your UI to 1 or 2 typeface families at most (e.g. Inter or Plus Jakarta Sans for UI, Fira Code for code blocks).',
          'Ensure line-height (leading) is around 1.5 - 1.6 for body copy to ensure comfortable reading.'
        ],
        keyTakeaways: [
          'Visual hierarchy dictates scanning order through size, contrast, and whitespace.',
          'Whitespace is an active design tool, not wasted space.',
          'Consistent typographic scales prevent disjointed interfaces.'
        ]
      },

      'Nielsen Norman Usability Heuristics': {
        title: 'Nielsen Norman 10 Usability Heuristics',
        badge: 'UX Fundamentals',
        difficulty: 'Intermediate',
        readTime: '6 min read',
        summary: 'Master the 10 universal principles for interaction design established by Jakob Nielsen.',
        overview: `Jakob Nielsen's **10 Usability Heuristics** are the most widely cited broad rules of thumb for user interface design. They focus on minimizing cognitive load, preventing human errors, and giving users a sense of control and clarity.
        
In gamified platforms like Study Battle, adhering to heuristics (such as instant feedback, undo options, and clear error recovery) is the key to an addictive, frustration-free experience.`,
        keyConcepts: [
          {
            term: '#1: Visibility of System Status',
            description: 'The system should always keep users informed about what is going on through prompt, appropriate feedback (e.g. timers, progress bars, audio cues).'
          },
          {
            term: '#2: Match Between System & Real World',
            description: 'Use words, phrases, and concepts familiar to the user rather than internal developer jargon.'
          },
          {
            term: '#3: User Control & Freedom',
            description: 'Users often make mistakes; provide clear "emergency exits" like Cancel, Back buttons, and confirmation dialogs.'
          },
          {
            term: '#5: Error Prevention',
            description: 'Prevent mistakes before they occur (e.g. disable Submit buttons until required inputs are filled, confirm irreversible actions).'
          },
          {
            term: '#6: Recognition Rather Than Recall',
            description: 'Minimize the user\'s memory load by making elements, actions, and options visible.'
          }
        ],
        syntax: `// Example: Immediate Feedback & Error Prevention
submitBtn.disabled = !isFormValid();
showToast("⚔️ Battle streak saved!", "success");`,
        examples: [
          {
            title: 'Example 1: Error Prevention & System Feedback in Action',
            explanation: 'Providing live confirmation dialogs before irreversible actions (Logout / Reset data).',
            code: `// Confirming dangerous actions (Heuristic #3 & #5)
function confirmResetSession() {
  const confirmed = window.confirm(
    "⚠️ Are you sure you want to reset your battle stats? This cannot be undone."
  );
  if (confirmed) {
    localStorage.clear();
    // System Status Feedback (Heuristic #1)
    showToast("Session reset to starter state.", "info");
    setTimeout(() => window.location.reload(), 500);
  }
}`,
            output: `/* Prevents accidental loss of progress through clear confirmation */`
          }
        ],
        pitfalls: [
          'Failing to show loading states during asynchronous network actions (violates Heuristic #1: Visibility of System Status).',
          'Vague error messages like "An error occurred" instead of actionable messages explaining how to fix the problem.'
        ],
        proTips: [
          'Add audio, visual micro-animations, or toasts whenever a user completes an action to confirm success.',
          'Always provide an obvious Escape or Close button on modals.'
        ],
        keyTakeaways: [
          'Keep the user informed at all times (feedback).',
          'Prevent errors before they occur and offer graceful recovery.',
          'Prioritize recognition over recall.'
        ]
      },

      'Color Contrast & Accessibility (WCAG)': {
        title: 'Color Contrast & Accessibility Standards (WCAG 2.1)',
        badge: 'Accessibility (A11y)',
        difficulty: 'Intermediate',
        readTime: '5 min read',
        summary: 'Design inclusive interfaces meeting WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text).',
        overview: `Web accessibility (a11y) ensures that digital products are usable by everyone, including people with visual, auditory, motor, or cognitive impairments.
        
The **Web Content Accessibility Guidelines (WCAG)** establish clear mathematical standards for color contrast. Text that has insufficient contrast against its background is difficult or impossible for millions of users to read, especially in dark mode interfaces.`,
        keyConcepts: [
          {
            term: 'WCAG AA Normal Text Ratio',
            description: 'Requires a minimum contrast ratio of <strong>4.5:1</strong> for body text (under 18pt or bold 14pt).'
          },
          {
            term: 'WCAG AA Large Text Ratio',
            description: 'Requires a minimum contrast ratio of <strong>3:1</strong> for large text (18pt+ or bold 14pt+).'
          },
          {
            term: 'UI Components & Focus States',
            description: 'Active borders, icons, and keyboard focus rings must meet at least <strong>3:1</strong> against adjacent colors.'
          },
          {
            term: 'Never Rely on Color Alone',
            description: 'Do not communicate meaning exclusively through color; always pair colors with icons or explanatory text.'
          }
        ],
        syntax: `/* WCAG-Compliant High Contrast Dark Theme */
:root {
  --bg-darkest: #070913;      /* Deep background */
  --text-white: #ffffff;      /* 18.5:1 contrast against dark */
  --text-secondary: #cbd5e1;  /* 11.2:1 contrast */
  --accent-cyan: #22d3ee;     /* 9.4:1 contrast */
  --danger: #f87171;          /* 6.1:1 contrast */
}`,
        examples: [
          {
            title: 'Example 1: Multi-Signal Form Validation (Color + Icon + Text)',
            explanation: 'Satisfying the rule: Never rely solely on color to communicate state.',
            code: `<!-- ❌ Inaccessible: Only changes text color to red -->
<p style="color: red;">Invalid email</p>

<!-- ✅ WCAG Compliant: Color + Icon + Explicit Explanation -->
<div class="form-error-alert" role="alert" style="background: rgba(239,68,68,0.15); border: 1px solid #ef4444; color: #fca5a5; padding: 0.75rem; border-radius: 6px;">
  <span aria-hidden="true">⚠️</span>
  <strong>Error:</strong> Please enter a valid email format (e.g. name@domain.com).
</div>`,
            output: `/* Accessible to colorblind users who cannot distinguish red from green */`
          }
        ],
        pitfalls: [
          'Using low-contrast light gray text (like #64748b) on dark navy backgrounds, failing the 4.5:1 minimum threshold.',
          'Removing the <code>:focus-visible</code> outline without providing an alternative high-contrast focus indicator for keyboard navigators.'
        ],
        proTips: [
          'Use browser DevTools (Inspect Element -> Contrast Ratio) to check contrast in real time.',
          'Provide a dedicated High Contrast mode toggle for users with vision sensitivities.'
        ],
        keyTakeaways: [
          'Minimum 4.5:1 contrast for normal text; 3:1 for large text.',
          'Never convey critical status using color alone (pair with icons and text).',
          'Keep keyboard focus rings sharp and visible.'
        ]
      }
    }
  },

  // =========================================================================
  // 6. DBMS & SQL
  // =========================================================================
  'dbms': {
    subjectName: 'DBMS & SQL',
    icon: '🗄️',
    category: 'database',
    difficulty: 'Intermediate',
    description: 'Relational database architecture, complex SQL queries, Table JOINs, ACID transactions, and normalization forms.',
    topics: {
      'SQL Queries & Table JOINs': {
        title: 'SQL Queries, Aggregations & Table JOINs',
        badge: 'Query Fundamentals',
        difficulty: 'Intermediate',
        readTime: '6 min read',
        summary: 'Master SELECT queries, WHERE filtering, GROUP BY aggregations, and INNER, LEFT, RIGHT, and FULL OUTER JOINs.',
        overview: `Structured Query Language (SQL) is the universal language for interacting with Relational Database Management Systems (RDBMS) like SQLite, PostgreSQL, and MySQL.
        
Because relational data is normalized into separate tables to eliminate redundancy, **JOIN operations** allow you to stitch tables together in a single query based on a logical relationship (primary key / foreign key).`,
        keyConcepts: [
          {
            term: 'INNER JOIN',
            description: 'Returns only rows that have matching values in both tables.'
          },
          {
            term: 'LEFT (OUTER) JOIN',
            description: 'Returns all rows from the left table, plus matched rows from the right table (NULL if no match).'
          },
          {
            term: 'GROUP BY & HAVING',
            description: '<code>GROUP BY</code> aggregates rows sharing values into summary rows (COUNT, SUM, AVG). <code>HAVING</code> filters aggregated groups.'
          },
          {
            term: 'SQL Execution Order',
            description: 'FROM & JOIN → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY → LIMIT.'
          }
        ],
        syntax: `SELECT u.name, COUNT(b.id) AS total_battles, AVG(b.score) AS avg_score
FROM users u
INNER JOIN battles b ON u.id = b.user_id
WHERE b.created_at >= '2026-01-01'
GROUP BY u.id, u.name
HAVING COUNT(b.id) >= 5
ORDER BY avg_score DESC
LIMIT 10;`,
        examples: [
          {
            title: 'Example 1: INNER JOIN vs LEFT JOIN',
            explanation: 'Querying students and their earned achievements.',
            code: `-- 1. INNER JOIN: Only returns students who have earned at least 1 achievement
SELECT u.name, a.title, a.xp_reward
FROM users u
INNER JOIN user_achievements ua ON u.id = ua.user_id
INNER JOIN achievements a ON ua.achievement_id = a.id;

-- 2. LEFT JOIN: Returns ALL students, showing NULL for those without achievements
SELECT u.name, COUNT(ua.achievement_id) AS total_unlocked
FROM users u
LEFT JOIN user_achievements ua ON u.id = ua.user_id
GROUP BY u.id, u.name;`,
            output: `/* Query 1:
name: "Alex Hunter", title: "Centurion", xp_reward: 250

Query 2:
name: "Alex Hunter", total_unlocked: 4
name: "Novice Gladiator", total_unlocked: 0  -- Retained thanks to LEFT JOIN! */`
          }
        ],
        pitfalls: [
          'Using <code>WHERE</code> to filter aggregated data instead of <code>HAVING</code>: <code>WHERE</code> filters individual rows before grouping; <code>HAVING</code> filters after grouping.',
          'Missing index on Foreign Key columns, which causes full table scans during large JOIN operations.'
        ],
        proTips: [
          'Use table aliases (e.g. <code>FROM users u</code>) to keep complex multi-table queries readable and maintainable.',
          'Always use <code>EXPLAIN QUERY PLAN</code> in SQLite or PostgreSQL to optimize slow queries.'
        ],
        keyTakeaways: [
          'INNER JOIN = only matching pairs in both tables.',
          'LEFT JOIN = keeps all rows from left table even without right-table matches.',
          'WHERE filters rows before grouping; HAVING filters groups after aggregation.'
        ]
      },

      'ACID Properties & Transactions': {
        title: 'ACID Properties & Database Transactions',
        badge: 'Data Integrity',
        difficulty: 'Intermediate',
        readTime: '5 min read',
        summary: 'Understand Atomicity, Consistency, Isolation, and Durability, and how transactions prevent data corruption.',
        overview: `A **transaction** is a logical unit of work that contains one or more database operations (INSERT, UPDATE, DELETE). To guarantee that data remains valid and reliable even during system crashes or power failures, databases enforce the **ACID** properties:
- **A**tomicity: All or nothing.
- **C**onsistency: Moves the database from one valid state to another valid state.
- **I**solation: Concurrent transactions do not interfere with one another.
- **D**urability: Once committed, changes survive any crash.`,
        keyConcepts: [
          {
            term: 'Atomicity',
            description: 'If any single statement in a transaction fails, the entire transaction is rolled back as if nothing happened.'
          },
          {
            term: 'Consistency',
            description: 'Database constraints (foreign keys, uniqueness, check conditions) are enforced on commit.'
          },
          {
            term: 'Isolation Levels',
            description: 'Prevents concurrency bugs: Read Uncommitted, Read Committed, Repeatable Read, and Serializable.'
          },
          {
            term: 'Durability',
            description: 'Committed transactions are written to non-volatile disk storage (Write-Ahead Logging / WAL).'
          }
        ],
        syntax: `BEGIN TRANSACTION;

UPDATE users SET xp = xp - 50 WHERE id = 101;
UPDATE store_items SET stock = stock - 1 WHERE id = 42;
INSERT INTO purchases (user_id, item_id) VALUES (101, 42);

-- If everything succeeds:
COMMIT;

-- If an error occurs:
-- ROLLBACK;`,
        examples: [
          {
            title: 'Example 1: Safe XP Transfer Transaction',
            explanation: 'Transferring XP bounty between gladiators safely without the risk of points being lost mid-flight.',
            code: `-- Start atomic transaction
BEGIN TRANSACTION;

-- Step 1: Deduct bounty from loser
UPDATE users 
SET xp = xp - 50 
WHERE id = 2 AND xp >= 50;

-- Step 2: Award bounty to winner
UPDATE users 
SET xp = xp + 50 
WHERE id = 1;

-- Save audit log
INSERT INTO battle_transfers (from_id, to_id, amount) 
VALUES (2, 1, 50);

-- Finalize all 3 changes atomically
COMMIT;`,
            output: `/* All 3 updates succeed together. If the server loses power during Step 2, Step 1 is cleanly rolled back automatically! */`
          }
        ],
        pitfalls: [
          'Keeping transactions open during slow external operations (like sending an email or HTTP fetch), which causes database locks.',
          'Assuming uncommitted data is saved: always ensure your backend calls <code>db.commit()</code>.'
        ],
        proTips: [
          'In SQLite, enable Write-Ahead Logging (<code>PRAGMA journal_mode=WAL;</code>) for significantly higher concurrent read/write throughput.',
          'Keep transactions as short and fast as possible to avoid deadlock.'
        ],
        keyTakeaways: [
          'Atomicity = All or Nothing.',
          'Consistency = Constraints respected.',
          'Isolation = Concurrent safety.',
          'Durability = Written to disk and crash-resilient.'
        ]
      },

      'Database Normalization (1NF, 2NF, 3NF)': {
        title: 'Database Normalization (1NF, 2NF, 3NF)',
        badge: 'Schema Design',
        difficulty: 'Intermediate',
        readTime: '6 min read',
        summary: 'Eliminate duplicate data and prevent insert, update, and deletion anomalies by normalizing schemas into 1NF, 2NF, and 3NF.',
        overview: `**Normalization** is the systematic process of structuring a relational database schema to reduce data redundancy and improve data integrity.
        
Without normalization, databases suffer from **anomalies**:
- **Insertion Anomaly**: Inability to record data without entering unrelated information.
- **Update Anomaly**: Having to update redundant data across multiple rows, leading to inconsistencies if one is missed.
- **Deletion Anomaly**: Accidentally losing unintended information when deleting a row.`,
        keyConcepts: [
          {
            term: '1NF (First Normal Form)',
            description: 'Atomic values (each cell contains only a single value, no comma-separated lists), and each record is uniquely identifiable.'
          },
          {
            term: '2NF (Second Normal Form)',
            description: 'Must be in 1NF, and all non-key columns must depend on the ENTIRE primary key (eliminates partial dependency in composite keys).'
          },
          {
            term: '3NF (Third Normal Form)',
            description: 'Must be in 2NF, and no non-key column may depend on another non-key column (eliminates transitive dependency: X → Y → Z).'
          }
        ],
        syntax: `/* 1NF: Atomic Columns */
-- ❌ Violates 1NF: topics = "Variables, Functions, OOP"
-- ✅ 1NF: Separate row for each topic or dedicated junction table

/* 3NF Normalized Schema */
CREATE TABLE subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject_id TEXT REFERENCES subjects(id),
    title TEXT NOT NULL
);`,
        examples: [
          {
            title: 'Example 1: Step-by-Step Normalization to 3NF',
            explanation: 'Refactoring an un-normalized student battle log into clean 3NF.',
            code: `-- ❌ Un-normalized Table (Suffers from update and deletion anomalies):
-- [student_id, student_name, student_email, subject_id, subject_name, battle_score]
-- If a student changes their email, you must update dozens of battle rows!

-- ✅ 3NF Normalized Architecture:
-- 1. Students Table (Holds student profile only)
CREATE TABLE students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

-- 2. Subjects Table (Holds subject data only)
CREATE TABLE subjects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- 3. Battles Table (Relates student to subject with performance metrics)
CREATE TABLE battles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER REFERENCES students(id),
    subject_id TEXT REFERENCES subjects(id),
    score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
            output: `/* Clean 3NF schema: Updating student email requires modifying exactly 1 row in the students table! */`
          }
        ],
        pitfalls: [
          'Storing comma-separated strings inside a single database column (e.g. <code>tags: "python,coding,oop"</code>). This directly violates 1NF and prevents indexing and fast JOINs.',
          'Over-normalizing simple read-heavy reporting systems where intentional de-normalization (or caching views) is needed for reporting speed.'
        ],
        proTips: [
          'Aim for 3NF as the standard design target for all transactional (OLTP) software.',
          'Always establish Foreign Key constraints to maintain referential integrity.'
        ],
        keyTakeaways: [
          '1NF = Atomic values (no lists in a single cell).',
          '2NF = No partial dependencies on composite keys.',
          '3NF = No transitive dependencies (no non-key column depending on another non-key column).'
        ]
      }
    }
  }
};
