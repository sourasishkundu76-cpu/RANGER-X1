import React, { useState } from 'react';
import { useRanger } from '../context/RangerContext';

export const DeviceSettings: React.FC = () => {
  const { addLog } = useRanger();

  // Settings State
  const [loraBand, setLoraBand] = useState<string>('868.1');
  const [txPower, setTxPower] = useState<number>(14);
  const [sonarCycles, setSonarCycles] = useState<number>(8);
  const [hapticIntensity, setHapticIntensity] = useState<number>(75);
  const [buzzerMaxDb, setBuzzerMaxDb] = useState<number>(85);
  const [ecoMode, setEcoMode] = useState<boolean>(true);
  const [oledTimeout, setOledTimeout] = useState<string>('always');
  const [calibrating, setCalibrating] = useState<string | null>(null);

  const handleCalibrate = (sensorName: string) => {
    setCalibrating(sensorName);
    addLog('INFO', 'DIAGNOSTIC', `Calibrating ${sensorName}... collecting baseline samples...`);

    setTimeout(() => {
      setCalibrating(null);
      addLog('INFO', 'DIAGNOSTIC', `${sensorName} zero-offset calibration successful.`);
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-10">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-xl p-space-lg rounded-xl shadow-xl">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-space-sm py-0.5 rounded bg-surface-container-highest text-primary font-label-caps text-label-caps uppercase">
              HARDWARE CALIBRATION &amp; BUS
            </span>
            <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-mono">
              FIRMWARE: R-X-CORE-v2.4.9
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Device Settings &amp; Sensor Calibration
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Tune ESP32-S3 subsystem timings, LoRa RF transmission power, ultrasonic burst cycles, and tactile feedback intensity.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => {
              addLog('INFO', 'MODULE', 'All device settings synced to NVRAM flash.');
            }}
            className="px-4 py-2 rounded-lg bg-primary text-on-primary font-headline-md text-sm font-semibold hover:bg-primary-fixed transition-all shadow-md"
          >
            SAVE CONFIG TO FLASH
          </button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
        {/* Panel 1: RF & LoRa Mesh Communication */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl space-y-space-md">
          <div className="flex items-center gap-2 border-b border-[#242a3a] pb-2">
            <span className="material-symbols-outlined text-primary text-[22px]">cell_tower</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              LoRa &amp; RF Mesh Subsystem
            </h2>
          </div>

          <div className="space-y-space-sm">
            <div>
              <label className="font-label-caps text-xs text-on-surface-variant block uppercase mb-1">
                Carrier Frequency Band
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '868.1', label: '868.1 MHz (India / EU Standard)' },
                  { value: '915.0', label: '915.0 MHz (Americas ISM)' },
                ].map((band) => (
                  <button
                    key={band.value}
                    onClick={() => {
                      setLoraBand(band.value);
                      addLog('INFO', 'MESH', `Switched LoRa carrier to ${band.value} MHz.`);
                    }}
                    className={`p-2.5 rounded-lg border text-left text-xs font-mono transition-all ${
                      loraBand === band.value
                        ? 'bg-primary-container/20 border-primary text-primary font-bold'
                        : 'bg-surface-container border-[#242a3a] text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {band.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-on-surface-variant">TX RF OUTPUT POWER</span>
                <span className="text-primary font-bold">{txPower} dBm (25 mW)</span>
              </div>
              <input
                type="range"
                min="2"
                max="20"
                value={txPower}
                onChange={(e) => setTxPower(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                <span>2 dBm (Low)</span>
                <span>14 dBm (Nominal)</span>
                <span>20 dBm (Boost Range)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Acoustic & Sonar Pulse Settings */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl space-y-space-md">
          <div className="flex items-center gap-2 border-b border-[#242a3a] pb-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">hearing</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Ultrasonic Sonar Pulse Timing
            </h2>
          </div>

          <div className="space-y-space-sm">
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-on-surface-variant">40 kHz BURST PULSE CYCLE COUNT</span>
                <span className="text-secondary font-bold">{sonarCycles} CYCLES</span>
              </div>
              <input
                type="range"
                min="4"
                max="16"
                step="2"
                value={sonarCycles}
                onChange={(e) => setSonarCycles(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-secondary"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                <span>4 Cycles (Fast Low-Range)</span>
                <span>8 Cycles (Std JSN-SR04T)</span>
                <span>16 Cycles (High Penetration)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-on-surface-variant">PIEZO ALARM SOUND LIMITER</span>
                <span className="text-tertiary font-bold">{buzzerMaxDb} dB</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                value={buzzerMaxDb}
                onChange={(e) => setBuzzerMaxDb(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-tertiary"
              />
              <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                <span>60 dB (Gentle)</span>
                <span>85 dB (Safe Deterrent Limit)</span>
                <span>95 dB (Emergency)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 3: Haptic Engine & Ergonomics */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl space-y-space-md">
          <div className="flex items-center gap-2 border-b border-[#242a3a] pb-2">
            <span className="material-symbols-outlined text-tertiary text-[22px]">vibration</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Tactile Wrist Haptic Feedback
            </h2>
          </div>

          <div className="space-y-space-sm">
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-1">
                <span className="text-on-surface-variant">MOTOR INTENSITY</span>
                <span className="text-tertiary font-bold">{hapticIntensity}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={hapticIntensity}
                onChange={(e) => setHapticIntensity(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-tertiary"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#242a3a]/40">
              <div>
                <span className="font-label-caps text-xs text-on-surface font-bold block">
                  Power-Saving Eco Standby
                </span>
                <span className="text-xs text-on-surface-variant">
                  Throttle MCU down to 80MHz during motionless periods
                </span>
              </div>
              <input
                type="checkbox"
                checked={ecoMode}
                onChange={(e) => setEcoMode(e.target.checked)}
                className="h-4 w-4 rounded accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Panel 4: Sensor Baseline Calibration Tools */}
        <div className="bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl space-y-space-md">
          <div className="flex items-center gap-2 border-b border-[#242a3a] pb-2">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Sensor Zero Calibration Routines
            </h2>
          </div>

          <div className="space-y-2">
            {[
              { id: 'sonar', name: 'Zero Ultrasonic Transceiver Offset', desc: 'Recalibrates reflection baseline to zero point.' },
              { id: 'mpu', name: 'Tare MPU6050 6-Axis Gyroscope', desc: 'Sets current arm position as nominal upright vector.' },
              { id: 'pir', name: 'Re-arm PIR Pyroelectric Element', desc: 'Flushes thermal noise history from optical sensor.' },
            ].map((tool) => (
              <div
                key={tool.id}
                className="p-2.5 rounded-lg bg-surface-container border border-[#242a3a] flex items-center justify-between"
              >
                <div>
                  <div className="font-label-caps text-xs font-bold text-on-surface">{tool.name}</div>
                  <div className="text-[11px] text-on-surface-variant">{tool.desc}</div>
                </div>
                <button
                  disabled={calibrating !== null}
                  onClick={() => handleCalibrate(tool.name)}
                  className="px-3 py-1 bg-surface-container-highest border border-[#242a3a] rounded text-xs font-mono font-bold text-primary hover:bg-primary-container hover:text-on-primary transition-all disabled:opacity-50"
                >
                  {calibrating === tool.name ? 'SAMPLING...' : 'CALIBRATE'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
