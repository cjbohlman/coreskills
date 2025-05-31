import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MenuIcon, X, Moon, Sun, LogOut } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const NavBar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const menuVariants = {
    closed: { opacity: 0, x: '100%' },
    open: { opacity: 1, x: 0 },
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm backdrop-blur-md bg-opacity-80 dark:bg-opacity-80">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary-600 dark:text-primary-400">CoreSkills</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                }
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/challenges"
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                }
              >
                Challenges
              </NavLink>
              {user && (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 font-medium'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
                  }
                >
                  Profile
                </NavLink>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Authentication buttons */}
            <div className="hidden md:ml-4 md:flex md:items-center">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user.user_metadata?.full_name || user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    leftIcon={<LogOut size={16} />}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-x-2">
                  <Link to="/login">
                    <Button variant="outline" size="sm">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden ml-2">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                aria-expanded={isMenuOpen}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-white dark:bg-gray-900 pt-16"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="px-4 pt-2 pb-3 space-y-1 sm:px-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-4 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
                onClick={closeMenu}
                end
              >
                Home
              </NavLink>
              <NavLink
                to="/challenges"
                className={({ isActive }) =>
                  `block px-3 py-4 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-800'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
                onClick={closeMenu}
              >
                Challenges
              </NavLink>
              {user && (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `block px-3 py-4 rounded-md text-base font-medium ${
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-gray-800'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`
                  }
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>
              )}
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <div className="px-4 sm:px-6 space-y-3">
                  <div className="flex items-center">
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                        {user.user_metadata?.full_name || 'User'}
                      </div>
                      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => {
                      signOut();
                      closeMenu();
                    }}
                    leftIcon={<LogOut size={16} />}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="px-4 sm:px-6 space-y-3">
                  <Link to="/login" onClick={closeMenu}>
                    <Button variant="outline" fullWidth>
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={closeMenu}>
                    <Button variant="primary" fullWidth>
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};