import React from 'react';

export const ProjectInfo: React.FC = () => {
  return (
    <div className="flex flex-col w-full gap-space-lg pb-10">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-surface-container-low border border-[#242a3a] p-space-lg shadow-xl">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col gap-space-xs relative z-10">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-space-sm py-0.5 rounded bg-tertiary-container/30 text-tertiary font-label-caps text-label-caps uppercase flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">school</span>
              FIRST-YEAR B.TECH CAPSTONE DEMONSTRATOR
            </span>
            <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-mono">
              COURSE: DESIGN THINKING &amp; ENGINEERING PRACTICUM
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Project Info &amp; Design Thinking Architecture
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-4xl text-xs sm:text-sm">
            RANGER-X is a student-engineered, open-architecture wearable wildlife rescue exo-chassis inspired by comic-book web-shooters, re-engineered as a 100% humane, zero-harm bio-robotic protective tool for forest rangers.
          </p>
        </div>
      </div>

      {/* 5-Stage Design Thinking Process */}
      <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl space-y-space-md">
        <div className="flex items-center justify-between border-b border-[#242a3a] pb-space-sm">
          <div>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              The 5-Stage Design Thinking Framework
            </h2>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
              Human-Centered Ecological Engineering
            </span>
          </div>
          <span className="px-space-sm py-1 rounded bg-primary/10 text-primary font-mono text-xs font-bold">
            ISO 9241-210 COMPLIANT
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-space-md">
          {/* Phase 1: Empathize */}
          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs font-mono">
                  01
                </span>
                <span className="material-symbols-outlined text-[18px] text-primary">groups</span>
              </div>
              <h3 className="font-headline-md text-sm font-bold text-on-surface mb-1">
                Empathize
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">
                Interviewed field rangers in Bandipur Tiger Reserve. Discovered acute anxiety during sudden night encounters: chemical tranquilizer darts require 15 minutes to act and often cause animal death from dosage shock.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#242a3a] text-[10px] font-mono text-tertiary">
              KEY INSIGHT: Immediate acoustic deterrence saves both human &amp; animal lives.
            </div>
          </div>

          {/* Phase 2: Define */}
          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center font-bold text-xs font-mono">
                  02
                </span>
                <span className="material-symbols-outlined text-[18px] text-secondary">psychology_alt</span>
              </div>
              <h3 className="font-headline-md text-sm font-bold text-on-surface mb-1">
                Define
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">
                Problem Statement: "How might we engineer an affordable, hands-free wearable armature that alerts the officer silently before an attack and provides instantaneous, harmless deflection without carrying lethal firearms?"
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#242a3a] text-[10px] font-mono text-secondary">
              MANDATE: 100% non-lethal, zero-darts, budget under $45.
            </div>
          </div>

          {/* Phase 3: Ideate */}
          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-tertiary/20 text-tertiary flex items-center justify-center font-bold text-xs font-mono">
                  03
                </span>
                <span className="material-symbols-outlined text-[18px] text-tertiary">lightbulb</span>
              </div>
              <h3 className="font-headline-md text-sm font-bold text-on-surface mb-1">
                Ideate
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">
                Brainstormed pop-culture inspirations: Spider-Man's wrist web-shooters! Re-imagined the concept not as a weapon, but as a modular humane rescue gauntlet with soft magnetic loops, ultrasonic sonar, and haptic warnings.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#242a3a] text-[10px] font-mono text-tertiary">
              CONCEPT: Gauntlet chassis with interchangeable payload cartridges.
            </div>
          </div>

          {/* Phase 4: Prototype */}
          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-bold text-xs font-mono">
                  04
                </span>
                <span className="material-symbols-outlined text-[18px] text-primary">precision_manufacturing</span>
              </div>
              <h3 className="font-headline-md text-sm font-bold text-on-surface mb-1">
                Prototype
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">
                Fabricated physical MK-IV hardware: ESP32 dual-core MCU, waterproof ultrasonic sensor (JSN-SR04T), high-contrast OLED, 9g micro-servo release latch, and 3D printed resin cuff. Total BOM: exactly $41.80.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#242a3a] text-[10px] font-mono text-primary">
              RESULT: 142g weight, 14-hour LiPo runtime, 5-layer modular stack.
            </div>
          </div>

          {/* Phase 5: Test */}
          <div className="bg-surface-container border border-[#242a3a] p-space-md rounded-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="w-8 h-8 rounded-lg bg-tertiary-container/40 text-tertiary flex items-center justify-center font-bold text-xs font-mono">
                  05
                </span>
                <span className="material-symbols-outlined text-[18px] text-tertiary">fact_check</span>
              </div>
              <h3 className="font-headline-md text-sm font-bold text-on-surface mb-1">
                Test
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">
                Simulated 40+ brush standoff tests. Verified 96% echo confidence, instantaneous 20Hz haptic notification within 12ms, and 650N automatic line tension safety shutoff to guarantee zero compressive animal harm.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-[#242a3a] text-[10px] font-mono text-tertiary">
              VERIFIED: 100% bio-safe, zero mammal injury recorded.
            </div>
          </div>
        </div>
      </div>

      {/* Academic Budget Validation Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Budget Breakdown */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#242a3a] pb-2">
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Undergraduate Budget Compliance
            </h3>
            <span className="text-xs font-mono font-bold text-tertiary">
              TOTAL: $41.80 / LIMIT $45.00
            </span>
          </div>

          <p className="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed">
            All components were rigorously selected from educational catalog vendors to ensure any university engineering team can replicate the RANGER-X hardware without commercial enterprise grants:
          </p>

          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-on-surface">
              <span>ESP32-WROOM-32 (Logic &amp; BLE)</span>
              <span className="text-tertiary font-bold">$4.80</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>JSN-SR04T Waterproof Ultrasonic Transceiver</span>
              <span className="text-tertiary font-bold">$3.70</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>SH1106 1.3" Monochrome OLED Screen</span>
              <span className="text-tertiary font-bold">$2.90</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>Mini PIR HC-SR505 Pyroelectric Sensor</span>
              <span className="text-tertiary font-bold">$1.20</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>MG90S Miniature Metal-Gear Servo</span>
              <span className="text-tertiary font-bold">$2.50</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>Piezo Buzzer + Coin Haptic Motor</span>
              <span className="text-tertiary font-bold">$1.50</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>LiPo 650mAh Battery Cell + TP4056</span>
              <span className="text-tertiary font-bold">$4.20</span>
            </div>
            <div className="flex justify-between text-on-surface">
              <span>Custom 3D Resin Print Chassis &amp; Strap</span>
              <span className="text-tertiary font-bold">$21.00</span>
            </div>
          </div>
        </div>

        {/* Ethical Wildlife Guidelines */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[#242a3a] pb-2">
            <h3 className="font-headline-md text-sm font-bold text-on-surface">
              Ethical Wildlife Guidelines (WWF &amp; IUCN Aligned)
            </h3>
            <span className="text-xs font-mono font-bold text-primary">
              NON-LETHAL STD
            </span>
          </div>

          <ul className="text-xs text-on-surface-variant space-y-2 list-disc list-inside">
            <li>
              <strong className="text-on-surface">No Chemical Sedatives:</strong> Eliminates systemic organ failure, hypothermia, and accidental overdose in skittish ungulates and wild canids.
            </li>
            <li>
              <strong className="text-on-surface">Safe Acoustic Thresholds:</strong> Frequencies are limited to 85dB at 10cm, preventing ear canal trauma while inducing natural animal flight reflexes.
            </li>
            <li>
              <strong className="text-on-surface">Dynamic Mechanical Strain Relief:</strong> The tether brushless reel dynamically measures load 500 times per second to release tension if an animal thrashes.
            </li>
            <li>
              <strong className="text-on-surface">Biodegradable Tether Materials:</strong> Even if a line is severed in dense thorn brush, the poly-lactic fiber safely dissolves within 30 days without choking flora.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
