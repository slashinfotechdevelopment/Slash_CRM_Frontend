import React, { useState } from 'react';
import { leadsConnector } from '@/connectors/leads.connector';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { isValidEmail, isValidPhone } from '@/utils/validators';
import { CheckCircle2, User, Mail, Phone, Building, Send, ShieldAlert } from 'lucide-react';

export const PublicInquiryPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'Custom Software Development',
    location: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const courseOptions = [
    { value: 'Custom Software Development', label: 'Custom Software Development' },
    { value: 'Enterprise CRM Implementation', label: 'Enterprise CRM Implementation' },
    { value: 'Full Stack Web & Cloud', label: 'Full Stack Web & Cloud' },
    { value: 'Mobile App Engineering', label: 'Mobile App Engineering' },
    { value: 'Data Engineering & Analytics', label: 'Data Engineering & Analytics' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!formData.phone.trim() || !isValidPhone(formData.phone)) {
      setErrorMessage('Please provide a valid contact phone number.');
      return;
    }
    if (formData.email.trim() && !isValidEmail(formData.email)) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setIsLoading(true);
    try {
      // POST /api/leads/public/inquire
      await leadsConnector.submitPublicInquiry({
        name: formData.name.trim(),
        email: formData.email.trim() || undefined,
        phone: formData.phone.trim(),
        course: formData.course,
        location: formData.location.trim() || undefined,
        message: formData.message.trim() || undefined,
      });

      setIsSuccess(true);
    } catch (err) {
      setErrorMessage(
        err.message || 'Unable to submit your inquiry at this moment. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-brand-canvas py-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-brand-primary px-8 pt-8 pb-7 text-white text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-white/10 p-2 backdrop-blur-sm border border-white/20 mb-3 flex items-center justify-center">
            <img src="/logo.png" alt="Slash Logo" className="w-10 h-10 object-contain drop-shadow" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Slash Infotech</h1>
          <p className="text-xs sm:text-sm text-indigo-200 mt-1">
            Let us build your next technology solution. Tell us about your project.
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {isSuccess ? (
            <div className="py-8 text-center flex flex-col items-center space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Inquiry Received!</h2>
              <p className="text-sm text-slate-600 max-w-md">
                Thank you for contacting Slash Infotech. Our client solutions team will review your
                requirements and get in touch within 24 hours.
              </p>
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setIsSuccess(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    course: 'Custom Software Development',
                    location: '',
                    message: '',
                  });
                }}
              >
                Submit Another Request
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                  <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
                  <span className="leading-relaxed">{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Full Name"
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  leftIcon={<User className="w-4 h-4" />}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  leftIcon={<Phone className="w-4 h-4" />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="email"
                  label="Email Address (Optional)"
                  placeholder="john@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  leftIcon={<Mail className="w-4 h-4" />}
                />
                <Input
                  label="City / Location (Optional)"
                  placeholder="e.g. Bangalore, India"
                  value={formData.location}
                  onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                  leftIcon={<Building className="w-4 h-4" />}
                />
              </div>

              <Select
                label="Required Domain / Service"
                options={courseOptions}
                value={formData.course}
                onChange={(e) => setFormData((p) => ({ ...p, course: e.target.value }))}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 select-none">
                  Project Description / Message
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
                  placeholder="Briefly describe what you'd like to build, timeline, or requirements..."
                  className="w-full text-sm p-3.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
                />
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full mt-2"
                isLoading={isLoading}
                rightIcon={<Send className="w-4 h-4" />}
              >
                Send Inquiry to Slash Team
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
