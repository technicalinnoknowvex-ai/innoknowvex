"use client";
import React, { useState, useEffect, useRef } from "react";
import { landingPageData } from "@/data/landing";
import Sparkle from "@/components/Common/Icons/Sparkle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./styles/blogs.module.scss";
import { Icon } from "@iconify/react/dist/iconify.js";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BlogCardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [gap, setGap] = useState(50); // Match the new gap from the SCSS
  const containerRef = useRef(null);
  const sectionRef = useRef();
  const sparkleRef = useRef(null);

  const blogsData = landingPageData.blogsData.blogs || [];

  useEffect(() => {
    const calculateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        setContainerWidth(containerWidth);

        const card = container.querySelector(`.${styles.blogCard}`);
        if (card) {
          const cardWidth = card.offsetWidth;
          setCardWidth(cardWidth);
        }
      }
    };

    calculateDimensions();
    window.addEventListener("resize", calculateDimensions);

    return () => {
      window.removeEventListener("resize", calculateDimensions);
    };
  }, [blogsData.length]);

  useGSAP(
    () => {
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
        .to(
          sparkleRef.current,
          {
            rotation: 360,
            duration: 0.8,
            ease: "power1.inOut",
          },
          "<0.1"
        );
    },
    { scope: sectionRef }
  );

  const cardsToShow =
    containerWidth > 0 && cardWidth > 0
      ? Math.floor(containerWidth / (cardWidth + gap))
      : 3;

  const maxIndex = Math.max(0, blogsData.length - cardsToShow);

  const nextSlide = () => {
    if (currentIndex < blogsData.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleReadMore = (blog, e) => {
    if (!blog.link || blog.link === "#") {
      e.preventDefault();
      console.log("Blog details:", blog);
    }
  };

  if (!blogsData || blogsData.length === 0) {
    return <div className={styles.noData}>No Blogs available</div>;
  }

  const showNavigation = blogsData.length > 1; // Show navigation if there's more than one card
  const canNavigateLeft = showNavigation && currentIndex > 0;
  const canNavigateRight =
    showNavigation && currentIndex < blogsData.length - 1;

  const translateX = -(currentIndex * (cardWidth + gap));

  return (
    <div className={styles.landing} ref={sectionRef} id="blogs">
      <div className={styles.headingSection}>
        <div className={styles.sectionHeadingContainer}>
          <div className={styles.sparkleDiv} ref={sparkleRef}>
            <Sparkle />
          </div>
          <h2 className={styles.sectionHeadingContainer__primaryHeading}>
            Blog
          </h2>
        </div>
        <h3 className={styles.sectionHeadingContainer__secondaryHeading}>
          Discover our latest insights and stories
        </h3>
      </div>

      <div className={styles.carouselContainer} ref={containerRef}>
        {showNavigation && (
          <>
            <button
              className={`${styles.navButton} ${styles.navButtonLeft}`}
              onClick={prevSlide}
              disabled={!canNavigateLeft}
            >
              <Icon
                icon="famicons:chevron-back"
                style={{
                  width: "24px",
                  height: "24px",
                }}
              />
            </button>
            <button
              className={`${styles.navButton} ${styles.navButtonRight}`}
              onClick={nextSlide}
              disabled={!canNavigateRight}
            >
              <Icon
                icon="famicons:chevron-forward"
                style={{
                  width: "24px",
                  height: "24px",
                }}
              />
            </button>
          </>
        )}
        <div className={styles.cardsContainer}>
          <div
            className={styles.cardsWrapper}
            style={{
              transform: `translateX(${translateX}px)`,
              gap: `${gap}px`,
            }}
          >
            {blogsData.map((blog, index) => (
              <div key={blog.id || index} className={styles.blogCard}>
                <div className={styles.imageContainer}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className={styles.blogImage}
                    loading="lazy"
                  />
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardInfo}>
                    <span className={styles.page}>
                      {blog.source || blog.author || "Blog Post"}
                    </span>
                    <h3 className={styles.blogTitle}>{blog.title}</h3>
                    <p className={styles.blogDescription}>
                      {truncateDescription(blog.description)}
                    </p>
                  </div>

                  <div className={styles.cardFooter}>
                    <a
                      href={blog.link || "#"}
                      className={styles.readMoreBtn}
                      onClick={(e) => handleReadMore(blog, e)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon icon="quill:link-out" className={styles.linkIcon} />
                      Read More
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCardCarousel;
