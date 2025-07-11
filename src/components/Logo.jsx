import React from 'react';
import { Link } from 'react-router-dom';
import { Gem } from 'lucide-react'; 
import { motion } from 'framer-motion';
import { hoverScale, buttonTap } from '@/lib/animations';

const Logo = ({ className = "", textClassName = "" }) => {
  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <motion.div 
        whileHover={hoverScale}
        whileTap={buttonTap}
        className="p-2 bg-gradient-to-br from-primary to-turquoise-dark rounded-lg shadow-md"
      >
        <Gem className="h-6 w-6 text-white" />
      </motion.div>
      <span className={`text-xl sm:text-2xl font-bold text-primary tracking-tight ${textClassName}`}>
        Caribbean Lux Realty
      </span>
    </Link>
  );
};

export default Logo;