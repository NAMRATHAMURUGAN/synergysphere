# synergysphere
Team Collaboration Platform

# SynergySphere

**SynergySphere** is an advanced **team collaboration platform** for managing projects, tasks, discussions, and notifications in real-time. Built as a full-stack web application, it offers a modern and responsive UI, Kanban task management, and live project communication.

---

## 🚀 Features (MVP)

### Authentication
- Register/Login with email and password
- JWT-based authentication
- Forgot password functionality

### User Profiles
- Name, email, avatar
- Profile edit (basic settings)
- Logout

### Projects
- Create projects with title and description
- Dashboard showing all projects user is part of
- Add team members by email/username

### Tasks
- Create tasks under a project (title, description, due date, assignee)
- Track status → To-Do, In Progress, Done
- Edit/Delete tasks
- Kanban board & task list view

### Communication
- Threaded discussion system inside each project
- Real-time chat with Socket.io

### Notifications
- New task assigned
- Task status changed
- Project updates

### Visualization
- Progress bar per project (% tasks completed)
- Workload summary per member

### Responsive UI
- Clean, modern UI using React + TailwindCSS
- Mobile-friendly views
- Smooth navigation with React Router

---

## 🏗️ Tech Stack

- **Frontend:** React.js, TailwindCSS, Axios, React Router  
- **Backend:** Node.js, Express.js, Socket.io  
- **Database:** MongoDB (Mongoose)  
- **Authentication:** JWT, bcrypt.js  
- **Deployment:** Frontend → Vercel, Backend → Render/Heroku, Database → MongoDB Atlas  

---

## 💾 Data Models

- **User:** id, name, email, password (hashed), avatar, createdAt  
- **Project:** id, title, description, createdBy, members [userId]  
- **Task:** id, projectId, title, description, status, assigneeId, dueDate, createdAt  
- **Message:** id, projectId, senderId, content, timestamp  
- **Notification:** id, userId, message, type, read/unread, createdAt  

---

## ⚡ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/NAMRATHAMURUGAN/synergysphere.git
cd synergysphere
