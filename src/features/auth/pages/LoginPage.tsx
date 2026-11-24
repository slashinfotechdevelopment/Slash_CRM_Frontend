import { getErrorMessage } from '@/api/client/errorMapper';
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isValidEmail, isValidOtp } from '@/utils/validators';
import { Mail, KeyRound, ShieldAlert, ArrowRight, RotateCw, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { requestOtp, login, isAuthenticated } = useAuth();
  const toast = useToast();

  const [step, setStep] = useState<'EMAIL' | 'OTP'>('EMAIL');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Resend OTP countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage('Please enter your work email address.');
      return;
    }
    if (!isValidEmail(cleanEmail)) {
      setErrorMessage('Please enter a valid work email address (e.g. name@slash.internal).');
      return;
    }

    setIsLoading(true);
    try {
      const res = await requestOtp(cleanEmail);
      toast.success(res.message || 'One-time passcode sent to your email.');
      if (res.otp) {
        setDevOtp(res.otp);
      }
      setStep('OTP');
      setCountdown(res.expiresInSeconds || 60);
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Failed to send OTP. Please verify your email.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setErrorMessage('Please enter the 6-digit passcode.');
      return;
    }
    if (!isValidOtp(cleanOtp)) {
      setErrorMessage('Passcode must be exactly 6 numerical digits.');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim().toLowerCase(), cleanOtp);
      toast.success('Signed in successfully! Redirecting...');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(getErrorMessage(err, 'Invalid or expired passcode. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-brand-canvas">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
        {/* Top Header with Brand */}
        <div className="bg-brand-primary px-8 pt-8 pb-7 text-white text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 p-2 backdrop-blur-sm border border-white/20 mb-3 flex items-center justify-center">
            <img src="/logo.png" alt="Slash CRM" className="w-10 h-10 object-contain drop-shadow" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Slash Infotech CRM</h1>
          <p className="text-xs text-indigo-200 mt-1">Enterprise Operations & Relationship Hub</p>
        </div>

        {/* Content Card Body */}
        <div className="p-8">
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          {step === 'EMAIL' ? (
            <form onSubmit={handleRequestOtp} className="space-y-5">
              <div>
                <p className="text-sm font-semibold text-slate-800 mb-1">Sign in with Email</p>
                <p className="text-xs text-slate-500 mb-4">
                  Enter your registered work email to receive a secure one-time passcode.
                </p>
                <Input
                  type="email"
                  label="Work Email"
                  placeholder="admin@slash.internal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Send Secure Code
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-slate-800">Enter Security Code</p>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('EMAIL');
                      setDevOtp(null);
                    }}
                    className="text-xs text-brand-primary hover:underline font-medium"
                  >
                    Change Email
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  We sent a 6-digit code to <strong className="text-slate-800">{email}</strong>
                </p>

                {devOtp && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-emerald-800 font-medium">
                        Dev Passcode: <span className="font-mono font-bold">{devOtp}</span>
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtp(devOtp)}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-2 py-1 rounded"
                    >
                      Auto-fill
                    </button>
                  </div>
                )}

                <Input
                  type="text"
                  label="6-Digit Passcode"
                  placeholder="123456"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                  leftIcon={<KeyRound className="w-4 h-4" />}
                  className="font-mono text-center tracking-widest text-lg"
                  required
                  autoFocus
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
              >
                Verify & Sign In
              </Button>

              <div className="pt-2 text-center">
                {countdown > 0 ? (
                  <span className="text-xs text-slate-400">
                    Resend code in <strong className="text-slate-600">{countdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleRequestOtp()}
                    className="text-xs text-brand-primary hover:underline font-semibold inline-flex items-center gap-1.5"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    Resend Passcode
                  </button>
                )}
              </div>
            </form>
          )}

          {/* Bottom helper */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>First time setup?</span>
            <Link to="/setup" className="text-brand-primary hover:underline font-semibold">
              Bootstrap Super Admin →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
