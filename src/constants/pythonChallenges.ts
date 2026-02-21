/**
 * Python Challenge Arena — Problem definitions
 *
 * 30 real-world Python challenges across 4 difficulty tiers and 6 categories.
 * Each challenge teaches a transferable problem-solving skill, not just syntax.
 *
 * Categories:
 *   shop-math     → Real-world arithmetic / business logic
 *   data-detective→ Working with data, CSV, analysis
 *   game-logic    → Building mini-games & simulations
 *   robot-control → Robotics scripting scenarios
 *   web-builder   → Web scraping, APIs, automation
 *   ai-explorer   → Intro to AI/ML concepts
 */

export type Difficulty = 'starter' | 'explorer' | 'builder' | 'master';
export type Category =
  | 'shop-math'
  | 'data-detective'
  | 'game-logic'
  | 'robot-control'
  | 'web-builder'
  | 'ai-explorer';

export interface TestCase {
  input: string;
  expected: string;
  explanation?: string;
}

export interface PythonChallenge {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: Category;
  xp: number;
  description: string;
  realWorldContext: string;
  skillsTaught: string[];
  hints: string[];
  starterCode: string;
  testCases: TestCase[];
  solutionCode: string;
  bonusChallenge?: string;
}

/* ─────── Difficulty config ─────── */
export const DIFFICULTY_CONFIG: Record<
  Difficulty,
  { label: string; color: string; bg: string; border: string; emoji: string; description: string }
> = {
  starter: {
    label: 'Starter',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    emoji: '🌱',
    description: 'Print, variables, input — your first 10 programs',
  },
  explorer: {
    label: 'Explorer',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    emoji: '🔍',
    description: 'Loops, conditions, string tricks',
  },
  builder: {
    label: 'Builder',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    emoji: '🔧',
    description: 'Functions, lists, dictionaries, file I/O',
  },
  master: {
    label: 'Master',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200',
    emoji: '🏆',
    description: 'Classes, algorithms, APIs, real projects',
  },
};

export const CATEGORY_CONFIG: Record<
  Category,
  { label: string; emoji: string; color: string }
> = {
  'shop-math': { label: 'Shop Math', emoji: '🛒', color: 'text-green-600' },
  'data-detective': { label: 'Data Detective', emoji: '🔎', color: 'text-blue-600' },
  'game-logic': { label: 'Game Logic', emoji: '🎮', color: 'text-purple-600' },
  'robot-control': { label: 'Robot Control', emoji: '🤖', color: 'text-orange-600' },
  'web-builder': { label: 'Web Builder', emoji: '🌐', color: 'text-cyan-600' },
  'ai-explorer': { label: 'AI Explorer', emoji: '🧠', color: 'text-pink-600' },
};

