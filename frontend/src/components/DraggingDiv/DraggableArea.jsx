import React, { useState, useRef, useContext, useEffect } from "react";
import styles from "./DraggableArea.module.css";
import AppContext from "../../store/app-context";

const DraggableArea = () => {
  // Context logic
  const Context = useContext(AppContext);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setFile(Context.file);
  }, [Context.file]);

  const dragRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    const file = e.dataTransfer.files[0];

    if (file) {
      if (file.size > 100 * 1024) {
        alert("File size exceeds the maximum limit (100KB).");
        return;
      }
      if (!file.name.endsWith(".html")) {
        alert("Only HTML files are allowed.");
        return;
      }

      let progress = 0;
      const interval = setInterval(() => {
        progress += 5;
        if (progress >= 100) {
          clearInterval(interval);
        }
        setUploadProgress(progress);
      }, 200);

      setTimeout(() => {
        setUploadProgress(0);
        alert("File uploaded successfully.");
        Context.uploadFile(file);
      }, 4000);
    }
  };

  return (
    <div
      ref={dragRef}
      onDragOver={(e) => {
        setDrag(true);
        handleDragOver(e);
      }}
      onDragLeave={() => {
        setDrag(false);
      }}
      onDrop={handleDrop}
      className={
        drag
          ? `${styles["drag-div"]} ${styles["dragging"]}`
          : styles["drag-div"]
      }
    >
      {uploadProgress > 0 && (
        <div>
          <svg width="100" height="100" className="progress-circle">
            <circle
              r="40"
              cx="50"
              cy="50"
              fill="transparent"
              stroke="#007BFF"
              strokeWidth="8"
              strokeDasharray="251.2"
              strokeDashoffset={(251.2 * (100 - uploadProgress)) / 100}
            />
          </svg>
          <div>{`${uploadProgress}%`}</div>
        </div>
      )}
      {file ? (
        <div>
          UPLOADED
          <br />
          <h4>{Context?.file?.name}</h4>
          <br />
          <h5>{Context?.file?.size / 1000}kb</h5>
        </div>
      ) : (
        uploadProgress === 0 && <div>Drag & Drop a HTML file (Max 100KB)</div>
      )}
    </div>
  );
};

export default DraggableArea;
