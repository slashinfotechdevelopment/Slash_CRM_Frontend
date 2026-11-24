import { getErrorMessage } from '@/api/client/errorMapper';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { isValidEmail } from '@/utils/validators';
import { Building2, User, Mail, ShieldAlert, Sparkles } from 'lucide-react';

export const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const { bootstrap } = useAuth();
  const toast = useToast();

  const [formData, setFormData] = useState({
    organizationName: 'Slash Infotech',
    name: 'Super Admin',
    email: 'admin@slash.internal',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.organizationName.trim()) {
      setErrorMessage('Organization name is required.');
      return;
    }
    if (!formData.name.trim()) {
      setErrorMessage('Super Admin full name is required.');
      return;
    }
    if (!isValidEmail(formData.email.trim())) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    setIsLoading(true);
    try {
      await bootstrap({
        organizationName: formData.organizationName.trim(),
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
      });
      toast.success('Slash CRM initialized successfully! Welcome.');
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setErrorMessage(
        getErrorMessage(err, 'System has already been bootstrapped or cannot be initialized at this time.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-brand-canvas">
      <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
        <div className="bg-brand-primary px-8 pt-8 pb-7 text-white text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 p-2 backdrop-blur-sm border border-white/20 mb-3 flex items-center justify-center">
            <img src="/logo.png" alt="Slash CRM" className="w-10 h-10 object-contain drop-shadow" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">CRM Initial Setup</h1>
          <p className="text-xs text-indigo-200 mt-1">Bootstrap Organization & Super Administrator</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          {errorMessage && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
              <span className="leading-relaxed">{errorMessage}</span>
            </div>
          )}

          <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl flex items-start gap-2.5 text-xs text-brand-primary">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-emerald-600 mt-0.5" />
            <span>
              This setup creates the root tenant organization and provisions the root Super Admin
              account with complete system authority.
            </span>
          </div>

          <Input
            label="Organization Name"
            placeholder="e.g. Slash Infotech Inc."
            value={formData.organizationName}
            onChange={(e) => setFormData((p) => ({ ...p, organizationName: e.target.value }))}
            leftIcon={<Building2 className="w-4 h-4" />}
            required
          />

          <Input
            label="Super Admin Full Name"
            placeholder="e.g. Rajesh Sharma"
            value={formData.name}
            onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
            leftIcon={<User className="w-4 h-4" />}
            required
          />

          <Input
            type="email"
            label="Super Admin Email"
            placeholder="admin@slash.internal"
            value={formData.email}
            onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Initialize Slash CRM
          </Button>

          <div className="pt-2 text-center text-xs text-slate-500">
            Already configured?{' '}
            <Link to="/login" className="text-brand-primary hover:underline font-semibold">
              Return to Login →
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
