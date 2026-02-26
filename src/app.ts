import express from "express";
import pdf_route from "../src/routes/pdf.route.js";

const app = express();
console.log("express app created");

app.use(express.json());

// pdf route
app.use("/api/pdf", pdf_route);

export default app;