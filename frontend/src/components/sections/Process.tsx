"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Process() {
  return (
    <section className="py-32 px-10 bg-gradient-to-b from-[#5c778e] to-[#455f75] flex flex-col items-center text-white">
      
      {/* Top Badge */}
      <div className="bg-white/10 text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6">
        [ Global Health Crisis ]
      </div>

      <h2 className="text-5xl font-medium mb-24 text-center max-w-2xl leading-tight">
        Stroke is the 2nd Leading Cause of Death Globally
      </h2>

      <div className="max-w-5xl w-full flex flex-col gap-12">
        
        {/* Row 1 */}
        <div className="flex bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl h-[400px]">
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-medium mb-4">15 Million Cases Annually</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              According to the World Health Organization, 15 million people suffer a stroke worldwide each year. Of these, 5 million die and another 5 million are permanently disabled.
            </p>
            <div className="space-y-3">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">High-Risk Factors</p>
              {['Hypertension (High Blood Pressure)', 'Elevated Glucose Levels', 'High Body Mass Index (BMI)', 'Cardiovascular Disease'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d0ff5a]"></div>
                  <span className="text-xs text-white/90 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1551883196-18758832598d?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Consultation"/>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl h-[400px]">
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-medium mb-4">Up to 80% are Preventable</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Prevention through prediction is the most effective medicine. Early detection of clinical risk factors can prevent up to 80% of strokes. Vena's Deep Learning architecture is specifically designed to catch these complex risk correlations before they become critical.
            </p>
            <div className="space-y-3">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">AI Intervention</p>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0ff5a]"></div>
                <span className="text-xs text-white/90 font-medium">Real-time preventative diagnostics</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0ff5a]"></div>
                <span className="text-xs text-white/90 font-medium">Data-driven lifestyle intervention mapping</span>
              </div>
            </div>
          </div>
          <div className="w-1/2 relative group overflow-hidden">
            <img src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" alt="Doctor Report"/>
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700"></div>
          </div>
        </div>

      </div>
    </section>
  );
}
