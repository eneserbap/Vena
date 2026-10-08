"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Volume2 } from 'lucide-react';

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-6 mix-blend-difference text-white"
    >
      <div className="flex items-center gap-12">
        <span className="text-xl font-bold tracking-[0.2em]">VENA</span>
        <div className="hidden md:flex items-center gap-4 cursor-pointer hover:opacity-70 transition-opacity">
          <div className="w-8 h-[1px] bg-white"></div>
          <span className="text-sm font-medium uppercase tracking-widest">Menu</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
          <Search className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white hover:text-black transition-all">
          <Volume2 className="w-5 h-5" />
        </button>
      </div>
    </motion.nav>
  );
}
