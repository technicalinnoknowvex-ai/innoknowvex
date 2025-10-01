
// "use client"
// import React, { useEffect, useState } from "react"
// import style from "./style/popup.module.scss"

// const PopUp = ({ isOpen, onClose, price }) => {

//   const [name, setName] = useState("")
//   const [email, setEmail] = useState("")
//   const [phone, setPhone] = useState("")

//   // Email validation regex
//   const isValidEmail = (email) => {
//     return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
//   }

//   // Phone validation (10 digits)
//   const isValidPhone = (phone) => {
//     return /^[0-9]{10}$/.test(phone)
//   }

//   // Check if form is valid
//   const isFormValid = () => {
//     return (
//       name.trim().length > 0 &&
//       isValidEmail(email) &&
//       isValidPhone(phone)
//     )
//   }

//   const loadScript = (src) => {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement("script")
//       script.src = src
//       script.onload = () => resolve(true)
//       script.onerror = () => reject(new Error(`Failed to load ${src}`))
//       document.body.appendChild(script)
//     })
//   }

//   const makePayment = async (price, name, email, phone) => {
//     if (!isFormValid()) {
//       alert("⚠️ Please fill all fields correctly")
//       return
//     }

//     const firstname = name?.charAt(0) || "user"
//     const lastFourDigits = phone?.slice(-4) || "0000"
//     const id = `proPacks_${firstname}_${lastFourDigits}`

//     try {
//       // Step 1: Create order on backend
//       const response = await fetch("/api/pro-packs/ordercreation", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ price, id }),
//       })

//       if (!response.status == 200) {
//         throw new Error(`Order creation failed: ${response.status}`)
//       }

//       const data = await response.json()
//       if (!data) {
//         throw new Error("Invalid order response")
//       }

//       console.log(data)

//       // Step 2: Open Razorpay checkout
//       const paymentObject = new window.Razorpay({
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // ✅ keep it public key
//         order_id: data.id,
//         amount: data.amount,
//         currency: data.currency,
//         name: "Pro Packs",
//         description: "Upgrade to Pro Packs",
//         prefill: {
//           name,
//           email,
//           contact: phone,
//         },
//         handler: async function (response) {
//           try {
//             // Step 3: Verify payment
//             const verifyResponse = await fetch("/api/pro-packs/verifypayment", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify({
//                 order_id: response.razorpay_order_id,
//                 payment_id: response.razorpay_payment_id,
//                 signature: response.razorpay_signature,
//               }),
//             })

//             if (!verifyResponse.ok) {
//               throw new Error(`Payment verification failed: ${verifyResponse.status}`)
//             }

//             const verifyData = await verifyResponse.json()
//             if (verifyData.success) {
//               alert("✅ Payment successful!")
//             } else {
//               alert("❌ Payment verification failed")
//             }
//           } catch (err) {
//             console.error("Verification error:", err)
//             alert("❌ Something went wrong during verification")
//           }
//         },
//         modal: {
//           ondismiss: function () {
//             console.log("Payment popup closed")
//           },
//         },
//       })

//       paymentObject.open()
//     } catch (error) {
//       console.error("Payment error:", error)
//       alert("❌ Payment process failed. Please try again.")
//     }
//   }

//   useEffect(() => {
//     loadScript("https://checkout.razorpay.com/v1/checkout.js").catch(err =>
//       console.error(err)
//     )
//   }, [])

//   // Close on Escape key
//   useEffect(() => {
//     const handleKey = (e) => {
//       if (e.key === "Escape") onClose()
//     }
//     window.addEventListener("keydown", handleKey)
//     return () => window.removeEventListener("keydown", handleKey)
//   }, [onClose])

//   if (!isOpen) return null

//   return (
//     <div className={style.formPage}>
//       {/* Overlay */}
//       <div className={style.overlay} onClick={onClose}></div>

//       {/* Form Card */}
//       <div className={style.formWrapper}>
//         <div className={style.formHeaderContainer}>
//           <h1>Checkout</h1>
//           <button className={style.closeButton} onClick={onClose}>
//             ✕
//           </button>
//         </div>

//         <div className={style.courseInfo}>
//           <p>
//             <strong>Total Amount:</strong> ₹{price}
//           </p>
//         </div>

//         {/* Example Input (optional) */}
//         <div className={style.inputGroup}>
//           <label className={style.formLabel}>Full Name</label>
//           <input
//             type="text"
//             placeholder="Enter your name"
//             className={style.formInput}
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//         </div>

