# 🎯 AI Resume Analyzer (Frontend)

A modern React-based frontend for analyzing resumes using AI. Users can upload a PDF or paste resume text and get instant insights like strengths, gaps, and a match score.

---

## 🚀 Features

* 📄 Upload resume (PDF) with drag & drop
* ✍️ Paste resume text for analysis
* 🤖 AI-powered feedback (strengths, gaps, score)
* 🔐 Firebase Google Authentication
* 🗂️ View & delete analysis history
* ⚡ Lazy loading for better performance
* 🔒 Protected routes
* 🌐 API handling with Axios interceptors
* 🔔 Toast notifications for user feedback

---

## 🛠️ Tech Stack

* React (Vite)
* TypeScript
* Tailwind CSS
* React Router DOM (latest)
* Axios
* Firebase Authentication (Google Login)
* Lucide Icons
* React Toastify

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the frontend:

```id="env123"
VITE_API_URL=your_backend_url

VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

---

## 📦 Installation

```id="inst123"
npm install
```

---

## ▶️ Run the App

```id="run123"
npm run dev
```


---

## 📌 Notes

* Make sure backend API is running and `VITE_API_URL` is set correctly
* Firebase config must be valid for authentication to work

---

## 👨‍💻 Author

Venugopal
