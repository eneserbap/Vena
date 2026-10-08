"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

import DNA from '@/components/ui/DNA';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center px-10 pt-20 overflow-hidden bg-white">
      {/* 3D WebGL Point Cloud DNA */}
      <DNA />

      <div className="relative z-10 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-8 block">
            Purpose of Vena
          </span>
          <h1 className="text-[5rem] leading-[1.05] font-medium tracking-tight text-gray-900 mb-8">
            Detailed diagnostic <br /> of your risk
          </h1>
          <p className="text-xl text-gray-500 max-w-md font-light leading-relaxed mb-12">
            Health is the most important thing. So don't put it off for later. Think about your future today.
          </p>
          
          <div className="flex items-center gap-8">
            <button className="px-8 py-4 rounded-full border border-gray-300 text-sm font-semibold uppercase tracking-wider hover:bg-gray-900 hover:text-white transition-all duration-300">
              Run Assessment
            </button>
            <button className="flex items-center gap-3 px-6 py-4 rounded-full bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-all group">
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              Scroll for more
            </button>
          </div>
        </motion.div>
      </div>

      {/* Floating Info Card at Bottom */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute bottom-10 left-10 right-10 bg-white/80 backdrop-blur-xl border border-gray-100 rounded-[2rem] p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-10 shadow-[0_20px_40px_rgb(0,0,0,0.04)]"
      >
        <div className="flex items-baseline gap-6">
          <span className="text-6xl font-medium text-gray-900">01</span>
          <div>
            <span className="text-xs font-bold text-gray-400 tracking-wider mb-1 block">2026-10-08</span>
            <h3 className="text-xl font-medium text-gray-900 max-w-[200px] leading-snug">First AI Model in Clinical Research</h3>
          </div>
        </div>
        <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-2xl">
          VENA is a Global Clinical Research model specializing in Stroke Prediction with accreditations from major medical institutes. It processes 11 unique patient features to provide hyper-accurate diagnostics.
        </p>
      </motion.div>
    </section>
  );
}
