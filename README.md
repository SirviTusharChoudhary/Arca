<div align="center">
  <h1>⬡ Arca</h1>
  <p><strong>A modern, real-time project management platform built for teams.</strong></p>
  <p>Inspired by the simplicity of Jira, with the polish of a premium SaaS product.</p>
  <br/>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" />
  <img src="https://img.shields.io/badge/Firebase-12-FFCA28?style=flat-square&logo=firebase" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-4-06B6D4?style=flat-square&logo=tailwindcss" />
  <img src="https://img.shields.io/badge/Framer Motion-12-EF008F?style=flat-square&logo=framer" />
</div>

---

## 📋 Problem Statement

Managing tasks and teams in modern software projects is fragmented. Teams resort to a patchwork of spreadsheets, chat threads, and heavyweight tools — creating noise instead of clarity.

**Arca** solves this by providing a single, focused workspace where project admins can create projects, assign tasks with priorities and deadlines, track team workload, and monitor progress in real time — all with a fluid, animated interface that doesn't feel like work to use.

---

## ✨ Features

### 🔐 Authentication
- **Email/Password** and **Google OAuth** sign-in powered by Firebase Auth
- Persistent sessions with auto-redirects after login
- Secure, per-user Firestore profile auto-creation on first sign-in

### 🗂 Project Dashboard
- Create unlimited projects with a **color theme**, **type** (Software / Marketing / Design), and live card preview
- Real-time list of all joined projects, filterable via **global debounced search**
- Admin/member role enforcement — attempting to access another user's dashboard returns an `AccessDenied` page

### 📌 Task Management
- **Admin-only** task creation with full control over:
  - **Title & Description** (expandable inline in the list)
  - **Priority** levels: `Urgent`, `High`, `Medium`, `Low` with color-coded badges
  - **Assignee** — pick any project member from a live dropdown
  - **Deadline** — datetime picker with live overdue detection
- Members can update their own task **status** (`To Do` → `In Progress` → `Done`) directly from the list
- **Star** tasks for quick access in the "Starred" view
- Overdue tasks are highlighted with an animated red **OVERDUE** badge

### 🔍 Filtering & Sorting
- Right-hand slide-in **Filter Sidebar** with:
  - Filter by **Priority** (multi-select)
  - Filter by **Status** (multi-select)
  - **Overdue Only** toggle
  - Sort by **Newest**, **Deadline (Closest)**, or **Deadline (Furthest)**
- **Project-scoped search** from the Navbar using debouncing to minimize re-renders

### 👥 Team Management
- **Invite system**: Admins generate a shareable invite link (project ID). Members navigate to `/join/:projectid` to submit a join request
- **Pending Invites panel**: Admin approvals are instant and optimistically reflected in the UI
- **Team Modal**: Browse all members with a debounced search, remove members (admin-only) with confirmation
- Real-time membership listener — members removed mid-session are redirected immediately

### 📊 Analytics Dashboard (Admin-Only)
- **Summary cards**: Total tasks, Completed, Overdue, and Efficiency percentage
- **Animated progress bar** for overall project completion
- **Status Donut Chart** — breakdown of `Done`, `In Progress`, and `To Do` tasks
- **Priority Bar Chart** — distribution across `Urgent`, `High`, `Medium`, `Low`
- **Team Workload** — Jira-style horizontal progress bars showing tasks per member (top 6)

### 🌙 Dark Mode & Theming
- Full **Light / Dark mode** toggle persisted in `localStorage`
- Smooth, animated Sun/Moon icon transition in the Navbar
- Every component supports both themes with zero flash on load

### ✨ Animations
- Powered by **Framer Motion** throughout:
  - Stagger animations on all list and card renders
  - Spring-based hover effects on buttons and cards
  - Slide-in task descriptions on expand
  - Animated sidebar entrance / exit
  - Page-level fade-in transitions

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (CSS-first config) |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Charts | Recharts |
| Backend / Database | Firebase Firestore (real-time) |
| Authentication | Firebase Auth (Email + Google OAuth) |
| Routing | React Router DOM v7 |
| ID Generation | UUID v13 |

---

## 🗂 Folder Structure

```
src/
├── components/
│   ├── auth/           # Login, Signup modals
│   ├── layout/         # Navbar, FilterSidebar
│   ├── modals/         # CreateProject, CreateTask, PendingInvite, TeamModal
│   ├── projects/       # ProjectList, ProjectAnalytics
│   ├── tasks/          # TaskList
│   └── ui/             # AccessDenied, ProfilePopup
├── context/
│   ├── AuthContext.jsx  # Firebase auth state + user profile listener
│   └── ThemeContext.jsx # Dark / light mode state
├── hooks/
│   └── useDebounce.js   # Generic debounce hook
├── loaders/
│   ├── AuthLoader.jsx   # Full-screen splash on cold start
│   └── PageLoader.jsx   # Equalizer animation for data loads
├── pages/
│   ├── LandingPage.jsx
│   ├── Dashboard.jsx
│   ├── ProjectPage.jsx
│   └── JoinProjectPage.jsx
└── services/
    └── firebase.js      # Firebase app initialization
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- A [Firebase project](https://console.firebase.google.com/) with **Firestore** and **Authentication** enabled
- Google Sign-In enabled in the Firebase Auth console

### 1. Clone the repository
```bash
git clone https://github.com/your-username/arca.git
cd arca
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> ⚠️ Never commit `.env` to version control. It is already included in `.gitignore`.

### 4. Set up Firestore Security Rules

Paste the following into your [Firebase Console → Firestore → Rules](https://console.firebase.google.com/):

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users: signed-in users can read all; can only write their own doc
    // Exception: any signed-in user can update joinedProjects (needed for invite flow)
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (
        request.auth.uid == userId ||
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['joinedProjects'])
      );
    }

    // Projects: any signed-in user can read/create
    // Only admin can update/delete; members can only add themselves to pendingInvite
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        resource.data.admin == request.auth.uid ||
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['pendingInvite'])
      );
      allow delete: if request.auth != null && resource.data.admin == request.auth.uid;
    }

    // Tasks: project members and admin can read; only admin can create/delete
    // An assigned member can update status and starred on their own tasks
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.admin == request.auth.uid ||
        (resource.data.assignedTo == request.auth.uid &&
          request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status', 'starred']))
      );
      allow delete: if request.auth != null &&
        get(/databases/$(database)/documents/projects/$(resource.data.projectId)).data.admin == request.auth.uid;
    }
  }
}
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 6. Build for production
```bash
npm run build
```

Output is in the `dist/` directory, ready to deploy to **Vercel**, **Netlify**, or any static host.

---

## 🌐 Deployment

A `vercel.json` is included for one-click Vercel deployment with correct SPA routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## 🔑 How the Invite Flow Works

1. **Admin** copies the project's invite link (e.g., `https://your-app.vercel.app/join/abc123`)
2. **New member** opens the link while logged in → sees the project name and a "Request to Join" button
3. Member's UID is added to `pendingInvite[]` on the project document
4. **Admin** sees the pending request in the "Pending Invites" panel and approves or rejects
5. On approval, the member's UID is moved to `members[]` and their `joinedProjects` array is updated atomically

---

## 📄 License

MIT — feel free to use, fork, and build on Arca.
