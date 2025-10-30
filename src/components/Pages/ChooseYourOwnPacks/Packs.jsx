
// "use client"
// import React, { useEffect, useRef, useState } from 'react'
// import style from "./style/packs.module.scss"
// import { programs } from '@/data/programs'
// import gsap from 'gsap'
// import { ScrollTrigger } from "gsap/ScrollTrigger"
// import Sidebar from './Sidebar'
// import ProgramCards from './ProgramCards'

// gsap.registerPlugin(ScrollTrigger)

// const Packs = () => {
//   const headingStar = useRef()
//   const headingStar1 = useRef()

//   const [programsPrice, setProgramsPrice] = useState({})
//   const [loading, setLoading] = useState(false)
//   const [priceLoadingStates, setPriceLoadingStates] = useState({})
//   const [selectedCategory, setSelectedCategory] = useState('all')

//   const animation = () => {
//     if (headingStar.current) {
//       const tl = gsap.timeline()
//       tl.fromTo(
//         headingStar.current,
//         { opacity: 0, scale: 0.5 },
//         {
//           opacity: 1,
//           scale: 1.3,
//           duration: 1,
//           ease: "power2.out",
//           transformOrigin: "50% 50%",
//         }
//       )
//         .to(headingStar.current, { scale: 1, duration: 0.5, ease: "power2.inOut" })
//         .to(headingStar.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", transformOrigin: "50% 50%" })
//         .to(headingStar.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", delay: 0.1, transformOrigin: "50% 50%" })
//     }

//     if (headingStar1.current) {
//       const tl = gsap.timeline()
//       tl.fromTo(
//         headingStar1.current,
//         { opacity: 0, scale: 0.5 },
//         {
//           opacity: 1,
//           scale: 1.3,
//           duration: 1,
//           ease: "power2.out",
//           transformOrigin: "50% 50%",
//         }
//       )
//         .to(headingStar1.current, { scale: 1, duration: 0.5, ease: "power2.inOut" })
//         .to(headingStar1.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", transformOrigin: "50% 50%" })
//         .to(headingStar1.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", delay: 0.1, transformOrigin: "50% 50%" })
//     }

//     gsap.fromTo(".planCard", { opacity: 0, y: -80, stagger: 0.5 }, { y: 0, opacity: 1 })
//   }

//   const fetchProgramPrice = async (tag) => {
//     try {
//       setPriceLoadingStates((prev) => ({ ...prev, [tag]: true }))

//       const response = await fetch(`/api/pricingPowerPack/${tag}`, {
//         method: 'GET',
//         headers: { 'Content-Type': 'application/json' },
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}))
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       setProgramsPrice((prev) => ({ ...prev, [tag]: data }))
//     } catch (err) {
//       console.error(`Error fetching program price for ${tag}:`, err)
//     } finally {
//       setPriceLoadingStates((prev) => ({ ...prev, [tag]: false }))
//     }
//   }

//   useEffect(() => {
//     animation()
//     setLoading(true)

//     const fetchPromises = Object.values(programs).map((course) => 
//       fetchProgramPrice(course.price_search_tag)
//     )

//     Promise.allSettled(fetchPromises).finally(() => {
//       setLoading(false)
//     })
//   }, [])

//   return (
//     <div className={style.packsContainer}>
//       {/* Sticky Sidebar */}
//       <Sidebar 
//         selectedCategory={selectedCategory} 
//         setSelectedCategory={setSelectedCategory} 
//       />

//       {/* Scrollable Main Content */}
//       <div className={style.mainContent}>
//         <div className={style.headDiv}>
//           <svg ref={headingStar} className={style.headstar1} width="25" height="25" viewBox="0 0 200 200" fill="#9F8310" xmlns="http://www.w3.org/2000/svg">
//             <path d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z" fill="#9F8310" />
//           </svg>

//           <div><h1 className={style.heading}>Create Your Own Pack</h1></div>

//           <svg ref={headingStar1} className={style.headstar2} width="25" height="25" viewBox="0 0 200 200" fill="#9F8310" xmlns="http://www.w3.org/2000/svg">
//             <path d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z" fill="#9F8310" />
//           </svg>
//         </div>

//         <ProgramCards 
//           programsPrice={programsPrice}
//           priceLoadingStates={priceLoadingStates}
//           selectedCategory={selectedCategory}
//           loading={loading}
//         />
//       </div>
//     </div>
//   )
// }

// export default Packs






"use client"
import React, { useEffect, useRef, useState } from 'react'
import style from "./style/packs.module.scss"
import { getPrograms } from '@/app/api/pricing/[course]/route' // Import Supabase function
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Sidebar from './Sidebar'
import ProgramCards from './ProgramCards'
import { toast } from 'react-toastify'

gsap.registerPlugin(ScrollTrigger)

const Packs = () => {
  const headingStar = useRef()
  const headingStar1 = useRef()

  const [programs, setPrograms] = useState([]) // New state for programs from Supabase
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
    } finally {
      setPriceLoadingStates((prev) => ({ ...prev, [tag]: false }))
    }
  }

  // Fetch programs from Supabase on mount
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const fetchedPrograms = await getPrograms()
        console.log('Fetched programs from Supabase:', fetchedPrograms)
        setPrograms(fetchedPrograms)
      } catch (error) {
        console.error('Error loading programs:', error)
        toast.error('Failed to load programs', {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        })
      }
    }

    fetchPrograms()
  }, [])

  // Fetch prices after programs are loaded
  useEffect(() => {
    if (programs.length === 0) return

    animation()
    setLoading(true)

    const fetchPromises = programs.map((course) => 
      fetchProgramPrice(course.price_search_tag)
    )

    Promise.allSettled(fetchPromises).finally(() => {
      setLoading(false)
    })
  }, [programs])

  return (
    <div className={style.packsContainer}>
      {/* Sticky Sidebar */}
      <Sidebar 
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory} 
      />

      {/* Scrollable Main Content */}
      <div className={style.mainContent}>
        <div className={style.headDiv}>
          <svg ref={headingStar} className={style.headstar1} width="25" height="25" viewBox="0 0 200 200" fill="#9F8310" xmlns="http://www.w3.org/2000/svg">
            <path d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z" fill="#9F8310" />
          </svg>

          <div><h1 className={style.heading}>Create Your Own Pack</h1></div>

          <svg ref={headingStar1} className={style.headstar2} width="25" height="25" viewBox="0 0 200 200" fill="#9F8310" xmlns="http://www.w3.org/2000/svg">
            <path d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z" fill="#9F8310" />
          </svg>
        </div>

        <ProgramCards 
          programs={programs}
          programsPrice={programsPrice}
          priceLoadingStates={priceLoadingStates}
          selectedCategory={selectedCategory}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default Packs