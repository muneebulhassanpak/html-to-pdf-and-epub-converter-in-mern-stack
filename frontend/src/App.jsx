import React, { useState, useEffect } from "react";

import styles from "./App.module.css";
import DraggableArea from "./components/DraggingDiv/DraggableArea";
import Format from "./components/Formats/Format";
import Header from "./components/Header/Header";
import AppContext from "./store/app-context";
import ErrorModal from "./NotificationModal/NotificationModal";

const App = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [notification, setNotification] = useState(null);
  const [file, setFile] = useState(null);

  const fileUploadFunction = (file, status) => {
    setFile(file);
    setIsFileUploaded(status);
  };

  const notificationMessage = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  return (
    <main className={styles["app"]}>
      <Header />
      {notification && (
        <ErrorModal type={notification.type}>{notification.message}</ErrorModal>
      )}

      <AppContext.Provider
        value={{
          isFileUploaded,
          isThereAnyError: notification,
          changeNotificationStatus: notificationMessage,
          uploadFile: fileUploadFunction,
          file,
        }}
      >
        <section className={styles["centering-div"]}>
          <div className={styles["dragging-section"]}>
            <DraggableArea className="draggable-div" />
            <Format className="format-div" />
          </div>
        </section>
      </AppContext.Provider>
    </main>
  );
};

export default App;
