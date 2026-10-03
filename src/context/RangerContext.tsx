import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ScreenId, CartridgeInfo, SystemLogEntry } from '../types';

export const CARTRIDGES_CATALOG: CartridgeInfo[] = [
  {
    id: 1,
    code: 'CART-01',
    name: 'Rescue Assist',
    subtitle: 'Soft Braided Kevlar Loop Ready',
    capacityValue: '15.0 M',
    capacityLabel: 'LINE CAPACITY',
    firmware: 'RX-CORE-TETH-V2.14',
    powerDraw: '2.4W NOMINAL',
    specText: 'LATCHED: 100%',
    icon: 'all_inclusive',
    color: '#89ceff',
    accentBg: 'bg-primary-container',
    badgeLabel: 'NON-INVASIVE WILDLIFE HOOK',
    specs: [
      { label: 'Line Core:', value: '15m Ultralight Kevlar' },
      { label: 'Max Tension:', value: '65 kg Rating', color: 'text-tertiary' },
      { label: 'Retract Mechanism:', value: 'Brushless Electric Rewind', color: 'text-secondary' },
    ],
    description: 'High-tensile bio-compatible soft braided nylon tether with spring-cushioned magnetic soft-jaw loop for non-harmful retrieval.',
    badgeTag: 'RESCUE ASSIST',
  },
  {
    id: 2,
    code: 'CART-02',
    name: 'Acoustic Alert',
    subtitle: 'Wildlife Dispersal Sweep Online',
    capacityValue: '22.4 kHz',
    capacityLabel: 'SWEEP FREQ',
    firmware: 'RX-SONIC-ALERT-V1.08',
    powerDraw: '6.2W BURST',
    specText: 'STROBE: READY',
    icon: 'volume_up',
    color: '#00dbe9',
    accentBg: 'bg-secondary-container',
    badgeLabel: 'AUDITORY SAFETY SHIELD',
    specs: [
      { label: 'Audio Range:', value: '18kHz - 24kHz Swept' },
      { label: 'Strobe Matrix:', value: '850 Lumen Flash LED', color: 'text-primary' },
      { label: 'Deterrence Logic:', value: 'Safe Wildlife Dispersal', color: 'text-tertiary' },
    ],
    description: 'Directional acoustic wave emitter calibrated with humane wildlife-dispersal audio curves and integrated high-pulse strobe.',
    badgeTag: 'ACOUSTIC ALERT',
  },
  {
    id: 3,
    code: 'CART-03',
    name: 'Night Illumination',
    subtitle: '1200lm Flood + 940nm Stealth IR',
    capacityValue: '1,200 LM',
    capacityLabel: 'OPTIC FLUX',
    firmware: 'RX-OPTIC-NIGHT-V3.02',
    powerDraw: '14.5W PEAK',
    specText: 'IR BEACON: ENGAGED',
    icon: 'highlight',
    color: '#89ceff',
    accentBg: 'bg-surface-container-highest',
    badgeLabel: 'STEALTH CANOPY NAVIGATION',
    specs: [
      { label: 'White Flood:', value: '1200 lm (110° Arc)' },
      { label: 'Stealth Infrared:', value: '940 nm Non-Visible', color: 'text-secondary' },
      { label: 'Optic Shield:', value: 'Gorilla Glass Armor', color: 'text-tertiary' },
    ],
    description: 'High-efficiency dual optic system: 1200-lumen wide flood plus 940nm stealth IR emitter preventing night-blindness in nocturnal species.',
    badgeTag: 'NIGHT ILLUM',
  },
  {
    id: 4,
    code: 'CART-04',
    name: 'Eco Sensor Pod',
    subtitle: 'CO / Fire & Thermal LWIR Active',
    capacityValue: '0.02 PPM',
    capacityLabel: 'CO DETECT',
    firmware: 'RX-CHEM-SENSE-V4.41',
    powerDraw: '1.1W PASSIVE',
    specText: 'TEMP: 24.8°C NOMINAL',
    icon: 'air',
    color: '#4edea3',
    accentBg: 'bg-surface-container-highest',
    badgeLabel: 'FIRE DETECT READY',
    specs: [
      { label: 'Target Gases:', value: 'CO, CO2, VOC, Aerosol' },
      { label: 'Thermal Sensor:', value: '80x60 Lepton LWIR', color: 'text-tertiary' },
      { label: 'Response Time:', value: '< 450 ms', color: 'text-primary' },
    ],
    description: 'Micro gas spectrometer and high-resolution thermal array for sub-canopy wildfire early detection and toxic gas telemetry.',
    badgeTag: 'ECO SENSOR POD',
  },
  {
    id: 5,
    code: 'CART-05',
    name: 'Satellite Comms',
    subtitle: 'LEO Short Burst & LoRa Mesh 915MHz',
    capacityValue: '99.4 %',
    capacityLabel: 'LINK QUALITY',
    firmware: 'RX-SAT-BEACON-V2.90',
    powerDraw: '4.8W TX-LOCK',
    specText: 'IRIDIUM: 5/5 BARS',
    icon: 'satellite_alt',
    color: '#00eefc',
    accentBg: 'bg-surface-container-highest',
    badgeLabel: 'DEEP CANOPY UPLINK',
    specs: [
      { label: 'Bandwidth:', value: 'LEO Two-Way Short Burst' },
      { label: 'Mesh Link:', value: 'LoRa P2P 15km Range', color: 'text-secondary' },
      { label: 'Canopy Penetration:', value: '98.4% Dense Leaf', color: 'text-tertiary' },
    ],
    description: 'High-gain fold-out patch antenna for dual Iridium LEO constellations and LoRa 868/915 MHz ad-hoc mesh networking in ravines.',
    badgeTag: 'SAT COMMS',
  },
  {
    id: 6,
    code: 'CART-06',
    name: 'Demo & Lab Module',
    subtitle: 'Safe Educational Evaluation Module',
    capacityValue: 'INERT',
    capacityLabel: 'TRAINING DUMMY',
    firmware: 'RX-EDU-SIM-V0.95',
    powerDraw: '0.5W DIAG',
    specText: 'CLASS 2 RETICLE ON',
    icon: 'school',
    color: '#bec8d2',
    accentBg: 'bg-surface-container-highest',
    badgeLabel: 'FIRST-YEAR CAPSTONE DEMO',
    specs: [
      { label: 'Class:', value: 'Safe B.Tech Lab Evaluation' },
      { label: 'Pointer Reticle:', value: '<1mW Class 2 Eye-Safe', color: 'text-tertiary' },
      { label: 'Payload:', value: 'Inert Dummy Tether Core', color: 'text-outline' },
    ],
    description: 'Inert educational payload equipped with dual guide lasers, dummy spool friction simulators, and real-time lab diagnostic hooks.',
    badgeTag: 'DEMO & LAB',
  },
];

