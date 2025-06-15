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

yaml
Copy
Edit

The backend (`jarvis-backend/`) is in the same repo and handles user, DB, and API endpoints.

---

## 🛠️ Getting Started

### **Frontend**

1. **Install dependencies**
npm install

markdown
Copy
Edit
2. **Add your Firebase config**
- Copy your Firebase config into `src/firebase.js`
3. **Start the app**
npm run dev

markdown
Copy
Edit

### **Backend**

1. See `/jarvis-backend/README.md` for backend setup
2. Create your `.env` file with DB/Firebase/OpenAI/etc. keys
3. Start server:
npm install
npm run start

yaml
Copy
Edit

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