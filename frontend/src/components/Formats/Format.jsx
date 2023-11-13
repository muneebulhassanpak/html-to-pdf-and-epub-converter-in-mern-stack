import React, { useRef, useContext, useState } from "react";

import styles from "./Format.module.css";
import AppContext from "../../store/app-context";
import {
  pdfConversionURL,
  epubConversionURL,
} from "../../helpers/URLConstruction";
import { supportedFromats, supportedDesigns } from "../../helpers/utils";

const Format = () => {
  const Context = useContext(AppContext);
  const [converting, setConverting] = useState(false);
  const formatRef = useRef();
  const templateRef = useRef();

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
    if (!Context.file) {
      Context.changeErrorStatus("Please upload File");
      return;
    }
    const format = formatRef.current.value;
    const template = templateRef.current.value;
    const data = new FormData();
    data.append("format", format);
    data.append("template", template);
    data.append("file", Context.file);
    await sendData(data, format);
  };

  return (
    <>
      <div className={styles["format-div"]}>
        <div className={styles["format-div__child"]}>
          <h3>Choose the template</h3>
          <select className={styles["formats"]} ref={templateRef}>
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
        <br />
        <div className={styles["format-div__child"]}>
          <h3>Choose the output format</h3>
          <select className={styles["formats"]} ref={formatRef}>
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
        <div>
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
    </>
  );
};

export default Format;
