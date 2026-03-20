# 🎵 Melodify – Premium Spotify Clone

Melodify is a full-stack music streaming application inspired by Spotify. It features a stunning dark-themed UI, role-based access for listeners and artists, and a secure OTP-based password reset system.

**🚀 Live Demo**: [https://melodify-qpoy.onrender.com](https://melodify-qpoy.onrender.com)

## ✨ Features

- **Premium UI/UX**: Dark mode with glassy effects, smooth animations, and responsive layout.
- **Authentication**: Secure login/signup with cookie-based session management.
- **Secure OTP Reset**: Password recovery powered by `nodemailer` with 6-digit verification codes.
- **Artist Dashboard**: Artists can upload songs and create albums seamlessly.
- **Global Audio Player**: Persistent music player with play/pause, volume control, and progress tracking.
- **Cloud Storage**: Image and audio hosting integrated with **ImageKit.io**.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Axios, React Router, React Hot Toast.
- **Backend**: Node.js, Express.js (v5), MongoDB, Mongoose.
- **Security**: JWT (JSON Web Tokens), bcryptjs, Secure Cookies.
- **Mailing**: Nodemailer (with Gmail SMTP support).
- **Deployment**: Render.com (Unified Deployment).

## 🏃 Local Setup

1. **Clone the project**:
   ```bash
   git clone https://github.com/Kristal0024/Melodify.git
   cd spotify-project
   ```

2. **Install Dependencies**:
   ```bash
   npm install && cd frontend && npm install
   ```

3. **Environment Variables**:
   Create a `.env` file in the root with:
   - `MONGO_URI`, `JWT_SECRET`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_ENDPOINT_URL`
   - `SMTP_USER`, `SMTP_PASS` (for OTP emails)

4. **Run Dev Mode**:
   - Backend: `npm run dev` (Root folder)
   - Frontend: `npm run dev` (Frontend folder)

## 🚢 Deployment

The project is optimized for **Render.com**. It uses a unified build process where the Express backend serves the React frontend statically.

- **Build Command**: `npm run build`
- **Start Command**: `npm start`

---
Developed with ❤️ by [Kristal](https://github.com/Kristal0024)
