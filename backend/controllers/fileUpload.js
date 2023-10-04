const fs = require("fs");
const pdf = require("html-pdf");
const {
  customizeHtmlStyles,
  generateIndexHtml,
} = require("../utils/pdfGeneration");
const { classicEpubStyles, modernEpubStyles } = require("../templates/styles");

exports.pdfConversionController = async (req, res, next) => {
  console.log("PDF");
  try {
    const { originalname } = req.file;
    const fileExtension = originalname.split(".")[1];
    const newFileName = req.file.path + "." + fileExtension;
    fs.renameSync(req.file.path, newFileName);

    // Load the uploaded HTML file for conversion
    const html = fs.readFileSync(newFileName, "utf-8");

    // Extract all headings (h1 to h6) and generate an index
    const { modifiedHtml, indexHtml } = generateIndexHtml(html);

    // Modify the HTML to change the font family and styles based on the template value
    const finalHtml = customizeHtmlStyles(modifiedHtml, req.body.template);

    // Options for the html-pdf package
    const pdfOptions = {
      format: "A4", // Set the page size to A4
      orientation: "portrait", // or "landscape"
    };

    // Convert HTML to PDF using html-pdf
    pdf.create(finalHtml, pdfOptions).toBuffer((err, pdfBuffer) => {
      if (err) {
        return next(err);
      }

      // Send the PDF as a response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${originalname}.pdf`
      );

      // Combine the indexHtml and PDF content
      const combinedHtml = finalHtml.replace(
        "<body>",
        `<body style="page-break-before: always;">${indexHtml}`
      );
      pdf
        .create(combinedHtml, pdfOptions)
        .toBuffer((indexErr, combinedPdfBuffer) => {
          if (indexErr) {
            return next(indexErr);
          }
          res.send(combinedPdfBuffer);

          // Optionally, you can delete the original HTML file here if needed.
          // fs.unlinkSync(newFileName);
        });
    });
  } catch (err) {
    return next(err);
  }
};

exports.epubConversionController = async (req, res, next) => {
  console.log("EPUB");
  try {
    const { originalname } = req.file;
    const fileExtension = originalname.split(".")[1];
    const newFileName = req.file.path + "." + fileExtension;
    fs.renameSync(req.file.path, newFileName);

    const html = fs.readFileSync(newFileName, "utf-8");

    const { modifiedHtml, indexHtml } = generateIndexHtml(html);

    const template = req.body.template || "Classic";
    const finalHtml = customizeEPUBHtmlStyles(modifiedHtml, template);

    const epubOptions = {
      title: "My EPUB Book",
      author: "Author Name",
      output: `${originalname}.epub`,
      content: [
        {
          title: "Chapter 1",
          data: finalHtml,
        },
      ],
    };

    new epubGen(epubOptions, (err) => {
      if (err) {
        console.log("HERE ERROR");
        return next(err);
      }

      const epubFile = fs.readFileSync(`${originalname}.epub`);

      res.setHeader("Content-Type", "application/epub+zip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${originalname}.epub`
      );

      res.send(epubFile);

      fs.unlinkSync(`${originalname}.epub`);

      fs.unlinkSync(newFileName);
    });
  } catch (err) {
    return next(err);
  }
};

function customizeEPUBHtmlStyles(html, template) {
  let modifiedHtml = html;
  // Apply the appropriate styles based on the template value
  if (template === "Classic") {
    modifiedHtml = modifiedHtml.replace(
      "<style>",
      `<style>${classicEpubStyles}`
    );
  } else if (template === "Modern") {
    modifiedHtml = modifiedHtml.replace(
      "<style>",
      `<style>${modernEpubStyles}`
    );
  }

  return modifiedHtml;
}
