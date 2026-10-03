import React, { useState, useEffect, useRef } from 'react';
import { useRanger } from '../context/RangerContext';

export const EmergencySOSModal: React.FC = () => {
  const { showSosModal, setShowSosModal, sosActive, setSosActive, addLog } = useRanger();
  const [holding, setHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Hold-to-confirm progress logic
  useEffect(() => {
    if (holding) {
      holdIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(holdIntervalRef.current!);
            setSosActive(true);
            addLog('CRIT', 'MESH', '🚨 EMERGENCY SOS INITIATED! LoRa Mesh Flood active. GPS: 11°42\'18"N 76°38\'22"E.');
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    } else {
      if (holdIntervalRef.current) {
        clearInterval(holdIntervalRef.current);
      }
      setProgress(0);
    }

    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [holding, setSosActive, addLog]);

  if (!showSosModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-surface-container-low border border-error/50 rounded-2xl shadow-[0_0_36px_rgba(239,68,68,0.3)] overflow-hidden flex flex-col">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-space-lg py-3 border-b border-[#242a3a] bg-error-container/20">
          <div className="flex items-center gap-space-xs text-error">
            <span className="material-symbols-outlined text-[24px] animate-pulse">crisis_alert</span>
            <span className="font-headline-md text-headline-md font-bold text-error">
              CRITICAL EMERGENCY SOS OVERRIDE
            </span>
          </div>
          <button
            onClick={() => setShowSosModal(false)}
            className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-space-lg space-y-space-md">
          {sosActive ? (
            <div className="bg-error/15 border border-error p-space-md rounded-xl text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-error text-on-error flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(239,68,68,0.5)] animate-bounce">
                <span className="material-symbols-outlined text-[36px]">e911_emergency</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg font-bold text-error">
                DISTRESS BEACON TRANSMITTING
              </h3>
              <p className="font-body-md text-body-md text-on-surface">
                LoRa 868MHz Mesh Flood is broadcasting on Channel 04 Alpha. Neighboring ranger nodes and base dispatch are alerted.
              </p>
              <div className="bg-surface-container-lowest p-2 rounded font-mono text-xs text-secondary">
                COORDINATES: 11°42'18"N 76°38'22"E • PACKET_ID: #EMG-9941
              </div>
            </div>
          ) : (
            <div className="space-y-space-md">
              <div className="bg-surface-container p-space-md rounded-xl border border-[#242a3a] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-on-surface-variant">NODE: RX-FIELD-092A</span>
                  <span className="text-tertiary">BATTERY: 93%</span>
                </div>
                <div className="text-sm text-on-surface">
                  Activating Emergency SOS will:
                </div>
                <ul className="text-xs text-on-surface-variant space-y-1 list-disc list-inside">
                  <li>Flood all mesh radios with your instant GPS telemetry vector</li>
                  <li>Sound high-intensity 85dB piezo acoustic homing beacon</li>
                  <li>Engage 1200-lumen emergency strobing optical marker on gauntlet</li>
                  <li>Request immediate wildlife vet &amp; rapid ranger backup to Sector 04</li>
                </ul>
              </div>

              {/* Hold to activate action */}
              <div className="flex flex-col items-center justify-center p-space-md bg-surface-container-lowest rounded-xl border border-[#242a3a] text-center space-y-3">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
                  Press and hold for 3 seconds to confirm
                </span>

                <button
                  onMouseDown={() => setHolding(true)}
                  onMouseUp={() => setHolding(false)}
                  onMouseLeave={() => setHolding(false)}
                  onTouchStart={() => setHolding(true)}
                  onTouchEnd={() => setHolding(false)}
                  className="relative overflow-hidden w-full max-w-xs py-4 px-6 rounded-xl bg-error hover:bg-error-container text-on-error font-headline-md text-headline-md font-bold tracking-wider shadow-[0_0_24px_rgba(239,68,68,0.4)] active:scale-95 transition-all select-none"
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-[24px]">sos</span>
                    <span>{holding ? `HOLDING (${Math.round(progress)}%)` : 'HOLD SOS (3 SEC)'}</span>
                  </div>

                  {/* Progress fill bar */}
                  <div
                    className="absolute bottom-0 left-0 h-1.5 bg-white transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </button>

                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soundEnabled}
                      onChange={(e) => setSoundEnabled(e.target.checked)}
                      className="rounded accent-error"
                    />
                    <span>Audible Piezo Siren Confirmation</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-space-lg py-3 border-t border-[#242a3a] bg-surface-container/60 flex items-center justify-between">
          {sosActive ? (
            <button
              onClick={() => {
                setSosActive(false);
                addLog('INFO', 'MESH', 'Emergency SOS cleared by officer. Returning to normal patrol mesh.');
              }}
              className="px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface hover:text-tertiary font-headline-md text-sm font-semibold transition-all"
            >
              CANCEL / CLEAR SOS STATE
            </button>
          ) : (
            <button
              onClick={() => {
                setSosActive(true);
                addLog('CRIT', 'MESH', '🚨 EMERGENCY SOS QUICK-TRIGGERED! LoRa Mesh Flood active. GPS: 11°42\'18"N 76°38\'22"E.');
              }}
              className="px-3 py-1.5 rounded-lg bg-surface-container text-xs text-error hover:bg-error hover:text-on-error transition-all"
            >
              Instant Quick-Trigger (Bypass Hold)
            </button>
          )}

          <button
            onClick={() => setShowSosModal(false)}
            className="px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface font-headline-md text-sm font-semibold hover:bg-surface-container transition-all"
          >
            CLOSE WINDOW
          </button>
        </div>
      </div>
    </div>
  );
};
