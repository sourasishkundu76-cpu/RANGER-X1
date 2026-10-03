import React from 'react';
import { useRanger } from '../context/RangerContext';

export const Footer: React.FC = () => {
  const { simClock } = useRanger();

  return (
    <footer className="fixed bottom-0 left-0 right-0 h-10 bg-surface-container-lowest/95 backdrop-blur-xl z-50 px-gutter-lg flex items-center justify-between border-t border-[#242a3a] shadow-[0_-1px_12px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-space-sm truncate pr-2">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping shrink-0" />
        <span className="font-label-caps text-label-caps text-on-surface-variant tracking-wider truncate">
          RANGER-X — ENGINEERING CONCEPT / SIMULATION | First-Year B.Tech Design Thinking Demonstrator | Safe Harmless Rescue Architecture
        </span>
      </div>

      <div className="flex items-center gap-space-lg shrink-0">
        <div className="flex items-center gap-space-xs">
          <span className="material-symbols-outlined text-[14px] text-tertiary">wifi_tethering</span>
          <span className="font-telemetry-sm text-telemetry-sm text-tertiary">12ms PING</span>
        </div>
        <div className="flex items-center gap-space-xs font-telemetry-sm text-telemetry-sm text-secondary">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span className="font-mono">{simClock}</span>
        </div>
      </div>
    </footer>
  );
};
