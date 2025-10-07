// "use client"
// import React, { useState, useMemo, useEffect } from 'react';
// import { ExternalLink, ShoppingCart, Star, CheckCircle, ChevronDown } from 'lucide-react';
// import styles from './style/tech.module.scss';
// import Image from 'next/image';
// import { programs } from '@/data/programs';
// import TechPackCartWindow from './TechPackCartWindow';

// const PLAN_TYPES = {
//   SELF: 'self',
//   MENTOR: 'mentor',
//   PROFESSIONAL: 'professional'
// };

// const PLAN_LABELS = {
//   [PLAN_TYPES.SELF]: 'Self Plan',
//   [PLAN_TYPES.MENTOR]: 'Mentor Plan',
//   [PLAN_TYPES.PROFESSIONAL]: 'Professional Plan'
// };

// // Pack Configuration - Acts as unique identifier
// const PACK_CONFIG = {
//   id: 'tech-starter-pack',
//   name: 'Tech Starter Pack',
//   image: '/images/tech-starter-pack.jpg', // Add a pack image
//   totalOriginalPrice: 33000,
//   bundlePrice: 25000
// };

// const TechStarterPack = () => {
//   const [isInCart, setIsInCart] = useState(false);
//   const [selectedPlan, setSelectedPlan] = useState(PLAN_TYPES.MENTOR);
//   const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
//   const [isCartWindowOpen, setIsCartWindowOpen] = useState(false);
//   const [cartItem, setCartItem] = useState(null);

//   // Filter courses by category
//   const techCourses = useMemo(() => {
//     return Object.values(programs).filter(program => 
//       program.category === 'technology-programming' || program.category === 'ai-data'
//     );
//   }, []);

//   const courseCount = techCourses.length;
//   const { totalOriginalPrice, bundlePrice } = PACK_CONFIG;
//   const discount = Math.round(((totalOriginalPrice - bundlePrice) / totalOriginalPrice) * 100);

//   // Scroll to top when cart window opens
//   useEffect(() => {
//     if (isCartWindowOpen) {
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }, [isCartWindowOpen]);

//   const handleAddToCart = () => {
//     setIsInCart(true);
    
//     // Create a single pack item with all course details embedded
//     const packItem = {
//       id: PACK_CONFIG.id,
//       name: PACK_CONFIG.name,
//       plan: PLAN_LABELS[selectedPlan],
//       price: bundlePrice,
//       originalPrice: totalOriginalPrice,
//       image: techCourses[0]?.image || PACK_CONFIG.image,
//       isPack: true,
//       courseCount: courseCount,
//       courses: techCourses.map(course => ({
//         id: course.id,
//         title: course.title,
//         image: course.image
//       }))
//     };

//     setCartItem(packItem);
//     setIsCartWindowOpen(true);
//   };

//   const handleRemoveFromCart = () => {
//     setIsInCart(false);
//     setCartItem(null);
//     setIsCartWindowOpen(false);
//   };

//   const handleViewDetails = (courseId) => {
//     window.location.href = `/programs/${courseId}`;
//   };

//   const handlePlanSelect = (plan) => {
//     setSelectedPlan(plan);
//     setIsPlanDropdownOpen(false);
    
//     // Update cart item if already in cart
//     if (isInCart && cartItem) {
//       setCartItem({
//         ...cartItem,
//         plan: PLAN_LABELS[plan]
//       });
//     }
//   };

//   const handleCloseCartWindow = () => {
//     setIsCartWindowOpen(false);
//   };

//   return (
//     <>
//       <div className={styles.packsContainer}>
//         {/* Header */}
//         <div className={styles.headDiv}>
//           <h1 className={styles.heading}>Tech Starter Pack</h1>
//         </div>

