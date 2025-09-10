"use client"
import React, { useEffect, useRef } from 'react'
import style from "./style/packs.module.scss"
import { programs } from '@/data/programs'
import Image from 'next/image'
import StarShape from '../Cart/svg/star'
import gsap from 'gsap'

const Packs = () => {

 


  return (
    <>
      <div className={style.headDiv}>
        <StarShape height={30} width={30} className={style.headstar1} fill="#9F8310" />

        <div><h1 className={style.heading}>Create Your Own Pack</h1></div>

        <StarShape height={30} width={30} className={style.headstar2} fill="#9F8310" />
      </div>

      <div className={style.courses}>
        {Object.values(programs).map((item) => (
          <div className={style.courseCard} key={item.id}>
            <div className={style.imageContainer}>
              <Image src={item.image} height={200} width={200} alt={item.title} />
            </div>
            <div className={style.content}>
              <StarShape height={30} width={30} className={style.star1} />
              <h1>{item.title}</h1>
            </div>
            <h3 className={style.price}>Rs. 5000</h3>
            <button className={style.btn}>Add to cart</button>
          </div>
        ))}
      </div>
    </>
  )
}

export default Packs
