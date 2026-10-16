import React, { useState } from 'react';
import { Invoice, GatewayConfig } from '../types';
import { CreditCard, CheckCircle, Clock, Shield, ArrowRight, Smartphone, X, Check, Globe, FileText, Download, Printer } from 'lucide-react';

interface ClientCheckoutProps {
  invoices: Invoice[];
  config: GatewayConfig;
  onPayInvoice: (invoiceId: string, paymentMethod: string, transactionId: string) => void;
}

export const ClientCheckout: React.FC<ClientCheckoutProps> = ({ invoices, config, onPayInvoice }) => {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Upay' | 'Visa/Mastercard'>('bKash');
  const [senderNumber, setSenderNumber] = useState('01712345678');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  
  // PDF Invoice Preview Mode state
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const [lastTxnId, setLastTxnId] = useState<string>('');

  // Currency conversion state
  const [targetCurrency, setTargetCurrency] = useState<'BDT' | 'USD' | 'EUR' | 'GBP'>('BDT');

  const exchangeRates: Record<string, { rate: number; symbol: string; name: string }> = {
    BDT: { rate: 1.0, symbol: '৳', name: 'Bangladeshi Taka (BDT)' },
    USD: { rate: 118.5, symbol: '$', name: 'US Dollar (USD)' },
    EUR: { rate: 129.0, symbol: '€', name: 'Euro (EUR)' },
    GBP: { rate: 154.0, symbol: '£', name: 'British Pound (GBP)' },
  };

  const handleOpenCheckout = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsCheckoutModalOpen(true);
    setPaymentSuccess(null);
    setShowPdfPreview(false);
    setTargetCurrency('BDT');
  };

  const handleSimulatePayment = () => {
    if (!selectedInvoice) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const txnId = 'UPAY-TXN-' + Math.floor(1000000 + Math.random() * 9000000);
      onPayInvoice(selectedInvoice.id, selectedMethod, txnId);
      setPaymentSuccess(txnId);
      setLastTxnId(txnId);
    }, 1500);
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const paymentMethods = [
    { id: 'bKash', name: 'bKash Mobile Banking', color: 'bg-pink-600 text-white', icon: '📱' },
    { id: 'Nagad', name: 'Nagad Mobile Banking', color: 'bg-orange-600 text-white', icon: '📱' },
    { id: 'Rocket', name: 'Rocket (DBBL)', color: 'bg-purple-700 text-white', icon: '🚀' },
    { id: 'Upay', name: 'Upay (UCB)', color: 'bg-teal-600 text-white', icon: '💳' },
    { id: 'Visa/Mastercard', name: 'Credit / Debit Cards', color: 'bg-blue-600 text-white', icon: '💳' },
  ];

  const currentRateObj = exchangeRates[targetCurrency] || exchangeRates.BDT;
  const convertedAmount = selectedInvoice ? selectedInvoice.amount / currentRateObj.rate : 0;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Paymenter Client Area</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-900 font-medium">Invoices & Billing</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Client Invoices</h2>
          <p className="text-sm text-slate-600 mt-1">
            View active hosting services and pay outstanding invoices instantly via UddoktaPay Hosted checkout.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg">
            Active Gateway: <span className="text-emerald-700">{config.displayName}</span> ({config.sandboxMode ? 'Sandbox' : 'Live'})
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="px-6 py-3.5">Invoice #</th>
                <th className="px-6 py-3.5">Service Description</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Amount</th>
                <th className="px-6 py-3.5">Due Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 font-mono font-medium text-slate-900">{inv.invoiceNumber}</td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{inv.title}</div>
                    <div className="text-xs text-slate-500">{inv.serviceType}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-900 font-medium">{inv.customerName}</div>
                    <div className="text-xs text-slate-500">{inv.customerEmail}</div>
                  </td>
                  <td className="px-6 py-4 font-mono font-bold text-slate-900">
                    ৳{inv.amount.toLocaleString()} {inv.currency}
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">{inv.dueDate}</td>
                  <td className="px-6 py-4">
                    {inv.status === 'paid' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Paid</span>
                      </span>
                    )}
                    {inv.status === 'pending' && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Unpaid</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {inv.status === 'pending' ? (
                      <button
                        onClick={() => handleOpenCheckout(inv)}
                        disabled={!config.enabled}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm inline-flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Pay via UddoktaPay</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Completed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hosted Checkout Modal Simulator */}
      {isCheckoutModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-fadeIn">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-black text-xs">
                  UP
                </div>
                <div>
                  <h3 className="text-sm font-bold">UddoktaPay Secure Checkout</h3>
                  <p className="text-[10px] text-slate-300">Hosted Gateway Sandbox Simulator</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCheckoutModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {paymentSuccess ? (
                <div>
                  {showPdfPreview ? (
                    <div className="bg-white p-6 rounded-xl border border-slate-300 shadow-sm text-slate-900 relative">
                      {/* Paid Stamp Watermark */}
                      <div className="absolute right-8 top-12 border-4 border-emerald-600 text-emerald-600 font-black text-xl px-4 py-1.5 rounded-xl uppercase tracking-widest rotate-[-12deg] opacity-80 pointer-events-none select-none">
                        PAID & VERIFIED
                      </div>

                      <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
                        <div>
                          <h3 className="text-lg font-black text-slate-900">ACCOUNTICCA CLOUD</h3>
                          <p className="text-xs text-slate-500">Official Paymenter Billing Invoice</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-slate-800 block">{selectedInvoice.invoiceNumber}</span>
                          <span className="text-[11px] text-slate-500">Date: {selectedInvoice.createdAt}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
                        <div>
                          <span className="font-semibold text-slate-500 uppercase tracking-wider block mb-1">Billed To:</span>
                          <div className="font-bold text-slate-900">{selectedInvoice.customerName}</div>
                          <div className="text-slate-600">{selectedInvoice.customerEmail}</div>
                        </div>
                        <div>
                          <span className="font-semibold text-slate-500 uppercase tracking-wider block mb-1">Payment Details:</span>
                          <div className="text-slate-700">Method: <strong className="text-slate-900">{selectedMethod}</strong></div>
                          <div className="text-slate-700 font-mono">TXN: {lastTxnId}</div>
                        </div>
                      </div>

                      <table className="w-full text-left text-xs mb-6 border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-700 uppercase">
                            <th className="p-2.5">Description</th>
                            <th className="p-2.5 text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="p-2.5 font-medium text-slate-900">
                              {selectedInvoice.title}
                              <div className="text-[10px] text-slate-500">Service Type: {selectedInvoice.serviceType}</div>
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">৳{selectedInvoice.amount.toLocaleString()} BDT</td>
                          </tr>
                        </tbody>
                      </table>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-300 font-bold text-sm mb-6">
                        <span>Total Paid via UddoktaPay:</span>
                        <span className="font-mono text-emerald-700 text-base">৳{selectedInvoice.amount.toLocaleString()} BDT</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={handleDownloadPdf}
                          className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Print / Save PDF</span>
                        </button>
                        <button
                          onClick={() => setShowPdfPreview(false)}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">Payment Successful!</h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Transaction ID: <strong className="font-mono text-slate-900">{paymentSuccess}</strong>
                      </p>
                      <p className="text-xs text-slate-500 mb-6">
                        IPN webhook triggered automatically. Paymenter invoice marked as paid and service activated.
                      </p>

                      <div className="space-y-2.5">
                        <button
                          onClick={() => setShowPdfPreview(true)}
                          className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                        >
                          <FileText className="w-4 h-4" />
                          <span>View PDF Invoice Preview</span>
                        </button>
                        <button
                          onClick={() => setIsCheckoutModalOpen(false)}
                          className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
                        >
                          Return to Invoices
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* Currency Selector Widget */}
                  <div className="mb-5 p-3.5 bg-slate-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-600" />
                      <span className="text-xs font-semibold text-slate-700">Display Currency:</span>
                    </div>
                    <select
                      value={targetCurrency}
                      onChange={(e) => setTargetCurrency(e.target.value as any)}
                      className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="BDT">BDT (৳ Taka)</option>
                      <option value="USD">USD ($ Dollar)</option>
                      <option value="EUR">EUR (€ Euro)</option>
                      <option value="GBP">GBP (£ Pound)</option>
                    </select>
                  </div>

                  {/* Invoice Summary Box */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                    <div className="flex justify-between items-center text-xs text-slate-500 mb-1">
                      <span>{selectedInvoice.invoiceNumber}</span>
                      <span>Due: {selectedInvoice.dueDate}</span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 mb-2">{selectedInvoice.title}</h4>
                    
                    <div className="space-y-1.5 pt-2 border-t border-slate-200">
                      <div className="flex justify-between items-center text-xs text-slate-600">
                        <span>Base Amount (BDT):</span>
                        <span className="font-mono font-medium text-slate-900">৳{selectedInvoice.amount.toLocaleString()} BDT</span>
                      </div>

                      {targetCurrency !== 'BDT' && (
                        <div className="flex justify-between items-center text-xs text-amber-700 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                          <span>Exchange Rate (1 {targetCurrency} = ৳{currentRateObj.rate}):</span>
                          <span className="font-mono">Approx. {currentRateObj.symbol}{convertedAmount.toFixed(2)} {targetCurrency}</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                        <span className="text-xs font-semibold text-slate-900">Total Payable:</span>
                        <span className="text-base font-extrabold text-slate-900 font-mono">
                          {targetCurrency === 'BDT' ? `৳{selectedInvoice.amount.toLocaleString()} BDT` : `${currentRateObj.symbol}${convertedAmount.toFixed(2)} ${targetCurrency} (৳${selectedInvoice.amount.toLocaleString()})`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Select Payment Method
                    </label>
                    <div className="grid grid-cols-2 gap-2.5">
                      {paymentMethods.map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setSelectedMethod(method.id as any)}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all ${selectedMethod === method.id ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'}`}
                        >
                          <span className="text-base">{method.icon}</span>
                          <span className="text-xs font-semibold">{method.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sender Number Input */}
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Customer Phone / Account Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={senderNumber}
                        onChange={(e) => setSenderNumber(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 text-slate-900"
                        placeholder="01712345678"
                      />
                      <Smartphone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">Simulated sandbox gateway phone number.</p>
                  </div>

                  {/* Pay Action */}
                  <button
                    onClick={handleSimulatePayment}
                    disabled={isProcessing}
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing Payment via UddoktaPay...</span>
                      </>
                    ) : (
                      <>
                        <span>Pay {targetCurrency === 'BDT' ? `৳{selectedInvoice.amount.toLocaleString()}` : `${currentRateObj.symbol}${convertedAmount.toFixed(2)} ${targetCurrency}`} Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Secured by UddoktaPay Gateway API v1</span>
                  </div>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
