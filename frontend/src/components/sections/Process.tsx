"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Process() {
  return (
    <section className="py-32 px-10 bg-gradient-to-b from-[#5c778e] to-[#455f75] flex flex-col items-center text-white">
      
      {/* Top Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-white/10 text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6"
      >
        [ Global Health Crisis ]
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-5xl font-medium mb-24 text-center max-w-3xl leading-tight"
      >
        Stroke is the 2nd Leading Cause of Death Globally
      </motion.h2>

      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl h-[550px]"
        >
          <div className="h-[45%] relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1551883196-18758832598d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" alt="Hospital"/>
          </div>
          <div className="h-[55%] p-8 flex flex-col justify-center bg-gradient-to-b from-white/5 to-transparent">
            <h3 className="text-2xl font-medium mb-4">15 Million Cases</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              According to the WHO, 15 million people suffer a stroke annually. 5 million die, and another 5 million are permanently disabled.
            </p>
            <div className="mt-auto flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>
               <span className="text-xs text-white/50 uppercase tracking-wider font-bold">Critical Scale</span>
            </div>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl h-[550px]"
        >
          <div className="h-[45%] relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" alt="Medical Tools"/>
          </div>
          <div className="h-[55%] p-8 flex flex-col justify-center bg-gradient-to-b from-white/5 to-transparent">
            <h3 className="text-2xl font-medium mb-4">Hidden Risk Factors</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Many strokes occur suddenly without prior symptoms. Hidden conditions like asymptomatic hypertension and elevated glucose levels drastically increase risk.
            </p>
            <div className="mt-auto flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
               <span className="text-xs text-white/50 uppercase tracking-wider font-bold">Clinical Metrics</span>
            </div>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl h-[550px]"
        >
          <div className="h-[45%] relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700" alt="Doctor Analyzing"/>
          </div>
          <div className="h-[55%] p-8 flex flex-col justify-center bg-gradient-to-b from-white/5 to-transparent">
            <h3 className="text-2xl font-medium mb-4">80% Are Preventable</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Prevention is the best medicine. Deep Learning architectures like Vena can detect complex physiological correlations to catch these risks before they become critical.
            </p>
            <div className="mt-auto flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-[#d0ff5a]"></div>
               <span className="text-xs text-white/50 uppercase tracking-wider font-bold">AI Intervention</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
