"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-6 md:py-8 text-white gap-4 md:gap-0">
      <span className="text-lg md:text-xl font-bold tracking-widest text-center md:text-left">VENA PROJECT</span>
      
      <a href="#assessment" className="px-5 md:px-6 py-2 md:py-2.5 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-all text-[10px] md:text-xs font-bold tracking-widest border border-white/20 backdrop-blur-md">
        TRY VENA
      </a>
    </nav>
  );
}
