import PDFDocument from "pdfkit";

// helper for drawing page numbers on all pages in a PDFKit document
export function drawPageNumbers(doc: InstanceType<typeof PDFDocument>) {
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
