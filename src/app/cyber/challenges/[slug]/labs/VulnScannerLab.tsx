'use client';

import React, { useState } from 'react';
import { Shield, AlertTriangle, Search, Server, CheckCircle, XCircle, Loader } from 'lucide-react';

interface ScanTarget {
  name: string;
  ip: string;
  ports: { port: number; service: string; status: 'open' | 'closed' | 'filtered'; vuln?: string; severity?: 'critical' | 'high' | 'medium' | 'low' }[];
  os: string;
  vulnCount: number;
}

const TARGETS: ScanTarget[] = [
  {
    name: 'Web Server',
    ip: '192.168.1.10',
    os: 'Ubuntu 22.04',
    vulnCount: 3,
    ports: [
      { port: 22, service: 'SSH', status: 'open' },
      { port: 80, service: 'HTTP', status: 'open', vuln: 'Directory listing enabled', severity: 'medium' },
      { port: 443, service: 'HTTPS', status: 'open', vuln: 'TLS 1.0 supported (deprecated)', severity: 'high' },
      { port: 3306, service: 'MySQL', status: 'open', vuln: 'Remote access enabled without IP restriction', severity: 'critical' },
      { port: 8080, service: 'HTTP-Proxy', status: 'filtered' },
    ],
  },
  {
    name: 'File Server',
    ip: '192.168.1.20',
    os: 'Windows Server 2019',
    vulnCount: 2,
    ports: [
      { port: 21, service: 'FTP', status: 'open', vuln: 'Anonymous login allowed', severity: 'critical' },
      { port: 135, service: 'RPC', status: 'open' },
      { port: 139, service: 'NetBIOS', status: 'open', vuln: 'SMBv1 enabled (EternalBlue risk)', severity: 'critical' },
      { port: 445, service: 'SMB', status: 'open' },
      { port: 3389, service: 'RDP', status: 'filtered' },
    ],
  },
  {
    name: 'IoT Gateway',
    ip: '192.168.1.30',
    os: 'Linux (embedded)',
    vulnCount: 4,
    ports: [
      { port: 23, service: 'Telnet', status: 'open', vuln: 'Telnet enabled (unencrypted)', severity: 'high' },
      { port: 80, service: 'HTTP', status: 'open', vuln: 'Default admin credentials (admin:admin)', severity: 'critical' },
      { port: 1883, service: 'MQTT', status: 'open', vuln: 'No authentication required', severity: 'high' },
      { port: 8443, service: 'HTTPS-alt', status: 'open', vuln: 'Self-signed certificate, outdated firmware v1.2', severity: 'medium' },
    ],
  },
];

const OWASP_TOP_10 = [
  { id: 'A01', name: 'Broken Access Control', description: 'Restrictions not properly enforced' },
  { id: 'A02', name: 'Cryptographic Failures', description: 'Weak encryption, deprecated protocols' },
  { id: 'A03', name: 'Injection', description: 'SQL, NoSQL, command injection flaws' },
  { id: 'A04', name: 'Insecure Design', description: 'Missing or ineffective control design' },
  { id: 'A05', name: 'Security Misconfiguration', description: 'Default configs, open services' },
  { id: 'A06', name: 'Vulnerable Components', description: 'Outdated libraries and software' },
  { id: 'A07', name: 'Auth Failures', description: 'Broken authentication mechanisms' },
  { id: 'A08', name: 'Data Integrity Failures', description: 'Assumptions about software updates' },
  { id: 'A09', name: 'Logging Failures', description: 'Insufficient monitoring and logging' },
  { id: 'A10', name: 'SSRF', description: 'Server-Side Request Forgery' },
];

type SeverityKey = 'critical' | 'high' | 'medium' | 'low';
const SEVERITY_COLORS: Record<SeverityKey, string> = {
  critical: 'bg-red-500/10 text-red-400 border-red-500/30',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
};

