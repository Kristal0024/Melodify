import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'
import { PlayerProvider } from './context/PlayerContext'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import AlbumsPage from './pages/AlbumsPage'
import AlbumDetail from './pages/AlbumDetail'
import SongsPage from './pages/SongsPage'
import ArtistDashboard from './pages/ArtistDashboard'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />
  return children
}

function ArtistRoute({ children }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />
  if (user.role !== 'artist') return <Navigate to="/" replace />
  return children
}

function AppLayout() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/songs" element={<ProtectedRoute><SongsPage /></ProtectedRoute>} />
          <Route path="/albums" element={<ProtectedRoute><AlbumsPage /></ProtectedRoute>} />
          <Route path="/albums/:albumId" element={<ProtectedRoute><AlbumDetail /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ArtistRoute><ArtistDashboard /></ArtistRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <PlayerBar />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#282828',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.08)',
                fontFamily: 'Inter, sans-serif',
                fontSize: 14,
              },
              success: { iconTheme: { primary: '#1db954', secondary: '#000' } },
            }}
          />
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </PlayerProvider>
    </AuthProvider>
  )
}
