"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Process() {
  return (
    <section className="min-h-screen bg-white py-32 px-10 relative overflow-hidden flex flex-col justify-center">
      
      {/* Big scrolling text (Marquee effect) */}
      <div className="absolute top-32 left-0 w-full overflow-hidden whitespace-nowrap opacity-10">
        <motion.div 
          animate={{ x: [0, -1000] }} 
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="text-[8rem] font-medium tracking-tighter"
        >
          HIGH PRECISION / GENETIC INSIGHT / ONCOLOGY RESEARCH / STROKE PREDICTION
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mt-48 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-5xl font-medium leading-tight text-gray-900 mb-20 max-w-xl">
            Our mission is to unravel the intricacies of your clinical data, providing you with <span className="text-gray-300">the most detailed diagnostic insights.</span>
          </h2>

          <div className="grid grid-cols-2 gap-y-16 gap-x-10">
            <div>
              <p className="text-6xl font-light text-gray-900 mb-2">95<span className="text-3xl">%</span></p>
              <div className="h-[1px] w-full bg-gray-200 mb-4"></div>
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">AUROC Score</p>
            </div>
            <div>
              <p className="text-6xl font-light text-gray-900 mb-2">50<span className="text-3xl">+</span></p>
              <div className="h-[1px] w-full bg-gray-200 mb-4"></div>
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Countries in Service</p>
            </div>
            <div>
              <p className="text-6xl font-light text-gray-900 mb-2">89<span className="text-3xl">%</span></p>
              <div className="h-[1px] w-full bg-gray-200 mb-4"></div>
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Accuracy Rate</p>
            </div>
            <div>
              <p className="text-6xl font-light text-gray-900 mb-2">30<span className="text-3xl">k+</span></p>
              <div className="h-[1px] w-full bg-gray-200 mb-4"></div>
              <p className="text-sm font-semibold text-gray-500 tracking-wide uppercase">Satisfied Customers</p>
            </div>
          </div>
        </motion.div>

        {/* Abstract Circular Diagram */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative h-[600px] flex items-center justify-center"
        >
          <span className="absolute top-0 right-10 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Vena's Precision Diagnostics</span>
          
          <div className="absolute w-[500px] h-[500px] rounded-full border border-gray-200 flex items-center justify-end pr-20">
            <span className="absolute left-10 text-xs font-medium text-gray-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400"></span> Collaboration
            </span>
            <div className="w-[400px] h-[400px] rounded-full border border-gray-200 bg-gray-50/50 flex items-center justify-end pr-16">
              <span className="absolute left-16 top-32 text-xs font-medium text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Diagnostic
              </span>
              <div className="w-[280px] h-[280px] rounded-full border border-gray-200 bg-gray-100/50 flex items-center justify-end pr-10">
                <span className="absolute right-32 bottom-20 text-xs font-medium text-gray-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span> Interpretation
                </span>
                <div className="w-[150px] h-[150px] rounded-full bg-purple-100 flex items-center justify-center relative shadow-xl shadow-purple-500/20">
                  <div className="w-4 h-4 rounded-full bg-purple-600 animate-pulse"></div>
                  <span className="absolute -top-6 -right-10 whitespace-nowrap text-xs font-medium text-gray-900">
                    Sample Processing
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
