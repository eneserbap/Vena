"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Services() {
  return (
    <section id="services" className="py-24 bg-[#fbfaf8] flex flex-col items-center px-10">
      
      {/* Top Badge */}


      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-4xl font-medium text-[#1c2833] mb-16 text-center"
      >
        Advanced Model Performance
      </motion.h2>

      {/* 4-Column Masonry Grid exactly matching the design */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">
        
        {/* Column 1: Tall Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="col-span-1 h-[400px] md:h-full rounded-[2rem] relative overflow-hidden bg-[#516b84] shadow-lg group"
        >
          <img src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" alt="Tech Architecture" />
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-[1.5rem] p-6 text-center shadow-xl">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Architecture</span>
             <h3 className="text-5xl font-light text-gray-900 mb-2">100<span className="text-2xl">%</span></h3>
             <p className="text-xs text-gray-500 leading-relaxed">Fully decoupled MLOps pipeline for instant reproducibility.</p>
          </div>
        </motion.div>

        {/* Column 2: Two Stacked Cards */}
        <div className="col-span-1 h-[500px] md:h-full flex flex-col gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 rounded-[2rem] relative overflow-hidden bg-[#2c3e50] shadow-lg group"
          >
            <img src="https://images.unsplash.com/photo-1530026405186-ed1f139313f8?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" alt="DNA Cells" />
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-[1.5rem] p-6 text-center shadow-xl">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Inference Speed</span>
               <h3 className="text-5xl font-light text-gray-900 mb-2">&lt;50<span className="text-xl">ms</span></h3>
               <p className="text-xs text-gray-500 leading-relaxed">Instant API predictions powered by FastAPI.</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex-1 rounded-[2rem] relative overflow-hidden shadow-lg group"
          >
             <img src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=600&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Clinical Data" />
          </motion.div>
        </div>

        {/* Column 3: Tall Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="col-span-1 h-[400px] md:h-full rounded-[2rem] relative overflow-hidden bg-[#455f75] shadow-lg group"
        >
          <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" alt="Medical Scan" />
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-[1.5rem] p-6 text-center shadow-xl">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Model Accuracy</span>
             <h3 className="text-5xl font-light text-gray-900 mb-2">95<span className="text-2xl">%</span></h3>
             <p className="text-xs text-gray-500 leading-relaxed">AUROC performance achieved through Tabular Deep Learning.</p>
          </div>
        </motion.div>

        {/* Column 4: Tall Card */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="col-span-1 h-[400px] md:h-full rounded-[2rem] relative overflow-hidden bg-slate-800 shadow-lg group"
        >
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" alt="Code Data" />
          <div className="absolute bottom-4 left-4 right-4 bg-white rounded-[1.5rem] p-6 text-center shadow-xl">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Open Source</span>
             <h3 className="text-5xl font-light text-gray-900 mb-2">100<span className="text-2xl">%</span></h3>
             <p className="text-xs text-gray-500 leading-relaxed">Built entirely on transparent, open-source AI frameworks.</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
