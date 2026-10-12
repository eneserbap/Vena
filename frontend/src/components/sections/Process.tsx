"use client";
import React from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle2,
  Clock,
  HeartPulse,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react';

export default function Process() {
  return (
    <section
      id="process"
      className="relative py-28 px-6 md:px-12 bg-[#fbfaf8] text-slate-900 overflow-hidden border-t border-slate-100"
    >
      <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center">
        {/* Master Heading with Lime Highlight */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-normal text-center max-w-4xl leading-[1.15] mb-6 tracking-tight text-slate-900"
        >
          Stroke is the{" "}
          <span className="relative inline-block font-semibold text-slate-900">
            2nd Leading Cause of Death
            <span className="absolute bottom-1 left-0 w-full h-3.5 bg-[#d0ff5a]/60 -z-10 rounded-sm" />
          </span>{" "}
          Globally
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-slate-600 text-base md:text-lg text-center max-w-2xl mb-16 leading-relaxed font-light"
        >
          1 in 4 adults will suffer a stroke in their lifetime. Behind the staggering clinical numbers lies a critical truth: the vast majority are preventable through early biomarker intelligence.
        </motion.p>

        {/* Asymmetric Bento Data Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">

          {/* ── CARD 1: 15 Million Cases (The Human Toll) ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#d0ff5a]/30 border border-[#d0ff5a] flex items-center justify-center text-slate-900">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">Epidemic Scale</span>
                    <span className="text-[11px] text-slate-500">World Health Organization (WHO) Data</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#d0ff5a]/25 text-slate-900 border border-[#d0ff5a]/50">
                  Annual Impact
                </span>
              </div>

              {/* Big Metric Display */}
              <div className="mb-6">
                <div className="text-5xl md:text-7xl font-light tracking-tight text-slate-900 mb-2 flex items-baseline gap-2">
                  15,000,000<span className="text-2xl md:text-3xl font-bold text-slate-900">+</span>
                </div>
                <p className="text-sm md:text-base text-slate-600 font-light leading-relaxed">
                  People suffer an acute cerebrovascular accident each year worldwide.
                </p>
              </div>

              {/* Data Distribution Spectrum */}
              <div className="space-y-3 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                  <span>Global Patient Outcomes</span>
                  <span className="text-slate-500">Equal Tri-Split (33% each)</span>
                </div>

                {/* Progress segmented bar */}
                <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-200/70 gap-1 p-0.5">
                  <div className="h-full rounded-full bg-slate-800 w-1/3 transition-all duration-1000" title="5M Fatalities" />
                  <div className="h-full rounded-full bg-slate-400 w-1/3 transition-all duration-1000" title="5M Disabled" />
                  <div className="h-full rounded-full bg-[#d0ff5a] w-1/3 transition-all duration-1000" title="5M Recovered" />
                </div>

                {/* Legend items */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 shrink-0" />
                    <span className="text-slate-700 font-medium">5M Died</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0" />
                    <span className="text-slate-700 font-medium">5M Disabled</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#d0ff5a] border border-black/10 shrink-0" />
                    <span className="text-slate-800 font-bold">5M Recovered</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-700" />
                One stroke event every 40 seconds
              </span>
              <span className="text-slate-400 hidden sm:inline">Global Burden of Disease</span>
            </div>
          </motion.div>


          {/* ── CARD 2: Hidden Risk Factors (The Asymptomatic Trap) ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#d0ff5a]/30 border border-[#d0ff5a] flex items-center justify-center text-slate-900">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">Clinical Reality</span>
                    <span className="text-[11px] text-slate-500">Asymptomatic Progression</span>
                  </div>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-[#d0ff5a] border border-black/10 shadow-[0_0_8px_rgba(208,255,90,0.8)]" />
              </div>

              <h3 className="text-2xl md:text-3xl font-medium text-slate-900 mb-3">
                Hidden Risk Factors
              </h3>

              <p className="text-sm text-slate-600 font-light leading-relaxed mb-6">
                Most strokes strike without warning. Asymptomatic clinical biomarkers compound silently until an acute threshold is breached.
              </p>

              {/* Biomarker Telemetry Pills */}
              <div className="space-y-3 mb-6">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <HeartPulse className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-xs font-medium text-slate-900">Silent Hypertension</div>
                      <div className="text-[10px] text-slate-500">Vascular damage with zero pain</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d0ff5a]/30 text-slate-900 border border-[#d0ff5a]/60">
                    4× Risk
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-xs font-medium text-slate-900">Elevated Glucose Spikes</div>
                      <div className="text-[10px] text-slate-500">Accelerates endothelial stiffness</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d0ff5a]/30 text-slate-900 border border-[#d0ff5a]/60">
                    High Impact
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="w-4 h-4 text-slate-700" />
                    <div>
                      <div className="text-xs font-medium text-slate-900">Age × BMI Synergies</div>
                      <div className="text-[10px] text-slate-500">Non-linear exponential curve</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#d0ff5a]/30 text-slate-900 border border-[#d0ff5a]/60">
                    Multi-Factor
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-[11px] text-slate-600">Requires multidimensional pattern recognition</span>
              <span className="text-[11px] font-mono text-slate-400">11 Features</span>
            </div>
          </motion.div>

        </div>


        {/* ── CARD 3: 80% Are Preventable (The Algorithmic Turning Point) ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="w-full bg-white border border-slate-200/80 rounded-[2.5rem] p-8 md:p-12 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">

            {/* Left Big Highlight */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d0ff5a]/30 border border-[#d0ff5a]/60 text-slate-900 text-xs font-bold w-fit mb-6">
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                The Clinical Breakthrough
              </div>

              <div className="flex items-baseline gap-4 mb-4 flex-wrap">
                <span className="text-6xl md:text-8xl font-light tracking-tight text-slate-900">
                  80<span className="font-bold text-slate-900">%</span>
                </span>
                <span className="text-2xl md:text-3xl font-light text-slate-700">
                  Are Clinically Preventable
                </span>
              </div>

              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-light max-w-2xl mb-8">
                Prevention is not chance — it is computation. Deep Learning architectures like <strong className="text-slate-900 font-medium">Vena</strong> resolve complex non-linear correlations between clinical biomarkers, providing physicians and individuals with an early window of opportunity to intervene before irreversible damage occurs.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#assessment"
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#d0ff5a] hover:bg-[#bceb4a] text-black font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-md"
                >
                  <span>Test Your Stroke Risk Score</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </a>

                <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-800" />
                  Instant ML Evaluation · Zero Sign-Up Required
                </span>
              </div>
            </div>

            {/* Right Pillars List */}
            <div className="lg:col-span-5 grid grid-cols-1 gap-3.5">

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/70 transition-all">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#d0ff5a]/30 border border-[#d0ff5a]/40 flex items-center justify-center text-slate-900">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">Sub-50ms Inference</h4>
                </div>
                <p className="text-xs text-slate-600 pl-10 leading-relaxed">
                  Real-time PyTorch MLP inference deployed via FastAPI for instantaneous risk stratification.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/70 transition-all">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#d0ff5a]/30 border border-[#d0ff5a]/40 flex items-center justify-center text-slate-900">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">SHAP Explainable AI</h4>
                </div>
                <p className="text-xs text-slate-600 pl-10 leading-relaxed">
                  Every probability is paired with a mathematical "Doctor's Report" explaining the contributing risk factors.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-slate-100/70 transition-all">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-7 h-7 rounded-lg bg-[#d0ff5a]/30 border border-[#d0ff5a]/40 flex items-center justify-center text-slate-900">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">Imbalanced Class Weighting</h4>
                </div>
                <p className="text-xs text-slate-600 pl-10 leading-relaxed">
                  Engineered with weighted BCE loss to counter the steep 19:1 clinical class disparity without sacrificing recall.
                </p>
              </div>

            </div>

          </div>
        </motion.div>

        {/* Global Reality Ticker Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 w-full grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-slate-200/80 text-center"
        >
          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-light text-slate-900 mb-1">Every 40 Sec</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">A Stroke Occurs Globally</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-light text-slate-900 mb-1">1.9 Million</span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Neurons Lost Per Minute</span>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-2xl md:text-3xl font-light text-slate-900 mb-1 flex items-center gap-2">
              &lt; 50 ms
              <span className="w-2 h-2 rounded-full bg-[#d0ff5a] border border-black/20" />
            </span>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">Vena Analysis Latency</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
