/**
 * Seed script for Student Portfolios, Projects & Certificates
 * Real data — Zambian students at Robotix Institute
 * Run: pnpm tsx prisma/seed-portfolio.ts
 */
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Student Users ─────────────────────────────────────────────
const STUDENTS = [
  { name: 'Mwamba Chisanga', email: 'mwamba@robotix.zm', avatar: '👦🏾', bio: 'Young innovator and aspiring robotics engineer. I love building robots and coding games! 🤖✨', location: 'Lusaka, Zambia' },
  { name: 'Natasha Mulenga', email: 'natasha@robotix.zm', avatar: '👧🏾', bio: 'Future software engineer. Python enthusiast and creative problem solver. 💻🌟', location: 'Lusaka, Zambia' },
  { name: 'Chilufya Bwalya', email: 'chilufya@robotix.zm', avatar: '👦🏿', bio: 'Passionate about electronics and building smart gadgets. Arduino is my best friend! ⚡🔧', location: 'Kitwe, Zambia' },
  { name: 'Thandiwe Nyirenda', email: 'thandiwe@robotix.zm', avatar: '👧🏿', bio: 'Game developer in the making. I create worlds from code! 🎮✨', location: 'Ndola, Zambia' },
  { name: 'Kunda Tembo', email: 'kunda@robotix.zm', avatar: '👦🏾', bio: 'Robotics competition winner. Building the future one circuit at a time. 🏆🤖', location: 'Lusaka, Zambia' },
  { name: 'Mapalo Zulu', email: 'mapalo@robotix.zm', avatar: '👧🏾', bio: 'AI and data science explorer. Numbers tell stories! 📊🧠', location: 'Livingstone, Zambia' },
];

