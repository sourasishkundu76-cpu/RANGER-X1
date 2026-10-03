import React from 'react';
import { useRanger } from '../context/RangerContext';
import { ScreenId } from '../types';

interface NavItem {
  id: ScreenId;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'command-center', label: 'Command Center', icon: 'grid_view' },
  { id: 'live-sensor-monitor', label: 'Live Sensor Monitor', icon: 'sensors' },
  { id: 'ranger-x-device', label: 'RANGER-X Device', icon: 'view_in_ar' },
  { id: 'rescue-modules', label: 'Rescue Modules', icon: 'health_and_safety' },
  { id: 'emergency-response', label: 'Emergency Response', icon: 'crisis_alert' },
  { id: 'incident-simulator', label: 'Incident Simulator', icon: 'model_training' },
  { id: 'system-logs', label: 'System Logs', icon: 'receipt_long' },
  { id: 'device-settings', label: 'Device Settings', icon: 'tune' },
  { id: 'project-info-and-design-thinking', label: 'Project Info & Design Thinking', icon: 'lightbulb' },
];

export const Sidebar: React.FC = () => {
  const { activeScreen, setActiveScreen, mobileMenuOpen, setMobileMenuOpen } = useRanger();

  const handleNavClick = (id: ScreenId) => {
    setActiveScreen(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-16 bottom-10 w-72 bg-surface-container-low/95 backdrop-blur-2xl z-40 flex flex-col justify-between py-space-md border-r border-[#242a3a] shadow-[1px_0_12px_rgba(0,0,0,0.25)] transition-transform duration-300 lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 px-space-sm overflow-y-auto">
          <div className="px-space-md mb-space-sm flex items-center justify-between">
            <span className="font-label-caps text-label-caps tracking-widest text-on-surface-variant uppercase">
              Navigation Console
            </span>
            <span className="text-[10px] text-tertiary font-mono bg-tertiary/10 px-1.5 py-0.5 rounded">
              v2.4
            </span>
          </div>

          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-space-sm px-space-md py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-semibold shadow-[0_0_12px_rgba(14,165,233,0.3)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                  <span className="font-body-md text-body-md">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Mesh Node Widget */}
        <div className="px-space-md pt-space-sm border-t border-[#242a3a]">
          <div className="bg-surface-container/70 border border-[#242a3a]/80 rounded-lg p-space-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">
                Mesh Node 04A
              </span>
              <span className="font-telemetry-sm text-telemetry-sm text-tertiary font-semibold">
                SYNCED
              </span>
            </div>
            <div className="w-full bg-surface-container-highest rounded-full h-1">
              <div className="bg-tertiary-container h-1 rounded-full w-full" />
            </div>
            <div className="flex items-center justify-between mt-1.5 text-[10px] text-on-surface-variant">
              <span>868.1 MHz</span>
              <span className="text-secondary font-mono">-42 dBm</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
