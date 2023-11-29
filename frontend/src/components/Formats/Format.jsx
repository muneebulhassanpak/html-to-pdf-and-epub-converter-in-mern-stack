import React, { useContext, useState, useRef, useEffect } from "react";
import styles from "./Format.module.css";
import AppContext from "../../store/app-context";
import {
  pdfConversionURL,
  epubConversionURL,
  epubPreviewURL,
  pdfPreviewURL,
} from "../../helpers/URLConstruction";
import { supportedFromats, supportedDesigns } from "../../helpers/utils";
import ePub from "epubjs";

const Format = (props) => {
  const Context = useContext(AppContext);
  const [converting, setConverting] = useState(false);
  const [format, setFormat] = useState("PDF");
  const [template, setTemplate] = useState("None");
  const [previewProgress, setPreviewProgress] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Reference to the EPUB viewer
  const epubViewerRef = useRef(null);

  // EPUB reader instance
  const epubRef = useRef(null);

  // Cleanup function to destroy EPUB when component unmounts
  useEffect(() => {
    return () => {
      if (epubRef.current) {
        epubRef.current.destroy();
      }
    };
  }, []);

  // Data sender function
  const sendData = async (submittedData, format) => {
    let targetURL = format === "PDF" ? pdfConversionURL : epubConversionURL;
    try {
      setConverting(true);
      const response = await fetch(targetURL, {
        method: "POST",
        body: submittedData,
      });

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log(data);
        throw new Error();
      } else {
        // File attachment response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = format === "EPUB" ? "convertedFile.epub" : "generated.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setConverting(false);
        resetContextState();
        document.body.removeChild(a);
        Context.changeNotificationStatus("success", "Successful conversion");
      }
    } catch (error) {
      handleConversionError();
    }
  };

  // EPUB rendering function
  const renderEpub = async (reader) => {
    // Get the first page of the EPUB
    const firstPage = await reader.display();
    setPreviewUrl(firstPage.url);
    console.log("EPUB was rendered");
  };

  const handleEpubPreviewGeneration = async () => {
    const data = new FormData();
    data.append("format", format);
    data.append("template", template);
    data.append("file", Context.file);

    try {
      setPreviewProgress(true);
      const response = await fetch(epubPreviewURL, {
        method: "POST",
        body: data,
      });

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log(data);
        // Handle JSON response if needed
      } else if (contentType && contentType.includes("application/epub+zip")) {
        // EPUB file attachment response
        const blob = await response.blob();

        // Load the EPUB file using epub.js
        const book = ePub(blob);
        const rendition = book.renderTo(epubViewerRef.current, {
          width: 600,
          height: 400,
        });
        const displayed = await rendition.display();
        epubRef.current = rendition;

        // Display the EPUB file in the viewer
        renderEpub(rendition);

        setPreviewProgress(false);
        Context.changeNotificationStatus("success", "Successful conversion");
      } else {
        // Handle other content types if needed
      }
    } catch (error) {
      handleConversionError();
    }
  };

  const dataCollector = async () => {
    if (!Context.file && template == "None") {
      Context.changeErrorStatus("Please upload File");
      return;
    }
    const data = new FormData();
    data.append("format", format);
    data.append("template", template);
    data.append("file", Context.file);
    await sendData(data, format);
  };

  // Function to handle PDF preview generation
  const handlePdfPreviewGeneration = async () => {
    const data = new FormData();
    data.append("format", format);
    data.append("template", template);
    data.append("file", Context.file);

    try {
      setPreviewProgress(true);
      const response = await fetch(pdfPreviewURL, {
        method: "POST",
        body: data,
      });

      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log(data);
        // Handle JSON response if needed
      } else {
        // File attachment response
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        setPreviewUrl(url);
        setPreviewProgress(false);
        Context.changeNotificationStatus("success", "Successful conversion");
      }
    } catch (error) {
      handleConversionError();
    }
  };

  // Function to handle preview generation based on the selected format
  const handlePreviewGeneration = () => {
    if (format === "EPUB") {
      handleEpubPreviewGeneration();
    } else if (format === "PDF") {
      handlePdfPreviewGeneration();
    }
  };

  // Helper function to reset context state
  const resetContextState = () => {
    Context.isFileUploaded = false;
    Context.file = null;
    Context.uploadFile(null, false);
  };

  // Helper function to handle conversion errors
  const handleConversionError = () => {
    Context.changeNotificationStatus(
      "error",
      "Something went wrong converting file"
    );
    setConverting(false);
  };

  return (
    <>
      <div className={styles["format-wrapper"]}>
        <div className={`${props.className} ${styles["format-div"]}`}>
          <div className={styles["format-div__child"]}>
            <h3>Choose the template</h3>
            <select
              className={styles["formats"]}
              onChange={(e) => setTemplate(e.target.value)}
            >
              {supportedDesigns.map((item) => (
                <option
                  key={item.id}
                  value={item.title}
                  className={styles["format-field"]}
                >
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <div className={styles["format-div__child"]}>
            <h3>Choose the output format</h3>
            <select
              className={styles["formats"]}
              onChange={(e) => setFormat(e.target.value)}
            >
              {supportedFromats.map((item) => (
                <option
                  key={item.id}
                  value={item.title}
                  className={styles["format-field"]}
                >
                  {item.title}
                </option>
              ))}
            </select>
          </div>
        </div>
        {Context.file &&
          template !== "None" &&
          !previewProgress &&
          !previewUrl && (
            <div className="center">
              <button
                className={styles["preview-button"]}
                onClick={handlePreviewGeneration}
              >
                Load preview
              </button>
            </div>
          )}
        {previewProgress && (
          <div className="center">
            <button className={styles["generating-button"]}>
              Generating....
            </button>
          </div>
        )}
        {previewUrl && (
          <div className="center">
            <button>
              <a
                className={styles["preview-button-link"]}
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Preview in New Tab
              </a>
            </button>
          </div>
        )}
        <div className={styles["convert-button-div"]}>
          {converting ? (
            <button
              disabled
              className={`${styles["converting"]}  ${styles["green"]} `}
            >
              CONVERTING .....
            </button>
          ) : (
            <button
              disabled={!Context.isFileUploaded || previewProgress}
              className={
                Context.isFileUploaded && !previewProgress
                  ? styles["convert-btn"]
                  : `${styles["convert-btn"]} ${styles["convert-btn__disabled"]}`
              }
              onClick={dataCollector}
            >
              Convert
            </button>
          )}
        </div>
      </div>
      {format === "EPUB" && (
        <div>
          <h3>EPUB Preview</h3>
          <div ref={epubViewerRef} />
        </div>
      )}
    </>
  );
};

export default Format;
