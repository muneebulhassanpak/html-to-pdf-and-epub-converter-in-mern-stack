const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "storage" });
const router = express.Router();

const {
  pdfConversionController,
  epubConversionController,
} = require("../controllers/fileUpload");

router.post("/convertTopdf", upload.single("file"), pdfConversionController);

router.post("/convertToepub", upload.single("file"), epubConversionController);

module.exports = router;
