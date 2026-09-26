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
      <header className="sticky top-0 z-40 w-full bg-cream-50/95 dark:bg-wine-950/95 backdrop-blur-md border-b border-burgundy-900/10 dark:border-peach-400/10 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 w-full gap-2 lg:gap-3">
            
            {/* 1. Brand Logo */}
            <div className="flex items-center shrink-0">
              <Link 
                to="/" 
                aria-label="Campus Voice Home" 
                className="flex items-center group transition-transform duration-200 hover:scale-105"
              >
                <div className="w-10 h-10 sm:w-11 sm:h-11 aspect-square rounded-full bg-[#FAF7EE] dark:bg-wine-900 shadow-xs border border-burgundy-200/90 dark:border-peach-400/30 group-hover:border-burgundy-400 dark:group-hover:border-peach-400/60 transition-all flex items-center justify-center overflow-hidden">
                  <BrandLogo className="w-full h-full" showGlow={false} />
                </div>
              </Link>
            </div>

            {/* 2. Desktop Navigation Stream */}
            <nav className="hidden md:flex items-center gap-1.5 lg:gap-2 min-w-0" aria-label="Main Navigation">
              {/* Issue Explorer */}
              <Link
                to="/issues"
                className={`h-10 px-3 lg:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive('/issues')
                    ? 'text-burgundy-900 dark:text-peach-200 bg-peach-100/90 dark:bg-wine-900 border border-peach-300 dark:border-peach-400/30 shadow-xs'
                    : 'btn-glass btn-glass-subtle text-wine-800 dark:text-cream-200'
                }`}
              >
                <Compass className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" />
                <span>Issue Explorer</span>
              </Link>

              {/* Submit Report - PRIMARY CTA */}
              <Link
                to="/submit"
                className="h-10 px-3.5 lg:px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 btn-glass btn-glass-primary shadow-sm shrink-0"
              >
                <PlusCircle className="w-4 h-4 text-peach-300 shrink-0" />
                <span>Submit Report</span>
              </Link>

              {/* My Reports */}
              <Link
                to={isAuthenticated && isStudent ? '/my-complaints' : '/login'}
                className={`h-10 px-3 lg:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive('/my-complaints')
                    ? 'text-burgundy-900 dark:text-peach-200 bg-peach-100/90 dark:bg-wine-900 border border-peach-300 dark:border-peach-400/30 shadow-xs'
                    : 'btn-glass btn-glass-subtle text-wine-800 dark:text-cream-200'
                }`}
              >
                <FileText className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" />
                <span>My Reports</span>
              </Link>

              {/* Admin Hub & Analytics (When Admin) */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className={`h-10 px-3 lg:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive('/admin')
                        ? 'text-burgundy-900 dark:text-peach-200 bg-peach-100/90 dark:bg-wine-900 border border-peach-300 dark:border-peach-400/30 shadow-xs'
                        : 'btn-glass btn-glass-subtle text-wine-800 dark:text-cream-200'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" />
                    <span>Admin Hub</span>
                  </Link>

                  <Link
                    to="/analytics"
                    className={`h-10 px-3 lg:px-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                      isActive('/analytics')
                        ? 'text-burgundy-900 dark:text-peach-200 bg-peach-100/90 dark:bg-wine-900 border border-peach-300 dark:border-peach-400/30 shadow-xs'
                        : 'btn-glass btn-glass-subtle text-wine-800 dark:text-cream-200'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" />
                    <span>Analytics</span>
                  </Link>
                </>
              )}

              {/* Track ID */}
              {showTrackInput ? (
                <form onSubmit={handleQuickTrackSubmit} className="flex items-center gap-1 h-10 animate-fadeIn shrink-0">
                  <input
                    type="text"
                    value={quickTrackId}
                    onChange={(e) => setQuickTrackId(e.target.value)}
                    placeholder="CV-A82F91"
                    className="w-28 lg:w-32 h-10 bg-white dark:bg-wine-900 border border-burgundy-600 dark:border-peach-400 rounded-xl px-3 text-xs text-wine-900 dark:text-cream-50 placeholder-wine-400 focus:outline-none focus:ring-1 focus:ring-peach-400 shadow-xs"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="h-10 w-10 btn-glass btn-glass-primary text-xs rounded-xl flex items-center justify-center shrink-0"
                    title="Track ID"
                  >
                    <Zap className="w-4 h-4 text-peach-300" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTrackInput(false)}
                    className="h-10 w-6 flex items-center justify-center text-wine-500 hover:text-wine-900 dark:text-cream-300 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTrackInput(true)}
                  className="h-10 px-3 lg:px-3.5 btn-glass btn-glass-subtle text-xs font-bold flex items-center gap-1.5 shrink-0"
                  title="Quick Track by Public Complaint ID"
                >
                  <Search className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" />
                  <span>Track ID</span>
                </button>
              )}

              {/* Privacy Model */}
              <button
                type="button"
                onClick={() => setIsExplainerOpen(true)}
                className="h-10 px-3 lg:px-3.5 btn-glass btn-glass-subtle text-xs font-bold flex items-center gap-1.5 shrink-0"
                title="Verified Anonymity Architecture"
              >
                <ShieldCheck className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" />
                <span>Privacy Model</span>
              </button>
            </nav>

            {/* 3. Account Controls & Far Right Logout Group */}
            <div className="hidden md:flex items-center gap-2 lg:gap-2.5 ml-auto shrink-0">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="h-10 w-10 btn-glass btn-glass-subtle rounded-xl flex items-center justify-center shrink-0"
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-peach-300 animate-fadeIn" />
                ) : (
                  <Moon className="w-4 h-4 text-burgundy-800 animate-fadeIn" />
                )}
              </button>

              {/* User Profile or Log In / Register */}
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className={`h-10 flex items-center gap-2 px-3 rounded-xl btn-glass btn-glass-subtle shrink-0 ${
                    isActive('/profile') ? 'border-peach-400/50 bg-peach-100/90 dark:bg-wine-900' : ''
                  }`}
                  title="View Profile"
                >
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-burgundy-800 to-peach-500 flex items-center justify-center text-[11px] font-extrabold text-white shadow-xs shrink-0">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-wine-900 dark:text-cream-100 leading-none truncate max-w-[90px]">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-peach-800 dark:text-peach-400 font-medium leading-none mt-0.5 capitalize">
                      {user?.role === 'admin' ? 'Admin' : 'Verified'}
                    </p>
                  </div>
                </Link>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to="/login"
                    className="h-10 px-3.5 btn-glass btn-glass-subtle text-xs font-bold flex items-center justify-center"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="h-10 px-3.5 btn-glass btn-glass-secondary text-xs font-bold flex items-center justify-center"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* 4. Logout Control (Strictly at Far Right) */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleLogout}
                  title="Logout from session"
                  className="h-10 px-3 btn-glass btn-glass-subtle rounded-xl text-xs font-bold text-wine-800 dark:text-cream-200 hover:text-burgundy-950 dark:hover:text-peach-300 flex items-center gap-1.5 shrink-0 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-burgundy-700 dark:text-peach-400 shrink-0" />
                  <span className="inline">Logout</span>
                </button>
              )}
            </div>

            {/* 5. Mobile header actions */}
            <div className="flex md:hidden items-center gap-1.5 ml-auto shrink-0">
              <button
                type="button"
                onClick={toggleTheme}
                className="h-9 w-9 btn-glass btn-glass-subtle rounded-xl flex items-center justify-center"
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-4 h-4 text-peach-300" /> : <Moon className="w-4 h-4 text-burgundy-800" />}
              </button>

              <button
                type="button"
                onClick={() => setIsExplainerOpen(true)}
                className="h-9 w-9 btn-glass btn-glass-subtle rounded-xl flex items-center justify-center"
                aria-label="Privacy Model"
              >
                <ShieldCheck className="w-4 h-4 text-burgundy-700 dark:text-peach-400" />
              </button>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="h-9 w-9 rounded-xl bg-white dark:bg-wine-900 border border-cream-300 dark:border-peach-400/20 text-wine-800 dark:text-cream-100 flex items-center justify-center"
                aria-label="Open menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-cream-300 dark:border-peach-400/10 bg-cream-50/98 dark:bg-wine-950/98 px-3 sm:px-4 py-3 sm:py-4 space-y-2 animate-fadeIn shadow-lg">
            {/* Quick Track Input in Mobile */}
            <form onSubmit={(e) => { setMobileMenuOpen(false); handleQuickTrackSubmit(e); }} className="flex items-center gap-1.5 pb-1">
              <input
                type="text"
                value={quickTrackId}
                onChange={(e) => setQuickTrackId(e.target.value)}
                placeholder="Track Complaint (e.g. CV-A82F91)"
                className="flex-1 h-9 bg-white dark:bg-wine-900 border border-peach-300 dark:border-peach-400/30 rounded-xl px-3 text-xs text-wine-900 dark:text-cream-50 placeholder-wine-400 focus:outline-none focus:ring-1 focus:ring-peach-400"
              />
              <button
                type="submit"
                className="h-9 px-3 btn-glass btn-glass-primary text-xs rounded-xl flex items-center justify-center font-bold"
              >
                <Search className="w-3.5 h-3.5 mr-1" /> Track
              </button>
            </form>

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
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-xs font-bold text-burgundy-700 dark:text-peach-400 hover:text-burgundy-900 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-peach-100 dark:hover:bg-wine-900"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 text-xs font-bold btn-glass btn-glass-subtle"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 text-xs font-bold btn-glass btn-glass-primary"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Privacy Explainer Modal */}
      <PrivacyExplainerModal isOpen={isExplainerOpen} onClose={() => setIsExplainerOpen(false)} />
    </>
  );
};
