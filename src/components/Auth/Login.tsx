import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const [step, setStep] = useState<'login' | 'otp'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, verifyOTP, loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (step === 'login') {
      // Validate inputs
      if (!name.trim()) {
        setError('Please enter your name');
        setLoading(false);
        return;
      }

      if (!phone.trim() || phone.length < 10) {
        setError('Please enter a valid phone number');
        setLoading(false);
        return;
      }

      // Send OTP
      login(phone, name);

      // Simulate sending OTP
      setTimeout(() => {
        setLoading(false);
        setStep('otp');
        setError('OTP sent to your phone (Demo: use 1234)');
      }, 1000);
    } else {
      // Verify OTP
      if (!otp.trim()) {
        setError('Please enter the OTP');
        setLoading(false);
        return;
      }

      setTimeout(() => {
        const success = verifyOTP(otp);
        setLoading(false);

        if (success) {
          navigate('/products');
        } else {
          setError('Invalid OTP. Please try again (Demo: use 1234)');
        }
      }, 500);
    }
  };

  const handleGuestMode = () => {
    loginAsGuest();
    navigate('/products');
  };

  const handleResendOTP = () => {
    setError('OTP resent to your phone (Demo: use 1234)');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Welcome to 21</h1>
          <p>{step === 'login' ? 'Sign in to continue' : 'Enter verification code'}</p>
        </div>

        {error && (
          <div className={`alert ${error.includes('sent') ? 'alert-success' : 'alert-error'}`}>
            {error}
          </div>
        )}

        {step === 'login' ? (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="otp">Verification Code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 4-digit OTP"
                maxLength={4}
                disabled={loading}
                autoFocus
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>

            <div className="form-footer">
              <button
                type="button"
                className="btn-text"
                onClick={handleResendOTP}
                disabled={loading}
              >
                Resend OTP
              </button>
              <button
                type="button"
                className="btn-text"
                onClick={() => setStep('login')}
                disabled={loading}
              >
                Change Phone
              </button>
            </div>
          </form>
        )}

        {step === 'login' && (
          <div className="divider">
            <span>OR</span>
          </div>
        )}

        {step === 'login' && (
          <button className="btn-guest" onClick={handleGuestMode}>
            Continue as Guest
          </button>
        )}

        <div className="login-info">
          <p>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