export default function VulnScannerLab() {
  const [scanning, setScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [remediation, setRemediation] = useState<Record<string, string>>({});
  const [showOwasp, setShowOwasp] = useState(false);

  function startScan() {
    setScanning(true);
    setScanProgress(0);
    setScanComplete(false);
    setSelectedTarget(null);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setScanning(false);
          setScanComplete(true);
          return 100;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 300);
  }

  function submitRemediation(targetIdx: number, portNum: number, fix: string) {
    const key = `${targetIdx}-${portNum}`;
    setRemediation((prev) => ({ ...prev, [key]: fix }));
  }

  const totalVulns = TARGETS.reduce((s, t) => s + t.ports.filter((p) => p.vuln).length, 0);
  const fixedVulns = Object.keys(remediation).length;
  const completed = fixedVulns >= totalVulns - 2; // Allow 2 missed

  return (
    <div className="space-y-6">
      <div className="bg-gray-900/50 border border-gray-800/60 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-emerald-400 font-mono mb-2">🎯 Objective</h3>
        <p className="text-xs text-gray-400">
          Scan a simulated network, identify vulnerabilities, classify them by OWASP Top 10, and propose remediations.
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-3 items-center">
        <button
          onClick={startScan}
          disabled={scanning}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white text-xs font-medium rounded transition-colors flex items-center gap-1.5"
        >
          {scanning ? <Loader className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
          {scanning ? 'Scanning…' : 'Start Network Scan'}
        </button>
        <button
          onClick={() => setShowOwasp(!showOwasp)}
          className="px-3 py-2 border border-gray-800 text-gray-400 text-xs rounded hover:text-gray-200 transition-colors"
        >
          {showOwasp ? 'Hide' : 'Show'} OWASP Top 10
        </button>
      </div>

      {/* Scan Progress */}
      {scanning && (
        <div>
          <div className="flex justify-between text-[10px] text-gray-500 mb-1">
            <span>Scanning network 192.168.1.0/24…</span>
            <span>{Math.min(100, Math.round(scanProgress))}%</span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, scanProgress)}%` }} />
          </div>
        </div>
      )}

      {/* OWASP Reference */}
      {showOwasp && (
        <div className="bg-black/30 border border-gray-800 rounded-lg p-4 max-h-48 overflow-y-auto">
          <h4 className="text-xs font-semibold text-gray-300 mb-2 font-mono">OWASP Top 10 (2021)</h4>
          <div className="space-y-1">
            {OWASP_TOP_10.map((o) => (
              <div key={o.id} className="flex items-center gap-2 text-[11px]">
                <span className="text-cyan-400 font-mono w-8">{o.id}</span>
                <span className="text-gray-300">{o.name}</span>
                <span className="text-gray-600">—</span>
                <span className="text-gray-500">{o.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scan Results */}
      {scanComplete && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Server className="w-4 h-4" />
              <span>{TARGETS.length} hosts discovered • {totalVulns} vulnerabilities found</span>
            </div>
            <span className="text-[10px] text-gray-500">Remediated: {fixedVulns}/{totalVulns}</span>
          </div>

          {/* Target Cards */}
          <div className="grid gap-3">
            {TARGETS.map((target, tIdx) => (
              <div key={tIdx} className="bg-black/30 border border-gray-800 rounded-lg overflow-hidden">
                <button
                  onClick={() => setSelectedTarget(selectedTarget === tIdx ? null : tIdx)}
                  className="w-full flex items-center justify-between p-3 hover:bg-gray-800/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Server className="w-4 h-4 text-cyan-400" />
                    <div className="text-left">
                      <p className="text-xs font-semibold text-gray-200">{target.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{target.ip} — {target.os}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {target.ports.filter((p) => p.severity === 'critical').length > 0 && (
                      <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
                        {target.ports.filter((p) => p.severity === 'critical').length} CRITICAL
                      </span>
                    )}
                    <span className="text-[10px] text-gray-500">{target.ports.filter((p) => p.vuln).length} vulns</span>
                  </div>
                </button>

                {selectedTarget === tIdx && (
                  <div className="border-t border-gray-800 p-3 space-y-2">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-1.5 text-gray-500 font-mono">Port</th>
                          <th className="text-left py-1.5 text-gray-500 font-mono">Service</th>
                          <th className="text-left py-1.5 text-gray-500 font-mono">Status</th>
                          <th className="text-left py-1.5 text-gray-500 font-mono">Vulnerability</th>
                          <th className="text-left py-1.5 text-gray-500 font-mono">Fix</th>
                        </tr>
                      </thead>
                      <tbody>
                        {target.ports.map((p) => {
                          const rKey = `${tIdx}-${p.port}`;
                          return (
                            <tr key={p.port} className="border-b border-gray-800/30">
                              <td className="py-2 text-gray-400 font-mono">{p.port}</td>
                              <td className="py-2 text-gray-300">{p.service}</td>
                              <td className="py-2">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  p.status === 'open' ? 'bg-emerald-500/10 text-emerald-400' : p.status === 'filtered' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-gray-800 text-gray-500'
                                }`}>
                                  {p.status}
                                </span>
                              </td>
                              <td className="py-2">
                                {p.vuln ? (
                                  <div className="flex items-center gap-1.5">
                                    <AlertTriangle className="w-3 h-3 text-red-400 flex-shrink-0" />
                                    <div>
                                      <span className="text-gray-300 text-[10px]">{p.vuln}</span>
                                      {p.severity && (
                                        <span className={`ml-1 text-[9px] px-1 py-0.5 rounded border ${SEVERITY_COLORS[p.severity]}`}>
                                          {p.severity.toUpperCase()}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-gray-600 text-[10px]">—</span>
                                )}
                              </td>
                              <td className="py-2">
                                {p.vuln && !remediation[rKey] ? (
                                  <input
                                    type="text"
                                    placeholder="Remediation…"
                                    className="w-full px-2 py-1 bg-black/50 border border-gray-700 rounded text-[10px] text-gray-200 font-mono focus:outline-none focus:border-emerald-500/50"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value.length > 5) {
                                        submitRemediation(tIdx, p.port, (e.target as HTMLInputElement).value);
                                      }
                                    }}
                                  />
                                ) : remediation[rKey] ? (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                    <span className="text-[10px] text-emerald-400 truncate max-w-[120px]">{remediation[rKey]}</span>
                                  </div>
                                ) : null}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {completed && (
        <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <Shield className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-sm font-medium text-emerald-400">Challenge Complete! +300 XP</p>
            <p className="text-xs text-gray-400">You scanned a network, identified vulnerabilities, and proposed remediations.</p>
          </div>
        </div>
      )}
    </div>
  );
}
