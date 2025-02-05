// pdfController.js
import cloudinary from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import path from "path";
import PdfUpload from "../models/reports.js";

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: (req, file) => {
    const fileName = path.parse(file.originalname).name;
    const uniqueSuffix = Date.now();
    return {
      folder: "pdf-uploads",
      resource_type: "raw",
      public_id: `${fileName}_${uniqueSuffix}`,
      format: "pdf",
    };
  },
});

const upload = multer({ storage });

export const uploadPdf = upload.single("pdf");

export const handleUploadPdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Store only the filename part as publicId
    const publicId = req.file.filename.split(".")[0];

    const pdfUpload = new PdfUpload({
      name: req.file.originalname,
      url: req.file.path,
      publicId: publicId,
      mainHeading: req.body.mainHeading || "",
      subHeading: req.body.subHeading || "",
      additionalData: req.body.additionalText || "",
    });

    const savedPdf = await pdfUpload.save();

    res.status(200).json({
      id: savedPdf._id,
      name: savedPdf.name,
      url: savedPdf.url,
      uploadDate: savedPdf.uploadDate,
      mainHeading: savedPdf.mainHeading,
      subHeading: savedPdf.subHeading,
      additionalData: savedPdf.additionalData,
    });
  } catch (error) {
    console.error("Failed to save PDF data:", error);
    res.status(500).json({ error: "Failed to save PDF data" });
  }
};

export const getUploadedPdfs = async (req, res) => {
  try {
    const files = await PdfUpload.find()
      .sort({ uploadDate: -1 })
      .select("-__v");

    res.status(200).json(files);
  } catch (error) {
    console.error("Failed to fetch files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};

export const deletePdf = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the document in the database
    const pdf = await PdfUpload.findById(id);
    if (!pdf) {
      return res.status(404).json({ error: "File not found in the database" });
    }

    // Attempt to delete the file from Cloudinary
    const cloudinaryResponse = await cloudinary.v2.uploader.destroy(
      pdf.publicId,
      {
        resource_type: "raw",
      }
    );

    console.log("Cloudinary response:", cloudinaryResponse);

    if (cloudinaryResponse.result === "not found") {
      console.warn(
        "File not found in Cloudinary, proceeding with database deletion"
      );
    }

    // Delete the document from the database
    await PdfUpload.findByIdAndDelete(id);

    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Failed to delete file:", error);
    res.status(500).json({ error: `Failed to delete file: ${error.message}` });
  }
};
