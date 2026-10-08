"use client";
import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import DNA from '@/components/ui/DNA';
import { Globe, ArrowUpRight } from 'lucide-react';

export default function Hero() {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 300]);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#637d95] to-[#4a637a] pt-32 pb-20 px-12 overflow-hidden flex flex-col items-center">
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0"></div>

      {/* 3D Heart Image (Background) */}
      <motion.div style={{ y: backgroundY }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] flex justify-center items-center pointer-events-none mix-blend-screen z-0 opacity-50">
        <motion.img 
          src="/heart.jpg" 
          alt="3D Heart"
          className="w-full h-full object-cover brightness-110"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Massive Foreground Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center pointer-events-none z-10">
        <h1 className="text-[7rem] md:text-[10rem] xl:text-[14rem] font-bold text-[#d0ff5a] tracking-tighter leading-none whitespace-nowrap opacity-90">
          VENA PROJECT
        </h1>
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
            <a href="https://github.com/eneserbap/Vena" target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-medium transition-colors border border-white/20 backdrop-blur-md text-xs mt-2">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              View Repository
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
