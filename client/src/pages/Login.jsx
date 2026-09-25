import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, ArrowRight, UserCheck, ShieldAlert, LogIn } from 'lucide-react';

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
      <div className="bg-white dark:bg-wine-900 p-6 sm:p-8 rounded-3xl border border-cream-300 dark:border-peach-400/20 shadow-warm-lg transition-colors">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-cream-100 dark:bg-wine-800 rounded-2xl border border-cream-300 dark:border-peach-400/20 mb-3 shadow-sm text-burgundy-800 dark:text-peach-300">
            <LogIn className="w-8 h-8 text-burgundy-700 dark:text-peach-400" />
          </div>
          <h2 className="text-2xl font-bold text-wine-900 dark:text-cream-50">Sign in to your account</h2>
          <p className="text-xs text-wine-600 dark:text-cream-300 mt-1 font-medium">
            Sign in to submit or manage verified anonymous complaints
          </p>
        </div>

        {/* Quick Demo Logins Box */}
        <div className="p-3.5 bg-cream-100/70 dark:bg-wine-950/70 rounded-2xl border border-cream-300 dark:border-peach-400/20 mb-6">
          <p className="text-[11px] font-bold text-burgundy-800 dark:text-peach-300 uppercase tracking-wider mb-2 text-center">
            🚀 1-Click Quick Demo Sign In
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('student1@campus.edu', 'Student@123')}
              className="px-3 py-2 btn-glass btn-glass-secondary text-xs flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5 text-peach-700 dark:text-peach-400" />
              Student Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@campus.edu', 'Admin@123')}
              className="px-3 py-2 btn-glass btn-glass-subtle text-xs flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-burgundy-700 dark:text-peach-400" />
              Admin Demo
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-wine-800 dark:text-cream-200 mb-1.5">
              Campus Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-wine-400 dark:text-wine-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. yourname@campus.edu"
                required
                className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-wine-900 dark:text-cream-100 placeholder-wine-400 dark:placeholder-wine-500 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 focus:ring-1 focus:ring-burgundy-700"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-wine-800 dark:text-cream-200 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-wine-400 dark:text-wine-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-cream-50 dark:bg-wine-950 border border-cream-300 dark:border-peach-400/20 rounded-xl pl-10 pr-4 py-2.5 text-sm text-wine-900 dark:text-cream-100 placeholder-wine-400 dark:placeholder-wine-500 focus:outline-none focus:border-burgundy-700 dark:focus:border-peach-400 focus:ring-1 focus:ring-burgundy-700"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 btn-glass btn-glass-primary text-sm flex items-center justify-center gap-2 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
            <ArrowRight className="w-4 h-4 text-peach-300" />
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-cream-300 dark:border-peach-400/20 text-center">
          <p className="text-xs text-wine-600 dark:text-cream-300">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-burgundy-800 dark:text-peach-300 hover:underline font-bold">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
