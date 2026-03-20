import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'

const SpotifyIcon = () => (
  <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
  </svg>
)

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState(1) // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRequestOtp = async (e) => {
    e.preventDefault()
    if (!email) return toast.error('Please enter your email')
    setLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      toast.success('OTP sent! (Check console for dev OTP)')
      console.log('DEV OTP:', res.data.otp)
      // In dev mode, we show the OTP to make it easy for the user
      alert(`DEVELOPMENT MODE: Your OTP is: ${res.data.otp}`)
      setStep(2)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    if (!otp) return toast.error('Please enter the OTP')
    setLoading(true)
    try {
      const res = await api.post('/auth/verify-otp', { email, otp })
      toast.success('OTP Verified!')
      navigate(`/reset-password?token=${res.data.resetToken}`)
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid or expired OTP')
    } finally { setLoading(false) }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <SpotifyIcon />
          <span>Melodify</span>
        </div>
        
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 12 }}>
          {step === 1 ? 'Reset Password' : 'Verify OTP'}
        </h2>
        <p className="page-subtitle" style={{ textAlign: 'center', marginBottom: 24 }}>
          {step === 1 
            ? 'Enter your email to receive a 6-digit verification code.' 
            : `We sent a code to ${email}. Please enter it below.`}
        </p>

        {step === 1 ? (
          <form onSubmit={handleRequestOtp}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                className="form-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Sending Code…' : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <div className="form-group">
              <label className="form-label">6-Digit Code</label>
              <input
                className="form-input"
                type="text"
                maxLength="6"
                placeholder="000000"
                style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px' }}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Verifying…' : 'Verify & Proceed'}
            </button>
            <button 
              type="button"
              className="btn-icon" 
              style={{ width: '100%', marginTop: 12, fontSize: 13 }}
              onClick={() => setStep(1)}
              disabled={loading}
            >
              Change Email
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button 
            type="button"
            className="btn-icon" 
            style={{ fontSize: 13 }}
            onClick={() => navigate('/auth')}
            disabled={loading}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  )
}
