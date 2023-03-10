import React from 'react'
import styles from './InfoCard.module.scss'

interface InfoCardProps {
  line1?: string;
  line2?: string;
}

const InfoCard:React.FC<InfoCardProps> = ({
  line1,
  line2
}) => (
  <div className={styles['info-card']}>
    <span>{line1}</span>
    <span>{line2}</span>
  </div>
)

export default InfoCard