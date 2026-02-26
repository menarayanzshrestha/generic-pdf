import { invoiceDesign } from "./invoice.js";
import { userListDesign } from "./user-list.js";

export const PDF_DESIGNS_MAP: Record<string, Function> = {
  "invoice": invoiceDesign,
  "user-list": userListDesign,
};