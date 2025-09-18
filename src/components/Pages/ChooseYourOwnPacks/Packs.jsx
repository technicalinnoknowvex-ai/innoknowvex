"use client"
import React, { useEffect, useRef, useState } from 'react'
import style from "./style/packs.module.scss"
import { programs } from '@/data/programs'
import Image from 'next/image'
import StarShape from '../Cart/svg/star'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'

gsap.registerPlugin(ScrollTrigger);

const Packs = () => {

  const router = useRouter()

  const headingStar = useRef()
  const headingStar1 = useRef()

  const [programsPrice, setProgramsPrice] = useState({}); // store as object for easy lookup
  const [loading, setLoading] = useState(false);

  const [selectedPlans, setSelectedPlans] = useState([]);

  // On mount, load from localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("selectedPlans")) || [];
    setSelectedPlans(stored);
  }, []);


  const handleClick = (item) => {
    const existingCart = JSON.parse(localStorage.getItem("cartItems")) || [];

    const courseToBeAdded = selectedPlans.find((c) => c.course == item.title)

    existingCart.push(courseToBeAdded);

    localStorage.setItem("cartItems", JSON.stringify(existingCart));

    toast.success("Added !", {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const animation = () => {
    if (headingStar.current) {
      const tl = gsap.timeline();

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
        .to(headingStar.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", delay: 0.1, transformOrigin: "50% 50%" });
    }

    if (headingStar1.current) {
      const tl = gsap.timeline();

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
        .to(headingStar1.current, { rotate: "+=720", duration: 1, ease: "power2.inOut", delay: 0.1, transformOrigin: "50% 50%" });
    }

    gsap.fromTo(".courseCard", { opacity: 0, y: -80, stagger: 0.5 }, { y: 0, opacity: 1 });
  }

  // fetch price per course
  const fetchProgramPrice = async (tag) => {
    try {
      const response = await fetch(`/api/pricing/${tag}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProgramsPrice((prev) => ({ ...prev, [tag]: data }));
    } catch (err) {
      console.error(`Error fetching program price for ${tag}:`, err);
    }
  }

  const handleSelectedPlan = (id, course, plan, price, image) => {
    const data = {id, course, plan, price, image };

    // Replace the plan if the course already exists
    const updatedPlans = selectedPlans.some((p) => p.course === course)
      ? selectedPlans.map((p) =>
        p.course === course ? data : p
      )
      : [...selectedPlans, data];

    // localStorage.setItem("selectedPlans", JSON.stringify(updatedPlans));
    setSelectedPlans(updatedPlans); // trigger re-render
  };

  const handleExplore = (item) => {
    router.push(`/programs/${item.id}`)
  }

  useEffect(() => {
    animation();

    setLoading(true);

    // fetch each program separately
    Object.values(programs).forEach((course) => {
      fetchProgramPrice(course.price_search_tag);
    });

    setLoading(false);
  }, []);

  return (
    <>
      <div className={style.headDiv}>
        <svg ref={headingStar} className={style.headstar1} width="30" height="30" viewBox="0 0 200 200" fill="#9F8310" xmlns="http://www.w3.org/2000/svg">
          <path d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z" fill="#9F8310" />
        </svg>

        <div><h1 className={style.heading}>Create Your Own Pack</h1></div>

        <svg ref={headingStar1} className={style.headstar2} width="30" height="30" viewBox="0 0 200 200" fill="#9F8310" xmlns="http://www.w3.org/2000/svg">
          <path d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z" fill="#9F8310" />
        </svg>
      </div>

      {loading && <div>Loading Please Wait</div>}

      <div className={style.courses}>
        {Object.values(programs).map((item) => {
          const coursePrice = programsPrice[item.price_search_tag];

          return (
            <div className={`${style.courseCard} courseCard`} key={item.id}>
              <div className={style.imageContainer}>
                <Image src={item.image} height={200} width={200} alt={item.title} />
              </div>

              <div className={style.content}>
                <StarShape height={20} width={20} className={style.star} />
                <h1>{item.title}</h1>
              </div>

              {coursePrice ? (
                <div className={style.coursePlan}>
                  <div className={style.priceDiv}>

                    {selectedPlans.some(
                      (p) => p.course === item.title && p.plan === "Self"
                    ) && (
                        <svg
                          className={style.check1}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          >
                            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                            <path d="m9 11l3 3L22 4" />
                          </g>
                        </svg>
                      )}


                    <h4 onClick={() => handleSelectedPlan(item.id, item.title, "Self", coursePrice.self_current_price, item.image)} className={style.pricetag} id='self'>Self</h4>
                    <div className={style.price}>{coursePrice.self_current_price}</div>
                    <div className={style.actualprice}>{coursePrice.self_actual_price}</div>
                    <div className={style.line}></div>
                  </div>

                  <div className={style.priceDiv}>

                    {selectedPlans.some(
                      (p) => p.course === item.title && p.plan === "Mentor"
                    ) && (
                        <svg
                          className={style.check1}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          >
                            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                            <path d="m9 11l3 3L22 4" />
                          </g>
                        </svg>
                      )}

                    <h4 onClick={() => handleSelectedPlan(item.id, item.title, "Mentor", coursePrice.mentor_current_price, item.image)} className={style.pricetag} id='mentor'>Mentor</h4>
                    <div className={style.price}>{coursePrice.mentor_current_price}</div>
                    <div className={style.actualprice}>{coursePrice.mentor_actual_price}</div>
                    <div className={style.line}></div>
                  </div>

                  <div className={style.priceDiv}>

                    {selectedPlans.some(
                      (p) => p.course === item.title && p.plan === "Professional"
                    ) && (
                        <svg
                          className={style.check1}
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <g
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                          >
                            <path d="M21.801 10A10 10 0 1 1 17 3.335" />
                            <path d="m9 11l3 3L22 4" />
                          </g>
                        </svg>
                      )}
                    <h4 onClick={() => handleSelectedPlan(item.id, item.title, "Professional", coursePrice.professional_current_price, item.image)} className={style.pricetag} id='professional'>Professional</h4>
                    <div className={style.price}>{coursePrice.professional_current_price}</div>
                    <div className={style.actualprice}>{coursePrice.professional_actual_price}</div>
                    <div className={style.line}></div>
                  </div>
                </div>
              ) : (
                <div className={style.coursePlan}>Loading prices...</div>
              )}

              <div className={style.actionTab}>
                <svg onClick={() => handleClick(item)} className={style.cart} xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                    <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                  </g>
                </svg>

                <svg onClick={() => handleExplore(item)} className={style.explore} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                    <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594zM20 2v4m2-2h-4" />
                    <circle cx="4" cy="20" r="2" />
                  </g>
                </svg>

              </div>
            </div>
          );
        })}
      </div>
    </>
  )
}

export default Packs
