import React from 'react'
import styles from './Spinner.module.scss'

const Spinner = () =>  (
  <div className='spinner-container'>
    <div className={styles["lds-ring"]}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  </div>
)

export default Spinner