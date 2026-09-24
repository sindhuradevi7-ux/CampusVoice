import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  PlusCircle, 
  FileText, 
  Compass, 
  LayoutDashboard, 
  BarChart3, 
  LogOut, 
  User, 
  Lock,
  Sparkles
} from 'lucide-react';
import { PrivacyExplainerModal } from './PrivacyExplainerModal';

export const Navbar = () => {
  const { user, isAuthenticated, isStudent, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <Link to="/" className="flex items-center gap-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-glow group-hover:scale-105 transition-transform duration-300">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                    Campus<span className="text-indigo-400">Voice</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold tracking-wider -mt-1 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> VERIFIED ANONYMOUS
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1.5">
              <Link
                to="/issues"
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/issues')
                    ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Compass className="w-4 h-4" />
                Issue Explorer
              </Link>

              {isStudent && (
                <>
                  <Link
                    to="/submit"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/submit')
                        ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <PlusCircle className="w-4 h-4 text-emerald-400" />
                    Submit Report
                  </Link>

                  <Link
                    to="/my-complaints"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/my-complaints')
                        ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    My Reports
                  </Link>
                </>
              )}

              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/admin')
                        ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" />
                    Admin Hub
                  </Link>

                  <Link
                    to="/analytics"
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-1.5 ${
                      isActive('/analytics')
                        ? 'bg-slate-800 text-indigo-300 border border-slate-700'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    Analytics
                  </Link>
                </>
              )}
            </div>

            {/* Right Action Badges & Auth */}
            <div className="hidden md:flex items-center gap-3">
              {/* Privacy Model Explainer Trigger */}
              <button
                onClick={() => setIsExplainerOpen(true)}
                className="px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/40 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Privacy Model
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-semibold text-slate-200 leading-none">{user?.name?.split(' ')[0]}</p>
                      <p className="text-[10px] text-slate-400 leading-none mt-0.5 capitalize">
                        {user?.role === 'admin' ? 'Campus Admin' : 'Verified Student'}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-600/30 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsExplainerOpen(true)}
                className="p-1.5 rounded-lg bg-emerald-950/50 text-emerald-400 border border-emerald-500/30"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 py-4 space-y-2 animate-fadeIn">
            <Link
              to="/issues"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
            >
              <Compass className="w-4 h-4 inline-block mr-2" /> Issue Explorer
            </Link>

            {isStudent && (
              <>
                <Link
                  to="/submit"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-300 hover:bg-slate-900"
                >
                  <PlusCircle className="w-4 h-4 inline-block mr-2" /> Submit Report
                </Link>
                <Link
                  to="/my-complaints"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-900"
                >
                  <FileText className="w-4 h-4 inline-block mr-2" /> My Reports
                </Link>
                <Link
                  to="/student-dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-300 hover:bg-slate-900"
                >
                  <LayoutDashboard className="w-4 h-4 inline-block mr-2" /> Student Dashboard
                </Link>
              </>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-indigo-300 hover:bg-slate-900"
                >
                  <LayoutDashboard className="w-4 h-4 inline-block mr-2" /> Admin Hub
                </Link>
                <Link
                  to="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-300 hover:bg-slate-900"
                >
                  <BarChart3 className="w-4 h-4 inline-block mr-2" /> Campus Analytics
                </Link>
              </>
            )}

            <div className="pt-3 border-t border-slate-800">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm text-slate-300"
                  >
                    <User className="w-4 h-4 text-indigo-400" />
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-xs font-semibold text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-semibold bg-slate-900 border border-slate-800 rounded-xl"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-semibold bg-indigo-600 text-white rounded-xl"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Privacy Explainer Modal */}
      <PrivacyExplainerModal isOpen={isExplainerOpen} onClose={() => setIsExplainerOpen(false)} />
    </>
  );
};
