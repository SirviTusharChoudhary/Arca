<div align="center">
  <h1 style="display:flex;align-items:center;justify-content:center;gap:10px;margin:0;">
    <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-label="Arca logo">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
      <path d="M3.29 7 12 12l8.71-5"></path>
      <path d="M12 22V12"></path>
    </svg>
    <span style="color:#2563EB;font-weight:800;letter-spacing:-0.03em;">Arca</span>
  </h1>
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

**Arca** solves this by providing a single, focused workspace where project admins can create projects, assign tasks with priorities and deadlines, track team workload, manage meetings, and monitor progress in real time — all with a fluid, animated interface that doesn't feel like work to use.

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

### 💬 Google Meet Integration (Meetings)
- **Schedule Meetings**: Native integration to orchestrate Google Meet sessions directly within the project workspace
- **Smart Status Transitions**: Meetings dynamically state-switch between `Upcoming` (with high-precision countdowns), `Live` (pulsing indicator), and `Completed`
- **Time-Gated Access**: The "Join" button becomes exclusively active during the scheduled meeting duration, redirecting directly to your GMeet room
- **Compact Jira-Style UI**: Sleek, single-line table rows prioritizing screen real estate and readability without bulky cards
- **Admin Control**: Meeting creators or workspace admins can seamlessly delete meetings

### 🌙 Dark Mode & Theming
- Full **Light / Dark mode** toggle persisted in `localStorage`
- Smooth, animated Sun/Moon icon transition in the Navbar
- Every component supports both themes with zero flash on load

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
    function isSignedIn() {
      return request.auth != null;
    }

    function isSelf(userId) {
      return isSignedIn() && request.auth.uid == userId;
    }

    function projectPath(projectId) {
      return /databases/$(database)/documents/projects/$(projectId);
    }

    function projectExists(projectId) {
      return exists(projectPath(projectId));
    }

    function projectData(projectId) {
      return get(projectPath(projectId)).data;
    }

    function isProjectAdmin(projectId) {
      return isSignedIn() &&
        projectExists(projectId) &&
        projectData(projectId).admin == request.auth.uid;
    }

    function isProjectMember(projectId) {
      return isSignedIn() &&
        projectExists(projectId) &&
        (
          projectData(projectId).admin == request.auth.uid ||
          request.auth.uid in projectData(projectId).members
        );
    }

    function isValidTaskStatus(status) {
      return status in ["To Do", "In Progress", "Done"];
    }

    function isValidTaskPriority(priority) {
      return priority in ["Low", "Medium", "High", "Urgent"];
    }

    // USER DOCUMENTS
    match /users/{userId} {
      allow read: if isSignedIn();

      allow create: if isSelf(userId) &&
        request.resource.data.uid == userId &&
        request.resource.data.joinedProjects is list;

      allow update: if isSignedIn() && (
        // User can edit own profile.
        isSelf(userId) ||
        // Needed by current admin invite flow (approve/remove member updates target user's joinedProjects).
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(["joinedProjects"])
      );

      allow delete: if false;
    }

    // PROJECT DOCUMENTS
    match /projects/{projectId} {
      allow read: if isSignedIn();

      allow create: if isSignedIn() &&
        request.resource.data.admin == request.auth.uid &&
        request.resource.data.projectId == projectId &&
        request.resource.data.pendingInvite is list &&
        request.resource.data.members is list;

      allow update: if isSignedIn() && (
        // Project admin can update project freely.
        isProjectAdmin(projectId) ||
        // Non-admin can only request access by touching pendingInvite only.
        (
          !isProjectMember(projectId) &&
          request.resource.data.diff(resource.data).affectedKeys().hasOnly(["pendingInvite"]) &&
          request.auth.uid in request.resource.data.pendingInvite
        )
      );
      allow delete: if isProjectAdmin(projectId);

      // MEETINGS SUBCOLLECTION
      match /meetings/{meetingId} {
        allow read: if isProjectMember(projectId);

        allow create: if isProjectAdmin(projectId) &&
          request.resource.data.keys().hasOnly([
            "title",
            "meetLink",
            "scheduledAt",
            "duration",
            "createdBy",
            "createdAt"
          ]) &&
          request.resource.data.createdBy == request.auth.uid;

        allow update: if isProjectAdmin(projectId);
        allow delete: if isProjectAdmin(projectId);
      }
    }

    // TASK DOCUMENTS
    match /tasks/{taskId} {
      allow read: if isSignedIn() &&
        resource.data.projectId is string &&
        isProjectMember(resource.data.projectId);

      allow create: if isSignedIn() &&
        request.resource.data.projectId is string &&
        isProjectAdmin(request.resource.data.projectId) &&
        request.resource.data.keys().hasOnly([
          "title",
          "description",
          "taskId",
          "projectId",
          "assignedTo",
          "deadline",
          "status",
          "starred",
          "priority",
          "projectName",
          "createdAt"
        ]) &&
        request.resource.data.taskId == taskId &&
        isValidTaskStatus(request.resource.data.status) &&
        isValidTaskPriority(request.resource.data.priority);

      allow update: if isSignedIn() && (
        // Admin can update tasks in their project.
        isProjectAdmin(resource.data.projectId) ||
        // Assignee can only change status/starred.
        (
          resource.data.assignedTo == request.auth.uid &&
          request.resource.data.diff(resource.data).affectedKeys().hasOnly(["status", "starred"]) &&
          request.resource.data.projectId == resource.data.projectId &&
          request.resource.data.assignedTo == resource.data.assignedTo &&
          request.resource.data.taskId == resource.data.taskId &&
          isValidTaskStatus(request.resource.data.status)
        )
      );

      allow delete: if isSignedIn() && isProjectAdmin(resource.data.projectId);
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
