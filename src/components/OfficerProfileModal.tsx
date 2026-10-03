import React from 'react';
import { useRanger } from '../context/RangerContext';
import officerPortraitImg from '../assets/images/officer_vance_portrait_1791016355598.jpg';

export const OfficerProfileModal: React.FC = () => {
  const { showOfficerModal, setShowOfficerModal, patrolActive, setPatrolActive, addLog } = useRanger();

  if (!showOfficerModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-surface-container-low border border-[#242a3a] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-space-lg py-3 border-b border-[#242a3a] bg-surface-container/60">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[22px]">badge</span>
            <div>
              <span className="font-headline-md text-headline-md font-bold text-on-surface">
                TACTICAL OFFICER DOSSIER
              </span>
              <span className="text-[11px] font-mono text-tertiary block">
                ID: VANCE-RS27 // ZONE 4 SECTOR ALPHA
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowOfficerModal(false)}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-lg overflow-y-auto space-y-space-md">
          {/* Top Profile Card */}
          <div className="flex flex-col sm:flex-row gap-space-md items-center sm:items-start bg-surface-container/80 p-space-md rounded-xl border border-[#242a3a]">
            {/* Officer Portrait */}
            <div className="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-primary/40 shrink-0 shadow-lg bg-surface-container-highest">
              <img
                src={officerPortraitImg}
                alt="Officer Vance - Senior Wildland Patrol Officer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute bottom-1 right-1 bg-surface-container-lowest/90 px-1.5 py-0.5 rounded text-[10px] text-tertiary font-mono">
                ACTIVE
              </div>
            </div>

            {/* Officer Meta */}
            <div className="flex-1 text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                <h3 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Officer Sarah Vance
                </h3>
                <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container font-label-caps text-label-caps uppercase">
                  LEAD RANGER
                </span>
              </div>
              <p className="font-body-md text-body-md text-secondary font-mono">
                Bandipur Tiger Reserve & Wildlife Sanctuary Division
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant text-xs leading-relaxed pt-1">
                21 years in wildland ecological monitoring, non-harmful animal dispersal, and bio-telemetry testing. Co-creator of the RANGER-X First-Year B.Tech Design Thinking field test specifications.
              </p>

              <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                <span className="bg-surface-container-highest px-2 py-1 rounded text-xs font-mono text-tertiary">
                  BADGE: #RS-27
                </span>
                <span className="bg-surface-container-highest px-2 py-1 rounded text-xs font-mono text-primary">
                  LORA ID: 0x92AF
                </span>
                <span className="bg-surface-container-highest px-2 py-1 rounded text-xs font-mono text-secondary">
                  FREQUENCY: 868.10 MHz
                </span>
              </div>
            </div>
          </div>

          {/* Vitals & Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm text-center">
            <div className="bg-surface-container-lowest p-space-sm rounded-lg border border-[#242a3a]">
              <span className="font-label-caps text-label-caps text-on-surface-variant block">BIOMETRIC HR</span>
              <span className="font-telemetry-lg text-telemetry-lg text-tertiary font-bold">68 <span className="text-xs font-normal text-on-surface-variant">BPM</span></span>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-lg border border-[#242a3a]">
              <span className="font-label-caps text-label-caps text-on-surface-variant block">SKIN TEMP</span>
              <span className="font-telemetry-lg text-telemetry-lg text-primary font-bold">36.6 <span className="text-xs font-normal text-on-surface-variant">°C</span></span>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-lg border border-[#242a3a]">
              <span className="font-label-caps text-label-caps text-on-surface-variant block">WRIST UNIT</span>
              <span className="font-telemetry-lg text-telemetry-lg text-secondary font-bold">MK-IV</span>
            </div>
            <div className="bg-surface-container-lowest p-space-sm rounded-lg border border-[#242a3a]">
              <span className="font-label-caps text-label-caps text-on-surface-variant block">SHIFT TIME</span>
              <span className="font-telemetry-lg text-telemetry-lg text-on-surface font-bold">04:42 <span className="text-xs font-normal text-on-surface-variant">HRS</span></span>
            </div>
          </div>

          {/* Gear & Safety Protocols */}
          <div className="bg-surface-container/70 p-space-md rounded-xl border border-[#242a3a] space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label-caps text-label-caps text-primary uppercase tracking-wider">
                Assigned Exo-Wearable Armature
              </span>
              <span className="text-xs font-mono text-tertiary">SAFE HARMFUL-FREE HARNESS</span>
            </div>
            <ul className="text-xs text-on-surface-variant space-y-1.5 list-disc list-inside">
              <li>Equipped with RANGER-X Gauntlet Chassis CAD V2.4 (Spider-Man inspired web-shooter non-harmful assist)</li>
              <li>Waterproof JSN-SR04T dual-transducer ultrasonic proximity sonar (40 kHz acoustic deterrent)</li>
              <li>FSR-402 pressure palm sensor primed with double-tap safety latch</li>
              <li>Cartridge Bay 01 loaded with CART-01: Soft Braided Kevlar Rescue Assist (0% ballistics, 100% bio-safe)</li>
            </ul>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-space-lg py-3 border-t border-[#242a3a] bg-surface-container/60 flex items-center justify-between">
          <button
            onClick={() => {
              setPatrolActive(!patrolActive);
              addLog('INFO', 'MODULE', `Patrol state toggled to ${!patrolActive ? 'ACTIVE' : 'STANDBY'} by Officer Vance.`);
            }}
            className={`px-4 py-2 rounded-lg font-headline-md text-sm font-semibold transition-all ${
              patrolActive
                ? 'bg-surface-container-highest text-on-surface hover:text-primary'
                : 'bg-primary text-on-primary'
            }`}
          >
            {patrolActive ? 'PAUSE PATROL ROUTE' : 'RESUME PATROL ROUTE'}
          </button>

          <button
            onClick={() => setShowOfficerModal(false)}
            className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-headline-md text-sm font-semibold hover:bg-primary transition-all"
          >
            CLOSE DOSSIER
          </button>
        </div>
      </div>
    </div>
  );
};
