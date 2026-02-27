import invoiceHtml  from "./invoice.js";
import userListHtml from "./user-list.js";

export const PDF_DESIGNS__PUPETEER_MAP: Record<string, Function> = {
  "invoice": invoiceHtml,
  "user-list": userListHtml,
};