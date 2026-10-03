import React from 'react';
import { RangerProvider, useRanger } from './context/RangerContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { OfficerProfileModal } from './components/OfficerProfileModal';
import { EmergencySOSModal } from './components/EmergencySOSModal';

// Screens
import { CommandCenter } from './screens/CommandCenter';
import { LiveSensorMonitor } from './screens/LiveSensorMonitor';
import { RangerXDevice } from './screens/RangerXDevice';
import { RescueModules } from './screens/RescueModules';
import { EmergencyResponse } from './screens/EmergencyResponse';
import { IncidentSimulator } from './screens/IncidentSimulator';
import { SystemLogs } from './screens/SystemLogs';
import { DeviceSettings } from './screens/DeviceSettings';
import { ProjectInfo } from './screens/ProjectInfo';

const AppContent: React.FC = () => {
  const { activeScreen } = useRanger();

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Fixed Top Header */}
      <Header />

      {/* Fixed Navigation Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="lg:pl-72">
        <main className="w-full pt-16 pb-12 px-gutter-lg min-h-screen bg-surface">
          <div className="max-w-[1600px] mx-auto py-6">
            {activeScreen === 'command-center' && <CommandCenter />}
            {activeScreen === 'live-sensor-monitor' && <LiveSensorMonitor />}
            {activeScreen === 'ranger-x-device' && <RangerXDevice />}
            {activeScreen === 'rescue-modules' && <RescueModules />}
            {activeScreen === 'emergency-response' && <EmergencyResponse />}
            {activeScreen === 'incident-simulator' && <IncidentSimulator />}
            {activeScreen === 'system-logs' && <SystemLogs />}
            {activeScreen === 'device-settings' && <DeviceSettings />}
            {activeScreen === 'project-info-and-design-thinking' && <ProjectInfo />}
          </div>
        </main>
      </div>

      {/* Fixed Bottom Footer Bar */}
      <Footer />

      {/* Global Modals */}
      <OfficerProfileModal />
      <EmergencySOSModal />
    </div>
  );
};

export default function App() {
  return (
    <RangerProvider>
      <AppContent />
    </RangerProvider>
  );
}
