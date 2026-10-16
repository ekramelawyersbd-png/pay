import { GatewayConfig, Invoice, Transaction, ExtensionFile } from '../types';

export const initialGatewayConfig: GatewayConfig = {
  name: 'uddoktapay',
  displayName: 'UddoktaPay Hosted',
  enabled: true,
  sandboxMode: true,
  apiKey: 'upay_live_sandbox_9f8e7d6c5b4a3z2y1x',
  secretKey: 'sec_upay_987654321abcdef0123456789',
  hostedUrl: 'https://sandbox.uddoktapay.com',
  feePercentage: 1.5,
};

export const initialInvoices: Invoice[] = [
  {
    id: 'inv_101',
    invoiceNumber: 'INV-2026-1001',
    title: 'Cloud VPS Pro - 1 Month (4 vCPU, 8GB RAM)',
    amount: 1500.00,
    currency: 'BDT',
    status: 'pending',
    dueDate: '2026-10-25',
    createdAt: '2026-10-15',
    customerName: 'Tanvir Ahmed',
    customerEmail: 'tanvir@example.com',
    serviceType: 'Server Hosting',
  },
  {
    id: 'inv_102',
    invoiceNumber: 'INV-2026-1002',
    title: 'NVMe SSD Storage Booster (100GB)',
    amount: 650.00,
    currency: 'BDT',
    status: 'pending',
    dueDate: '2026-10-28',
    createdAt: '2026-10-15',
    customerName: 'Sadia Rahman',
    customerEmail: 'sadia@example.com',
    serviceType: 'Addon',
  },
  {
    id: 'inv_103',
    invoiceNumber: 'INV-2026-0988',
    title: 'Dedicated Server Enterprise - Annual',
    amount: 18500.00,
    currency: 'BDT',
    status: 'paid',
    dueDate: '2026-10-10',
    createdAt: '2026-10-01',
    customerName: 'Rahim Chowdhury',
    customerEmail: 'rahim@cloudbd.net',
    serviceType: 'Dedicated Server',
  },
  {
    id: 'inv_104',
    invoiceNumber: 'INV-2026-0975',
    title: 'Managed Kubernetes Cluster Node',
    amount: 3200.00,
    currency: 'BDT',
    status: 'paid',
    dueDate: '2026-09-30',
    createdAt: '2026-09-15',
    customerName: 'Farhan Kabir',
    customerEmail: 'farhan@devops.bd',
    serviceType: 'Kubernetes',
  },
  {
    id: 'inv_105',
    invoiceNumber: 'INV-2026-1055',
    title: 'Income Tax Return Workbook 2026 (Digital E-Book & Guide)',
    amount: 1250.00,
    currency: 'BDT',
    status: 'pending',
    dueDate: '2026-10-30',
    createdAt: '2026-10-15',
    customerName: 'Ekram Hossain',
    customerEmail: 'ekram.elawyersbd@gmail.com',
    serviceType: 'Digital E-Book',
  }
];

export const initialTransactions: Transaction[] = [
  {
    id: 'txn_901',
    invoiceId: 'inv_103',
    transactionId: 'UPAY-TXN-8849201',
    amount: 18500.00,
    currency: 'BDT',
    status: 'COMPLETED',
    paymentMethod: 'bKash',
    senderNumber: '01711XXXXXX',
    date: '2026-10-08 14:22:10',
    ipnPayload: {
      status: 'completed',
      invoice_id: 'inv_103',
      amount: '18500.00',
      metadata: { invoice_id: 'inv_103' },
      sender_number: '01711XXXXXX',
      transaction_id: 'UPAY-TXN-8849201',
      date: '2026-10-08 14:22:10'
    }
  },
  {
    id: 'txn_902',
    invoiceId: 'inv_104',
    transactionId: 'UPAY-TXN-7738291',
    amount: 3200.00,
    currency: 'BDT',
    status: 'COMPLETED',
    paymentMethod: 'Nagad',
    senderNumber: '01819XXXXXX',
    date: '2026-09-28 11:05:43',
    ipnPayload: {
      status: 'completed',
      invoice_id: 'inv_104',
      amount: '3200.00',
      metadata: { invoice_id: 'inv_104' },
      sender_number: '01819XXXXXX',
      transaction_id: 'UPAY-TXN-7738291',
      date: '2026-09-28 11:05:43'
    }
  }
];

