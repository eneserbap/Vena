"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Box } from 'lucide-react';

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
            [ MLOps Architecture ]
          </div>
          
          <h2 className="text-4xl md:text-5xl font-medium text-[#1c2833] mb-6 leading-tight">
            Built for Production, Not Just Notebooks
          </h2>
          
          <p className="text-[#7f8c8d] text-lg mb-10 leading-relaxed">
            A model without a pipeline is just a science experiment. Vena is engineered as a fully reproducible, enterprise-grade machine learning system. 
            <br/><br/>
            We completely decoupled our data processing, neural network architecture, and training loops into a modular structure, ensuring absolute scalability from local development to cloud deployment.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Settings className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Hydra Configuration</h4>
                <p className="text-sm text-gray-500 mt-1">Zero hardcoding. Every hyperparameter, layer dimension, and training metric is dynamically injected via config files.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                <Box className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-900">Multi-Layer Containerization</h4>
                <p className="text-sm text-gray-500 mt-1">Optimized Docker builds with cached dependency layers ensure ultra-fast, independent environments across all machines.</p>
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
            <span>train.py</span>
            <span>Training Execution</span>
          </div>

          <div className="relative z-10 flex-1 py-8 flex flex-col gap-4">
             {/* Code Mockup or Pipeline Blocks */}
             {[
               { step: "$ python main.py train", time: "0.0s" },
               { step: "> Loading configs from conf/config.yaml", time: "0.1s" },
               { step: "> Instantiating StrokeMLP [11 -> 128 -> 64 -> 1]", time: "0.2s" },
               { step: "> Optimizer: AdamW (lr=5e-4)", time: "0.0s" },
               { step: "> Epoch 100/100: Loss 0.124 | AUROC 0.95", time: "14.2s" },
               { step: "> Exporting vena_best.pt to MLflow...", time: "0.4s" }
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
               <span className="text-white text-sm font-medium">Model Checkpoint Saved</span>
             </div>
             <span className="text-white/50 text-xs font-mono">Status: OK</span>
          </div>

        </motion.div>

      </div>
    </section>
  );
}
