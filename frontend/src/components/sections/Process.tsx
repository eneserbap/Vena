"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Process() {
  return (
    <section className="py-32 px-10 bg-gradient-to-b from-[#5c778e] to-[#455f75] flex flex-col items-center text-white">
      
      {/* Top Badge */}
      <div className="bg-white/10 text-white border border-white/20 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6">
        [ Assessment ]
      </div>

      <h2 className="text-5xl font-medium mb-24 text-center max-w-xl leading-tight">
        Your Journey to Better Diagnostics Starts Here
      </h2>

      <div className="max-w-5xl w-full flex flex-col gap-12">
        
        {/* Row 1 */}
        <div className="flex bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl h-[400px]">
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-medium mb-4">Run Your AI Consultation</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Enter your clinical metrics into our secure Vena API to instantly receive a personalized stroke risk assessment powered by our trained deep learning model.
            </p>
            <div className="space-y-3">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">What's included</p>
              {['Real-time inference', 'Clinical threshold checking', 'Risk factor highlights', 'Probability scoring', 'Explainable AI breakdown'].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#d0ff5a]"></div>
                  <span className="text-xs text-white/90 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="w-1/2">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Consultation"/>
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl h-[400px]">
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <h3 className="text-3xl font-medium mb-4">Get a Personalized Risk Report</h3>
            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Based on your data inputs, our PyTorch backend computes a detailed breakdown of your health trajectory, designed to support your preventative healthcare objectives.
            </p>
            <div className="space-y-3">
              <p className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Capabilities</p>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0ff5a]"></div>
                <span className="text-xs text-white/90 font-medium">Continuous model monitoring</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#d0ff5a]"></div>
                <span className="text-xs text-white/90 font-medium">HIPAA compliant data processing</span>
              </div>
            </div>
          </div>
          <div className="w-1/2">
            <img src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Doctor Report"/>
          </div>
        </div>

      </div>
    </section>
  );
}
