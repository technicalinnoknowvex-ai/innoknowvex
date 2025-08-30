"use client";
import React, { useEffect, useRef } from "react";
import style from "./styles/aboutUs.module.scss";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Testimonials from "../Landing/Sections/Testimonials/Testimonials";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const AboutDetailsPage = () => {
  const starRef = useRef();
  const starRef1 = useRef();
  const starRef2 = useRef();
  const starRef3 = useRef();
  const starRef4 = useRef();
  const starRef5 = useRef();

  const headRef = useRef();
  const headSmallRef = useRef();
  const pRef = useRef();

  const headRef1 = useRef();
  const headSmallRef1 = useRef();
  const pRef1 = useRef();

  const headRef2 = useRef();
  const headSmallRef2 = useRef();
  const pRef2 = useRef();

  const animateContent1 = () => {
    const tlStars = gsap.timeline();
    tlStars.from([starRef.current, starRef1.current], {
      opacity: 0,
      scale: 0,
      rotate: -720,
      duration: 1,
      ease: "power2.out",
    });

    const tlText = gsap.timeline();
    tlText.from(
      [
        headRef.current,
        headSmallRef.current,
        pRef.current,
        headRef2.current,
        headSmallRef2.current,
        pRef2.current,
      ],
      {
        y: 30,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.2,
      }
    );
  };

  const animateContent2 = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headRef1.current,
        start: "top 70%",
        end: "top 40%",
        toggleActions: "play none none reverse",
      },
    });

    tl.from(starRef2.current, {
      opacity: 0,
      scale: 0,
      rotate: -720,
      duration: 1,
      delay: 0.2,
      ease: "power2.out",
    });

    gsap.from([headRef1.current, headSmallRef1.current, pRef1.current], {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "linear",
      stagger: 0.2,
      scrollTrigger: {
        trigger: headRef1.current, // 👈 what element triggers the animation
        start: "top 60%", // when top of trigger hits 60% of viewport
        end: "top 40%", // when top of trigger hits 40% of viewport
        toggleActions: "play none none reverse", // play on enter, reverse on leave
      },
    });
  };

  useEffect(() => {
    animateContent1();
    animateContent2();

    gsap.from([starRef3.current, starRef4.current, starRef5.current], {
      opacity: 0,
      scale: 0,
      rotate: -720,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: starRef3.current,
        start: "top 70%",
        end: "bottom 60%",
        toggleActions: "play none none reverse",
      },
    });
  }, []);

  return (
    <>
      <div className={style.section}>
        <div className={style.first}>
          <Image
            className={style.ellipse1}
            src="/images/Ellipse4.svg"
            width={600}
            height={600}
            alt="bg-image"
          />

          <div className={style.content1}>
            <Image
              className={style.star1}
              ref={starRef}
              width={50}
              height={50}
              src="/images/SoftStar.svg"
              alt="start-image"
            />

            <h1 ref={headRef}>Our vision.</h1>
            <h4 ref={headSmallRef}>What Drive Us Forward</h4>
            <p ref={pRef}>
              We are committed to delivering the highest-quality education and
              ensuring accessibility for all. Our goal is to equip individuals
              with the skills needed to adapt to the ever-evolving industry
              landscape, empowering them to thrive in a technology-driven world.
            </p>
          </div>
        </div>
      </div>

      <div className={style.section2}>
        <div className={style.second}>
          <Image
            className={style.ellipse2}
            src="/images/Ellipse4.svg"
            width={600}
            height={600}
            alt="bg-image"
          />

          <div className={style.content2}>
            <Image
              className={style.star2}
              ref={starRef1}
              width={50}
              height={50}
              src="/images/SoftStar.svg"
              alt="start-image"
            />

            <h1 ref={headRef2}>Our mission</h1>
            <h4 ref={headSmallRef2}>GUIDED BY PURPOSE</h4>
            <p ref={pRef2}>
              At Innoknowvex, we empower individuals to drive progress through
              technology and future-ready skills. With expert-led assessments,
              learning paths, and courses, our platform helps professionals
              benchmark their expertise and meet industry demands. We are
              committed to bridging the talent gap, connecting individuals with
              companies, and transforming industries through critical tech
              education. Our goal is to build a brand synonymous with success —
              for our platform, our clients, and the workforce of tomorrow.
            </p>
          </div>
        </div>
      </div>

      <div className={style.section3}>
        <div className={style.first}>
          <Image
            className={style.ellipse1}
            src="/images/Ellipse4.svg"
            width={600}
            height={600}
            alt="bg-image"
          />

          <div className={style.content1}>
            <Image
              className={style.star3}
              ref={starRef2}
              width={50}
              height={50}
              src="/images/SoftStar.svg"
              alt="start-image"
            />

            <h1 ref={headRef1}>Meet The</h1>
            <h4 ref={headSmallRef1}>TEAM.</h4>
            <p ref={pRef1}>
              Behind every success is a team of remarkable minds working
              tirelessly to bring ideas to life. Passion fuels our journey, and
              creativity shapes every step we take. These are the people whose
              dedication, talent, and vision make everything possible.
            </p>
          </div>
        </div>
      </div>

      <div className={style.team}>
        <div className={style.pic1}>
          <Image
            className={style.ceo}
            src="/images/aboutUsPage/CEO.jpeg"
            height={535}
            width={400}
            alt="CEO image"
          />
          <Image
            className={style.star}
            src="/images/SoftStar.svg"
            height={50}
            width={50}
            alt="star"
            ref={starRef3}
          />
          <Image
            className={style.bg}
            src="/images/Ellipse4.svg"
            height={300}
            width={300}
            alt="bg"
          />
          <h1>FARUK</h1>
          <div></div>
          <h4>Founder and CEO</h4>
          <p>
            Guides the company's vision and strategy, inspiring the team to
            innovate, grow, and deliver exceptional results.
          </p>
        </div>

        <div className={style.pic2}>
          <Image
            className={style.ceo}
            src="/images/aboutUsPage/CGO.jpeg"
            height={535}
            width={400}
            alt="CEO image"
          />
          <Image
            className={style.star}
            src="/images/SoftStar.svg"
            height={50}
            width={50}
            alt="star"
            ref={starRef4}
          />
          <Image
            className={style.bg}
            src="/images/Ellipse4.svg"
            height={300}
            width={300}
            alt="bg"
          />
          <h1>DURGESH C.</h1>
          <div></div>
          <h4>CGO (Co-Founder) </h4>
          <p>
            Builds client relationships, drives revenue growth, and ensures the
            company's solutions meet market needs.
          </p>
        </div>

        <div className={style.pic3}>
          <Image
            className={style.ceo}
            src="/images/aboutUsPage/COO.jpeg"
            height={535}
            width={400}
            alt="CEO image"
          />
          <Image
            className={style.star}
            src="/images/SoftStar.svg"
            height={50}
            width={50}
            alt="star"
            ref={starRef5}
          />
          <Image
            className={style.bg}
            src="/images/Ellipse4.svg"
            height={300}
            width={300}
            alt="bg"
          />
          <h1>Vamsi Krishna</h1>
          <div></div>
          <h4>COO (Founder)</h4>
          <p>
            Shapes brand strategy, leading marketing efforts to connect with
            audiences and grow the company's reach.
          </p>
        </div>
      </div>
      <Testimonials/>
    </>
  );
};

export default AboutDetailsPage;