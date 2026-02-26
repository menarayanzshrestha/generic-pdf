export interface InvoiceItem {
  name: string;
  description?: string;
  quantity: number;
  price: number;
}

export interface InvoicePayload {
  number?: string;
  subtotal?: number;
  total?: number;
  shipping?: number;
  discount?: number;
  tax?: number;
  fromName?: string;
  fromAddress?: string;
  toName?: string;
  toAddress?: string;
  issueDate?: string;
  dueDate?: string;
  poNumber?: string;
}

export interface User {
    name: string;
    email: string;
    gender: string;
    role: string;
}