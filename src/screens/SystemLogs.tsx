import React, { useState } from 'react';
import { useRanger } from '../context/RangerContext';
import { SystemLogEntry } from '../types';

export const SystemLogs: React.FC = () => {
  const { logs, clearLogs, addLog } = useRanger();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Filter logs
  const filteredLogs = logs.filter((entry) => {
    if (selectedCategory !== 'ALL' && entry.category !== selectedCategory) return false;
    if (selectedLevel !== 'ALL' && entry.level !== selectedLevel) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        entry.message.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.timestamp.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ranger-x-telemetry-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog('INFO', 'DIAGNOSTIC', 'Exported full telemetry event log as JSON.');
  };

  const handleExportCSV = () => {
    const headers = ['id', 'timestamp', 'level', 'category', 'message'];
    const rows = logs.map((l) => [l.id, l.timestamp, l.level, l.category, `"${l.message.replace(/"/g, '""')}"`]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `ranger-x-telemetry-logs-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    addLog('INFO', 'DIAGNOSTIC', 'Exported full telemetry event log as CSV.');
  };

  return (
    <div className="flex flex-col w-full gap-space-lg pb-10">
      {/* Top Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md bg-surface-container-low/80 border border-[#242a3a] backdrop-blur-xl p-space-lg rounded-xl shadow-xl">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm flex-wrap">
            <span className="px-space-sm py-0.5 rounded bg-surface-container-highest text-primary font-label-caps text-label-caps uppercase">
              Telemetry Audit Trail
            </span>
            <span className="font-telemetry-sm text-telemetry-sm text-on-surface-variant font-mono">
              TOTAL RECORDS: {logs.length}
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
            Real-Time System &amp; Sensor Telemetry Logs
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-xs sm:text-sm">
            Monospace chronological event stream recording dual-MCU bus transactions, ultrasonic reflection timings, and LoRa packet ACKs.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={`px-3 py-1.5 rounded-lg border font-headline-md text-xs font-semibold transition-all ${
              isPaused
                ? 'bg-secondary-container text-on-secondary-container border-secondary'
                : 'bg-surface-container-high border-[#242a3a] text-on-surface hover:text-primary'
            }`}
          >
            {isPaused ? 'RESUME STREAM' : 'PAUSE STREAM'}
          </button>
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 rounded-lg bg-surface-container-high border border-[#242a3a] text-on-surface hover:text-primary font-headline-md text-xs font-semibold transition-all"
          >
            EXPORT CSV
          </button>
          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 rounded-lg bg-primary-container text-on-primary font-headline-md text-xs font-semibold hover:bg-primary transition-all shadow-md"
          >
            EXPORT JSON
          </button>
          <button
            onClick={clearLogs}
            className="px-3 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface-variant hover:text-error hover:bg-error-container/30 transition-all border border-[#242a3a]"
          >
            CLEAR
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface-container-low border border-[#242a3a] p-space-md rounded-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-space-md justify-between items-stretch md:items-center">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1">
            {['ALL', 'PROXIMITY', 'MOTION', 'MODULE', 'POWER', 'MESH', 'DIAGNOSTIC'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-xs font-label-caps rounded transition-colors ${
                  selectedCategory === cat
                    ? 'bg-primary text-on-primary font-bold shadow'
                    : 'bg-surface-container hover:bg-surface-container-highest text-on-surface-variant'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-64">
            <span className="material-symbols-outlined text-[18px] text-on-surface-variant absolute left-2.5 top-1/2 -translate-y-1/2">
              search
            </span>
            <input
              type="text"
              placeholder="Search telemetry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-lowest border border-[#242a3a] rounded-lg pl-9 pr-3 py-1.5 text-xs text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary font-mono"
            />
          </div>
        </div>

        {/* Severity Selector */}
        <div className="flex items-center gap-2 text-xs pt-1 border-t border-[#242a3a]/40">
          <span className="text-on-surface-variant font-label-caps uppercase text-[10px]">Filter Severity:</span>
          {['ALL', 'INFO', 'WARN', 'CRIT', 'SYNC'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                selectedLevel === lvl
                  ? 'bg-primary-container text-on-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Log Feed Table */}
      <div className="bg-surface-container-low border border-[#242a3a] rounded-xl overflow-hidden shadow-xl">
        <div className="p-3 bg-surface-container-high/80 border-b border-[#242a3a] flex items-center justify-between text-xs font-mono">
          <span className="text-on-surface-variant">SHOWING {filteredLogs.length} OF {logs.length} LOG PACKETS</span>
          <span className="text-tertiary flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
            RING BUFFER SYNCHRONIZED
          </span>
        </div>

        <div className="divide-y divide-[#242a3a]/40 max-h-[500px] overflow-y-auto font-mono text-xs">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center text-on-surface-variant">
              No telemetry events match your active filters.
            </div>
          ) : (
            filteredLogs.map((entry) => {
              const isCrit = entry.level === 'CRIT';
              const isWarn = entry.level === 'WARN';
              const isSync = entry.level === 'SYNC';

              return (
                <div
                  key={entry.id}
                  className={`p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 hover:bg-surface-container/50 transition-colors ${
                    isCrit ? 'bg-error-container/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-on-surface-variant text-[11px]">
                      [{entry.timestamp}]
                    </span>

                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        isCrit
                          ? 'bg-error text-on-error'
                          : isWarn
                          ? 'bg-secondary-container text-on-secondary-container'
                          : isSync
                          ? 'bg-tertiary-container/30 text-tertiary'
                          : 'bg-surface-container-highest text-primary'
                      }`}
                    >
                      {entry.level}
                    </span>

                    <span className="text-secondary-fixed-dim text-[11px] font-semibold">
                      {entry.category}
                    </span>

                    <span className="text-on-surface">
                      {entry.message}
                    </span>
                  </div>

                  <span className="text-[10px] text-on-surface-variant self-end sm:self-auto">
                    {entry.id}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
