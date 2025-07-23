# Mini Node API

This is a minimal RESTful API for managing users, built with Node.js and SQLite.  
It’s a small project to demonstrate backend fundamentals like routing, database integration, and request handling.

---

## 🚀 Features

- ✅ Uses **SQLite** for lightweight, file-based storage  
- ✅ Synchronous queries via `better-sqlite3` for simplicity  
- ✅ **Express.js** server with clean route structure  
- ✅ **Morgan** logger for request/response headers and DB queries  
- ✅ JWT based authentication with access and refresh tokens for secure session monitoring

---

## 🎯 Why this project?

This mini-project was built to:

- Practice building REST APIs from scratch  
- Explore the request/response cycle, middleware, and routing  
- Understand authentication and basic security concepts  
- Gain hands-on experience with logging and SQLite

---

## 🛠 What's next?

- [ ] Add user roles and permissions  
- [ ] Expand API endpoints (e.g., update, search)  
- [ ] Add unit tests and test DB support

---

## 🧪 Tech Stack

- Node.js  
- Express  
- SQLite (`better-sqlite3`)  
- Morgan (for request logging)
- Bcrypt (for password hashing)
- JWT 

---

## 📦 Getting Started

To get the server running (assuming you have `npm` and `tsx`):

```bash
git clone https://github.com/skyvoid3/mini-users-api.git
cd mini-users-api
npm install
npm start
