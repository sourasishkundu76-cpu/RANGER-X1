import React, { useState } from 'react';

interface ComponentSpec {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  iconColor: string;
  desc: string;
  v: string;
  rate: string;
  range: string;
  bus: string;
  rationale: string;
}

const HW_SPECS: Record<string, ComponentSpec> = {
  controller: {
    id: 'MOD-MCU-ESP32',
    title: 'Arduino / ESP32 Controller Hub',
    subtitle: 'Dual-Core 32-Bit Microcontroller System',
    icon: 'memory',
    iconColor: 'text-primary',
    desc: 'Acts as the central autonomic logic nucleus of RANGER-X. Polls environmental ultrasonic and PIR sensors at 50Hz, manages battery distribution states, and orchestrates haptic cue sequences.',
    v: '3.3V System Logic',
    rate: '50 Hz Polling Loop',
    range: 'Internal I/O Matrix',
    bus: 'SPI / I2C / UART / GPIO',
    rationale: 'Affordable, well-documented architecture for undergraduate engineers offering integrated Bluetooth LE for instant mobile node mesh pairing.',
  },
  ultrasonic: {
    id: 'MOD-US-01',
    title: 'Ultrasonic Sensor (Waterproof)',
    subtitle: 'JSN-SR04T Sealed Acoustic Transceiver',
    icon: 'hearing',
    iconColor: 'text-primary',
    desc: 'Emits 40kHz acoustic sonar waves with sealed piezoelectric transducer. Accurately gauges distances from 20mm up to 4000mm in dense wet scrub or rainfall without optic fogging, providing early alert of approaching fauna.',
    v: '3.3V – 5.0V DC',
    rate: '50 Hz Continuous',
    range: '2cm to 400cm',
    bus: 'GPIO Pulse / Echo Delay',
    rationale: 'Selected over infrared LIDAR due to moisture-heavy rainforest canopy reliability and sub-$4 academic budgetary constraints.',
  },
  pir: {
    id: 'MOD-PIR-505',
    title: 'PIR Motion Sensor (Pyroelectric)',
    subtitle: 'Miniature Passive Heat Signature Detector',
    icon: 'motion_photos_on',
    iconColor: 'text-tertiary',
    desc: 'Detects moving biological thermal signatures even through thick foliage. Filters background environmental thermal drift to avoid false alarms from windblown leaves.',
    v: '4.5V – 12V (Reg. 3.3V)',
    rate: '15 Hz Sensitivity Cycle',
    range: 'Up to 3.0m in field',
    bus: 'Digital High/Low Pin',
    rationale: 'Passive low-power consumption allows 24/7 background perimeter standby without draining battery reserves.',
  },
  oled: {
    id: 'MOD-DSP-096',
    title: 'Micro OLED Display (1.3")',
    subtitle: 'SH1106 High-Contrast Monochrome HUD',
    icon: 'screenshot_monitor',
    iconColor: 'text-secondary',
    desc: 'Renders crisp high-visibility telemetry in pitch-black nocturnal conditions without eye-fatiguing backlight bleed. Shows distance radar, digital compass heading, and battery reserves.',
    v: '3.3V Supply',
    rate: '60 FPS Refresh',
    range: 'Wide 160° Field of View',
    bus: 'I2C (Address 0x3C)',
    rationale: 'True black contrast prevents tactical light pollution that could startle skittish nocturnal wildlife.',
  },
  piezo: {
    id: 'MOD-BUZ-85',
    title: 'Piezo Acoustic Deterrence Buzzer',
    subtitle: 'Frequency-Agile Sound Generator',
    icon: 'volume_up',
    iconColor: 'text-secondary',
    desc: 'Produces frequency-modulated sweep alerts ranging from 2.5kHz up to 4kHz. Capable of generating non-lethal acoustic discomfort to discourage predator approach before physical contact occurs.',
    v: '3.0V – 5.0V DC',
    rate: 'Up to 4 kHz PWM Sweep',
    range: '85dB at 10cm Output',
    bus: 'PWM Output Channel',
    rationale: 'Harmless acoustic deterrence adheres to zero-injury wildlife intervention engineering design ethics.',
  },
  haptic: {
    id: 'MOD-ERM-10',
    title: 'Silent Haptic Vibration Motor',
    subtitle: 'Subtle Tactile Warning Disc',
    icon: 'vibration',
    iconColor: 'text-tertiary',
    desc: 'Provides variable frequency wrist vibrations. Alerts the ranger to proximity spikes or blind-spot movements completely silently, allowing stealth reconnaissance without alerting animal targets.',
    v: '2.5V – 3.7V Direct',
    rate: '12,000 RPM Max',
    range: 'Direct Wrist Coupling',
    bus: 'Transistor Switched GPIO',
    rationale: 'Ensures the human operator maintains situational awareness even under high ambient auditory storm noise.',
  },
  servo: {
    id: 'MOD-SRV-9G',
    title: 'Micro Servo Motor Mechanism',
    subtitle: 'MG90S Metal-Gear Actuation Arm',
    icon: 'precision_manufacturing',
    iconColor: 'text-primary',
    desc: 'High-torque digital micro servo engineered to mechanically trigger modular rescue payloads (e.g., non-harmful net release, repellent mist, or beacon deployment) on tactile command.',
    v: '4.8V – 6.0V (Boosted)',
    rate: '0.10s / 60 degrees',
    range: '180° Angular Sweep',
    bus: 'Standard 50Hz PWM Servo Pin',
    rationale: 'Metal internal gears resist jamming caused by fine grit, dust, and outdoor trail vibrations.',
  },
  battery: {
    id: 'MOD-PWR-650',
    title: 'LiPo 3.7V Power Cell & Management',
    subtitle: 'Lithium Polymer Reversible Cell',
    icon: 'battery_saver',
    iconColor: 'text-tertiary',
    desc: 'Provides autonomous wrist-mounted operation for up to 14 hours on intermittent eco-mode. Features magnetic pogo-pin rapid recharging contact points.',
    v: '3.7V Nominal (4.2V Peak)',
    rate: '650 mAh Capacity',
    range: '14 Hours Continuous',
    bus: 'I2C Fuel Gauge (MAX17043)',
    rationale: 'Ultra-thin pouch factor fits flat under the forearm ergonomically without restricting wrist flexion.',
  },
  trigger: {
    id: 'MOD-SW-EMG',
    title: 'Tactile Emergency Trigger Switch',
    subtitle: 'Sealed SOS Detent Thumb Actuator',
    icon: 'touch_app',
    iconColor: 'text-error',
    desc: 'Tactically positioned along the radial index-finger ridge. Features a physical 2.5N threshold spring detent to prevent unintended firing while remaining instantly accessible in distress situations.',
    v: '3.3V Pulled High',
    rate: 'Instantaneous Hardware Interrupt',
    range: 'Single-Action Detent',
    bus: 'Hardware Interrupt GPIO',
    rationale: 'Guarantees reliable SOS distress telemetry transmission even with gloved, wet, or muddy hands.',
  },
};

