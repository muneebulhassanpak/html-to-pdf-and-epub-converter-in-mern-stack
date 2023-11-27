import React, { useContext, useState } from "react";

import styles from "./Format.module.css";
import AppContext from "../../store/app-context";
import {
  pdfConversionURL,
  epubConversionURL,
  epubPreviewURL,
  pdfPreviewURL,
} from "../../helpers/URLConstruction";
import { supportedFromats, supportedDesigns } from "../../helpers/utils";
import Modal from "../Modal/Modal";

const Format = (props) => {
  const Context = useContext(AppContext);
  const [converting, setConverting] = useState(false);
  const [format, setFormat] = useState("PDF");
  const [template, setTemplate] = useState("None");
  const [previewProgress, setPreviewProgress] = useState(false);

  //Data sender
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
        if (format === "EPUB") {
          a.download = "convertedFile.epub";
        } else {
          a.download = "generated.pdf";
        }
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        setConverting(false);
        Context.isFileUploaded = false;
        Context.file = null;
        document.body.removeChild(a);
        Context.uploadFile(null, false);
        Context.changeNotificationStatus("success", "Successful conversion");
      }
    } catch (error) {
      Context.changeNotificationStatus(
        "error",
        "Something went wrong converting file"
      );
      setConverting(false);
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

  const handlePreviewGeneration = async () => {
    const data = new FormData();
    data.append("format", format);
    data.append("template", template);
    data.append("file", Context.file);

    const targetURL = format === "PDF" ? pdfPreviewURL : epubPreviewURL;

    try {
      setPreviewProgress(true);
      const response = await fetch(targetURL, {
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
        const htmlContent = await blob.text();

        // Render HTML content in the Modal component
        ReactDOM.createPortal(
          <Modal htmlContent={htmlContent} />,
          document.getElementById("modal-root")
        );

        setPreviewProgress(false);
        Context.isFileUploaded = false;
        Context.file = null;
        Context.uploadFile(null, false);
        Context.changeNotificationStatus("success", "Successful conversion");
      }
    } catch (error) {
      Context.changeNotificationStatus(
        "error",
        "Something went wrong fetching the preview file"
      );
      setPreviewProgress(false);
    }
  };
  return (
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
          {previewProgress && (
            <div className={styles["format-preview-div"]}>
              <p>Creating.....</p>
            </div>
          )}
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
      {Context.file && template != "None" && (
        <div className="center">
          <button
            className={styles["preview-button"]}
            onClick={handlePreviewGeneration}
          >
            Load preview
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
            disabled={!Context.isFileUploaded}
            className={
              Context.isFileUploaded
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
  );
};

export default Format;
