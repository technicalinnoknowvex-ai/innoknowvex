// "use client"
// import React from 'react'
// import style from "./style/techcartwindow.module.scss"
// import Image from 'next/image'
// import { useRouter } from 'next/navigation'

// const TechPackCartWindow = ({ cartItems, onRemove, onClose, bundlePrice }) => {
//   const router = useRouter()

//   const handleCheckout = () => {
//     // Create a single pack item for the cart page
//     const packItem = {
//       id: 'tech-starter-pack',
//       course: 'Tech Starter Pack',
//       plan: cartItems[0]?.plan || 'Mentor Plan',
//       price: bundlePrice,
//       image: cartItems[0]?.image || '/default-pack-image.jpg',
//       isPack: true,
//       courses: cartItems
//     }

//     // Save to sessionStorage for the cart page
//     const existingCart = JSON.parse(sessionStorage.getItem('cartItems') || '[]')
    
//     // Check if pack already exists in cart
//     const packExists = existingCart.some(item => item.id === 'tech-starter-pack')
    
//     if (!packExists) {
//       existingCart.push(packItem)
//       sessionStorage.setItem('cartItems', JSON.stringify(existingCart))
//     }
    
//     router.push('/cart')
//   }

//   if (cartItems.length === 0) return null

//   return (
//     <>
//       {/* Overlay */}
//       <div className={style.overlay} onClick={onClose}></div>

//       {/* Cart Window */}
//       <div className={style.cartWindow}>
//         {/* Header */}
//         <div className={style.cartHeader}>
//           <div className={style.headerTitle}>
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//               <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
//                 <circle cx="8" cy="21" r="1" />
//                 <circle cx="19" cy="21" r="1" />
//                 <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
//               </g>
//             </svg>
//             <h2>Tech Starter Pack ({cartItems.length} courses)</h2>
//           </div>
//           <button className={style.closeBtn} onClick={onClose}>
//             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
//               <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         {/* Cart Items */}
//         <div className={style.cartItems}>
//           {cartItems.map((item, index) => (
//             <div key={`${item.id}-${index}`} className={style.cartItem}>
//               <div className={style.itemImage}>
//                 <Image src={item.image} width={80} height={60} alt={item.course} />
//               </div>
              
//               <div className={style.itemDetails}>
//                 <h3>{item.course}</h3>
//                 <p className={style.planType}>{item.plan}</p>
//               </div>

//               <div className={style.itemActions}>
//                 <button 
//                   className={style.infoBtn}
//                   onClick={() => router.push(`/programs/${item.id}`)}
//                   title="View Info"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
//                     <path fill="currentColor" d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
//                   </svg>
//                 </button>
//                 <button 
//                   className={style.removeBtn}
//                   onClick={() => onRemove(item.id)}
//                   title="Remove"
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
//                     <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
//                       <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
//                       <line x1="10" y1="11" x2="10" y2="17" />
//                       <line x1="14" y1="11" x2="14" y2="17" />
//                     </g>
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Footer */}
//         <div className={style.cartFooter}>
//           <div className={style.packPriceInfo}>
//             <div className={style.packNote}>Complete pack bundle price</div>
//           </div>
//           <div className={style.totalSection}>
//             <span>Total Amount:</span>
//             <span className={style.totalAmount}>₹{bundlePrice.toLocaleString('en-IN')}</span>
//           </div>
//           <button className={style.checkoutBtn} onClick={handleCheckout}>
//             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
//               <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//             </svg>
//             Proceed to Checkout
//           </button>
//         </div>
//       </div>
//     </>
//   )
// }

// export default TechPackCartWindow




"use client"
import React from 'react'
import style from "./style/techcartwindow.module.scss"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const TechPackCartWindow = ({ cartItem, onRemove, onClose }) => {
  const router = useRouter()

  if (!cartItem) return null

  const handleCheckout = () => {
    // Create a single pack item for the cart page
    const packItem = {
      id: cartItem.id,
      name: cartItem.name,
      plan: cartItem.plan,
      price: cartItem.price,
      originalPrice: cartItem.originalPrice,
      image: cartItem.image,
      isPack: true,
      courseCount: cartItem.courseCount
    }

    // Save to sessionStorage for the cart page
    const existingCart = JSON.parse(sessionStorage.getItem('cartItems') || '[]')
    
    // Check if pack already exists in cart
    const packExists = existingCart.some(item => item.id === cartItem.id)
    
    if (!packExists) {
      existingCart.push(packItem)
      sessionStorage.setItem('cartItems', JSON.stringify(existingCart))
    }
    
    router.push('/cart')
  }

  return (
    <>
      {/* Overlay */}
      <div className={style.overlay} onClick={onClose}></div>

      {/* Cart Window */}
      <div className={style.cartWindow}>
        {/* Header */}
        <div className={style.cartHeader}>
          <div className={style.headerTitle}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </g>
            </svg>
            <h2>Pack Added to Cart</h2>
          </div>
          <button className={style.closeBtn} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Item - Single Pack */}
        <div className={style.cartItems}>
          <div className={style.packItem}>
            <div className={style.packImage}>
              <Image 
                src={cartItem.image} 
                width={120} 
                height={90} 
                alt={cartItem.name}
                className={style.packImg}
              />
            </div>
            
            <div className={style.packDetails}>
              <h3 className={style.packName}>{cartItem.name}</h3>
              <p className={style.planType}>{cartItem.plan}</p>
              <p className={style.courseCount}>{cartItem.courseCount} courses included</p>
            </div>

            <div className={style.packActions}>
              <button 
                className={style.removeBtn}
                onClick={onRemove}
                title="Remove pack from cart"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                  </g>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className={style.cartFooter}>
          <div className={style.packPriceInfo}>
            <div className={style.packNote}>Complete pack bundle price</div>
            <div className={style.originalPriceComparison}>
              <span className={style.originalPrice}>₹{cartItem.originalPrice.toLocaleString('en-IN')}</span>
              <span className={style.finalPrice}>₹{cartItem.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className={style.totalSection}>
            <span>Total Amount:</span>
            <span className={style.totalAmount}>₹{cartItem.price.toLocaleString('en-IN')}</span>
          </div>
          <button className={style.checkoutBtn} onClick={handleCheckout}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </>
  )
}

export default TechPackCartWindow