export interface GatewayConfig {
  name: string;
  displayName: string;
  enabled: boolean;
  sandboxMode: boolean;
  apiKey: string;
  secretKey: string;
  hostedUrl: string;
  feePercentage: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  title: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  dueDate: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  serviceType: string;
}

export interface Transaction {
  id: string;
  invoiceId: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  paymentMethod: string;
  senderNumber: string;
  date: string;
  ipnPayload: Record<string, any>;
}

export interface ExtensionFile {
  path: string;
  name: string;
  language: string;
  description: string;
  content: string;
}
