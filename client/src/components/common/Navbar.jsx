import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Menu, 
  X, 
  PlusCircle, 
  FileText, 
  Compass, 
  LayoutDashboard, 
  BarChart3, 
  LogOut, 
  User, 
  Search, 
  Zap,
  ShieldCheck,
  Sun,
  Moon
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { PrivacyExplainerModal } from './PrivacyExplainerModal';

export const Navbar = () => {
  const { user, isAuthenticated, isStudent, isAdmin, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isExplainerOpen, setIsExplainerOpen] = useState(false);
  const [quickTrackId, setQuickTrackId] = useState('');
  const [showTrackInput, setShowTrackInput] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleQuickTrackSubmit = (e) => {
    e.preventDefault();
    if (!quickTrackId.trim()) return;
    const cleanId = quickTrackId.trim().toUpperCase();
    navigate(`/complaints/${cleanId}`);
    setQuickTrackId('');
    setShowTrackInput(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-cream-50/90 dark:bg-wine-950/90 backdrop-blur-md border-b border-burgundy-900/10 dark:border-peach-400/10 shadow-sm transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Primary Visual Brand Mark (Open-Book Logo Only) */}
            <div className="flex items-center">
              <Link 
                to="/" 
                aria-label="Home" 
                className="flex items-center group transition-transform duration-200"
              >
                <div className="p-1.5 rounded-2xl bg-white dark:bg-wine-900 shadow-sm border border-burgundy-100 dark:border-peach-400/20 group-hover:border-burgundy-300 dark:group-hover:border-peach-400/40 group-hover:shadow-md transition-all">
                  <BrandLogo className="w-9 h-9 sm:w-11 sm:h-11" showGlow={false} />
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1.5">
              <Link
                to="/issues"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/issues')
                    ? 'bg-burgundy-800 text-cream-50 shadow-sm'
                    : 'text-wine-800 dark:text-cream-200 hover:text-burgundy-800 dark:hover:text-peach-300 hover:bg-cream-200/70 dark:hover:bg-wine-900/60'
                }`}
              >
                <Compass className={`w-4 h-4 ${isActive('/issues') ? 'text-peach-300' : 'text-burgundy-700 dark:text-peach-400'}`} />
                Issue Explorer
              </Link>

              {/* Submit Report */}
              <Link
                to="/submit"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/submit')
                    ? 'bg-burgundy-800 text-cream-50 shadow-sm'
                    : 'text-burgundy-800 dark:text-peach-200 bg-peach-100 dark:bg-burgundy-900/60 hover:bg-peach-200/90 dark:hover:bg-burgundy-900 border border-peach-300 dark:border-peach-500/30'
                }`}
              >
                <PlusCircle className="w-4 h-4 text-peach-700 dark:text-peach-400" />
                Submit Report
              </Link>

              {/* My Reports */}
              <Link
                to={isAuthenticated && isStudent ? '/my-complaints' : '/login'}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  isActive('/my-complaints')
                    ? 'bg-burgundy-800 text-cream-50 shadow-sm'
                    : 'text-wine-800 dark:text-cream-200 hover:text-burgundy-800 dark:hover:text-peach-300 hover:bg-cream-200/70 dark:hover:bg-wine-900/60'
                }`}
              >
                <FileText className={`w-4 h-4 ${isActive('/my-complaints') ? 'text-peach-300' : 'text-burgundy-700 dark:text-peach-400'}`} />
                My Reports
              </Link>

              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                      isActive('/admin')
                        ? 'bg-burgundy-800 text-cream-50 shadow-sm'
                        : 'text-wine-800 dark:text-cream-200 hover:text-burgundy-800 dark:hover:text-peach-300 hover:bg-cream-200/70 dark:hover:bg-wine-900/60'
                    }`}
                  >
                    <LayoutDashboard className={`w-4 h-4 ${isActive('/admin') ? 'text-peach-300' : 'text-burgundy-700 dark:text-peach-400'}`} />
                    Admin Hub
                  </Link>

                  <Link
                    to="/analytics"
                    className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                      isActive('/analytics')
                        ? 'bg-burgundy-800 text-cream-50 shadow-sm'
                        : 'text-wine-800 dark:text-cream-200 hover:text-burgundy-800 dark:hover:text-peach-300 hover:bg-cream-200/70 dark:hover:bg-wine-900/60'
                    }`}
                  >
                    <BarChart3 className={`w-4 h-4 ${isActive('/analytics') ? 'text-peach-300' : 'text-burgundy-700 dark:text-peach-400'}`} />
                    Analytics
                  </Link>
                </>
              )}
            </div>

            {/* Right Action Badges, Quick Track, Theme Toggle & Auth */}
            <div className="hidden md:flex items-center gap-2.5">
              {/* Quick ID Tracker Box */}
              {showTrackInput ? (
                <form onSubmit={handleQuickTrackSubmit} className="flex items-center gap-1.5 animate-fadeIn">
                  <input
                    type="text"
                    value={quickTrackId}
                    onChange={(e) => setQuickTrackId(e.target.value)}
                    placeholder="e.g. CV-A82F91"
                    className="w-36 bg-white dark:bg-wine-900 border border-burgundy-600 dark:border-peach-400 rounded-xl px-3 py-1.5 text-xs text-wine-900 dark:text-cream-50 placeholder-wine-400 dark:placeholder-wine-300 focus:outline-none focus:ring-2 focus:ring-peach-400 shadow-sm"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1.5 bg-burgundy-800 hover:bg-burgundy-900 text-white rounded-xl text-xs transition-colors"
                    title="Track"
                  >
                    <Zap className="w-3.5 h-3.5 text-peach-300" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTrackInput(false)}
                    className="p-1.5 text-wine-500 hover:text-wine-900 dark:text-cream-300 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowTrackInput(true)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 text-wine-800 dark:text-cream-200 hover:border-burgundy-300 dark:hover:border-peach-400/40 hover:text-burgundy-800 dark:hover:text-peach-300 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
                  title="Quick Track by Public Complaint ID"
                >
                  <Search className="w-3.5 h-3.5 text-burgundy-700 dark:text-peach-400" />
                  <span>Track ID</span>
                </button>
              )}

              {/* Privacy Model Explainer Trigger */}
              <button
                onClick={() => setIsExplainerOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-peach-100 dark:bg-wine-900 border border-peach-300 dark:border-peach-400/20 text-peach-900 dark:text-peach-300 text-xs font-semibold hover:bg-peach-200 dark:hover:bg-wine-800 transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-burgundy-700 dark:text-peach-400" />
                Privacy Model
              </button>

              {/* Theme Toggle Button (Light / Dark Mode) */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 text-wine-800 dark:text-peach-300 hover:text-burgundy-800 dark:hover:text-peach-200 hover:border-burgundy-300 dark:hover:border-peach-400/40 transition-all shadow-sm"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-peach-300 animate-fadeIn" />
                ) : (
                  <Moon className="w-4 h-4 text-burgundy-800 animate-fadeIn" />
                )}
              </button>

              {isAuthenticated ? (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 p-1 pr-3 rounded-full bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 hover:border-burgundy-300 dark:hover:border-peach-400/40 shadow-sm transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-burgundy-800 to-peach-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-bold text-wine-900 dark:text-cream-100 leading-none">{user?.name?.split(' ')[0]}</p>
                      <p className="text-[10px] text-peach-800 dark:text-peach-400 font-medium leading-none mt-0.5 capitalize">
                        {user?.role === 'admin' ? 'Administration' : 'Verified Student'}
                      </p>
                    </div>
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Logout"
                    className="p-2 text-wine-600 dark:text-cream-400 hover:text-burgundy-800 dark:hover:text-peach-300 hover:bg-peach-100 dark:hover:bg-wine-800 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs font-bold text-wine-800 dark:text-cream-200 hover:text-burgundy-800 dark:hover:text-peach-300 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold bg-burgundy-800 hover:bg-burgundy-900 text-cream-50 rounded-xl shadow-sm hover:shadow-glow transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-white dark:bg-wine-900 text-wine-800 dark:text-peach-300 border border-cream-300 dark:border-peach-400/20"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-peach-300" /> : <Moon className="w-4 h-4 text-burgundy-800" />}
              </button>

              <button
                onClick={() => setIsExplainerOpen(true)}
                className="p-2 rounded-xl bg-peach-100 dark:bg-wine-900 text-burgundy-800 dark:text-peach-300 border border-peach-300 dark:border-peach-400/20"
                aria-label="Privacy Model"
              >
                <ShieldCheck className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 text-wine-800 dark:text-cream-100 hover:text-burgundy-800"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-cream-300 dark:border-peach-400/10 bg-cream-50/98 dark:bg-wine-950/98 px-4 py-4 space-y-2 animate-fadeIn shadow-lg">
            <Link
              to="/issues"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-wine-800 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-wine-900"
            >
              <Compass className="w-4 h-4 inline-block mr-2 text-burgundy-700 dark:text-peach-400" /> Issue Explorer
            </Link>

            <Link
              to="/submit"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-burgundy-800 dark:text-peach-200 bg-peach-100 dark:bg-burgundy-900/60 hover:bg-peach-200 dark:hover:bg-burgundy-900"
            >
              <PlusCircle className="w-4 h-4 inline-block mr-2 text-peach-700 dark:text-peach-400" /> Submit Report
            </Link>

            <Link
              to={isAuthenticated && isStudent ? '/my-complaints' : '/login'}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-wine-800 dark:text-cream-200 hover:bg-cream-200 dark:hover:bg-wine-900"
            >
              <FileText className="w-4 h-4 inline-block mr-2 text-burgundy-700 dark:text-peach-400" /> My Reports
            </Link>

            {isStudent && (
              <Link
                to="/student-dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-burgundy-800 dark:text-peach-200 hover:bg-cream-200 dark:hover:bg-wine-900"
              >
                <LayoutDashboard className="w-4 h-4 inline-block mr-2" /> Student Dashboard
              </Link>
            )}

            {isAdmin && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-burgundy-800 dark:text-peach-200 hover:bg-cream-200 dark:hover:bg-wine-900"
                >
                  <LayoutDashboard className="w-4 h-4 inline-block mr-2" /> Admin Hub
                </Link>
                <Link
                  to="/analytics"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-burgundy-800 dark:text-peach-200 hover:bg-cream-200 dark:hover:bg-wine-900"
                >
                  <BarChart3 className="w-4 h-4 inline-block mr-2" /> Analytics
                </Link>
              </>
            )}

            <div className="pt-3 border-t border-cream-300 dark:border-peach-400/10">
              {isAuthenticated ? (
                <div className="flex items-center justify-between">
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 text-sm font-semibold text-wine-900 dark:text-cream-100"
                  >
                    <User className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
                    <span>{user?.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-xs font-bold text-burgundy-700 dark:text-peach-400 hover:text-burgundy-900 flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 rounded-xl text-wine-900 dark:text-cream-100"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 text-xs font-bold bg-burgundy-800 text-cream-50 rounded-xl"
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
