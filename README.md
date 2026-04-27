# 🎮 GameBacklog

GameBacklog is a fullstack web application that allows users to track and manage their video game library. Users can add games, update their status (e.g., Playing, Completed), write reviews, and view statistics about their gaming activity.

---

## 🚀 Tech Stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB (Mongoose)
- **Other Tools:** Nodemon, Concurrently

---

## 📁 Project Structure

```
backlog/
│
├── backend/
├── backLogFrontend/
├── package.json
```

---

## ⚙️ Setup Instructions

Follow these steps to run the project locally in under 5 minutes:

### 1. Clone the Repository

```
git clone https://github.com/bestabhinav97/GameBacklog.git
cd gamelog
```

---

### 2. Install Dependencies

In the project root run

```
npm install concurrently --save-dev
```

Install both frontend and backend dependencies:

```
npm run install:all
```

---

### 3. Environment Variables

Create a `.env` file inside the **backend** folder and add:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

⚠️ **Important:** Never commit your `.env` file to GitHub.

---

### 4. Run the Application

Start both frontend and backend together:

```
npm run dev
```

This uses `concurrently` to run both servers at the same time.

---

### 🌐 Application URLs

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## 📊 Features

- Add and manage games
- Track game status (Backlog, Playing, Completed, Dropped)
- Write reviews and ratings
- View aggregated statistics (total games, hours played, etc.)
- Filter and search games

---

## 🧠 Notes

- Ensure MongoDB connection is valid before running the backend
- Backend must be running before frontend can fetch data
- If `concurrently` is not recognized, run:

```
npm install
```

---

## 📌 Author

Developed as part of a Fullstack Lab project.
