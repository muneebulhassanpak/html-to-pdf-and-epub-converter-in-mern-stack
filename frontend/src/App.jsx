import React, { useState, useEffect } from "react";

import styles from "./App.module.css";
import DraggableArea from "./components/DraggingDiv/DraggableArea";
import Format from "./components/Formats/Format";
import Header from "./components/Header/Header";
import AppContext from "./store/app-context";
import ErrorModal from "./ErrorModal/ErrorModal";

const App = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const fileUploadFunction = (file) => {
    setFile(file);
    setIsFileUploaded(true);
  };

  const errorMessage = (message) => {
    setError(message);
    // Automatically clear the error after 3 seconds
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  return (
    <main className={styles["app"]}>
      <Header />
      {error && <ErrorModal>{error}</ErrorModal>}

      <AppContext.Provider
        value={{
          isFileUploaded,
          isThereAnyError: error,
          changeErrorStatus: errorMessage,
          uploadFile: fileUploadFunction,
          file,
        }}
      >
        <section className={styles["centering-div"]}>
          <div className={styles["dragging-section"]}>
            <DraggableArea />
            <Format />
          </div>
        </section>
      </AppContext.Provider>
    </main>
  );
};

export default App;
