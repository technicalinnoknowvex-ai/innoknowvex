"use client";
import React, { useEffect, useRef } from "react";
import style from "./styles/aboutUs.module.scss";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Testimonials from "../Landing/Sections/Testimonials/Testimonials";
import Footer from "../Landing/Sections/Footer/Footer";
import Ellipse1 from "./svgImages/Ellipse1";
import Ellipse2 from "./svgImages/Ellipse2";
import StarIcon from "./svgImages/Star";
import Bg from "./svgImages/Bg";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const AboutDetailsPage = () => {
  const starRef = useRef();
  const starRef1 = useRef();
  const starRef2 = useRef();
  const starRef3 = useRef();
  const starRef4 = useRef();
  const starRef5 = useRef();
  const starRef6 = useRef();

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
      [headRef.current, headSmallRef.current, pRef.current, headRef2.current, headSmallRef2.current, pRef2.current],
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
      [starRef3.current,starRef6.current],
      { opacity: 0, scale: 0, rotate: -720 },
      {
        opacity: 1,
        scale: 0.55,
        rotate: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: starRef3.current,
          start: "top 90%",
          toggleActions: "play reverse play reverse", 
        },
      }
    );

    gsap.fromTo(
      [starRef4.current, starRef5.current],
      { opacity: 0, scale: 0, rotate: -720 },
      {
        opacity: 1,
        scale: 0.55,
        rotate: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: starRef4.current,
          start: "top 70%",
          toggleActions: "play reverse play reverse", 
        },
      }
    );
  }, []);


  return (
    <>
      <div className={style.section}>
        <div className={style.first}>
          <Ellipse1/>

          <div className={style.content1}>
            <StarIcon ref={starRef} className={style.star1} width={50} height={50} />

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
          <Ellipse2/>

          <div className={style.content2}>
            <StarIcon ref={starRef1} className={style.star2} width={50} height={50} />

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
          <Ellipse1/>

          <div className={style.content1}>
            <StarIcon ref={starRef2} className={style.star3} width={50} height={50} />

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
              src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/CEO.jpeg"
              height={535}
              width={400}
              alt="CEO image"
            />
            <StarIcon ref={starRef3} className={style.star} width={50} height={50} />
            <Bg className={style.bg} width={300} height={300}/>
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
              src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/COO.jpeg"
              height={535}
              width={400}
              alt="COO image"
            />

            <StarIcon ref={starRef6} className={style.star} width={50} height={50} />
            <Bg className={style.bg} width={300} height={300}/>
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
              src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/CGO.jpeg"
              height={535}
              width={400}
              alt="CGO image"
            />
            <StarIcon ref={starRef4} className={style.star} width={50} height={50} />
            <Bg className={style.bg} width={300} height={300}/>
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
              src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-30%20at%2013.35.49_010eef93.jpg"
              height={535}
              width={400}
              alt="CEO image"
            />

            <StarIcon ref={starRef5} className={style.star} width={50} height={50} />
            <Bg className={style.bg} width={300} height={300}/>
            <h4>Team Members</h4>
            <ul>
              <li>Vimalraj (Team leader)</li>
              <li>Logesh (Assistant team leader)</li>
              <li>Bhumika Muthamma (Assistant team leader)</li>
            </ul>

          </div>
        </div>

      </div>

      <div className={style.images}>
        <div className={style.shell}>
          <Image
          src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.03_01c3f1f9.jpg" 
                     alt="Certificate 1"
            width={600}
            height={400}
            className={style.photo}
          />

          <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.02_db791e5f.jpg"
            alt="Certificate 2"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

        <div className={style.shell}>
          <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.05_02435bf9.jpg"
            alt="Certificate 3"
            width={600}
            height={400}
            className={style.photo}
          />
          <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.01_689ad648.jpg"
            alt="Certificate 4"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

        

        <div className={style.shell}>
          <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.02_38b68d11.jpg"
            alt="Certificate 7"
            width={600}
            height={400}
            className={style.photo}
          />
          <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.03_34a20cfc.jpg"
            alt="Certificate 8"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

        <div className={style.shell}>
          <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.04_3838ab77.jpg"
            alt="Certificate 9"
            width={600}
            height={400}
            className={style.photo}
          />
          <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.05_ce855ce7.jpg"
            alt="Certificate 10"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>

        <div className={style.shell1}>
          <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.04_4afbe92a.jpg"
            alt="Certificate 11"
            width={600}
            height={400}
            className={style.photo}
          />
           <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.04_c910bfdb.jpg"
            alt="Certificate 5"
            width={600}
            height={400}
            className={style.photo}
          />
        </div>
        {/* <div className={style.shell}>
         
          <Image
            src="https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.01_86c1158f.jpg"
            alt="Certificate 6"
            width={600}
            height={400}
            className={style.photo}
          />
        </div> */}

      </div>

      <Testimonials />
      <Footer />
    </>
  );
};

export default AboutDetailsPage;