export const RangerXDevice: React.FC = () => {
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [isWireframe, setIsWireframe] = useState<boolean>(false);
  const [rotX, setRotX] = useState<number>(16);
  const [rotY, setRotY] = useState<number>(0);
  const [selectedHw, setSelectedHw] = useState<string>('ultrasonic');

  const currentSpec = HW_SPECS[selectedHw] || HW_SPECS.ultrasonic;

  const setPerspective = (type: 'isometric' | 'top' | 'side' | 'wrist') => {
    if (type === 'isometric') {
      setRotX(16);
      setRotY(25);
    } else if (type === 'top') {
      setRotX(75);
      setRotY(0);
    } else if (type === 'side') {
      setRotX(0);
      setRotY(90);
    } else if (type === 'wrist') {
      setRotX(35);
      setRotY(-45);
    }
  };

  const resetCamera = () => {
    setRotX(16);
    setRotY(0);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-10">
      {/* Top System Header Rail */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-xl p-space-md rounded-xl shadow-md">
        <div className="flex items-center gap-space-md">
          <div className="w-12 h-12 rounded-lg bg-surface-container-high border border-[#242a3a] flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[28px]">deployed_code</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                RANGER-X WRIST-HUD UNIT
              </span>
              <span className="px-space-xs py-0.5 rounded bg-tertiary/15 text-tertiary font-label-caps text-label-caps uppercase">
                CAD V2.4 PROTOTYPE
              </span>
              <span className="px-space-xs py-0.5 rounded bg-primary/10 text-primary font-label-caps text-label-caps uppercase">
                ACADEMIC SPEC
              </span>
            </div>
            <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-mono">
              MK-IV WEARABLE FAUNA RADAR &amp; ACTUATION TERMINAL // ASSEMBLED BOM ESTIMATE: $41.80
            </span>
          </div>
        </div>

        {/* Assembled / Exploded View Controls */}
        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="flex items-center bg-surface-container-highest/60 border border-[#242a3a] rounded-lg p-1">
            <button
              onClick={() => setIsExploded(false)}
              className={`px-space-md py-1.5 rounded font-headline-md text-body-md transition-all ${
                !isExploded
                  ? 'text-on-surface bg-surface-container shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Assembled
            </button>
            <button
              onClick={() => setIsExploded(true)}
              className={`px-space-md py-1.5 rounded font-headline-md text-body-md transition-all ${
                isExploded
                  ? 'text-on-surface bg-surface-container shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Exploded View (5 Layers)
            </button>
          </div>

          <button
            onClick={() => setIsWireframe(!isWireframe)}
            className={`flex items-center gap-space-xs px-space-md py-2 rounded-lg border border-[#242a3a] transition-all ${
              isWireframe
                ? 'bg-primary-container/20 text-primary border-primary'
                : 'bg-surface-container text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">schema</span>
            <span className="font-label-caps text-label-caps uppercase">Mesh Ghost</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Grid: CAD Viewer + Detail Inspector Drawer */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg">
        {/* Center Interactive CAD Stage (8 cols) */}
        <div className="xl:col-span-8 flex flex-col gap-space-md">
          <div className="relative w-full h-[620px] bg-surface-container-lowest border border-[#242a3a] rounded-xl overflow-hidden shadow-xl flex items-center justify-center select-none group">
            {/* Background Reticles & Vector Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="cadGrid2" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#89ceff" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cadGrid2)" />
                <circle cx="50%" cy="50%" r="220" fill="none" stroke="#0ea5e9" strokeDasharray="4 6" strokeWidth="1" />
                <circle cx="50%" cy="50%" r="140" fill="none" stroke="#00eefc" strokeDasharray="2 4" strokeWidth="0.75" />
                <line x1="50%" y1="20" x2="50%" y2="95%" stroke="#89ceff" strokeDasharray="3 3" strokeWidth="0.5" />
                <line x1="5%" y1="50%" x2="95%" y2="50%" stroke="#89ceff" strokeDasharray="3 3" strokeWidth="0.5" />
              </svg>
            </div>

            {/* Top-Left CAD Telemetry Pill */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1 bg-surface-container-low/90 border border-[#242a3a] backdrop-blur-md p-space-sm rounded-lg shadow-md pointer-events-none">
              <div className="flex items-center gap-space-xs font-label-caps text-label-caps text-on-surface-variant uppercase">
                <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
                RENDER STATE:{' '}
                <span className="text-primary font-telemetry-sm font-bold font-mono">
                  {isExploded ? '5-LAYER EXPLODED CAD' : 'SOLID ASSEMBLED'}
                </span>
              </div>
              <div className="font-telemetry-sm text-telemetry-sm text-on-surface-variant flex gap-space-md font-mono">
                <span>FOV: 55°</span>
                <span>
                  ROT: <span className="text-tertiary">{rotY % 360}°</span>
                </span>
                <span>SCALE: 1:1.2</span>
              </div>
            </div>

            {/* Exploded badge */}
            {isExploded && (
              <div className="absolute top-4 right-4 z-20 bg-primary-container/20 text-primary border border-primary/40 px-space-md py-1.5 rounded-lg font-telemetry-sm text-telemetry-sm shadow-md font-mono">
                ASSEMBLY EXPLOSION: 5 DISCRETE STACKS (+140mm)
              </div>
            )}

            {/* 3D Transform Stage Container */}
            <div
              className="relative w-full h-full flex items-center justify-center transition-all duration-700 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
              }}
            >
              <div className="relative w-[340px] h-[340px] flex items-center justify-center">
                {/* LAYER 1: Bezel & Sapphire Glass */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform: isExploded
                      ? 'translateY(-140px) translateZ(80px)'
                      : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  <div
                    className={`relative w-72 h-72 rounded-3xl bg-gradient-to-tr from-surface-container-high/90 via-surface-bright/70 to-surface-container-highest/90 shadow-2xl backdrop-blur-md flex items-center justify-center border border-[#242a3a] ${
                      isWireframe ? 'opacity-35' : ''
                    }`}
                  >
                    <div className="absolute inset-2 rounded-2xl bg-surface-container-lowest/80 flex items-center justify-center overflow-hidden border border-[#242a3a]">
                      <div className="absolute -top-24 -left-24 w-80 h-32 bg-white/5 rotate-45 pointer-events-none blur-sm" />
                      <div className="text-center font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest pointer-events-none">
                        Gorilla Glass 2.5D // AR Coated
                      </div>
                    </div>

                    {isExploded && (
                      <div className="absolute -right-36 top-6 bg-surface-container-high border border-[#242a3a] text-on-surface px-space-sm py-1 rounded font-label-caps text-label-caps shadow-lg whitespace-nowrap">
                        L1: Sapphire Bezel Rim
                      </div>
                    )}
                  </div>
                </div>

                {/* LAYER 2: Sensors, Display & Trigger Pin */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform: isExploded
                      ? 'translateY(-70px) translateZ(40px)'
                      : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  <div
                    className={`relative w-64 h-64 rounded-2xl bg-surface-container-high/70 border border-[#242a3a] shadow-xl flex flex-col items-center justify-between p-4 ${
                      isWireframe ? 'opacity-40' : ''
                    }`}
                  >
                    {/* Top Sensor Dual Eyes */}
                    <div className="w-full flex items-center justify-around pt-1">
                      {/* Hotspot 1: Ultrasonic */}
                      <button
                        onClick={() => setSelectedHw('ultrasonic')}
                        className={`group relative flex items-center justify-center w-12 h-12 rounded-full bg-surface-container-lowest text-primary shadow-[0_0_12px_rgba(14,165,233,0.3)] hover:scale-110 transition-transform ${
                          selectedHw === 'ultrasonic' ? 'ring-2 ring-primary' : ''
                        }`}
                        title="JSN-SR04T Waterproof Ultrasonic Transceiver"
                      >
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-container to-surface-container-lowest flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-white">hearing</span>
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-primary" />
                        </span>
                      </button>

                      {/* Hotspot 2: PIR */}
                      <button
                        onClick={() => setSelectedHw('pir')}
                        className={`group relative flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-lowest text-tertiary shadow-[0_0_10px_rgba(78,222,163,0.3)] hover:scale-110 transition-transform ${
                          selectedHw === 'pir' ? 'ring-2 ring-tertiary' : ''
                        }`}
                        title="PIR Motion Pyroelectric Sensor"
                      >
                        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-tertiary">motion_photos_on</span>
                        </div>
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary" />
                        </span>
                      </button>

                      {/* Ultrasonic Receiver */}
                      <div className="w-12 h-12 rounded-full bg-surface-container-lowest flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary-container to-surface-container-lowest flex items-center justify-center">
                          <span className="material-symbols-outlined text-[18px] text-on-surface">surround_sound</span>
                        </div>
                      </div>
                    </div>

                    {/* Hotspot 3: Micro OLED Display */}
                    <button
                      onClick={() => setSelectedHw('oled')}
                      className={`w-48 h-24 rounded-lg bg-surface-container-lowest p-2 shadow-inner flex flex-col justify-between hover:scale-[1.02] transition-transform text-left border ${
                        selectedHw === 'oled' ? 'border-primary ring-1 ring-primary' : 'border-[#242a3a]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-label-caps text-label-caps text-secondary font-bold">RANGE: 1.84m</span>
                        <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-mono">WILDLIFE DET</span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="font-headline-md text-headline-md text-primary font-bold tracking-tight">
                          184<span className="text-label-caps font-normal text-on-surface-variant ml-0.5">CM</span>
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-3 bg-tertiary rounded-xs" />
                          <span className="w-1.5 h-4 bg-tertiary rounded-xs" />
                          <span className="w-1.5 h-2 bg-on-surface-variant/40 rounded-xs" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-on-surface-variant font-label-caps text-label-caps font-mono">
                        <span>HDG 312° NW</span>
                        <span>PWR 94%</span>
                      </div>
                    </button>

                    {/* Right Side Thumb Trigger Button Hotspot */}
                    <button
                      onClick={() => setSelectedHw('trigger')}
                      className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-14 rounded-r-xl bg-gradient-to-r from-error to-error-container text-white flex flex-col items-center justify-center shadow-lg hover:translate-x-1 transition-transform"
                      title="Tactile Emergency SOS Thumb Detent"
                    >
                      <span className="material-symbols-outlined text-[16px]">touch_app</span>
                      <span className="font-label-caps text-[9px] -rotate-90 mt-1 uppercase font-bold">SOS</span>
                    </button>

                    {isExploded && (
                      <div className="absolute -right-36 top-10 bg-surface-container-high border border-[#242a3a] text-on-surface px-space-sm py-1 rounded font-label-caps text-label-caps shadow-lg whitespace-nowrap">
                        L2: Sensor Optics &amp; OLED HUD
                      </div>
                    )}
                  </div>
                </div>

                {/* LAYER 3: Main Logic Motherboard (MCU + Haptics + Piezo) */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform: isExploded ? 'translateY(0px) translateZ(0px)' : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  <div
                    className={`relative w-60 h-60 rounded-xl bg-[#0b241b] border border-[#242a3a] shadow-xl p-3 flex flex-col justify-between ${
                      isWireframe ? 'opacity-40' : ''
                    }`}
                  >
                    {/* PCB Traces */}
                    <div className="absolute inset-0 opacity-25 pointer-events-none">
                      <svg className="w-full h-full">
                        <path d="M 20 40 H 80 V 120 H 160" fill="none" stroke="#4edea3" strokeWidth="1.5" />
                        <path d="M 200 40 V 90 H 120 V 180" fill="none" stroke="#4edea3" strokeWidth="1.5" />
                        <circle cx="80" cy="120" r="3" fill="#4edea3" />
                        <circle cx="120" cy="90" r="3" fill="#4edea3" />
                      </svg>
                    </div>

                    {/* Hotspot MCU */}
                    <div className="flex items-center justify-between z-10">
                      <button
                        onClick={() => setSelectedHw('controller')}
                        className={`p-2 rounded-lg bg-surface-container-lowest text-primary shadow-md hover:scale-105 transition-transform flex items-center gap-space-xs border ${
                          selectedHw === 'controller' ? 'border-primary ring-1 ring-primary' : 'border-[#242a3a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px] text-primary">memory</span>
                        <div className="text-left font-label-caps text-label-caps leading-tight">
                          <span className="font-bold text-on-surface block">ESP32 MCU</span>
                          <span className="text-on-surface-variant font-mono">240MHz / 50Hz</span>
                        </div>
                      </button>

                      {/* Hotspot Piezo */}
                      <button
                        onClick={() => setSelectedHw('piezo')}
                        className={`w-9 h-9 rounded-full bg-surface-container-highest text-secondary flex items-center justify-center shadow hover:scale-110 transition-transform border ${
                          selectedHw === 'piezo' ? 'border-secondary ring-1 ring-secondary' : 'border-[#242a3a]'
                        }`}
                        title="Piezo Acoustic Deterrence Buzzer"
                      >
                        <span className="material-symbols-outlined text-[16px]">volume_up</span>
                      </button>
                    </div>

                    {/* Bottom Haptic & PCB tag */}
                    <div className="flex items-center justify-between z-10">
                      <button
                        onClick={() => setSelectedHw('haptic')}
                        className={`px-2 py-1.5 rounded bg-surface-container-low text-tertiary flex items-center gap-1 hover:scale-105 transition-transform border ${
                          selectedHw === 'haptic' ? 'border-tertiary ring-1 ring-tertiary' : 'border-[#242a3a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">vibration</span>
                        <span className="font-label-caps text-label-caps">SILENT HAPTIC</span>
                      </button>
                      <span className="font-telemetry-sm text-telemetry-sm text-tertiary-fixed-dim font-mono">
                        REV 1.9 PCB
                      </span>
                    </div>

                    {isExploded && (
                      <div className="absolute -right-36 top-14 bg-surface-container-high border border-[#242a3a] text-on-surface px-space-sm py-1 rounded font-label-caps text-label-caps shadow-lg whitespace-nowrap">
                        L3: Core PCB Logic Motherboard
                      </div>
                    )}
                  </div>
                </div>

                {/* LAYER 4: Cartridge Dock & Micro Servo */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform: isExploded
                      ? 'translateY(70px) translateZ(-40px)'
                      : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  <div
                    className={`relative w-64 h-64 rounded-2xl bg-surface-container border border-[#242a3a] shadow-xl p-4 flex flex-col justify-between ${
                      isWireframe ? 'opacity-40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Hotspot Servo */}
                      <button
                        onClick={() => setSelectedHw('servo')}
                        className={`p-2 rounded-lg bg-surface-container-highest text-primary flex items-center gap-space-xs hover:scale-105 transition-transform border ${
                          selectedHw === 'servo' ? 'border-primary ring-1 ring-primary' : 'border-[#242a3a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">precision_manufacturing</span>
                        <div className="text-left font-label-caps text-label-caps">
                          <span className="font-bold text-on-surface block">SERVO ACTUATOR</span>
                          <span className="text-on-surface-variant font-mono">Micro Metal-Gear 9g</span>
                        </div>
                      </button>

                      {/* Hotspot Battery */}
                      <button
                        onClick={() => setSelectedHw('battery')}
                        className={`p-2 rounded-lg bg-surface-container-highest text-tertiary flex items-center gap-space-xs hover:scale-105 transition-transform border ${
                          selectedHw === 'battery' ? 'border-tertiary ring-1 ring-tertiary' : 'border-[#242a3a]'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[20px]">battery_saver</span>
                        <div className="text-left font-label-caps text-label-caps">
                          <span className="font-bold text-on-surface block">LIPO CELL</span>
                          <span className="text-on-surface-variant font-mono">3.7V 650mAh</span>
                        </div>
                      </button>
                    </div>

                    <div className="w-full bg-surface-container-lowest/80 border border-[#242a3a] rounded-lg p-2 flex items-center justify-between">
                      <span className="font-label-caps text-label-caps text-on-surface-variant">
                        NON-HARMFUL CARTRIDGE BAY
                      </span>
                      <span className="font-telemetry-sm text-telemetry-sm text-primary font-mono">
                        MAGNETIC DETENT
                      </span>
                    </div>

                    {isExploded && (
                      <div className="absolute -right-36 top-20 bg-surface-container-high border border-[#242a3a] text-on-surface px-space-sm py-1 rounded font-label-caps text-label-caps shadow-lg whitespace-nowrap">
                        L4: Actuation Bay &amp; Servo Mechanism
                      </div>
                    )}
                  </div>
                </div>

                {/* LAYER 5: Baseplate & Wrist Straps */}
                <div
                  className="absolute inset-0 flex items-center justify-center transition-all duration-700"
                  style={{
                    transform: isExploded
                      ? 'translateY(140px) translateZ(-80px)'
                      : 'translateY(0px) translateZ(0px)',
                  }}
                >
                  <div className="absolute -top-16 w-36 h-20 bg-gradient-to-b from-surface-container-highest to-surface-container-high rounded-t-2xl shadow-lg flex items-start justify-center pt-2">
                    <div className="w-12 h-1 bg-surface-variant rounded-full" />
                  </div>
                  <div className="absolute -bottom-16 w-36 h-20 bg-gradient-to-t from-surface-container-highest to-surface-container-high rounded-b-2xl shadow-lg flex items-end justify-center pb-2">
                    <div className="w-12 h-1 bg-surface-variant rounded-full" />
                  </div>

                  <div
                    className={`relative w-72 h-72 rounded-3xl bg-surface-container-high border border-[#242a3a] shadow-2xl flex items-center justify-center ${
                      isWireframe ? 'opacity-35' : ''
                    }`}
                  >
                    <div className="w-56 h-56 rounded-2xl bg-surface-container-low border border-[#242a3a] flex flex-col items-center justify-center gap-1 p-4 text-center">
                      <span className="material-symbols-outlined text-[32px] text-on-surface-variant opacity-40">
                        wrist
                      </span>
                      <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                        Reinforced Aluminum 6061 // Hypoallergenic Silicone
                      </span>
                      <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-mono">
                        SERIAL: R-X-2025-01
                      </span>
                    </div>

                    {isExploded && (
                      <div className="absolute -right-36 top-24 bg-surface-container-high border border-[#242a3a] text-on-surface px-space-sm py-1 rounded font-label-caps text-label-caps shadow-lg whitespace-nowrap">
                        L5: Chassis Base &amp; Strap Rig
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CAD Viewport Controller Dock */}
            <div className="absolute bottom-4 inset-x-4 z-20 flex items-center justify-between gap-space-sm bg-surface-container-low/90 border border-[#242a3a] backdrop-blur-xl px-space-md py-2 rounded-xl shadow-lg">
              <div className="flex items-center gap-space-xs">
                <button
                  onClick={() => setRotY((prev) => prev - 45)}
                  className="w-8 h-8 rounded bg-surface-container hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors border border-[#242a3a]"
                  title="Rotate Left"
                >
                  <span className="material-symbols-outlined text-[18px]">rotate_left</span>
                </button>
                <button
                  onClick={() => setRotY((prev) => prev + 45)}
                  className="w-8 h-8 rounded bg-surface-container hover:bg-surface-container-highest text-on-surface flex items-center justify-center transition-colors border border-[#242a3a]"
                  title="Rotate Right"
                >
                  <span className="material-symbols-outlined text-[18px]">rotate_right</span>
                </button>
                <div className="w-px h-5 bg-surface-container-highest mx-1" />
                <button
                  onClick={() => setPerspective('isometric')}
                  className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-highest font-label-caps text-label-caps text-on-surface border border-[#242a3a]"
                >
                  ISO 3D
                </button>
                <button
                  onClick={() => setPerspective('top')}
                  className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-highest font-label-caps text-label-caps text-on-surface border border-[#242a3a]"
                >
                  Top View
                </button>
                <button
                  onClick={() => setPerspective('side')}
                  className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-highest font-label-caps text-label-caps text-on-surface border border-[#242a3a]"
                >
                  Side Profile
                </button>
                <button
                  onClick={() => setPerspective('wrist')}
                  className="px-space-sm py-1 rounded bg-surface-container hover:bg-surface-container-highest font-label-caps text-label-caps text-on-surface border border-[#242a3a]"
                >
                  Wrist Fit
                </button>
              </div>

              <div className="flex items-center gap-space-sm">
                <span className="font-label-caps text-label-caps text-on-surface-variant hidden sm:inline">
                  CLICK HOTSPOTS TO INSPECT HARDWARE SPECS
                </span>
                <button
                  onClick={resetCamera}
                  className="flex items-center gap-1 text-primary hover:text-secondary font-label-caps text-label-caps uppercase"
                >
                  <span className="material-symbols-outlined text-[14px]">restart_alt</span> Reset
                </button>
              </div>
            </div>
          </div>

          {/* Exploded View Layer Legend Navigator */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-space-sm">
            <div className="bg-surface-container-low border border-[#242a3a] p-space-sm rounded-lg flex flex-col gap-0.5">
              <span className="font-label-caps text-label-caps text-primary font-bold">L1: BEZEL</span>
              <span className="font-body-md text-body-md text-on-surface truncate">Sapphire Shield</span>
              <span className="font-telemetry-sm text-[11px] text-on-surface-variant">AR-coated glass</span>
            </div>
            <div className="bg-surface-container-low border border-[#242a3a] p-space-sm rounded-lg flex flex-col gap-0.5">
              <span className="font-label-caps text-label-caps text-primary font-bold">L2: SENSOR HUD</span>
              <span className="font-body-md text-body-md text-on-surface truncate">Ultrasonic &amp; OLED</span>
              <span className="font-telemetry-sm text-[11px] text-on-surface-variant">Dual 40kHz + 1.3" HUD</span>
            </div>
            <div className="bg-surface-container-low border border-[#242a3a] p-space-sm rounded-lg flex flex-col gap-0.5">
              <span className="font-label-caps text-label-caps text-primary font-bold">L3: CORE PCB</span>
              <span className="font-body-md text-body-md text-on-surface truncate">ESP32 &amp; Haptic</span>
              <span className="font-telemetry-sm text-[11px] text-on-surface-variant">50Hz Polling MCU</span>
            </div>
            <div className="bg-surface-container-low border border-[#242a3a] p-space-sm rounded-lg flex flex-col gap-0.5">
              <span className="font-label-caps text-label-caps text-primary font-bold">L4: ACTUATION</span>
              <span className="font-body-md text-body-md text-on-surface truncate">Servo Bay &amp; LiPo</span>
              <span className="font-telemetry-sm text-[11px] text-on-surface-variant">Micro metal-gear</span>
            </div>
            <div className="bg-surface-container-low border border-[#242a3a] p-space-sm rounded-lg flex flex-col gap-0.5">
              <span className="font-label-caps text-label-caps text-primary font-bold">L5: CHASSIS</span>
              <span className="font-body-md text-body-md text-on-surface truncate">Anodized 6061</span>
              <span className="font-telemetry-sm text-[11px] text-on-surface-variant">Dual safety clasp</span>
            </div>
          </div>
        </div>

        {/* Right Column: Hardware Hotspot Inspector Drawer (4 cols) */}
        <div className="xl:col-span-4 flex flex-col gap-space-md">
          {/* Live Component Inspector Card */}
          <div className="bg-surface-container-low border border-[#242a3a] p-space-md rounded-xl shadow-lg flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-space-sm border-b border-[#242a3a]">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">biotech</span>
                <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider uppercase">
                  COMPONENT INSPECTOR
                </span>
              </div>
              <span className="px-space-xs py-0.5 rounded bg-tertiary/20 text-tertiary font-label-caps text-label-caps">
                ACTIVE SPEC
              </span>
            </div>

            {/* Component Title & Icon */}
            <div className="flex items-start gap-space-md">
              <div className="w-14 h-14 rounded-xl bg-surface-container-high border border-[#242a3a] flex items-center justify-center text-primary shadow-inner shrink-0">
                <span className={`material-symbols-outlined text-[32px] ${currentSpec.iconColor}`}>
                  {currentSpec.icon}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-telemetry-sm text-telemetry-sm text-primary font-mono">{currentSpec.id}</span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-surface truncate">
                  {currentSpec.title}
                </h3>
                <span className="font-body-md text-body-md text-on-surface-variant text-xs">
                  {currentSpec.subtitle}
                </span>
              </div>
            </div>

            {/* Hardware Description */}
            <p className="font-body-md text-body-md text-on-surface leading-relaxed text-xs">
              {currentSpec.desc}
            </p>

            {/* Specs Grid */}
            <div className="bg-surface-container border border-[#242a3a] rounded-lg p-space-sm flex flex-col gap-space-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#242a3a]/40 text-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">OPERATING VOLTAGE</span>
                <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-mono">{currentSpec.v}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#242a3a]/40 text-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">SAMPLING RATE</span>
                <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-mono">{currentSpec.rate}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#242a3a]/40 text-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">DETECTION RANGE</span>
                <span className="font-telemetry-sm text-telemetry-sm text-secondary font-mono">{currentSpec.range}</span>
              </div>
              <div className="flex justify-between items-center py-1 text-xs">
                <span className="font-label-caps text-label-caps text-on-surface-variant">INTERFACE PROTOCOL</span>
                <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-mono">{currentSpec.bus}</span>
              </div>
            </div>

            {/* Design Thinking Rationale */}
            <div className="bg-surface-container-highest/40 border border-[#242a3a] p-space-sm rounded-lg flex flex-col gap-1">
              <span className="font-label-caps text-label-caps text-primary-fixed uppercase tracking-wider">
                Design Thinking Rationale
              </span>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs">
                {currentSpec.rationale}
              </p>
            </div>

            {/* Hotspot buttons */}
            <div className="flex flex-col gap-space-xs pt-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Select Subsystem Component
              </span>
              <div className="grid grid-cols-3 gap-1">
                {[
                  { key: 'controller', label: 'ESP32 MCU' },
                  { key: 'ultrasonic', label: 'Ultrasonic' },
                  { key: 'pir', label: 'PIR Motion' },
                  { key: 'oled', label: 'OLED 1.3"' },
                  { key: 'piezo', label: 'Piezo Tone' },
                  { key: 'haptic', label: 'Haptic Alert' },
                  { key: 'servo', label: 'Servo Gear' },
                  { key: 'battery', label: 'LiPo 3.7V' },
                  { key: 'trigger', label: 'SOS Switch' },
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setSelectedHw(item.key)}
                    className={`px-2 py-1.5 rounded font-label-caps text-label-caps text-left truncate transition-colors border ${
                      selectedHw === item.key
                        ? 'bg-primary-container text-on-primary-container border-primary font-bold'
                        : 'bg-surface-container hover:bg-surface-container-highest text-on-surface border-[#242a3a]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Wrist Wearability Metrics */}
          <div className="bg-surface-container-low border border-[#242a3a] p-space-md rounded-xl shadow-lg flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs text-secondary">
              <span className="material-symbols-outlined text-[20px]">front_hand</span>
              <span className="font-headline-md text-headline-md font-semibold text-on-surface">
                Wrist Wearability Metrics
              </span>
            </div>
            <div className="grid grid-cols-2 gap-space-sm pt-1">
              <div className="bg-surface-container border border-[#242a3a] p-2 rounded-lg">
                <span className="font-label-caps text-label-caps text-on-surface-variant block">TOTAL WEIGHT</span>
                <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold font-mono">
                  142<span className="text-label-caps font-normal text-on-surface-variant ml-1">GRAMS</span>
                </span>
              </div>
              <div className="bg-surface-container border border-[#242a3a] p-2 rounded-lg">
                <span className="font-label-caps text-label-caps text-on-surface-variant block">CHASSIS PROFILE</span>
                <span className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold font-mono">
                  16.4<span className="text-label-caps font-normal text-on-surface-variant ml-1">MM</span>
                </span>
              </div>
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant text-xs">
              Contoured wrist-cuff with double safety clasp and sweat ventilation ducting engineered for 14-hour continuous patrol shifts.
            </span>
          </div>
        </div>
      </div>

      {/* Bill of Materials (BOM) Table */}
      <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-lg flex flex-col gap-space-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm pb-space-sm border-b border-[#242a3a]">
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-lg text-headline-lg font-bold text-on-surface">
                Bill of Materials (BOM) Architecture
              </span>
              <span className="px-space-xs py-0.5 rounded bg-primary/20 text-primary font-label-caps text-label-caps">
                PROTOTYPE SCALE
              </span>
            </div>
            <span className="font-body-md text-body-md text-on-surface-variant">
              Validated component bill suited for first-year engineering laboratory budget targets ($35.00 – $45.00 limit).
            </span>
          </div>
          <div className="flex items-center gap-space-md bg-surface-container border border-[#242a3a] px-space-md py-2 rounded-lg self-start md:self-auto">
            <span className="font-label-caps text-label-caps text-on-surface-variant">TOTAL BOM ACCUMULATION:</span>
            <span className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold font-mono">$41.80</span>
          </div>
        </div>

        {/* Responsive BOM Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left font-body-md text-body-md">
            <thead>
              <tr className="bg-surface-container-highest/60 text-on-surface font-label-caps text-label-caps uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-lg">Item / Part</th>
                <th className="py-3 px-4">Subsystem Description</th>
                <th className="py-3 px-4">Functional Role</th>
                <th className="py-3 px-4">Key Specification</th>
                <th className="py-3 px-4">Qty</th>
                <th className="py-3 px-4 rounded-r-lg text-right">Unit Est. ($)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-highest/30">
              {[
                { part: 'ESP32-WROOM-32', icon: 'memory', desc: '32-Bit Dual-Core Microcontroller', role: 'Sensor polling (50Hz), telemetry pipeline & triggers', spec: '240MHz, 4MB Flash, BLE/Wi-Fi', qty: 1, cost: '$4.80' },
                { part: 'JSN-SR04T Sensor', icon: 'hearing', desc: 'Waterproof Ultrasonic Transceiver', role: 'Distance obstacle pinging & close wildlife warning', spec: '40kHz acoustic pulse, 2cm-400cm', qty: 1, cost: '$3.70' },
                { part: 'Mini PIR HC-SR505', icon: 'motion_photos_on', desc: 'Pyroelectric Infrared Motion Sensor', role: 'Detects warm body presence in obscured brush', spec: '100° cone, up to 3m sensitivity', qty: 1, cost: '$1.20' },
                { part: 'SH1106 OLED HUD', icon: 'screenshot_monitor', desc: '1.3" Monochrome OLED Display Module', role: 'Tactical metrics, heading, ping and device status', spec: '128x64 px, I2C bus, 0.04W', qty: 1, cost: '$2.90' },
                { part: 'Piezo Tone Buzzer', icon: 'volume_up', desc: 'Active Acoustic Transducer', role: 'Acoustic deterrence and cautionary sonic sweep', spec: '85dB @ 10cm, 2.7kHz resonant', qty: 1, cost: '$0.60' },
                { part: 'Coin Haptic Motor', icon: 'vibration', desc: 'ERM 1027 Vibration Micro Disc', role: 'Silent tactile pulse to wrist (fauna undisturbed)', spec: '10mm dia, 12,000 RPM @ 3V', qty: 1, cost: '$0.90' },
                { part: 'MG90S Micro Servo', icon: 'precision_manufacturing', desc: 'Metal-Gear Digital Miniature Servo', role: 'Releases non-harmful rescue cartridge bay latch', spec: '2.0 kg-cm torque, 9g weight', qty: 1, cost: '$2.50' },
                { part: 'LiPo 650mAh Battery', icon: 'battery_charging_full', desc: '3.7V Polymer Rechargeable Cell + TP4056', role: 'Independent uninterrupted wrist system power', spec: 'Includes PCM circuit protection', qty: 1, cost: '$4.20' },
                { part: '3D Chassis & Hardware', icon: 'layers', desc: 'Custom Resin/PLA+ Enclosure & Wrist Strap', role: 'Rapid laboratory print, silicone strap, brass inserts', spec: 'High-impact resin + M2.5 screws', qty: '1 set', cost: '$21.00' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-surface-container-high/40 transition-colors">
                  <td className="py-3 px-4 font-semibold text-primary flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">{row.icon}</span>
                    <span>{row.part}</span>
                  </td>
                  <td className="py-3 px-4 text-on-surface">{row.desc}</td>
                  <td className="py-3 px-4 text-on-surface-variant text-xs">{row.role}</td>
                  <td className="py-3 px-4 font-telemetry-sm text-telemetry-sm font-mono text-xs">{row.spec}</td>
                  <td className="py-3 px-4 font-telemetry-sm text-telemetry-sm font-mono">{row.qty}</td>
                  <td className="py-3 px-4 font-telemetry-sm text-telemetry-sm text-right text-tertiary font-bold font-mono">
                    {row.cost}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
