import PDFDocument from "pdfkit";
import { loadImage } from "../../../utils/pdfkit/loadImage.js";
import { A3_WIDTH, FONT, FONT_BOLD } from "../../../constants/pdf.js";
import { InvoiceItem } from "../../../types/invoice.type.js";

export const invoiceDesign = async (
  doc: InstanceType<typeof PDFDocument>,
  args: {
    invoice: any;
    items: InvoiceItem[];
    imageUrl?: string;
  },
) => {
  // get page width and height
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // dynamic margin and content width based on page size
  const margin = pageWidth >= A3_WIDTH ? 30 : 15;
  const contentWidth = pageWidth - 2 * margin;

  // starting y position
  let yPos = 40;

  // fonts and colors
  const font = FONT
  const fontBold = FONT_BOLD
  const smallFont = 10;
  const normalFont = 11;
  const grayColor = "#6b7280";
  const lightColor = "#f3f4f6";
  const darkColor = "#111827";

  // row height adjusts for larger pages like A3
  const rowHeight = pageWidth >= A3_WIDTH ? 28 : 32;

  doc.font(font);

  // load and draw logo if provided
  if (args.imageUrl) {
    try {
      const img = await loadImage(args.imageUrl);
      doc.image(img, margin, yPos, { width: 45, height: 45, fit: [45, 45] });
    } catch {}
  }

  // draw invoice number on top right
  doc
    .font(fontBold)
    .fontSize(18)
    .fillColor(darkColor)
    .text(args.invoice.number || "-", margin, yPos, {
      width: contentWidth,
      align: "right",
    });

  // move y position below header
  yPos += 50;

  // draw "Invoice From" and "Invoice To" labels
  doc.font(font).fontSize(smallFont).fillColor(grayColor);
  doc.text("Invoice From", margin, yPos);
  doc.text("Invoice To", margin + contentWidth / 2, yPos);

  // draw from/to names
  doc.font(fontBold).fontSize(normalFont).fillColor(darkColor);
  doc.text(args.invoice.fromName || "-", margin, yPos + 15);
  doc.text(args.invoice.toName || "-", margin + contentWidth / 2, yPos + 15);

  // draw from/to addresses
  doc.font(font).fontSize(smallFont).fillColor(grayColor);
  doc.text(args.invoice.fromAddress || "-", margin, yPos + 30, {
    width: contentWidth / 2 - 10,
  });
  doc.text(
    args.invoice.toAddress || "-",
    margin + contentWidth / 2,
    yPos + 30,
    { width: contentWidth / 2 - 10 },
  );

  // move y position below addresses
  yPos += 80;

  // info row
  const info = [
    ["Issue Date", args.invoice.issueDate || "-"],
    ["Due Date", args.invoice.dueDate || "-"],
    ["PO No", args.invoice.poNumber || "-"],
  ];

  // calculating column width dynamically
  const infoColWidth = contentWidth / info.length;
  let infoX = margin;

  // draw each info label/value
  info.forEach(([label, value]) => {
    // draw label
    doc
      .font(font)
      .fontSize(smallFont)
      .fillColor(grayColor)
      .text(label, infoX, yPos);

    // draw value below label
    doc
      .font(fontBold)
      .fontSize(normalFont)
      .fillColor(darkColor)
      .text(value, infoX, yPos + 14, {
        width: infoColWidth,
        align: "left",
      });

    // move to next column
    infoX += infoColWidth;
  });

  // move y position below info row
  yPos += 45;

  // define column percentages
  const colPercent = {
    sn: 0.05,
    desc: 0.5,
    qty: 0.1,
    unit: 0.15,
    total: 0.2,
  };

  // calculate column widths based on content width
  const colWidth = {
    sn: contentWidth * colPercent.sn,
    desc: contentWidth * colPercent.desc,
    qty: contentWidth * colPercent.qty,
    unit: contentWidth * colPercent.unit,
    total: contentWidth * colPercent.total,
  };

  // calculate x positions of each column
  const colX = {
    sn: margin,
    desc: margin + colWidth.sn,
    qty: margin + colWidth.sn + colWidth.desc,
    unit: margin + colWidth.sn + colWidth.desc + colWidth.qty,
    total: margin + colWidth.sn + colWidth.desc + colWidth.qty + colWidth.unit,
  };

  // draw table header background
  doc.rect(margin, yPos, contentWidth, rowHeight).fill(lightColor);
  doc.font(fontBold).fontSize(normalFont).fillColor(darkColor);

  // draw table header text
  doc.text("#", colX.sn, yPos + 8);
  doc.text("Description", colX.desc, yPos + 8);
  doc.text("Qty", colX.qty, yPos + 8, {
    width: colWidth.qty,
    align: "right",
  });
  doc.text("Price", colX.unit, yPos + 8, {
    width: colWidth.unit,
    align: "right",
  });
  doc.text("Total", colX.total, yPos + 8, {
    width: colWidth.total,
    align: "right",
  });

  // move y position below header
  yPos += rowHeight;

  // initialize subtotal
  let subtotal = 0;

  const lineItems = args.items ?? [];

  // loop through each item and draw row
  for (let i = 0; i < lineItems.length; i++) {
    const item = lineItems[i];
    const total = item.quantity * item.price;
    subtotal += total;

    // add new page if row exceeds page height
    if (yPos + rowHeight > pageHeight - 100) {
      doc.addPage();
      yPos = 40;

      // redraw table header on new page
      doc.rect(margin, yPos, contentWidth, rowHeight).fill(lightColor);
      doc.font(fontBold).fontSize(normalFont).fillColor(darkColor);
      doc.text("#", colX.sn, yPos + 8);
      doc.text("Description", colX.desc, yPos + 8);
      doc.text("Qty", colX.qty, yPos + 8, {
        width: colWidth.qty,
        align: "right",
      });
      doc.text("Price", colX.unit, yPos + 8, {
        width: colWidth.unit,
        align: "right",
      });
      doc.text("Total", colX.total, yPos + 8, {
        width: colWidth.total,
        align: "right",
      });

      yPos += rowHeight;
    }

    // draw item number
    doc.font(font).fontSize(smallFont).fillColor(darkColor);
    doc.text((i + 1).toString(), colX.sn, yPos);

    // draw item name
    doc.font(fontBold).fontSize(normalFont);
    doc.text(item.name, colX.desc, yPos);

    // draw item description
    doc.font(font).fontSize(smallFont).fillColor(grayColor);
    doc.text(item.description || "", colX.desc, yPos + 14, {
      width: colWidth.desc,
      lineGap: 2,
    });

    // draw quantity, unit price and total
    doc.font(font).fillColor(darkColor);
    doc.text(`${item.quantity}`, colX.qty, yPos, {
      width: colWidth.qty,
      align: "right",
    });
    doc.text(`Rs. ${item.price}`, colX.unit, yPos, {
      width: colWidth.unit,
      align: "right",
    });
    doc.font(fontBold);
    doc.text(`Rs. ${total}`, colX.total, yPos, {
      width: colWidth.total,
      align: "right",
    });

    // draw row divider
    doc
      .strokeColor("#e5e7eb")
      .lineWidth(0.5)
      .moveTo(margin, yPos + rowHeight - 4)
      .lineTo(pageWidth - margin, yPos + rowHeight - 4)
      .stroke();

    // move y position to next row
    yPos += rowHeight;
  }

  // calculate totals first
  const totals = [
    ["Total Qty", `999`],
    ["Subtotal", `Rs. ${args.invoice.subtotal ?? subtotal}`],
    ["Shipping", `Rs. ${args.invoice.shipping ?? 0}`],
    ["Discount", `-Rs. ${args.invoice.discount ?? 0}`],
    ["Total", `Rs. ${args.invoice.total ?? subtotal}`],
  ];

  // layout config here
  const boxWidth = 90;
  const labelWidth = 100;
  const rowSpacing = 20;
  const totalsHeight = totals.length * rowSpacing + 20; // full required height
  const boxX = pageWidth - margin - boxWidth;

  // check overflow for this total section and add page if needed
  if (yPos + totalsHeight > pageHeight - 50) {
    doc.addPage();
    yPos = 60; // reset top spacing
  }

  let tyPos = yPos + 20;

  totals.forEach(([label, value], i) => {
    const isTotal = i === totals.length - 1;
    const isDiscount = label === "Discount";

    // draw label
    doc
      .font(isTotal ? fontBold : font)
      .fontSize(isTotal ? 13 : 11)
      .fillColor(isTotal ? darkColor : grayColor)
      .text(label, boxX - labelWidth, tyPos, {
        width: labelWidth,
        align: "left",
      });

    // draw value
    doc
      .font(fontBold)
      .fontSize(isTotal ? 13 : 11)
      .fillColor(isDiscount ? "#DC2626" : darkColor)
      .text(value, boxX, tyPos, {
        width: boxWidth,
        align: "right",
      });

    tyPos += rowSpacing;
  });

  return doc;
};