/* ─────── 30 challenges ─────── */
export const PYTHON_CHALLENGES: PythonChallenge[] = [
  /* ═══════ STARTER (8) ═══════ */
  {
    id: 'greet-customer',
    title: 'Greet the Customer',
    difficulty: 'starter',
    category: 'shop-math',
    xp: 10,
    description:
      'Write a program that asks for a customer\'s name and prints a personalised welcome message.',
    realWorldContext:
      'Every app starts with a greeting! Banks, shops, and websites all greet users by name. You\'re building the first thing any user sees.',
    skillsTaught: ['input()', 'print()', 'f-strings'],
    hints: [
      'Use input("What is your name? ") to get the name.',
      'Use an f-string: f"Hello, {name}!"',
    ],
    starterCode: `# Greet the Customer
# Ask for the customer's name and print a welcome message

name = input("What is your name? ")
# TODO: Print "Welcome to ROBOTIX, <name>!"
`,
    testCases: [
      { input: 'Chipo', expected: 'Welcome to ROBOTIX, Chipo!', explanation: 'Basic greeting with name' },
      { input: 'Mulenga', expected: 'Welcome to ROBOTIX, Mulenga!' },
    ],
    solutionCode: `name = input("What is your name? ")
print(f"Welcome to ROBOTIX, {name}!")`,
  },
  {
    id: 'shop-receipt',
    title: 'Print a Shop Receipt',
    difficulty: 'starter',
    category: 'shop-math',
    xp: 15,
    description:
      'A tuck shop sells sweets for K5, drinks for K10, and chips for K15. Ask the user how many of each they want and print a receipt with the total.',
    realWorldContext:
      'Every POS (Point of Sale) system at Shoprite, Game, or even a roadside stand needs to calculate totals. You\'re building the logic behind every receipt ever printed.',
    skillsTaught: ['int()', 'arithmetic', 'formatted output'],
    hints: [
      'Use int(input(...)) to get numbers from the user.',
      'Multiply quantity × price for each item.',
      'Add all sub-totals for the grand total.',
    ],
    starterCode: `# Shop Receipt Calculator
sweets = int(input("How many sweets (K5 each)? "))
drinks = int(input("How many drinks (K10 each)? "))
chips = int(input("How many chips (K15 each)? "))

# TODO: Calculate sub-totals and grand total
# TODO: Print a nicely formatted receipt
`,
    testCases: [
      { input: '2, 1, 3', expected: 'Total: K65', explanation: '2×5 + 1×10 + 3×15 = 65' },
      { input: '0, 5, 0', expected: 'Total: K50', explanation: '0 + 5×10 + 0 = 50' },
    ],
    solutionCode: `sweets = int(input("How many sweets (K5 each)? "))
drinks = int(input("How many drinks (K10 each)? "))
chips = int(input("How many chips (K15 each)? "))

sweets_total = sweets * 5
drinks_total = drinks * 10
chips_total = chips * 15
grand_total = sweets_total + drinks_total + chips_total

print("\\n--- RECEIPT ---")
print(f"Sweets  x{sweets}  = K{sweets_total}")
print(f"Drinks  x{drinks}  = K{drinks_total}")
print(f"Chips   x{chips}  = K{chips_total}")
print(f"\\nTotal: K{grand_total}")`,
    bonusChallenge: 'Add 16% VAT and show it separately.',
  },
  {
    id: 'temp-converter',
    title: 'Temperature Converter',
    difficulty: 'starter',
    category: 'robot-control',
    xp: 15,
    description:
      'Build a converter that converts Celsius to Fahrenheit. Formula: F = (C × 9/5) + 32.',
    realWorldContext:
      'Robots use temperature sensors that often report in Celsius, but some displays need Fahrenheit. This is a real skill for IoT projects!',
    skillsTaught: ['float()', 'math operations', 'rounding'],
    hints: [
      'Use float(input(...)) to handle decimals.',
      'Apply the formula: fahrenheit = (celsius * 9/5) + 32',
      'Use round() to limit decimal places.',
    ],
    starterCode: `# Temperature Converter: Celsius → Fahrenheit
celsius = float(input("Enter temperature in Celsius: "))

# TODO: Convert to Fahrenheit using the formula
# TODO: Print the result rounded to 1 decimal place
`,
    testCases: [
      { input: '0', expected: '32.0°F', explanation: 'Freezing point of water' },
      { input: '100', expected: '212.0°F', explanation: 'Boiling point' },
      { input: '25', expected: '77.0°F', explanation: 'Room temperature' },
    ],
    solutionCode: `celsius = float(input("Enter temperature in Celsius: "))
fahrenheit = round((celsius * 9/5) + 32, 1)
print(f"{celsius}°C = {fahrenheit}°F")`,
  },
  {
    id: 'age-checker',
    title: 'Age Group Checker',
    difficulty: 'starter',
    category: 'game-logic',
    xp: 15,
    description:
      'Ask the user for their age. Print which ROBOTIX program they belong to: 6-9 = "Robotics Foundations", 10-13 = "Coding Basics", 14-18 = "Python & AI".',
    realWorldContext:
      'Apps like YouTube Kids use age-gating logic exactly like this. Every service that targets different age groups needs code to sort users into the right category.',
    skillsTaught: ['if/elif/else', 'comparison operators', 'int()'],
    hints: [
      'Use if, elif, and else to check ranges.',
      'Check if age >= 6 and age <= 9 for the first group.',
      'Don\'t forget to handle invalid ages (below 6 or above 18).',
    ],
    starterCode: `# ROBOTIX Age Group Checker
age = int(input("How old are you? "))

# TODO: Use if/elif/else to print the right program
# 6-9  → "Robotics Foundations"
# 10-13 → "Coding Basics"
# 14-18 → "Python & AI"
# Other → "Sorry, we don't have a program for your age yet."
`,
    testCases: [
      { input: '8', expected: 'Robotics Foundations' },
      { input: '12', expected: 'Coding Basics' },
      { input: '16', expected: 'Python & AI' },
      { input: '4', expected: "Sorry, we don't have a program for your age yet." },
    ],
    solutionCode: `age = int(input("How old are you? "))

if 6 <= age <= 9:
    print("Robotics Foundations")
elif 10 <= age <= 13:
    print("Coding Basics")
elif 14 <= age <= 18:
    print("Python & AI")
else:
    print("Sorry, we don't have a program for your age yet.")`,
  },
  {
    id: 'password-strength',
    title: 'Password Strength Checker',
    difficulty: 'starter',
    category: 'web-builder',
    xp: 20,
    description:
      'Check if a password is "Weak" (under 6 chars), "Medium" (6-10 chars), or "Strong" (over 10 chars with at least one number).',
    realWorldContext:
      'Every website you sign up for checks your password strength. Google, Facebook, Instagram — they all use logic like this behind the scenes.',
    skillsTaught: ['len()', 'string methods', 'any()', 'conditionals'],
    hints: [
      'Use len(password) to check length.',
      'Use any(c.isdigit() for c in password) to check for numbers.',
      'Build your conditions step by step.',
    ],
    starterCode: `# Password Strength Checker
password = input("Create a password: ")

# TODO: Check length and content
# Under 6 chars → "Weak"
# 6-10 chars → "Medium"
# Over 10 chars AND contains a number → "Strong"
# Over 10 chars but no number → "Medium"
`,
    testCases: [
      { input: 'abc', expected: 'Weak', explanation: 'Only 3 characters' },
      { input: 'robotix', expected: 'Medium', explanation: '7 chars, no number' },
      { input: 'Robotix2025!', expected: 'Strong', explanation: '12 chars with number' },
    ],
    solutionCode: `password = input("Create a password: ")

if len(password) < 6:
    print("Weak")
elif len(password) > 10 and any(c.isdigit() for c in password):
    print("Strong")
else:
    print("Medium")`,
  },
  {
    id: 'even-odd-counter',
    title: 'Even & Odd Counter',
    difficulty: 'starter',
    category: 'data-detective',
    xp: 15,
    description:
      'Ask the user for 5 numbers. Count how many are even and how many are odd. Print the results.',
    realWorldContext:
      'Data classification is the foundation of data science. This is the same logic used to sort survey responses, categorise products, or filter search results.',
    skillsTaught: ['for loop', 'modulo %', 'counters'],
    hints: [
      'Use a for loop: for i in range(5)',
      'A number is even if number % 2 == 0',
      'Keep two counter variables: evens and odds',
    ],
    starterCode: `# Even & Odd Counter
evens = 0
odds = 0

# TODO: Ask for 5 numbers and count evens/odds
# TODO: Print "Even: X, Odd: Y"
`,
    testCases: [
      { input: '1, 2, 3, 4, 5', expected: 'Even: 2, Odd: 3' },
      { input: '2, 4, 6, 8, 10', expected: 'Even: 5, Odd: 0' },
    ],
    solutionCode: `evens = 0
odds = 0

for i in range(5):
    num = int(input(f"Enter number {i+1}: "))
    if num % 2 == 0:
        evens += 1
    else:
        odds += 1

print(f"Even: {evens}, Odd: {odds}")`,
  },
  {
    id: 'countdown-timer',
    title: 'Rocket Countdown',
    difficulty: 'starter',
    category: 'robot-control',
    xp: 10,
    description:
      'Ask the user for a countdown start number. Print each number from that number down to 1, then print "🚀 LAUNCH!".',
    realWorldContext:
      'Countdown sequences are everywhere — from NASA rocket launches to microwave timers. Loops that count backward are fundamental to timed systems.',
    skillsTaught: ['for loop', 'range() with step', 'string formatting'],
    hints: [
      'Use range(start, 0, -1) to count backward.',
      'The -1 tells range to go down by 1 each step.',
    ],
    starterCode: `# Rocket Countdown
start = int(input("Start countdown from: "))

# TODO: Count down from start to 1
# TODO: Print "🚀 LAUNCH!" at the end
`,
    testCases: [
      { input: '5', expected: '5\\n4\\n3\\n2\\n1\\n🚀 LAUNCH!' },
      { input: '3', expected: '3\\n2\\n1\\n🚀 LAUNCH!' },
    ],
    solutionCode: `start = int(input("Start countdown from: "))

for i in range(start, 0, -1):
    print(i)
print("🚀 LAUNCH!")`,
  },
  {
    id: 'robot-greeting',
    title: 'Robot Mood Responder',
    difficulty: 'starter',
    category: 'ai-explorer',
    xp: 15,
    description:
      'Build a simple chatbot: ask the user how they feel. If they say "happy" → respond cheerfully, "sad" → give encouragement, "angry" → suggest a break, anything else → "I\'m still learning emotions!".',
    realWorldContext:
      'This is the very first step toward building an AI chatbot! Real chatbots like ChatGPT start with simple pattern matching before using advanced AI.',
    skillsTaught: ['string comparison', 'lower()', 'if/elif/else'],
    hints: [
      'Use .lower() to handle uppercase input.',
      'Use if/elif/else for each mood.',
    ],
    starterCode: `# Robot Mood Responder
mood = input("How are you feeling today? ").lower()

# TODO: Respond differently based on mood
# "happy" → "That's awesome! 😄 Keep shining!"
# "sad" → "I'm sorry to hear that. 💙 Tomorrow will be better!"
# "angry" → "Take a deep breath. 🧘 Maybe a coding break will help?"
# anything else → "I'm still learning emotions! 🤖"
`,
    testCases: [
      { input: 'happy', expected: "That's awesome! 😄 Keep shining!" },
      { input: 'SAD', expected: "I'm sorry to hear that. 💙 Tomorrow will be better!" },
      { input: 'confused', expected: "I'm still learning emotions! 🤖" },
    ],
    solutionCode: `mood = input("How are you feeling today? ").lower()

if mood == "happy":
    print("That's awesome! 😄 Keep shining!")
elif mood == "sad":
    print("I'm sorry to hear that. 💙 Tomorrow will be better!")
elif mood == "angry":
    print("Take a deep breath. 🧘 Maybe a coding break will help?")
else:
    print("I'm still learning emotions! 🤖")`,
  },

  /* ═══════ EXPLORER (8) ═══════ */
  {
    id: 'multiplication-table',
    title: 'Multiplication Table Generator',
    difficulty: 'explorer',
    category: 'shop-math',
    xp: 25,
    description:
      'Ask the user for a number and print its multiplication table from 1 to 12, neatly formatted.',
    realWorldContext:
      'Generating formatted tables is a core skill. Reports, invoices, and dashboards all depend on clean data presentation. Excel does this — now you can too with code.',
    skillsTaught: ['for loop', 'f-string alignment', 'range()'],
    hints: [
      'Use a for loop with range(1, 13).',
      'Use f-strings with alignment: f"{num} × {i:>2} = {num*i:>3}"',
    ],
    starterCode: `# Multiplication Table Generator
num = int(input("Enter a number: "))

# TODO: Print the multiplication table from 1 to 12
# Format: "5 × 1  =  5"
#         "5 × 12 = 60"
`,
    testCases: [
      { input: '5', expected: '5 × 1 = 5 ... 5 × 12 = 60', explanation: 'Table of 5' },
      { input: '9', expected: '9 × 1 = 9 ... 9 × 12 = 108', explanation: 'Table of 9' },
    ],
    solutionCode: `num = int(input("Enter a number: "))

print(f"\\n--- Multiplication Table for {num} ---")
for i in range(1, 13):
    print(f"{num} × {i:>2} = {num * i:>3}")`,
  },
  {
    id: 'guess-the-number',
    title: 'Guess the Number Game',
    difficulty: 'explorer',
    category: 'game-logic',
    xp: 30,
    description:
      'Generate a random number between 1 and 100. Let the user guess until they get it right. Give "Too high!" or "Too low!" hints. Count their attempts.',
    realWorldContext:
      'This is the foundation of binary search — the same algorithm Google uses to search billions of web pages in milliseconds. Every guess cuts the possibilities in half!',
    skillsTaught: ['while loop', 'random module', 'comparison', 'counter'],
    hints: [
      'import random; secret = random.randint(1, 100)',
      'Use a while loop that runs until guess == secret.',
      'Keep a counter variable and increment each guess.',
    ],
    starterCode: `import random

secret = random.randint(1, 100)
attempts = 0

# TODO: Build the guessing loop
# Give hints: "Too high!" or "Too low!"
# When they guess right: "🎉 You got it in X attempts!"
`,
    testCases: [
      { input: 'secret=42, guess=50,30,42', expected: 'Too high!\\nToo low!\\n🎉 You got it in 3 attempts!' },
    ],
    solutionCode: `import random

secret = random.randint(1, 100)
attempts = 0

print("I'm thinking of a number between 1 and 100...")

while True:
    guess = int(input("Your guess: "))
    attempts += 1
    
    if guess > secret:
        print("Too high!")
    elif guess < secret:
        print("Too low!")
    else:
        print(f"🎉 You got it in {attempts} attempts!")
        break`,
    bonusChallenge: 'Add a maximum of 7 attempts. If they run out, reveal the number.',
  },
  {
    id: 'word-analyzer',
    title: 'Word Analyzer',
    difficulty: 'explorer',
    category: 'data-detective',
    xp: 25,
    description:
      'Ask the user for a sentence. Print: word count, character count (no spaces), longest word, and shortest word.',
    realWorldContext:
      'Twitter limits tweets to 280 characters. Essay checkers count words. Search engines analyze text. You\'re building the same text analysis tools!',
    skillsTaught: ['split()', 'len()', 'min()/max() with key', 'string methods'],
    hints: [
      'Use .split() to break the sentence into words.',
      'Use len() on the word list for word count.',
      'Use .replace(" ", "") and len() for char count.',
      'Use max(words, key=len) for the longest word.',
    ],
    starterCode: `# Word Analyzer
sentence = input("Enter a sentence: ")

# TODO: Calculate and print:
# - Word count
# - Character count (excluding spaces)
# - Longest word
# - Shortest word
`,
    testCases: [
      { input: 'Python is amazing', expected: 'Words: 3, Chars: 15, Longest: amazing, Shortest: is' },
    ],
    solutionCode: `sentence = input("Enter a sentence: ")
words = sentence.split()

word_count = len(words)
char_count = len(sentence.replace(" ", ""))
longest = max(words, key=len)
shortest = min(words, key=len)

print(f"Words: {word_count}")
print(f"Characters (no spaces): {char_count}")
print(f"Longest word: {longest}")
print(f"Shortest word: {shortest}")`,
  },
  {
    id: 'fizzbuzz',
    title: 'FizzBuzz Challenge',
    difficulty: 'explorer',
    category: 'game-logic',
    xp: 25,
    description:
      'Print numbers 1-50. For multiples of 3 print "Fizz", multiples of 5 print "Buzz", multiples of both print "FizzBuzz".',
    realWorldContext:
      'FizzBuzz is the world\'s most famous coding interview question. Companies like Google, Amazon, and Microsoft use it to test if someone can actually code. Ace this and you\'re ahead of many adults!',
    skillsTaught: ['modulo %', 'if/elif/else', 'for loop', 'logic order'],
    hints: [
      'Check the combined condition (% 3 AND % 5) FIRST.',
      'If you check 3 or 5 individually first, you\'ll never reach FizzBuzz.',
      'Use the modulo operator % to check divisibility.',
    ],
    starterCode: `# FizzBuzz — The Classic Interview Challenge
# Print numbers 1-50 with the FizzBuzz rules

for i in range(1, 51):
    # TODO: Check conditions and print the right output
    pass
`,
    testCases: [
      { input: '15', expected: 'FizzBuzz', explanation: '15 is divisible by both 3 and 5' },
      { input: '9', expected: 'Fizz', explanation: '9 is divisible by 3 only' },
      { input: '10', expected: 'Buzz', explanation: '10 is divisible by 5 only' },
      { input: '7', expected: '7', explanation: '7 is not divisible by 3 or 5' },
    ],
    solutionCode: `for i in range(1, 51):
    if i % 3 == 0 and i % 5 == 0:
        print("FizzBuzz")
    elif i % 3 == 0:
        print("Fizz")
    elif i % 5 == 0:
        print("Buzz")
    else:
        print(i)`,
  },
  {
    id: 'distance-tracker',
    title: 'Robot Distance Tracker',
    difficulty: 'explorer',
    category: 'robot-control',
    xp: 30,
    description:
      'A robot moves on a grid. It receives a sequence of commands: "U" (up), "D" (down), "L" (left), "R" (right). Calculate the final position and distance from the start.',
    realWorldContext:
      'Mars rovers receive movement commands from Earth! GPS systems calculate displacement exactly like this. You\'re coding real navigation logic.',
    skillsTaught: ['string iteration', 'x/y coordinates', 'math.sqrt', 'abs()'],
    hints: [
      'Start at x=0, y=0.',
      'U: y += 1, D: y -= 1, L: x -= 1, R: x += 1',
      'Distance from origin: sqrt(x² + y²)',
    ],
    starterCode: `import math

commands = input("Enter commands (e.g., UURRDDLL): ").upper()
x, y = 0, 0

# TODO: Process each command and update x, y
# TODO: Print final position and distance from start
`,
    testCases: [
      { input: 'UUURRDD', expected: 'Position: (3, 0), Distance: 3.0' },
      { input: 'UUUU', expected: 'Position: (0, 4), Distance: 4.0' },
    ],
    solutionCode: `import math

commands = input("Enter commands (e.g., UURRDDLL): ").upper()
x, y = 0, 0

for cmd in commands:
    if cmd == 'U': y += 1
    elif cmd == 'D': y -= 1
    elif cmd == 'R': x += 1
    elif cmd == 'L': x -= 1

distance = round(math.sqrt(x**2 + y**2), 1)
print(f"Position: ({x}, {y})")
print(f"Distance from start: {distance}")`,
    bonusChallenge: 'Add a "map" that prints the robot\'s path using ASCII art.',
  },
  {
    id: 'email-validator',
    title: 'Email Validator',
    difficulty: 'explorer',
    category: 'web-builder',
    xp: 25,
    description:
      'Check if a given email is valid. It must contain exactly one "@", at least one "." after the "@", and no spaces.',
    realWorldContext:
      'Every sign-up form on the internet validates emails. You\'re building the same logic used by Gmail, Outlook, and every web app.',
    skillsTaught: ['string methods', 'in operator', 'count()', 'split()'],
    hints: [
      'Use .count("@") to check there\'s exactly one @.',
      'Use .split("@") to separate local and domain parts.',
      'Check the domain part contains at least one ".".',
    ],
    starterCode: `# Email Validator
email = input("Enter an email: ")

# TODO: Validate the email
# Must have exactly one "@"
# Must have at least one "." after "@"
# Must have no spaces
# Print "Valid email ✅" or "Invalid email ❌"
`,
    testCases: [
      { input: 'student@robotix.co.zm', expected: 'Valid email ✅' },
      { input: 'bad-email', expected: 'Invalid email ❌' },
      { input: 'two@at@signs.com', expected: 'Invalid email ❌' },
      { input: 'has spaces@test.com', expected: 'Invalid email ❌' },
    ],
    solutionCode: `email = input("Enter an email: ")

if (email.count("@") == 1 
    and " " not in email 
    and "." in email.split("@")[1]
    and len(email.split("@")[0]) > 0
    and len(email.split("@")[1]) > 2):
    print("Valid email ✅")
else:
    print("Invalid email ❌")`,
  },
  {
    id: 'pattern-detective',
    title: 'Pattern Detective',
    difficulty: 'explorer',
    category: 'ai-explorer',
    xp: 30,
    description:
      'Given a list of numbers, determine if the pattern is "increasing", "decreasing", or "mixed". This is the first step in trend analysis!',
    realWorldContext:
      'Stock markets, weather forecasts, and AI models all look for patterns in data. Detecting trends is the foundation of machine learning predictions.',
    skillsTaught: ['list comparison', 'all()', 'zip()', 'boolean logic'],
    hints: [
      'Compare each element with the next one.',
      'If every element is less than the next → increasing.',
      'Use zip(numbers, numbers[1:]) to pair consecutive elements.',
    ],
    starterCode: `# Pattern Detective
data = input("Enter numbers separated by spaces: ")
numbers = [int(x) for x in data.split()]

# TODO: Determine if the pattern is:
# "📈 Increasing" — each number is bigger than the last
# "📉 Decreasing" — each number is smaller than the last
# "📊 Mixed" — neither purely increasing nor decreasing
`,
    testCases: [
      { input: '1 3 5 7 9', expected: '📈 Increasing' },
      { input: '10 8 5 3 1', expected: '📉 Decreasing' },
      { input: '1 5 3 7 2', expected: '📊 Mixed' },
    ],
    solutionCode: `data = input("Enter numbers separated by spaces: ")
numbers = [int(x) for x in data.split()]

increasing = all(a < b for a, b in zip(numbers, numbers[1:]))
decreasing = all(a > b for a, b in zip(numbers, numbers[1:]))

if increasing:
    print("📈 Increasing")
elif decreasing:
    print("📉 Decreasing")
else:
    print("📊 Mixed")`,
  },
  {
    id: 'list-sorter',
    title: 'Pizza Order Sorter',
    difficulty: 'explorer',
    category: 'shop-math',
    xp: 25,
    description:
      'A pizza shop takes orders with names and amounts. Sort and display them from highest to lowest spending.',
    realWorldContext:
      'Every business sorts customers by value — from VIP airline passengers to top spenders at a store. Sorting is one of the most fundamental computer science concepts.',
    skillsTaught: ['dictionaries', 'sorted() with key', 'lambda', 'formatted output'],
    hints: [
      'Store orders in a dictionary: {name: amount}',
      'Use sorted(orders.items(), key=lambda x: x[1], reverse=True)',
    ],
    starterCode: `# Pizza Order Sorter
orders = {}

n = int(input("How many orders? "))
for i in range(n):
    name = input(f"Customer {i+1} name: ")
    amount = float(input(f"Order amount (K): "))
    orders[name] = amount

# TODO: Sort orders from highest to lowest amount
# TODO: Print a ranked list with position numbers
`,
    testCases: [
      { input: '3 orders: Alice=150, Bob=80, Chipo=200', expected: '1. Chipo - K200\\n2. Alice - K150\\n3. Bob - K80' },
    ],
    solutionCode: `orders = {}

n = int(input("How many orders? "))
for i in range(n):
    name = input(f"Customer {i+1} name: ")
    amount = float(input(f"Order amount (K): "))
    orders[name] = amount

sorted_orders = sorted(orders.items(), key=lambda x: x[1], reverse=True)

print("\\n🍕 Orders (Highest → Lowest):")
for rank, (name, amount) in enumerate(sorted_orders, 1):
    print(f"{rank}. {name} - K{amount:.0f}")`,
  },

  /* ═══════ BUILDER (8) ═══════ */
  {
    id: 'student-gradebook',
    title: 'Student Gradebook',
    difficulty: 'builder',
    category: 'data-detective',
    xp: 40,
    description:
      'Build a gradebook: store student names and their list of scores. Calculate each student\'s average, find the class average, and identify the top student.',
    realWorldContext:
      'Every school management system (like the one ROBOTIX uses!) has a gradebook. Learning to aggregate data across multiple records is a core database skill.',
    skillsTaught: ['nested data structures', 'dict of lists', 'statistics', 'functions'],
    hints: [
      'Use a dictionary: {name: [score1, score2, ...]}',
      'Calculate average: sum(scores) / len(scores)',
      'Use max() with a key function to find top student.',
    ],
    starterCode: `# Student Gradebook
gradebook = {}

def add_student(name, scores):
    """Add a student with their list of scores."""
    # TODO: Add to gradebook

def get_average(name):
    """Return the average score for a student."""
    # TODO: Calculate and return average

def get_top_student():
    """Return the name of the student with the highest average."""
    # TODO: Find and return top student

def print_report():
    """Print a formatted report of all students."""
    # TODO: Print each student, their scores, and average
    # TODO: Print class average and top student
`,
    testCases: [
      { input: 'Alice=[90,85,92], Bob=[78,82,80]', expected: 'Alice: 89.0, Bob: 80.0, Top: Alice, Class avg: 84.5' },
    ],
    solutionCode: `gradebook = {}

def add_student(name, scores):
    gradebook[name] = scores

def get_average(name):
    scores = gradebook[name]
    return round(sum(scores) / len(scores), 1)

def get_top_student():
    return max(gradebook, key=lambda n: get_average(n))

def print_report():
    print("\\n📊 GRADEBOOK REPORT")
    print("-" * 40)
    all_avgs = []
    for name in gradebook:
        avg = get_average(name)
        all_avgs.append(avg)
        print(f"{name}: {gradebook[name]} → Average: {avg}")
    class_avg = round(sum(all_avgs) / len(all_avgs), 1)
    print(f"\\nClass Average: {class_avg}")
    print(f"🏆 Top Student: {get_top_student()}")

# Test
add_student("Alice", [90, 85, 92])
add_student("Bob", [78, 82, 80])
add_student("Chipo", [95, 88, 91])
print_report()`,
  },
  {
    id: 'hangman',
    title: 'Hangman Game',
    difficulty: 'builder',
    category: 'game-logic',
    xp: 50,
    description:
      'Build a complete Hangman game. Pick a random word, show underscores for unguessed letters, track wrong guesses, and draw the hangman. Max 6 wrong guesses.',
    realWorldContext:
      'Game development teaches state management — tracking what\'s happened, what hasn\'t, and what should display. These are the exact skills used in building any interactive application.',
    skillsTaught: ['lists', 'sets', 'while loop', 'string building', 'game state'],
    hints: [
      'Store guessed letters in a set().',
      'Build the display: replace unguessed letters with "_".',
      'Track wrong guesses separately.',
      'Use a list of hangman stages for the ASCII art.',
    ],
    starterCode: `import random

words = ["python", "robotix", "algorithm", "function", "variable", "keyboard"]
secret = random.choice(words)
guessed = set()
wrong = 0
max_wrong = 6

# TODO: Build the game loop
# Show: _ _ t _ o _  (letters they've guessed)
# Show: Wrong guesses and remaining attempts
# End when they win or lose
`,
    testCases: [
      { input: 'word=python, guesses=p,y,t,h,o,n', expected: '🎉 You won! The word was: python' },
      { input: 'word=python, guesses=a,b,c,d,e,f,g', expected: '💀 You lost! The word was: python' },
    ],
    solutionCode: `import random

words = ["python", "robotix", "algorithm", "function", "variable", "keyboard"]
secret = random.choice(words)
guessed = set()
wrong_guesses = set()
max_wrong = 6

hangman_stages = [
    "  ____\\n |    |\\n |\\n |\\n |\\n_|_",
    "  ____\\n |    |\\n |    O\\n |\\n |\\n_|_",
    "  ____\\n |    |\\n |    O\\n |    |\\n |\\n_|_",
    "  ____\\n |    |\\n |    O\\n |   /|\\n |\\n_|_",
    "  ____\\n |    |\\n |    O\\n |   /|\\\\\\n |\\n_|_",
    "  ____\\n |    |\\n |    O\\n |   /|\\\\\\n |   /\\n_|_",
    "  ____\\n |    |\\n |    O\\n |   /|\\\\\\n |   / \\\\\\n_|_",
]

while len(wrong_guesses) < max_wrong:
    display = " ".join(c if c in guessed else "_" for c in secret)
    print(f"\\n{display}")
    print(f"Wrong: {', '.join(sorted(wrong_guesses))} ({max_wrong - len(wrong_guesses)} left)")
    
    if "_" not in display:
        print(f"🎉 You won! The word was: {secret}")
        break
    
    letter = input("Guess a letter: ").lower()
    if letter in guessed or letter in wrong_guesses:
        print("Already guessed!")
        continue
    
    if letter in secret:
        guessed.add(letter)
    else:
        wrong_guesses.add(letter)
        print(hangman_stages[len(wrong_guesses)])
else:
    print(f"💀 You lost! The word was: {secret}")`,
    bonusChallenge: 'Add categories (animals, countries, tech) and let the player choose.',
  },
  {
    id: 'file-word-counter',
    title: 'Text File Analyzer',
    difficulty: 'builder',
    category: 'data-detective',
    xp: 40,
    description:
      'Read a text file, count the total words, find the top 5 most common words, and count unique words. Ignore common words like "the", "a", "is".',
    realWorldContext:
      'Google reads and analyzes billions of web pages using exactly this kind of text analysis. Search engines, spam filters, and language translators all start here.',
    skillsTaught: ['file I/O', 'Counter from collections', 'stop words', 'dict comprehension'],
    hints: [
      'from collections import Counter',
      'Use open("file.txt").read().split() to get words.',
      'Create a stop_words set to filter common words.',
      'Counter(words).most_common(5) gives top 5.',
    ],
    starterCode: `from collections import Counter

stop_words = {"the", "a", "an", "is", "in", "it", "of", "and", "to", "for"}

def analyze_text(text):
    """Analyze the given text and return statistics."""
    # TODO: Split text into words (lowercase)
    # TODO: Filter out stop words
    # TODO: Return dict with: total_words, unique_words, top_5
    pass

# Test with sample text
sample = """Python is a programming language. Python is used for web development.
Python is great for data science and machine learning. Many developers love Python
because Python is easy to learn and Python is very powerful."""

result = analyze_text(sample)
# TODO: Print the analysis nicely
`,
    testCases: [
      { input: 'sample text above', expected: 'Total: ~30, Unique: ~15, Top word: python (6)' },
    ],
    solutionCode: `from collections import Counter

stop_words = {"the", "a", "an", "is", "in", "it", "of", "and", "to", "for"}

def analyze_text(text):
    words = text.lower().replace(".", "").replace(",", "").split()
    filtered = [w for w in words if w not in stop_words]
    counter = Counter(filtered)
    
    return {
        "total_words": len(words),
        "filtered_words": len(filtered),
        "unique_words": len(set(filtered)),
        "top_5": counter.most_common(5),
    }

sample = """Python is a programming language. Python is used for web development.
Python is great for data science and machine learning. Many developers love Python
because Python is easy to learn and Python is very powerful."""

result = analyze_text(sample)

print("📝 TEXT ANALYSIS REPORT")
print(f"Total words: {result['total_words']}")
print(f"Words (after filtering): {result['filtered_words']}")
print(f"Unique words: {result['unique_words']}")
print("\\n🏆 Top 5 words:")
for word, count in result['top_5']:
    bar = "█" * count
    print(f"  {word:15} {bar} ({count})")`,
  },
  {
    id: 'quiz-builder',
    title: 'Quiz App Builder',
    difficulty: 'builder',
    category: 'web-builder',
    xp: 45,
    description:
      'Build a quiz application: store questions with multiple-choice answers, present them to the user, track score, and show results at the end with percentage.',
    realWorldContext:
      'Kahoot, Quizizz, Google Forms — all built with this exact logic. You\'re building your own quiz platform!',
    skillsTaught: ['list of dicts', 'enumerate()', 'score tracking', 'functions'],
    hints: [
      'Store each question as a dict: {"question": ..., "options": [...], "answer": index}',
      'Use enumerate() to number the options.',
      'Track correct answers and calculate percentage.',
    ],
    starterCode: `# Quiz App Builder
questions = [
    {
        "question": "What does CPU stand for?",
        "options": ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit"],
        "answer": 0
    },
    {
        "question": "Which language is used for AI?",
        "options": ["HTML", "Python", "CSS"],
        "answer": 1
    },
    # TODO: Add 3 more questions
]

def run_quiz(questions):
    """Run the quiz and return the score."""
    # TODO: Present each question with numbered options
    # TODO: Get user's answer and check if correct
    # TODO: Return (correct, total)
    pass

# TODO: Run the quiz and show final results with percentage
`,
    testCases: [
      { input: 'all correct for 5 questions', expected: 'Score: 5/5 (100%) 🏆' },
      { input: '3 correct out of 5', expected: 'Score: 3/5 (60%)' },
    ],
    solutionCode: `questions = [
    {"question": "What does CPU stand for?", "options": ["Central Processing Unit", "Computer Personal Unit", "Central Program Unit"], "answer": 0},
    {"question": "Which language is used for AI?", "options": ["HTML", "Python", "CSS"], "answer": 1},
    {"question": "What does HTML stand for?", "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language"], "answer": 0},
    {"question": "Which company made Python?", "options": ["Google", "Guido van Rossum", "Microsoft"], "answer": 1},
    {"question": "What is 2^10?", "options": ["512", "1024", "2048"], "answer": 1},
]

def run_quiz(questions):
    score = 0
    for i, q in enumerate(questions, 1):
        print(f"\\nQ{i}: {q['question']}")
        for j, opt in enumerate(q['options']):
            print(f"  {j + 1}. {opt}")
        
        try:
            answer = int(input("Your answer (1-3): ")) - 1
            if answer == q['answer']:
                print("✅ Correct!")
                score += 1
            else:
                print(f"❌ Wrong! Answer: {q['options'][q['answer']]}")
        except ValueError:
            print("Invalid input!")
    
    return score, len(questions)

correct, total = run_quiz(questions)
pct = round(correct / total * 100)
medal = "🏆" if pct == 100 else "🥈" if pct >= 80 else "🥉" if pct >= 60 else ""
print(f"\\n📊 Score: {correct}/{total} ({pct}%) {medal}")`,
  },
  {
    id: 'contact-book',
    title: 'Contact Book Manager',
    difficulty: 'builder',
    category: 'web-builder',
    xp: 45,
    description:
      'Build a contact book with add, search, list, and delete functions. Store as a dictionary and save to a JSON file.',
    realWorldContext:
      'This is how phone contacts work! You\'re building your own version of Google Contacts with the same CRUD (Create, Read, Update, Delete) operations used in every app.',
    skillsTaught: ['CRUD operations', 'json module', 'file I/O', 'menu-driven program'],
    hints: [
      'Use a dictionary: {name: {"phone": ..., "email": ...}}',
      'import json; json.dump(contacts, open("contacts.json", "w"))',
      'Build a menu loop: Add, Search, List, Delete, Quit',
    ],
    starterCode: `import json

contacts = {}

def add_contact(name, phone, email):
    """Add a new contact."""
    # TODO

def search_contact(name):
    """Search for a contact by name."""
    # TODO

def list_contacts():
    """List all contacts alphabetically."""
    # TODO

def delete_contact(name):
    """Delete a contact."""
    # TODO

def save_to_file():
    """Save contacts to contacts.json."""
    # TODO

def load_from_file():
    """Load contacts from contacts.json if it exists."""
    # TODO

# TODO: Build a menu loop
`,
    testCases: [
      { input: 'add Alice 0977123456', expected: 'Contact added: Alice ✅' },
      { input: 'search Alice', expected: 'Alice: 0977123456' },
      { input: 'delete Alice', expected: 'Contact deleted: Alice' },
    ],
    solutionCode: `import json
import os

contacts = {}

def add_contact(name, phone, email=""):
    contacts[name] = {"phone": phone, "email": email}
    print(f"✅ Contact added: {name}")

def search_contact(query):
    results = {n: d for n, d in contacts.items() if query.lower() in n.lower()}
    if results:
        for name, data in results.items():
            print(f"📞 {name}: {data['phone']} | {data['email']}")
    else:
        print("❌ No contacts found.")

def list_contacts():
    if not contacts:
        print("📭 No contacts yet.")
        return
    for name in sorted(contacts):
        data = contacts[name]
        print(f"  {name}: {data['phone']}")

def delete_contact(name):
    if name in contacts:
        del contacts[name]
        print(f"🗑️ Deleted: {name}")
    else:
        print("❌ Contact not found.")

def save_to_file():
    with open("contacts.json", "w") as f:
        json.dump(contacts, f, indent=2)
    print("💾 Saved!")

def load_from_file():
    global contacts
    if os.path.exists("contacts.json"):
        with open("contacts.json") as f:
            contacts = json.load(f)
        print(f"📂 Loaded {len(contacts)} contacts.")

load_from_file()
while True:
    print("\\n--- Contact Book ---")
    print("1. Add  2. Search  3. List  4. Delete  5. Save  6. Quit")
    choice = input("Choose: ")
    if choice == "1":
        add_contact(input("Name: "), input("Phone: "), input("Email: "))
    elif choice == "2":
        search_contact(input("Search: "))
    elif choice == "3":
        list_contacts()
    elif choice == "4":
        delete_contact(input("Name to delete: "))
    elif choice == "5":
        save_to_file()
    elif choice == "6":
        save_to_file()
        break`,
  },
  {
    id: 'robot-maze-solver',
    title: 'Robot Maze Solver',
    difficulty: 'builder',
    category: 'robot-control',
    xp: 50,
    description:
      'Given a grid maze (2D list), write a function that finds a path from start (S) to end (E). The robot can only move through open cells (.) and cannot go through walls (#).',
    realWorldContext:
      'Self-driving cars, warehouse robots (Amazon), and game AI all use pathfinding algorithms. You\'re building the brain of an autonomous robot!',
    skillsTaught: ['2D lists', 'recursion or BFS', 'visited tracking', 'backtracking'],
    hints: [
      'Represent the maze as a list of lists.',
      'Use a recursive function that tries each direction.',
      'Keep a "visited" set so you don\'t go in circles.',
      'Base case: reached "E" → return True.',
    ],
    starterCode: `# Robot Maze Solver
maze = [
    ['S', '.', '#', '.', '.'],
    ['#', '.', '#', '.', '#'],
    ['.', '.', '.', '.', '.'],
    ['.', '#', '#', '#', '.'],
    ['.', '.', '.', '#', 'E'],
]

def solve(maze, x, y, visited=None):
    """Try to find a path from (x,y) to 'E'. Return True if found."""
    if visited is None:
        visited = set()
    
    # TODO: Base cases (out of bounds, wall, visited, found E)
    # TODO: Mark as visited
    # TODO: Try all 4 directions recursively
    pass

# TODO: Find 'S' position and call solve()
# TODO: Print "Path found! 🎯" or "No path exists 😞"
`,
    testCases: [
      { input: 'maze above', expected: 'Path found! 🎯' },
    ],
    solutionCode: `maze = [
    ['S', '.', '#', '.', '.'],
    ['#', '.', '#', '.', '#'],
    ['.', '.', '.', '.', '.'],
    ['.', '#', '#', '#', '.'],
    ['.', '.', '.', '#', 'E'],
]

def solve(maze, x, y, visited=None):
    if visited is None:
        visited = set()
    
    rows, cols = len(maze), len(maze[0])
    
    if x < 0 or x >= rows or y < 0 or y >= cols:
        return False
    if maze[x][y] == '#':
        return False
    if (x, y) in visited:
        return False
    if maze[x][y] == 'E':
        return True
    
    visited.add((x, y))
    
    # Try all 4 directions
    if (solve(maze, x+1, y, visited) or
        solve(maze, x-1, y, visited) or
        solve(maze, x, y+1, visited) or
        solve(maze, x, y-1, visited)):
        maze[x][y] = '★'  # Mark path
        return True
    
    return False

# Find start position
for i in range(len(maze)):
    for j in range(len(maze[0])):
        if maze[i][j] == 'S':
            if solve(maze, i, j):
                print("🎯 Path found!")
                for row in maze:
                    print(" ".join(row))
            else:
                print("😞 No path exists")`,
    bonusChallenge: 'Use BFS instead of DFS to find the SHORTEST path.',
  },
  {
    id: 'class-pet-simulator',
    title: 'Virtual Pet Simulator',
    difficulty: 'builder',
    category: 'game-logic',
    xp: 45,
    description:
      'Create a Pet class with hunger, happiness, and energy attributes. Implement feed(), play(), and sleep() methods. The pet\'s stats change over time.',
    realWorldContext:
      'Tamagotchi, Neopets, Pokémon — all virtual pets use classes with attributes and methods. You\'re learning Object-Oriented Programming, the backbone of all modern software.',
    skillsTaught: ['classes', '__init__', 'methods', 'encapsulation', 'game loop'],
    hints: [
      'class Pet: def __init__(self, name): ...',
      'Each action changes multiple stats (feed: hunger-=30, energy-=5)',
      'Clamp values between 0 and 100.',
    ],
    starterCode: `# Virtual Pet Simulator
class Pet:
    def __init__(self, name):
        self.name = name
        self.hunger = 50   # 0 = full, 100 = starving
        self.happiness = 50 # 0 = sad, 100 = ecstatic
        self.energy = 50   # 0 = exhausted, 100 = hyper
    
    def feed(self):
        """Feed the pet: hunger ↓30, energy ↓5, happiness ↑10"""
        # TODO

    def play(self):
        """Play with pet: happiness ↑25, energy ↓20, hunger ↑15"""
        # TODO

    def sleep(self):
        """Put pet to sleep: energy ↑40, hunger ↑10, happiness ↓5"""
        # TODO

    def status(self):
        """Print the pet's current status with visual bars."""
        # TODO: Show name and stats with emoji bars

# TODO: Create a pet and build a game loop with menu
`,
    testCases: [
      { input: 'create "Pixel", feed, play, status', expected: 'Pixel — Hunger: 35, Happiness: 85, Energy: 25' },
    ],
    solutionCode: `class Pet:
    def __init__(self, name):
        self.name = name
        self.hunger = 50
        self.happiness = 50
        self.energy = 50

    def _clamp(self, val):
        return max(0, min(100, val))

    def feed(self):
        self.hunger = self._clamp(self.hunger - 30)
        self.energy = self._clamp(self.energy - 5)
        self.happiness = self._clamp(self.happiness + 10)
        print(f"🍖 {self.name} ate happily!")

    def play(self):
        if self.energy < 15:
            print(f"😴 {self.name} is too tired to play!")
            return
        self.happiness = self._clamp(self.happiness + 25)
        self.energy = self._clamp(self.energy - 20)
        self.hunger = self._clamp(self.hunger + 15)
        print(f"🎾 {self.name} had a blast!")

    def sleep(self):
        self.energy = self._clamp(self.energy + 40)
        self.hunger = self._clamp(self.hunger + 10)
        self.happiness = self._clamp(self.happiness - 5)
        print(f"💤 {self.name} is sleeping...")

    def status(self):
        def bar(value):
            filled = value // 10
            return "█" * filled + "░" * (10 - filled)
        
        print(f"\\n🐾 {self.name}")
        print(f"  Hunger:    [{bar(self.hunger)}] {self.hunger}")
        print(f"  Happiness: [{bar(self.happiness)}] {self.happiness}")
        print(f"  Energy:    [{bar(self.energy)}] {self.energy}")

pet = Pet(input("Name your pet: "))
while True:
    pet.status()
    print("\\n1.Feed  2.Play  3.Sleep  4.Quit")
    c = input("> ")
    if c == "1": pet.feed()
    elif c == "2": pet.play()
    elif c == "3": pet.sleep()
    elif c == "4": break`,
  },
  {
    id: 'csv-analyzer',
    title: 'CSV Data Analyzer',
    difficulty: 'builder',
    category: 'ai-explorer',
    xp: 45,
    description:
      'Build a tool that reads CSV data (student scores), calculates statistics (mean, median, mode, min, max), and generates a simple bar chart in the terminal.',
    realWorldContext:
      'Data scientists at Google, Netflix, and hospitals analyze CSV data every day. You\'re building the same analytical tools used in real data science — just in the terminal!',
    skillsTaught: ['csv handling', 'statistics module', 'data visualization', 'formatting'],
    hints: [
      'Split each line by comma to parse CSV.',
      'from statistics import mean, median, mode',
      'Create bar charts using "█" characters.',
    ],
    starterCode: `from statistics import mean, median

# Sample CSV data (name, math, science, english)
csv_data = \"\"\"Name,Math,Science,English
Alice,85,92,78
Bob,72,68,85
Chipo,95,88,91
Diana,60,75,82
Ethan,88,90,76\"\"\"

def parse_csv(data):
    """Parse CSV string into list of dicts."""
    # TODO: Return list like [{"Name": "Alice", "Math": 85, ...}, ...]
    pass

def subject_stats(records, subject):
    """Calculate mean, median, min, max for a subject."""
    # TODO
    pass

def bar_chart(records, subject):
    """Print a horizontal bar chart for the subject."""
    # TODO: Use █ blocks scaled to scores
    pass

# TODO: Parse data, show stats for each subject, show charts
`,
    testCases: [
      { input: 'csv_data above', expected: 'Math avg: 80.0, Science avg: 82.6, Top overall: Chipo' },
    ],
    solutionCode: `from statistics import mean, median

csv_data = \"\"\"Name,Math,Science,English
Alice,85,92,78
Bob,72,68,85
Chipo,95,88,91
Diana,60,75,82
Ethan,88,90,76\"\"\"

def parse_csv(data):
    lines = data.strip().split("\\n")
    headers = lines[0].split(",")
    records = []
    for line in lines[1:]:
        values = line.split(",")
        record = {}
        for i, h in enumerate(headers):
            record[h] = int(values[i]) if values[i].isdigit() else values[i]
        records.append(record)
    return records, headers[1:]

def subject_stats(records, subject):
    scores = [r[subject] for r in records]
    return {
        "mean": round(mean(scores), 1),
        "median": median(scores),
        "min": min(scores),
        "max": max(scores),
    }

def bar_chart(records, subject):
    print(f"\\n📊 {subject} Scores:")
    for r in sorted(records, key=lambda x: x[subject], reverse=True):
        bar = "█" * (r[subject] // 5)
        print(f"  {r['Name']:8} {bar} {r[subject]}")

records, subjects = parse_csv(csv_data)

for subj in subjects:
    stats = subject_stats(records, subj)
    print(f"\\n{subj}: Mean={stats['mean']}, Median={stats['median']}, Range={stats['min']}-{stats['max']}")
    bar_chart(records, subj)

# Overall top student
for r in records:
    r['_avg'] = round(mean([r[s] for s in subjects]), 1)
top = max(records, key=lambda r: r['_avg'])
print(f"\\n🏆 Top Student: {top['Name']} (avg: {top['_avg']})")`,
  },

  /* ═══════ MASTER (6) ═══════ */
  {
    id: 'encryption-tool',
    title: 'Caesar Cipher Encryption',
    difficulty: 'master',
    category: 'web-builder',
    xp: 60,
    description:
      'Build a Caesar cipher that encrypts and decrypts messages by shifting letters. Support any shift value. Preserve spaces, punctuation, and case.',
    realWorldContext:
      'Julius Caesar used this cipher 2000 years ago! Modern encryption (HTTPS, WhatsApp) uses the same core concept — transforming data so only authorized people can read it.',
    skillsTaught: ['ord()/chr()', 'modular arithmetic', 'string building', 'encryption concepts'],
    hints: [
      'Use ord() to get ASCII value, chr() to convert back.',
      'Shift within a-z: (ord(c) - ord("a") + shift) % 26 + ord("a")',
      'Handle uppercase and lowercase separately.',
      'To decrypt, shift by the negative value.',
    ],
    starterCode: `# Caesar Cipher — Encrypt & Decrypt

def encrypt(text, shift):
    """Encrypt text by shifting each letter by 'shift' positions."""
    # TODO: Shift each letter, preserve non-letters
    pass

def decrypt(text, shift):
    """Decrypt by reversing the shift."""
    # TODO: Hint — just encrypt with negative shift!
    pass

def brute_force(text):
    """Try all 26 possible shifts and print them all."""
    # TODO: Useful for cracking unknown ciphers
    pass

# TODO: Build a menu: Encrypt, Decrypt, Brute Force, Quit
`,
    testCases: [
      { input: 'encrypt("Hello World", 3)', expected: 'Khoor Zruog' },
      { input: 'decrypt("Khoor Zruog", 3)', expected: 'Hello World' },
    ],
    solutionCode: `def encrypt(text, shift):
    result = ""
    for c in text:
        if c.isalpha():
            base = ord('A') if c.isupper() else ord('a')
            result += chr((ord(c) - base + shift) % 26 + base)
        else:
            result += c
    return result

def decrypt(text, shift):
    return encrypt(text, -shift)

def brute_force(text):
    print("\\n🔓 Brute Force Results:")
    for shift in range(26):
        print(f"  Shift {shift:>2}: {decrypt(text, shift)}")

while True:
    print("\\n--- Caesar Cipher ---")
    print("1.Encrypt  2.Decrypt  3.Brute Force  4.Quit")
    c = input("> ")
    if c == "1":
        text = input("Message: ")
        shift = int(input("Shift: "))
        print(f"🔒 {encrypt(text, shift)}")
    elif c == "2":
        text = input("Cipher: ")
        shift = int(input("Shift: "))
        print(f"🔓 {decrypt(text, shift)}")
    elif c == "3":
        brute_force(input("Cipher: "))
    elif c == "4":
        break`,
    bonusChallenge: 'Add frequency analysis to automatically guess the shift value.',
  },
  {
    id: 'weather-api',
    title: 'Weather Dashboard (API)',
    difficulty: 'master',
    category: 'web-builder',
    xp: 70,
    description:
      'Build a weather dashboard that fetches real weather data from the OpenWeatherMap API for Lusaka (or any city). Display temperature, humidity, wind speed, and conditions.',
    realWorldContext:
      'Every weather app on your phone does exactly this. You\'re learning to consume APIs — the #1 skill for building modern web and mobile applications.',
    skillsTaught: ['requests module', 'API calls', 'JSON parsing', 'error handling', 'f-strings'],
    hints: [
      'Sign up at openweathermap.org for a free API key.',
      'Use the requests module: requests.get(url).json()',
      'The temperature comes in Kelvin — subtract 273.15 for Celsius.',
      'Handle errors: what if the city doesn\'t exist?',
    ],
    starterCode: `import requests

API_KEY = "your_api_key_here"  # Get free at openweathermap.org
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

def get_weather(city):
    """Fetch weather data for a city."""
    # TODO: Build the URL with parameters
    # TODO: Make the API request
    # TODO: Parse the JSON response
    # TODO: Return a clean dict with: temp, humidity, wind, description
    pass

def display_weather(data):
    """Display weather data in a nice format."""
    # TODO: Format and print with emojis
    pass

# TODO: Ask user for city and display weather
# TODO: Handle errors (invalid city, no internet)
`,
    testCases: [
      { input: 'Lusaka', expected: 'Lusaka: 25°C, Humidity: 65%, Wind: 12 km/h, Clear sky ☀️' },
    ],
    solutionCode: `import requests

API_KEY = "your_api_key_here"
BASE_URL = "http://api.openweathermap.org/data/2.5/weather"

def get_weather(city):
    try:
        params = {"q": city, "appid": API_KEY, "units": "metric"}
        response = requests.get(BASE_URL, params=params)
        
        if response.status_code == 404:
            return {"error": f"City '{city}' not found"}
        
        data = response.json()
        return {
            "city": data["name"],
            "country": data["sys"]["country"],
            "temp": round(data["main"]["temp"]),
            "feels_like": round(data["main"]["feels_like"]),
            "humidity": data["main"]["humidity"],
            "wind": round(data["wind"]["speed"] * 3.6),
            "description": data["weather"][0]["description"].title(),
            "icon": data["weather"][0]["main"],
        }
    except requests.ConnectionError:
        return {"error": "No internet connection"}

def display_weather(data):
    if "error" in data:
        print(f"❌ {data['error']}")
        return
    
    icons = {"Clear": "☀️", "Clouds": "☁️", "Rain": "🌧️", "Snow": "❄️", "Thunderstorm": "⛈️"}
    icon = icons.get(data["icon"], "🌡️")
    
    print(f"\\n{icon} Weather in {data['city']}, {data['country']}")
    print(f"  🌡️ Temperature: {data['temp']}°C (feels like {data['feels_like']}°C)")
    print(f"  💧 Humidity: {data['humidity']}%")
    print(f"  💨 Wind: {data['wind']} km/h")
    print(f"  📋 Conditions: {data['description']}")

while True:
    city = input("\\nEnter city (or 'quit'): ")
    if city.lower() == "quit": break
    display_weather(get_weather(city))`,
  },
  {
    id: 'chatbot-ai',
    title: 'Smart Chatbot with Intent Detection',
    difficulty: 'master',
    category: 'ai-explorer',
    xp: 75,
    description:
      'Build a chatbot that detects user intent using keyword matching and context. Handle at least 5 intents: greeting, weather, time, joke, help. Add a learning mode where users can teach it new responses.',
    realWorldContext:
      'Siri, Alexa, ChatGPT — all started with intent classification. You\'re building the same core logic that powers every AI assistant in the world!',
    skillsTaught: ['NLP basics', 'intent classification', 'pattern matching', 'state management', 'JSON persistence'],
    hints: [
      'Map keywords to intents: {"hello": "greeting", "weather": "weather_info", ...}',
      'Score each intent by counting matching keywords.',
      'Pick the intent with the highest score.',
      'Save learned responses to a JSON file.',
    ],
    starterCode: `import json
import random
from datetime import datetime

# Intent definitions: keyword lists → responses
intents = {
    "greeting": {
        "keywords": ["hello", "hi", "hey", "morning", "afternoon"],
        "responses": ["Hello! 👋", "Hey there!", "Hi! How can I help?"]
    },
    "farewell": {
        "keywords": ["bye", "goodbye", "see you", "later"],
        "responses": ["Goodbye! 👋", "See you later!", "Take care!"]
    },
    # TODO: Add weather, time, joke, help, and robotix intents
}

learned_responses = {}  # User-taught responses

def detect_intent(message):
    """Score each intent and return the best match."""
    # TODO: Tokenize message, score intents by keyword matches
    pass

def respond(intent):
    """Return a random response for the given intent."""
    # TODO
    pass

def learn(trigger, response):
    """Let the user teach the bot a new response."""
    # TODO
    pass

# TODO: Build the chat loop with learning mode
`,
    testCases: [
      { input: 'hello', expected: 'Hello! 👋 (or similar greeting)' },
      { input: 'what time is it', expected: 'Current time: 14:30 (or similar)' },
      { input: 'tell me a joke', expected: 'A joke response' },
    ],
    solutionCode: `import json
import random
import os
from datetime import datetime

intents = {
    "greeting": {
        "keywords": ["hello", "hi", "hey", "morning", "afternoon", "howdy"],
        "responses": ["Hello! 👋 How can I help?", "Hey there! What's up?", "Hi! Ready to code? 💻"]
    },
    "farewell": {
        "keywords": ["bye", "goodbye", "see you", "later", "quit"],
        "responses": ["Goodbye! 👋", "See you later! Keep coding! 🚀", "Take care! 💙"]
    },
    "time": {
        "keywords": ["time", "clock", "hour", "what time"],
        "responses": ["TIME_FUNC"]
    },
    "joke": {
        "keywords": ["joke", "funny", "laugh", "humor"],
        "responses": [
            "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
            "There are 10 types of people: those who understand binary and those who don't 😄",
            "A SQL query walks into a bar, sees two tables, and asks: 'Can I JOIN you?' 🍻",
        ]
    },
    "help": {
        "keywords": ["help", "what can you do", "commands", "options"],
        "responses": ["I can chat, tell jokes, check the time, and answer questions about ROBOTIX! Try asking me something 😊"]
    },
    "robotix": {
        "keywords": ["robotix", "robot", "program", "coding", "course", "class", "python"],
        "responses": ["ROBOTIX teaches coding & robotics to kids ages 6-18! 🤖", "We have programs from Robotics Foundations to AI & Machine Learning! Check /programs"]
    },
}

learned = {}
if os.path.exists("learned.json"):
    with open("learned.json") as f:
        learned = json.load(f)

def detect_intent(message):
    tokens = set(message.lower().split())
    scores = {}
    for intent, data in intents.items():
        score = sum(1 for kw in data["keywords"] if kw in message.lower())
        if score > 0:
            scores[intent] = score
    
    if message.lower() in learned:
        return "learned"
    
    return max(scores, key=scores.get) if scores else "unknown"

def respond(intent, message):
    if intent == "learned":
        return learned[message.lower()]
    if intent == "unknown":
        return "I don't understand that yet. Type 'teach' to help me learn! 🤔"
    
    response = random.choice(intents[intent]["responses"])
    if response == "TIME_FUNC":
        return f"🕐 It's {datetime.now().strftime('%H:%M on %A, %B %d')}"
    return response

print("🤖 ChatBot: Hello! Type 'quit' to exit, 'teach' to teach me.")
while True:
    msg = input("You: ").strip()
    if not msg: continue
    if msg.lower() in ["quit", "bye", "exit"]:
        print("🤖 Goodbye! 👋")
        break
    if msg.lower() == "teach":
        trigger = input("When someone says: ").lower()
        reply = input("I should respond: ")
        learned[trigger] = reply
        with open("learned.json", "w") as f:
            json.dump(learned, f)
        print("🤖 Got it! I learned something new! 🧠")
        continue
    
    intent = detect_intent(msg)
    print(f"🤖 {respond(intent, msg)}")`,
    bonusChallenge: 'Add sentiment analysis: detect if the user seems happy, frustrated, or confused, and adjust your tone.',
  },
  {
    id: 'data-dashboard',
    title: 'COVID Data Dashboard',
    difficulty: 'master',
    category: 'data-detective',
    xp: 70,
    description:
      'Build a terminal-based dashboard that processes health data (provided as CSV). Calculate daily averages, find peaks, detect trends, and visualize with ASCII charts. Generate a summary report.',
    realWorldContext:
      'During COVID-19, data dashboards saved millions of lives by helping governments make decisions. Epidemiologists, scientists, and health officials all rely on data analysis — you\'re building those tools!',
    skillsTaught: ['data processing', 'trend detection', 'ASCII visualization', 'report generation', 'statistics'],
    hints: [
      'Parse CSV into structured data.',
      'Use rolling averages to smooth noisy data.',
      'Detect peaks: a day higher than its neighbors.',
      'Build ASCII bar charts scaled to terminal width.',
    ],
    starterCode: `from statistics import mean

# Sample data: daily cases over 30 days in a district
daily_cases = [
    12, 15, 19, 22, 18, 25, 31,
    28, 35, 42, 38, 45, 52, 48,
    55, 62, 58, 65, 71, 68,
    45, 38, 32, 28, 22, 18, 15, 12, 10, 8
]

def rolling_average(data, window=7):
    """Calculate a rolling average with given window size."""
    # TODO
    pass

def find_peaks(data):
    """Find peak days (higher than both neighbors)."""
    # TODO
    pass

def detect_trend(data, window=7):
    """Determine if recent trend is rising, falling, or stable."""
    # TODO
    pass

def ascii_chart(data, width=50):
    """Print a horizontal ASCII bar chart."""
    # TODO
    pass

def generate_report(data):
    """Generate a complete analysis report."""
    # TODO: Combine all functions into a formatted report
    pass

generate_report(daily_cases)
`,
    testCases: [
      { input: 'daily_cases above', expected: 'Peak: Day 19 (71 cases), Trend: Declining, Avg: 33.8' },
    ],
    solutionCode: `from statistics import mean

daily_cases = [
    12, 15, 19, 22, 18, 25, 31,
    28, 35, 42, 38, 45, 52, 48,
    55, 62, 58, 65, 71, 68,
    45, 38, 32, 28, 22, 18, 15, 12, 10, 8
]

def rolling_average(data, window=7):
    return [round(mean(data[max(0,i-window+1):i+1]), 1) for i in range(len(data))]

def find_peaks(data):
    peaks = []
    for i in range(1, len(data) - 1):
        if data[i] > data[i-1] and data[i] > data[i+1]:
            peaks.append((i+1, data[i]))
    return peaks

def detect_trend(data, window=7):
    recent = data[-window:]
    first_half = mean(recent[:window//2])
    second_half = mean(recent[window//2:])
    diff = second_half - first_half
    if diff > 3: return "📈 Rising"
    elif diff < -3: return "📉 Declining"
    else: return "➡️ Stable"

def ascii_chart(data, width=40):
    mx = max(data)
    for i, val in enumerate(data):
        bar_len = int(val / mx * width)
        bar = "█" * bar_len
        print(f"Day {i+1:>2} │ {bar} {val}")

def generate_report(data):
    avg_all = round(mean(data), 1)
    rolling = rolling_average(data)
    peaks = find_peaks(data)
    trend = detect_trend(data)
    
    print("╔══════════════════════════════════════╗")
    print("║    📊 HEALTH DATA DASHBOARD          ║")
    print("╚══════════════════════════════════════╝")
    print(f"\\n📋 Summary ({len(data)} days)")
    print(f"  Total cases:  {sum(data)}")
    print(f"  Daily average: {avg_all}")
    print(f"  Peak day:     Day {data.index(max(data))+1} ({max(data)} cases)")
    print(f"  Lowest day:   Day {data.index(min(data))+1} ({min(data)} cases)")
    print(f"  Current trend: {trend}")
    
    print(f"\\n🔺 Peak days:")
    for day, cases in peaks:
        print(f"  Day {day}: {cases} cases")
    
    print(f"\\n📊 Daily Cases Chart:")
    ascii_chart(data)

generate_report(daily_cases)`,
  },
  {
    id: 'inventory-oop',
    title: 'Shop Inventory System (OOP)',
    difficulty: 'master',
    category: 'shop-math',
    xp: 65,
    description:
      'Build a complete inventory management system using OOP. Create Product and Inventory classes with add, remove, search, low-stock alerts, and sales tracking. Save/load from JSON.',
    realWorldContext:
      'Amazon, Shoprite, and every e-commerce site runs on inventory management systems. ERPs like SAP (worth $150 billion) are essentially giant inventory systems!',
    skillsTaught: ['OOP design', 'multiple classes', 'JSON persistence', 'error handling', 'business logic'],
    hints: [
      'Product class: name, price, quantity, category',
      'Inventory class: manages a dict of Products',
      'Add a sell() method that reduces quantity and tracks revenue.',
      'Low stock alert when quantity < threshold.',
    ],
    starterCode: `import json

class Product:
    def __init__(self, name, price, quantity, category):
        # TODO
        pass
    
    def sell(self, amount):
        """Sell items. Return True if enough stock."""
        # TODO
        pass
    
    def restock(self, amount):
        # TODO
        pass
    
    def to_dict(self):
        """Convert to dict for JSON saving."""
        # TODO
        pass

class Inventory:
    def __init__(self):
        self.products = {}
        self.revenue = 0
        self.sales_log = []
    
    def add_product(self, product):
        # TODO
        pass
    
    def sell_product(self, name, quantity):
        # TODO: Sell, track revenue, log sale
        pass
    
    def low_stock_alert(self, threshold=5):
        # TODO: Return products below threshold
        pass
    
    def search(self, query):
        # TODO: Search by name or category
        pass
    
    def report(self):
        # TODO: Print full inventory report
        pass
    
    def save(self, filename="inventory.json"):
        # TODO
        pass
    
    def load(self, filename="inventory.json"):
        # TODO
        pass

# TODO: Build an interactive menu system
`,
    testCases: [
      { input: 'add "Laptop" K8500 qty=10, sell 3', expected: 'Revenue: K25500, Stock: 7' },
    ],
    solutionCode: `import json
import os
from datetime import datetime

class Product:
    def __init__(self, name, price, quantity, category):
        self.name = name
        self.price = price
        self.quantity = quantity
        self.category = category

    def sell(self, amount):
        if amount > self.quantity:
            return False
        self.quantity -= amount
        return True

    def restock(self, amount):
        self.quantity += amount

    def to_dict(self):
        return {"name": self.name, "price": self.price, "quantity": self.quantity, "category": self.category}

class Inventory:
    def __init__(self):
        self.products = {}
        self.revenue = 0
        self.sales_log = []

    def add_product(self, product):
        self.products[product.name] = product
        print(f"✅ Added: {product.name} (K{product.price} × {product.quantity})")

    def sell_product(self, name, qty):
        if name not in self.products:
            print("❌ Product not found"); return
        p = self.products[name]
        if p.sell(qty):
            sale = p.price * qty
            self.revenue += sale
            self.sales_log.append({"product": name, "qty": qty, "total": sale, "time": str(datetime.now())})
            print(f"💰 Sold {qty}x {name} for K{sale}. Stock: {p.quantity}")
        else:
            print(f"⚠️ Not enough stock! Only {p.quantity} left.")

    def low_stock_alert(self, threshold=5):
        low = [p for p in self.products.values() if p.quantity < threshold]
        if low:
            print("\\n⚠️ LOW STOCK ALERTS:")
            for p in low:
                print(f"  {p.name}: only {p.quantity} left!")
        return low

    def search(self, query):
        results = [p for p in self.products.values() if query.lower() in p.name.lower() or query.lower() in p.category.lower()]
        for p in results:
            print(f"  {p.name} | K{p.price} | Stock: {p.quantity} | {p.category}")
        return results

    def report(self):
        print("\\n╔═══ INVENTORY REPORT ═══╗")
        for p in sorted(self.products.values(), key=lambda x: x.category):
            status = "⚠️" if p.quantity < 5 else "✅"
            print(f"  {status} {p.name:20} K{p.price:>8} × {p.quantity:>3}  [{p.category}]")
        print(f"\\n  Total Revenue: K{self.revenue:,.0f}")
        print(f"  Total Sales: {len(self.sales_log)}")
        print("╚════════════════════════╝")

    def save(self, fn="inventory.json"):
        data = {"products": {n: p.to_dict() for n, p in self.products.items()}, "revenue": self.revenue, "sales_log": self.sales_log}
        with open(fn, "w") as f: json.dump(data, f, indent=2)
        print("💾 Saved!")

    def load(self, fn="inventory.json"):
        if not os.path.exists(fn): return
        with open(fn) as f: data = json.load(f)
        for d in data["products"].values():
            self.products[d["name"]] = Product(d["name"], d["price"], d["quantity"], d["category"])
        self.revenue = data.get("revenue", 0)
        self.sales_log = data.get("sales_log", [])
        print(f"📂 Loaded {len(self.products)} products")

inv = Inventory()
inv.load()
while True:
    print("\\n1.Add 2.Sell 3.Search 4.Report 5.Low Stock 6.Save 7.Quit")
    c = input("> ")
    if c=="1": inv.add_product(Product(input("Name: "), float(input("Price: ")), int(input("Qty: ")), input("Category: ")))
    elif c=="2": inv.sell_product(input("Product: "), int(input("Qty: ")))
    elif c=="3": inv.search(input("Search: "))
    elif c=="4": inv.report()
    elif c=="5": inv.low_stock_alert()
    elif c=="6": inv.save()
    elif c=="7": inv.save(); break`,
  },
  {
    id: 'ml-predictor',
    title: 'Build Your Own ML Predictor',
    difficulty: 'master',
    category: 'ai-explorer',
    xp: 80,
    description:
      'Build a simple linear regression predictor from scratch (no libraries). Given study hours vs. exam scores data, train the model and predict scores for new inputs. Visualize the fit.',
    realWorldContext:
      'This is actual machine learning! Netflix predicts what you\'ll watch, Uber predicts ride prices, doctors predict patient outcomes — all using regression models. You\'re building the same thing from scratch!',
    skillsTaught: ['linear regression', 'gradient descent', 'data fitting', 'prediction', 'math fundamentals'],
    hints: [
      'Linear regression: y = mx + b',
      'Calculate m = Σ((xi-x̄)(yi-ȳ)) / Σ((xi-x̄)²)',
      'Calculate b = ȳ - m*x̄',
      'Visualize using ASCII: plot predicted vs actual.',
    ],
    starterCode: `# Build Your Own ML Predictor — Linear Regression from Scratch

# Training data: (study_hours, exam_score)
data = [
    (1, 35), (2, 45), (3, 52), (4, 58), (5, 65),
    (6, 72), (7, 78), (8, 82), (9, 88), (10, 95)
]

def train(data):
    """Calculate slope (m) and intercept (b) for y = mx + b."""
    # TODO: Calculate means, then m and b
    pass

def predict(hours, m, b):
    """Predict exam score for given study hours."""
    # TODO
    pass

def accuracy(data, m, b):
    """Calculate R² score to measure model accuracy."""
    # TODO
    pass

def visualize(data, m, b):
    """Create an ASCII scatter plot with the regression line."""
    # TODO
    pass

# TODO: Train, show results, let user make predictions
`,
    testCases: [
      { input: 'predict(5.5 hours)', expected: '~68 (close to actual trend)' },
      { input: 'R² score', expected: '> 0.95 (very good fit)' },
    ],
    solutionCode: `# Linear Regression from Scratch — No Libraries!

data = [
    (1, 35), (2, 45), (3, 52), (4, 58), (5, 65),
    (6, 72), (7, 78), (8, 82), (9, 88), (10, 95)
]

def train(data):
    n = len(data)
    x_mean = sum(x for x, y in data) / n
    y_mean = sum(y for x, y in data) / n
    
    numerator = sum((x - x_mean) * (y - y_mean) for x, y in data)
    denominator = sum((x - x_mean) ** 2 for x, y in data)
    
    m = numerator / denominator
    b = y_mean - m * x_mean
    return round(m, 2), round(b, 2)

def predict(hours, m, b):
    return round(m * hours + b, 1)

def r_squared(data, m, b):
    y_mean = sum(y for _, y in data) / len(data)
    ss_res = sum((y - predict(x, m, b)) ** 2 for x, y in data)
    ss_tot = sum((y - y_mean) ** 2 for x, y in data)
    return round(1 - ss_res / ss_tot, 4)

def visualize(data, m, b):
    max_y = 100
    width = 50
    print("\\n📊 Study Hours vs Exam Score")
    print("Score")
    for score in range(100, 0, -10):
        row = f" {score:>3} │"
        for x, y in data:
            col = int(x / 10 * width)
            if abs(y - score) < 5:
                row_list = list(row.ljust(width + 6))
                if col + 6 < len(row_list):
                    row_list[col + 6] = "●"
                row = "".join(row_list)
        
        pred_y = predict(score / 10, m, b) if score <= max_y else 0
        row_list = list(row.ljust(width + 6))
        pred_col = int((score - b) / m / 10 * width) if m > 0 else 0
        if 0 <= pred_col + 6 < len(row_list):
            if row_list[pred_col + 6] == "●":
                row_list[pred_col + 6] = "◉"
            else:
                row_list[pred_col + 6] = "·"
        print("".join(row_list))
    print(f"     └{'─' * width}")
    print(f"      {''.join(f'{i:<5}' for i in range(0, 11, 2))} Hours")
    print(f"  ● Actual   · Predicted line")

m, b = train(data)
r2 = r_squared(data, m, b)

print("🧠 ML PREDICTOR — Linear Regression")
print(f"\\n📐 Model: score = {m} × hours + {b}")
print(f"📊 R² Score: {r2} ({'Excellent' if r2 > 0.95 else 'Good' if r2 > 0.8 else 'Fair'})")
visualize(data, m, b)

while True:
    try:
        hours = input("\\nPredict score for how many study hours? (q to quit): ")
        if hours.lower() == 'q': break
        hours = float(hours)
        score = predict(hours, m, b)
        print(f"📈 Predicted exam score for {hours} hours: {score}")
        if score > 90: print("  🏆 That's A-grade territory!")
        elif score > 70: print("  ✅ Solid performance expected!")
        elif score > 50: print("  📚 More study time would help!")
        else: print("  ⚠️ You need to study more!")
    except ValueError:
        print("Enter a number!")`,
    bonusChallenge: 'Add polynomial regression (y = ax² + bx + c) for non-linear data using numpy.',
  },
];

/* Helper: Get challenges by difficulty */
export function getChallengesByDifficulty(diff: Difficulty): PythonChallenge[] {
  return PYTHON_CHALLENGES.filter(c => c.difficulty === diff);
}

/* Helper: Get challenges by category */
export function getChallengesByCategory(cat: Category): PythonChallenge[] {
  return PYTHON_CHALLENGES.filter(c => c.category === cat);
}

/* Helper: Calculate total XP */
export function getTotalXP(): number {
  return PYTHON_CHALLENGES.reduce((sum, c) => sum + c.xp, 0);
}

/* ─── XP Level System ─── */
export interface Level {
  name: string;
  xpRequired: number;
  icon: string;
}

export const LEVELS: Level[] = [
  { name: 'Beginner', xpRequired: 0, icon: '🌱' },
  { name: 'Apprentice', xpRequired: 100, icon: '📘' },
  { name: 'Explorer', xpRequired: 300, icon: '🧭' },
  { name: 'Builder', xpRequired: 600, icon: '🔧' },
  { name: 'Expert', xpRequired: 1000, icon: '⭐' },
  { name: 'Master', xpRequired: 1500, icon: '🏆' },
  { name: 'Grandmaster', xpRequired: 2500, icon: '👑' },
];