//         {/* Pack Container - Single Box */}
//         <div className={styles.packWrapper}>
//           {/* Pricing Banner */}
//           <div className={styles.pricingBanner}>
//             <div className={styles.bannerContent}>
//               <div className={styles.priceComparison}>
//                 <div className={styles.priceBlock}>
//                   <span className={styles.priceLabel}>Worth</span>
//                   <span className={styles.originalPrice}>₹{totalOriginalPrice.toLocaleString()}</span>
//                 </div>
//                 <div className={styles.arrow}>→</div>
//                 <div className={styles.priceBlock}>
//                   <span className={styles.priceLabel}>Get it for</span>
//                   <span className={styles.bundlePrice}>₹{bundlePrice.toLocaleString()}</span>
//                 </div>
//               </div>
//               <div className={styles.discountBadge}>
//                 <span>SAVE {discount}%</span>
//               </div>
//             </div>
            
//             <div className={styles.featuresGrid}>
//               <div className={styles.feature}>
//                 <CheckCircle size={18} />
//                 <span>All Programming Languages</span>
//               </div>
//               <div className={styles.feature}>
//                 <CheckCircle size={18} />
//                 <span>Complete DSA Coverage</span>
//               </div>
//               <div className={styles.feature}>
//                 <CheckCircle size={18} />
//                 <span>{PLAN_LABELS[selectedPlan]} Access</span>
//               </div>
//               <div className={styles.feature}>
//                 <CheckCircle size={18} />
//                 <span>Lifetime Support</span>
//               </div>
//             </div>
//           </div>

//           {/* Plan Selector */}
//           <div className={styles.planSelectorContainer}>
//             <h3 className={styles.planSelectorTitle}>Select Your Learning Plan</h3>
//             <div className={styles.planDropdownWrapper}>
//               <button 
//                 className={styles.planDropdownButton}
//                 onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
//                 aria-expanded={isPlanDropdownOpen}
//               >
//                 <span className={styles.planDropdownLabel}>{PLAN_LABELS[selectedPlan]}</span>
//                 <ChevronDown 
//                   size={20} 
//                   className={`${styles.planDropdownIcon} ${isPlanDropdownOpen ? styles.rotated : ''}`}
//                 />
//               </button>
              
//               {isPlanDropdownOpen && (
//                 <div className={styles.planDropdownMenu}>
//                   {Object.entries(PLAN_LABELS).map(([key, label]) => (
//                     <button
//                       key={key}
//                       className={`${styles.planDropdownItem} ${selectedPlan === key ? styles.selected : ''}`}
//                       onClick={() => handlePlanSelect(key)}
//                     >
//                       {label}
//                       {selectedPlan === key && <CheckCircle size={16} />}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Courses Grid */}
//           <div className={styles.coursesContainer}>
//             <h2 className={styles.sectionTitle}>{courseCount} Courses Included in This Pack</h2>
            
//             <div className={styles.plansGrid}>
//               {techCourses.map((course) => (
//                 <div key={course.id} className={styles.planCard}>
//                   {/* Image Section */}
//                   <div className={styles.planImageSection}>
//                     <Image 
//                       src={course.image} 
//                       alt={course.title}   
//                       width={180}
//                       height={100}
//                     />
//                     <div className={styles.courseTitle}>
//                       <Star className={styles.starIcon} size={16} fill="#A38907" color="#A38907" />
//                       <h3>{course.title}</h3>
//                     </div>
//                   </div>

//                   {/* Details Section */}
//                   <div className={styles.planDetailsSection}>
//                     <div className={styles.planHeader}>
//                       <h4 className={styles.planName}>{PLAN_LABELS[selectedPlan]}</h4>
//                       <button 
//                         className={styles.exploreBtn}
//                         onClick={() => handleViewDetails(course.id)}
//                         aria-label="View course details"
//                       >
//                         <ExternalLink size={20} />
//                       </button>
//                     </div>

