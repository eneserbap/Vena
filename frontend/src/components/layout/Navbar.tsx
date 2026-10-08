"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-12 py-8 text-white">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#d0ff5a]"></div>
        <span className="text-xl font-bold tracking-widest">VENA</span>
      </div>
      
      <div className="hidden md:flex items-center gap-10 text-sm font-medium text-white/80">
        <a href="#" className="text-[#d0ff5a]">Home</a>
        <a href="#" className="hover:text-white transition-colors">About</a>
        <a href="#" className="hover:text-white transition-colors">Architecture</a>
        <a href="#" className="hover:text-white transition-colors">Pipeline</a>
        <a href="#" className="hover:text-white transition-colors">Contact</a>
      </div>

      <button className="px-8 py-3 rounded-full border border-white/30 hover:bg-white hover:text-[#556f87] transition-colors text-sm font-semibold">
        Run Model
      </button>
    </nav>
  );
}
