import express from "express";
import {
  uploadPdf,
  handleUploadPdf,
  getUploadedPdfs,
  deletePdf,
} from "../controllers/pdfController.js";

const router = express.Router();

router.post("/upload", uploadPdf, handleUploadPdf);
router.get("/files", getUploadedPdfs);
router.delete("/delete/:id", deletePdf);

export default router;