// ── Projects per student ──────────────────────────────────────
const PROJECTS: Record<number, Array<{
  title: string; description: string; tags: string[];
  programName: string; mediaEmoji: string; likes: number;
  featured: boolean; sourceCode: string; createdAt: string;
}>> = {
  // Mwamba
  0: [
    {
      title: 'Line Following Robot',
      description: 'Built an autonomous robot that follows a black line using two infrared sensors and an Arduino Uno. The robot uses a PID control algorithm to make smooth turns. It completed a full track lap in 28 seconds during the school robotics demo day.',
      tags: JSON.stringify(['Arduino', 'Robotics', 'IR Sensors', 'PID']),
      programName: 'Robotics Foundations',
      mediaEmoji: '🤖',
      likes: 67,
      featured: true,
      createdAt: '2026-01-20',
      sourceCode: `// Line Following Robot - Arduino Code
// Mwamba Chisanga - Robotix Institute

#define LEFT_SENSOR A0
#define RIGHT_SENSOR A1
#define MOTOR_L1 3
#define MOTOR_L2 4
#define MOTOR_R1 5
#define MOTOR_R2 6
#define SPEED_PIN_L 9
#define SPEED_PIN_R 10

int baseSpeed = 150;
float Kp = 25.0, Ki = 0.5, Kd = 15.0;
float lastError = 0, integral = 0;

void setup() {
  pinMode(LEFT_SENSOR, INPUT);
  pinMode(RIGHT_SENSOR, INPUT);
  for (int i = 3; i <= 6; i++) pinMode(i, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  int leftVal = analogRead(LEFT_SENSOR);
  int rightVal = analogRead(RIGHT_SENSOR);
  
  // Calculate error: positive = turn right, negative = turn left
  float error = leftVal - rightVal;
  integral += error;
  float derivative = error - lastError;
  
  float correction = Kp * error + Ki * integral + Kd * derivative;
  lastError = error;
  
  int leftSpeed = constrain(baseSpeed + correction, 0, 255);
  int rightSpeed = constrain(baseSpeed - correction, 0, 255);
  
  // Drive motors
  analogWrite(SPEED_PIN_L, leftSpeed);
  analogWrite(SPEED_PIN_R, rightSpeed);
  digitalWrite(MOTOR_L1, HIGH);
  digitalWrite(MOTOR_L2, LOW);
  digitalWrite(MOTOR_R1, HIGH);
  digitalWrite(MOTOR_R2, LOW);
  
  delay(10);
}`,
    },
    {
      title: 'Obstacle Avoidance Bot',
      description: 'A mobile robot that uses an HC-SR04 ultrasonic sensor mounted on a servo motor to scan 180° ahead. When an obstacle is detected within 25cm, the robot evaluates left and right distances and picks the clearest path. Tested in a classroom maze with 94% successful navigation rate.',
      tags: JSON.stringify(['Arduino', 'Ultrasonic', 'Servo', 'Navigation']),
      programName: 'Robotics Foundations',
      mediaEmoji: '🚗',
      likes: 52,
      featured: true,
      createdAt: '2025-12-15',
      sourceCode: `// Obstacle Avoidance Robot
// Mwamba Chisanga - Robotix Institute

#include <Servo.h>

#define TRIG_PIN 7
#define ECHO_PIN 8

Servo scanner;
int pos = 90;

long getDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH);
  return duration * 0.034 / 2; // cm
}

void scanAndDecide() {
  // Look right
  scanner.write(30);
  delay(500);
  long rightDist = getDistance();
  
  // Look left
  scanner.write(150);
  delay(500);
  long leftDist = getDistance();
  
  // Return to center
  scanner.write(90);
  delay(300);
  
  if (rightDist > leftDist) {
    turnRight();
  } else {
    turnLeft();
  }
}

void setup() {
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  scanner.attach(9);
  scanner.write(90);
  Serial.begin(9600);
}

void loop() {
  long distance = getDistance();
  Serial.print("Distance: ");
  Serial.println(distance);
  
  if (distance < 25) {
    stopMotors();
    delay(200);
    scanAndDecide();
  } else {
    moveForward();
  }
  delay(50);
}`,
    },
    {
      title: 'Python Calculator App',
      description: 'A feature-rich command-line calculator supporting basic arithmetic, square roots, power operations, and a memory function (M+, M-, MR, MC). Includes input validation to prevent division by zero and handles decimal precision up to 6 places.',
      tags: JSON.stringify(['Python', 'Math', 'CLI', 'OOP']),
      programName: 'Python Programming',
      mediaEmoji: '🐍',
      likes: 41,
      featured: false,
      createdAt: '2026-01-10',
      sourceCode: `# Calculator Application
# Mwamba Chisanga - Robotix Institute

import math

class Calculator:
    def __init__(self):
        self.memory = 0
        self.history = []
    
    def add(self, a, b):
        result = round(a + b, 6)
        self.history.append(f"{a} + {b} = {result}")
        return result
    
    def subtract(self, a, b):
        result = round(a - b, 6)
        self.history.append(f"{a} - {b} = {result}")
        return result
    
    def multiply(self, a, b):
        result = round(a * b, 6)
        self.history.append(f"{a} × {b} = {result}")
        return result
    
    def divide(self, a, b):
        if b == 0:
            raise ValueError("Cannot divide by zero!")
        result = round(a / b, 6)
        self.history.append(f"{a} ÷ {b} = {result}")
        return result
    
    def power(self, base, exp):
        result = round(math.pow(base, exp), 6)
        self.history.append(f"{base}^{exp} = {result}")
        return result
    
    def sqrt(self, n):
        if n < 0:
            raise ValueError("Cannot take square root of negative number!")
        result = round(math.sqrt(n), 6)
        self.history.append(f"√{n} = {result}")
        return result
    
    def memory_add(self, value):
        self.memory += value
    
    def memory_subtract(self, value):
        self.memory -= value
    
    def memory_recall(self):
        return self.memory
    
    def memory_clear(self):
        self.memory = 0
    
    def show_history(self):
        if not self.history:
            print("No calculations yet.")
            return
        print("\\n--- Calculation History ---")
        for i, entry in enumerate(self.history[-10:], 1):
            print(f"  {i}. {entry}")

def main():
    calc = Calculator()
    print("🧮 Robotix Calculator v2.0")
    print("Operations: +, -, *, /, ^, sqrt, M+, M-, MR, MC, history, quit")
    
    while True:
        try:
            cmd = input("\\n> ").strip().lower()
            if cmd == 'quit':
                print("Goodbye! 👋")
                break
            elif cmd == 'history':
                calc.show_history()
            elif cmd == 'mr':
                print(f"Memory: {calc.memory_recall()}")
            elif cmd == 'mc':
                calc.memory_clear()
                print("Memory cleared.")
            elif cmd == 'sqrt':
                n = float(input("Number: "))
                print(f"= {calc.sqrt(n)}")
            else:
                a = float(input("First number: "))
                op = input("Operation (+, -, *, /, ^): ")
                b = float(input("Second number: "))
                ops = {'+': calc.add, '-': calc.subtract,
                       '*': calc.multiply, '/': calc.divide,
                       '^': calc.power}
                if op in ops:
                    print(f"= {ops[op](a, b)}")
                else:
                    print("Unknown operation.")
        except ValueError as e:
            print(f"Error: {e}")
        except Exception as e:
            print(f"Something went wrong: {e}")

if __name__ == "__main__":
    main()`,
    },
    {
      title: 'Smart Night Light',
      description: 'An Arduino project using an LDR (Light Dependent Resistor) to automatically turn on RGB LEDs when ambient light drops below a threshold. Features three modes: warm white, colour cycle, and breathing effect. Power consumption optimized for battery operation.',
      tags: JSON.stringify(['Arduino', 'LED', 'LDR', 'Energy']),
      programName: 'Robotics Foundations',
      mediaEmoji: '💡',
      likes: 29,
      featured: false,
      createdAt: '2025-10-05',
      sourceCode: `// Smart Night Light with RGB LED
// Mwamba Chisanga - Robotix Institute

#define LDR_PIN A0
#define RED_PIN 9
#define GREEN_PIN 10
#define BLUE_PIN 11
#define BUTTON_PIN 2

int mode = 0; // 0=warm, 1=cycle, 2=breathe
int lightThreshold = 300;
int brightness = 0;
int fadeAmount = 5;

void setColor(int r, int g, int b) {
  analogWrite(RED_PIN, r);
  analogWrite(GREEN_PIN, g);
  analogWrite(BLUE_PIN, b);
}

void warmWhite() { setColor(255, 180, 50); }

void colorCycle() {
  static int hue = 0;
  hue = (hue + 1) % 360;
  // Simple HSV to RGB
  int r = 0, g = 0, b = 0;
  int region = hue / 60;
  int remainder = (hue % 60) * 255 / 60;
  switch(region) {
    case 0: r=255; g=remainder; break;
    case 1: r=255-remainder; g=255; break;
    case 2: g=255; b=remainder; break;
    case 3: g=255-remainder; b=255; break;
    case 4: b=255; r=remainder; break;
    case 5: b=255-remainder; r=255; break;
  }
  setColor(r, g, b);
  delay(20);
}

void breathe() {
  brightness += fadeAmount;
  if (brightness <= 0 || brightness >= 255)
    fadeAmount = -fadeAmount;
  setColor(brightness, brightness/2, 0);
  delay(30);
}

void setup() {
  pinMode(LDR_PIN, INPUT);
  pinMode(BUTTON_PIN, INPUT_PULLUP);
  pinMode(RED_PIN, OUTPUT);
  pinMode(GREEN_PIN, OUTPUT);
  pinMode(BLUE_PIN, OUTPUT);
}

void loop() {
  if (digitalRead(BUTTON_PIN) == LOW) {
    mode = (mode + 1) % 3;
    delay(300); // debounce
  }
  
  int light = analogRead(LDR_PIN);
  if (light < lightThreshold) { // Dark
    switch(mode) {
      case 0: warmWhite(); break;
      case 1: colorCycle(); break;
      case 2: breathe(); break;
    }
  } else {
    setColor(0, 0, 0); // LEDs off in daylight
  }
}`,
    },
  ],
  // Natasha
  1: [
    {
      title: 'Weather Dashboard App',
      description: 'A Python desktop application using tkinter that displays current weather for any Zambian city. Connects to the OpenWeatherMap API and shows temperature, humidity, wind speed, and a 5-day forecast with icons. Features Lusaka, Kitwe, Ndola, and Livingstone as quick-select cities.',
      tags: JSON.stringify(['Python', 'API', 'tkinter', 'Weather']),
      programName: 'Python Programming',
      mediaEmoji: '🌤️',
      likes: 58,
      featured: true,
      createdAt: '2026-02-05',
      sourceCode: `# Weather Dashboard - Zambian Cities
# Natasha Mulenga - Robotix Institute

import tkinter as tk
from tkinter import ttk, messagebox
import json
import urllib.request

API_KEY = "your_api_key_here"
CITIES = ["Lusaka", "Kitwe", "Ndola", "Livingstone", "Chipata", "Kabwe"]

class WeatherApp:
    def __init__(self, root):
        self.root = root
        self.root.title("🌤️ Zambia Weather Dashboard")
        self.root.geometry("500x600")
        self.root.configure(bg="#1a1a2e")
        
        # Title
        tk.Label(root, text="🌤️ Weather Dashboard",
                 font=("Helvetica", 20, "bold"),
                 fg="#e94560", bg="#1a1a2e").pack(pady=15)
        
        # City selector
        frame = tk.Frame(root, bg="#1a1a2e")
        frame.pack(pady=5)
        
        self.city_var = tk.StringVar(value="Lusaka")
        self.dropdown = ttk.Combobox(frame, textvariable=self.city_var,
                                      values=CITIES, width=20, font=("Helvetica", 12))
        self.dropdown.pack(side=tk.LEFT, padx=5)
        
        tk.Button(frame, text="Get Weather", command=self.fetch_weather,
                  bg="#e94560", fg="white", font=("Helvetica", 11, "bold"),
                  relief=tk.FLAT, padx=15).pack(side=tk.LEFT)
        
        # Results
        self.result_frame = tk.Frame(root, bg="#16213e", relief=tk.RIDGE, bd=2)
        self.result_frame.pack(pady=20, padx=30, fill=tk.X)
        
        self.temp_label = tk.Label(self.result_frame, text="-- °C",
                                    font=("Helvetica", 40, "bold"),
                                    fg="#eee", bg="#16213e")
        self.temp_label.pack(pady=10)
        
        self.desc_label = tk.Label(self.result_frame, text="Select a city",
                                    font=("Helvetica", 14), fg="#aaa", bg="#16213e")
        self.desc_label.pack()
        
        self.details_label = tk.Label(self.result_frame, text="",
                                       font=("Helvetica", 11), fg="#888", bg="#16213e")
        self.details_label.pack(pady=10)
    
    def fetch_weather(self):
        city = self.city_var.get()
        try:
            url = f"http://api.openweathermap.org/data/2.5/weather?q={city},ZM&appid={API_KEY}&units=metric"
            response = urllib.request.urlopen(url)
            data = json.loads(response.read())
            
            temp = data["main"]["temp"]
            feels = data["main"]["feels_like"]
            humidity = data["main"]["humidity"]
            wind = data["wind"]["speed"]
            desc = data["weather"][0]["description"].title()
            
            self.temp_label.config(text=f"{temp:.1f} °C")
            self.desc_label.config(text=desc)
            self.details_label.config(
                text=f"Feels like: {feels:.1f}°C | Humidity: {humidity}% | Wind: {wind} m/s"
            )
        except Exception as e:
            messagebox.showerror("Error", f"Could not fetch weather: {e}")

if __name__ == "__main__":
    root = tk.Tk()
    app = WeatherApp(root)
    root.mainloop()`,
    },
    {
      title: 'Student Grade Tracker',
      description: 'A Python program that manages student grades across multiple subjects. Supports adding students, recording grades, calculating averages, generating report cards, and exporting results to CSV. Used a dictionary-based data structure with file persistence using JSON.',
      tags: JSON.stringify(['Python', 'Data', 'CSV', 'JSON']),
      programName: 'Python Programming',
      mediaEmoji: '📊',
      likes: 44,
      featured: true,
      createdAt: '2026-01-15',
      sourceCode: `# Student Grade Tracker
# Natasha Mulenga - Robotix Institute

import json
import csv
import os
from datetime import datetime

DATA_FILE = "grades_data.json"

class GradeTracker:
    def __init__(self):
        self.students = {}
        self.load_data()
    
    def load_data(self):
        if os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'r') as f:
                self.students = json.load(f)
    
    def save_data(self):
        with open(DATA_FILE, 'w') as f:
            json.dump(self.students, f, indent=2)
    
    def add_student(self, name):
        if name not in self.students:
            self.students[name] = {"grades": {}, "added": str(datetime.now())}
            self.save_data()
            print(f"✅ Added student: {name}")
        else:
            print(f"Student {name} already exists.")
    
    def add_grade(self, student, subject, score):
        if student not in self.students:
            print("Student not found!")
            return
        if not 0 <= score <= 100:
            print("Score must be between 0 and 100!")
            return
        if subject not in self.students[student]["grades"]:
            self.students[student]["grades"][subject] = []
        self.students[student]["grades"][subject].append(score)
        self.save_data()
        print(f"✅ Recorded {subject}: {score} for {student}")
    
    def get_average(self, student):
        if student not in self.students:
            return 0
        grades = self.students[student]["grades"]
        all_scores = [s for subj in grades.values() for s in subj]
        return round(sum(all_scores) / len(all_scores), 1) if all_scores else 0
    
    def get_grade_letter(self, score):
        if score >= 80: return "A"
        elif score >= 70: return "B"
        elif score >= 60: return "C"
        elif score >= 50: return "D"
        else: return "F"
    
    def report_card(self, student):
        if student not in self.students:
            print("Student not found!")
            return
        print(f"\\n📋 Report Card - {student}")
        print("=" * 40)
        grades = self.students[student]["grades"]
        for subject, scores in grades.items():
            avg = round(sum(scores) / len(scores), 1)
            grade = self.get_grade_letter(avg)
            print(f"  {subject:15s} | Avg: {avg:5.1f} | Grade: {grade}")
        overall = self.get_average(student)
        print("=" * 40)
        print(f"  Overall Average: {overall} ({self.get_grade_letter(overall)})")
    
    def export_csv(self, filename="grades_export.csv"):
        with open(filename, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(["Student", "Subject", "Average", "Grade"])
            for student, data in self.students.items():
                for subject, scores in data["grades"].items():
                    avg = round(sum(scores) / len(scores), 1)
                    writer.writerow([student, subject, avg, self.get_grade_letter(avg)])
        print(f"✅ Exported to {filename}")

def main():
    tracker = GradeTracker()
    print("📊 Student Grade Tracker v1.0")
    while True:
        cmd = input("\\nCommand (add/grade/report/export/quit): ").strip().lower()
        if cmd == "quit": break
        elif cmd == "add":
            name = input("Student name: ")
            tracker.add_student(name)
        elif cmd == "grade":
            student = input("Student: ")
            subject = input("Subject: ")
            score = int(input("Score (0-100): "))
            tracker.add_grade(student, subject, score)
        elif cmd == "report":
            student = input("Student: ")
            tracker.report_card(student)
        elif cmd == "export":
            tracker.export_csv()

if __name__ == "__main__":
    main()`,
    },
    {
      title: 'Number Guessing Game',
      description: 'Interactive Python game with difficulty levels (Easy: 1-50, Medium: 1-100, Hard: 1-500). Tracks attempt count, gives "warmer/colder" hints, maintains a high score leaderboard saved to file, and includes a timer to measure solving speed.',
      tags: JSON.stringify(['Python', 'Games', 'Random', 'File I/O']),
      programName: 'Python Programming',
      mediaEmoji: '🎮',
      likes: 36,
      featured: false,
      createdAt: '2025-11-20',
      sourceCode: `# Number Guessing Game
# Natasha Mulenga - Robotix Institute

import random
import time
import json
import os

SCORES_FILE = "highscores.json"

def load_scores():
    if os.path.exists(SCORES_FILE):
        with open(SCORES_FILE) as f:
            return json.load(f)
    return []

def save_score(name, attempts, time_taken, difficulty):
    scores = load_scores()
    scores.append({
        "name": name, "attempts": attempts,
        "time": round(time_taken, 1), "difficulty": difficulty
    })
    scores.sort(key=lambda x: (x["attempts"], x["time"]))
    with open(SCORES_FILE, 'w') as f:
        json.dump(scores[:10], f, indent=2)

def play_game():
    print("\\n🎮 Number Guessing Game!")
    print("Difficulty: [E]asy (1-50) | [M]edium (1-100) | [H]ard (1-500)")
    
    choice = input("Choose: ").upper()
    ranges = {"E": (1, 50), "M": (1, 100), "H": (1, 500)}
    difficulty_names = {"E": "Easy", "M": "Medium", "H": "Hard"}
    
    if choice not in ranges:
        choice = "M"
    
    low, high = ranges[choice]
    secret = random.randint(low, high)
    attempts = 0
    prev_diff = float('inf')
    start = time.time()
    
    print(f"\\nI'm thinking of a number between {low} and {high}...")
    
    while True:
        try:
            guess = int(input("Your guess: "))
            attempts += 1
            
            if guess == secret:
                elapsed = time.time() - start
                print(f"\\n🎉 Correct! You got it in {attempts} attempts ({elapsed:.1f}s)")
                name = input("Your name for the leaderboard: ")
                save_score(name, attempts, elapsed, difficulty_names[choice])
                break
            
            diff = abs(guess - secret)
            hint = "🔥 Warmer!" if diff < prev_diff else "🧊 Colder!"
            direction = "📈 Higher!" if guess < secret else "📉 Lower!"
            print(f"  {direction} {hint}")
            prev_diff = diff
            
        except ValueError:
            print("Please enter a valid number!")

def show_leaderboard():
    scores = load_scores()
    if not scores:
        print("No scores yet!")
        return
    print("\\n🏆 Leaderboard:")
    for i, s in enumerate(scores[:10], 1):
        print(f"  {i}. {s['name']} - {s['attempts']} attempts in {s['time']}s ({s['difficulty']})")

if __name__ == "__main__":
    while True:
        print("\\n[P]lay | [L]eaderboard | [Q]uit")
        cmd = input("> ").upper()
        if cmd == "Q": break
        elif cmd == "P": play_game()
        elif cmd == "L": show_leaderboard()`,
    },
  ],
  // Chilufya
  2: [
    {
      title: 'Bluetooth Controlled Car',
      description: 'A remote-controlled car using Arduino Mega and HC-05 Bluetooth module. Controlled via a custom Android app built with MIT App Inventor. Supports forward, backward, left, right, and speed control (3 levels). Chassis built from recycled materials.',
      tags: JSON.stringify(['Arduino', 'Bluetooth', 'Motors', 'Android']),
      programName: 'Robotics Foundations',
      mediaEmoji: '🏎️',
      likes: 73,
      featured: true,
      createdAt: '2026-02-01',
      sourceCode: `// Bluetooth RC Car Controller
// Chilufya Bwalya - Robotix Institute

#include <SoftwareSerial.h>

SoftwareSerial bluetooth(10, 11); // RX, TX

#define ENA 5  // Left motor speed
#define ENB 6  // Right motor speed
#define IN1 2  // Left motor forward
#define IN2 3  // Left motor backward
#define IN3 4  // Right motor forward
#define IN4 7  // Right motor backward

int speed = 150; // Default speed (0-255)

void setup() {
  Serial.begin(9600);
  bluetooth.begin(9600);
  
  for (int i = 2; i <= 7; i++) pinMode(i, OUTPUT);
  pinMode(ENA, OUTPUT);
  pinMode(ENB, OUTPUT);
  
  Serial.println("Bluetooth Car Ready!");
}

void setSpeed() {
  analogWrite(ENA, speed);
  analogWrite(ENB, speed);
}

void forward() {
  setSpeed();
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}

void backward() {
  setSpeed();
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
}

void left() {
  setSpeed();
  digitalWrite(IN1, LOW); digitalWrite(IN2, HIGH);
  digitalWrite(IN3, HIGH); digitalWrite(IN4, LOW);
}

void right() {
  setSpeed();
  digitalWrite(IN1, HIGH); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, HIGH);
}

void stopCar() {
  digitalWrite(IN1, LOW); digitalWrite(IN2, LOW);
  digitalWrite(IN3, LOW); digitalWrite(IN4, LOW);
}

void loop() {
  if (bluetooth.available()) {
    char cmd = bluetooth.read();
    Serial.print("Command: "); Serial.println(cmd);
    
    switch(cmd) {
      case 'F': forward(); break;
      case 'B': backward(); break;
      case 'L': left(); break;
      case 'R': right(); break;
      case 'S': stopCar(); break;
      case '1': speed = 100; break; // Slow
      case '2': speed = 175; break; // Medium
      case '3': speed = 255; break; // Fast
    }
  }
}`,
    },
    {
      title: 'Temperature & Humidity Monitor',
      description: 'A real-time environmental monitoring station using DHT22 sensor with an LCD display. Logs data every 30 seconds to an SD card in CSV format. Includes min/max tracking and an alarm buzzer when temperature exceeds 35°C. Deployed in the school science lab.',
      tags: JSON.stringify(['Arduino', 'DHT22', 'LCD', 'SD Card']),
      programName: 'Robotics Foundations',
      mediaEmoji: '🌡️',
      likes: 45,
      featured: true,
      createdAt: '2025-12-10',
      sourceCode: `// Temperature & Humidity Monitor
// Chilufya Bwalya - Robotix Institute

#include <DHT.h>
#include <LiquidCrystal_I2C.h>
#include <SD.h>
#include <SPI.h>

#define DHT_PIN 2
#define DHT_TYPE DHT22
#define BUZZER_PIN 8
#define SD_CS 10
#define TEMP_ALARM 35.0

DHT dht(DHT_PIN, DHT_TYPE);
LiquidCrystal_I2C lcd(0x27, 16, 2);

float minTemp = 999, maxTemp = -999;
float minHum = 999, maxHum = -999;
unsigned long lastLog = 0;

void setup() {
  Serial.begin(9600);
  dht.begin();
  lcd.init();
  lcd.backlight();
  pinMode(BUZZER_PIN, OUTPUT);
  
  if (SD.begin(SD_CS)) {
    Serial.println("SD card ready.");
    File f = SD.open("log.csv", FILE_WRITE);
    if (f) {
      f.println("Time(s),Temperature(C),Humidity(%)");
      f.close();
    }
  }
  
  lcd.setCursor(0, 0);
  lcd.print("Env Monitor v1.0");
  delay(2000);
}

void logToSD(float temp, float hum) {
  File f = SD.open("log.csv", FILE_WRITE);
  if (f) {
    f.print(millis() / 1000);
    f.print(",");
    f.print(temp, 1);
    f.print(",");
    f.println(hum, 1);
    f.close();
  }
}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();
  
  if (isnan(temp) || isnan(hum)) {
    lcd.setCursor(0, 0);
    lcd.print("Sensor Error!   ");
    return;
  }
  
  // Track min/max
  if (temp < minTemp) minTemp = temp;
  if (temp > maxTemp) maxTemp = temp;
  if (hum < minHum) minHum = hum;
  if (hum > maxHum) maxHum = hum;
  
  // Display
  lcd.setCursor(0, 0);
  lcd.print("T:");
  lcd.print(temp, 1);
  lcd.print("C  H:");
  lcd.print(hum, 0);
  lcd.print("%  ");
  
  lcd.setCursor(0, 1);
  lcd.print("Hi:");
  lcd.print(maxTemp, 0);
  lcd.print(" Lo:");
  lcd.print(minTemp, 0);
  lcd.print("    ");
  
  // Alarm
  if (temp > TEMP_ALARM) {
    tone(BUZZER_PIN, 1000, 500);
  }
  
  // Log every 30 seconds
  if (millis() - lastLog > 30000) {
    logToSD(temp, hum);
    lastLog = millis();
    Serial.print(temp); Serial.print("C, ");
    Serial.print(hum); Serial.println("%");
  }
  
  delay(2000);
}`,
    },
  ],
  // Thandiwe
  3: [
    {
      title: 'Scratch Animated Story',
      description: 'An interactive animated story in Scratch about a young Zambian girl who discovers a magical baobab tree. Features 5 scenes with voice narration, background music, character animations, and 3 choice points where the player decides the story direction. Won 2nd place at the school creativity fair.',
      tags: JSON.stringify(['Scratch', 'Animation', 'Storytelling', 'Creative']),
      programName: 'Scratch Coding',
      mediaEmoji: '📖',
      likes: 61,
      featured: true,
      createdAt: '2026-01-25',
      sourceCode: `// Scratch Project: The Magic Baobab
// Thandiwe Nyirenda - Robotix Institute
// This is the pseudocode for the Scratch project

SCENE 1 - Introduction:
  Set backdrop to "zambian_village"
  Show sprite "Thandiwe_character"
  Say "Hello! I'm Liya from Zambia. Let me tell you about something magical..."
  Wait 3 seconds
  Glide to position (100, -50) in 2 seconds
  
SCENE 2 - Discovery:
  Change backdrop to "baobab_tree"
  Play sound "african_drums"
  Show sprite "glowing_tree"
  Add glow effect (color change loop)
  Say "One day, I found a baobab tree that glowed at sunset..."
  
CHOICE POINT 1:
  Ask "What should Liya do?"
  Option A: "Touch the tree" → Go to Scene 3A
  Option B: "Call her friends" → Go to Scene 3B
  
SCENE 3A - Solo Adventure:
  Special effect: sparkle animation
  Transport Liya to magical world
  Introduce sprite "wise_elephant"
  Dialogue about Zambian heritage and nature
  
SCENE 3B - Group Adventure:
  Show sprites "friend_1", "friend_2"
  Group explores together
  Musical instrument mini-game
  
SCENE 4 - The Lesson:
  The tree teaches about protecting nature
  Interactive quiz about Zambian wildlife
  Score tracking with variable
  
SCENE 5 - Ending:
  Return to village
  Share knowledge with village
  Credits with all character sprites
  Play celebration music`,
    },
    {
      title: 'Platformer Game',
      description: 'A side-scrolling platform game built in Scratch with 4 levels of increasing difficulty. Player collects gems while avoiding enemies and traps. Features gravity physics, double-jump mechanic, health system, and a final boss. All sprites hand-drawn using the Scratch paint editor.',
      tags: JSON.stringify(['Scratch', 'Games', 'Physics', 'Art']),
      programName: 'Scratch Coding',
      mediaEmoji: '🎮',
      likes: 54,
      featured: true,
      createdAt: '2025-12-20',
      sourceCode: `// Platformer Game - Scratch Pseudocode
// Thandiwe Nyirenda - Robotix Institute

GAME VARIABLES:
  health = 3
  score = 0
  level = 1
  velocity_y = 0
  gravity = -1
  jump_power = 15
  on_ground = false
  double_jump_used = false

PLAYER SPRITE:
  When green flag clicked:
    Set position to start
    Set health to 3
    
  Forever loop:
    // Gravity
    Change velocity_y by gravity
    Change y by velocity_y
    
    // Ground collision
    If touching "ground" color:
      Set velocity_y to 0
      Set on_ground to true
      Set double_jump_used to false
    
    // Movement
    If key "right arrow" pressed:
      Change x by 5
      Switch costume to "walk_right"
    If key "left arrow" pressed:
      Change x by -5
      Switch costume to "walk_left"
    
    // Jump
    If key "space" pressed:
      If on_ground:
        Set velocity_y to jump_power
        Set on_ground to false
      Else if not double_jump_used:
        Set velocity_y to jump_power * 0.8
        Set double_jump_used to true
    
    // Gem collection
    If touching "gem" sprite:
      Change score by 10
      Play sound "collect"
      Delete gem clone
    
    // Enemy collision
    If touching "enemy" sprite:
      Change health by -1
      Play sound "hurt"
      Glide to checkpoint in 0.5s
      If health = 0:
        Game Over screen

LEVEL SYSTEM:
  Level 1: Simple platforms, 5 gems, no enemies
  Level 2: Moving platforms, 8 gems, 2 enemies
  Level 3: Disappearing platforms, 10 gems, 4 enemies
  Level 4: Boss fight - dodge attacks, hit 5 times`,
    },
  ],
  // Kunda
  4: [
    {
      title: 'Robotic Arm Gripper',
      description: 'A 3-DOF robotic arm controlled by 4 servo motors through an Arduino. Features base rotation (180°), shoulder lift, elbow bend, and a gripper claw. Programmed with 5 preset positions for pick-and-place operations. Won 1st place at the Lusaka Schools Robotics Competition 2025.',
      tags: JSON.stringify(['Arduino', 'Servo', 'Robotics', '3D Printed']),
      programName: 'Robotics Foundations',
      mediaEmoji: '🦾',
      likes: 89,
      featured: true,
      createdAt: '2026-01-30',
      sourceCode: `// Robotic Arm Controller - 3DOF + Gripper
// Kunda Tembo - Robotix Institute
// 1st Place - Lusaka Schools Robotics Competition 2025

#include <Servo.h>

Servo base, shoulder, elbow, gripper;

// Preset positions: {base, shoulder, elbow, gripper}
int presets[][4] = {
  {90, 90, 90, 90},    // Home
  {45, 60, 120, 30},   // Pick left
  {135, 60, 120, 30},  // Pick right
  {90, 45, 135, 30},   // Pick front
  {90, 120, 60, 90},   // Drop into bin
};

void smoothMove(Servo &servo, int target) {
  int current = servo.read();
  int step = (target > current) ? 1 : -1;
  while (current != target) {
    current += step;
    servo.write(current);
    delay(15); // Smooth movement
  }
}

void goToPreset(int idx) {
  Serial.print("Moving to preset "); Serial.println(idx);
  smoothMove(base, presets[idx][0]);
  smoothMove(shoulder, presets[idx][1]);
  smoothMove(elbow, presets[idx][2]);
  smoothMove(gripper, presets[idx][3]);
  delay(500);
}

void pickAndPlace(int from, int to) {
  goToPreset(from);       // Move to pick position
  delay(300);
  smoothMove(gripper, 30); // Close gripper
  delay(500);
  goToPreset(0);          // Lift to home
  delay(300);
  goToPreset(to);         // Move to place position
  delay(300);
  smoothMove(gripper, 90); // Open gripper
  delay(500);
  goToPreset(0);          // Return home
}

void setup() {
  Serial.begin(9600);
  base.attach(3);
  shoulder.attach(5);
  elbow.attach(6);
  gripper.attach(9);
  goToPreset(0); // Start at home
  Serial.println("Robotic Arm Ready!");
  Serial.println("Commands: 0-4 (presets), P (pick & place)");
}

void loop() {
  if (Serial.available()) {
    char cmd = Serial.read();
    if (cmd >= '0' && cmd <= '4') {
      goToPreset(cmd - '0');
    } else if (cmd == 'P' || cmd == 'p') {
      // Demo: pick from front, place in bin
      pickAndPlace(3, 4);
    }
  }
}`,
    },
    {
      title: 'Sumo Wrestling Robot',
      description: 'A compact sumo bot designed for the mini-sumo competition format (10cm x 10cm ring). Uses two sharp IR distance sensors for opponent detection and two line sensors to detect the ring edge. Employs an aggressive seek-and-push strategy with a low center of gravity wedge design.',
      tags: JSON.stringify(['Arduino', 'Competition', 'Sumo', 'Strategy']),
      programName: 'Robotics Foundations',
      mediaEmoji: '🤼',
      likes: 76,
      featured: true,
      createdAt: '2025-11-15',
      sourceCode: `// Mini Sumo Robot - Competition Code
// Kunda Tembo - Robotix Institute

#define LEFT_LINE A0    // Left edge sensor
#define RIGHT_LINE A1   // Right edge sensor
#define LEFT_IR A2      // Left opponent sensor
#define RIGHT_IR A3     // Right opponent sensor
#define MOTOR_L1 3
#define MOTOR_L2 4
#define MOTOR_R1 5
#define MOTOR_R2 6
#define SPEED_L 9
#define SPEED_R 10
#define START_BTN 2

int attackSpeed = 255;
int searchSpeed = 180;
int lineThreshold = 500; // White = ring edge

enum State { WAITING, SEARCHING, ATTACKING, EVADING };
State state = WAITING;

void setMotors(int left, int right) {
  analogWrite(SPEED_L, abs(left));
  analogWrite(SPEED_R, abs(right));
  digitalWrite(MOTOR_L1, left > 0 ? HIGH : LOW);
  digitalWrite(MOTOR_L2, left > 0 ? LOW : HIGH);
  digitalWrite(MOTOR_R1, right > 0 ? HIGH : LOW);
  digitalWrite(MOTOR_R2, right > 0 ? LOW : HIGH);
}

void forward(int spd) { setMotors(spd, spd); }
void backward(int spd) { setMotors(-spd, -spd); }
void spinLeft(int spd) { setMotors(-spd, spd); }
void spinRight(int spd) { setMotors(spd, -spd); }
void stop() { setMotors(0, 0); }

bool edgeDetected() {
  return analogRead(LEFT_LINE) > lineThreshold || 
         analogRead(RIGHT_LINE) > lineThreshold;
}

void setup() {
  for (int i = 3; i <= 6; i++) pinMode(i, OUTPUT);
  pinMode(START_BTN, INPUT_PULLUP);
  Serial.begin(9600);
  
  // Wait for start button (5 second countdown per rules)
  while (digitalRead(START_BTN) == HIGH) {}
  delay(5000); // Competition 5-second delay
  state = SEARCHING;
}

void loop() {
  // Priority 1: Don't fall off the ring!
  if (edgeDetected()) {
    backward(attackSpeed);
    delay(200);
    spinLeft(searchSpeed);
    delay(400);
    return;
  }
  
  int leftDist = analogRead(LEFT_IR);
  int rightDist = analogRead(RIGHT_IR);
  bool seesLeft = leftDist > 400;
  bool seesRight = rightDist > 400;
  
  if (seesLeft && seesRight) {
    // Opponent dead ahead - CHARGE!
    forward(attackSpeed);
    state = ATTACKING;
  } else if (seesLeft) {
    spinLeft(searchSpeed);
    state = ATTACKING;
  } else if (seesRight) {
    spinRight(searchSpeed);
    state = ATTACKING;
  } else {
    // Search pattern: spin slowly
    spinRight(searchSpeed);
    state = SEARCHING;
  }
  
  delay(10);
}`,
    },
  ],
  // Mapalo
  5: [
    {
      title: 'Zambian Population Data Viz',
      description: 'A Python data visualization project analyzing Zambian population data by province using matplotlib and pandas. Creates bar charts, pie charts, and a population density heatmap. Data sourced from the Zambia Statistics Agency 2022 census. Includes population growth trend analysis from 2000-2022.',
      tags: JSON.stringify(['Python', 'Pandas', 'Matplotlib', 'Data Science']),
      programName: 'Python Programming',
      mediaEmoji: '📈',
      likes: 55,
      featured: true,
      createdAt: '2026-02-10',
      sourceCode: `# Zambian Population Data Visualization
# Mapalo Zulu - Robotix Institute

import matplotlib.pyplot as plt
import numpy as np

# Zambia 2022 Census Data (approximate, thousands)
provinces = {
    "Lusaka": 3360,
    "Copperbelt": 2663,
    "Southern": 2100,
    "Eastern": 2020,
    "Northern": 1510,
    "Central": 1900,
    "Luapula": 1280,
    "Muchinga": 990,
    "North-Western": 980,
    "Western": 1080
}

# Historical population (millions)
years = [2000, 2005, 2010, 2015, 2020, 2022]
population = [10.2, 11.4, 13.1, 15.9, 18.4, 19.6]

# Color scheme
colors = ['#e94560', '#0f3460', '#16213e', '#533483',
          '#e94560', '#0f3460', '#16213e', '#533483',
          '#e94560', '#0f3460']

fig, axes = plt.subplots(2, 2, figsize=(14, 10))
fig.suptitle("Zambia Population Analysis 2022", fontsize=16, fontweight='bold')

# 1. Bar Chart - Population by Province
ax1 = axes[0, 0]
names = list(provinces.keys())
values = list(provinces.values())
bars = ax1.barh(names, values, color=colors)
ax1.set_xlabel("Population (thousands)")
ax1.set_title("Population by Province")
for bar, val in zip(bars, values):
    ax1.text(bar.get_width() + 30, bar.get_y() + bar.get_height()/2,
             f'{val:,}', va='center', fontsize=8)

# 2. Pie Chart - Population Distribution
ax2 = axes[0, 1]
ax2.pie(values, labels=names, autopct='%1.1f%%', colors=colors,
        textprops={'fontsize': 7}, pctdistance=0.85)
ax2.set_title("Population Distribution")

# 3. Line Chart - Growth Trend
ax3 = axes[1, 0]
ax3.plot(years, population, 'o-', color='#e94560', linewidth=2, markersize=8)
ax3.fill_between(years, population, alpha=0.1, color='#e94560')
ax3.set_xlabel("Year")
ax3.set_ylabel("Population (millions)")
ax3.set_title("Population Growth Trend")
ax3.grid(True, alpha=0.3)
for x, y in zip(years, population):
    ax3.annotate(f'{y}M', (x, y), textcoords="offset points",
                 xytext=(0, 10), ha='center', fontsize=8)

# 4. Density Comparison
ax4 = axes[1, 1]
# Area in km² (approximate)
areas = {
    "Lusaka": 21896, "Copperbelt": 31328, "Southern": 85283,
    "Eastern": 51476, "Northern": 77650, "Central": 94395,
    "Luapula": 50567, "Muchinga": 87806, "North-Western": 125827,
    "Western": 126386
}
densities = [provinces[p] * 1000 / areas[p] for p in provinces]
ax4.bar(range(len(names)), densities, color=colors)
ax4.set_xticks(range(len(names)))
ax4.set_xticklabels(names, rotation=45, ha='right', fontsize=7)
ax4.set_ylabel("People per km²")
ax4.set_title("Population Density")

plt.tight_layout()
plt.savefig("zambia_population_2022.png", dpi=150, bbox_inches='tight')
plt.show()

# Summary statistics
total = sum(provinces.values()) * 1000
print(f"\\n📊 Zambia Population Summary (2022)")
print(f"Total Population: {total:,}")
print(f"Most populated: {max(provinces, key=provinces.get)} ({max(provinces.values()):,}k)")
print(f"Least populated: {min(provinces, key=provinces.get)} ({min(provinces.values()):,}k)")
print(f"Average province: {total // len(provinces):,}")
print(f"Growth rate (2000-2022): {((19.6/10.2)**(1/22)-1)*100:.1f}% per year")`,
    },
    {
      title: 'Quiz Bot with Score Analytics',
      description: 'A Python quiz application that generates questions from a JSON question bank, tracks scores per category, calculates performance percentiles, and generates a detailed analytics report. Supports multiple question types: multiple choice, true/false, and fill in the blank.',
      tags: JSON.stringify(['Python', 'JSON', 'Analytics', 'Education']),
      programName: 'Python Programming',
      mediaEmoji: '🧠',
      likes: 42,
      featured: false,
      createdAt: '2025-12-01',
      sourceCode: `# Quiz Bot with Analytics
# Mapalo Zulu - Robotix Institute

import json
import random
from datetime import datetime

QUESTIONS = {
    "Science": [
        {"q": "What is the chemical symbol for water?", "type": "mc",
         "options": ["H2O", "CO2", "NaCl", "O2"], "answer": "H2O"},
        {"q": "The Earth revolves around the Sun.", "type": "tf", "answer": True},
        {"q": "What planet is known as the Red Planet?", "type": "fill", "answer": "mars"},
    ],
    "Math": [
        {"q": "What is 15% of 200?", "type": "mc",
         "options": ["25", "30", "35", "20"], "answer": "30"},
        {"q": "A triangle has 4 sides.", "type": "tf", "answer": False},
        {"q": "What is the square root of 144?", "type": "fill", "answer": "12"},
    ],
    "Technology": [
        {"q": "What does CPU stand for?", "type": "mc",
         "options": ["Central Processing Unit", "Computer Personal Unit",
                     "Central Program Utility", "Core Processing Unit"],
         "answer": "Central Processing Unit"},
        {"q": "HTML is a programming language.", "type": "tf", "answer": False},
        {"q": "What does RAM stand for? (Random ___ Memory)", "type": "fill", "answer": "access"},
    ]
}

class QuizBot:
    def __init__(self):
        self.results = {}
        self.total_time = 0
    
    def ask_question(self, category, question):
        print(f"\\n[{category}] {question['q']}")
        start = datetime.now()
        
        if question["type"] == "mc":
            for i, opt in enumerate(question["options"], 1):
                print(f"  {i}. {opt}")
            ans = input("Your answer (1-4): ").strip()
            try:
                user_answer = question["options"][int(ans) - 1]
            except:
                user_answer = ""
            correct = user_answer == question["answer"]
            
        elif question["type"] == "tf":
            ans = input("True or False? (T/F): ").strip().upper()
            correct = (ans == "T") == question["answer"]
            
        elif question["type"] == "fill":
            ans = input("Your answer: ").strip().lower()
            correct = ans == question["answer"]
        
        elapsed = (datetime.now() - start).seconds
        self.total_time += elapsed
        
        if correct:
            print("✅ Correct!")
        else:
            print(f"❌ Wrong. Answer: {question['answer']}")
        
        return correct
    
    def run_quiz(self):
        print("🧠 Quiz Bot v2.0")
        print("=" * 40)
        
        for category, questions in QUESTIONS.items():
            self.results[category] = {"correct": 0, "total": 0}
            random.shuffle(questions)
            
            for q in questions:
                self.results[category]["total"] += 1
                if self.ask_question(category, q):
                    self.results[category]["correct"] += 1
        
        self.show_analytics()
    
    def show_analytics(self):
        print("\\n" + "=" * 40)
        print("📊 QUIZ ANALYTICS REPORT")
        print("=" * 40)
        
        total_correct = sum(r["correct"] for r in self.results.values())
        total_questions = sum(r["total"] for r in self.results.values())
        
        for cat, data in self.results.items():
            pct = data["correct"] / data["total"] * 100 if data["total"] > 0 else 0
            bar = "█" * int(pct / 10) + "░" * (10 - int(pct / 10))
            print(f"  {cat:15s} {bar} {pct:.0f}% ({data['correct']}/{data['total']})")
        
        overall = total_correct / total_questions * 100
        print(f"\\n  Overall Score: {total_correct}/{total_questions} ({overall:.1f}%)")
        print(f"  Time Taken: {self.total_time}s")
        print(f"  Avg per Question: {self.total_time / total_questions:.1f}s")
        
        if overall >= 80: grade = "🌟 Excellent!"
        elif overall >= 60: grade = "👍 Good job!"
        elif overall >= 40: grade = "📚 Keep practicing!"
        else: grade = "💪 Don't give up!"
        print(f"  Grade: {grade}")

if __name__ == "__main__":
    bot = QuizBot()
    bot.run_quiz()`,
    },
  ],
};

