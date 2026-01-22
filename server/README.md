# DevConnect

A Tinder-like app for developers. This is a course project where I'm practicing Node.js by building the core backend for matching, auth, and profiles.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT auth + bcrypt
- Zod for validation

## Getting Started
1. Install dependencies
   ```bash
   cd server
   npm install
   ```
2. Create a `.env` file in the `server` folder:
   ```bash
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET_KEY=your_secret_key
   ```
3. Run the app
   ```bash
   npm start
   ```

For development with auto-reload:
```bash
npm run dev
```

## Scripts
- `npm start` runs `src/app.js`
- `npm run dev` runs with nodemon

## Notes
This repo is for learning and may change as the course progresses.
