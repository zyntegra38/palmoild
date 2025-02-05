import mongoose from "mongoose";

const pdfUploadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    mainHeading: {
      type: String,
      required: false,
    },
    subHeading: {
      type: String,
      required: false,
    },
    additionalData: {
      type: String,
      required: false,
    },
  },
  {
    collection: "pdf_uploads", // Define the new collection name
  }
);

const PdfUpload = mongoose.model("PdfUpload", pdfUploadSchema);

export default PdfUpload;
