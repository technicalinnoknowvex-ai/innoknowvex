"use client"
import React, { useEffect, useState } from "react"
import style from "./style/popup.module.scss"

const PopUp = ({ isOpen, onClose, price }) => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error(`Failed to load ${src}`))
      document.body.appendChild(script)
    })
  }

  const makePayment = async (price, name, email, phone) => {
    const firstname = name?.charAt(0) || "user"
    const lastFourDigits = phone?.slice(-4) || "0000"
    const id = `proPacks_${firstname}_${lastFourDigits}`

    try {
      // Step 1: Create order on backend
      const response = await fetch("/api/pro-packs/ordercreation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ price, id }),
      })

      if (!response.status == 200) {
        throw new Error(`Order creation failed: ${response.status}`)
      }

      const data = await response.json()
      if (!data) {
        throw new Error("Invalid order response")
      }

      console.log(data)

      // Step 2: Open Razorpay checkout
      const paymentObject = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // ✅ keep it public key
        order_id: data.id,
        amount: data.amount,
        currency: data.currency,
        name: "Pro Packs",
        description: "Upgrade to Pro Packs",
        prefill: {
          name,
          email,
          contact: phone,
        },
        handler: async function (response) {
          try {
            // Step 3: Verify payment
            const verifyResponse = await fetch("/api/pro-packs/verifypayment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            })

            if (!verifyResponse.ok) {
              throw new Error(`Payment verification failed: ${verifyResponse.status}`)
            }

            const verifyData = await verifyResponse.json()
            if (verifyData.success) {
              alert("✅ Payment successful!")
            } else {
              alert("❌ Payment verification failed")
            }
          } catch (err) {
            console.error("Verification error:", err)
            alert("❌ Something went wrong during verification")
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment popup closed")
          },
        },
      })

      paymentObject.open()
    } catch (error) {
      console.error("Payment error:", error)
      alert("❌ Payment process failed. Please try again.")
    }
  }

  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js").catch(err =>
      console.error(err)
    )
  }, [])

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
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.formLabel}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={style.formInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={style.inputGroup}>
          <label className={style.formLabel}>Phone No.</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className={style.formInput}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Checkout Button */}
        <div className={style.buttonGroup}>
          <button
            onClick={() => makePayment(price,name,email,phone)}
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
