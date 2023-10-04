import React from "react";
import styles from "./ErrorModal.module.css";

const ErrorModal = (props) => {
  return (
    <div className={styles["error-background"]}>
      <p className={styles["text-center"]}>{props.children}</p>
    </div>
  );
};

export default ErrorModal;
