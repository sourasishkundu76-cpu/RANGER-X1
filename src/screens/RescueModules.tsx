import React, { useState } from 'react';
import { useRanger, CARTRIDGES_CATALOG } from '../context/RangerContext';
import { CartridgeInfo } from '../types';

export const RescueModules: React.FC = () => {
  const { activeCartridge, setActiveCartridge, addLog } = useRanger();
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployStepText, setDeployStepText] = useState<string>('LATCHED: 100%');
  const [deployValText, setDeployValText] = useState<string>(activeCartridge?.capacityValue || '15.0 M');
  const [dockStatus, setDockStatus] = useState<string>(activeCartridge ? 'CARTRIDGE ARMED' : 'BAY EMPTY');
  const [pinOffset, setPinOffset] = useState<number>(0);

  const handleSelectCartridge = (cart: CartridgeInfo) => {
    // Unlatch animation
    setPinOffset(12);
    setDockStatus('LOCKING...');

    setTimeout(() => {
      setPinOffset(0);
      setActiveCartridge(cart);
      setDeployValText(cart.capacityValue);
      setDeployStepText(cart.specText);
      setDockStatus('CARTRIDGE ARMED');
      addLog('INFO', 'MODULE', `Cartridge bay loaded with ${cart.code}: ${cart.name}.`);
    }, 350);
  };

  const handleCycleTestDeploy = () => {
    if (!activeCartridge) return;
    setIsDeploying(true);
    setDockStatus('CYCLE ACTIVE');
    addLog('INFO', 'MODULE', `Initiated automated deployment cycle for ${activeCartridge.code}...`);

    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step === 1) {
        setDeployValText('8.4 M');
        setDeployStepText('DEPLOYING TETHER');
      } else if (step === 2) {
        setDeployValText('15.0 M');
        setDeployStepText('MAGNETIC GRIP ENGAGED');
      } else if (step === 3) {
        setDeployValText('4.2 M');
        setDeployStepText('SMOOTH REEL REWIND');
      } else if (step >= 4) {
        clearInterval(interval);
        setDeployValText(activeCartridge.capacityValue);
        setDeployStepText('LATCHED: 100%');
        setDockStatus('CYCLE COMPLETE');
        setIsDeploying(false);
        addLog('INFO', 'MODULE', `Deployment cycle finished successfully. Line recoiled without resistance.`);
      }
    }, 600);
  };

  const handleEject = () => {
    setPinOffset(16);
    setActiveCartridge(null);
    setDeployValText('---');
    setDeployStepText('UNLATCHED');
    setDockStatus('BAY EMPTY');
    addLog('WARN', 'MODULE', 'Cartridge ejected from Bay 01. Docking station is empty.');
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Safety Protocol Banner */}
      <div className="relative overflow-hidden rounded-xl bg-tertiary-container/15 border border-tertiary/30 p-space-md mb-margin-lg shadow-lg">
        <div className="absolute -right-16 -top-16 w-52 h-52 bg-tertiary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md relative z-10">
          <div className="flex items-center gap-space-md">
            <div className="w-12 h-12 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary-container shadow-md shrink-0">
              <span className="material-symbols-outlined text-[26px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded bg-tertiary/20 text-tertiary font-label-caps text-label-caps uppercase">
                  Ethical Hardware Directive
                </span>
                <span className="font-telemetry-sm text-telemetry-sm text-tertiary-fixed-dim font-mono">
                  STD-ETHIC-701.REV4
                </span>
              </div>
              <p className="font-headline-md text-headline-md font-semibold text-on-surface mt-0.5">
                SAFE HARMLESS TECHNOLOGY DEMONSTRATOR
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-3xl text-xs sm:text-sm">
                Zero darts, zero chemical sedatives, zero sharp ballistics. Built on 100% humane, non-invasive bio-robotic assist engineering designed strictly for field protection and environmental conservation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-space-sm bg-surface-container-high border border-[#242a3a] px-space-md py-1.5 rounded-lg text-tertiary self-stretch md:self-auto justify-center">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-ping" />
            <span className="font-label-caps text-label-caps uppercase tracking-wider">
              BIO-CONSERVATION COMPLIANT
            </span>
          </div>
        </div>
      </div>

      {/* Main Workbench: Docking Station + Cartridge Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg mb-margin-lg">
        {/* Left: Tactical Docking Station // Bay 01 (5 cols) */}
        <div className="xl:col-span-5 flex flex-col gap-space-md">
          <div className="rounded-xl bg-surface-container-low border border-[#242a3a] p-space-lg flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between pb-space-sm">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-primary">view_in_ar</span>
                <span className="font-label-caps text-label-caps tracking-widest text-on-surface-variant uppercase">
                  TACTICAL DOCKING STATION // BAY 01
                </span>
              </div>
              <span
                className={`px-space-xs py-0.5 rounded font-label-caps text-label-caps uppercase tracking-wide ${
                  activeCartridge
                    ? 'bg-primary/20 text-primary border border-primary/40'
                    : 'bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                {dockStatus}
              </span>
            </div>

            {/* 3D Wireframe Visualization SVG */}
            <div className="relative z-10 my-space-md bg-surface-container-lowest/80 border border-[#242a3a] rounded-lg p-space-md flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-space-xs text-on-surface-variant">
                <span className="font-telemetry-sm text-telemetry-sm text-primary font-mono">
                  {activeCartridge ? `SEC: ${activeCartridge.code}` : 'SEC: EMPTY'}
                </span>
                <span className="font-label-caps text-label-caps text-outline">MAGNETIC CLAMP LATCH</span>
              </div>

              <div className="w-full h-56 relative flex items-center justify-center">
                <svg className="w-full h-full text-primary" fill="none" viewBox="0 0 400 240">
                  {/* Wrist Module Chassis */}
                  <rect x="50" y="40" width="300" height="160" rx="16" fill="#151b2b" stroke="#3e4850" strokeWidth="2" />
                  <path d="M50 70H350M50 170H350" stroke="#242a3a" strokeDasharray="4 4" />

                  {/* Cartridge Insertion Chamber */}
                  <rect
                    x="120"
                    y="55"
                    width="160"
                    height="130"
                    rx="8"
                    fill="#080e1d"
                    stroke={activeCartridge ? '#0ea5e9' : '#3e4850'}
                    strokeWidth="2"
                  />

                  {/* Locking Pins */}
                  <rect
                    x={105 - pinOffset}
                    y="110"
                    width="15"
                    height="20"
                    rx="2"
                    fill={activeCartridge ? '#4edea3' : '#3e4850'}
                    className="transition-transform duration-500"
                  />
                  <rect
                    x={280 + pinOffset}
                    y="110"
                    width="15"
                    height="20"
                    rx="2"
                    fill={activeCartridge ? '#4edea3' : '#3e4850'}
                    className="transition-transform duration-500"
                  />

                  {/* Core Cartridge Schematics */}
                  {activeCartridge ? (
                    <>
                      <circle
                        cx="200"
                        cy="120"
                        r="45"
                        stroke="#89ceff"
                        strokeDasharray="6 3"
                        strokeWidth="2"
                        className="animate-[spin_10s_linear_infinite]"
                      />
                      <circle cx="200" cy="120" r="28" fill="#191f2f" stroke="#00dbe9" strokeWidth="1.5" />
                      <circle cx="200" cy="120" r="8" fill={activeCartridge.color} className="animate-pulse" />
                      <path d="M280 120H330M330 115L345 120L330 125Z" stroke="#4edea3" strokeLinecap="round" strokeWidth="2" />
                    </>
                  ) : (
                    <text x="200" y="125" fill="#88929b" fontFamily="Inter" fontSize="12" textAnchor="middle">
                      NO CARTRIDGE MOUNTED
                    </text>
                  )}

                  <text x="70" y="215" fill="#88929b" className="font-telemetry-sm text-[10px]">
                    TENSION-SENSE: 0.0 KG
                  </text>
                  <text
                    x="250"
                    y="215"
                    fill={activeCartridge ? '#4edea3' : '#88929b'}
                    className="font-telemetry-sm text-[10px] font-mono"
                  >
                    {deployStepText}
                  </text>
                </svg>
              </div>

              {/* Audio & Firmware Bar */}
              <div className="w-full bg-surface-container border border-[#242a3a] rounded-lg p-space-sm flex items-center justify-between">
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px] text-tertiary">memory</span>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant">FIRMWARE LINK</span>
                    <span className="font-telemetry-sm text-telemetry-sm text-on-surface font-mono">
                      {activeCartridge?.firmware || 'NO LINK'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-space-xs text-right">
                  <span className="material-symbols-outlined text-[16px] text-secondary">power</span>
                  <span className="font-telemetry-sm text-telemetry-sm text-secondary font-mono">
                    {activeCartridge?.powerDraw || '0.0W IDLE'}
                  </span>
                </div>
              </div>
            </div>

            {/* Simulated Wrist OLED Mirror */}
            <div className="relative z-10 bg-surface-container-highest/60 border border-[#242a3a] rounded-xl p-space-md">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-caps text-label-caps text-primary uppercase">
                  Wrist OLED Telemetry Display
                </span>
                <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-mono">
                  {activeCartridge ? 'SYNC READY' : 'STANDBY'}
                </span>
              </div>
              <div className="bg-surface-container-lowest border border-[#242a3a] rounded-lg p-space-sm flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md text-primary font-bold">
                    {activeCartridge ? `CRTG 0${activeCartridge.id} // ${activeCartridge.badgeTag}` : 'BAY EMPTY'}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant text-xs">
                    {activeCartridge ? activeCartridge.subtitle : 'Select a cartridge from the matrix'}
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold font-mono">
                    {deployValText}
                  </span>
                  <span className="font-label-caps text-label-caps text-outline">
                    {activeCartridge?.capacityLabel || 'STATUS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Dock Control Actions */}
            <div className="relative z-10 flex items-center gap-space-sm pt-space-md">
              <button
                disabled={!activeCartridge || isDeploying}
                onClick={handleCycleTestDeploy}
                className="flex-1 flex items-center justify-center gap-space-xs py-2.5 px-space-md rounded-lg bg-primary-container text-on-primary font-headline-md text-headline-md font-semibold hover:bg-primary transition-all shadow-md disabled:opacity-50"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isDeploying ? 'sync' : 'play_arrow'}
                </span>
                <span>{isDeploying ? 'SIMULATING CYCLE...' : 'CYCLE TEST DEPLOY'}</span>
              </button>

              <button
                disabled={!activeCartridge || isDeploying}
                onClick={handleEject}
                className="flex items-center justify-center gap-space-xs py-2.5 px-space-md rounded-lg bg-surface-container-high border border-[#242a3a] text-on-surface hover:bg-surface-bright transition-all disabled:opacity-50"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">eject</span>
                <span className="font-body-md text-body-md">EJECT</span>
              </button>
            </div>
          </div>

          {/* Quick Safety Metrics Panel */}
          <div className="grid grid-cols-3 gap-space-sm">
            <div className="bg-surface-container-low border border-[#242a3a] p-space-sm rounded-lg flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant">MAX IMPACT</span>
              <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold font-mono mt-1">0.0 N</span>
              <span className="font-label-caps text-label-caps text-tertiary">100% NON-BALLISTIC</span>
            </div>
            <div className="bg-surface-container-low border border-[#242a3a] p-space-sm rounded-lg flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant">RELOAD DURATION</span>
              <span className="font-telemetry-lg text-telemetry-lg text-secondary font-bold font-mono mt-1">1.8 SEC</span>
              <span className="font-label-caps text-label-caps text-on-surface-variant">TOOLLESS SNAP</span>
            </div>
            <div className="bg-surface-container-low border border-[#242a3a] p-space-sm rounded-lg flex flex-col">
              <span className="font-label-caps text-label-caps text-on-surface-variant">FAIL-SAFE</span>
              <span className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold font-mono mt-1">ACTIVE</span>
              <span className="font-label-caps text-label-caps text-tertiary">AUTO-RELEASE LOCK</span>
            </div>
          </div>
        </div>

        {/* Right: 6-Cartridge Rapid Interchange Matrix (7 cols) */}
        <div className="xl:col-span-7 flex flex-col gap-space-md">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-caps text-label-caps tracking-widest text-primary uppercase">
                Modular Ecosystem
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                6-Cartridge Rapid Interchange Matrix
              </h2>
            </div>
            <span className="font-label-caps text-label-caps text-on-surface-variant hidden sm:inline">
              CLICK CARTRIDGE TO ENGAGE BAY 01
            </span>
          </div>

          {/* Interactive Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {CARTRIDGES_CATALOG.map((cart) => {
              const isSelected = activeCartridge?.id === cart.id;
              return (
                <div
                  key={cart.id}
                  onClick={() => handleSelectCartridge(cart)}
                  className={`group cursor-pointer bg-surface-container-low border hover:bg-surface-container p-space-md rounded-xl transition-all duration-300 shadow-md relative overflow-hidden ${
                    isSelected ? 'ring-2 ring-primary border-primary' : 'border-[#242a3a]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-space-sm">
                    <div className="flex items-center gap-space-sm">
                      <div className={`w-10 h-10 rounded-lg ${cart.accentBg} flex items-center justify-center text-white shadow-md`}>
                        <span className="material-symbols-outlined text-[22px]">{cart.icon}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-caps text-label-caps text-primary tracking-wider uppercase">
                          {cart.code}
                        </span>
                        <span className="font-headline-md text-headline-md font-semibold text-on-surface">
                          {cart.name}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-space-xs py-0.5 rounded font-label-caps text-label-caps uppercase ${
                        isSelected
                          ? 'bg-primary/20 text-primary border border-primary/40 font-bold'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {isSelected ? 'DOCKED' : 'STANDBY'}
                    </span>
                  </div>

                  <p className="font-body-md text-body-md text-on-surface-variant text-xs mb-space-sm">
                    {cart.description}
                  </p>

                  <div className="bg-surface-container-lowest/80 border border-[#242a3a] rounded-lg p-space-sm mb-space-sm space-y-1">
                    {cart.specs.map((s, idx) => (
                      <div key={idx} className="flex justify-between font-telemetry-sm text-xs font-mono">
                        <span className="text-on-surface-variant">{s.label}</span>
                        <span className={s.color || 'text-on-surface'}>{s.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-space-xs">
                    <span className="font-label-caps text-label-caps text-tertiary flex items-center gap-1">
                      {cart.badgeLabel}
                    </span>
                    <span className="font-label-caps text-label-caps text-primary group-hover:translate-x-1 transition-transform">
                      {isSelected ? 'ACTIVE DOCK' : 'SELECT →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lower Section: Soft Tether & Non-Invasive Rescue Mechanics */}
      <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md pb-space-md mb-space-md border-b border-[#242a3a]">
          <div>
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-tertiary text-[18px]">lock_reset</span>
              <span className="font-label-caps text-label-caps tracking-widest text-tertiary uppercase">
                ENGINEERING BREAKDOWN
              </span>
            </div>
            <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
              Soft Tether &amp; Non-Invasive Rescue Mechanics
            </h3>
          </div>
          <div className="flex items-center gap-space-sm">
            <span className="px-space-md py-1.5 rounded-lg bg-surface-container border border-[#242a3a] text-on-surface-variant font-label-caps text-label-caps uppercase font-mono">
              TENSION LIMITER: 650N CUT-OFF
            </span>
            <span className="px-space-md py-1.5 rounded-lg bg-tertiary-container/30 text-tertiary font-label-caps text-label-caps uppercase font-semibold">
              BIO-CONTACT SAFE
            </span>
          </div>
        </div>

        {/* 4-Phase Flowchart */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-telemetry-sm text-telemetry-sm text-primary font-bold font-mono">PHASE 01</span>
              <span className="material-symbols-outlined text-primary text-[20px]">adjust</span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md font-semibold text-on-surface mb-1">
                Magnetic Auto-Guide
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs">
                Neodymium soft-cushioned ring projects forward via spring-assist guidance; zero explosive propellants or pneumatic spikes.
              </p>
            </div>
            <div className="pt-space-md">
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary w-full" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-telemetry-sm text-telemetry-sm text-secondary font-bold font-mono">PHASE 02</span>
              <span className="material-symbols-outlined text-secondary text-[20px]">gesture</span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md font-semibold text-on-surface mb-1">
                Soft-Jaw Latch
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs">
                Silicone-encased passive jaws clasp gently onto animal limbs or dropped radio chassis without compressive injury.
              </p>
            </div>
            <div className="pt-space-md">
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-full" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-bold font-mono">PHASE 03</span>
              <span className="material-symbols-outlined text-tertiary text-[20px]">speed</span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md font-semibold text-on-surface mb-1">
                Tension Feedback
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs">
                Internal strain gauge samples load at 500Hz; if resistance exceeds bio-safe thresholds, motor instantly yields slack.
              </p>
            </div>
            <div className="pt-space-md">
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-tertiary w-full" />
              </div>
            </div>
          </div>

          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-lg flex flex-col justify-between">
            <div className="flex items-center justify-between mb-space-sm">
              <span className="font-telemetry-sm text-telemetry-sm text-tertiary-fixed-dim font-bold font-mono">PHASE 04</span>
              <span className="material-symbols-outlined text-tertiary-fixed-dim text-[20px]">published_with_changes</span>
            </div>
            <div>
              <h4 className="font-headline-md text-headline-md font-semibold text-on-surface mb-1">
                Smooth Electric Rewind
              </h4>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs">
                Micro-geared brushless motor reels line back at an exact 0.35 m/s controlled speed, safely bringing target into ranger perimeter.
              </p>
            </div>
            <div className="pt-space-md">
              <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-tertiary-fixed-dim w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
