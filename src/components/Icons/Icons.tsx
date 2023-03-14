import React from "react"
import styles from "./Icons.module.scss"

export const ChevronDown = () => (
  <i className={`${styles.chevron} ${styles.down}`} />
)

export const ChevronUp = () => (
  <i className={`${styles.chevron} ${styles.up}`} />
)

export const TrashIcon = () => (
  <span className={styles['icon-wrapper']}>
    <svg fill='red' xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M6.5 17q-.625 0-1.062-.438Q5 16.125 5 15.5v-10H4V4h4V3h4v1h4v1.5h-1v10q0 .625-.438 1.062Q14.125 17 13.5 17Zm7-11.5h-7v10h7ZM8 14h1.5V7H8Zm2.5 0H12V7h-1.5Zm-4-8.5v10Z"/></svg>
  </span>
)

export const PencilIcon = () => (
  <span className={styles['icon-wrapper']}>
    <svg fill='blue' xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M4.5 19.146q-.625 0-1.062-.438Q3 18.271 3 17.646v-11q0-.625.438-1.063.437-.437 1.062-.437h6.521l-1.5 1.5H4.5v11h11v-4.979l1.5-1.521v6.5q0 .625-.438 1.062-.437.438-1.062.438Zm5.5-7Zm3.625-6.813 1.083 1.084L9.5 11.583v1.063h1.062l5.188-5.167 1.042 1.063-5.604 5.604H8v-3.167Zm3.167 3.209-3.167-3.209 1.771-1.771q.437-.437 1.052-.437.614 0 1.052.437l1.083 1.084q.438.437.438 1.052 0 .614-.438 1.052Z"/></svg>
  </span>
)