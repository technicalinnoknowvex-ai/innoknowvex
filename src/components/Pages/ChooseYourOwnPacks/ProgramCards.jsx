"use client"
import React, { useState, useEffect } from 'react'
import style from "./style/packs.module.scss"
import Image from 'next/image'
import StarShape from '../Cart/svg/star'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { ShoppingCart } from 'lucide-react'
import CartWindow from './CartWindow'

const ProgramCards = ({
  programs, // Now receives programs as prop from parent
  programsPrice,
  priceLoadingStates,
  selectedCategory,
  loading
}) => {
  const router = useRouter()
  const [selectedPlans, setSelectedPlans] = useState({})
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const MAX_COURSES = 4

  // Load selected plans from sessionStorage on mount
  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("cartItems")) || []
    setCartItems(items)
    
    const plans = {}
    items.forEach(item => {
      plans[item.id] = item.plan
    })
    setSelectedPlans(plans)
  }, [])

  const getSelectedCoursesCount = () => {
    return Object.keys(selectedPlans).length
  }

  const isPlanSelected = (courseId, planName) => {
    return selectedPlans[courseId] === planName
  }

  const isCourseSelected = (courseId) => {
    return courseId in selectedPlans
  }

  const canSelectCourse = (courseId) => {
    return isCourseSelected(courseId) || getSelectedCoursesCount() < MAX_COURSES
  }

  const handleAddToCart = (program, plan, price) => {
    if (!canSelectCourse(program.id)) {
      toast.error(`Maximum ${MAX_COURSES} courses allowed!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
      return
    }

    const cartItem = {
      id: program.id,
      course: program.title,
      plan: plan,
      price: price,
      image: program.image
    }
    
    let existingCart = JSON.parse(sessionStorage.getItem("cartItems")) || []
    existingCart = existingCart.filter(item => item.id !== program.id)
    existingCart.push(cartItem)
    sessionStorage.setItem("cartItems", JSON.stringify(existingCart))
    
    setCartItems(existingCart)
    setSelectedPlans(prev => ({
      ...prev,
      [program.id]: plan
    }))
    
    setIsCartOpen(true)
    
    toast.success(`${plan} plan added to cart!`, {
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

  const handleRemoveFromCart = (courseId) => {
    let existingCart = JSON.parse(sessionStorage.getItem("cartItems")) || []
    existingCart = existingCart.filter(item => item.id !== courseId)
    sessionStorage.setItem("cartItems", JSON.stringify(existingCart))
    
    setCartItems(existingCart)
    setSelectedPlans(prev => {
      const newPlans = { ...prev }
      delete newPlans[courseId]
      return newPlans
    })
    
    toast.info("Removed from cart!", {
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

  // Filter programs based on selected category
  const filteredPrograms = !programs || programs.length === 0 
    ? [] 
    : selectedCategory === 'all' 
      ? programs
      : programs.filter(p => p.category === selectedCategory)

  const renderPlanCard = (program, planType, planName, currentPrice, actualPrice) => {
    const discount = Math.round(((actualPrice - currentPrice) / actualPrice) * 100)
    const isSelected = isPlanSelected(program.id, planName)
    const courseSelected = isCourseSelected(program.id)
    const isDisabled = courseSelected && !isSelected
    const canSelect = canSelectCourse(program.id)
    
    return (
      <div 
        className={`${style.planCard} planCard ${isSelected ? style.selectedCard : ''} ${isDisabled ? style.disabledCard : ''}`} 
        key={`${program.id}-${planType}`}
      >
        <div className={style.planImageSection}>
          <Image src={program.image} height={200} width={280} alt={program.title} />
          <div className={style.courseTitle}>
            <StarShape height={20} width={20} className={style.starIcon} />
            <h3>{program.title}</h3>
          </div>
        </div>
        
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
          
          {isSelected ? (
            <button 
              className={`${style.addToCartBtn} ${style.removeBtn}`}
              onClick={() => handleRemoveFromCart(program.id)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </g>
              </svg>
              Remove from Cart
            </button>
          ) : (
            <button 
              className={style.addToCartBtn}
              onClick={() => handleAddToCart(program, planName, currentPrice)}
              disabled={isDisabled || !canSelect}
              style={{
                opacity: (isDisabled || !canSelect) ? 0.5 : 1,
                cursor: (isDisabled || !canSelect) ? 'not-allowed' : 'pointer'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </g>
              </svg>
              {isDisabled ? 'Another Plan Selected' : !canSelect ? 'Max Limit Reached' : 'Add to Cart'}
            </button>
          )}
        </div>
        
        {isSelected && (
          <div className={style.selectedBadge}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19L21 7l-1.41-1.41z" />
            </svg>
            Selected
          </div>
        )}
      </div>
    )
  }

  // Show loading state while programs are being fetched
  if (!programs || programs.length === 0) {
    return (
      <div className={style.loadingContainer}>
        <div className={style.loadingSpinner}></div>
        <p>Loading programs...</p>
      </div>
    )
  }

  return (
    <>
      <div className={style.selectionCounter}>
        <p>Selected: <strong>{getSelectedCoursesCount()}</strong> / {MAX_COURSES} courses</p>
      </div>

      {/* View Cart Button - Shows when cart has items */}
      {cartItems.length > 0 && (
        <div className={style.viewCartButtonContainer}>
          <button 
            className={style.viewCartButton}
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={20} />
            View Cart ({cartItems.length}/4)
          </button>
        </div>
      )}

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

      {/* Cart Window */}
      {isCartOpen && (
        <CartWindow 
          cartItems={cartItems}
          onRemove={handleRemoveFromCart}
          onClose={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Toggle Button (when cart is closed but has items) */}
      {!isCartOpen && cartItems.length > 0 && (
        <button 
          className={style.cartToggleBtn}
          onClick={() => setIsCartOpen(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </g>
          </svg>
          <span className={style.cartBadge}>{cartItems.length}</span>
        </button>
      )}
    </>
  )
}

export default ProgramCards