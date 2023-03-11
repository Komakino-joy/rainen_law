import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
// @ts-ignore
import styled from "styled-components";
import styles from './Modal.module.scss'

interface ModalProps {
  show: boolean;
  onClose: Function;
  children: any;
  title: string;
}

const Modal:React.FC<ModalProps> = ({ 
  show, 
  onClose, 
  children, 
  title
}) => {

  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  const handleCloseClick = (e: any) => {
    e.preventDefault();
    onClose();
  };

  const modalContent = show ? (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]}>
        <div className={styles["modal-header"]}>
          <a className={styles["close-icon"]} href="#" onClick={handleCloseClick}>
            x
          </a>
        </div>
        {title && <p>{title}</p>}
        <div className={styles["modal-body"]}>{children}</div>
      </div>
    </div>
  ) : null;

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      // @ts-ignore
      document.getElementById('modal-root')
    );
  } else {
    return null;
  }
};

export default Modal;