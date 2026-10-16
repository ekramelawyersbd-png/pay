import React from 'react';
import { ShieldCheck, Terminal, CreditCard, Code, Database, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: 'admin' | 'client' | 'transactions' | 'api' | 'code') => void;
  onOpenCheckout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenCheckout }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0 cursor-pointer" onClick={() => setActiveTab('admin')}>
          <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            U
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">UddoktaPay</h1>
            <span className="text-xs text-slate-500 font-medium">Paymenter Gateway Studio</span>
          </div>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button 
            onClick={() => setActiveTab('admin')} 
            className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${activeTab === 'admin' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'}`}
          >
            Admin Panel Config
          </button>
          <button 
            onClick={() => setActiveTab('client')} 
            className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${activeTab === 'client' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'}`}
          >
            Client Invoices
          </button>
          <button 
            onClick={() => setActiveTab('transactions')} 
            className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${activeTab === 'transactions' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'}`}
          >
            Transaction Logs
          </button>
          <button 
            onClick={() => setActiveTab('api')} 
            className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${activeTab === 'api' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'}`}
          >
            API Playground
          </button>
          <button 
            onClick={() => setActiveTab('code')} 
            className={`transition-colors whitespace-nowrap shrink-0 py-2 border-b-2 ${activeTab === 'code' ? 'border-slate-900 text-slate-900 font-semibold' : 'border-transparent hover:text-slate-900'}`}
          >
            Extension Files
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onOpenCheckout}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm whitespace-nowrap"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Simulate Checkout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Mobile Nav Subbar */}
      <div className="flex lg:hidden overflow-x-auto px-6 py-2 border-t border-slate-100 bg-slate-50 gap-4 text-xs font-medium text-slate-600">
        <button onClick={() => setActiveTab('admin')} className={activeTab === 'admin' ? 'text-slate-900 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>Admin Config</button>
        <button onClick={() => setActiveTab('client')} className={activeTab === 'client' ? 'text-slate-900 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>Invoices</button>
        <button onClick={() => setActiveTab('transactions')} className={activeTab === 'transactions' ? 'text-slate-900 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>Logs</button>
        <button onClick={() => setActiveTab('api')} className={activeTab === 'api' ? 'text-slate-900 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>API</button>
        <button onClick={() => setActiveTab('code')} className={activeTab === 'code' ? 'text-slate-900 font-bold whitespace-nowrap' : 'whitespace-nowrap'}>Files</button>
      </div>
    </header>
  );
};
