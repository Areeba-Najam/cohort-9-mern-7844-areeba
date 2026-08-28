# cohort-9-mern-7844-areeba
Cohort 9 - MERN (NodeJS+ReactJS) assignment for Areeba Najam 

# Notes App

A full-stack note-taking application built as part of my MERN stack internship at 10 Pearls. Users can sign up, create rich-text notes, organize them with colors and tags, and manage their account securely ,all built with a proper engineering workflow: feature branches, PR reviews, automated code quality checks by Sonar, and test coverage.

## What it does

- Sign up, log in, log out: JWT-based auth, passwords hashed with bcrypt
- Create, edit, and delete notes: Each note supports rich text formatting (bold, italic, headings, lists)
- Organize notes : Pin important ones, tag them, pick a color, search and filter
- Dark mode : Persists across sessions
- Change password : From your profile, with current-password verification
- Export and import : Download your notes as JSON (all of them, or just the ones you select), and bring them back in later
- User profile : see your note count, manage your account

## Tech stack

Backend: Node.js, Express, MongoDB (Atlas), Mongoose, JWT, bcrypt, Pino (logging)
Frontend: React, Vite, Tailwind CSS, Tiptap (rich text editor), React Router
Testing: Mocha + Chai + Supertest (backend), Vitest + React Testing Library (frontend)
Code quality: CodeRabbit (automated PR review), SonarCloud (static analysis and coverage)
Version control: Git feature-branch workflow, every change went through a pull request

## Project structure

cohort-9-mern-7844-areeba/
├── backend/
│ ├── src/
│ │ ├── config/ # DB connection, logger
│ │ ├── controllers/ # Request handlers
│ │ ├── middleware/ # Auth, error handling
│ │ ├── models/ # Mongoose schemas
│ │ ├── routes/ # API routes
│ │ └── services/ # Business logic
│ └── test/ # Mocha/Chai test suites
├── frontend/
│ └── src/
│ ├── components/ # Reusable UI pieces
│ ├── context/ # Auth and theme state
│ ├── pages/ # Route-level screens
│ └── services/ # API client
├── .github/workflows/ # CI SonarCloud analysis
├── Sonar reports
└── README.md


## Getting started

### Prerequisites
-Node.js 18+
-A MongoDB Atlas account (or local MongoDB)

### Backend setup

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example` for the full list):

MONGODB_URI=your_atlas_connection_string
MONGODB_URI_TEST=your_atlas_test_database_string
JWT_SECRET=a_long_random_string_at_least_32_characters
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173


Run it:

```bash
npm run dev
```

### Frontend setup

```bash
cd frontend
npm install
```

Create a `.env`:

VITE_API_URL=http://localhost:5000/api


Run it:

```bash
npm run dev
```

The app will be running at `http://localhost:5173`.

## Running tests

**Backend:**
```bash
cd backend
npm test              # run tests
npm run test:coverage # run with coverage report
```

**Frontend:**
```bash
cd frontend
npm test              # run tests
npm run test:coverage # run with coverage report
```

## Code quality

Every pull request in this project went through two layers of automated review:

- CodeRabbit reviews the diff on every PR which flags bugs, security issues, and code smells before merge
- SonarCloud to runs on every push and tracks bugs, vulnerabilities, code duplication, and test coverage across the whole codebase

## API overview

| Method | Endpoint | Description |
|------|-------------|------------|
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Get the current user |
| PATCH | `/api/auth/change-password` | Change password (requires auth) |
| GET | `/api/notes` | Get all of your notes |
| POST | `/api/notes` | Create a note |
| GET | `/api/notes/:id` | Get one note |
| PATCH | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |
| POST | `/api/notes/import` | Import notes from a JSON export |

All `/api/notes` routes require a valid JWT-based and only ever return notes that belong to the logged-in user.

## How this was built

This project followed a strict PR-based workflow . Every feature landed in its own branch, went through CodeRabbit review, and was tested before merging into `develop`. Backend and frontend work were kept in separate PRs so each one stayed focused and reviewable. A rough breakdown of how it came together:

1. Backend and frontend infrastructure (logging, error handling, base React setup)
2. Database connection and JWT authentication
3. Note CRUD APIs, scoped per user
4. Frontend auth screens
5. Dashboard with rich text editor, search, and pin
6. Dark mode, note colors, redesigned auth screens
7. SonarCloud integration and test coverage
8. Password change, export/import, polish


## Author

Areeba Najam : Final-semester Computer Science student, MERN Stack Intern at 10 Pearls Shine