import React, { useState } from "react";
import styles from "./Tooltip.module.scss";

type OwnProps = {
  text: string;
  icon: React.ReactNode;
};

const Tooltip: React.FC<OwnProps> = ({ text, icon }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`tooltip ${styles["tooltip-container"]}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles["icon"]}>{icon}</div>
      {isHovered && <div className={styles["tooltip-text"]}>{text}</div>}
    </div>
  );
};

export default Tooltip;