// ── Certificates ──────────────────────────────────────────────
const CERTIFICATES: Record<number, Array<{
  courseName: string; grade: string; issueDate: string;
  description: string; skills: string[]; instructorName: string;
}>> = {
  0: [
    { courseName: 'Robotics Foundations', grade: 'distinction', issueDate: '2026-01-15', description: 'Completed 12-week Robotics Foundations program. Built 4 functional robots using Arduino, DC motors, servos, and sensors.', skills: ['Arduino Programming', 'Circuit Design', 'Sensor Integration', 'PID Control', 'Mechanical Assembly'], instructorName: 'Mr. Bwalya Mwamba' },
    { courseName: 'Python Programming', grade: 'merit', issueDate: '2025-12-20', description: 'Completed 10-week Python Programming course. Mastered variables, loops, functions, OOP basics, and file I/O.', skills: ['Python 3', 'Object-Oriented Programming', 'File Handling', 'Error Handling', 'CLI Applications'], instructorName: 'Ms. Chanda Phiri' },
    { courseName: 'Scratch Coding', grade: 'distinction', issueDate: '2025-06-10', description: 'Completed 8-week Scratch Coding introductory course. Created 6 interactive projects including games and animations.', skills: ['Block Programming', 'Game Design', 'Animation', 'Logical Thinking', 'Event Handling'], instructorName: 'Mr. Emmanuel Zulu' },
  ],
  1: [
    { courseName: 'Python Programming', grade: 'distinction', issueDate: '2026-01-20', description: 'Completed 10-week Python Programming course with top marks. Excelled in data handling and API integration projects.', skills: ['Python 3', 'API Integration', 'Data Visualization', 'tkinter GUI', 'JSON/CSV Processing'], instructorName: 'Ms. Chanda Phiri' },
    { courseName: 'Digital Skills Basics', grade: 'distinction', issueDate: '2025-08-15', description: 'Completed Digital Skills fundamentals course covering internet safety, productivity tools, and basic web concepts.', skills: ['Internet Safety', 'Google Workspace', 'Basic HTML', 'Presentation Skills', 'Research Skills'], instructorName: 'Mr. Joseph Tembo' },
  ],
  2: [
    { courseName: 'Robotics Foundations', grade: 'distinction', issueDate: '2026-01-10', description: 'Completed 12-week Robotics Foundations with exceptional performance in electronics and Bluetooth communication projects.', skills: ['Arduino Programming', 'Bluetooth Communication', 'Motor Control', 'Sensor Arrays', 'Data Logging'], instructorName: 'Mr. Bwalya Mwamba' },
    { courseName: 'Scratch Coding', grade: 'merit', issueDate: '2025-07-20', description: 'Completed 8-week Scratch Coding course. Strong performance in game development and event-driven programming.', skills: ['Block Programming', 'Game Mechanics', 'Variables & Lists', 'Broadcasting', 'Cloning'], instructorName: 'Mr. Emmanuel Zulu' },
  ],
  3: [
    { courseName: 'Scratch Coding', grade: 'distinction', issueDate: '2026-01-30', description: 'Completed 8-week Scratch Coding course with outstanding creative projects. Won 2nd place at school creativity fair.', skills: ['Block Programming', 'Interactive Storytelling', 'Game Physics', 'Character Animation', 'Sound Design'], instructorName: 'Mr. Emmanuel Zulu' },
  ],
  4: [
    { courseName: 'Robotics Foundations', grade: 'distinction', issueDate: '2026-02-01', description: 'Completed 12-week Robotics Foundations with distinction. Won 1st place at Lusaka Schools Robotics Competition 2025.', skills: ['Arduino Programming', 'Servo Control', 'Competition Strategy', 'Mechanical Design', '3D Printing Basics'], instructorName: 'Mr. Bwalya Mwamba' },
    { courseName: 'Advanced Robotics', grade: 'merit', issueDate: '2025-11-25', description: 'Completed 10-week Advanced Robotics course covering multi-actuator systems and autonomous navigation.', skills: ['Multi-servo Coordination', 'Autonomous Navigation', 'Sensor Fusion', 'Competition Tactics', 'ROS Basics'], instructorName: 'Mr. Bwalya Mwamba' },
  ],
  5: [
    { courseName: 'Python Programming', grade: 'merit', issueDate: '2026-02-10', description: 'Completed 10-week Python Programming course. Excelled in data analysis and visualization modules.', skills: ['Python 3', 'Pandas', 'Matplotlib', 'Data Analysis', 'Statistical Thinking'], instructorName: 'Ms. Chanda Phiri' },
    { courseName: 'AI & Machine Learning Intro', grade: 'merit', issueDate: '2025-12-15', description: 'Completed 8-week AI/ML introductory course covering basic machine learning concepts and Python ML libraries.', skills: ['ML Concepts', 'scikit-learn Basics', 'Data Preprocessing', 'Classification', 'Model Evaluation'], instructorName: 'Dr. Mwila Kangwa' },
  ],
};

