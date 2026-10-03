import React from 'react';
import { useRanger } from '../context/RangerContext';
import { TacticalLogo } from './TacticalLogo';

// Local generated officer portrait
import officerPortraitImg from '../assets/images/officer_vance_portrait_1791016355598.jpg';

export const Header: React.FC = () => {
  const {
    patrolActive,
    sosActive,
    setShowSosModal,
    setShowOfficerModal,
    mobileMenuOpen,
    setMobileMenuOpen,
  } = useRanger();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0d1322]/90 backdrop-blur-xl z-50 px-gutter-lg flex items-center justify-between border-b border-[#242a3a] shadow-[0_1px_16px_rgba(0,0,0,0.35)]">
      {/* Left: Brand Lockup & Telemetry Status Bar */}
      <div className="flex items-center gap-space-lg">
        {/* Mobile menu trigger */}
        <button
          className="lg:hidden p-2 rounded-lg bg-surface-container text-on-surface hover:text-primary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-outlined text-[20px]">
            {mobileMenuOpen ? 'close' : 'menu'}
          </span>
        </button>

        <div className="flex items-center gap-space-sm">
          <TacticalLogo className="h-8 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity" />
          <div className="flex flex-col">
            <div className="flex items-center gap-space-xs">
              <span className="font-headline-md text-headline-md tracking-tight font-bold text-primary">
                RANGER-X
              </span>
              <span className="px-space-xs py-0.5 rounded bg-surface-container-highest text-tertiary font-label-caps text-label-caps uppercase hidden sm:inline-block">
                ENGINEERING CONCEPT / SIMULATION
              </span>
            </div>
            <span className="font-label-caps text-label-caps tracking-widest text-on-surface-variant uppercase">
              DETECT. RESPOND. PROTECT.
            </span>
          </div>
        </div>

        {/* Tactical status telemetry pills (Desktop) */}
        <div className="hidden xl:flex items-center gap-space-md pl-space-md bg-surface-container-low/60 border border-[#242a3a] rounded-lg px-space-md py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="flex items-center gap-space-xs">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
            <span className="font-label-caps text-label-caps text-on-surface-variant">SYS:</span>
            <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-semibold">ONLINE</span>
          </div>
          <div className="w-px h-3 bg-surface-container-highest" />
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[15px] text-primary">battery_charging_90</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">BATT:</span>
            <span className="font-telemetry-sm text-telemetry-sm text-primary font-semibold">93%</span>
          </div>
          <div className="w-px h-3 bg-surface-container-highest" />
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[15px] text-secondary">shield</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">MODE:</span>
            <span className="font-telemetry-sm text-telemetry-sm text-secondary font-semibold">
              {patrolActive ? 'PATROL' : 'STANDBY'}
            </span>
          </div>
          <div className="w-px h-3 bg-surface-container-highest" />
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-[15px] text-tertiary-fixed-dim">satellite_alt</span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">SAT-COM:</span>
            <span className="font-telemetry-sm text-telemetry-sm text-tertiary-fixed-dim font-semibold">CONNECTED</span>
          </div>
        </div>
      </div>

      {/* Right: Emergency SOS Action & Officer Profile */}
      <div className="flex items-center gap-space-md">
        {/* Emergency SOS Button */}
        <button
          onClick={() => setShowSosModal(true)}
          className={`flex items-center gap-space-xs px-space-md py-1.5 rounded-lg font-headline-md text-headline-md font-semibold tracking-wide transition-all shadow-[0_0_12px_rgba(239,68,68,0.3)] active:scale-95 ${
            sosActive
              ? 'bg-error text-on-error animate-pulse'
              : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
          }`}
          type="button"
          aria-label="Emergency SOS Override"
        >
          <span className="material-symbols-outlined text-[18px]">
            {sosActive ? 'crisis_alert' : 'e911_emergency'}
          </span>
          <span className="hidden sm:inline">
            {sosActive ? 'SOS BROADCAST ACTIVE' : 'EMERGENCY SOS'}
          </span>
          <span className="sm:hidden">SOS</span>
        </button>

        {/* Officer Vance Profile Pill */}
        <button
          onClick={() => setShowOfficerModal(true)}
          className="flex items-center gap-space-sm pl-space-sm bg-surface-container-low/80 hover:bg-surface-container border border-[#242a3a] py-1 px-space-sm rounded-lg transition-all text-left group"
          title="Click to view Officer Vance Field Dossier"
        >
          <div className="flex flex-col text-right hidden sm:flex">
            <span className="font-body-md text-body-md font-medium text-on-surface leading-tight group-hover:text-primary transition-colors">
              Officer Vance
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">
              Zone 4 Sector Alpha
            </span>
          </div>

          <div className="w-8 h-8 rounded-full overflow-hidden bg-primary/20 border border-primary/40 flex items-center justify-center relative shadow-sm">
            <img
              src={officerPortraitImg}
              alt="Officer Vance Portrait"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to avatar icon
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="material-symbols-outlined text-primary text-[18px] absolute pointer-events-none" style={{ zIndex: -1 }}>
              person
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
