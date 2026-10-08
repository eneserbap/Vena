"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Database, GitBranch, RefreshCw } from 'lucide-react';

export default function About() {
  return (
    <section className="py-32 px-10 bg-[#fbfaf8] flex justify-center overflow-hidden">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Text Side */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-[#2c3e50] text-[#86bfa3] px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 inline-block">
            [ Data Engineering ]
          </div>
          
          <h2 className="text-4xl md:text-5xl font-medium text-[#1c2833] mb-6 leading-tight">
            Solving the 95% Class Imbalance
          </h2>
          
          <p className="text-[#7f8c8d] text-lg mb-10 leading-relaxed">
            In the medical stroke dataset, actual stroke cases are incredibly rare (less than 5%). Standard machine learning models naturally fail in these conditions by guessing "No Stroke" every time. 
            <br/><br/>
            Vena overcomes this using advanced <strong className="text-[#2c3e50] font-semibold">Stratified Splitting</strong>, median imputation, and dynamic PyTorch loss weighting to ensure the neural network accurately learns the minority class without bias.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">DVC Version Control</h4>
                <p className="text-sm text-gray-500 mt-1">Huge clinical CSV files are tracked via Data Version Control instead of Git, ensuring full reproducibility.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Automated Preprocessing</h4>
                <p className="text-sm text-gray-500 mt-1">One-hot encoding for categorical variables and StandardScaler normalization directly integrated into the pipeline.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Visual/Graphic Side */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative h-[600px] w-full rounded-[2rem] bg-gradient-to-b from-[#5c778e] to-[#455f75] p-8 flex flex-col justify-between shadow-2xl overflow-hidden border border-white/20"
        >
          {/* Abstract background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 flex justify-between items-center text-white/80 text-sm font-medium border-b border-white/10 pb-4">
            <span>data.py</span>
            <span>Pipeline Execution</span>
          </div>

          <div className="relative z-10 flex-1 py-8 flex flex-col gap-4">
             {/* Code Mockup or Pipeline Blocks */}
             {[
               { step: "1. Load raw dataset (healthcare-dataset.csv)", time: "0.2s" },
               { step: "2. Median Imputation (BMI)", time: "0.5s" },
               { step: "3. One-Hot & Ordinal Encoding", time: "0.8s" },
               { step: "4. StandardScaler Normalization", time: "0.4s" },
               { step: "5. Stratified Train/Test Split (80/20)", time: "0.3s" }
             ].map((item, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 10 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: 0.5 + (i * 0.1) }}
                 className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex justify-between items-center border border-white/10"
               >
                 <span className="text-white text-sm font-mono">{item.step}</span>
                 <span className="text-[#d0ff5a] text-xs font-mono">{item.time}</span>
               </motion.div>
             ))}
          </div>

          <div className="relative z-10 bg-black/40 backdrop-blur-xl rounded-xl p-4 flex items-center justify-between border border-white/5">
             <div className="flex items-center gap-3">
               <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
               <span className="text-white text-sm font-medium">Pipeline Ready</span>
             </div>
             <span className="text-white/50 text-xs font-mono">Status: OK</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
