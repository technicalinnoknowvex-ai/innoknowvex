"use client"
import React, { useEffect, useRef } from 'react'
import style from "./style/packs.module.scss"
import { programs } from '@/data/programs'
import Image from 'next/image'
import StarShape from '../Cart/svg/star'
import gsap from 'gsap'
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Packs = () => {

  const headingStar = useRef()
  const headingStar1 = useRef()

  let cartItems =  [];

  const handleClick = (item) => {
    cartItems.push(item);
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  };


  useEffect(() => {
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
        .to(headingStar.current, {
          scale: 1,
          duration: 0.5,
          ease: "power2.inOut",
        })
        .to(headingStar.current, {
          rotate: "+=720", // 2 spins
          duration: 1,
          ease: "power2.inOut",
          transformOrigin: "50% 50%",
        })
        .to(headingStar.current, {
          rotate: "+=720", // another 2 spins
          duration: 1,
          ease: "power2.inOut",
          delay: 0.1, // <-- wait before second spin
          transformOrigin: "50% 50%",
        });
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
        .to(headingStar1.current, {
          scale: 1,
          duration: 0.5,
          ease: "power2.inOut",
        })
        .to(headingStar1.current, {
          rotate: "+=720", // 2 spins
          duration: 1,
          ease: "power2.inOut",
          transformOrigin: "50% 50%",
        })
        .to(headingStar1.current, {
          rotate: "+=720", // another 2 spins
          duration: 1,
          ease: "power2.inOut",
          delay: 0.1, // <-- wait before second spin
          transformOrigin: "50% 50%",
        });
    }

    gsap.fromTo(".courseCard",
      {
        opacity: 0,
        y: -80,
        stagger: 0.5
      },
      {
        y: 0,
        opacity: 1
      });
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

      <div className={style.courses}>
        {Object.values(programs).map((item) => (
          <div className={`${style.courseCard} courseCard`} key={item.id}>
            <div className={style.imageContainer}>
              <Image src={item.image} height={200} width={200} alt={item.title} />
            </div>
            <div className={style.content}>
              <StarShape height={30} width={30} className={style.star1} />
              <h1>{item.title}</h1>
            </div>
            <h3 className={style.price}>Rs. 5000</h3>
            <button className={style.btn} onClick={() => handleClick(item)}>Add to cart</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default Packs
