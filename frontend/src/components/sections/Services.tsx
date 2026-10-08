"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Database, BrainCircuit, ShieldCheck, Zap } from 'lucide-react';

export default function Services() {
  const features = [
    {
      title: "Tabular Deep Learning",
      description: "Our custom PyTorch Multi-Layer Perceptron (MLP) architecture is specifically optimized for tabular healthcare data.",
      icon: <BrainCircuit className="w-6 h-6 text-purple-500" />,
      span: "md:col-span-2",
      theme: "light",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "11 Clinical Parameters",
      description: "Analyzes Glucose, BMI, Age, and cardiovascular history.",
      icon: <Activity className="w-6 h-6 text-rose-500" />,
      span: "md:col-span-1",
      theme: "light"
    },
    {
      title: "Zero Data Logging",
      description: "Stateless API ensures patient data is never stored.",
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      span: "md:col-span-1",
      theme: "dark" // Dark card
    },
    {
      title: "Real-time Inference",
      description: "FastAPI endpoints return predictive probabilities in under 50 milliseconds.",
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      span: "md:col-span-2",
      theme: "light"
    }
  ];

  return (
    <section className="py-32 bg-[#fbfaf8] flex flex-col items-center px-10">
      
      {/* Top Badge */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="bg-[#2c3e50] text-[#86bfa3] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6"
      >
        [ Core Capabilities ]
      </motion.div>

      <motion.h2 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1 }}
        className="text-4xl font-medium text-[#1c2833] mb-20 text-center"
      >
        Advanced Model Architecture
      </motion.h2>

      {/* Bento Grid */}
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
            className={`
              relative overflow-hidden rounded-[2rem] p-8 flex flex-col justify-between h-[300px] border transition-all hover:shadow-xl
              ${feature.span} 
              ${feature.theme === 'dark' 
                  ? 'bg-gradient-to-br from-slate-800 to-[#1c2833] border-slate-700 text-white' 
                  : 'bg-white border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] text-gray-900'}
            `}
          >
            {/* Optional Background Image with Overlay */}
            {feature.image && (
              <>
                <div className="absolute inset-0 z-0">
                  <img src={feature.image} alt="bg" className="w-full h-full object-cover opacity-10 grayscale mix-blend-multiply" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-0"></div>
              </>
            )}

            <div className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm
              ${feature.theme === 'dark' ? 'bg-white/10 border border-white/10' : 'bg-gray-50 border border-gray-100'}
            `}>
              {feature.icon}
            </div>

            <div className="relative z-10 mt-auto">
              <h3 className="text-2xl font-medium mb-3">{feature.title}</h3>
              <p className={`text-sm leading-relaxed ${feature.theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                {feature.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

    </section>
  );
}
