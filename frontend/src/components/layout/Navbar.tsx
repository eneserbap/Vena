"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-8 text-white">
      <span className="text-xl font-bold tracking-widest">VENA PROJECT</span>
      
      <a href="#assessment" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all text-xs font-bold tracking-widest border border-white/20 backdrop-blur-md">
        TRY VENA
      </a>
    </nav>
  );
}
