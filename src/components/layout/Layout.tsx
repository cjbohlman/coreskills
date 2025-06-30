import React from 'react';
import { motion } from 'framer-motion';
import { NavBar } from './NavBar';
import { Footer } from './Footer';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -10,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeInOut',
  duration: 0.3,
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen relative">
      <NavBar />
      <motion.main
        className="flex-grow"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        {children}
      </motion.main>
      <Footer />
      
      {/* Corner Circle - changes based on theme */}
      <div className="fixed bottom-4 right-4 z-10">
        <a href=" https://bolt.new/">
          <img
            src={theme === 'light' ? '/black_circle_360x360.png' : '/white_circle_360x360.png'}
            alt=""
            className="w-16 h-16 transition-opacity duration-300"
          />
        </a>
      </div>
    </div>
  );
};