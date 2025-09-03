"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { landingPageData } from "@/data/landing";
import Sparkle from "@/components/Common/Icons/Sparkle";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from './styles/blogs.module.scss';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BlogCardCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [gap, setGap] = useState(25); // Default gap from CSS
  const containerRef = useRef(null);
  const sectionRef = useRef();

  // Refs for animations
  const sparkleRef = useRef(null);

  // Access blogsData from landingPageData
  const blogsData = landingPageData.blogsData.blogs || [];

  // Calculate card width and container dimensions
  useEffect(() => {
    const calculateDimensions = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        const containerWidth = container.offsetWidth;
        setContainerWidth(containerWidth);
        
        // Find a card to measure its width
        const card = container.querySelector(`.${styles.blogCard}`);
        if (card) {
          const cardWidth = card.offsetWidth;
          setCardWidth(cardWidth);
          
          // Calculate gap by checking the difference between cards
          const cards = container.querySelectorAll(`.${styles.blogCard}`);
          if (cards.length > 1) {
            const firstCard = cards[0];
            const secondCard = cards[1];
            const firstRect = firstCard.getBoundingClientRect();
            const secondRect = secondCard.getBoundingClientRect();
            const calculatedGap = secondRect.left - firstRect.right;
            if (calculatedGap > 0) {
              setGap(calculatedGap);
            }
          }
        }
      }
    };

    calculateDimensions();
    window.addEventListener('resize', calculateDimensions);
    
    return () => {
      window.removeEventListener('resize', calculateDimensions);
    };
  }, [blogsData.length]);

  // GSAP animations - only for sparkle
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

  // Calculate how many cards are visible based on container width
  const cardsToShow = containerWidth > 0 && cardWidth > 0 
    ? Math.floor(containerWidth / (cardWidth + gap))
    : 3; // Default fallback

  // Calculate maxIndex for single card movement - FIXED
  const maxIndex = Math.max(0, blogsData.length - cardsToShow);

  const nextSlide = () => {
    if (currentIndex < maxIndex) {
      setCurrentIndex(prevIndex => Math.min(prevIndex + 1, maxIndex));
    }
  };

  const prevSlide = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prevIndex => Math.max(prevIndex - 1, 0));
    }
  };

  const truncateDescription = (text, maxLength = 150) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleReadMore = (blog, e) => {
    if (!blog.link || blog.link === '#') {
      e.preventDefault();
      console.log('Blog details:', blog);
    }
  };

  if (!blogsData || blogsData.length === 0) {
    return <div className={styles.noData}>No Blogs available</div>;
  }

  // Only show navigation if there are more cards than visible cards
  const showNavigation = blogsData.length > cardsToShow;
  const canNavigateLeft = showNavigation && currentIndex > 0;
  const canNavigateRight = showNavigation && currentIndex < maxIndex;

  // Calculate the translation amount
  const translateX = -(currentIndex * (cardWidth + gap));

  return (
    <div className={styles.landing} ref={sectionRef}>
      {/* Heading Section with Sparkle */}
      <div className={styles.headingSection}>
        <div className={styles.sectionHeadingContainer}>
          <div className={styles.sparkleDiv}>
            <div ref={sparkleRef}>
              <Sparkle />
            </div>
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
        {/* Navigation Buttons */}
        {showNavigation && (
          <>
            <button
              className={`${styles.navButton} ${styles.navButtonLeft}`}
              onClick={prevSlide}
              disabled={!canNavigateLeft}
            >
              <ChevronLeft size={24} />
            </button>

            <button
              className={`${styles.navButton} ${styles.navButtonRight}`}
              onClick={nextSlide}
              disabled={!canNavigateRight}
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className={styles.cardsContainer}>
          <div
            className={styles.cardsWrapper}
            style={{ 
              transform: `translateX(${translateX}px)`,
              gap: `${gap}px`
            }}
          >
            {blogsData.map((blog, index) => (
              <div 
                key={blog.id || index} 
                className={styles.blogCard}
              >
                {/* Image Container */}
                <div className={styles.imageContainer}>
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className={styles.blogImage}
                    loading="lazy"
                  />
                </div>
                
                {/* Card Content */}
                <div className={styles.cardContent}>
                  <div className={styles.cardInfo}>
                    <span className={styles.page}>
                      {blog.source || blog.author || 'Blog Post'}
                    </span>
                    <h3 className={styles.blogTitle}>{blog.title}</h3>
                    <p className={styles.blogDescription}>
                      {truncateDescription(blog.description)}
                    </p>
                  </div>
                  
                  <div className={styles.cardFooter}>
                    <a
                      href={blog.link || '#'}
                      className={styles.readMoreBtn}
                      onClick={(e) => handleReadMore(blog, e)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink size={16} className={styles.linkIcon} />
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