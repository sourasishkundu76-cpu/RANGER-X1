import React, { useState } from 'react';
import { useRanger } from '../context/RangerContext';

interface Scenario {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  initialDist: number;
  initialTemp: number;
  icon: string;
  description: string;
  expectedOutcome: string;
  steps: { time: string; action: string; sensorReading: string }[];
}

const SCENARIOS: Scenario[] = [
  {
    id: 'boar',
    title: 'Wild Boar Sudden Standoff Encroachment',
    category: 'Proximity Threat',
    difficulty: 'Moderate',
    initialDist: 32,
    initialTemp: 24.3,
    icon: 'pets',
    description: 'A 110kg wild boar charges from dense undergrowth into the 35cm standoff zone. The wearable must trigger automatic piezo frequency sweeps (2.7kHz) and alert the ranger via 20Hz haptic tap without startling nearby wildlife.',
    expectedOutcome: 'Animal turns away at 30cm perimeter boundary; zero projectile trauma.',
    steps: [
      { time: 'T+0.0s', action: 'PIR Pyroelectric dome detects high biological thermal delta in brush.', sensorReading: 'PIR=HIGH | DELTA_T=+4.8°C' },
      { time: 'T+0.4s', action: 'HC-SR04 ultrasonic echo detects range dropping from 120cm to 32cm.', sensorReading: 'US_DIST=32.4cm [ALERT]' },
      { time: 'T+0.8s', action: 'Piezo buzzer begins 85dB swept ultrasonic pulse (18kHz-24kHz).', sensorReading: 'PWM_FREQ=21.2kHz' },
      { time: 'T+1.5s', action: 'Target deflects trajectory; standoff distance climbs to 85cm.', sensorReading: 'US_DIST=85.0cm [RECOVERED]' },
    ],
  },
  {
    id: 'fawn',
    title: 'Trapped Fawn Rescue in Steep Ravine',
    category: 'Soft Tether Assist',
    difficulty: 'Precision',
    initialDist: 150,
    initialTemp: 24.0,
    icon: 'healing',
    description: 'An injured young fawn is pinned in a 12-meter ravine. The officer engages Cartridge 01 (Soft Tether), releasing the magnetic spring-jaw loop with automatic 650N tension safety shutoff.',
    expectedOutcome: 'Tether secures fawn limb non-compressively; gentle 0.35m/s motorized recoil brings fawn to safety.',
    steps: [
      { time: 'T+0.0s', action: 'Officer selects CART-01 and aims gauntlet down ravine alignment.', sensorReading: 'AIM_PITCH=-42°' },
      { time: 'T+0.5s', action: 'Palm pressure sensor FSR-402 dual-tap authorizes solenoid release.', sensorReading: 'FSR_PALM=12.4N [CONFIRMED]' },
      { time: 'T+1.2s', action: 'Soft braided Kevlar line deploys 12.0m; magnetic soft jaws latch.', sensorReading: 'TETH_LEN=12.0m | SENSOR=LATCHED' },
      { time: 'T+3.0s', action: 'Brushless electric reel rewinds line under continuous strain check.', sensorReading: 'TENSION=18.4kg (SAFE < 65kg)' },
    ],
  },
  {
    id: 'fire',
    title: 'Nocturnal Smoldering Bushfire Hotspot',
    category: 'Eco Sensor Pod',
    difficulty: 'Critical',
    initialDist: 180,
    initialTemp: 48.5,
    icon: 'local_fire_department',
    description: 'Under dense nocturnal canopy, an unseen root fire smolders beneath leaves. Cartridge 04 (Eco Sensor Pod) detects toxic carbon monoxide (CO) and micro-bolometer thermal anomaly before flame erupts.',
    expectedOutcome: 'Early thermal warning dispatched to base stations before crown fire escalation.',
    steps: [
      { time: 'T+0.0s', action: 'Micro gas spectrometer detects elevated CO and volatile organic compounds.', sensorReading: 'CO=48ppm [ELEVATED]' },
      { time: 'T+0.6s', action: 'Lepton LWIR thermal sensor detects 52.4°C ground hotspot 15m ahead.', sensorReading: 'HOTSPOT=52.4°C' },
      { time: 'T+1.2s', action: 'Gauntlet OLED flashes thermal sector warning and alerts nearby mesh nodes.', sensorReading: 'MESH_BROADCAST=FIRE_HOTSPOT' },
    ],
  },
  {
    id: 'fall',
    title: 'Officer Slip & Immobility Detection',
    category: 'Man-Down Sentinel',
    difficulty: 'Critical',
    initialDist: 120,
    initialTemp: 24.3,
    icon: 'accessibility_new',
    description: 'During a steep escarpment patrol, the officer slips. The MPU6050 accelerometer registers a 0.0G freefall pulse followed by 10 seconds of motionless horizontal tilt, initiating auto-SOS.',
    expectedOutcome: 'Automatic distress beacon triggers without needing manual input from incapacitated officer.',
    steps: [
      { time: 'T+0.0s', action: 'MPU6050 registers 0.02G freefall event for 420ms.', sensorReading: 'ACCEL=0.02G [FREEFALL]' },
      { time: 'T+0.5s', action: 'High-impact landing pulse recorded (+4.8G spike) followed by 88° horizontal tilt.', sensorReading: 'TILT=88.2° [HORIZONTAL]' },
      { time: 'T+5.0s', action: '10-second motionless countdown initiates with tactile wrist pulse.', sensorReading: 'TIMER=5s TO DISPATCH' },
      { time: 'T+10.0s', action: 'Auto-SOS triggers LoRa mesh flood to Sector 04 Alpha base.', sensorReading: 'SOS_AUTO_SENT' },
    ],
  },
];