interface RangerContextType {
  activeScreen: ScreenId;
  setActiveScreen: (screen: ScreenId) => void;
  distanceCm: number;
  setDistanceCm: (dist: number) => void;
  activeCartridge: CartridgeInfo | null;
  setActiveCartridge: (cart: CartridgeInfo | null) => void;
  patrolActive: boolean;
  setPatrolActive: (active: boolean) => void;
  sosActive: boolean;
  setSosActive: (active: boolean) => void;
  showSosModal: boolean;
  setShowSosModal: (show: boolean) => void;
  showOfficerModal: boolean;
  setShowOfficerModal: (show: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  logs: SystemLogEntry[];
  addLog: (level: SystemLogEntry['level'], category: SystemLogEntry['category'], message: string) => void;
  clearLogs: () => void;
  simClock: string;
}

const RangerContext = createContext<RangerContextType | undefined>(undefined);

export const RangerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('command-center');
  const [distanceCm, setDistanceCmState] = useState<number>(124);
  const [activeCartridge, setActiveCartridge] = useState<CartridgeInfo | null>(CARTRIDGES_CATALOG[0]);
  const [patrolActive, setPatrolActive] = useState<boolean>(true);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [showSosModal, setShowSosModal] = useState<boolean>(false);
  const [showOfficerModal, setShowOfficerModal] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [simClock, setSimClock] = useState<string>('14:42:09 UTC');

  const [logs, setLogs] = useState<SystemLogEntry[]>([
    {
      id: 'log-1',
      timestamp: '14:42:07.120',
      level: 'INFO',
      category: 'PROXIMITY',
      message: 'MCU0_ESP32: US_ECHO=124.2cm | PIR=LOW | BATT=3.98V | LORA_RSSI=-42dBm',
    },
    {
      id: 'log-2',
      timestamp: '14:42:07.820',
      level: 'INFO',
      category: 'MODULE',
      message: 'GAUNTLET_CORE: FSR_PALM=0.00N | AMBIENT_LUX=420lx (DAY_FILTER) | LATCH=ENGAGED',
    },
    {
      id: 'log-3',
      timestamp: '14:42:08.410',
      level: 'INFO',
      category: 'MOTION',
      message: 'RADAR_VECTOR: SCAN_AZIMUTH=048° | OBSTACLE_DIST=4.22m | CLASS=ORGANIC_HERBIVORE',
    },
    {
      id: 'log-4',
      timestamp: '14:42:09.002',
      level: 'SYNC',
      category: 'MESH',
      message: 'SYNC_PACKET_OK: Mesh Node 04A ack recvd. No human-wildlife conflict detected in 50m radius.',
    },
  ]);

  const addLog = useCallback((level: SystemLogEntry['level'], category: SystemLogEntry['category'], message: string) => {
    const now = new Date();
    const ts = now.toISOString().substring(11, 23);
    const newEntry: SystemLogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: ts,
      level,
      category,
      message,
    };
    setLogs((prev) => [newEntry, ...prev.slice(0, 199)]);
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Sync distance changes with logging if threshold crossed
  const setDistanceCm = useCallback((dist: number) => {
    setDistanceCmState(dist);
    if (dist < 40) {
      addLog('CRIT', 'PROXIMITY', `CRITICAL STANDOFF BREACH: ${dist}cm detected by HC-SR04 ultrasonic node! Buzzer triggered.`);
    } else if (dist <= 80) {
      addLog('WARN', 'PROXIMITY', `CAUTION PROXIMITY: ${dist}cm obstacle closing buffer.`);
    }
  }, [addLog]);

  // Live sim clock update
  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      const h = String(d.getUTCHours()).padStart(2, '0');
      const m = String(d.getUTCMinutes()).padStart(2, '0');
      const s = String(d.getUTCSeconds()).padStart(2, '0');
      setSimClock(`${h}:${m}:${s} UTC`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <RangerContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        distanceCm,
        setDistanceCm,
        activeCartridge,
        setActiveCartridge,
        patrolActive,
        setPatrolActive,
        sosActive,
        setSosActive,
        showSosModal,
        setShowSosModal,
        showOfficerModal,
        setShowOfficerModal,
        mobileMenuOpen,
        setMobileMenuOpen,
        logs,
        addLog,
        clearLogs,
        simClock,
      }}
    >
      {children}
    </RangerContext.Provider>
  );
};

export const useRanger = (): RangerContextType => {
  const context = useContext(RangerContext);
  if (!context) {
    throw new Error('useRanger must be used within a RangerProvider');
  }
  return context;
};
