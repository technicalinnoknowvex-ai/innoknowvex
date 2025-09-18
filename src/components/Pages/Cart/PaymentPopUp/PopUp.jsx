"use client"
import React, { useEffect } from "react"
import style from "./style/popup.module.scss"

const PopUp = ({ isOpen, onClose, price }) => {

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className={style.formPage}>
      {/* Overlay */}
      <div className={style.overlay} onClick={onClose}></div>

      {/* Form Card */}
      <div className={style.formWrapper}>
        <div className={style.formHeaderContainer}>
          <h1>Checkout</h1>
          <button className={style.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={style.courseInfo}>
          <p>
            <strong>Total Amount:</strong> ₹{price}
          </p>
        </div>

        {/* Example Input (optional) */}
        <div className={style.inputGroup}>
          <label className={style.formLabel}>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className={style.formInput}
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.formLabel}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={style.formInput}
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.formLabel}>Phone No.</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className={style.formInput}
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.formLabel}>Coupon (Optional)</label>
          <input
            type="text"
            placeholder="Enter coupon code"
            className={style.formInput}
          />
        </div>

        {/* Checkout Button */}
        <div className={style.buttonGroup}>
          <button
            onClick={() => onEnroll(price)}
            className={style.checkoutBtn}
          >
            Pay ₹{price}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopUp
