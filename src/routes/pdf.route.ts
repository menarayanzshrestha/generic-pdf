import { Router } from "express";
import { print_pdf_controller } from "../controllers/pdf.controller.js";

const router = Router();

// generate and download pdf-kit
router.post("/pdfkit", print_pdf_controller);

export default router;
