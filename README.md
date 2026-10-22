# ChaiTube 🎬 — Full-Stack Video Sharing Platform

ChaiTube is a full-stack video-sharing web application built with React, Vite, Node.js, Express, and MongoDB. It provides a responsive interface for discovering videos, user authentication, video playback, and media uploads.

## 🚀 Live Demo

- **Live Website:** https://chai-tube-4huzqq62w-aman-aad7.vercel.app/
- **Backend API Health Check:** https://chaitube-backend.onrender.com/api/v1/healthcheck
- **GitHub Repository:** https://github.com/yadavak2024/ChaiTube

## ✨ Features

- Responsive, dark-themed user interface
- Video discovery and search interface
- Video details and playback
- User registration and login
- Video upload and publishing interface
- Frontend and backend REST API integration
- MongoDB database integration
- Cloudinary media storage integration
- Environment-based configuration
- Deployed frontend and backend

**Note:** Some planned backend modules may still require implementation. Check the corresponding controllers before assuming that comments, likes, subscriptions, playlists, and dashboard statistics are all fully supported.

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- JavaScript
- lucide-react

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- Cloudinary
- Multer
- bcrypt

### Deployment and Services
- Vercel — Frontend hosting
- Render — Backend hosting
- MongoDB Atlas — Database
- Cloudinary — Media storage

## 📂 Project Structure

```text
ChaiTube/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.js
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## 💻 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB database
- Cloudinary account for media uploads

### 1. Clone the repository

```bash
git clone https://github.com/yadavak2024/ChaiTube.git
cd ChaiTube
```

### 2. Configure and run the backend

```bash
cd backend
npm install
npm run dev
```

Create a `backend/.env` file containing your own database connection, Cloudinary credentials, authentication secrets, and other required settings.

For local development, the backend can use port `8000`. The MongoDB connection code appends the database name `videotube` to `MONGODB_URI`, so configure the base connection URI accordingly.

### 3. Configure and run the frontend

Open another terminal from the repository root:

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

The Vite development server normally runs at `http://localhost:5173`.

## ☁️ Deployment

### Backend — Render

1. Connect the GitHub repository to Render.
2. Set the Root Directory to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure the required backend environment variables in Render.
6. Configure `CORS_ORIGIN` for the trusted frontend origin.
7. Deploy and verify the health-check endpoint.

### Frontend — Vercel

1. Import the GitHub repository into Vercel.
2. Set Root Directory to `frontend`.
3. Select the Vite framework preset.
4. Install Command: `npm install`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add the environment variable:

```env
VITE_API_URL=https://chaitube-backend.onrender.com
```

8. Deploy the project and test the live website.

## 🔐 Security

- Never commit `.env` files or private credentials.
- Keep MongoDB credentials, JWT secrets, and Cloudinary API secrets private.
- Remember that `VITE_` environment variables are exposed to the frontend browser bundle.
- Restrict CORS to trusted frontend origins.
- Use HTTPS for deployed applications.

## 🧪 Testing

The project owner reports testing the deployed website, including video display, authentication, playback, upload, and page refresh.

## 👨‍💻 Author

**Aman Yadav**

GitHub: https://github.com/yadavak2024

---

If you encounter a bug or have a suggestion, open an issue in this repository.
