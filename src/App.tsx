import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AdminPanel } from './components/AdminPanel';
import { ClientCheckout } from './components/ClientCheckout';
import { TransactionLogs } from './components/TransactionLogs';
import { ApiPlayground } from './components/ApiPlayground';
import { ExtensionFilesViewer } from './components/ExtensionFilesViewer';
import { initialGatewayConfig, initialInvoices, initialTransactions } from './data/mockData';
import { GatewayConfig, Invoice, Transaction } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'admin' | 'client' | 'transactions' | 'api' | 'code'>('admin');
  const [gatewayConfig, setGatewayConfig] = useState<GatewayConfig>(initialGatewayConfig);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const handleUpdateConfig = (newConfig: GatewayConfig) => {
    setGatewayConfig(newConfig);
  };

  const handlePayInvoice = (invoiceId: string, paymentMethod: string, transactionId: string) => {
    // Update invoice status
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === invoiceId ? { ...inv, status: 'paid' } : inv))
    );

    // Find invoice details
    const inv = invoices.find((i) => i.id === invoiceId);
    const amount = inv ? inv.amount : 1500;

    // Add new transaction record
    const newTxn: Transaction = {
      id: 'txn_' + Date.now(),
      invoiceId: inv ? inv.invoiceNumber : invoiceId,
      transactionId: transactionId,
      amount: amount,
      currency: 'BDT',
      status: 'COMPLETED',
      paymentMethod: paymentMethod,
      senderNumber: '01712345678',
      date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipnPayload: {
        status: 'COMPLETED',
        invoice_id: invoiceId,
        invoice_number: inv ? inv.invoiceNumber : invoiceId,
        amount: amount.toFixed(2),
        currency: 'BDT',
        payment_method: paymentMethod,
        sender_number: '01712345678',
        transaction_id: transactionId,
        metadata: { invoice_id: invoiceId },
        date: new Date().toISOString()
      }
    };

    setTransactions((prev) => [newTxn, ...prev]);
  };

  const handleSimulateWebhook = (payload: any) => {
    // Optional webhook trigger from playground
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-slate-900 selection:text-white pb-16">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenCheckout={() => setActiveTab('client')} 
      />

      <main className="transition-all">
        {activeTab === 'admin' && (
          <AdminPanel 
            config={gatewayConfig} 
            onUpdateConfig={handleUpdateConfig} 
            onNavigateToDocs={() => setActiveTab('code')} 
            transactions={transactions}
          />
        )}
        {activeTab === 'client' && (
          <ClientCheckout 
            invoices={invoices} 
            config={gatewayConfig} 
            onPayInvoice={handlePayInvoice} 
          />
        )}
        {activeTab === 'transactions' && (
          <TransactionLogs 
            transactions={transactions} 
          />
        )}
        {activeTab === 'api' && (
          <ApiPlayground 
            config={gatewayConfig} 
            onSimulateWebhook={handleSimulateWebhook} 
          />
        )}
        {activeTab === 'code' && (
          <ExtensionFilesViewer />
        )}
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            UddoktaPay Paymenter Gateway Extension Studio &copy; 2026. Built for seamless billing automation.
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/uddoktapay/paymenter.git" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">
              GitHub Repository
            </a>
            <button onClick={() => setActiveTab('admin')} className="hover:text-slate-900 transition-colors">Admin Panel</button>
            <button onClick={() => setActiveTab('client')} className="hover:text-slate-900 transition-colors">Client Portal</button>
          </div>
        </div>
      </footer>
    </div>
  );
}
