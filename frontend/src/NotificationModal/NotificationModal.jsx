import React from "react";
import styles from "./NotificationModal.module.css";

const ErrorModal = (props) => {
  if (props.type == "success") {
    return (
      <div className={`${styles["success-background"]} ${styles["common"]} `}>
        <p className={styles["text-center"]}>{props.children}</p>
      </div>
    );
  }
  return (
    <div className={`${styles["error-background"]}} ${styles["common"]} `}>
      <p className={styles["text-center"]}>{props.children}</p>
    </div>
  );
};

export default ErrorModal;
