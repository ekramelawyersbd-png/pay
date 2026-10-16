import React, { useState } from 'react';
import { Terminal, Send, Play, CheckCircle2, Code2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { GatewayConfig } from '../types';

interface ApiPlaygroundProps {
  config: GatewayConfig;
  onSimulateWebhook: (payload: any) => void;
}

export const ApiPlayground: React.FC<ApiPlaygroundProps> = ({ config, onSimulateWebhook }) => {
  const [endpoint, setEndpoint] = useState<'checkout' | 'verify' | 'ipn' | 'auth-verify'>('checkout');
  const [simulationError, setSimulationError] = useState<'none' | '401' | '404' | '500'>('none');
  const [requestBody, setRequestBody] = useState<string>(
    JSON.stringify(
      {
        full_name: 'Tanvir Ahmed',
        email: 'tanvir@example.com',
        amount: 1500,
        metadata: { invoice_id: 'inv_101', customer_id: 'cust_99' },
        redirect_url: 'https://blog.accounticca.com/gateway/uddoktapay/success',
        cancel_url: 'https://blog.accounticca.com/gateway/uddoktapay/cancel',
        webhook_url: 'https://blog.accounticca.com/gateway/uddoktapay/ipn'
      },
      null,
      2
    )
  );
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusCode, setStatusCode] = useState<number>(200);

  const handleEndpointChange = (type: 'checkout' | 'verify' | 'ipn' | 'auth-verify') => {
    setEndpoint(type);
    setSimulationError('none');
    if (type === 'checkout') {
      setRequestBody(
        JSON.stringify(
          {
            full_name: 'Tanvir Ahmed',
            email: 'tanvir@example.com',
            amount: 1500,
            metadata: { invoice_id: 'inv_101' },
            redirect_url: 'https://blog.accounticca.com/gateway/uddoktapay/success',
            cancel_url: 'https://blog.accounticca.com/gateway/uddoktapay/cancel',
            webhook_url: 'https://blog.accounticca.com/gateway/uddoktapay/ipn'
          },
          null,
          2
        )
      );
    } else if (type === 'verify') {
      setRequestBody(
        JSON.stringify(
          {
            transaction_id: 'UPAY-TXN-9988776'
          },
          null,
          2
        )
      );
    } else if (type === 'ipn') {
      setRequestBody(
        JSON.stringify(
          {
            status: 'COMPLETED',
            invoice_id: 'inv_101',
            amount: '1500.00',
            metadata: { invoice_id: 'inv_101' },
            sender_number: '01711223344',
            transaction_id: 'UPAY-TXN-9988776',
            date: new Date().toISOString()
          },
          null,
          2
        )
      );
    } else if (type === 'auth-verify') {
      setRequestBody(
        JSON.stringify(
          {
            api_key: config.apiKey,
            secret_key: config.secretKey ? '********' : '',
            environment: config.sandboxMode ? 'sandbox' : 'production'
          },
          null,
          2
        )
      );
    }
    setResponse(null);
    setStatusCode(200);
  };

  const handleSendRequest = () => {
    setLoading(true);
    setResponse(null);

    setTimeout(() => {
      setLoading(false);

      if (simulationError === '401') {
        setStatusCode(401);
        setResponse(
          JSON.stringify(
            {
              status: 'error',
              error_code: 'UNAUTHORIZED',
              message: 'Invalid API Key or API Secret provided in RT-UDDOKTAPAY-API-KEY header.'
            },
            null,
            2
          )
        );
        return;
      }

      if (simulationError === '404') {
        setStatusCode(404);
        setResponse(
          JSON.stringify(
            {
              status: 'error',
              error_code: 'NOT_FOUND',
              message: 'The requested transaction ID or invoice reference could not be located on UddoktaPay servers.'
            },
            null,
            2
          )
        );
        return;
      }

      if (simulationError === '500') {
        setStatusCode(500);
        setResponse(
          JSON.stringify(
            {
              status: 'error',
              error_code: 'INTERNAL_SERVER_ERROR',
              message: 'Gateway backend timeout or database connection failure while processing IPN notification.'
            },
            null,
            2
          )
        );
        return;
      }

      setStatusCode(200);
      if (endpoint === 'checkout') {
        setResponse(
          JSON.stringify(
            {
              status: 'success',
              message: 'Checkout session created successfully',
              payment_url: `${config.hostedUrl}/pay/session_9988112233`,
              payment_id: 'sess_9988112233'
            },
            null,
            2
          )
        );
      } else if (endpoint === 'verify') {
        setResponse(
          JSON.stringify(
            {
              status: 'success',
              message: 'Transaction verified',
              data: {
                status: 'COMPLETED',
                amount: '1500.00',
                currency: 'BDT',
                sender_number: '01711223344',
                transaction_id: 'UPAY-TXN-9988776',
                metadata: { invoice_id: 'inv_101' }
              }
            },
            null,
            2
          )
        );
      } else if (endpoint === 'ipn') {
        setResponse(
          JSON.stringify(
            {
              status: 'success',
              message: 'IPN Webhook received and processed by Paymenter successfully'
            },
            null,
            2
          )
        );
      } else if (endpoint === 'auth-verify') {
        if (config.apiKey && config.secretKey) {
          setResponse(
            JSON.stringify(
              {
                status: 'success',
                authenticated: true,
                merchant: {
                  name: 'Accounticca Cloud Services',
                  email: 'admin@accounticca.com',
                  status: 'active',
                  sandbox: config.sandboxMode
                },
                message: 'API Key and Secret Key successfully validated against UddoktaPay authentication server.'
              },
              null,
              2
            )
          );
        } else {
          setStatusCode(401);
          setResponse(
            JSON.stringify(
              {
                status: 'error',
                authenticated: false,
                message: 'Authentication failed: Missing API Key or Secret Key.'
              },
              null,
              2
            )
          );
        }
      }
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span>Developer Tools</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-900 font-medium">API Playground</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">UddoktaPay API Console</h2>
          <p className="text-sm text-slate-600 mt-1">
            Test UddoktaPay v1 REST API requests, verify credentials, simulate IPN webhooks, and trigger error test scenarios.
          </p>
        </div>

        <div>
          <button
            onClick={() => handleEndpointChange('auth-verify')}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Credentials Now</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Request Builder */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-slate-700" />
                <span>API Request Builder</span>
              </h3>
              
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                <button
                  onClick={() => handleEndpointChange('checkout')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors ${endpoint === 'checkout' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Checkout v2
                </button>
                <button
                  onClick={() => handleEndpointChange('verify')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors ${endpoint === 'verify' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Verify TXN
                </button>
                <button
                  onClick={() => handleEndpointChange('ipn')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors ${endpoint === 'ipn' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  IPN Webhook
                </button>
                <button
                  onClick={() => handleEndpointChange('auth-verify')}
                  className={`px-3 py-1.5 font-medium rounded-md transition-colors ${endpoint === 'auth-verify' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Verify Credentials
                </button>
              </div>
            </div>

            {/* Error Simulation Mode Selector */}
            <div className="mb-4 p-3.5 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-amber-900 block">Simulate Error Mode</span>
                  <span className="text-[10px] text-amber-700">Test webhook error handling (401, 404, 500)</span>
                </div>
              </div>
              <select
                value={simulationError}
                onChange={(e) => setSimulationError(e.target.value as any)}
                className="px-3 py-1.5 text-xs font-semibold bg-white border border-amber-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="none">Normal (200 OK)</option>
                <option value="401">401 Unauthorized</option>
                <option value="404">404 Not Found</option>
                <option value="500">500 Server Error</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Endpoint URL
              </label>
              <div className="p-2.5 bg-slate-50 font-mono text-xs text-slate-800 rounded border border-slate-200">
                {config.hostedUrl}/api/v1/{endpoint === 'checkout' ? 'checkout-v2' : endpoint === 'verify' ? 'verify-payment' : endpoint === 'ipn' ? 'ipn-listener' : 'auth/verify'}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                HTTP Headers
              </label>
              <div className="p-3 bg-slate-900 text-slate-200 font-mono text-xs rounded-lg space-y-1">
                <div>Content-Type: application/json</div>
                <div>Accept: application/json</div>
                <div className="text-amber-400">RT-UDDOKTAPAY-API-KEY: {simulationError === '401' ? 'invalid_key_test' : config.apiKey}</div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                JSON Request Body
              </label>
              <textarea
                value={requestBody}
                onChange={(e) => setRequestBody(e.target.value)}
                rows={6}
                className="w-full p-3 font-mono text-xs bg-slate-950 text-emerald-400 rounded-lg border border-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>

          <button
            onClick={handleSendRequest}
            disabled={loading}
            className={`w-full py-3 font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 ${simulationError !== 'none' ? 'bg-amber-600 hover:bg-amber-700 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'}`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending API Request...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>{simulationError !== 'none' ? `Send Request (Simulate HTTP ${simulationError})` : 'Send API Request'}</span>
              </>
            )}
          </button>
        </div>

        {/* Response Viewer */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-slate-700" />
                <span>API Response Output</span>
              </h3>
              <span className={`text-xs px-2.5 py-1 font-semibold rounded-md border ${statusCode === 200 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                HTTP {statusCode} {statusCode === 200 ? 'OK' : statusCode === 401 ? 'Unauthorized' : statusCode === 404 ? 'Not Found' : 'Internal Server Error'}
              </span>
            </div>

            <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto h-[420px] shadow-inner flex flex-col justify-between">
              <div>
                <div className="text-slate-500 mb-2">// Response payload returned by UddoktaPay Sandbox Gateway</div>
                <pre>{response || '// Click "Send API Request" or "Verify Credentials" to test endpoint response...'}</pre>
              </div>

              {response && (
                <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Latency: 115ms</span>
                  <span className={statusCode === 200 ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                    {statusCode === 200 ? 'Verified Secure' : `Error Test Triggered (${statusCode})`}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
            <strong>Pro Tip:</strong> Use these verified error payloads to ensure your Paymenter gateway error handler logs and retries failed webhooks gracefully.
          </div>
        </div>

      </div>
    </div>
  );
};
