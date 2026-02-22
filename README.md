# Club Membership Manager

Full-stack MERN app: React + Tailwind (frontend), Node + Express (backend), MongoDB.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup & run

### 1. Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`: set `MONGO_URI` (e.g. `mongodb://localhost:27017` or your Atlas URL) and `JWT_SECRET`.

```bash
npm install
npm run seed
npm run dev
```

Server runs at **http://localhost:5000**.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**. API requests are proxied to the backend.

### 3. Login

After seeding, use:

| Role    | Email              | Password   |
|---------|--------------------|------------|
| Admin   | admin@college.edu   | admin123   |
| Faculty | faculty@college.edu | faculty123 |
| Student | student@college.edu | student123 |

- **Student**: Dashboard, Available Clubs, My Clubs, Events, request to join (Google Form URL), notifications.
- **Faculty**: My Clubs, Join Requests (approve/reject), Create Event (sent to admin for approval), Events, notifications.
- **Admin**: Stats dashboard, User management (filter by role, activate/deactivate), Event approval (approve/reject), notifications. Admin cannot create events or join clubs.

## Project structure

```
club_project/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/         (User, Club, ClubRequest, Event, Notification)
│   │   ├── middleware/     (auth, error)
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── utils/          (jwt, seed)
│   │   ├── app.js
│   │   └── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/api.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/      (ProtectedRoute, DashboardLayout)
│   │   ├── pages/          (Login, student/, faculty/, admin/)
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── README.md
```

## Optional: Google Form for join requests

Replace the placeholder in **Club Detail** (“Request to Join”) with your Google Form URL. The form should collect: Student Name, Email, Phone, Year of Study, Register Number, Reason to Join. After submission, paste the response URL (or the form link) and click “Request to Join”.
