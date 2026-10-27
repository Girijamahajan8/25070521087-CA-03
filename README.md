# StudySphere

Student productivity app built with HTML/CSS/JavaScript, Node.js, Express, and MongoDB.

## Features
- Dashboard: total/completed/pending tasks, due today, overdue, progress percentage, welcome message, weekly completion chart.
- Tasks: create, edit, delete, complete; subjects, deadlines, priorities; search, filter by subject/priority/status, sort by deadline.
- Focus timer: 25-minute focus and 5-minute break, start/pause/reset, completed session history and total focus minutes.
- Weekly timetable: add sessions for a date/time, mark completed, delete, planned/completed counts.
- Notes and revision planner: subject-wise notes, edit/delete, mark topics revised; persisted in MongoDB.
- Signup/login and per-user data.

## Run on Windows
1. Extract this ZIP and open the `StudySphere` folder in VS Code.
2. Ensure Node.js and MongoDB are installed and MongoDB is running.
3. Run `npm install` in the project root.
4. Copy `.env.example` to `.env`; adjust `MONGODB_URI` if needed. The default port is `3001` so StudySync can continue using port `3000`.
5. Run `npm.cmd run dev`.
6. Open `http://localhost:3001` and sign up.

Keep the terminal open. Do not open HTML files using `file://`. If the database connection fails, start MongoDB and check `.env`.
