import React from "react";
import styles from "./Pagination.module.scss";
import Link from "next/link";

interface OwnProps {
  totalRecords: number;
  pageSize: number;
  currentPage: number;
  href: string;
}

const Pagination: React.FC<OwnProps> = ({
  totalRecords,
  pageSize,
  currentPage,
  href,
}) => {
  if (totalRecords < pageSize) return null;

  const totalPages = Math.floor(totalRecords / pageSize) || 1;
  const siblingCount = 5;
  const leftHandSiblings = Array.from(
    { length: siblingCount },
    (_, i) => currentPage - siblingCount + i
  );
  const rightHandSiblings = Array.from(
    { length: siblingCount },
    (_, i) => currentPage + i + 1
  );

  return (
    <div className={styles["pagination-controls"]}>
      {currentPage !== 1 && (
        <>
          <Link href={`/${href}/1`} className={styles["pagination-button"]}>
            {"<<"}
          </Link>
          <Link
            href={`/${href}/${currentPage - 1}`}
            className={styles["pagination-button"]}
          >
            {"<"}
          </Link>
        </>
      )}

      {[...leftHandSiblings, currentPage, ...rightHandSiblings].map(
        (pageNumber) => {
          if (pageNumber <= 0) return null;
          if (pageNumber > totalPages) return null;
          return (
            <Link
              key={pageNumber}
              href={`/${href}/${pageNumber}`}
              className={`${styles["pagination-button"]} ${
                pageNumber === currentPage ? styles["active"] : ""
              }`}
            >
              {pageNumber}
            </Link>
          );
        }
      )}

      {currentPage !== totalPages && (
        <>
          <Link
            className={styles["pagination-button"]}
            href={`/${href}/${currentPage + 1}`}
          >
            {">"}
          </Link>
          <Link
            className={styles["pagination-button"]}
            href={`/${href}/${totalPages}`}
          >
            {">>"}
          </Link>
        </>
      )}
    </div>
  );
};

export default Pagination;
