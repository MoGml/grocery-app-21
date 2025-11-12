import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [countryCode, setCountryCode] = useState(20); // Egypt country code
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');

  const { checkCustomerExist, verifyOTP } = useAuth();
  const navigate = useNavigate();

  // Handle phone number input and remove leading zero if present
  const handlePhoneChange = (value: string) => {
    // Remove any non-digit characters
    let cleanedPhone = value.replace(/\D/g, '');

    // Remove leading zero if present
    if (cleanedPhone.startsWith('0')) {
      cleanedPhone = cleanedPhone.substring(1);
    }

    setPhone(cleanedPhone);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (step === 'phone') {
        // Validate phone number
        if (!phone.trim() || phone.length < 10) {
          setError('Please enter a valid phone number');
          setLoading(false);
          return;
        }

        // Check if customer exists
        const response = await checkCustomerExist(phone, countryCode);

        if (response.isExist) {
          // Customer exists, show OTP input
          setUserName(response.userName);
          setStep('otp');
          setError(`OTP sent to your phone. Welcome back, ${response.userName}!`);
        } else {
          // Customer doesn't exist
          setError('Phone number not registered. Please contact support to register.');
        }
      } else {
        // Verify OTP
        if (!otp.trim()) {
          setError('Please enter the OTP');
          setLoading(false);
          return;
        }

        const success = await verifyOTP(otp, phone, countryCode);

        if (success) {
          navigate('/products');
        } else {
          setError('Invalid OTP. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>{t('common.appName')}</h1>
          <p>{step === 'phone' ? t('auth.loginSubtitle') : `Welcome ${userName}! Enter OTP`}</p>
        </div>

        {error && (
          <div className={`alert ${error.includes('Welcome back') || error.includes('OTP sent') ? 'alert-success' : 'alert-error'}`}>
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="countryCode">Country Code</label>
              <input
                type="number"
                id="countryCode"
                value={countryCode}
                onChange={(e) => setCountryCode(parseInt(e.target.value))}
                placeholder="20"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">{t('auth.phone')}</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder={t('auth.phonePlaceholder')}
                disabled={loading}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('common.loading') : t('auth.continueButton')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="otp">{t('auth.otp')}</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder={t('auth.otpPlaceholder')}
                maxLength={4}
                disabled={loading}
                autoFocus
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('common.loading') : t('auth.verifyOTP')}
            </button>

            <div className="form-footer">
              <button
                type="button"
                className="btn-text"
                onClick={handleBackToPhone}
                disabled={loading}
              >
                {t('auth.backToLogin')}
              </button>
            </div>
          </form>
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
