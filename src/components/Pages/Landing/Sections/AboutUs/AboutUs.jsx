import React, { useRef } from "react";
import aboutUsStyles from "./styles/aboutUs.module.scss";
import { landingPageData } from "@/data/landing";
import Image from "next/image";
import Sparkle from "@/components/Common/Icons/Sparkle";
import Link from "next/link";
import { useCursor } from "@/hooks/useCursor";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const AboutUs = ({ scrollContainerRef }) => {
  const { heading, subheading, para, images } = landingPageData.aboutSection;
  const { resetCursor, transformCursor } = useCursor();
  const sectionRef = useRef(null);
  const sparkleRef = useRef(null);
  const headingRef = useRef(null);
  const paraRef = useRef(null);
  const buttonRef = useRef(null);
  const cellRefs = useRef([]);

  useGSAP(
    () => {
      // Animate sparkle when section comes into view
      const sparkleTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "bottom 40%",
          toggleActions: "play none none reverse",
        },
      });

      sparkleTl
        .fromTo(
          sparkleRef.current,
          {
            scale: 0,
            opacity: 0,
            rotation: -360,
          },
          {
            scale: 1.2,
            opacity: 1,
            rotation: 0,
            duration: 0.5,
            ease: "power2.out",
          }
        )
        .to(sparkleRef.current, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
        .to(sparkleRef.current, {
          rotation: 360,
          duration: 0.8,
          ease: "power1.inOut",
        });

      // Sequential animations triggered by heading when section is 50% in view
      const contentTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 50%",
          end: "bottom 20%", // Added end point for better reverse control
          toggleActions: "play none none reverse",
        },
      });

      // Text content: slide from left
      gsap.set(headingRef.current, { clipPath: "inset(0 0 100% 0)", opacity: 1 });
      gsap.set(paraRef.current, { x: -50, opacity: 0 });
      gsap.set(buttonRef.current, { x: -40, opacity: 0 });

      // Collage cells: stagger in from scale + varied directions
      cellRefs.current.forEach((cell, i) => {
        const origins = [
          { x: -30, y: -30 }, { x: 0, y: -40 }, { x: 30, y: -20 },
          { x: -20, y: 30 }, { x: 20, y: 0 }, { x: 0, y: 30 },
        ];
        const o = origins[i % origins.length];
        gsap.set(cell, { x: o.x, y: o.y, opacity: 0, scale: 0.88 });
      });

      contentTl
        .to(headingRef.current, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.7,
          ease: "power3.out",
        })
        .to(
          paraRef.current,
          { x: 0, opacity: 1, duration: 0.65, ease: "power2.out" },
          "-=0.4"
        )
        .to(
          buttonRef.current,
          { x: 0, opacity: 1, duration: 0.55, ease: "power2.out" },
          "-=0.35"
        )
        .to(
          cellRefs.current,
          {
            x: 0, y: 0, opacity: 1, scale: 1,
            duration: 0.65,
            ease: "power2.out",
            stagger: 0.07,
          },
          "-=0.5"
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      className={aboutUsStyles.sectionWrapper}
      ref={sectionRef}
      id="about-us"
    >
      <div className={aboutUsStyles.sectionWrapper__innerContainer}>
        <section className={aboutUsStyles.leftSection}>
          <div
            className={aboutUsStyles.sectionHeadingContainer}
            ref={headingRef}
          >
            <div
              className={`${aboutUsStyles.gradientSpot} ${aboutUsStyles["gradientSpot--1"]}`}
            />
            <div className={aboutUsStyles.sparkleDiv}>
              <div ref={sparkleRef}>
                <Sparkle />
              </div>
            </div>

            <h2
              className={`${aboutUsStyles.sectionHeadingContainer__primaryHeading} gradientHeading`}
            >
              {heading}
            </h2>
            <h3
              className={
                aboutUsStyles.sectionHeadingContainer__secondaryHeading
              }
            >
              {subheading}
            </h3>
          </div>
          <div className={aboutUsStyles.paraContainer} ref={paraRef}>
            <p className={aboutUsStyles.paraContainer__paraText}>{para}</p>
          </div>
          <div className={aboutUsStyles.linkContainer} ref={buttonRef}>
            <Link
              href="/about-us"
              className={aboutUsStyles.linkContainer__link}
              onMouseEnter={() =>
                transformCursor({
                  dot: {
                    backgroundColor: "#ff6432",
                    scale: 10,
                    opacity: 0.5,
                  },
                  ring: {
                    opacity: 0,
                    scale: 0.5,
                  },
                })
              }
              onMouseLeave={() => resetCursor()}
            >
              Know More
            </Link>
          </div>
        </section>
        <section className={aboutUsStyles.rightSection}>
          <div
            className={`${aboutUsStyles.gradientSpot} ${aboutUsStyles["gradientSpot--2"]}`}
          />
          <div className={aboutUsStyles.rightSection__collageGrid}>
            <div className={aboutUsStyles.cell1} ref={(el) => (cellRefs.current[0] = el)}>
              <Image
                src={images[0]}
                alt="cell_1_img"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={55}
                rel="preload"
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell2} ref={(el) => (cellRefs.current[1] = el)}></div>
            <div className={aboutUsStyles.cell3} ref={(el) => (cellRefs.current[2] = el)}>
              <Image
                src={images[1]}
                alt="cell_2_img"
                fill
                sizes="(max-width: 768px) 30vw, 15vw"
                rel="preload"
                quality={55}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell4} ref={(el) => (cellRefs.current[3] = el)}>
              <Image
                src={images[2]}
                alt="cell_3_img"
                fill
                sizes="(max-width: 768px) 40vw, 20vw"
                rel="preload"
                quality={75}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell5} ref={(el) => (cellRefs.current[4] = el)}></div>
            <div className={aboutUsStyles.cell6} ref={(el) => (cellRefs.current[5] = el)}></div>
            <div className={aboutUsStyles.cell7} ref={(el) => (cellRefs.current[6] = el)}>
              <Image
                src={images[3]}
                alt="cell_4_img"
                fill
                sizes="(max-width: 768px) 35vw, 18vw"
                rel="preload"
                quality={55}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell8} ref={(el) => (cellRefs.current[7] = el)}></div>
            <div className={aboutUsStyles.cell9} ref={(el) => (cellRefs.current[8] = el)}>
              <Image
                src={images[4]}
                alt="cell_5_img"
                fill
                sizes="(max-width: 768px) 45vw, 22vw"
                rel="preload"
                quality={55}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={aboutUsStyles.cell10} ref={(el) => (cellRefs.current[9] = el)}></div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default AboutUs;