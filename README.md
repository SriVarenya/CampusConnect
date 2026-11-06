# CampusConnect – College Management Portal

A React + Vite project for Project Review 2. It includes Admin and Student modules, Local Storage authentication, announcements, assignments, and student management.

## Requirements
- Node.js 18 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL shown by Vite (usually http://localhost:5173).

## Demo login accounts
**Admin**
- Email: `admin@campus.com`
- Password: `admin123`

**Student**
- Email: `aarav@campus.com`
- Password: `student123`

You can also create a new student account using Sign up.

## Features
- React components built with Vite
- Role-based Admin and Student dashboards
- Login and signup with Local Storage
- Admin student directory with search and delete
- Admin can publish/delete announcements
- Admin can create/delete assignments
- Students can view announcements and assignments
- Session persistence and logout
- Responsive layout

## Deploy to Vercel
1. Push this project to a GitHub repository.
2. In Vercel, choose **Add New → Project** and import the repository.
3. Framework preset: **Vite** (usually detected automatically).
4. Build command: `npm run build`
5. Output directory: `dist`
6. Click **Deploy**.

No environment variables are required.

## Important note
This is a learning/demo project. Passwords are stored in Local Storage for the assignment requirement. Do not use this authentication approach for a real production application.
