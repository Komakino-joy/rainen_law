import React from 'react'
import styles from './InfoCard.module.scss'

interface InfoCardProps {
  line1?: string;
  line2?: string;
  customStyles?: {};
}

const InfoCard:React.FC<InfoCardProps> = ({
  line1,
  line2,
  customStyles
}) => (
  <div className={styles['info-card']} style={{...customStyles}}>
    <span>{line1}</span>
    <span>{line2}</span>
  </div>
)

export default InfoCard