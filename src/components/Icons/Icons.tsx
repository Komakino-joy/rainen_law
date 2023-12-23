import React, { forwardRef } from "react";
import styles from "./Icons.module.scss";

type OwnProps = React.SVGProps<SVGSVGElement>;

export const ChevronDown = forwardRef<SVGSVGElement, OwnProps>((props, ref) => (
  <i className={`${styles.chevron} ${styles.down}`} />
));

export const ChevronUp = forwardRef<SVGSVGElement, OwnProps>((props, ref) => (
  <i className={`${styles.chevron} ${styles.up}`} />
));

export const TrashIcon = forwardRef<SVGSVGElement, OwnProps>((props, ref) => (
  <span className={styles["icon-wrapper"]}>
    <svg fill="red" xmlns="http://www.w3.org/2000/svg" height="20" width="20">
      <path d="M6.5 17q-.625 0-1.062-.438Q5 16.125 5 15.5v-10H4V4h4V3h4v1h4v1.5h-1v10q0 .625-.438 1.062Q14.125 17 13.5 17Zm7-11.5h-7v10h7ZM8 14h1.5V7H8Zm2.5 0H12V7h-1.5Zm-4-8.5v10Z" />
    </svg>
  </span>
));

export const PencilIcon = forwardRef<SVGSVGElement, OwnProps>((props, ref) => (
  <span className={styles["icon-wrapper"]}>
    <svg
      fill="#4169E1"
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      width="20"
    >
      <path d="M4.5 19.146q-.625 0-1.062-.438Q3 18.271 3 17.646v-11q0-.625.438-1.063.437-.437 1.062-.437h6.521l-1.5 1.5H4.5v11h11v-4.979l1.5-1.521v6.5q0 .625-.438 1.062-.437.438-1.062.438Zm5.5-7Zm3.625-6.813 1.083 1.084L9.5 11.583v1.063h1.062l5.188-5.167 1.042 1.063-5.604 5.604H8v-3.167Zm3.167 3.209-3.167-3.209 1.771-1.771q.437-.437 1.052-.437.614 0 1.052.437l1.083 1.084q.438.437.438 1.052 0 .614-.438 1.052Z" />
    </svg>
  </span>
));

export const PrinterIcon = forwardRef<SVGSVGElement, OwnProps>((props, ref) => (
  <span className={styles["icon-wrapper"]}>
    <svg fill="green" xmlns="http://www.w3.org/2000/svg" height="20" width="24">
      <path d="M16 8V5H8v3H6V3h12v5ZM4 10h16H6Zm14 2.5q.425 0 .712-.288.288-.287.288-.712t-.288-.713Q18.425 10.5 18 10.5t-.712.287Q17 11.075 17 11.5t.288.712q.287.288.712.288ZM16 19v-4H8v4Zm2 2H6v-4H2v-6q0-1.275.875-2.137Q3.75 8 5 8h14q1.275 0 2.138.863Q22 9.725 22 11v6h-4Zm2-6v-4q0-.425-.288-.713Q19.425 10 19 10H5q-.425 0-.713.287Q4 10.575 4 11v4h2v-2h12v2Z" />
    </svg>
  </span>
));

export const PlusCircleIcon = forwardRef<SVGSVGElement, OwnProps>(
  (props, ref) => (
    <span className={styles["icon-wrapper"]}>
      <svg
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 96 960 960"
        width="24"
      >
        <path d="M440 776h80V616h160v-80H520V376h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
      </svg>
    </span>
  )
);

export const DownArrowIcon = forwardRef<SVGSVGElement, OwnProps>(
  (props, ref) => (
    <span className={styles["icon-wrapper"]}>
      <svg
        fill="#ffa500"
        xmlns="http://www.w3.org/2000/svg"
        height="20"
        viewBox="0 96 960 960"
        width="20"
      >
        <path d="M480 896 160 576l56-57 224 224V256h80v487l224-224 56 57-320 320Z" />
      </svg>
    </span>
  )
);

export const UpArrowIcon = forwardRef<SVGSVGElement, OwnProps>((props, ref) => (
  <span className={styles["icon-wrapper"]}>
    <svg
      fill="rgb(15, 202, 87)"
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      viewBox="0 96 960 960"
      width="20"
    >
      <path d="M440 896V409L216 633l-56-57 320-320 320 320-56 57-224-224v487h-80Z" />
    </svg>
  </span>
));

export const SortIcon = forwardRef<SVGSVGElement, OwnProps>((props, ref) => (
  <span className={styles["icon-wrapper"]}>
    <svg
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
      height="20"
      viewBox="0 96 960 960"
      width="20"
    >
      <path d="M120 816v-80h240v80H120Zm0-200v-80h480v80H120Zm0-200v-80h720v80H120Z" />
    </svg>
  </span>
));

export const InfoIcon = forwardRef<SVGSVGElement, OwnProps>((props, ref) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    ref={ref}
    {...props}
  >
    <path
      fill="rgb(0, 110, 255)"
      d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"
    />
  </svg>
));
