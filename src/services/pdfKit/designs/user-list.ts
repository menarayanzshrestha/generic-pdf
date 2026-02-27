import PDFDocument from "pdfkit";
import { A3_WIDTH, A6_WIDTH } from "../../../constants/pdf.js";

export const userListDesign = (
  doc: InstanceType<typeof PDFDocument>,
  args: { users: any[] },
) => {
  // get page width and height
  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // dynamic margin based on page size
  let margin = 40;
  if (pageWidth >= A3_WIDTH)
    margin = 30; // smaller margin for A3
  else if (pageWidth <= 420) margin = 10; // smaller margin for A6
  const contentWidth = pageWidth - 2 * margin;

  // font settings
  const font = "Helvetica";
  const fontBold = "Helvetica-Bold";
  let smallFont = 10;
  let normalFont = 11;
  if (pageWidth <= A6_WIDTH) {
    smallFont = 7; // tiny font for A6
    normalFont = 8;
  }

  const darkColor = "#111827";
  const lightColor = "#f0f2f5";

  doc.font(font);

  // define column percentages based on page width for responsive design
  let colPercent;
  if (pageWidth <= A6_WIDTH) {
    colPercent = {
      sn: 0.1,
      name: 0.34,
      email: 0.32,
      gender: 0.12,
      role: 0.12,
    };
  } else {
    colPercent = {
      sn: 0.05,
      name: 0.25,
      email: 0.4,
      gender: 0.15,
      role: 0.15,
    };
  }

  // calculate column widths
  const colWidth = {
    sn: contentWidth * colPercent.sn,
    name: contentWidth * colPercent.name,
    email: contentWidth * colPercent.email,
    gender: contentWidth * colPercent.gender,
    role: contentWidth * colPercent.role,
  };

  // calculate x positions for each column
  const colX = {
    sn: margin,
    name: margin + colWidth.sn,
    email: margin + colWidth.sn + colWidth.name,
    gender: margin + colWidth.sn + colWidth.name + colWidth.email,
    role:
      margin + colWidth.sn + colWidth.name + colWidth.email + colWidth.gender,
  };

  // function to draw table header
  function drawUserTableHeader(yPos: number) {
    doc.rect(margin, yPos, contentWidth, 25).fill(lightColor);
    doc.font(fontBold).fontSize(normalFont).fillColor(darkColor);
    doc.text("SN", colX.sn, yPos + 7, { width: colWidth.sn, align: "left" });
    doc.text("Name", colX.name, yPos + 7, { width: colWidth.name });
    doc.text("Email", colX.email, yPos + 7, { width: colWidth.email });
    doc.text("Gender", colX.gender, yPos + 7, { width: colWidth.gender });
    doc.text("Role", colX.role, yPos + 7, {
      width: colWidth.role,
      ellipsis: true,
    });
    return yPos + 30;
  }

  // start table at top
  let tableY = 40;
  tableY = drawUserTableHeader(tableY);

  // make sure we have a users array to iterate over; otherwise `.forEach`
  // would blow up when `args.users` is undefined.
  const users = args.users ?? [];

  // draw table rows
  users.forEach((user, idx) => {
    const rowHeight = 20;

    // page break if row exceeds page height
    if (tableY + rowHeight > pageHeight - 80) {
      doc.addPage();
      tableY = drawUserTableHeader(40);
    }

    doc.font(font).fontSize(smallFont).fillColor(darkColor);
    doc.text((idx + 1).toString(), colX.sn, tableY, {
      width: colWidth.sn,
      align: "left",
    });
    doc.text(user.name, colX.name, tableY, { width: colWidth.name });
    doc.text(user.email, colX.email, tableY, { width: colWidth.email });
    doc.text(user.gender || "-", colX.gender, tableY, {
      width: colWidth.gender,
    });
    doc.text(user.role || "-", colX.role, tableY, {
      width: colWidth.role,
      ellipsis: true,
    });

    // draw row divider
    doc
      .strokeColor("#e5e7eb")
      .lineWidth(0.5)
      .moveTo(margin, tableY + rowHeight - 2)
      .lineTo(pageWidth - margin, tableY + rowHeight - 2)
      .stroke();

    tableY += rowHeight;
  });

  return doc;
};
