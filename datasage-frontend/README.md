# DataSage

**DataSage** is a modern SaaS analytics platform powered by next-generation AI. This repository contains the frontend React app (Vite) and backend (Node.js/Express with Sequelize & Postgres), along with Firebase for authentication and analytics.

---

## 🚀 Features

- Modern, responsive UI inspired by top SaaS sites
- Custom branding & animated logo (DS + DataSage)
- Auth with email, Google, Facebook (via Firebase)
- Choose LLM provider (ChatGPT, Gemini) based on login/subscription
- Dashboard, Home, About, Contact, and more
- Analytics events via Firebase
- Clean modular codebase (easy to scale)

---

## 📁 Folder Structure

datasage-frontend/
├── public/assets/ # SVGs, icons, logos
├── src/
│ ├── components/ # Reusable UI blocks
│ ├── content/ # Static editable content (JSON)
│ ├── pages/ # App pages (Home, Dashboard, etc.)
│ ├── App.jsx, App.css # App root
│ ├── firebase.js # Firebase config
│ └── ... # Main, index, etc.
├── package.json
├── README.md
└── requirements.txt # Python requirements for backend/admin if any
The backend (`jarvis-backend/`) is in the same repo and handles user, DB, and API endpoints.

---

## 🛠️ Getting Started

### **Frontend**

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Configure Firebase**
   Create a `.env` file in `datasage-frontend/` (or use environment variables) with the following keys:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
   ```
3. **Start the app**
   ```bash
   npm run dev
   ```

### **Backend**

1. See `/jarvis-backend/README.md` for backend setup
2. Create your `.env` file with DB/Firebase/OpenAI/etc. keys
3. Start server:

```bash
npm install
npm run start
```

---

## 🧑‍💻 How to Contribute

- Fork and PR as needed
- File issues for bugs, improvements, feature requests

---

## ⚙️ Deployment

- Deploy frontend on Vercel/Netlify/Render, backend on AWS/GCP/Heroku, and DB on AWS RDS.
- Don’t forget to add your production Firebase/Google/Facebook credentials.

---

## 📄 License

MIT

---

## 👨‍🎨 Credits

- Design: [Your Name or Brand]
- Built with React, Vite, Node.js, Firebase, AWS, and OpenAI.

---

## 👀 Screenshots
