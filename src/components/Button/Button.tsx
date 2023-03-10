import React from 'react'
import styles from './Button.module.scss'

interface ButtonProps {
  children: React.ReactElement | string;
  isDisabled: boolean;
  onClick: (e: React.SyntheticEvent) => void;
  type: "button" | "submit" | "reset" | undefined;
  customClass?: string;
  inlineStyles?: {},
}

const Button:React.FC<ButtonProps> = ({
  children,
  isDisabled,
  onClick,
  type,
  customClass,
  inlineStyles,
}) => (
  <button 
    className={`
      ${customClass}
      ${styles['base-styles']} 
      ${isDisabled ? styles.disabled : ''} 
    `}
    onClick={isDisabled ? () => {} : onClick}
    type={type}
    style={{...inlineStyles}}
  >
    {children}
  </button>
)

export default Button