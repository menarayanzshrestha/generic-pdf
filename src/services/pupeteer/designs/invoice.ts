import {
  InvoicePayload,
  InvoiceItem,
  User,
} from "../../../types/invoice.type.js";

// invoice html for pupeteer
const invoiceHtml = (args: {
  user?: User;
  invoice: InvoicePayload;
  items: InvoiceItem[];
  imageUrl?: string;
}): string => {
  const { invoice, items, imageUrl } = args;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  body{ font-family: Arial, Helvetica, sans-serif; padding:10px; padding-bottom:60px; color:#1f2937; }
  .header{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:30px; }
  .logo{ width:50px; width:50px;; }
  .invoice-meta{ text-align:right; }
  .invoice-number{ font-size:28px; font-weight:700; }
  .two-col{ display:flex; justify-content:space-between; margin-top:30px; }
  .box{ width:48%; }
  .label{ color:#6b7280; font-size:14px; margin-bottom:6px; }
  .value{ font-weight:600; margin-bottom:6px; }
  .muted{ color:#6b7280; }
  .triple{ display:flex; justify-content:space-between; margin:30px 0; }
  .triple div{ width:32%; }
  table{ width:100%; border-collapse:collapse; margin-top:20px; }
  th{ background:#eef2f7; text-align:left; padding:12px; font-size:14px; }
  td{ padding:12px; border-bottom:1px solid #eee; }
  .right{ text-align:right; }
  .summary{ width:320px; margin-left:auto; margin-top:30px; page-break-before: always;}
  .summary-row{ display:flex; justify-content:space-between; padding:6px 0; color:#4b5563; }
  .summary-total{ font-size:18px; font-weight:700; margin-top:10px; }
</style>
</head>
<body>

<div class="header">
  <div><img class="logo" src="${imageUrl}" alt="img"/></div>
  <div class="invoice-meta"><div class="invoice-number">${invoice.number}</div></div>
</div>

<div class="two-col">
  <div class="box">
    <div class="label">Invoice From</div>
    <div class="value">${invoice.fromName}</div>
    <div class="muted">${invoice.fromAddress}</div>
  </div>
  <div class="box">
    <div class="label">Invoice To</div>
    <div class="value">${invoice.toName}</div>
    <div class="muted">${invoice.toAddress}</div>
  </div>
</div>

<div class="triple">
  <div><div class="label">Issue Date</div><div class="value">${invoice.issueDate || "-"}</div></div>
  <div><div class="label">Due Date</div><div class="value">${invoice.dueDate || "-"}</div></div>
  <div><div class="label">PO Number</div><div class="value">${invoice.poNumber || "-"}</div></div>
</div>

<table>
<thead>
<tr>
<th style="width:60px">#</th>
<th>Description</th>
<th class="right">Qty</th>
<th class="right">Unit Price</th>
<th class="right">Total</th>
</tr>
</thead>
<tbody>
${items
  .map(
    (item, idx) => `
<tr>
<td>${idx + 1}</td>
<td>${item.name}</td>
<td class="right">${item.quantity}</td>
<td class="right">Rs. ${item.price}</td>
<td class="right">Rs. ${item.quantity * item.price}</td>
</tr>`,
  )
  .join("")}
</tbody>
</table>

<div class="summary">
<div class="summary-row"><span>Total Qty</span><span>${items.reduce((s, i) => s + i.quantity, 0)}</span></div>
<div class="summary-row"><span>Subtotal</span><span>Rs. ${invoice.subtotal}</span></div>
<div class="summary-row"><span>Discount</span><span>-Rs. ${invoice.discount || 0}</span></div>
<div class="summary-row"><span>Taxes</span><span>Rs. ${invoice.tax || 0}</span></div>
<div class="summary-row"><span>Shipping</span><span>Rs. ${invoice.shipping || 0}</span></div>
<div class="summary-row summary-total"><span>Total</span><span>Rs. ${invoice.total}</span></div>
</div>

</body>
</html>
`;
};

export default invoiceHtml;
