// File: src/components/Header.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CookingPot, PlusCircle, User2 } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
      className="bg-white/80 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 z-50 py-4"
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        <Link to="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 text-compass-primary cursor-pointer"
          >
            <CookingPot className="w-8 h-8 md:w-10 md:h-10 text-compass-primary" />
            <h1 className="text-2xl md:text-3xl font-playfair font-bold">Culinary Compass</h1>
          </motion.div>
        </Link>
        <nav>
          <ul className="flex space-x-4 md:space-x-6">
            <motion.li whileHover={{ scale: 1.1 }}>
              <Link to="/add-recipe" className="flex flex-col items-center text-gray-700 hover:text-compass-primary transition-colors">
                <PlusCircle className="w-6 h-6" />
                <span className="text-xs font-poppins mt-1 hidden md:block">Add Recipe</span>
              </Link>
            </motion.li>
            <motion.li whileHover={{ scale: 1.1 }}>
              <Link to="/profile" className="flex flex-col items-center text-gray-700 hover:text-compass-primary transition-colors">
                <User2 className="w-6 h-6" />
                <span className="text-xs font-poppins mt-1 hidden md:block">Profile</span>
              </Link>
            </motion.li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};

export default Header;