export const extensionFiles: ExtensionFile[] = [
  {
    path: 'extensions/Gateways/UddoktaPay/gateway.json',
    name: 'gateway.json',
    language: 'json',
    description: 'Gateway manifest defining settings fields (API Key, Secret, Hosted URL) for Paymenter admin panel.',
    content: `{
    "name": "UddoktaPay Hosted",
    "author": "UddoktaPay",
    "version": "1.0.0",
    "description": "Accept automated payments in Paymenter via UddoktaPay (bKash, Nagad, Rocket, Cards)",
    "fields": [
        {
            "name": "api_key",
            "label": "API Key",
            "type": "text",
            "required": true
        },
        {
            "name": "secret_key",
            "label": "API Secret",
            "type": "password",
            "required": true
        },
        {
            "name": "hosted_url",
            "label": "Hosted Checkout URL",
            "type": "text",
            "required": true,
            "default": "https://pay.uddoktapay.com"
        }
    ]
}`
  },
  {
    path: 'extensions/Gateways/UddoktaPay/UddoktaPayServiceProvider.php',
    name: 'UddoktaPayServiceProvider.php',
    language: 'php',
    description: 'Laravel Service Provider registering the UddoktaPay gateway with Paymenter payment manager.',
    content: `<?php

namespace Extensions\\Gateways\\UddoktaPay;

use App\\Classes\\Extension;
use App\\Facades\\Gateway;
use Illuminate\\Support\\ServiceProvider;

class UddoktaPayServiceProvider extends ServiceProvider
{
    public function register()
    {
        //
    }

    public function boot()
    {
        Gateway::add('uddoktapay', function () {
            return new UddoktaPayGateway();
        });
    }
}
`
  },
  {
    path: 'extensions/Gateways/UddoktaPay/UddoktaPayGateway.php',
    name: 'UddoktaPayGateway.php',
    language: 'php',
    description: 'Gateway driver handling payment creation request and IPN verification webhook response.',
    content: `<?php

namespace Extensions\\Gateways\\UddoktaPay;

use App\\Models\\Invoice;
use App\\Models\\Payment;
use App\\Classes\\Gateway\\GatewayInterface;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Http;

class UddoktaPayGateway implements GatewayInterface
{
    public function pay(Invoice $invoice, Payment $payment)
    {
        $apiKey = config('gateway.uddoktapay.api_key');
        $secretKey = config('gateway.uddoktapay.secret_key');
        $hostedUrl = rtrim(config('gateway.uddoktapay.hosted_url'), '/');

        $response = Http::withHeaders([
            'RT-UDDOKTAPAY-API-KEY' => $apiKey,
            'Accept' => 'application/json',
        ])->post("{$hostedUrl}/api/v1/checkout-v2", [
            'full_name' => $invoice->user->name ?? 'Customer',
            'email' => $invoice->user->email ?? 'customer@example.com',
            'amount' => $invoice->total,
            'metadata' => [
                'invoice_id' => $invoice->id,
                'payment_id' => $payment->id,
            ],
            'redirect_url' => route('gateway.uddoktapay.success'),
            'cancel_url' => route('gateway.uddoktapay.cancel'),
            'webhook_url' => route('gateway.uddoktapay.ipn'),
        ]);

        if ($response->successful() && isset($response->json()['payment_url'])) {
            return redirect()->away($response->json()['payment_url']);
        }

        return back()->with('error', 'Unable to initiate UddoktaPay session.');
    }

    public function ipn(Request $request)
    {
        $apiKey = $request->header('RT-UDDOKTAPAY-API-KEY');
        $expectedApiKey = config('gateway.uddoktapay.api_key');

        if ($apiKey !== $expectedApiKey) {
            return response()->json(['error' => 'Unauthorized API Key'], 401);
        }

        $status = $request->input('status');
        $metadata = $request->input('metadata');

        if ($status === 'COMPLETED') {
            $invoiceId = $metadata['invoice_id'] ?? null;
            // Complete Payment in Paymenter
            \\App\\Classes\\Receipt::create($invoiceId, $request->input('transaction_id'));
        }

        return response()->json(['status' => 'success']);
    }
}
`
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Installation instructions for UddoktaPay extension in Paymenter.',
    content: `# UddoktaPay Payment Gateway for Paymenter

### Installation Instructions
1. Upload the UddoktaPay folder to \`extensions/Gateways\` in your Paymenter root directory.
2. Open your Paymenter Admin Panel.
3. Go to **Gateways > Add New**.
4. Select **"UddoktaPay Hosted"**.
5. Enter your API key, secret, and hosted URL (use \`https://sandbox.uddoktapay.com\` for sandbox testing).
6. Save and you're ready to accept automated payments for your users immediately!

Repository: https://github.com/uddoktapay/paymenter.git
`
  }
];
