import LoginForm from '@/components/Forms/LoginForm/LoginForm'
import React from 'react'
import styles from './Auth.module.scss'

const AuthPage = () => {
  return (
    <div className={styles['page-wrapper']}>
      <div className={`light-border ${styles['form-container']}`}>
        <h1>Rainen Law</h1>
        <LoginForm/>
      </div>
    </div>
  )
}

export default AuthPage