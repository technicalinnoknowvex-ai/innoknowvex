"use client"

import Navbar from '@/components/Pages/Navbar/Navbar'
import React, { useEffect, useRef } from 'react'
import style from "./aboutus.module.scss"
import Image from "next/image";
import gsap from 'gsap';

const AboutUs = () => {
  const starRef = useRef()
  const starRef1 = useRef()
  const starRef2 = useRef()
  const starRef3 = useRef()
  const starRef4 = useRef()
  const starRef5 = useRef()

  useEffect(()=>{
    gsap.to(starRef.current,{
      rotate:360,
      duration:4,
      repeat:-1,
      ease:"linear"
    })

    gsap.to(starRef1.current,{
      rotate:360,
      duration:4,
      repeat:-1,
      ease:"linear"
    })

    gsap.to(starRef2.current,{
      rotate:360,
      duration:4,
      repeat:-1,
      ease:"linear"
    })

    gsap.to(starRef3.current,{
      rotate:360,
      duration:4,
      repeat:-1,
      ease:"linear"
    })

    gsap.to(starRef4.current,{
      rotate:360,
      duration:4,
      repeat:-1,
      ease:"linear"
    })

    gsap.to(starRef5.current,{
      rotate:360,
      duration:4,
      repeat:-1,
      ease:"linear"
    })
  },[])

  return (
    <>
      <Navbar />
      <div className={style.section}>
        <div className={style.first}>

          <Image className={style.ellipse1}
            src='/images/Ellipse4.svg'
            width={600}
            height={600}
            alt='bg-image'
          />

          <div className={style.content1}>
            <Image className={style.star1} ref={starRef} width={50} height={50} src="/images/SoftStar.svg" alt='start-image' />

            <h1>Our vision.</h1>
            <h4>What Drive Us Forward</h4>
            <p>We are committed to delivering the highest-quality education and ensuring accessibility for all. Our goal is to equip individuals with the skills needed to adapt to the ever-evolving industry landscape, empowering them to thrive in a technology-driven world.</p>
          </div>
        </div>
      </div>

      <div className={style.section2}>
        <div className={style.second}>

          <Image className={style.ellipse2}
            src='/images/Ellipse4.svg'
            width={600}
            height={600}
            alt='bg-image'
          />

          <div className={style.content2}>
            <Image className={style.star2} ref={starRef1} width={50} height={50} src="/images/SoftStar.svg" alt='start-image' />

            <h1>Our mission</h1>
            <h4>GUIDED BY PURPOSE</h4>
            <p>At Innoknowvex, we empower individuals to drive progress through technology and future-ready skills. With expert-led assessments, learning paths, and courses, our platform helps professionals benchmark their expertise and meet industry demands. We are committed to bridging the talent gap, connecting individuals with companies, and transforming industries through critical tech education. Our goal is to build a brand synonymous with success — for our platform, our clients, and the workforce of tomorrow.</p>
          </div>
        </div>
      </div>

      <div className={style.section}>
        <div className={style.first}>

          <Image className={style.ellipse1}
            src='/images/Ellipse4.svg'
            width={600}
            height={600}
            alt='bg-image'
          />

          <div className={style.content1}>
            <Image className={style.star1} ref={starRef2} width={50} height={50} src="/images/SoftStar.svg" alt='start-image' />

            <h1>Meet The</h1>
            <h4>TEAM.</h4>
            <p>Behind every success is a team of remarkable minds working tirelessly to bring ideas to life. Passion fuels our journey, and creativity shapes every step we take. These are the people whose dedication, talent, and vision make everything possible.</p>
          </div>
        </div>
      </div>

      <div className={style.team}>
        <div className={style.pic1}>
          <Image className={style.ceo} src="/images/aboutUsPage/CEO.jpeg" height={535} width={400} alt='CEO image' />
          <Image className={style.star} src="/images/SoftStar.svg" height={50} width={50} alt='star' ref={starRef3} />
          <Image className={style.bg} src="/images/Ellipse4.svg" height={300} width={300} alt='bg'/>
          <h1>FARUK</h1>
          <div></div>
          <h4>Founder and CEO</h4>
          <p>Guides the company’s vision and strategy, inspiring the team to innovate, grow, and deliver exceptional results.</p>
        </div>

        <div className={style.pic2}>
          <Image className={style.ceo} src="/images/aboutUsPage/CGO.jpeg" height={535} width={400} alt='CEO image' />
          <Image className={style.star} src="/images/SoftStar.svg" height={50} width={50} alt='star' ref={starRef4}/>
          <Image className={style.bg} src="/images/Ellipse4.svg" height={300} width={300} alt='bg'/>
          <h1>DURGESH C.</h1>
          <div></div>
          <h4>CGO</h4>
          <p>Builds client relationships, drives revenue growth, and ensures the company’s solutions meet market needs.</p>
        </div>

        <div className={style.pic3}>
          <Image className={style.ceo} src="/images/aboutUsPage/COO.jpeg" height={535} width={400} alt='CEO image' />
          <Image className={style.star} src="/images/SoftStar.svg" height={50} width={50} alt='star' ref={starRef5}/>
          <Image className={style.bg} src="/images/Ellipse4.svg" height={300} width={300} alt='bg'/>
          <h1>Vamsi Krishna</h1>
          <div></div>
          <h4>COO</h4>
          <p>Shapes brand strategy, leading marketing efforts to connect with audiences and grow the company’s reach.</p>
        </div>
      </div>
    </>
  )
}

export default AboutUs
