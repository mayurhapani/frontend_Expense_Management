import React from 'react';
import { motion } from 'framer-motion';

const GlobalLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
      <motion.div
        className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center"
        animate={{
          scale: [1, 1.2, 1],
          rotateY: [0, 180, 360],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <span className="text-3xl font-bold text-yellow-800">$</span>
      </motion.div>
    </div>
  );
};

export default GlobalLoader;
