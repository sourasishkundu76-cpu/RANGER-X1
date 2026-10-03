import React, { useState, useEffect, useRef } from 'react';
import { useRanger } from '../context/RangerContext';

export const LiveSensorMonitor: React.FC = () => {
  const { distanceCm, setDistanceCm } = useRanger();
  const [selectedTopologyNode, setSelectedTopologyNode] = useState<'hcsr04' | 'pir' | 'mpu' | 'dht'>('hcsr04');

  // Animated Waveform reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const waveTickRef = useRef<number>(0);

  // Derive status from distance
  const isAlert = distanceCm < 40;
  const isCaution = distanceCm >= 40 && distanceCm <= 80;
  const isNormal = distanceCm > 80;

  const timeOfFlight = ((distanceCm * 2) / 34.3).toFixed(2);

  // Animate dynamic waveform
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      waveTickRef.current += isAlert ? 0.22 : isCaution ? 0.14 : 0.08;
      const width = canvas.width;
      const height = canvas.height;
      const midY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Grid background
      ctx.strokeStyle = 'rgba(137, 206, 255, 0.07)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 16) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 16) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      const freq = isAlert ? 0.16 : isCaution ? 0.08 : 0.04;
      const amp = isAlert ? 45 : isCaution ? 30 : 18;
      const strokeColor = isAlert ? '#ef4444' : isCaution ? '#00eefc' : '#89ceff';
      const fillColor = isAlert ? 'rgba(239, 68, 68, 0.12)' : isCaution ? 'rgba(0, 238, 252, 0.1)' : 'rgba(137, 206, 255, 0.08)';

      ctx.beginPath();
      ctx.moveTo(0, midY);

      for (let x = 0; x <= width; x += 6) {
        const noise = Math.sin(x * 0.02 + waveTickRef.current * 2) * 2;
        const y = midY + Math.sin(x * freq + waveTickRef.current) * amp + noise;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Fill area under curve
      ctx.lineTo(width, height);
      ctx.lineTo(0, height);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [isAlert, isCaution]);

  return (
    <div className="flex flex-col w-full gap-space-lg">
      {/* Top Banner & Quick Presets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-low/80 backdrop-blur-xl p-space-lg rounded-xl border border-[#242a3a] shadow-xl">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-space-sm py-0.5 rounded bg-surface-container-highest text-primary font-label-caps text-label-caps uppercase">
              Telemetry Engine v3.4
            </span>
            <span className="px-space-sm py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-caps text-label-caps uppercase flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
              DEMONSTRATION DATA / REAL-TIME SIMULATION ENGINE
            </span>
            <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-mono">
              NODE: RX-FIELD-092A
            </span>
          </div>
          <div className="flex items-baseline gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Live Sensor &amp; Telemetry Matrix
            </h1>
            <span className="font-label-caps text-label-caps text-secondary-fixed-dim uppercase hidden md:inline">
              Synchronized 100Hz Bus
            </span>
          </div>
        </div>

        {/* Quick Presets Buttons */}
        <div className="flex items-center gap-space-sm bg-surface-container-lowest/80 p-space-xs rounded-lg border border-[#242a3a] shadow-inner">
          <span className="font-label-caps text-label-caps text-on-surface-variant px-space-sm uppercase hidden sm:inline">
            Quick Presets:
          </span>
          <button
            onClick={() => setDistanceCm(124)}
            className={`px-space-md py-1.5 rounded-md font-headline-md text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 shadow-md ${
              isNormal
                ? 'bg-primary-container text-on-primary-container ring-1 ring-primary'
                : 'bg-surface-container-highest text-on-surface hover:text-primary'
            }`}
          >
            NORMAL (124cm)
          </button>
          <button
            onClick={() => setDistanceCm(65)}
            className={`px-space-md py-1.5 rounded-md font-headline-md text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 ${
              isCaution
                ? 'bg-secondary-container text-on-secondary-container ring-1 ring-secondary'
                : 'bg-surface-container-highest text-on-surface hover:text-secondary'
            }`}
          >
            CAUTION (65cm)
          </button>
          <button
            onClick={() => setDistanceCm(28)}
            className={`px-space-md py-1.5 rounded-md font-headline-md text-xs font-semibold tracking-wider transition-all hover:scale-105 active:scale-95 ${
              isAlert
                ? 'bg-error text-on-error ring-1 ring-error'
                : 'bg-surface-container-highest text-on-surface hover:text-error'
            }`}
          >
            ALERT (&lt;30cm)
          </button>
        </div>
      </div>

      {/* Main Status Halo & Primary Sensor Array */}
      <div className="relative rounded-2xl bg-surface-container-low border border-[#242a3a] p-space-lg shadow-xl overflow-hidden transition-all duration-300">
        {/* Dynamic ambient glow */}
        <div
          className={`absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-500 ${
            isAlert
              ? 'bg-error-container/40'
              : isCaution
              ? 'bg-secondary-container/20'
              : 'bg-primary/10'
          }`}
        />

        {/* Top Hazard Pulse Bar */}
        <div
          className={`absolute top-0 left-0 right-0 transition-all duration-300 ${
            isAlert
              ? 'h-2 bg-error animate-pulse'
              : isCaution
              ? 'h-1.5 bg-secondary-container animate-pulse'
              : 'h-1 bg-primary'
          }`}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg relative z-10">
          {/* Card 1: HC-SR04 Proximity Radar & Slider (4 cols) */}
          <div className="lg:col-span-4 flex flex-col justify-between bg-surface-container/90 border border-[#242a3a] rounded-xl p-space-lg shadow-md">
            <div className="flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isAlert ? 'text-error' : isCaution ? 'text-secondary-fixed-dim' : 'text-primary'
                  }`}
                >
                  radar
                </span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  HC-SR04 Transceiver
                </span>
              </div>
              <div
                className={`px-space-sm py-0.5 rounded text-xs font-telemetry-sm ${
                  isAlert
                    ? 'text-error bg-error-container/40 animate-ping'
                    : isCaution
                    ? 'text-secondary-fixed-dim bg-secondary-container/20 animate-pulse'
                    : 'text-tertiary bg-tertiary-container/20'
                }`}
              >
                {isAlert ? 'CRITICAL ALERT' : isCaution ? 'PROXIMITY WARNING' : 'NORMAL LINK'}
              </div>
            </div>

            <div className="my-space-md flex flex-col items-center justify-center text-center">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mb-1">
                PROXIMITY RADAR READOUT
              </span>
              <div className="flex items-baseline gap-space-xs">
                <span
                  className={`font-display-lg text-display-lg font-bold tracking-tighter ${
                    isAlert ? 'text-error' : isCaution ? 'text-secondary' : 'text-primary'
                  }`}
                >
                  {distanceCm}
                </span>
                <span className="font-headline-md text-headline-md text-on-surface-variant">cm</span>
              </div>
              <p
                className={`font-body-md text-body-md mt-1 ${
                  isAlert
                    ? 'text-error font-bold'
                    : isCaution
                    ? 'text-secondary-fixed-dim font-medium'
                    : 'text-secondary'
                }`}
              >
                {isAlert
                  ? 'COLLISION IMMINENT — IMMEDIATE EVASION'
                  : isCaution
                  ? 'Standoff Closing — Prepare Deflection Vector'
                  : 'Perimeter Clear — Nominal Operational Buffer'}
              </p>
            </div>

            {/* Slider control */}
            <div className="space-y-space-sm bg-surface-container-lowest/60 border border-[#242a3a] p-space-md rounded-lg">
              <div className="flex justify-between items-center text-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Interactive Proximity Slider
                </span>
                <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold">
                  {distanceCm} cm
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                value={distanceCm}
                onChange={(e) => setDistanceCm(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant font-telemetry-sm">
                <span className="text-error">CRITICAL (10cm)</span>
                <span className="text-secondary-fixed-dim">WARNING (65cm)</span>
                <span className="text-tertiary">SAFE (250cm)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Dynamic Ultrasonic Waveform (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-surface-container/90 border border-[#242a3a] rounded-xl p-space-lg shadow-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-secondary">show_chart</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Dynamic Ultrasonic Waveform
                </span>
              </div>
              <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-mono">
                40 kHz Burst Echo
              </span>
            </div>

            {/* Waveform Canvas */}
            <div className="w-full h-44 relative flex items-center justify-center my-space-sm bg-surface-container-lowest/90 border border-[#242a3a] rounded-lg overflow-hidden p-2">
              <canvas
                ref={canvasRef}
                width={480}
                height={160}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute bottom-2 right-3 font-telemetry-sm text-xs px-2 py-0.5 rounded border border-[#242a3a] ${
                  isAlert
                    ? 'text-error bg-error-container/40'
                    : isCaution
                    ? 'text-secondary-fixed-dim bg-secondary-container/20'
                    : 'text-on-surface-variant bg-surface-container-low/80'
                }`}
              >
                {isAlert
                  ? 'BUZZER: CONTINUOUS 4.8 kHz ALARM'
                  : isCaution
                  ? 'BUZZER: PULSE 2.4 kHz [INTERMITTENT]'
                  : 'BUZZER: SILENT (0 Hz)'}
              </div>
            </div>

            {/* Waveform Stats Grid */}
            <div className="grid grid-cols-3 gap-space-sm text-center">
              <div className="bg-surface-container-low/70 border border-[#242a3a]/60 p-space-sm rounded">
                <span className="font-label-caps text-label-caps text-on-surface-variant block">SPEED OF SOUND</span>
                <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-semibold">343.2 m/s</span>
              </div>
              <div className="bg-surface-container-low/70 border border-[#242a3a]/60 p-space-sm rounded">
                <span className="font-label-caps text-label-caps text-on-surface-variant block">ECHO TIME-FLIGHT</span>
                <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold font-mono">
                  {timeOfFlight} ms
                </span>
              </div>
              <div className="bg-surface-container-low/70 border border-[#242a3a]/60 p-space-sm rounded">
                <span className="font-label-caps text-label-caps text-on-surface-variant block">CONFIDENCE</span>
                <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold">99.4%</span>
              </div>
            </div>
          </div>

          {/* Card 3: HUD Wrist OLED Reticle (3 cols) */}
          <div className="lg:col-span-3 flex flex-col justify-between bg-surface-container/90 border border-[#242a3a] rounded-xl p-space-lg shadow-md">
            <div className="flex items-center justify-between pb-space-sm">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                HUD Wrist OLED Reticle
              </span>
              <span className="material-symbols-outlined text-[18px] text-primary">watch</span>
            </div>

            <div
              className={`h-44 rounded-xl flex flex-col items-center justify-center p-space-md text-center transition-all duration-300 relative overflow-hidden shadow-inner border border-[#242a3a] ${
                isAlert
                  ? 'bg-error-container/30'
                  : isCaution
                  ? 'bg-surface-container-low'
                  : 'bg-surface-container-lowest'
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full border flex items-center justify-center relative transition-all duration-300 ${
                  isAlert
                    ? 'border-2 border-error animate-ping'
                    : isCaution
                    ? 'border-secondary-fixed-dim animate-spin'
                    : 'border-primary/40'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex flex-col items-center justify-center shadow-md ${
                    isAlert
                      ? 'bg-error text-on-error'
                      : isCaution
                      ? 'bg-secondary-container/25 text-secondary-fixed-dim'
                      : 'bg-primary/20 text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[28px]">
                    {isAlert ? 'dangerous' : isCaution ? 'warning' : 'shield'}
                  </span>
                </div>
                <div className={`absolute -top-1 w-2 h-2 rounded-full ${isAlert ? 'bg-error' : 'bg-primary'}`} />
                <div className={`absolute -bottom-1 w-2 h-2 rounded-full ${isAlert ? 'bg-error' : 'bg-primary'}`} />
              </div>

              <span
                className={`font-telemetry-sm text-telemetry-sm font-semibold tracking-wider mt-2 ${
                  isAlert ? 'text-error font-bold' : isCaution ? 'text-secondary-fixed-dim' : 'text-primary'
                }`}
              >
                {isAlert ? 'RETICLE HAZARD LOCK' : isCaution ? 'OBSTACLE BUFFER LOW' : 'SECTOR CLEAR'}
              </span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                {isAlert ? 'Haptic Engine: RAPID STROBE' : isCaution ? 'Haptic Engine: 20Hz TAP' : 'Haptic Engine: IDLE'}
              </span>
            </div>

            {/* PIR Dome Sensor Pill */}
            <div className="bg-surface-container-lowest/60 border border-[#242a3a] p-space-sm rounded-lg flex items-center justify-between mt-space-sm">
              <div className="flex items-center gap-space-xs">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isAlert ? 'bg-error animate-ping' : isCaution ? 'bg-secondary animate-pulse' : 'bg-tertiary'
                  }`}
                />
                <span className="font-label-caps text-label-caps text-on-surface">PIR DOME SENSOR</span>
              </div>
              <span
                className={`font-telemetry-sm text-telemetry-sm font-semibold uppercase ${
                  isAlert ? 'text-error font-bold' : isCaution ? 'text-secondary-fixed-dim animate-pulse' : 'text-tertiary'
                }`}
              >
                {isAlert ? 'TARGET BREACH' : isCaution ? 'OBJECT IN MOTION' : 'ARMED / IDLE'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics Bar (4 cols) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Metric 1: Ambient & Air DHT22 */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-md shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">thermostat</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Ambient &amp; Air
              </span>
            </div>
            <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-mono">DHT22</span>
          </div>
          <div className="flex items-baseline justify-between mt-space-sm">
            <div>
              <span className="font-telemetry-lg text-telemetry-lg text-on-surface font-bold">24.3</span>
              <span className="font-body-md text-body-md text-on-surface-variant ml-1">°C</span>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Humidity</span>
              <span className="font-telemetry-sm text-telemetry-sm text-primary font-semibold font-mono">68% RH</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-1 mt-space-sm">
            <div className="bg-primary h-1 rounded-full w-[48%]" />
          </div>
        </div>

        {/* Metric 2: Atmosphere & Air */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-md shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">compress</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Atmosphere &amp; Air
              </span>
            </div>
            <span className="font-label-caps text-label-caps text-tertiary bg-tertiary-container/20 px-1.5 py-0.5 rounded">
              AQI 22
            </span>
          </div>
          <div className="flex items-baseline justify-between mt-space-sm">
            <div>
              <span className="font-telemetry-lg text-telemetry-lg text-on-surface font-bold font-mono">1014</span>
              <span className="font-body-md text-body-md text-on-surface-variant ml-1">hPa</span>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Purity</span>
              <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-semibold">Pristine</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-1 mt-space-sm">
            <div className="bg-tertiary h-1 rounded-full w-[82%]" />
          </div>
        </div>

        {/* Metric 3: MCU Thermal */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-md shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-tertiary text-[20px]">device_thermostat</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                MCU Thermal
              </span>
            </div>
            <span className="font-label-caps text-label-caps text-tertiary uppercase">Normal (&lt;45°C)</span>
          </div>
          <div className="flex items-baseline justify-between mt-space-sm">
            <div>
              <span className="font-telemetry-lg text-telemetry-lg text-on-surface font-bold font-mono">31.4</span>
              <span className="font-body-md text-body-md text-on-surface-variant ml-1">°C</span>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Junction</span>
              <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-semibold">PASSIVE OK</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-1 mt-space-sm">
            <div className="bg-tertiary-fixed-dim h-1 rounded-full w-[35%]" />
          </div>
        </div>

        {/* Metric 4: Li-Po Cell Vitals */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-md shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[20px]">battery_charging_full</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                Li-Po Cell Vitals
              </span>
            </div>
            <span className="font-telemetry-sm text-telemetry-sm text-primary font-semibold font-mono">3.98 V</span>
          </div>
          <div className="flex items-baseline justify-between mt-space-sm">
            <div>
              <span className="font-telemetry-lg text-telemetry-lg text-on-surface font-bold font-mono">93</span>
              <span className="font-body-md text-body-md text-on-surface-variant ml-1">%</span>
            </div>
            <div className="text-right">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Discharge</span>
              <span className="font-telemetry-sm text-telemetry-sm text-secondary font-semibold font-mono">48 mA</span>
            </div>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-1 mt-space-sm">
            <div className="bg-primary h-1 rounded-full w-[93%]" />
          </div>
        </div>
      </div>

      {/* Integrated Topology & 60-Second Telemetry Rolling Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Topology Schematic (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-space-sm">
            <div>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Integrated Hardware Sensor Topology
              </h2>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Wearable Forearm Array Architecture
              </span>
            </div>
            <span className="px-space-sm py-0.5 rounded bg-surface-container-highest text-secondary font-label-caps text-label-caps uppercase">
              Schematic Mode
            </span>
          </div>

          {/* SVG Schematic Canvas */}
          <div className="relative w-full h-80 bg-surface-container-lowest/80 border border-[#242a3a] rounded-xl my-space-md p-space-md overflow-hidden flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 640 280">
              <defs>
                <radialGradient cx="15%" cy="50%" id="ultrasonicBeam" r="75%">
                  <stop offset="0%" stopColor="#89ceff" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#89ceff" stopOpacity="0" />
                </radialGradient>
                <radialGradient cx="50%" cy="85%" id="pirCone" r="65%">
                  <stop offset="0%" stopColor="#4edea3" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#4edea3" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Sonar Beam */}
              <path
                d="M 120 140 L 440 60 L 440 220 Z"
                fill={isAlert ? '#ef4444' : isCaution ? '#00dbe9' : 'url(#ultrasonicBeam)'}
                opacity={isAlert || isCaution ? 0.45 : 0.8}
                className="transition-all duration-300"
              />
              {/* PIR Cone */}
              <path d="M 320 220 L 220 50 L 420 50 Z" fill="url(#pirCone)" opacity="0.4" />

              {/* Arm Posture Bracelet Outline */}
              <rect
                x="220"
                y="90"
                width="200"
                height="110"
                rx="8"
                fill="#191f2f"
                stroke="#3e4850"
                strokeWidth="1.5"
              />
              <text x="320" y="112" fill="#88929b" fontFamily="Inter" fontSize="10" fontWeight="600" letterSpacing="1" textAnchor="middle">
                ARM POSTURE BRACELET
              </text>

              {/* Node HC-SR04 */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedTopologyNode('hcsr04')}
              >
                <rect
                  x="90"
                  y="120"
                  width="55"
                  height="40"
                  rx="4"
                  fill="#0ea5e9"
                  stroke={selectedTopologyNode === 'hcsr04' ? '#ffffff' : 'none'}
                  strokeWidth="2"
                />
                <circle cx="103" cy="140" r="8" fill="#080e1d" />
                <circle cx="132" cy="140" r="8" fill="#080e1d" />
                <text x="117" y="112" fill="#89ceff" fontFamily="Inter" fontSize="9" fontWeight="600" textAnchor="middle">
                  HC-SR04
                </text>
              </g>

              {/* Node PIR */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedTopologyNode('pir')}
              >
                <circle
                  cx="320"
                  cy="165"
                  r="14"
                  fill="#00b17b"
                  stroke={selectedTopologyNode === 'pir' ? '#ffffff' : 'none'}
                  strokeWidth="2"
                />
                <path d="M 314 165 Q 320 156 326 165 Q 320 174 314 165" fill="#080e1d" />
                <text x="320" y="195" fill="#4edea3" fontFamily="Inter" fontSize="9" fontWeight="600" textAnchor="middle">
                  PIR PYROSENSOR 110°
                </text>
              </g>

              {/* Node MPU6050 */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedTopologyNode('mpu')}
              >
                <rect
                  x="240"
                  y="130"
                  width="45"
                  height="30"
                  rx="4"
                  fill="#242a3a"
                  stroke={selectedTopologyNode === 'mpu' ? '#ffffff' : '#89ceff'}
                  strokeWidth="1.5"
                />
                <text x="262" y="148" fill="#dde2f8" fontFamily="Inter" fontSize="9" fontWeight="600" textAnchor="middle">
                  MPU6050
                </text>
                <text x="262" y="175" fill="#88929b" fontFamily="Geist" fontSize="8" textAnchor="middle">
                  6-AXIS GYRO
                </text>
              </g>

              {/* Node DHT22 */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedTopologyNode('dht')}
              >
                <rect
                  x="355"
                  y="130"
                  width="45"
                  height="30"
                  rx="4"
                  fill="#242a3a"
                  stroke={selectedTopologyNode === 'dht' ? '#ffffff' : '#4edea3'}
                  strokeWidth="1.5"
                />
                <text x="377" y="148" fill="#dde2f8" fontFamily="Inter" fontSize="9" fontWeight="600" textAnchor="middle">
                  DHT22
                </text>
                <text x="377" y="175" fill="#88929b" fontFamily="Geist" fontSize="8" textAnchor="middle">
                  TEMP/HUM
                </text>
              </g>

              {/* Connectors */}
              <line x1="145" y1="140" x2="220" y2="140" stroke="#89ceff" strokeDasharray="3 3" />
              <line x1="285" y1="145" x2="306" y2="165" stroke="#3e4850" />
              <line x1="334" y1="165" x2="355" y2="145" stroke="#3e4850" />

              {/* Annotations */}
              <text x="490" y="90" fill="#89ceff" fontFamily="Inter" fontSize="10" fontWeight="600">
                BEAM ANGLE: 15°
              </text>
              <text x="490" y="105" fill="#88929b" fontFamily="Geist" fontSize="9">
                Effective Range: 2cm - 400cm
              </text>
              <text x="490" y="180" fill="#4edea3" fontFamily="Inter" fontSize="10" fontWeight="600">
                PIR APERTURE: 110°
              </text>
              <text x="490" y="195" fill="#88929b" fontFamily="Geist" fontSize="9">
                Passive IR Motion Lock
              </text>
            </svg>
          </div>

          {/* Interactive Node Detail Card */}
          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded bg-primary-container/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">developer_board</span>
              </div>
              <div>
                <span className="font-headline-md text-headline-md text-on-surface text-sm font-semibold">
                  {selectedTopologyNode === 'hcsr04' && 'HC-SR04 Ultrasonic Sonar Node'}
                  {selectedTopologyNode === 'pir' && 'PIR Pyroelectric Passive Infrared Dome'}
                  {selectedTopologyNode === 'mpu' && 'MPU6050 6-Axis Motion Tracking I2C Node'}
                  {selectedTopologyNode === 'dht' && 'DHT22 Digital Temperature & Humidity Sensor'}
                </span>
                <p className="font-body-md text-body-md text-on-surface-variant text-xs">
                  {selectedTopologyNode === 'hcsr04' && 'Sends 8-cycle sonic burst at 40 kHz, listens for reflection return edge to determine obstacle standoff distance.'}
                  {selectedTopologyNode === 'pir' && 'Fresnel lens segment array detects differential IR heat radiation shifting across optical dual-element sensor.'}
                  {selectedTopologyNode === 'mpu' && 'Triple-axis MEMS accelerometer paired with gyroscope to detect operative fall events, arm deflection posture, and tremor.'}
                  {selectedTopologyNode === 'dht' && 'Capacitive humidity sensing element paired with negative temperature coefficient thermistor for environmental baseline.'}
                </p>
              </div>
            </div>
            <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-semibold">
              CALIBRATED
            </span>
          </div>
        </div>

        {/* 60-Second Telemetry Rolling Strip (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-space-sm">
            <div>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                60-Second Telemetry Rolling Strip
              </h2>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Proximity &amp; Motion Log
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
              <span className="font-telemetry-sm text-telemetry-sm text-primary font-semibold">LIVE</span>
            </div>
          </div>

          {/* Rolling Graph Box */}
          <div className="my-space-md bg-surface-container-lowest/90 border border-[#242a3a] rounded-xl p-space-md flex flex-col justify-between h-80">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-surface-container-highest">
              <span className="font-label-caps text-label-caps text-on-surface-variant">
                DISTANCE (CM) VS TIME (SEC)
              </span>
              <span className="font-telemetry-sm text-telemetry-sm text-secondary font-mono">
                T-MINUS 60s TO NOW
              </span>
            </div>

            <div className="relative w-full flex-1 flex items-end pt-4 pb-2">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full border-b border-primary" />
                <div className="w-full border-b border-primary" />
                <div className="w-full border-b border-primary" />
              </div>

              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 150">
                <polyline
                  fill="none"
                  points={`0,90 25,85 50,75 75,80 100,60 125,55 150,95 175,90 200,80 225,50 250,55 275,60 300,${Math.max(10, Math.min(130, 150 - distanceCm * 0.7))}`}
                  stroke={isAlert ? '#ef4444' : isCaution ? '#00eefc' : '#89ceff'}
                  strokeLinecap="round"
                  strokeWidth="2.5"
                />
                <circle
                  cx="300"
                  cy={Math.max(10, Math.min(130, 150 - distanceCm * 0.7))}
                  r="4"
                  fill="#00b17b"
                  className="animate-pulse"
                />
              </svg>
            </div>

            <div className="flex justify-between text-[11px] font-telemetry-sm text-on-surface-variant pt-2 border-t border-surface-container-highest">
              <span>-60s</span>
              <span>-45s</span>
              <span>-30s</span>
              <span>-15s</span>
              <span className="text-tertiary font-bold">0s (REALTIME)</span>
            </div>
          </div>

          {/* Bottom Indicators */}
          <div className="grid grid-cols-2 gap-space-sm">
            <div className="bg-surface-container border border-[#242a3a] p-space-sm rounded-lg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant">FALL DETECT (MPU)</span>
                <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold font-mono">
                  UPRIGHT (0.98G)
                </span>
              </div>
              <span className="material-symbols-outlined text-tertiary text-[20px]">accessibility_new</span>
            </div>
            <div className="bg-surface-container border border-[#242a3a] p-space-sm rounded-lg flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps text-on-surface-variant">PIR TRIGGER COUNT</span>
                <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-bold font-mono">
                  3 DETECTIONS / 10m
                </span>
              </div>
              <span className="material-symbols-outlined text-primary text-[20px]">motion_sensor_active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
