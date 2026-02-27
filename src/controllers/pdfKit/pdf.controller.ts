import { Request, Response } from "express";
import { bodySchema, querySchema } from "../../validators/pdf.validator.js";
import { generatePdfService } from "../../services/pdfKit/pdf.service.js";
import { InvoiceItem, User } from "../../types/invoice.type.js";
export const printPdfController = async (req: Request, res: Response) => {
  try {
    // Validate query
    const queryResult = querySchema.safeParse(req.query);
    if (!queryResult.success) {
      return res.status(400).json({
        success: false,
        errors: queryResult.error.format(),
      });
    }
    const query = queryResult.data;

    // Validate body
    const bodyResult = bodySchema.safeParse(req.body);
    if (!bodyResult.success) {
      return res.status(400).json({
        success: false,
        errors: bodyResult.error.format(),
      });
    }
    const body = bodyResult.data;

    // build items array for invoice design
    let items: InvoiceItem[] = [];
    if (body.itemsCount && body.itemsCount > 0) {
      items = Array.from({ length: body.itemsCount }, (_, i) => ({
        name: `Product ${i + 1}`,
        description: `Awesome item ${i + 1}`,
        quantity: (i % 5) + 1,
        price: ((i % 5) + 1) * 50,
      }));
    }

    // build users array for user-list design
    let users: User[] = [];
    if (body.usersCount && body.usersCount > 0) {
      users = Array.from({ length: body.usersCount }, (_, i) => ({
        name: `Test${i + 1}`,
        email: `Test${i + 1}@gmail.com`,
        gender: i % 2 === 0 ? "Male" : "Female",
        role: i % 2 === 0 ? "Admin" : "User",
      }));
    }

    //generate PDF buffer from service
    const pdf_buffer = await generatePdfService({
      invoice: body.invoice,
      items: items,
      users: users,
      imageUrl: body.imageUrl,
      size: query.size,
      orientation: query.orientation,
      design: query.design,
      pageNumber: query.pageNumber === "true",
    });

    //return PDF as response with appropriate headers for download
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${query.filename}.pdf`,
    );

    //return pdf buffer as response
    return res.send(pdf_buffer);
  } catch (err: any) {
    //handle errors and return JSON response with error message
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};
