# 🛡️ Full-Stack Task Management App

This is a full-stack web application built with **React (Frontend)** and **Node.js + Express (Backend)**. It includes features like user authentication, task management, and secure request handling.

---

## 📁 Project Structure

```
root/
├── frontend/        # React frontend
├── backend/         # Node.js + Express backend
└── README.md        # Project instructions
```

---

## 🚀 Features

- User Signup & Login with JWT
- Task CRUD functionality
- Email notification on user registration (via NodeMailer)
- Secure HTTP headers using Helmet
- RESTful API structure
- CORS support for frontend-backend communication

---

## 🧑‍💻 Getting Started


### ▶️ Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend server:
   ```bash
   npm run dev
   ```

> The React app will typically run at [http://localhost:5173](http://localhost:5173)

---

### ⚙️ Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add your environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password_or_app_password
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

> The backend API will typically run at [http://localhost:5000](http://localhost:5000)

---

## 📧 Email Notification (NodeMailer)

- The backend uses **NodeMailer** to send an email notification whenever a new user registers.
- You must provide valid SMTP credentials (`EMAIL_USER` and `EMAIL_PASS`) in your `.env` file.

---

## 🔐 Security

- **Helmet** middleware is used to secure HTTP headers.
- **CORS** is enabled with restricted origin settings.
- Inputs are sanitized to prevent XSS and NoSQL injection attacks (optional via `xss-clean` or `express-mongo-sanitize`).

---

## 📄 API Routes

| Method | Endpoint           | Description           |
|--------|--------------------|-----------------------|
| POST   | `/api/register`    | Register new user     |
| POST   | `/api/login`       | Authenticate user     |
| GET    | `/api/tasks`       | Fetch tasks           |
| POST   | `/api/tasks`       | Add a task            |
| PUT    | `/api/tasks/:id`   | Update a task         |
| DELETE | `/api/tasks/:id`   | Delete a task         |

---

## 🤝 Contribution

Feel free to fork this repository and submit pull requests. Feedback and suggestions are always welcome!

---

## 📜 License

This project is licensed under the MIT License.
