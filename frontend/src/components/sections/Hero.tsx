"use client";
import React from 'react';
import { motion } from 'framer-motion';
import DNA from '@/components/ui/DNA';
import { Globe, ArrowUpRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#637d95] to-[#4a637a] pt-32 pb-20 px-12 overflow-hidden flex flex-col items-center">
      
      {/* Massive Background Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none z-0">
        <h1 className="absolute right-[52%] top-1/2 -translate-y-1/2 text-[9rem] xl:text-[11rem] font-light text-white/90 tracking-tighter">VENA</h1>
        <h1 className="absolute left-[52%] top-1/2 -translate-y-1/2 text-[9rem] xl:text-[11rem] font-light text-white/90 tracking-tighter">PROJECT</h1>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0"></div>

      {/* 3D Heart Image (Replacing the DNA) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] flex justify-center items-center pointer-events-none mix-blend-screen z-0">
        <motion.img 
          src="/heart.jpg" 
          alt="3D Heart"
          className="w-[600px] h-[600px] object-cover opacity-90 brightness-110"
          animate={{ y: [0, -20, 0], scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[280px] z-30">
         <motion.a 
           href="#assessment"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 1 }}
           className="bg-[#d0ff5a] text-[#2c3e50] px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_30px_rgba(208,255,90,0.4)] hover:scale-110 transition-transform flex items-center gap-2 inline-flex"
         >
           Start Assessment <ArrowUpRight className="w-4 h-4" />
         </motion.a>
      </div>

      {/* Floating UI Elements */}
      <div className="relative z-20 w-full h-full flex-1 flex flex-col justify-between mt-10">
        <div className="flex justify-between w-full">
          <p className="text-white/70 text-sm max-w-[200px] leading-relaxed">
            End-to-End MLOps pipeline for predictive healthcare diagnostics.
          </p>
          <div className="text-right">
            <span className="text-white/50 text-xs uppercase tracking-widest">Version v1.2</span>
          </div>
        </div>

        <div className="flex justify-between items-end w-full mt-auto pb-10">
          
          {/* Left Bottom Floating Elements */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="text-[#d0ff5a] text-5xl font-light">5110</div>
              <div className="text-white">
                <p className="font-bold text-sm">Clinical Records</p>
                <p className="text-[10px] text-white/60">Kaggle Stroke Dataset</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-2 w-fit">
              <p className="text-white text-xs">Handling 95% extreme class imbalance</p>
            </div>
          </div>

          {/* Right Bottom Elements */}
          <div className="flex flex-col items-end gap-3">
            <p className="text-white text-sm text-right leading-tight max-w-[200px]">
              End-to-End MLOps Pipeline with DVC & MLflow
            </p>
            <div className="flex items-center gap-2">
              <div className="bg-[#4a637a] text-white px-3 py-1 rounded-full text-[10px] font-bold border border-white/20">PyTorch</div>
              <div className="bg-[#4a637a] text-white px-3 py-1 rounded-full text-[10px] font-bold border border-white/20">FastAPI</div>
            </div>
            <a href="https://github.com/eneserbap/Vena" target="_blank" rel="noreferrer" className="text-[#d0ff5a] text-xs underline mt-2">
              View Repository
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