export const IncidentSimulator: React.FC = () => {
  const { setDistanceCm, addLog, setSosActive } = useRanger();
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('boar');
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simProgress, setSimProgress] = useState<number>(0);
  const [simStepIndex, setSimStepIndex] = useState<number>(-1);
  const [simComplete, setSimComplete] = useState<boolean>(false);

  const scenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0];

  const handleRunSimulation = () => {
    setSimRunning(true);
    setSimProgress(0);
    setSimStepIndex(0);
    setSimComplete(false);

    // Apply scenario initial state
    setDistanceCm(scenario.initialDist);
    addLog('INFO', 'DIAGNOSTIC', `Starting Incident Scenario: "${scenario.title}"...`);

    const totalSteps = scenario.steps.length;
    scenario.steps.forEach((step, idx) => {
      setTimeout(() => {
        setSimStepIndex(idx);
        setSimProgress(Math.round(((idx + 1) / totalSteps) * 100));

        if (scenario.id === 'boar' && idx === 1) {
          setDistanceCm(28);
        } else if (scenario.id === 'boar' && idx === 3) {
          setDistanceCm(85);
        } else if (scenario.id === 'fall' && idx === 3) {
          setSosActive(true);
        }

        if (idx === totalSteps - 1) {
          setSimRunning(false);
          setSimComplete(true);
          addLog('INFO', 'DIAGNOSTIC', `Scenario "${scenario.title}" completed. Outcome verified: ${scenario.expectedOutcome}`);
        }
      }, (idx + 1) * 900);
    });
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-xl p-space-lg rounded-xl shadow-xl">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-space-sm py-0.5 rounded bg-secondary-container/20 text-secondary font-label-caps text-label-caps uppercase flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-[14px]">model_training</span>
              ACADEMIC INCIDENT SIMULATOR
            </span>
            <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-mono">
              ENGINE: RANGER-SIM v2.4
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Interactive Field Incident Simulator
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Evaluate RANGER-X non-lethal algorithms, sensor reaction times, and automated rescue sequences in controlled virtual trials.
          </p>
        </div>

        <button
          disabled={simRunning}
          onClick={handleRunSimulation}
          className="flex items-center gap-2 px-space-lg py-2.5 rounded-lg bg-primary-container text-on-primary font-headline-md text-sm font-semibold hover:bg-primary transition-all shadow-md disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[20px]">
            {simRunning ? 'sync' : 'play_arrow'}
          </span>
          <span>{simRunning ? `SIMULATING (${simProgress}%)` : 'RUN SCENARIO SIMULATION'}</span>
        </button>
      </div>

      {/* Main Grid: Scenario Selector + Live Simulation Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left: 4 Scenario Cards (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-space-sm">
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-wider">
            Select Training Scenario
          </span>

          {SCENARIOS.map((s) => {
            const isSelected = s.id === selectedScenarioId;
            return (
              <div
                key={s.id}
                onClick={() => {
                  if (!simRunning) {
                    setSelectedScenarioId(s.id);
                    setSimStepIndex(-1);
                    setSimComplete(false);
                    setSimProgress(0);
                  }
                }}
                className={`p-space-md rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-surface-container-high border-primary ring-1 ring-primary shadow-lg'
                    : 'bg-surface-container-low border-[#242a3a] hover:bg-surface-container'
                } ${simRunning ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">{s.icon}</span>
                    <span className="font-headline-md text-sm font-bold text-on-surface">{s.title}</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-[10px] font-mono text-tertiary">
                    {s.difficulty}
                  </span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-xs line-clamp-2">
                  {s.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#242a3a]/60 text-[10px] text-on-surface-variant">
                  <span className="text-secondary font-mono">{s.category}</span>
                  <span className="text-primary font-bold">{isSelected ? 'ACTIVE' : 'SELECT'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Simulation Stage & Telemetry Timeline (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm border-b border-[#242a3a]">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                  {scenario.title}
                </h2>
                <span className="font-label-caps text-label-caps text-secondary font-mono">
                  {scenario.category} • TARGET: 100% NON-LETHAL
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
                simComplete ? 'bg-tertiary/20 text-tertiary' : simRunning ? 'bg-secondary/20 text-secondary animate-pulse' : 'bg-surface-container-highest text-on-surface-variant'
              }`}>
                {simComplete ? 'PASSED (0 INJURIES)' : simRunning ? 'EXECUTING...' : 'STANDBY'}
              </span>
            </div>

            <p className="font-body-md text-body-md text-on-surface my-space-md text-xs sm:text-sm">
              {scenario.description}
            </p>

            {/* Execution Progress Track */}
            <div className="w-full bg-surface-container-lowest border border-[#242a3a] p-space-md rounded-xl space-y-2 mb-space-md">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-on-surface-variant">ALGORITHMIC TEST EXECUTION</span>
                <span className="text-primary font-bold">{simProgress}%</span>
              </div>
              <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300"
                  style={{ width: `${simProgress}%` }}
                />
              </div>
            </div>

            {/* Step-by-Step Telemetry Timeline */}
            <div className="space-y-2">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Sensor &amp; Actuator Sequence
              </span>
              {scenario.steps.map((step, idx) => {
                const isExecuted = simStepIndex >= idx;
                const isCurrent = simStepIndex === idx && simRunning;
                return (
                  <div
                    key={idx}
                    className={`p-2.5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 transition-all ${
                      isCurrent
                        ? 'bg-primary-container/20 border-primary ring-1 ring-primary'
                        : isExecuted
                        ? 'bg-surface-container border-[#242a3a]'
                        : 'bg-surface-container-lowest/50 border-[#242a3a]/40 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-tertiary shrink-0">
                        {step.time}
                      </span>
                      <span className="font-body-md text-xs text-on-surface">
                        {step.action}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-primary bg-surface-container-lowest px-2 py-0.5 rounded border border-[#242a3a] shrink-0 self-end sm:self-auto">
                      {step.sensorReading}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Outcome Footer */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl border border-[#242a3a] mt-space-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-sm">
            <div>
              <span className="font-label-caps text-label-caps text-tertiary block font-bold">
                VALIDATED OUTCOME
              </span>
              <p className="font-body-md text-xs text-on-surface-variant">
                {scenario.expectedOutcome}
              </p>
            </div>
            <span className="px-2 py-1 rounded bg-tertiary/15 text-tertiary font-mono text-xs font-bold shrink-0">
              ETHICAL HARNESS OK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
