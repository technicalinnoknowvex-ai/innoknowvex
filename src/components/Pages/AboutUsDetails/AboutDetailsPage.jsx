"use client";
import React, { useEffect, useRef } from "react";
import style from "./styles/aboutUs.module.scss";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Testimonials from "../Landing/Sections/Testimonials/Testimonials";
import Footer from "../Landing/Sections/Footer/Footer";

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
    // ⭐ Animate stars
    gsap.fromTo(
      [starRef.current, starRef1.current],
      { opacity: 0, scale: 0, rotate: -720 },
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: starRef.current,
          start: "top 90%",
          once: true,
        },
      }
    );

    // ✨ Animate text
    gsap.fromTo(
      [headRef.current, headSmallRef.current, pRef.current,headRef2.current,headSmallRef2.current,pRef2.current],
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: headRef.current,
          start: "top 90%",
          once: true,
        },
      }
    );
  };

  const animateContent2 = () => {
    // ⭐ Animate star
    gsap.fromTo(
      starRef2.current,
      { opacity: 0, scale: 0, rotate: -720 },
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1,
        ease: "power2.out",
        delay: 0.2,
        scrollTrigger: {
          trigger: headRef1.current,
          start: "top 90%",
          once: true,
        },
      }
    );

    // ✨ Animate text
    gsap.fromTo(
      [headRef1.current, headSmallRef1.current, pRef1.current],
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.2,
        scrollTrigger: {
          trigger: headRef1.current,
          start: "top 90%",
          once: true,
        },
      }
    );
  };

  useEffect(() => {
    animateContent1();
    animateContent2();

    // ⭐ Animate remaining stars
    gsap.fromTo(
      [starRef3.current, starRef4.current, starRef5.current],
      { opacity: 0, scale: 0, rotate: -720 },
      {
        opacity: 1,
        scale: 1,
        rotate: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: starRef3.current,
          start: "top 90%",
          once: true,
        },
      }
    );
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
        <div className={style.cell1}>
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

        <div className={style.cell2}>
          <div className={style.pic3}>
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

          <div className={style.pic4}>
            <Image
              className={style.ceo}
              src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/about_us.png"
              height={535}
              width={400}
              alt="CEO image"
            />
            <Image
              className={style.starP}
              src="/images/SoftStar.svg"
              height={50}
              width={50}
              alt="star"
              ref={starRef5}
            />
            <Image
              className={style.bgP}
              src="/images/Ellipse4.svg"
              height={300}
              width={300}
              alt="bg"
            />
            <h4>Team Members</h4>
            <ul>
              <li>Logesh (Assistant Team Leader)</li>
              <li>Vimalraj (Team Leader)</li>
              <li>Bhumika (Assistant Team Leader)</li>
            </ul>

          </div>
        </div>

      </div>

      <div className={style.images}>
        <div className={style.shell}>
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.44%20AM.jpeg"
            alt="Certificate 1"
            width={600}
            height={400}
            className={style.photo}
          />

          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.45%20AM.jpeg"
            alt="Certificate 2"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

        <div className={style.shell}>
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.45%20AM%20%281%29.jpeg"
            alt="Certificate 3"
            width={600}
            height={400}
            className={style.photo}
          />
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.46%20AM.jpeg"
            alt="Certificate 4"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

        <div className={style.shell}>
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.46%20AM%20%281%29.jpeg"
            alt="Certificate 5"
            width={600}
            height={400}
            className={style.photo}
          />
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.47%20AM.jpeg"
            alt="Certificate 6"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

        <div className={style.shell}>
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.47%20AM%20%281%29.jpeg"
            alt="Certificate 7"
            width={600}
            height={400}
            className={style.photo}
          />
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.48%20AM.jpeg"
            alt="Certificate 8"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

        <div className={style.shell}>
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.48%20AM%20%281%29.jpeg"
            alt="Certificate 9"
            width={600}
            height={400}
            className={style.photo}
          />
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.49%20AM.jpeg"
            alt="Certificate 10"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

        <div className={style.shell1}>
          <Image
            src="https://lwgkwvpeqx5af6xj.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-01%20at%2010.38.49%20AM%20%281%29.jpeg"
            alt="Certificate 11"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

      </div>

      <Testimonials />
      <Footer />
    </>
  );
};

export default AboutDetailsPage;