//         <div className={style.inputGroup}>
//           <label className={style.formLabel}>Email Address</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             className={style.formInput}
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           {email && !isValidEmail(email) && (
//             <span style={{ color: "red", fontSize: "12px" }}>Invalid email format</span>
//           )}
//         </div>

//         <div className={style.inputGroup}>
//           <label className={style.formLabel}>Phone No.</label>
//           <input
//             type="text"
//             placeholder="Enter your phone number"
//             className={style.formInput}
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             maxLength={10}
//           />
//           {phone && !isValidPhone(phone) && (
//             <span style={{ color: "red", fontSize: "12px" }}>Phone must be 10 digits</span>
//           )}
//         </div>

//         {/* Checkout Button */}
//         <div className={style.buttonGroup}>
//           <button
//             onClick={() => makePayment(price,name,email,phone)}
//             className={style.checkoutBtn}
//             disabled={!isFormValid()}
//             style={{
//               opacity: isFormValid() ? 1 : 0.5,
//               cursor: isFormValid() ? "pointer" : "not-allowed"
//             }}
//           >
//             Pay ₹{price}
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PopUp




"use client"
import React, { useEffect, useState } from "react"
import style from "./style/popup.module.scss"

const PopUp = ({ isOpen, onClose, price, storedItems = [], appliedCoupon, discount = 0, originalTotal = 0 }) => {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  // Email validation regex
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  // Phone validation (10 digits)
  const isValidPhone = (phone) => {
    return /^[0-9]{10}$/.test(phone)
  }

  // Check if form is valid
  const isFormValid = () => {
    return (
      name.trim().length > 0 &&
      isValidEmail(email) &&
      isValidPhone(phone)
    )
  }

  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script")
      script.src = src
      script.onload = () => resolve(true)
      script.onerror = () => reject(new Error(`Failed to load ${src}`))
      document.body.appendChild(script)
    })
  }

  // Get all course names as comma-separated string
  const getAllCourseNames = () => {
    return storedItems.map(item => item.course).join(", ")
  }

  // Get all plans as comma-separated string
  const getAllPlans = () => {
    return storedItems.map(item => item.plan).join(", ")
  }

  const makePayment = async (price, name, email, phone) => {
    if (!isFormValid()) {
      alert("⚠️ Please fill all fields correctly")
      return
    }

    if (isProcessing) return;

    setIsProcessing(true);

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

      if (!response.ok) {
        throw new Error(`Order creation failed: ${response.status}`)
      }

      const data = await response.json()
      if (!data) {
        throw new Error("Invalid order response")
      }

      console.log(data)

      // Step 2: Open Razorpay checkout
      const paymentObject = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
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
            // Step 3: Verify payment and store in database
            const verifyResponse = await fetch("/api/pro-packs/verifypayment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                studentData: {
                  name: name,
                  email: email,
                  phone: phone
                },
                course: getAllCourseNames(), // All course names
                courseId: "pro-packs-bundle", // Common course ID for bundle
                plan: getAllPlans(), // All plans
                amount: price,
                originalAmount: originalTotal,
                discountAmount: discount,
                discountPercentage: originalTotal > 0 ? ((discount / originalTotal) * 100) : 0,
                couponCode: appliedCoupon || null,
                couponDetails: appliedCoupon ? {
                  code: appliedCoupon,
                  discount_amount: discount,
                  applied_at: new Date().toISOString()
                } : null,
                metadata: {
                  cart_items: storedItems,
                  individual_courses: storedItems.map(item => ({
                    course_name: item.course,
                    course_id: item.course.toLowerCase().replace(/\s+/g, '-'),
                    plan: item.plan,
                    price: item.price,
                    image: item.image
                  })),
                  total_courses: storedItems.length,
                  payment_method: "razorpay",
                  user_agent: navigator.userAgent,
                  timestamp: new Date().toISOString()
                }
              }),
            })

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok) {
              throw new Error(`Payment verification failed: ${verifyData.message || verifyResponse.status}`)
            }

            if (verifyData.success) {
              alert("✅ Payment successful! Your data has been saved.")
              
              // Clear cart after successful payment
              sessionStorage.removeItem("cartItems")
              
              // Close popup and reload page after short delay
              setTimeout(() => {
                onClose()
                window.location.reload()
              }, 1500)
            } else {
              alert("❌ Payment verification failed: " + (verifyData.message || "Unknown error"))
            }
          } catch (err) {
            console.error("Verification error:", err)
            alert("❌ Something went wrong during verification: " + err.message)
          } finally {
            setIsProcessing(false)
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment popup closed")
            setIsProcessing(false)
          },
        },
      })

      paymentObject.on('payment.failed', function (response) {
        console.error("Payment failed:", response.error)
        alert(`❌ Payment failed: ${response.error.description}`)
        setIsProcessing(false)
      })

      paymentObject.open()
    } catch (error) {
      console.error("Payment error:", error)
      alert("❌ Payment process failed. Please try again.")
      setIsProcessing(false)
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
          {discount > 0 && (
            <p style={{ color: 'green', fontSize: '14px' }}>
              <strong>Discount Applied:</strong> -₹{discount}
            </p>
          )}
          {storedItems.length > 1 && (
            <p style={{ fontSize: '14px', color: '#666' }}>
              <strong>Courses in bundle:</strong> {storedItems.length}
            </p>
          )}
        </div>

        {/* Course Items Summary */}
        {storedItems.length > 0 && (
          <div className={style.courseSummary}>
            <h4>Order Summary:</h4>
            {storedItems.map((item, index) => (
              <div key={index} className={style.courseItem}>
                <div className={style.courseItemDetails}>
                  <span className={style.courseName}>{item.course}</span>
                  <span className={style.coursePlan}>{item.plan}</span>
                </div>
                <span className={style.coursePrice}>₹{item.price}</span>
              </div>
            ))}
          </div>
        )}

        {/* Student Information Form */}
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
          {email && !isValidEmail(email) && (
            <span style={{ color: "red", fontSize: "12px" }}>Invalid email format</span>
          )}
        </div>

        <div className={style.inputGroup}>
          <label className={style.formLabel}>Phone No.</label>
          <input
            type="text"
            placeholder="Enter your phone number"
            className={style.formInput}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            maxLength={10}
          />
          {phone && !isValidPhone(phone) && (
            <span style={{ color: "red", fontSize: "12px" }}>Phone must be 10 digits</span>
          )}
        </div>

        {/* Checkout Button */}
        <div className={style.buttonGroup}>
          <button
            onClick={() => makePayment(price, name, email, phone)}
            className={style.checkoutBtn}
            disabled={!isFormValid() || isProcessing}
            style={{
              opacity: (!isFormValid() || isProcessing) ? 0.5 : 1,
              cursor: (!isFormValid() || isProcessing) ? "not-allowed" : "pointer"
            }}
          >
            {isProcessing ? "Processing..." : `Pay ₹${price}`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopUp