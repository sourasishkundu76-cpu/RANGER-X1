import React, { useState, useEffect } from 'react';
import { useRanger } from '../context/RangerContext';

export const CommandCenter: React.FC = () => {
  const {
    distanceCm,
    patrolActive,
    setPatrolActive,
    sosActive,
    setSosActive,
    setShowSosModal,
    setActiveScreen,
    logs,
    addLog,
  } = useRanger();

  const [activeGauntletView, setActiveGauntletView] = useState<'top' | 'profile' | 'port' | 'wireframe'>('top');
  const [showDiagModal, setShowDiagModal] = useState<boolean>(false);
  const [diagStep, setDiagStep] = useState<number>(0);
  const [diagRunning, setDiagRunning] = useState<boolean>(false);
  const [diagLogs, setDiagLogs] = useState<string[]>([
    '[INIT] Dual-Core ESP32-S3 ready. Click "RUN DIAGNOSTIC SWEEP" to trigger live hardware loop test...',
  ]);

  // Hold SOS on bottom cockpit
  const [holdingSos, setHoldingSos] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (holdingSos) {
      timer = setInterval(() => {
        setSosProgress((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            setSosActive(true);
            addLog('CRIT', 'MESH', 'Emergency SOS broadcast triggered via Command Console.');
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      setSosProgress(0);
    }
    return () => clearInterval(timer);
  }, [holdingSos, setSosActive, addLog]);

  // Run hardware diagnostic sweep
  const handleRunDiagnostic = () => {
    setShowDiagModal(true);
    setDiagRunning(true);
    setDiagStep(1);
    setDiagLogs(['[INIT] Initiating dual-bus self-test sweep across 6 endpoints...']);

    const tests = [
      { id: 1, name: 'ULTRASONIC TRANSDUCER (JSN-SR04T)', res: 'Ping echo return 40kHz nominal < 2.4ms.' },
      { id: 2, name: 'PIR MOTION ARRAY (HC-SR505)', res: 'Dual-element pyroelectric IR baseline calibrated.' },
      { id: 3, name: 'SSD1306 0.96" OLED HUD', res: 'I2C 0x3C bus acknowledge verified at 400kHz.' },
      { id: 4, name: 'PIEZO ALARM 85dB TRANSDUCER', res: 'PWM frequency sweep 2.7kHz resonant confirmed.' },
      { id: 5, name: 'SG90 CART RELEASE SERVO', res: '0° to 90° bay gate latch micro-step calibrated.' },
      { id: 6, name: 'HAPTIC COIN VIBRATOR', res: 'Silent ranger tactile feedback pulse tested.' },
    ];

    tests.forEach((t, idx) => {
      setTimeout(() => {
        setDiagStep(idx + 1);
        setDiagLogs((prev) => [
          ...prev,
          `[OK] Subsystem ${idx + 1}/6: ${t.name} verified. ${t.res}`,
        ]);
        if (idx === tests.length - 1) {
          setDiagRunning(false);
          addLog('INFO', 'DIAGNOSTIC', 'Hardware diagnostic self-test suite completed: 6/6 circuits nominal.');
        }
      }, (idx + 1) * 450);
    });
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-10">
      {/* Top Console Ticker & Status Hero Bar */}
      <div className="w-full bg-surface-container-low/70 backdrop-blur-xl border border-[#242a3a] rounded-xl p-space-md shadow-xl relative overflow-hidden flex flex-col xl:flex-row items-start xl:items-center justify-between gap-space-md">
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center gap-space-md">
          {/* Ranger Status Pill */}
          <div className="flex items-center gap-space-sm bg-surface-container-high/90 border border-[#242a3a] px-space-md py-2 rounded-lg">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  patrolActive ? 'bg-tertiary' : 'bg-secondary'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  patrolActive ? 'bg-tertiary' : 'bg-secondary'
                }`}
              />
            </span>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                RANGER STATUS
              </span>
              <span
                className={`font-headline-md text-headline-md font-bold tracking-wide leading-none ${
                  patrolActive ? 'text-tertiary' : 'text-secondary'
                }`}
              >
                {patrolActive ? 'PATROL ACTIVE' : 'PATROL PAUSED'}
              </span>
            </div>
          </div>

          <div className="h-8 w-px bg-surface-container-highest hidden sm:block" />

          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              HARDWARE CORE
            </span>
            <span className="font-telemetry-sm text-telemetry-sm text-on-surface flex items-center gap-1 font-semibold">
              <span className="text-primary font-mono">ESP32-S3 Dual-Core</span> + ATmega328P Aux
            </span>
          </div>

          <div className="h-8 w-px bg-surface-container-highest hidden md:block" />

          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
              SEC-LOC COORDINATES
            </span>
            <span className="font-telemetry-sm text-telemetry-sm text-secondary flex items-center gap-1 font-mono">
              <span className="material-symbols-outlined text-[14px]">location_on</span> 11°42'18"N 76°38'22"E
            </span>
          </div>
        </div>

        <div className="flex items-center gap-space-sm self-stretch xl:self-auto justify-between xl:justify-end">
          <div className="flex items-center gap-space-xs bg-tertiary/10 border border-tertiary/20 px-space-sm py-1 rounded">
            <span className="material-symbols-outlined text-tertiary text-[16px]">verified_user</span>
            <span className="font-label-caps text-label-caps text-tertiary uppercase font-semibold">
              SAFE HARMFUL-FREE HARNESS
            </span>
          </div>
          <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container-highest/80 px-space-sm py-1 rounded font-mono border border-[#242a3a]">
            TICK #8841-A09
          </span>
        </div>
      </div>

      {/* 7 Telemetry Overview Nodes */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-space-sm">
        {/* Node 1: System */}
        <div className="bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-md rounded-xl p-space-sm shadow-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">SYSTEM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
          </div>
          <div className="my-space-xs">
            <div className="font-telemetry-lg text-telemetry-lg text-tertiary leading-tight font-bold">ONLINE</div>
            <div className="font-label-caps text-label-caps text-on-surface-variant truncate">Dual MCU Ready</div>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className="bg-tertiary h-full w-full" />
          </div>
        </div>

        {/* Node 2: Battery */}
        <div className="bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-md rounded-xl p-space-sm shadow-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">BATTERY</span>
            <span className="material-symbols-outlined text-primary text-[15px]">battery_saver</span>
          </div>
          <div className="my-space-xs">
            <div className="font-telemetry-lg text-telemetry-lg text-primary leading-tight font-bold font-mono">93%</div>
            <div className="font-label-caps text-label-caps text-on-surface-variant truncate">LiPo 1200mAh / 14.2h</div>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[93%]" />
          </div>
        </div>

        {/* Node 3: Current Mode */}
        <div className="bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-md rounded-xl p-space-sm shadow-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">MODE</span>
            <span className="material-symbols-outlined text-secondary text-[15px]">routine</span>
          </div>
          <div className="my-space-xs">
            <div className="font-telemetry-lg text-telemetry-lg text-secondary leading-tight font-bold">
              {patrolActive ? 'PATROL' : 'PAUSED'}
            </div>
            <div className="font-label-caps text-label-caps text-on-surface-variant truncate">Adaptive Photocell</div>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className={`h-full ${patrolActive ? 'bg-secondary w-4/5' : 'bg-surface-variant w-1/3'}`} />
          </div>
        </div>

        {/* Node 4: Proximity */}
        <div className="bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-md rounded-xl p-space-sm shadow-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">PROXIMITY</span>
            <span className="material-symbols-outlined text-primary text-[15px]">radar</span>
          </div>
          <div className="my-space-xs">
            <div className="font-telemetry-lg text-telemetry-lg text-on-surface leading-tight font-mono font-bold">
              {distanceCm}
              <span className="text-sm font-normal text-on-surface-variant ml-0.5">cm</span>
            </div>
            <div className="font-label-caps text-label-caps text-on-surface-variant truncate">JSN-SR04T Beam</div>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div
              className={`h-full ${
                distanceCm < 40 ? 'bg-error w-1/4' : distanceCm <= 80 ? 'bg-secondary w-1/2' : 'bg-primary-container w-4/5'
              }`}
            />
          </div>
        </div>

        {/* Node 5: Threat / Perimeter */}
        <div className="bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-md rounded-xl p-space-sm shadow-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">PERIMETER</span>
            <span className="material-symbols-outlined text-tertiary text-[15px]">verified_user</span>
          </div>
          <div className="my-space-xs">
            <div className="font-telemetry-lg text-telemetry-lg text-tertiary leading-tight font-bold">
              {distanceCm < 40 ? 'ALERT' : distanceCm <= 80 ? 'CAUTION' : 'NORMAL'}
            </div>
            <div className="font-label-caps text-label-caps text-on-surface-variant truncate">
              {distanceCm < 40 ? 'Buffer Breached' : 'Zero Breach Detected'}
            </div>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className={`h-full ${distanceCm < 40 ? 'bg-error w-full' : 'bg-tertiary w-full'}`} />
          </div>
        </div>

        {/* Node 6: Comms */}
        <div className="bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-md rounded-xl p-space-sm shadow-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">COMMS</span>
            <span className="material-symbols-outlined text-primary text-[15px]">hub</span>
          </div>
          <div className="my-space-xs">
            <div className="font-telemetry-lg text-telemetry-lg text-primary leading-tight font-bold">LORA+BLE</div>
            <div className="font-label-caps text-label-caps text-on-surface-variant truncate">868MHz Mesh Link</div>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[95%]" />
          </div>
        </div>

        {/* Node 7: Active Cartridge */}
        <div className="col-span-2 sm:col-span-1 bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-md rounded-xl p-space-sm shadow-md flex flex-col justify-between hover:bg-surface-container-high transition-colors">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">CARTRIDGE</span>
            <span className="material-symbols-outlined text-secondary text-[15px]">lock</span>
          </div>
          <div className="my-space-xs">
            <div className="font-telemetry-lg text-telemetry-lg text-secondary leading-tight truncate font-bold font-mono">
              CART-01
            </div>
            <div className="font-label-caps text-label-caps text-on-surface-variant truncate">Tether Assist Primed</div>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className="bg-secondary h-full w-full" />
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left: Gauntlet Chassis Interactive SVG Stage (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-low/90 border border-[#242a3a] backdrop-blur-2xl rounded-2xl p-space-md shadow-2xl relative flex flex-col justify-between overflow-hidden">
          <div className="absolute -left-10 -bottom-10 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top HUD Header */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm z-10 pb-2">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[22px]">view_in_ar</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">
                    RANGER-X WEAPONIZED GAUNTLET CHASSIS
                  </span>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-surface-container-highest text-primary">
                    CAD-V2.4
                  </span>
                </div>
                <p className="font-label-caps text-label-caps text-on-surface-variant">
                  Spider-Man Web-Shooter Inspired Wildlife-Rescue Exo-Wearable
                </p>
              </div>
            </div>

            {/* View Switcher */}
            <div className="flex items-center bg-surface-container-highest/90 p-1 rounded-lg gap-1 border border-[#242a3a]">
              {(['top', 'profile', 'port', 'wireframe'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveGauntletView(v)}
                  className={`px-2.5 py-1 text-xs font-label-caps font-semibold rounded transition-all ${
                    activeGauntletView === v
                      ? 'bg-primary-container text-on-primary-container shadow'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {v === 'top' && 'Top HUD'}
                  {v === 'profile' && 'Gauntlet Arc'}
                  {v === 'port' && 'Bay Port'}
                  {v === 'wireframe' && 'Mesh HUD'}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Gauntlet SVG Stage */}
          <div className="relative w-full h-[360px] my-space-md flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" fill="none" viewBox="0 0 600 360">
              <defs>
                <linearGradient id="beamGradient" x1="300" x2="300" y1="200" y2="20">
                  <stop offset="0%" stopColor="#00eefc" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#89ceff" stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* 15 Degree Ultrasonic Emitter Wave Arc */}
              <path
                d="M 270 190 L 190 20 A 420 420 0 0 1 410 20 Z"
                fill="url(#beamGradient)"
                className="opacity-70 animate-pulse"
              />
              <path
                d="M 230 80 A 180 180 0 0 1 370 80"
                stroke="#00eefc"
                strokeDasharray="4 4"
                strokeWidth="1.5"
                className="opacity-80"
              />
              <path
                d="M 205 40 A 240 240 0 0 1 395 40"
                stroke="#89ceff"
                strokeWidth="1"
                className="opacity-50"
              />

              {/* Reticle Rings */}
              <circle cx="300" cy="200" r="160" stroke="#2f3445" strokeDasharray="2 6" strokeWidth="1" />
              <circle cx="300" cy="200" r="120" stroke="#0ea5e9" strokeOpacity="0.25" strokeWidth="1" />
              <line x1="300" y1="30" x2="300" y2="330" stroke="#0ea5e9" strokeOpacity="0.2" strokeWidth="0.7" />
              <line x1="120" y1="200" x2="480" y2="200" stroke="#0ea5e9" strokeOpacity="0.2" strokeWidth="0.7" />

              {/* Forearm Base Brace */}
              <path
                d="M 220 310 C 220 280 230 250 240 240 L 360 240 C 370 250 380 280 380 310 Z"
                fill="#151b2b"
                stroke="#3e4850"
                strokeWidth="2"
              />
              {/* Wrist Locking Collar */}
              <rect x="235" y="220" width="130" height="28" rx="6" fill="#191f2f" stroke="#0ea5e9" strokeWidth="1.5" />
              <circle cx="248" cy="234" r="4" fill="#89ceff" />
              <circle cx="352" cy="234" r="4" fill="#89ceff" />

              {/* Main Core Chassis (Spider-Man Inspired Spider-Shell) */}
              <polygon
                points="300,140 355,175 355,225 245,225 245,175"
                fill="#0d1322"
                stroke="#89ceff"
                strokeWidth="2"
              />
              <polygon
                points="300,152 342,180 342,218 258,218 258,180"
                fill="#151b2b"
                stroke="#0ea5e9"
                strokeOpacity="0.6"
                strokeWidth="1"
              />

              {/* Center Cartridge Bay Housing Cartridge 01 */}
              <rect x="276" y="158" width="48" height="52" rx="4" fill="#080e1d" stroke="#00eefc" strokeWidth="1.5" />
              <rect x="282" y="164" width="36" height="38" rx="2" fill="#003b26" stroke="#4edea3" strokeWidth="1" />
              {/* Tether Spool Core */}
              <circle cx="300" cy="183" r="10" fill="#00b17b" className="animate-pulse" />
              <path d="M 300 173 L 300 150" stroke="#4edea3" strokeLinecap="round" strokeWidth="2.5" />

              {/* Ultrasonic Twin Transducers */}
              <circle cx="270" cy="138" r="12" fill="#191f2f" stroke="#89ceff" strokeWidth="2" />
              <circle cx="270" cy="138" r="7" fill="#0ea5e9" />
              <circle cx="330" cy="138" r="12" fill="#191f2f" stroke="#89ceff" strokeWidth="2" />
              <circle cx="330" cy="138" r="7" fill="#0ea5e9" />

              {/* Tactical LED Beacons */}
              <rect x="248" y="148" width="8" height="12" rx="2" fill="#00eefc" />
              <rect x="344" y="148" width="8" height="12" rx="2" fill="#00eefc" />

              {/* Actuator Wire Cable */}
              <path d="M 300 230 C 300 270 300 300 300 330" stroke="#0ea5e9" strokeDasharray="3 3" strokeWidth="2.5" />

              {/* HUD Overlaid Target Box */}
              <g transform="translate(240, 60)">
                <rect x="0" y="0" width="120" height="42" rx="6" fill="#080e1d" fillOpacity="0.85" stroke="#00eefc" strokeWidth="1" />
                <text x="12" y="18" fill="#88929b" fontFamily="Inter" fontSize="9" fontWeight="600">
                  US-BEAM CONE: 15°
                </text>
                <text x="12" y="32" fill="#00eefc" fontFamily="Geist" fontSize="12" fontWeight="700">
                  {distanceCm} cm CLEAR
                </text>
              </g>
            </svg>

            {/* Dynamic Overlay Pin Labels */}
            <div className="absolute left-4 bottom-4 bg-surface-container-highest/80 backdrop-blur-md px-3 py-2 rounded-lg text-left shadow-lg border border-[#242a3a]">
              <div className="font-label-caps text-label-caps text-tertiary flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> CART-01: SOFT TETHER
              </div>
              <div className="font-body-md text-body-md font-semibold text-on-surface">Non-Harmful Assist Primed</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant font-mono">
                Tensile: 450N | Eco-Degradable Poly
              </div>
            </div>

            <div className="absolute right-4 top-16 bg-surface-container-highest/80 backdrop-blur-md px-3 py-2 rounded-lg text-right shadow-lg hidden sm:block border border-[#242a3a]">
              <div className="font-label-caps text-label-caps text-primary font-semibold">PALM PRESSURE SENSOR</div>
              <div className="font-telemetry-sm text-telemetry-sm font-bold text-on-surface font-mono">FSR-402 ARMED</div>
              <div className="font-label-caps text-label-caps text-on-surface-variant">Dual-Tap Trigger Sequence</div>
            </div>
          </div>

          {/* Visualizer Footer Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-space-sm bg-surface-container-lowest/60 rounded-xl p-3 border border-[#242a3a]">
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Ejection Solenoid</span>
              <p className="font-telemetry-sm text-telemetry-sm font-semibold text-tertiary">CHARGED (12V STEP)</p>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Ultrasonic Ping</span>
              <p className="font-telemetry-sm text-telemetry-sm font-semibold text-primary">40 kHz PULSED</p>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Gauntlet Thermal</span>
              <p className="font-telemetry-sm text-telemetry-sm font-semibold text-on-surface font-mono">29.4°C NOMINAL</p>
            </div>
            <div>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Aux Bay 02</span>
              <p className="font-telemetry-sm text-telemetry-sm font-semibold text-secondary">AEROSOL ENZYME READY</p>
            </div>
          </div>
        </div>

        {/* Right: Environmental & 360-Degree Spatial Radar (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-low/90 border border-[#242a3a] backdrop-blur-2xl rounded-2xl p-space-md shadow-2xl flex flex-col justify-between">
          <div>
            {/* Radar Title Header */}
            <div className="flex items-center justify-between mb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-secondary text-[22px]">radar</span>
                <div>
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">
                    SPATIAL SECTOR RADAR
                  </span>
                  <p className="font-label-caps text-label-caps text-on-surface-variant">
                    Bandipur Tiger Reserve • Sector 04 Alpha
                  </p>
                </div>
              </div>
              <div className="bg-surface-container-high px-2 py-1 rounded text-right border border-[#242a3a]">
                <span className="font-label-caps text-label-caps text-secondary font-mono">SWEEP: 360°/1.2s</span>
              </div>
            </div>

            {/* Radar Vector Graphic Canvas */}
            <div className="relative w-full aspect-square max-h-[310px] mx-auto flex items-center justify-center my-2">
              <svg className="w-full h-full" fill="none" viewBox="0 0 320 320">
                {/* Background Circular Grids */}
                <circle cx="160" cy="160" r="140" stroke="#3e4850" strokeOpacity="0.5" strokeWidth="1" />
                <circle cx="160" cy="160" r="105" stroke="#3e4850" strokeDasharray="4 4" strokeOpacity="0.4" strokeWidth="1" />
                <circle cx="160" cy="160" r="70" stroke="#3e4850" strokeOpacity="0.3" strokeWidth="1" />
                <circle cx="160" cy="160" r="35" stroke="#0ea5e9" strokeOpacity="0.4" strokeWidth="1" />

                {/* Axes */}
                <line x1="160" y1="20" x2="160" y2="300" stroke="#3e4850" strokeDasharray="2 4" strokeWidth="0.8" />
                <line x1="20" y1="160" x2="300" y2="160" stroke="#3e4850" strokeDasharray="2 4" strokeWidth="0.8" />

                {/* Compass Bearings */}
                <text x="160" y="14" fill="#88929b" fontFamily="Inter" fontSize="9" fontWeight="bold" textAnchor="middle">000° N</text>
                <text x="312" y="163" fill="#88929b" fontFamily="Inter" fontSize="9" textAnchor="end">090° E</text>
                <text x="160" y="315" fill="#88929b" fontFamily="Inter" fontSize="9" textAnchor="middle">180° S</text>
                <text x="10" y="163" fill="#88929b" fontFamily="Inter" fontSize="9" textAnchor="start">270° W</text>

                {/* Simulated Vegetation Arc */}
                <path d="M 160 160 L 250 50 A 140 140 0 0 1 290 190 Z" fill="#00b17b" fillOpacity="0.08" />
                <path d="M 60 160 A 140 140 0 0 1 160 20 L 160 160 Z" fill="#0ea5e9" fillOpacity="0.04" />

                {/* Rotating Radar Sweep Gradient Ray */}
                <defs>
                  <linearGradient id="radarSweepGrad" gradientTransform="rotate(45)">
                    <stop offset="0%" stopColor="#00eefc" stopOpacity="0" />
                    <stop offset="100%" stopColor="#00eefc" stopOpacity="0.45" />
                  </linearGradient>
                </defs>
                <path
                  d="M 160 160 L 260 60 A 140 140 0 0 0 160 20 Z"
                  fill="url(#radarSweepGrad)"
                  className="origin-center animate-[spin_4s_linear_infinite]"
                />

                {/* Target Blip 1: Safe Distance Wildlife (Herbivore / Deer at 4.2m) */}
                <g className="cursor-pointer group" transform="translate(225, 95)">
                  <circle cx="0" cy="0" r="10" fill="#4edea3" fillOpacity="0.2" className="animate-ping" />
                  <circle cx="0" cy="0" r="5" fill="#4edea3" />
                  <text x="8" y="4" fill="#4edea3" fontFamily="Geist" fontSize="10" fontWeight="700">
                    TARGET 01
                  </text>
                  <text x="8" y="15" fill="#bec8d2" fontFamily="Geist" fontSize="8">
                    Herbivore (Deer) ~4.2m
                  </text>
                </g>

                {/* Target Blip 2: Vegetation Cluster */}
                <g transform="translate(100, 215)">
                  <circle cx="0" cy="0" r="3" fill="#89ceff" fillOpacity="0.6" />
                  <text x="6" y="3" fill="#bec8d2" fontFamily="Geist" fontSize="8">
                    Dense Canopy
                  </text>
                </g>

                {/* Center Hub */}
                <circle cx="160" cy="160" r="6" fill="#89ceff" stroke="#00344d" strokeWidth="2" />
                <circle cx="160" cy="160" r="14" stroke="#89ceff" strokeDasharray="3 3" strokeWidth="1.2" className="animate-spin" />
              </svg>

              {/* Floating Radar Mini-HUD Badge */}
              <div className="absolute top-2 left-2 bg-surface-container-highest/90 border border-[#242a3a] px-2 py-1 rounded text-xs">
                <span className="text-tertiary font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary" /> SAFE TRACKING
                </span>
              </div>
            </div>

            {/* Radar Legend */}
            <div className="flex items-center justify-between bg-surface-container-high/60 border border-[#242a3a] rounded-xl p-space-sm mt-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary" />
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface">Target 01: Herbivore Detected</span>
                  <div className="font-label-caps text-label-caps text-on-surface-variant font-mono">
                    Range: 4.2m • Passive Non-Threat
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="font-label-caps text-label-caps text-primary font-mono">ECHO CONF: 96%</span>
                <div className="font-label-caps text-label-caps text-on-surface-variant">Non-Intrusive Audio</div>
              </div>
            </div>
          </div>

          {/* Ultrasonic Sparkline Monitor */}
          <div className="mt-3 pt-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                ECHO AMPLITUDE SPECTRUM
              </span>
              <span className="font-telemetry-sm text-telemetry-sm text-primary font-mono">
                WINDOW: 20ms - 450ms
              </span>
            </div>
            <div className="flex items-end gap-1 h-10 w-full bg-surface-container-lowest/80 border border-[#242a3a] p-1 rounded-lg">
              <div className="w-1/12 bg-primary/40 h-[25%] rounded-sm" />
              <div className="w-1/12 bg-primary/50 h-[40%] rounded-sm" />
              <div className="w-1/12 bg-primary/70 h-[30%] rounded-sm" />
              <div className="w-1/12 bg-primary h-[85%] rounded-sm" />
              <div className="w-1/12 bg-tertiary h-[95%] rounded-sm animate-pulse" />
              <div className="w-1/12 bg-primary h-[70%] rounded-sm" />
              <div className="w-1/12 bg-primary/60 h-[45%] rounded-sm" />
              <div className="w-1/12 bg-primary/40 h-[30%] rounded-sm" />
              <div className="w-1/12 bg-primary/30 h-[20%] rounded-sm" />
              <div className="w-1/12 bg-primary/20 h-[15%] rounded-sm" />
              <div className="w-1/12 bg-primary/20 h-[10%] rounded-sm" />
              <div className="w-1/12 bg-primary/10 h-[5%] rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Command Control Deck */}
      <div className="w-full bg-surface-container-low/90 border border-[#242a3a] backdrop-blur-xl rounded-2xl p-space-md shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-space-lg">
        {/* Controls Group */}
        <div className="flex flex-wrap items-center gap-space-md">
          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest block mb-1">
              Field Operation Commands
            </span>
            <div className="flex flex-wrap items-center gap-space-sm">
              {/* Start Patrol Route */}
              <button
                onClick={() => {
                  setPatrolActive(!patrolActive);
                  addLog('INFO', 'MODULE', `Patrol route state changed to ${!patrolActive ? 'ACTIVE' : 'PAUSED'}.`);
                }}
                className={`flex items-center gap-space-xs px-space-md py-2.5 rounded-lg font-headline-md text-headline-md font-semibold transition-all shadow-[0_0_16px_rgba(14,165,233,0.3)] ${
                  patrolActive
                    ? 'bg-primary text-on-primary hover:bg-primary-fixed'
                    : 'bg-surface-container-high text-on-surface hover:text-primary'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {patrolActive ? 'explore' : 'pause'}
                </span>
                <span>{patrolActive ? 'PATROL ACTIVE (TRACKING)' : 'START PATROL ROUTE'}</span>
              </button>

              {/* Simulate Incident */}
              <button
                onClick={() => setActiveScreen('incident-simulator')}
                className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest hover:text-primary transition-all shadow-md border border-[#242a3a]"
                type="button"
              >
                <span className="material-symbols-outlined text-secondary text-[20px]">model_training</span>
                <span className="font-headline-md text-headline-md font-medium">SIMULATE INCIDENT</span>
              </button>

              {/* Run Diagnostic Sweep */}
              <button
                onClick={handleRunDiagnostic}
                className="flex items-center gap-space-xs px-space-md py-2.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-container-highest hover:text-tertiary transition-all shadow-md border border-[#242a3a]"
                type="button"
              >
                <span className="material-symbols-outlined text-tertiary text-[20px]">build_circle</span>
                <span className="font-headline-md text-headline-md font-medium">RUN DIAGNOSTIC SWEEP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Emergency SOS Hold-Trigger */}
        <div className="flex items-center gap-space-md bg-surface-container-lowest/80 border border-[#242a3a] p-space-sm rounded-xl">
          <div className="flex flex-col text-right hidden sm:block">
            <span className="font-headline-md text-headline-md font-semibold text-error">CRITICAL OVERRIDE</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">LoRa Mesh Flood Dispatch</span>
          </div>

          <div className="relative group">
            <button
              onMouseDown={() => setHoldingSos(true)}
              onMouseUp={() => setHoldingSos(false)}
              onMouseLeave={() => setHoldingSos(false)}
              onTouchStart={() => setHoldingSos(true)}
              onTouchEnd={() => setHoldingSos(false)}
              onClick={() => {
                if (sosActive) {
                  setShowSosModal(true);
                }
              }}
              className={`relative overflow-hidden flex items-center gap-space-xs px-space-lg py-3 rounded-xl font-headline-md text-headline-md font-bold tracking-wider transition-all shadow-[0_0_24px_rgba(239,68,68,0.4)] active:scale-95 select-none ${
                sosActive
                  ? 'bg-error-container text-on-error-container animate-pulse'
                  : 'bg-error text-on-error hover:bg-error-container'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[24px]">
                {sosActive ? 'crisis_alert' : 'sos'}
              </span>
              <span>{sosActive ? 'SOS DISPATCHED' : holdingSos ? `HOLD (${sosProgress}%)` : 'HOLD SOS (3s)'}</span>

              {/* Progress bar */}
              <span
                className="absolute bottom-0 left-0 h-1 bg-white transition-all duration-75"
                style={{ width: `${sosProgress}%` }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Diagnostic Modal */}
      {showDiagModal && (
        <div className="w-full bg-surface-container-high/95 border border-[#242a3a] backdrop-blur-2xl rounded-2xl p-space-lg shadow-2xl transition-all">
          <div className="flex items-center justify-between pb-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-tertiary text-[24px]">verified</span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                HARDWARE DIAGNOSTIC SUITE &amp; SUB-CIRCUIT SWEEP
              </span>
            </div>
            <button
              onClick={() => setShowDiagModal(false)}
              className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-space-sm my-space-md">
            {[
              { id: 1, name: 'ULTRASONIC TRANSDUCER', model: 'HC-SR04 / JSN-SR04T' },
              { id: 2, name: 'PIR MOTION ARRAY', model: 'Passive IR Pyroelectric' },
              { id: 3, name: 'SSD1306 0.96" OLED', model: 'I2C (0x3C Address)' },
              { id: 4, name: 'PIEZO ALARM 85dB', model: 'Safe Frequency PWM' },
              { id: 5, name: 'SG90 CART RELEASE SERVO', model: '0°-90° Bay Gate Lock' },
              { id: 6, name: 'HAPTIC COIN VIBRATOR', model: 'Silent Ranger Feedback' },
            ].map((circuit) => {
              const isChecked = diagStep >= circuit.id;
              const isCurrent = diagStep === circuit.id && diagRunning;
              return (
                <div
                  key={circuit.id}
                  className={`bg-surface-container-low border p-space-sm rounded-lg flex flex-col justify-between ${
                    isChecked ? 'border-tertiary/60' : 'border-[#242a3a]'
                  }`}
                >
                  <span className="font-label-caps text-label-caps text-on-surface-variant truncate">
                    {circuit.name}
                  </span>
                  <div className="text-xs font-mono font-semibold text-primary my-1 truncate">
                    {circuit.model}
                  </div>
                  <span
                    className={`font-label-caps text-label-caps font-bold ${
                      isCurrent
                        ? 'text-secondary animate-pulse'
                        : isChecked
                        ? 'text-tertiary'
                        : 'text-on-surface-variant'
                    }`}
                  >
                    {isCurrent ? 'CHECKING...' : isChecked ? 'PASSED (0 ERR)' : 'STANDBY'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg font-mono text-xs text-primary space-y-1 max-h-36 overflow-y-auto border border-[#242a3a]">
            {diagLogs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Monospace Telemetry Stream & Demonstrator Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md">
        {/* Stream Terminal (8 cols) */}
        <div className="lg:col-span-8 bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-md rounded-xl p-space-md shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between pb-space-xs">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-primary text-[18px]">terminal</span>
              <span className="font-label-caps text-label-caps text-on-surface uppercase font-semibold">
                LIVE SENSOR TELEMETRY STREAM
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-ping" />
              <span className="font-label-caps text-label-caps text-tertiary font-mono">10 HZ POLLING</span>
            </div>
          </div>

          <div className="bg-surface-container-lowest/90 border border-[#242a3a] rounded-lg p-space-sm font-mono text-xs text-on-surface-variant h-32 overflow-hidden relative flex flex-col justify-end space-y-1">
            {logs.slice(0, 5).reverse().map((entry) => (
              <div
                key={entry.id}
                className={`truncate ${
                  entry.level === 'CRIT'
                    ? 'text-error font-bold'
                    : entry.level === 'WARN'
                    ? 'text-secondary-fixed-dim'
                    : entry.level === 'SYNC'
                    ? 'text-on-surface font-semibold'
                    : 'text-primary/80'
                }`}
              >
                [{entry.timestamp}] {entry.category}: {entry.message}
              </div>
            ))}
          </div>
        </div>

        {/* Demonstrator Notice Box (4 cols) */}
        <div className="lg:col-span-4 bg-surface-container-high/80 border border-[#242a3a] backdrop-blur-md rounded-xl p-space-md shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-space-xs mb-1">
              <span className="material-symbols-outlined text-tertiary text-[20px]">psychology</span>
              <span className="font-headline-md text-headline-md font-bold text-on-surface">Design Thinking Demo</span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
              RANGER-X demonstrates a zero-harm, Spider-Man-inspired wearable device engineering framework for wildland officers. Engineered with biodegradable soft nets and safe ultrasonic deterrence to prevent animal trauma.
            </p>
          </div>
          <div className="pt-space-sm flex items-center justify-between border-t border-[#242a3a]">
            <span className="font-label-caps text-label-caps text-primary font-mono">B.TECH ENG CONCEPT</span>
            <span className="font-label-caps text-label-caps text-tertiary font-semibold uppercase">
              100% NON-LETHAL SPEC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
