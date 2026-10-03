export type ScreenId =
  | 'command-center'
  | 'live-sensor-monitor'
  | 'ranger-x-device'
  | 'rescue-modules'
  | 'emergency-response'
  | 'incident-simulator'
  | 'system-logs'
  | 'device-settings'
  | 'project-info-and-design-thinking';

export interface TelemetryData {
  distanceCm: number;
  speedOfSound: number;
  echoTimeOfFlightMs: number;
  confidencePercent: number;
  temperatureC: number;
  humidityPercent: number;
  pressureHpa: number;
  aqi: number;
  mcuThermalC: number;
  batteryPercent: number;
  batteryVoltage: number;
  dischargeCurrentMa: number;
  pirArmed: boolean;
  pirDetected: boolean;
  fallDetected: boolean;
  mpuAccelG: number;
  mpuTiltDeg: number;
}

export interface CartridgeInfo {
  id: number;
  code: string;
  name: string;
  subtitle: string;
  capacityValue: string;
  capacityLabel: string;
  firmware: string;
  powerDraw: string;
  specText: string;
  icon: string;
  color: string;
  accentBg: string;
  badgeLabel: string;
  specs: { label: string; value: string; color?: string }[];
  description: string;
  badgeTag: string;
}

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'CRIT' | 'SYNC';
  category: 'PROXIMITY' | 'MOTION' | 'MODULE' | 'POWER' | 'MESH' | 'DIAGNOSTIC';
  message: string;
}
