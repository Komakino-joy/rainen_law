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

export const PrinterIcon = () => (
  <span className={styles['icon-wrapper']}>
    <svg fill="blue" xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="M32.9 15.6V9H15.1v6.6h-3V6h23.8v9.6ZM7 18.6h34-28.9Zm29.95 4.75q.6 0 1.05-.45.45-.45.45-1.05 0-.6-.45-1.05-.45-.45-1.05-.45-.6 0-1.05.45-.45.45-.45 1.05 0 .6.45 1.05.45.45 1.05.45ZM32.9 39v-9.6H15.1V39Zm3 3H12.1v-8.8H4V20.9q0-2.25 1.525-3.775T9.3 15.6h29.4q2.25 0 3.775 1.525T44 20.9v12.3h-8.1ZM41 30.2v-9.3q0-1-.65-1.65-.65-.65-1.65-.65H9.3q-1 0-1.65.65Q7 19.9 7 20.9v9.3h5.1v-3.8h23.8v3.8Z"/></svg>
  </span>
)