//                     <div className={styles.skillsList}>
//                       {course.skills?.slice(0, 4).map((skill, idx) => (
//                         <span key={idx} className={styles.skillBadge}>{skill}</span>
//                       ))}
//                       {course.skills?.length > 4 && (
//                         <span className={styles.skillBadge}>+{course.skills.length - 4} more</span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Single Add to Cart Button for Entire Pack */}
//           <div className={styles.packActions}>
//             <div className={styles.packPricing}>
//               <div className={styles.priceInfo}>
//                 <span className={styles.finalPrice}>₹{bundlePrice.toLocaleString()}</span>
//                 <span className={styles.strikePrice}>₹{totalOriginalPrice.toLocaleString()}</span>
//                 <span className={styles.saveBadge}>Save ₹{(totalOriginalPrice - bundlePrice).toLocaleString()}</span>
//               </div>
//             </div>
            
//             {isInCart ? (
//               <button 
//                 className={`${styles.addToCartBtn} ${styles.removeBtn}`}
//                 onClick={handleRemoveFromCart}
//               >
//                 <CheckCircle size={20} />
//                 <span>Remove from Cart</span>
//               </button>
//             ) : (
//               <button 
//                 className={styles.addToCartBtn}
//                 onClick={handleAddToCart}
//               >
//                 <ShoppingCart size={20} />
//                 <span>Add Pack to Cart</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Cart Window */}
//       {isCartWindowOpen && cartItem && (
//         <TechPackCartWindow 
//           cartItem={cartItem}
//           onRemove={handleRemoveFromCart}
//           onClose={handleCloseCartWindow}
//         />
//       )}
//     </>
//   );
// };

// export default TechStarterPack;




"use client"
import React, { useState, useMemo, useEffect } from 'react';
import { ExternalLink, ShoppingCart, CheckCircle, ChevronDown } from 'lucide-react';
import styles from './style/tech.module.scss';
import Image from 'next/image';
import { programs } from '@/data/programs';
import TechPackCartWindow from './TechPackCartWindow';

const PLAN_TYPES = {
  SELF: 'self',
  MENTOR: 'mentor',
  PROFESSIONAL: 'professional'
};

const PLAN_LABELS = {
  [PLAN_TYPES.SELF]: 'Self Plan',
  [PLAN_TYPES.MENTOR]: 'Mentor Plan',
  [PLAN_TYPES.PROFESSIONAL]: 'Professional Plan'
};

