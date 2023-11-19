const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "storage" });
const router = express.Router();

const {
  pdfConversionController,
  epubConversionController,
  pdfPreviewController,
  epubPreviewController,
} = require("../controllers/fileUpload");

router.post("/convertTopdf", upload.single("file"), pdfConversionController);

router.post("/convertToepub", upload.single("file"), epubConversionController);

router.post("/epubpreview", upload.single("file"), epubPreviewController);

router.post("/pdfpreview", upload.single("file"), pdfPreviewController);

module.exports = router;
