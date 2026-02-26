import PDFDocument from "pdfkit";
import { PDF_DESIGNS_MAP } from "./designs/index.js";
import {
  PDF_ORIENTATIONS,
  PDF_PAGE_SIZES,
  PDF_DESIGNS,
} from "../enums/pdf.enum.js";
import { InvoiceItem, InvoicePayload, User } from "../types/invoice.type.js";

// helper for page numbers
function draw_page_numbers(doc: InstanceType<typeof PDFDocument>) {
  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(10)
      .fillColor("#555")
      .text(
        `Page ${i + 1} of ${range.count}`,
        doc.page.width - doc.page.width / 2,
        doc.page.height - 84,
      );
  }
}

export const generate_pdf_service = async (args: {
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
    try {
      const doc = new PDFDocument({
        size: args.size,
        layout: args.orientation,
        bufferPages: true, // needed for page numbers
      });

      const buffers: Buffer[] = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => resolve(Buffer.concat(buffers)));

      // get design dynamically
      const designFn = PDF_DESIGNS_MAP[args.design];
      if (!designFn) throw new Error(`Design ${args.design} not found`);

      // call design function and wait for async ops
      await designFn(doc, args);

      // draw page numbers after design is fully rendered
      if (args.pageNumber) {
        draw_page_numbers(doc);
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