// ── XP / Level config ─────────────────────────────────────────
const LEVELS = [
  { xp: 0, level: 1 }, { xp: 500, level: 2 }, { xp: 1200, level: 3 },
  { xp: 2000, level: 4 }, { xp: 3000, level: 5 }, { xp: 4200, level: 6 },
  { xp: 5500, level: 7 }, { xp: 7000, level: 8 }, { xp: 8800, level: 9 },
  { xp: 10800, level: 10 }, { xp: 13000, level: 11 }, { xp: 15500, level: 12 },
  { xp: 18300, level: 13 }, { xp: 21500, level: 14 }, { xp: 25000, level: 15 },
];

function getLevel(xp: number) {
  let level = 1;
  for (const l of LEVELS) { if (xp >= l.xp) level = l.level; }
  return level;
}

const XP_VALUES = [12450, 11200, 10800, 8200, 13500, 9800];
const STREAK_VALUES = [42, 35, 28, 15, 50, 22];

let certCounter = 1;
function nextCertNumber() {
  return `CERT-2026-${String(certCounter++).padStart(4, '0')}`;
}

async function main() {
  console.log('🎨 Seeding Student Portfolios...\n');

  const password = await bcrypt.hash('Student123!', 10);

  for (let i = 0; i < STUDENTS.length; i++) {
    const s = STUDENTS[i];
    const xp = XP_VALUES[i];
    const level = getLevel(xp);

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email: s.email },
      update: { name: s.name, role: 'student' },
      create: { email: s.email, password, name: s.name, role: 'student' },
    });

    // Upsert portfolio
    await prisma.portfolio.upsert({
      where: { userId: user.id },
      update: { bio: s.bio, avatar: s.avatar, location: s.location, totalXp: xp, level, daysStreak: STREAK_VALUES[i] },
      create: { userId: user.id, bio: s.bio, avatar: s.avatar, location: s.location, totalXp: xp, level, daysStreak: STREAK_VALUES[i], isPublic: true },
    });

    // Delete old projects & certs for clean re-seed
    await prisma.portfolioProject.deleteMany({ where: { userId: user.id } });
    await prisma.certificate.deleteMany({ where: { userId: user.id } });

    // Create projects
    const projects = PROJECTS[i] || [];
    for (const p of projects) {
      await prisma.portfolioProject.create({
        data: {
          userId: user.id,
          title: p.title,
          description: p.description,
          tags: typeof p.tags === 'string' ? p.tags : JSON.stringify(p.tags),
          programName: p.programName,
          mediaEmoji: p.mediaEmoji,
          sourceCode: p.sourceCode,
          likes: p.likes,
          featured: p.featured,
          isPublic: true,
          createdAt: new Date(p.createdAt),
        },
      });
    }
    console.log(`  ✅ ${s.name}: ${projects.length} projects`);

    // Create certificates
    const certs = CERTIFICATES[i] || [];
    for (const c of certs) {
      await prisma.certificate.create({
        data: {
          userId: user.id,
          courseName: c.courseName,
          grade: c.grade,
          issueDate: new Date(c.issueDate),
          certNumber: nextCertNumber(),
          description: c.description,
          skills: JSON.stringify(c.skills),
          instructorName: c.instructorName,
        },
      });
    }
    console.log(`  ✅ ${s.name}: ${certs.length} certificates`);
  }

  console.log('\n🎉 Portfolio seed complete!');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
