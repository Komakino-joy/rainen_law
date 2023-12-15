import Link from "next/link";
import React from "react";
import styles from "./HomeRecordPreviewCard.module.scss";

interface HomeRecordPreviewCardProps {
  title: string;
  href: string;
  children: any;
}

const HomeRecordPreviewCard: React.FC<HomeRecordPreviewCardProps> = ({
  title = "",
  href = "#",
  children,
}) => {
  return (
    <div className={`light-border ${styles["card-wrapper"]}`}>
      <header>
        <h4>{title}</h4>
      </header>
      <section className={styles["preview-table"]}>{children}</section>
    </div>
  );
};

export default HomeRecordPreviewCard;
