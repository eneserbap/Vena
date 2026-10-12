"""Vena — Live Prometheus Telemetry Dashboard (dashboard.py).

Renders a rich, interactive HTML/JS dashboard that scrapes `/metrics`
in real-time and visualizes memory, latency, request counts, and GC stats.
"""

def get_dashboard_html() -> str:
    """Returns the full HTML string for the live monitoring dashboard."""
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vena // MLOps Live Telemetry Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    body {
      font-family: 'Plus Jakarta Sans', sans-serif;
      background-color: #080b11;
      color: #f1f5f9;
    }
    .mono { font-family: 'JetBrains Mono', monospace; }
    .neon-border { border-color: rgba(208, 255, 90, 0.25); }
    .neon-glow { box-shadow: 0 0 25px rgba(208, 255, 90, 0.12); }
    .glass-card {
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .glass-card:hover {
      border-color: rgba(208, 255, 90, 0.3);
    }
    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.6; }
    }
    .pulse-dot { animation: pulse-dot 2s infinite ease-in-out; }
  </style>
</head>
<body class="min-h-screen p-4 md:p-8 flex flex-col justify-between">
  <div class="max-w-7xl mx-auto w-full">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 rounded-xl bg-[#d0ff5a]/10 border border-[#d0ff5a]/30 flex items-center justify-center text-[#d0ff5a] font-bold text-xl neon-glow">
          V
        </div>
        <div>
          <div class="flex items-center gap-2.5">
            <h1 class="text-2xl font-extrabold tracking-tight text-white">VENA // Telemetry Engine</h1>
            <span class="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider rounded bg-[#d0ff5a]/15 text-[#d0ff5a] border border-[#d0ff5a]/30">
              Live Monitor
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">Real-time MLOps inference observability powered natively by <span class="mono text-slate-300">/metrics</span></p>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-3">
        <!-- Live Badge -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <span class="w-2.5 h-2.5 rounded-full bg-[#d0ff5a] pulse-dot"></span>
          <span class="text-slate-300 font-medium">Scraping: <span class="mono text-[#d0ff5a]">/metrics</span></span>
          <span id="lastScrape" class="mono text-slate-500 text-[10px]">--:--:--</span>
        </div>

        <!-- Quick Actions -->
        <button id="testInferenceBtn" onclick="runTestInference()" class="px-3.5 py-1.5 rounded-lg bg-[#d0ff5a] hover:bg-[#bcf243] text-black font-bold text-xs flex items-center gap-1.5 transition shadow-sm cursor-pointer">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          Simulate Predict
        </button>
        <a href="/metrics" target="_blank" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1">
          Raw /metrics
          <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
        <a href="/docs" target="_blank" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1">
          API Docs
          <svg class="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
        </a>
      </div>
    </header>

    <!-- Notification Toast -->
    <div id="toast" class="hidden my-3 px-4 py-2.5 rounded-lg bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between transition">
      <span id="toastMsg">Inference test request completed!</span>
      <button onclick="document.getElementById('toast').classList.add('hidden')" class="text-emerald-400 hover:text-white">&times;</button>
    </div>

    <!-- Key Metrics Bento Grid -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <!-- RAM Card -->
      <div class="glass-card rounded-2xl p-5 transition">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Resident RAM (RSS)</span>
          <span class="mono px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">process_resident</span>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span id="ramValue" class="text-3xl font-extrabold text-white mono">--</span>
          <span class="text-xs text-slate-400">MB</span>
        </div>
        <div class="mt-3 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div id="ramBar" class="bg-[#d0ff5a] h-1.5 rounded-full transition-all duration-500" style="width: 0%"></div>
        </div>
        <p class="text-[11px] text-slate-500 mt-2 flex justify-between">
          <span>Render 512 MB Limit</span>
          <span id="ramPct" class="mono text-slate-400">0%</span>
        </p>
      </div>

      <!-- Requests Card -->
      <div class="glass-card rounded-2xl p-5 transition">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Total Requests</span>
          <span class="mono px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">http_requests_total</span>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span id="reqValue" class="text-3xl font-extrabold text-white mono">--</span>
          <span class="text-xs text-emerald-400 font-semibold" id="reqSuccessRate">100% OK</span>
        </div>
        <div class="mt-3 flex gap-2 text-[11px] text-slate-400">
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> 2xx: <b class="text-white mono" id="req2xx">0</b></span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span> 4xx: <b class="text-white mono" id="req4xx">0</b></span>
          <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-rose-500"></span> 5xx: <b class="text-white mono" id="req5xx">0</b></span>
        </div>
        <p class="text-[11px] text-slate-500 mt-2">Aggregated across all handlers</p>
      </div>

      <!-- Latency Card -->
      <div class="glass-card rounded-2xl p-5 transition">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>Avg Request Latency</span>
          <span class="mono px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">duration_seconds</span>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span id="latencyValue" class="text-3xl font-extrabold text-[#d0ff5a] mono">--</span>
          <span class="text-xs text-slate-400">ms</span>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <span class="text-[11px] text-slate-400">P95 Estimate:</span>
          <span id="p95Value" class="text-xs font-semibold text-white mono">-- ms</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-2">Measured with high-res Prometheus buckets</p>
      </div>

      <!-- CPU & Uptime Card -->
      <div class="glass-card rounded-2xl p-5 transition">
        <div class="flex items-center justify-between text-slate-400 text-xs font-medium">
          <span>CPU Time & Uptime</span>
          <span class="mono px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300">process_cpu</span>
        </div>
        <div class="mt-3 flex items-baseline gap-2">
          <span id="cpuValue" class="text-3xl font-extrabold text-white mono">--</span>
          <span class="text-xs text-slate-400">sec CPU</span>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <span class="text-[11px] text-slate-400">Process Uptime:</span>
          <span id="uptimeValue" class="text-xs font-semibold text-white mono">--</span>
        </div>
        <p class="text-[11px] text-slate-500 mt-2">CPython 3.11 Runtime Process</p>
      </div>
    </section>

    <!-- Visual Charts Section -->
    <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      <!-- Chart 1: Endpoint Traffic -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-sm font-bold text-white uppercase tracking-wider">Traffic by Endpoint & Status</h2>
            <p class="text-xs text-slate-400">Parsed dynamically from <span class="mono text-slate-300">http_requests_total</span></p>
          </div>
          <span class="w-3 h-3 rounded-full bg-[#d0ff5a]"></span>
        </div>
        <div class="h-64">
          <canvas id="endpointChart"></canvas>
        </div>
      </div>

      <!-- Chart 2: Latency Distribution -->
      <div class="glass-card rounded-2xl p-6">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h2 class="text-sm font-bold text-white uppercase tracking-wider">Request Latency Distribution</h2>
            <p class="text-xs text-slate-400">Parsed from <span class="mono text-slate-300">http_request_duration_highr_seconds_bucket</span></p>
          </div>
          <span class="w-3 h-3 rounded-full bg-sky-400"></span>
        </div>
        <div class="h-64">
          <canvas id="latencyChart"></canvas>
        </div>
      </div>
    </section>

    <!-- Live Metrics Feed Inspector -->
    <section class="glass-card rounded-2xl p-6 mt-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 class="text-sm font-bold text-white uppercase tracking-wider">Prometheus Metric Feed Inspector</h2>
          <p class="text-xs text-slate-400">Live feed verifying exact lines read from <span class="mono text-[#d0ff5a]">/metrics</span></p>
        </div>
        <div class="flex items-center gap-2">
          <input id="metricSearch" type="text" placeholder="Filter metrics (e.g. resident, http)..." oninput="filterMetricsFeed()" class="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-1.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#d0ff5a]">
          <button onclick="fetchAndRenderMetrics()" class="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 border border-slate-700 transition">
            ↻ Scrape Now
          </button>
        </div>
      </div>
      <div class="bg-[#05070a] rounded-xl p-4 border border-slate-800/80 max-h-56 overflow-y-auto mono text-[11px] text-slate-300 leading-relaxed" id="metricsRawContainer">
        <p class="text-slate-500">Connecting to /metrics stream...</p>
      </div>
    </section>
  </div>

  <!-- Footer -->
  <footer class="max-w-7xl mx-auto w-full mt-10 pt-4 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
    <p>Vena Stroke Prediction System &bull; Production Observability & Monitoring</p>
    <p class="mono text-[11px]">Prometheus Instrumentator v8.1.0 &bull; OpenMetrics Standard</p>
  </footer>

  <script>
    let endpointChart = null;
    let latencyChart = null;
    let latestMetricsLines = [];

    // Parse OpenMetrics / Prometheus plaintext format into structured JS objects
    function parsePrometheusText(text) {
      const lines = text.split('\\n');
      const metrics = [];
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const match = trimmed.match(/^([a-zA-Z_:][a-zA-Z0-9_:]*)(?:\\{([^}]*)\\})?\\s+([^\\s]+)/);
        if (match) {
          const name = match[1];
          const rawLabels = match[2] || '';
          const value = parseFloat(match[3]);
          const labels = {};
          if (rawLabels) {
            const labelRegex = /([a-zA-Z_][a-zA-Z0-9_]*)="([^"]*)"/g;
            let m;
            while ((m = labelRegex.exec(rawLabels)) !== null) {
              labels[m[1]] = m[2];
            }
          }
          metrics.push({ name, labels, value, raw: trimmed });
        }
      }
      return { lines, metrics };
    }

    function initCharts() {
      // 1. Endpoint Traffic Chart
      const ctx1 = document.getElementById('endpointChart').getContext('2d');
      endpointChart = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['/predict', '/', '/metrics', '/docs', 'other'],
          datasets: [
            {
              label: '2xx Success',
              data: [0, 0, 0, 0, 0],
              backgroundColor: '#22c55e',
              borderRadius: 6
            },
            {
              label: '4xx / 5xx Errors',
              data: [0, 0, 0, 0, 0],
              backgroundColor: '#f43f5e',
              borderRadius: 6
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          scales: {
            x: { ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }, grid: { display: false } },
            y: { ticks: { color: '#64748b', precision: 0 }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });

      // 2. Latency Histogram
      const ctx2 = document.getElementById('latencyChart').getContext('2d');
      latencyChart = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['< 10ms', '< 50ms', '< 100ms', '< 250ms', '< 500ms', '< 1s', '> 1s'],
          datasets: [{
            label: 'Request Count',
            data: [0, 0, 0, 0, 0, 0, 0],
            backgroundColor: '#d0ff5a',
            borderRadius: 6
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          scales: {
            x: { ticks: { color: '#64748b', font: { family: 'JetBrains Mono', size: 10 } }, grid: { display: false } },
            y: { ticks: { color: '#64748b', precision: 0 }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }

    async function fetchAndRenderMetrics() {
      try {
        const res = await fetch('/metrics');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const text = await res.text();
        const { lines, metrics } = parsePrometheusText(text);
        latestMetricsLines = lines;

        // Timestamp
        const now = new Date();
        document.getElementById('lastScrape').textContent = now.toLocaleTimeString();

        // 1. RAM: process_resident_memory_bytes
        const ramMetric = metrics.find(m => m.name === 'process_resident_memory_bytes');
        if (ramMetric) {
          const mb = (ramMetric.value / (1024 * 1024)).toFixed(1);
          document.getElementById('ramValue').textContent = mb;
          const pct = Math.min(100, Math.round((mb / 512) * 100));
          document.getElementById('ramBar').style.width = pct + '%';
          document.getElementById('ramPct').textContent = pct + '%';
        }

        // 2. HTTP Requests: http_requests_total
        const reqMetrics = metrics.filter(m => m.name === 'http_requests_total');
        let totalReqs = 0;
        let count2xx = 0;
        let count4xx = 0;
        let count5xx = 0;
        const handlerCounts = {
          '/predict': { ok: 0, err: 0 },
          '/': { ok: 0, err: 0 },
          '/metrics': { ok: 0, err: 0 },
          '/docs': { ok: 0, err: 0 },
          'other': { ok: 0, err: 0 }
        };

        for (const m of reqMetrics) {
          totalReqs += m.value;
          const status = m.labels.status || '';
          const handler = m.labels.handler || 'other';
          const targetKey = ['/predict', '/', '/metrics', '/docs'].includes(handler) ? handler : 'other';

          if (status.startsWith('2')) {
            count2xx += m.value;
            handlerCounts[targetKey].ok += m.value;
          } else if (status.startsWith('4')) {
            count4xx += m.value;
            handlerCounts[targetKey].err += m.value;
          } else if (status.startsWith('5')) {
            count5xx += m.value;
            handlerCounts[targetKey].err += m.value;
          } else {
            count2xx += m.value;
            handlerCounts[targetKey].ok += m.value;
          }
        }

        document.getElementById('reqValue').textContent = totalReqs;
        document.getElementById('req2xx').textContent = count2xx;
        document.getElementById('req4xx').textContent = count4xx;
        document.getElementById('req5xx').textContent = count5xx;

        const successRate = totalReqs > 0 ? Math.round((count2xx / totalReqs) * 100) : 100;
        document.getElementById('reqSuccessRate').textContent = successRate + '% OK';

        // Update Endpoint Chart
        if (endpointChart) {
          endpointChart.data.datasets[0].data = [
            handlerCounts['/predict'].ok,
            handlerCounts['/'].ok,
            handlerCounts['/metrics'].ok,
            handlerCounts['/docs'].ok,
            handlerCounts['other'].ok
          ];
          endpointChart.data.datasets[1].data = [
            handlerCounts['/predict'].err,
            handlerCounts['/'].err,
            handlerCounts['/metrics'].err,
            handlerCounts['/docs'].err,
            handlerCounts['other'].err
          ];
          endpointChart.update();
        }

        // 3. Latency: http_request_duration_seconds_sum & _count
        const latSum = metrics.find(m => m.name === 'http_request_duration_seconds_sum' || m.name === 'http_request_duration_highr_seconds_sum');
        const latCount = metrics.find(m => m.name === 'http_request_duration_seconds_count' || m.name === 'http_request_duration_highr_seconds_count');
        if (latSum && latCount && latCount.value > 0) {
          const avgMs = ((latSum.value / latCount.value) * 1000).toFixed(1);
          document.getElementById('latencyValue').textContent = avgMs;
        }

        // Latency Histogram Buckets
        const buckets = metrics.filter(m => m.name === 'http_request_duration_highr_seconds_bucket');
        if (buckets.length > 0 && latencyChart) {
          const getVal = (le) => {
            const found = buckets.find(b => b.labels.le === le);
            return found ? found.value : 0;
          };
          const b10 = getVal('0.01');
          const b50 = Math.max(0, getVal('0.05') - b10);
          const b100 = Math.max(0, getVal('0.1') - getVal('0.05'));
          const b250 = Math.max(0, getVal('0.25') - getVal('0.1'));
          const b500 = Math.max(0, getVal('0.5') - getVal('0.25'));
          const b1000 = Math.max(0, getVal('1.0') - getVal('0.5'));
          const bInf = Math.max(0, getVal('+Inf') - getVal('1.0'));

          latencyChart.data.datasets[0].data = [b10, b50, b100, b250, b500, b1000, bInf];
          latencyChart.update();

          const p95Estimate = getVal('0.1') > 0 ? '< 100 ms' : '< 500 ms';
          document.getElementById('p95Value').textContent = p95Estimate;
        }

        // 4. CPU & Uptime
        const cpuMetric = metrics.find(m => m.name === 'process_cpu_seconds_total');
        if (cpuMetric) {
          document.getElementById('cpuValue').textContent = cpuMetric.value.toFixed(1);
        }
        const startMetric = metrics.find(m => m.name === 'process_start_time_seconds');
        if (startMetric) {
          const diffSec = Math.floor(Date.now() / 1000 - startMetric.value);
          const mins = Math.floor(diffSec / 60);
          const secs = diffSec % 60;
          document.getElementById('uptimeValue').textContent = `${mins}m ${secs}s`;
        }

        filterMetricsFeed();
      } catch (err) {
        console.warn('Scrape failed:', err);
      }
    }

    function filterMetricsFeed() {
      const q = (document.getElementById('metricSearch').value || '').toLowerCase();
      const container = document.getElementById('metricsRawContainer');
      const filtered = latestMetricsLines
        .filter(l => l.trim() && !l.startsWith('#'))
        .filter(l => !q || l.toLowerCase().includes(q))
        .slice(0, 30);

      if (filtered.length === 0) {
        container.innerHTML = '<p class="text-slate-500">No matching metrics found.</p>';
      } else {
        container.innerHTML = filtered
          .map(l => `<div class="py-0.5 border-b border-slate-900 hover:text-white transition"><span class="text-emerald-400">&gt;</span> ${escapeHtml(l)}</div>`)
          .join('');
      }
    }

    function escapeHtml(str) {
      return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    async function runTestInference() {
      const btn = document.getElementById('testInferenceBtn');
      btn.disabled = true;
      btn.innerHTML = 'Testing...';
      try {
        const payload = {
          gender: "Male",
          age: 67.0,
          hypertension: 0,
          heart_disease: 1,
          Residence_type: "Urban",
          avg_glucose_level: 228.69,
          bmi: 36.6,
          smoking_status: "formerly smoked"
        };
        const res = await fetch('/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        toastMsg.textContent = `Inference completed! Predicted Risk: ${data.stroke_risk_percentage}% (High Risk: ${data.is_high_risk})`;
        toast.classList.remove('hidden');
        await fetchAndRenderMetrics();
      } catch (err) {
        alert('Test inference error: ' + err.message);
      } finally {
        btn.disabled = false;
        btn.innerHTML = `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Simulate Predict`;
      }
    }

    window.addEventListener('DOMContentLoaded', () => {
      initCharts();
      fetchAndRenderMetrics();
      // Scrape every 3 seconds
      setInterval(fetchAndRenderMetrics, 3000);
    });
  </script>
</body>
</html>"""
