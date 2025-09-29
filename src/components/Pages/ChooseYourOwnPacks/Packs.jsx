"use client"
import React, { useEffect, useRef, useState } from 'react'
import style from "./style/packs.module.scss"
import { programs } from '@/data/programs'
import Image from 'next/image'
import StarShape from '../Cart/svg/star'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

gsap.registerPlugin(ScrollTrigger)

const categories = [
  { id: 'all', name: 'All Programs' },
  { id: 'technology-programming', name: 'Technology & Programming' },
  { id: 'ai-data', name: 'AI & Data Science' },
  { id: 'cloud-security', name: 'Cloud & Security' },
  { id: 'hardware-engineering', name: 'Hardware & Engineering' },
  { id: 'business-management', name: 'Business & Management' },
  { id: 'design-creative', name: 'Design & Creative' },
  { id: 'healthcare-sciences', name: 'Healthcare & Sciences' },
  { id: 'advanced', name: 'Advanced Programs' }
]

const Packs = () => {
  const router = useRouter()
  const headingStar = useRef()
  const headingStar1 = useRef()

  const [programsPrice, setProgramsPrice] = useState({})
  const [loading, setLoading] = useState(false)
  const [priceLoadingStates, setPriceLoadingStates] = useState({})
  const [selectedCategory, setSelectedCategory] = useState('all')

  const animation = () => {
    if (headingStar.current) {
      const tl = gsap.timeline()
      tl.fromTo(
        headingStar.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1.3,
          duration: 1,
          ease: "power2.out",
          transformOrigin: "50% 50%",
        }
      )
        .to(headingStar.current, { scale: 1, duration: 0.5, ease: "power2.inOut" })
        .to(headingStar.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", transformOrigin: "50% 50%" })
        .to(headingStar.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", delay: 0.1, transformOrigin: "50% 50%" })
    }

    if (headingStar1.current) {
      const tl = gsap.timeline()
      tl.fromTo(
        headingStar1.current,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 1,
          scale: 1.3,
          duration: 1,
          ease: "power2.out",
          transformOrigin: "50% 50%",
        }
      )
        .to(headingStar1.current, { scale: 1, duration: 0.5, ease: "power2.inOut" })
        .to(headingStar1.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", transformOrigin: "50% 50%" })
        .to(headingStar1.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", delay: 0.1, transformOrigin: "50% 50%" })
    }

    gsap.fromTo(".planCard", { opacity: 0, y: -80, stagger: 0.5 }, { y: 0, opacity: 1 })
  }

  const fetchProgramPrice = async (tag) => {
    try {
      setPriceLoadingStates((prev) => ({ ...prev, [tag]: true }))

      const response = await fetch(`/api/pricingPowerPack/${tag}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setProgramsPrice((prev) => ({ ...prev, [tag]: data }))
    } catch (err) {
      console.error(`Error fetching program price for ${tag}:`, err)
      toast.error(`Failed to load pricing for ${tag}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      })
    } finally {
      setPriceLoadingStates((prev) => ({ ...prev, [tag]: false }))
    }
  }

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

  useEffect(() => {
    animation()
    setLoading(true)

    const fetchPromises = Object.values(programs).map((course) => 
      fetchProgramPrice(course.price_search_tag)
    )

    Promise.allSettled(fetchPromises).finally(() => {
      setLoading(false)
    })
  }, [])

  return (
    <div className={style.packsContainer}>
      {/* Fixed Sidebar */}
      <div className={style.sidebar}>
        <div className={style.sidebarContent}>
          <h2>Categories</h2>
          <div className={style.categoryList}>
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`${style.categoryBtn} ${selectedCategory === cat.id ? style.active : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Main Content */}
      <div className={style.mainContent}>
        <div className={style.headDiv}>
          <svg ref={headingStar} className={style.headstar1} width="30" height="30" viewBox="0 0 200 200" fill="#9F8310" xmlns="http://www.w3.org/2000/svg">
            <path d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z" fill="#9F8310" />
          </svg>

          <div><h1 className={style.heading}>Create Your Own Pack</h1></div>

          <svg ref={headingStar1} className={style.headstar2} width="30" height="30" viewBox="0 0 200 200" fill="#9F8310" xmlns="http://www.w3.org/2000/svg">
            <path d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z" fill="#9F8310" />
          </svg>
        </div>

        {loading && (
          <div className={style.loadingContainer}>
            <div className={style.loadingSpinner}></div>
            <p>Loading courses and pricing...</p>
          </div>
        )}

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
      </div>
    </div>
  )
}

export default Packs