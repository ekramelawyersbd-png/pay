import React, { useState } from 'react';
import { Transaction } from '../types';
import { CheckCircle2, Clock, FileCode, Search, ChevronRight, X, Copy, Check } from 'lucide-react';

interface TransactionLogsProps {
  transactions: Transaction[];
}

export const TransactionLogs: React.FC<TransactionLogsProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [copied, setCopied] = useState(false);

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopyPayload = (payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Paymenter System</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-900 font-medium">Gateway Logs</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Transaction & IPN Logs</h2>
          <p className="text-sm text-slate-600 mt-1">
            Inspect real-time IPN webhook payloads and completed transaction records from UddoktaPay.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search TXN ID or method..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900 w-64 shadow-sm"
          />
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-3.5">Transaction ID</th>
                <th className="px-6 py-3.5">Invoice ID</th>
                <th className="px-6 py-3.5">Payment Method</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Date & Time</th>
                <th className="px-6 py-3.5 text-right">IPN Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">{txn.transactionId}</td>
                  <td className="px-6 py-4 font-mono text-slate-600">{txn.invoiceId}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                      {txn.paymentMethod}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    ৳{txn.amount.toLocaleString()} {txn.currency}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{txn.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-mono">{txn.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedTxn(txn)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <FileCode className="w-3.5 h-3.5 text-slate-600" />
                      <span>View Payload</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No transactions found matching your search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* IPN Payload Modal */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-fadeIn">
            
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">IPN Webhook & Transaction Payload</h3>
                <p className="text-[10px] text-slate-300 font-mono">{selectedTxn.transactionId}</p>
              </div>
              <button 
                onClick={() => setSelectedTxn(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">JSON Payload Sent by UddoktaPay</span>
                <button
                  onClick={() => handleCopyPayload(selectedTxn.ipnPayload)}
                  className="flex items-center gap-1 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-96 shadow-inner">
                <pre>{JSON.stringify(selectedTxn.ipnPayload, null, 2)}</pre>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setSelectedTxn(null)}
                  className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
