import React from 'react'
import styles from "./arrow.module.scss"

const Arrow = () => {
  return (
    <div className={styles.box}>
      <img className={styles.arrow} src="./images/arrow.svg" alt="" />
    </div>
  )
}

export default Arrow