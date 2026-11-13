# EduPulse | Online Learning Platform (Courses, Custom Video Player & Quizzes)

A full-stack, responsive, production-ready EdTech platform inspired by Coursera and Udemy. Built with **React 18, Vite, Tailwind CSS, Node.js, Express, and MongoDB Mongoose**.

---

## 🌟 Key Highlights & Features

### 1. Course Catalog (Module 1)
- **Course Discovery Grid**: Rich course cards with thumbnails, category tags, difficulty badges (Beginner, Intermediate, Advanced), instructor details, duration, lesson count, and star ratings.
- **Search & Filtering**: Real-time debounced title and keyword search, category pills, difficulty level filters, and sorting (Most Popular, Highest Rated, Newest Releases).
- **Graceful States**: Polished loading skeleton cards, interactive empty states, and pagination controls.

### 2. Course Details & Syllabus (Module 2)
- **Detailed Curriculum**: Course overview, "What You'll Learn" checklists, prerequisites, and verified instructor credential cards.
- **Collapsible Syllabus Accordion**: Expandable modules showing lessons with duration, free preview access, and completed indicators.
- **Enrollment Flow**: 1-click enrollment with progress tracking.

### 3. Custom HTML5 Video Player (Module 3)
- Built **natively with the HTML5 Video API** (no third-party embedded iframe wrappers).
- Controls: Play/Pause (spacebar support), custom responsive seekbar with buffered indicator and hover scrubbing, volume slider & mute toggle, playback speed adjustment (0.5x, 1x, 1.25x, 1.5x, 2x), and fullscreen mode.
- **WebVTT Subtitles**: Integrated captions support via standard WebVTT tracks.
- **Playback Resume**: Automatically resumes playback from your last watched timestamp.
- **Lesson Navigation**: Auto-advances to the next lesson on completion, plus manual Next/Previous buttons.

### 4. Timestamped Notes (Module 4)
- Capture thoughts while watching; automatically binds the note to the video's active playback second (`currentTime`).
- Jump to timestamp: Clicking any saved note seeks the video directly to that exact second.
- In-place editing, deletion, and full persistence to MongoDB.

### 5. Interactive Transcript Panel (Module 5)
- Displays lesson transcript broken down into timestamped speech cues.
- Real-time active line highlighting synchronized with video playback.
- Auto-scroll keeps the spoken line in view.
- Click any transcript line to jump video playback to that exact cue.

### 6. Interactive Quiz Engine (Module 6)
- Supports **3 distinct question formats**:
  1. *Multiple-Choice*: Single select with letter badges.
  2. *Multiple-Select*: Multi-checkbox questions testing comprehensive knowledge.
  3. *Drag-and-Order*: Interactive item sequencing with HTML5 drag-and-drop and accessible up/down arrow reordering.
- **Quiz Timer**: Dynamic countdown timer with urgent red warning alerts and auto-submission on expiry.
- **Scoring & Review**: Instant grading with pass/fail thresholds, question-by-question breakdown, and detailed explanations for every option.
- **Retake Capability**: Retake quizzes at will and preserve past attempt history in MongoDB.

### 7. Learner Progress Dashboard (Module 7)
- **Overall Analytics**: Total learning hours, completed lessons, certificates earned, and average quiz scores.
- **Circular Progress Rings**: Custom animated SVG rings displaying course completion percentages.
- **Learning Streak Calendar**: 14-day study streak visualizer tracking active study days.
- **Continue Learning**: Quick-resume card directly taking learners back to their last accessed lesson and second.

### 8. Certificate Generation & Print (Module 8)
- Unlocked automatically upon completing 100% of course lessons.
- Ornate, official certificate design with gold seals, instructor signature, completion date, and unique Certificate ID.
- **Browser Print Ready**: Native `@media print` CSS ensures clean A4 print/PDF export via `window.print()`.
- **Public Verification**: Dedicated verification page for any certificate ID (e.g. `/certificate/EDUPULSE-2026-UX9841`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router DOM v6, Tailwind CSS, Lucide React, Framer Motion, Canvas Confetti.
- **Backend**: Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs, Morgan.
- **Database**: MongoDB with Mongoose ODM (includes an automatic embedded in-memory fallback for zero-friction local development).

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (v9 or higher)

### 1. Installation
In the project root directory (`online-learning-platform`), run:
```bash
npm run install:all
```
*(This installs all dependencies across the root, backend, and frontend packages).*

### 2. Running Frontend & Backend Concurrently
From the root directory, simply run:
```bash
npm run dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)

*(The backend will automatically connect to your local MongoDB service, or if not found, seamlessly start an embedded in-memory database with pre-populated courses, quizzes, and demo user data).*

---

## 🔑 Demo Account Credentials

For instant demonstration and mentor evaluation, you can either:
1. Click the **"1-Click Demo Login"** button on the Navbar or Login page.
2. Or use these credentials:
   - **Email**: `demo@edulearn.com`
   - **Password**: `password123`

---

## 📹 Mentor Demonstration Checklist (Loom / MP4 Walkthrough)

When recording a demo video for your mentor:

1. **Introduction & Catalog (1 min)**:
   - Introduce EduPulse and showcase the landing page.
   - Go to `/courses`, test the search bar, filter by "Web Development" or "Data Science", and test the difficulty filter.
2. **Course Details & Enrollment (1 min)**:
   - Open *Full-Stack React & Node.js Mastery*.
   - Expand the syllabus accordion to show sections, lessons, durations, and preview tags.
   - Click "Enroll Now" or "Continue Learning".
3. **Custom Video Player, Notes & Transcript (2.5 mins)**:
   - Play the video, toggle playback speed (1.5x), test seeking, and show WebVTT subtitles.
   - Switch to the **Transcript** tab: observe active line highlighting and auto-scroll as the video plays. Click a transcript line to show the video jumping to that timestamp.
   - Switch to the **Notes** tab: write a note at the current timestamp, click the saved note to demonstrate jumping playback, and show inline editing.
4. **Interactive Quiz Engine (2 mins)**:
   - Navigate to the Quiz for the lesson.
   - Demonstrate the countdown timer.
   - Answer the multiple-choice question, the multi-select question, and reorder the drag-and-order question using either drag-and-drop or the arrow buttons.
   - Submit quiz: show instant scoring, explanations, confetti celebration, and retake option.
5. **Learner Dashboard & Streak Calendar (1.5 mins)**:
   - Navigate to `/dashboard`.
   - Highlight the circular SVG progress rings, 14-day study streak calendar, learning hours, and Continue Learning card.
6. **Certificate Generation & Printing (1 min)**:
   - Open the completed course certificate (`/certificate/EDUPULSE-2026-UX9841`).
   - Click "Print / Save PDF" to show clean A4 print preview.
