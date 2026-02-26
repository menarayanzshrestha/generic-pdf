import { z } from "zod";
import {
  PDF_PAGE_SIZES,
  PDF_ORIENTATIONS,
  PDF_DESIGNS,
  PDF_PAGE_NUMBER,
} from "../enums/pdf.enum.js";

export const querySchema = z.object({
  size: z
    .enum(PDF_PAGE_SIZES, "Invalid page size specified")
    .default(PDF_PAGE_SIZES.A4),

  orientation: z
    .enum(PDF_ORIENTATIONS, "Invalid orientation specified")
    .default(PDF_ORIENTATIONS.PORTRAIT),

  filename: z
    .string()
    .max(50, "Filename cannot be longer than 50 characters")
    .default("document"),

  design: z
    .enum(PDF_DESIGNS, "Invalid design specified")
    .default(PDF_DESIGNS.INVOICE),

  pageNumber: z
    .enum(PDF_PAGE_NUMBER, "Invalid page number option specified")
    .default(PDF_PAGE_NUMBER.TRUE),
});

export const bodySchema = z.object({
  invoice: z
    .object({
      number: z
        .string()
        .max(10, "Invoice number cannot be longer than 10 characters")
        .optional(),
      subtotal: z
        .number()
        .max(9999, "Subtotal cannot be greater than 9999")
        .optional(),
      total: z
        .number()
        .max(9999, "Total cannot be greater than 9999")
        .optional(),
      shipping: z
        .number()
        .max(9999, "Shipping cannot be greater than 9,999")
        .optional(),
      discount: z
        .number()
        .max(100, "Discount cannot be greater than 100")
        .optional(),
      tax: z.number().max(10, "Tax cannot be greater than 10").optional(),
      fromName: z
        .string()
        .max(50, "From name cannot be longer than 50 characters")
        .optional(),
      fromAddress: z
        .string()
        .max(50, "From address cannot be longer than 50 characters")
        .optional(),
      toName: z
        .string()
        .max(50, "To name cannot be longer than 50 characters")
        .optional(),
      toAddress: z
        .string()
        .max(50, "To address cannot be longer than 50 characters")
        .optional(),
      issueDate: z.string().optional(),
      dueDate: z.string().optional(),
      poNumber: z
        .string()
        .max(10, "PO number cannot be longer than 10 characters")
        .optional(),
    })
    .optional(),
  itemsCount: z.number().optional().default(10),
  usersCount: z.number().optional().default(10),
  imageUrl: z.string().optional(),
});
