import {
  PDF_DESIGNS,
} from "../../enums/pdf.enum.js";
import { InvoicePayload, InvoiceItem, User } from "../../types/invoice.type.js";
import { PDF_PAGE_SIZES, PDF_ORIENTATIONS } from "../../enums/pdf.enum.js";
import { getBrowser } from "../../utils/pupeteer/getBrowser.js";
import { PDF_DESIGNS__PUPETEER_MAP } from "./designs/index.js";
import { PAGE_NUMBER_FOOTER_TEMPLATE } from "./designs/pageNumber.js";

// pupetteer pdf service
export const pupetteerPdfService = async (args: {
  design: (typeof PDF_DESIGNS)[keyof typeof PDF_DESIGNS];
  invoice?: InvoicePayload;
  imageUrl?: string;
  items: InvoiceItem[];
  users: User[];
  size: (typeof PDF_PAGE_SIZES)[keyof typeof PDF_PAGE_SIZES];
  orientation: (typeof PDF_ORIENTATIONS)[keyof typeof PDF_ORIENTATIONS];
  pageNumber: boolean;
}): Promise<Buffer> => {
  return new Promise(async (resolve, reject) => {
    const { design, invoice, items, users, imageUrl, size, orientation, pageNumber } = args;

    try {
      const b = await getBrowser();
      const page = await b.newPage();

      try {

        // generate html from design
        let html: string = "";
        html = PDF_DESIGNS__PUPETEER_MAP[design]({ invoice: invoice!, items, users, imageUrl }) || html;
       
        await page.setContent(html, { waitUntil: "networkidle2" });

        // wait max 2s for images
        try {
          await page.waitForSelector("img", { timeout: 2000 });
        } catch {}

        const pdfUint8Array = await page.pdf({
          format: size,
          printBackground: true,
          landscape: orientation === PDF_ORIENTATIONS.LANDSCAPE,
          displayHeaderFooter: pageNumber,
          headerTemplate: "<div></div>",
          footerTemplate: pageNumber ? PAGE_NUMBER_FOOTER_TEMPLATE : "",
          margin: { top: "0mm", bottom: "10mm", left: "0mm", right: "0mm" },
        });

        // Convert Uint8Array to Buffer for compatibility
        const pdfBuffer = Buffer.from(pdfUint8Array);
        resolve(pdfBuffer);
      } finally {
        try {
          await page.close();
        } catch {}
      }
    } catch (err) {
      reject(err);
    }
  });
};