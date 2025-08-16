import Navbar from '@/components/Pages/Navbar/Navbar'
import React from 'react'
import style from "./aboutus.module.scss"
import Image from "next/image";

const AboutUs = () => {
  return (
    <>
      <Navbar />
      <div className={style.first}>
        <Image className={style.star1} width={50} height={50} src="/images/SoftStar.svg" alt='start-image' />

        <Image className={style.bg}
          src='/images/Ellipse4.svg'
          width={600}
          height={600}
          alt='bg-image'
        />
        <div className={style.content1}>
          <h1>Our vision.</h1>
          <h4>What Drive Us Forward</h4>
          <p>We are committed to delivering the highest-quality education and ensuring accessibility for all. Our goal is to equip individuals with the skills needed to adapt to the ever-evolving industry landscape, empowering them to thrive in a technology-driven world.</p>
        </div>
      </div>

      <div className={style.second}>
        <Image className={style.star2} width={50} height={50} src="/images/SoftStar.svg" alt='start-image' />

        <Image className={style.bg2}
          src='/images/Ellipse4.svg'
          width={600}
          height={600}
          alt='bg-image'
        />
        <div className={style.content2}>
          <h1>Our mission.</h1>
          <h4>What We Strive For</h4>
          <p>We aim to inspire innovation, creativity, and problem-solving by making education accessible and impactful, preparing individuals to succeed in a global digital economy.</p>
        </div>
      </div>

      <div className={style.first}>
        <Image className={style.star1} width={50} height={50} src="/images/SoftStar.svg" alt='start-image' />

        <Image className={style.bg}
          src='/images/Ellipse4.svg'
          width={600}
          height={600}
          alt='bg-image'
        />
        <div className={style.content1}>
          <h1>Our vision.</h1>
          <h4>What Drive Us Forward</h4>
          <p>We are committed to delivering the highest-quality education and ensuring accessibility for all. Our goal is to equip individuals with the skills needed to adapt to the ever-evolving industry landscape, empowering them to thrive in a technology-driven world.</p>
        </div>
      </div>


    </>
  )
}

export default AboutUs
