import React, { useState } from 'react';
import { useRanger } from '../context/RangerContext';

export const EmergencyResponse: React.FC = () => {
  const { sosActive, setSosActive, addLog, setShowSosModal } = useRanger();
  const [selectedProtocol, setSelectedProtocol] = useState<'auditory' | 'illumination' | 'tether' | 'mesh'>('auditory');
  const [dispatchedTeams, setDispatchedTeams] = useState<string[]>(['Ranger Recon Unit 04']);

  const toggleDispatch = (team: string) => {
    if (dispatchedTeams.includes(team)) {
      setDispatchedTeams(dispatchedTeams.filter((t) => t !== team));
      addLog('WARN', 'MESH', `Dispatch canceled for: ${team}.`);
    } else {
      setDispatchedTeams([...dispatchedTeams, team]);
      addLog('INFO', 'MESH', `Dispatched reinforcement: ${team} routed to Sector 04.`);
    }
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-10">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-xl p-space-lg rounded-xl shadow-xl">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-space-sm py-0.5 rounded bg-error-container/30 text-error font-label-caps text-label-caps uppercase flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-error animate-ping" />
              TACTICAL CRISIS MANAGEMENT
            </span>
            <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-mono">
              STANDOFF COORD: 11°42'18"N 76°38'22"E
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Emergency Response &amp; Standoff Command
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Humane, non-lethal escalation sequence for human-wildlife encounters and distress beacon telemetry flood.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          {sosActive ? (
            <button
              onClick={() => {
                setSosActive(false);
                addLog('INFO', 'MESH', 'Emergency SOS cleared from Standoff Console.');
              }}
              className="px-4 py-2 rounded-lg bg-surface-container-highest text-on-surface font-headline-md text-sm font-semibold hover:text-tertiary transition-all"
            >
              STAND DOWN SOS
            </button>
          ) : (
            <button
              onClick={() => setShowSosModal(true)}
              className="px-4 py-2 rounded-lg bg-error text-on-error font-headline-md text-sm font-bold shadow-[0_0_16px_rgba(239,68,68,0.4)] hover:bg-error-container transition-all"
            >
              TRIGGER DISTRESS BEACON
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Status Map + Escalation Ladder */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
        {/* Left: Sector Tactical Grid & Standoff Coordinates (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between pb-space-sm border-b border-[#242a3a]">
            <div>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                Sector 04 Alpha Standoff Perimeter
              </h2>
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Bandipur High-Density Buffer Zone
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
              sosActive ? 'bg-error text-on-error animate-pulse' : 'bg-tertiary/20 text-tertiary'
            }`}>
              {sosActive ? 'PERIMETER COMPROMISED' : 'STANDOFF SECURE'}
            </span>
          </div>

          {/* Interactive Tactical Map SVG */}
          <div className="relative w-full h-80 bg-surface-container-lowest border border-[#242a3a] rounded-xl my-space-md overflow-hidden flex items-center justify-center">
            {/* Topography vector representation */}
            <svg className="w-full h-full" viewBox="0 0 500 300">
              <defs>
                <radialGradient id="standoffRange" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#89ceff" stopOpacity="0.25" />
                  <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#0d1322" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Contour lines */}
              <ellipse cx="250" cy="150" rx="200" ry="120" fill="none" stroke="#242a3a" strokeWidth="1" strokeDasharray="3 3" />
              <ellipse cx="250" cy="150" rx="140" ry="85" fill="none" stroke="#3e4850" strokeWidth="1" />
              <ellipse cx="250" cy="150" rx="80" ry="50" fill="url(#standoffRange)" stroke="#00eefc" strokeWidth="1.5" />

              {/* Perimeter buffer rings */}
              <circle cx="250" cy="150" r="130" fill="none" stroke="#0ea5e9" strokeWidth="1" strokeOpacity="0.3" />
              <circle cx="250" cy="150" r="40" fill="none" stroke="#4edea3" strokeWidth="1.5" strokeOpacity="0.6" />

              {/* Officer Vance (Hub) */}
              <g transform="translate(250, 150)">
                <circle cx="0" cy="0" r="10" fill="#00344d" stroke="#89ceff" strokeWidth="2" />
                <circle cx="0" cy="0" r="4" fill="#00eefc" />
                <text x="12" y="4" fill="#89ceff" fontFamily="Geist" fontSize="10" fontWeight="bold">
                  OFFICER VANCE (YOU)
                </text>
                <text x="12" y="16" fill="#88929b" fontFamily="Geist" fontSize="8">
                  Zone 4 Sector Alpha
                </text>
              </g>

              {/* Wildlife Target 01 */}
              <g transform="translate(340, 110)">
                <circle cx="0" cy="0" r="8" fill="#4edea3" fillOpacity="0.3" className="animate-ping" />
                <circle cx="0" cy="0" r="4" fill="#4edea3" />
                <text x="10" y="3" fill="#4edea3" fontFamily="Geist" fontSize="9" fontWeight="bold">
                  HERBIVORE POD (DEER)
                </text>
                <text x="10" y="14" fill="#bec8d2" fontFamily="Geist" fontSize="8">
                  Distance: 4.2m Standoff
                </text>
              </g>

              {/* Mesh Node Beacon */}
              <g transform="translate(140, 220)">
                <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#0ea5e9" />
                <text x="10" y="3" fill="#89ceff" fontFamily="Geist" fontSize="8">
                  MESH REPEATER 04A
                </text>
                <text x="10" y="14" fill="#88929b" fontFamily="Geist" fontSize="8">
                  RSSI: -42dBm • Active
                </text>
              </g>
            </svg>

            <div className="absolute bottom-2 left-2 bg-surface-container-highest/90 border border-[#242a3a] px-2 py-1 rounded text-xs text-on-surface-variant font-mono">
              GPS ACCURACY: &plusmn;1.4m (GLONASS + NAVIC)
            </div>
          </div>

          {/* Quick Reinforcement Dispatch Panel */}
          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block mb-2">
              Reinforcement &amp; Support Dispatch Teams
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { name: 'Wildlife Vet Team', eta: '4 min ETA', icon: 'medical_services' },
                { name: 'Ranger Recon Unit 04', eta: 'On Station', icon: 'security' },
                { name: 'Aerial Drone Scout', eta: '6 min ETA', icon: 'flight' },
              ].map((team) => {
                const isDispatched = dispatchedTeams.includes(team.name);
                return (
                  <button
                    key={team.name}
                    onClick={() => toggleDispatch(team.name)}
                    className={`p-2.5 rounded-lg border text-left flex items-center justify-between transition-all ${
                      isDispatched
                        ? 'bg-primary-container/20 border-primary text-on-surface'
                        : 'bg-surface-container border-[#242a3a] text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        {team.icon}
                      </span>
                      <div>
                        <div className="font-label-caps text-xs font-bold text-on-surface">{team.name}</div>
                        <div className="text-[10px] text-on-surface-variant">{team.eta}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-tertiary">
                      {isDispatched ? 'DISPATCHED' : 'CALL'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Non-Lethal Escalation Ladder (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-low border border-[#242a3a] rounded-xl p-space-lg shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-space-sm border-b border-[#242a3a]">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                  Non-Lethal Escalation Ladder
                </h2>
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                  Humane Fauna Intervention Protocol
                </span>
              </div>
              <span className="font-telemetry-sm text-xs font-mono text-tertiary">
                BIO-ETHIC v4
              </span>
            </div>

            {/* Ladder Stages */}
            <div className="space-y-3 my-space-md">
              {[
                {
                  id: 'auditory',
                  stage: 'STAGE 1: AUDITORY DISPERSAL',
                  desc: 'Sweeps 18kHz - 24kHz safe ultrasonic frequencies via piezo buzzer to encourage peaceful retreat without acoustic damage.',
                  color: 'border-primary',
                  tag: 'LOW INTRUSION',
                  tagColor: 'text-primary bg-primary/10',
                },
                {
                  id: 'illumination',
                  stage: 'STAGE 2: OPTICAL STROBE & VISIBILITY',
                  desc: 'Engages high-efficiency 850lm pulse strobe and 940nm stealth IR spotlight to illuminate terrain or deflect aggressive trajectories.',
                  color: 'border-secondary',
                  tag: 'MODERATE INTRUSION',
                  tagColor: 'text-secondary bg-secondary/10',
                },
                {
                  id: 'tether',
                  stage: 'STAGE 3: SOFT TETHER CONTAINMENT',
                  desc: 'Deploys 15m bio-compatible soft braided Kevlar loop with spring-cushioned jaws and 650N tension limiter to guide trapped animals.',
                  color: 'border-tertiary',
                  tag: 'CONTROLLED RESCUE',
                  tagColor: 'text-tertiary bg-tertiary/10',
                },
                {
                  id: 'mesh',
                  stage: 'STAGE 4: LORA MESH FLOOD DISPATCH',
                  desc: 'Transmits emergency SOS across all base nodes, locking GPS coordinates and requesting drone reconnaissance.',
                  color: 'border-error',
                  tag: 'CRITICAL ESCALATION',
                  tagColor: 'text-error bg-error/10',
                },
              ].map((stage) => {
                const isSelected = selectedProtocol === stage.id;
                return (
                  <div
                    key={stage.id}
                    onClick={() => setSelectedProtocol(stage.id as any)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? `bg-surface-container-high ${stage.color} ring-1`
                        : 'bg-surface-container border-[#242a3a] hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-label-caps text-xs font-bold text-on-surface">
                        {stage.stage}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${stage.tagColor}`}>
                        {stage.tag}
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant text-xs">
                      {stage.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-3 rounded-lg border border-[#242a3a] flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">ACTIVE PROTOCOL:</span>
            <span className="font-mono text-tertiary font-bold uppercase">{selectedProtocol}</span>
            <button
              onClick={() => {
                addLog('INFO', 'MODULE', `Executed escalation protocol: ${selectedProtocol.toUpperCase()}.`);
              }}
              className="px-3 py-1 bg-primary text-on-primary rounded font-semibold text-xs hover:bg-primary-fixed transition-colors"
            >
              EXECUTE STAGE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
