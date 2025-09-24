// File: src/components/Footer.tsx
import React from 'react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-gray-100 py-6 mt-12"
    >
      <div className="container mx-auto text-center text-gray-600">
        <p className="text-sm font-poppins">&copy; 2024 Culinary Compass. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
