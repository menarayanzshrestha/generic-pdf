import { Router } from "express";
import { printPdfController } from "../controllers/pdfKit/pdf.controller.js";
import { pupeteerPdfController } from "../controllers/pupeteer/pupeteer.controller.js";

const router = Router();

// generate and download pdf-kit
router.post("/pdfkit", printPdfController);

// generate and download pupetteer
router.post("/pupeteer", pupeteerPdfController);

export default router;
