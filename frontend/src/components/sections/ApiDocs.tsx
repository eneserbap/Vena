"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function ApiDocs() {
  return (
    <section className="py-24 px-10 bg-[#0a0a0b] flex justify-center overflow-hidden">
      <div className="max-w-6xl w-full flex flex-col items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-6">
            Developer Experience First
          </h2>
          <p className="text-[#7f8c8d] text-lg max-w-2xl mx-auto">
            Interact with Vena API using our beautifully crafted, real-time Scalar API Documentation. Because your inference endpoints deserve a premium interface.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(208,255,90,0.05)] border border-white/10"
        >
          {/* macOS window header */}
          <div className="bg-[#1c1c1f] px-4 py-3 flex items-center gap-2 border-b border-white/10">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 flex justify-center pr-12">
              <span className="text-[10px] text-white/40 font-mono tracking-widest">vena-kbet.onrender.com/docs</span>
            </div>
          </div>
          
          <img 
            src="/api-docs.png" 
            alt="Vena API Documentation" 
            className="w-full object-cover"
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12"
        >
          <a href="https://vena-kbet.onrender.com/docs" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#d0ff5a] text-black font-bold text-sm hover:scale-105 transition-transform">
            Explore API Docs
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
