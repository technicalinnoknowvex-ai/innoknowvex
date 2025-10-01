// components/Packs/ProgramCards.js
"use client"
import React from 'react'
import style from "./style/packs.module.scss"
import { programs } from '@/data/programs'
import Image from 'next/image'
import StarShape from '../Cart/svg/star'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

const ProgramCards = ({
  programsPrice,
  priceLoadingStates,
  selectedCategory,
  loading
}) => {
  const router = useRouter()

  const handleAddToCart = (program, plan, price) => {
    const cartItem = {
      id: program.id,
      course: program.title,
      plan: plan,
      price: price,
      image: program.image
    }
    
    const existingCart = JSON.parse(sessionStorage.getItem("cartItems")) || []
    existingCart.push(cartItem)
    sessionStorage.setItem("cartItems", JSON.stringify(existingCart))
    
    toast.success("Added to cart!", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    })
  }

  const handleExplore = (item) => {
    router.push(`/programs/${item.id}`)
  }

  const formatPrice = (price) => {
    return typeof price === 'number' ? price.toLocaleString('en-IN') : price
  }

  const filteredPrograms = selectedCategory === 'all' 
    ? Object.values(programs)
    : Object.values(programs).filter(p => p.category === selectedCategory)

  const renderPlanCard = (program, planType, planName, currentPrice, actualPrice) => {
    const discount = Math.round(((actualPrice - currentPrice) / actualPrice) * 100)
    
    return (
      <div className={`${style.planCard} planCard`} key={`${program.id}-${planType}`}>
        {/* Image Section - LEFT SIDE */}
        <div className={style.planImageSection}>
          <Image src={program.image} height={200} width={280} alt={program.title} />
          <div className={style.courseTitle}>
            <StarShape height={20} width={20} className={style.starIcon} />
            <h3>{program.title}</h3>
          </div>
        </div>
        
        {/* Details Section - RIGHT SIDE */}
        <div className={style.planDetailsSection}>
          <div className={style.planHeader}>
            <h2 className={style.planName}>{planName}</h2>
            <svg 
              onClick={() => handleExplore(program)} 
              className={style.exploreBtn}
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24"
            >
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4m2-2h-4" />
                <circle cx="4" cy="20" r="2" />
              </g>
            </svg>
          </div>
          
          <div className={style.pricingInfo}>
            <div className={style.currentPrice}>₹{formatPrice(currentPrice)}</div>
            <div className={style.originalPrice}>₹{formatPrice(actualPrice)}</div>
            <div className={style.discountBadge}>{discount}% OFF</div>
          </div>
          
          <button 
            className={style.addToCartBtn}
            onClick={() => handleAddToCart(program, planName, currentPrice)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
              <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </g>
            </svg>
            Add to Cart
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {loading && (
        <div className={style.loadingContainer}>
          <div className={style.loadingSpinner}></div>
          <p>Loading courses and pricing...</p>
        </div>
      )}

      {!loading && (
        <div className={style.plansGrid}>
          {filteredPrograms.map(program => {
            const coursePrice = programsPrice[program.price_search_tag]
            const isPriceLoading = priceLoadingStates[program.price_search_tag]
            
            if (isPriceLoading) {
              return (
                <div key={program.id} className={style.loadingCard}>
                  <div className={style.loadingSpinner}></div>
                  <p>Loading {program.title}...</p>
                </div>
              )
            }

            if (!coursePrice) return null
            
            return (
              <React.Fragment key={program.id}>
                {renderPlanCard(program, 'self', 'Self', coursePrice.self_current_price, coursePrice.self_actual_price)}
                {renderPlanCard(program, 'mentor', 'Mentor', coursePrice.mentor_current_price, coursePrice.mentor_actual_price)}
                {renderPlanCard(program, 'professional', 'Professional', coursePrice.professional_current_price, coursePrice.professional_actual_price)}
              </React.Fragment>
            )
          })}
        </div>
      )}
    </>
  )
}

export default ProgramCards