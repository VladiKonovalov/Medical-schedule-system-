import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { sendOTP, login } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const result = await sendOTP(phone);
    setLoading(false);

    if (result.success) {
      setOtpCode(result.otp);
      setStep('otp');
      setSuccess(`OTP sent! Your OTP is: ${result.otp}`);
    } else {
      setError(result.error);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(phone, otp);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Medical Scheduling System</h1>
        <h2>Login</h2>

        {step === 'phone' ? (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                pattern="[0-9]{10,15}"
              />
            </div>
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                required
                pattern="[0-9]{6}"
                maxLength="6"
              />
              {otpCode && (
                <div className="otp-display">
                  <small>Your OTP: <strong>{otpCode}</strong></small>
                </div>
              )}
            </div>
            {error && <div className="error">{error}</div>}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                  setOtpCode('');
                }}
              >
                Back
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

