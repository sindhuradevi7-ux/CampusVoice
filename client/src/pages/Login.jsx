import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, ArrowRight, UserCheck, ShieldAlert } from 'lucide-react';
import { BrandLogo } from '../components/common/BrandLogo';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      showSuccess(`Welcome back, ${result.user.name}!`);
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student-dashboard');
      }
    } else {
      showError(result.message);
    }
  };

  const handleQuickLogin = async (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    const result = await login(demoEmail, demoPass);
    setLoading(false);
    if (result.success) {
      showSuccess(`Logged in as ${result.user.name} (${result.user.role})`);
      if (result.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student-dashboard');
      }
    } else {
      showError(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-300 shadow-warm-lg">
        {/* Header with Brand Mark */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-cream-100 rounded-2xl border border-cream-300 mb-3 shadow-sm">
            <BrandLogo className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-wine-900">Sign in to your account</h2>
          <p className="text-xs text-wine-600 mt-1 font-medium">
            Sign in to submit or manage verified anonymous complaints
          </p>
        </div>

        {/* Quick Demo Logins Box */}
        <div className="p-3.5 bg-cream-100/70 rounded-2xl border border-cream-300 mb-6">
          <p className="text-[11px] font-bold text-burgundy-800 uppercase tracking-wider mb-2 text-center">
            🚀 1-Click Quick Demo Sign In
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student1@campus.edu', 'Student@123')}
              className="px-3 py-2 bg-white hover:bg-peach-50 text-burgundy-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-peach-300 shadow-sm transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-peach-600" />
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@campus.edu', 'Admin@123')}
              className="px-3 py-2 bg-white hover:bg-burgundy-50 text-burgundy-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-burgundy-200 shadow-sm transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-burgundy-700" />
              Admin Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-wine-800 mb-1.5">
              Campus Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-wine-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@campus.edu"
                required
                className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-wine-800 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-wine-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-cream-50 border border-cream-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-wine-900 placeholder-wine-400 focus:outline-none focus:border-burgundy-700 focus:ring-1 focus:ring-burgundy-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-burgundy-800 hover:bg-burgundy-900 disabled:opacity-50 text-cream-50 font-bold rounded-xl text-sm shadow-md shadow-burgundy-900/20 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4 text-peach-300" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-cream-300 text-center">
          <p className="text-xs text-wine-600">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-burgundy-800 hover:underline font-bold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