const TechStarterPack = () => {
  const [isInCart, setIsInCart] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(PLAN_TYPES.MENTOR);
  const [isPlanDropdownOpen, setIsPlanDropdownOpen] = useState(false);
  const [isCartWindowOpen, setIsCartWindowOpen] = useState(false);
  const [cartItem, setCartItem] = useState(null);
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch pricing data from Supabase
  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🚀 Fetching pricing data for tech-starter-pack...');
        
        // CORRECT API PATH
        const apiUrl = '/api/pricingTechStarterPack/tech-starter-pack';
        console.log('📡 API URL:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        console.log('📨 Response status:', response.status);
        console.log('📨 Response ok:', response.ok);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error response:', errorText);
          
          let errorMessage = `HTTP error! status: ${response.status}`;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch (e) {
            // If response is not JSON, use the text
            errorMessage = errorText || errorMessage;
          }
          
          throw new Error(errorMessage);
        }
        
        const data = await response.json();
        console.log('✅ Pricing data received:', data);
        setPricingData(data);
        
      } catch (err) {
        console.error('💥 Error fetching pricing data:', err);
        setError(err.message);
        // Fallback to default pricing
        setPricingData({
          program_id: 'tech-starter-pack',
          program_name: 'Tech Starter Pack',
          original_price: 33000,
          current_price: 25000,
          features: [
            { name: "All Programming Languages", included: true },
            { name: "Complete DSA Coverage", included: true },
            { name: "Multiple Learning Plans", included: true },
            { name: "Lifetime Support", included: true }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPricingData();
  }, []);

  // Filter courses by category
  const techCourses = useMemo(() => {
    return Object.values(programs).filter(program => 
      program.category === 'technology-programming' || program.category === 'ai-data'
    );
  }, []);

  const courseCount = techCourses.length;
  
  // Use pricing data from Supabase or fallback
  const totalOriginalPrice = pricingData?.original_price || 33000;
  const bundlePrice = pricingData?.current_price || 25000;
  const discount = Math.round(((totalOriginalPrice - bundlePrice) / totalOriginalPrice) * 100);
  const features = pricingData?.features || [
    { name: "All Programming Languages", included: true },
    { name: "Complete DSA Coverage", included: true },
    { name: "Multiple Learning Plans", included: true },
    { name: "Lifetime Support", included: true }
  ];

  // Scroll to top when cart window opens
  useEffect(() => {
    if (isCartWindowOpen) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isCartWindowOpen]);

  const handleAddToCart = () => {
    setIsInCart(true);
    
    // Create a single pack item with all course details embedded
    const packItem = {
      id: 'tech-starter-pack',
      name: pricingData?.program_name || 'Tech Starter Pack',
      plan: PLAN_LABELS[selectedPlan],
      price: bundlePrice,
      originalPrice: totalOriginalPrice,
      image: techCourses[0]?.image || '/images/tech-starter-pack.jpg',
      isPack: true,
      courseCount: courseCount,
      program_id: 'tech-starter-pack',
      courses: techCourses.map(course => ({
        id: course.id,
        title: course.title,
        image: course.image
      }))
    };

    setCartItem(packItem);
    setIsCartWindowOpen(true);
  };

  const handleRemoveFromCart = () => {
    setIsInCart(false);
    setCartItem(null);
    setIsCartWindowOpen(false);
  };

  const handleViewDetails = (courseId) => {
    window.location.href = `/programs/${courseId}`;
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setIsPlanDropdownOpen(false);
    
    // Update cart item if already in cart
    if (isInCart && cartItem) {
      setCartItem({
        ...cartItem,
        plan: PLAN_LABELS[plan]
      });
    }
  };

  const handleCloseCartWindow = () => {
    setIsCartWindowOpen(false);
  };

  if (loading) {
    return (
      <div className={styles.packsContainer}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading Tech Starter Pack...</p>
        </div>
      </div>
    );
  }

  if (error && !pricingData) {
    return (
      <div className={styles.packsContainer}>
        <div className={styles.errorState}>
          <h2>⚠️ Unable to load Tech Starter Pack</h2>
          <p style={{ margin: '1rem 0', color: '#666' }}>
            {error}
          </p>
          <p style={{ margin: '1rem 0', color: '#666', fontSize: '0.9rem' }}>
            Using default pricing. The pack is still available for purchase.
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              background: '#A38907',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={styles.packsContainer}>
        {/* Header */}
        <div className={styles.headDiv}>
          <svg className={styles.star} width="60" height="60" viewBox="0 0 136 148" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z" fill="#9F8310" />
          </svg>
          <h1 className={styles.heading}>Tech Starter Pack</h1>
          {error && (
            <div style={{ 
              backgroundColor: '#fff9e1', 
              padding: '0.5rem 1rem', 
              borderRadius: '0.5rem',
              border: '1px solid #e5d899',
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              ⚠️ Note: Using default pricing due to temporary issue
            </div>
          )}
          {pricingData?.description && (
            <p className={styles.packDescription}>{pricingData.description}</p>
          )}
        </div>

        {/* Pack Container - Single Box */}
        <div className={styles.packWrapper}>
          {/* Pricing Banner */}
          <div className={styles.pricingBanner}>
            <div className={styles.bannerContent}>
              <div className={styles.priceComparison}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>Worth</span>
                  <span className={styles.originalPrice}>₹{totalOriginalPrice.toLocaleString()}</span>
                </div>
                <div className={styles.arrow}>→</div>
                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>Get it for</span>
                  <span className={styles.bundlePrice}>₹{bundlePrice.toLocaleString()}</span>
                </div>
              </div>
              <div className={styles.discountBadge}>
                <span>SAVE {discount}%</span>
              </div>
            </div>
            
            <div className={styles.featuresGrid}>
              {features.map((feature, index) => (
                feature.included && (
                  <div key={index} className={styles.feature}>
                    <CheckCircle size={18} />
                    <span>{feature.name}</span>
                  </div>
                )
              ))}
            </div>
          </div>

          {/* Plan Selector */}
          <div className={styles.planSelectorContainer}>
            <h3 className={styles.planSelectorTitle}>Select Your Learning Plan</h3>
            <div className={styles.planDropdownWrapper}>
              <button 
                className={styles.planDropdownButton}
                onClick={() => setIsPlanDropdownOpen(!isPlanDropdownOpen)}
                aria-expanded={isPlanDropdownOpen}
              >
                <span className={styles.planDropdownLabel}>{PLAN_LABELS[selectedPlan]}</span>
                <ChevronDown 
                  size={20} 
                  className={`${styles.planDropdownIcon} ${isPlanDropdownOpen ? styles.rotated : ''}`}
                />
              </button>
              
              {isPlanDropdownOpen && (
                <div className={styles.planDropdownMenu}>
                  {Object.entries(PLAN_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      className={`${styles.planDropdownItem} ${selectedPlan === key ? styles.selected : ''}`}
                      onClick={() => handlePlanSelect(key)}
                    >
                      {label}
                      {selectedPlan === key && <CheckCircle size={16} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Courses Grid */}
          <div className={styles.coursesContainer}>
            <h2 className={styles.sectionTitle}>
              <svg className={styles.starSmall} width="24" height="24" viewBox="0 0 136 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z" fill="#9F8310" />
              </svg>
              {courseCount} Courses Included in This Pack
            </h2>
            
            <div className={styles.plansGrid}>
              {techCourses.map((course) => (
                <div key={course.id} className={styles.planCard}>
                  {/* Image Section */}
                  <div className={styles.planImageSection}>
                    <Image 
                      src={course.image} 
                      alt={course.title}   
                      width={180}
                      height={100}
                      className={styles.courseImage}
                    />
                    <div className={styles.courseTitle}>
                      <svg className={styles.starIcon} width="18" height="18" viewBox="0 0 136 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z" fill="#A38907" />
                      </svg>
                      <h3>{course.title}</h3>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className={styles.planDetailsSection}>
                    <div className={styles.planHeader}>
                      <h4 className={styles.planName}>{PLAN_LABELS[selectedPlan]}</h4>
                      <button 
                        className={styles.exploreBtn}
                        onClick={() => handleViewDetails(course.id)}
                        aria-label="View course details"
                      >
                        <ExternalLink size={20} />
                      </button>
                    </div>

                    <div className={styles.skillsList}>
                      {course.skills?.slice(0, 4).map((skill, idx) => (
                        <span key={idx} className={styles.skillBadge}>{skill}</span>
                      ))}
                      {course.skills?.length > 4 && (
                        <span className={styles.skillBadge}>+{course.skills.length - 4} more</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Single Add to Cart Button for Entire Pack */}
          <div className={styles.packActions}>
            <div className={styles.packPricing}>
              <div className={styles.priceInfo}>
                <span className={styles.finalPrice}>₹{bundlePrice.toLocaleString()}</span>
                <span className={styles.strikePrice}>₹{totalOriginalPrice.toLocaleString()}</span>
                <span className={styles.saveBadge}>Save ₹{(totalOriginalPrice - bundlePrice).toLocaleString()}</span>
              </div>
            </div>
            
            {isInCart ? (
              <button 
                className={`${styles.addToCartBtn} ${styles.removeBtn}`}
                onClick={handleRemoveFromCart}
              >
                <svg className={styles.checkIcon} width="20" height="20" viewBox="0 0 136 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z" fill="currentColor" />
                </svg>
                <span>Remove from Cart</span>
              </button>
            ) : (
              <button 
                className={styles.addToCartBtn}
                onClick={handleAddToCart}
              >
                <ShoppingCart size={20} />
                <span>Add Pack to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Window */}
      {isCartWindowOpen && cartItem && (
        <TechPackCartWindow 
          cartItem={cartItem}
          onRemove={handleRemoveFromCart}
          onClose={handleCloseCartWindow}
        />
      )}
    </>
  );
};

export default TechStarterPack;