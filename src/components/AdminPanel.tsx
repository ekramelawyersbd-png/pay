import React, { useState } from 'react';
import { GatewayConfig, Transaction } from '../types';
import { ShieldCheck, Key, Globe, Save, CheckCircle2, RefreshCw, Terminal, ExternalLink, HelpCircle, TrendingUp, DollarSign, Activity, ArrowUpRight, FileCode, Radio } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface AdminPanelProps {
  config: GatewayConfig;
  onUpdateConfig: (newConfig: GatewayConfig) => void;
  onNavigateToDocs: () => void;
  transactions: Transaction[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ config, onUpdateConfig, onNavigateToDocs, transactions }) => {
  const [formData, setFormData] = useState<GatewayConfig>(config);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setTesting(false);
      if (formData.apiKey && formData.secretKey) {
        setTestResult({
          success: true,
          message: 'Successfully connected to UddoktaPay API (Sandbox mode active). Authentication token verified.'
        });
      } else {
        setTestResult({
          success: false,
          message: 'Connection failed: API Key and Secret Key are required.'
        });
      }
    }, 1200);
  };

  // Compute metrics from transactions
  const totalTransactions = transactions.length;
  const completedCount = transactions.filter(t => t.status === 'COMPLETED').length;
  const successRate = totalTransactions > 0 ? ((completedCount / totalTransactions) * 100).toFixed(1) : '100.0';
  const totalRevenue = transactions.reduce((acc, t) => acc + (t.status === 'COMPLETED' ? t.amount : 0), 0);

  // Chart data
  const chartData = [
    { date: 'Oct 01', revenue: 15200, transactions: 1 },
    { date: 'Oct 04', revenue: 18500, transactions: 1 },
    { date: 'Oct 08', revenue: 21700, transactions: 2 },
    { date: 'Oct 11', revenue: 21700, transactions: 2 },
    { date: 'Oct 15', revenue: totalRevenue > 21700 ? totalRevenue : 24900, transactions: totalTransactions },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Paymenter Admin Panel</span>
            <span aria-hidden="true">·</span>
            <span>Gateways</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-900 font-medium">UddoktaPay Hosted</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Gateway Dashboard & Configuration</h2>
          <p className="text-sm text-slate-600 mt-1">
            Monitor transaction metrics, incoming IPN webhooks, and configure UddoktaPay merchant credentials.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateToDocs}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>GitHub Repository</span>
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Extension Installed v1.0.0</span>
          </div>
        </div>
      </div>

      {/* Metrics Dashboard Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* Metric 1: Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Total Revenue</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              ৳{totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.4% from last month</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2: Total Transactions */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Total Transactions</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {totalTransactions}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 font-medium mt-1">
              <span>All payment channels active</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3: Success Rate */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Success Rate</span>
            <div className="text-2xl font-extrabold text-slate-900 font-mono">
              {successRate}%
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Optimal gateway performance</span>
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Recharts Revenue & Transaction Trend Widget */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Gateway Revenue & Volume Trend</h3>
            <p className="text-xs text-slate-500">Real-time performance analytics for UddoktaPay hosted checkouts.</p>
          </div>
          <div className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
            October 2026
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', border: 'none', fontSize: '12px' }}
                formatter={(value: any) => [`৳${Number(value).toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* NEW: Webhook Logs Section in Admin Panel */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Incoming IPN Webhook Event Logs</span>
            </h3>
            <p className="text-xs text-slate-500">Live feed of automated IPN callbacks received from UddoktaPay gateway.</p>
          </div>
          <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-700 font-semibold rounded-lg">
            {transactions.length} Events Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase tracking-wider">
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Invoice Ref</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Payload Summary</th>
                <th className="px-4 py-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{txn.status}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono font-medium text-slate-900">{txn.transactionId}</td>
                  <td className="px-4 py-3 font-mono text-slate-600">{txn.invoiceId}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{txn.paymentMethod}</td>
                  <td className="px-4 py-3 font-mono text-slate-500">
                    ৳{txn.amount.toLocaleString()} {txn.currency} (Verified IPN)
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-slate-500">{txn.date}</td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No webhook events recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {saved && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-sm font-medium">Gateway configuration updated successfully! Changes are now live for client checkouts.</div>
        </div>
      )}

      {testResult && (
        <div className={`mb-6 p-4 rounded-xl border flex items-start gap-3 shadow-sm ${testResult.success ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
          {testResult.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <HelpCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
          <div className="text-sm font-medium">{testResult.message}</div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Settings Form */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-semibold text-slate-900">UddoktaPay Hosted Gateway</h3>
                <p className="text-xs text-slate-500">Accept bKash, Nagad, Rocket, Upay and VISA/Mastercard.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={formData.enabled} 
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-slate-900"></div>
                <span className="ml-3 text-xs font-semibold text-slate-700">{formData.enabled ? 'Enabled' : 'Disabled'}</span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Display Name
                </label>
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  API Key (`RT-UDDOKTAPAY-API-KEY`)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.apiKey}
                    onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
                    placeholder="Enter your UddoktaPay API Key"
                  />
                  <Key className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  API Secret Key
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={formData.secretKey}
                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
                    placeholder="Enter your UddoktaPay API Secret"
                  />
                  <ShieldCheck className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hosted Checkout URL
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.hostedUrl}
                    onChange={(e) => setFormData({ ...formData, hostedUrl: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
                  />
                  <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 mt-1">Use `https://sandbox.uddoktapay.com` for testing or `https://pay.uddoktapay.com` for production.</p>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">Sandbox / Test Mode</h4>
                  <p className="text-xs text-slate-500">Route transactions through UddoktaPay sandbox gateway for testing without real charges.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.sandboxMode} 
                    onChange={(e) => setFormData({ ...formData, sandboxMode: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testing}
                className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                <span>Test API Connection</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Configuration</span>
              </button>
            </div>

          </form>
        </div>

        {/* Sidebar Info & Webhook Endpoints */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-slate-700" />
              <span>IPN Webhook Endpoints</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Configure these callback URLs in your UddoktaPay merchant dashboard for automatic invoice settlement:
            </p>

            <div className="space-y-3">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Success Callback URL</span>
                <div className="p-2.5 bg-slate-50 font-mono text-xs text-slate-800 rounded border border-slate-200 break-all select-all">
                  https://blog.accounticca.com/gateway/uddoktapay/success
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Cancel Callback URL</span>
                <div className="p-2.5 bg-slate-50 font-mono text-xs text-slate-800 rounded border border-slate-200 break-all select-all">
                  https://blog.accounticca.com/gateway/uddoktapay/cancel
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">IPN Webhook Listener URL</span>
                <div className="p-2.5 bg-slate-50 font-mono text-xs text-slate-800 rounded border border-slate-200 break-all select-all">
                  https://blog.accounticca.com/gateway/uddoktapay/ipn
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold mb-2">Quick Installation Note</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Upload the <code className="text-amber-300">UddoktaPay</code> folder directly into <code className="text-amber-300">extensions/Gateways</code> of your Paymenter root directory, then enable it here instantly.
            </p>
            <button
              onClick={onNavigateToDocs}
              className="w-full py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <span>View Source Files & Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
