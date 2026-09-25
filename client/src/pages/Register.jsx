import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Lock, Mail, User, BadgeAlert, ArrowRight } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

export const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      showError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      showError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    const result = await register(formData);
    setLoading(false);

    if (result.success) {
      showSuccess('Account registered & verified successfully!');
      navigate('/student-dashboard');
    } else {
      showError(result.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-12 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-warm-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-cream-100 rounded-2xl border border-cream-300 mb-3 shadow-sm">
            <BrandLogo className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-wine-900">Create Verified Account</h2>
          <p className="text-xs text-wine-600 mt-1 font-medium">
            Student accounts are authenticated to prevent abuse, while protecting your identity.
          </p>
        </div>

        {/* Privacy Note */}
        <div className="p-3.5 bg-peach-50 border border-peach-300 rounded-2xl mb-5 text-xs text-burgundy-950 flex items-start gap-2.5 shadow-sm">
          <Lock className="w-4 h-4 text-peach-700 shrink-0 mt-0.5" />
          <span>
            <strong className="font-bold text-burgundy-900">Privacy Guarantee:</strong> Your Name, Email & Student ID will be isolated from organization views. Admin will only see "Verified Anonymous Student".
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-wine-800 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-wine-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                  required
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-wine-800 mb-1.5">
                Student ID / Roll No
              </label>
              <div className="relative">
                <BadgeAlert className="w-4 h-4 text-wine-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. STU-202401"
                  required
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-wine-800 mb-1.5">
              Campus Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-wine-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. yourname@campus.edu"
                required
                className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
              />
            </div>
            <p className="text-[11px] text-wine-500 mt-1">
              Supports @campus.edu, @university.ac.in, @student.edu or standard academic domains.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-wine-800 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-wine-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  required
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-wine-800 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-wine-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-burgundy-800 hover:bg-burgundy-900 disabled:opacity-50 text-cream-50 font-bold rounded-xl text-sm shadow-md shadow-burgundy-900/20 transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? 'Creating Verified Account...' : 'Register & Verify Account'}
            <ArrowRight className="w-4 h-4 text-peach-300" />
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-cream-300 text-center">
          <p className="text-xs text-wine-600">
            Already have an account?{' '}
            <Link to="/login" className="text-burgundy-800 hover:underline font-bold">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
