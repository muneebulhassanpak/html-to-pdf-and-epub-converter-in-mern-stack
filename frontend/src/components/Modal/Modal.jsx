import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./Modal.module.css";

const Modal = ({ htmlContent }) => {
  const modalRoot = document.getElementById("modal-root");
  const modalContainer = document.createElement("div");

  useEffect(() => {
    modalRoot.appendChild(modalContainer);

    return () => {
      modalRoot.removeChild(modalContainer);
    };
  }, [modalContainer, modalRoot]);

  return ReactDOM.createPortal(
    <section className={styles["modal"]}>
      <div
        className={styles["modalContent"]}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </section>,
    modalContainer
  );
};

export default Modal;
