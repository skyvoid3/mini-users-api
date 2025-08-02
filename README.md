# Mini Node API + React Frontend

This is a minimal full-stack web application consisting of a RESTful API for managing users built with Node.js and SQLite, **plus** a React frontend for user interaction.  
It’s a small project to demonstrate backend fundamentals like routing, database integration, and request handling, as well as frontend UI and client-server communication.

---

## 🚀 Features

- ✅ Uses **SQLite** for lightweight, file-based storage  
- ✅ Synchronous queries via `better-sqlite3` for simplicity  
- ✅ **Express.js** server with clean route structure  
- ✅ **Morgan** logger for request/response headers and DB queries  
- ✅ JWT based authentication with access and refresh tokens for secure session monitoring  
- ✅ React frontend for a user-friendly web interface

---

## 🎯 Why this project?

This mini-project was built to:

- Practice building REST APIs from scratch  
- Explore the request/response cycle, middleware, and routing  
- Understand authentication and basic security concepts  
- Gain hands-on experience with logging and SQLite  
- Build a full web application with React frontend and Node backend

---

## 🛠 What's next?

- [ ] Add user roles and permissions  
- [ ] Add unit tests and test DB support  
- [ ] Improve React frontend UI and UX  
- [ ] Migrate database layer from SQLite to PostgreSQL for better concurrency and scalability

---

## 🧪 Tech Stack

### Backend
- Node.js  
- Express  
- SQLite (`better-sqlite3`)  
- Morgan (HTTP request logging)  
- Bcrypt (password hashing)  
- JWT (authentication)  
- Swagger UI (API documentation)  
- Redoc (API documentation)

### Frontend
- React  
- Tailwind CSS (utility-first styling framework)  

### Database
- SQLite (lightweight file-based database)

---

## 📊 Benchmark & Load Testing

To evaluate the performance and robustness of the API, load testing was conducted using [Artillery](https://artillery.io/) with realistic simulated user scenarios including signup and login flows.

### Test Setup
- Target API running locally on `http://localhost:7070`  
- Load phase: 30 seconds, arrival rate of 5 requests per second  
- Scenarios tested:
  - POST `/auth/signup` with unique usernames and emails (generated CSV input)  
  - POST `/auth/login` with corresponding credentials  
  - Authenticated GET requests to protected endpoints

### Key Metrics Summary
- Average response time: **~2.4 ms** for protected routes under moderate load  
- Success rate: **>95%** for valid requests  
- No request failures or crashes during tests  
- Some requests received **400 Bad Request** responses primarily due to race conditions between signup and login flows  
- Occasional **429 Too Many Requests** errors indicated rate limiting is working as intended

### Observed Limitations
- The backend currently uses **synchronous SQLite3 queries via `better-sqlite3`**, which block the Node.js event loop during DB operations.  
- This blocking behavior limits concurrent request processing, causing latency spikes and occasional errors under high load.  
- Some irregular negative response time values seen in logs indicate timing artifacts due to sync DB calls.

### Future Improvements
- Plan to migrate the database layer to **PostgreSQL** with asynchronous queries for better scalability and concurrency.  
- Using PostgreSQL will allow handling a higher volume of simultaneous users and improve API responsiveness.  
- Meanwhile, SQLite remains an experimental choice for rapid prototyping and development simplicity.

---

### How to run load tests yourself

1. **Install Artillery globally:**  
   ```bash
   npm install -g artillery```

2. **Go to /backend/test/**
   ```bash
   artillery run load-test.yml```
3. **You can optionally tweak the load-test.yml to test whatever you want**
   
