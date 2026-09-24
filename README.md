# 🔒 CampusVoice — Privacy-Preserving Campus Grievance Platform

> **Verified Anonymous Model**: The system cryptographically verifies that the reporter is a genuine registered student, while the organization-facing application completely decouples and hides the student's identity.

---

## 🌟 The Core Innovation: Verified Anonymity

Traditional campus grievance portals force a broken compromise:
1. **Unverified Anonymity**: Leads to spam, defamatory posts, and trolling.
2. **Identified Reporting**: Leads to fear of retaliation, academic penalty, or social pressure.
3. **Cosmetic "Hide My Name" Checkboxes**: Only hides names in the frontend CSS while leaking student Roll No/Email in the backend API payload.

**CampusVoice solves this with Verified Anonymity**:
- **Authentication**: The student must log in with a valid university email to prevent spam.
- **Data Isolation**: The complaint document in MongoDB does **NOT** store the student's name, email, or Student ID.
- **Cryptographic Mapping**: A separate, non-exposed `ComplaintAccess` reference enables the student to view status updates and message administration privately.
- **Admin Triage & Zero Leakage**: Staff and department heads only see `Verified Anonymous Student` and the public tracking ID (`CV-A82F91`).
- **AI Sanitization**: AI categorization receives only the problem text, never personal account metadata.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Vite), Tailwind CSS, React Router DOM, Axios, Lucide Icons, Context API |
| **Backend** | Node.js, Express.js (REST API Architecture), JWT Authentication, bcryptjs |
| **Database** | MongoDB Atlas / Local MongoDB with Mongoose Schema isolation |
| **AI Layer** | Text-based AI classification (Google Gemini API / NLP Heuristic Engine) |
| **Storage Optimization** | Lightweight text-only storage compliant with 512MB MongoDB Atlas tier (zero image/video/binary payload) |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or newer)
- MongoDB running locally OR a MongoDB Atlas cluster URI

### 2. Environment Setup
The server configuration is located in `server/.env`.

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campusvoice
JWT_SECRET=campusvoice_verified_anonymous_jwt_secret_key_2026
AI_API_KEY=your_gemini_api_key_optional
INSTITUTION_EMAIL_DOMAINS=@campus.edu,@university.ac.in,@student.edu
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Seed Database with Realistic Demo Data
From the `server` directory:
```bash
npm run seed
```

This populates sample verified students, administrator accounts, realistic issue clusters, and anonymous message threads.

### 4. Run Backend & Frontend
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```
*Backend runs on `http://localhost:5000`*

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Details |
|---|---|---|---|
| **Student** | `student1@campus.edu` | `Student@123` | Submit reports, track status, view clusters, reply in anonymous chat |
| **Admin** | `admin@campus.edu` | `Admin@123` | Triage clusters, update status, assign department, reply to students |

*(Quick 1-click demo login buttons are also provided directly on the Login page!)*

---

## 🛡️ Database & Privacy Design

### Collections

1. **`users`**: Contains authenticated account details (`name`, `email`, `studentId`, `passwordHash`, `role`, `isVerified`).
2. **`complaints`**: Stores raw complaint details (`publicComplaintId`, `category`, `description`, `location`, `severity`, `status`, `issueClusterId`, `statusHistory`). **No student identifying keys.**
3. **`complaint_access`**: Isolated private mapping (`complaintId`, `userId`). **Never returned to Admin APIs.**
4. **`issue_clusters`**: Aggregated campus problems (`publicIssueId`, `title`, `summary`, `category`, `location`, `severity`, `affectedCount`, `assignedDepartment`, `statusHistory`).
5. **`issue_supports`**: Anonymous "+1 I am also affected" tracking preventing duplicate support from the same student.
6. **`messages`**: 2-way conversation between student and administration without user ID references.

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register student or admin
- `POST /api/auth/login` — Sign in and retrieve JWT token
- `GET /api/auth/me` — Get current authenticated profile

### Student Complaints
- `POST /api/complaints` — Submit verified anonymous complaint
- `GET /api/complaints/my` — Get logged-in student's complaints
- `GET /api/complaints/:publicComplaintId` — Get complaint details & timeline

### Public Issue Clusters & Endorsement
- `GET /api/issues` — Explore campus issue clusters with filters & search
- `GET /api/issues/:id` — Get single issue cluster details
- `POST /api/issues/:id/support` — Endorse existing issue ("+1 I am also affected")
- `GET /api/issues/supported/my` — Get list of issues endorsed by current student

### Organization / Admin APIs (Strictly Sanitized)
- `GET /api/admin/issues` — Get issue clusters with KPI metrics (0 student identity)
- `GET /api/admin/issues/:id` — Inspect cluster and associated complaints (all stamped `Verified Anonymous Student`)
- `PATCH /api/admin/issues/:id/status` — Update status with official resolution note
- `PATCH /api/admin/issues/:id/department` — Assign campus department
- `GET /api/admin/analytics` — Aggregated campus triage metrics & hotspots

### Anonymous Messaging
- `GET /api/complaints/:id/messages` — Get conversation thread
- `POST /api/complaints/:id/messages` — Send anonymous follow-up

### AI Services
- `POST /api/ai/analyze-complaint` — AI classification & tag recommendation
- `POST /api/ai/check-related-issue` — Duplicate / related cluster detection

---

## 🧪 Security & Anonymity Verification Testing

1. **Student Isolation Test**: Log in as `student2@campus.edu`. Verify that you cannot retrieve or modify complaints filed by `student1@campus.edu`.
2. **Admin Zero-Leakage Test**: Log in as `admin@campus.edu`. Inspect `GET /api/admin/issues/:id`. Verify in Network tab that the JSON response contains **no** `name`, `email`, `studentId`, or `userId`.
3. **Duplicate Prevention Test**: Navigate to `/submit`, enter "Internet is down in Computer Lab 3". Notice the real-time AI alert highlighting existing cluster `CV-ISSUE-104` with the 1-click option to support instead of spamming.
4. **Anonymous Message Verification**: Send a message from Admin to a complaint. The student receives it as `Campus Administration`. The student replies and the admin sees `Verified Anonymous Student`.

---

## 🚢 Production Deployment Guide

CampusVoice is production-ready for deployment to cloud providers (Render, Railway, Heroku, AWS, DigitalOcean):

### Option A: Deploy to Render / Railway (Single Web Service)
1. Push this repository to GitHub.
2. In Render / Railway, create a new **Web Service** pointing to your repository.
3. Configure the build settings:
   - **Build Command**: `npm run install:all && npm run build`
   - **Start Command**: `npm start`
4. In **Environment Variables**, set:
   - `NODE_ENV=production`
   - `MONGODB_URI=mongodb+srv://sindhuradevi7_db_user:CvbYI6yaEMe8B6xK@<YOUR_CLUSTER_HOST>.mongodb.net/campusvoice?retryWrites=true&w=majority`
   - `JWT_SECRET=your_production_secret_key`
   - `PORT=5000` (or leave default assigned by host)
   - `CLIENT_URL=https://your-domain.com` (your live production URL)
5. Deploy! The unified Express server will automatically serve both the React frontend and the REST APIs.

