"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "./styles/annoucements.module.scss";
import Image from "next/image";
import { landingPageData } from "@/data/landing";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Annoucements = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  const trackRef = useRef(null);

  // Extract the images array from offlineProgramSection
  const images = useMemo(
    () => landingPageData.offlineProgramSection.images ?? [],
    []
  );
  const totalSlides = images.length;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    if (!isAutoPlaying || totalSlides === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex, isAutoPlaying, totalSlides]);

  const closeWithAnimation = () => {
    if (!overlayRef.current || !modalRef.current) {
      setShowPopup(false);
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      onComplete: () => setShowPopup(false),
    });

    tl.to(modalRef.current, { y: 18, opacity: 0, scale: 0.985, duration: 0.22 }, 0);
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2 }, 0);
  };

  const closePopup = () => closeWithAnimation();


  useEffect(() => {
    const popupTimer = setTimeout(() => {
      setScrollY(window.scrollY);
      setShowPopup(true);
    }, 25000);

    return () => clearTimeout(popupTimer);
  }, []);

  useGSAP(
    () => {
      if (!showPopup) return;
      if (!overlayRef.current || !modalRef.current) return;

      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(modalRef.current, { opacity: 0, y: 18, scale: 0.985 });

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      tl.to(overlayRef.current, { opacity: 1, duration: 0.25 }, 0);
      tl.to(
        modalRef.current,
        { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "back.out(1.35)" },
        0.05
      );
    },
    { dependencies: [showPopup] }
  );

  useGSAP(
    () => {
      if (!trackRef.current) return;
      gsap.to(trackRef.current, {
        xPercent: -100 * currentIndex,
        duration: 0.7,
        ease: "power3.inOut",
        overwrite: "auto",
      });
    },
    { dependencies: [currentIndex] }
  );

  // Safety check
  if (!images || images.length === 0) {
    return (
      <div className={styles.layout}>
        <div className={styles.textContainer}>
          <h1>{landingPageData.offlineProgramSection.heading}</h1>
          <p>{landingPageData.offlineProgramSection.subHeading}</p>
        </div>
        <div className={styles.noData}>
          <p>No announcements available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showPopup && (
        <div ref={overlayRef} className={styles.popupOverlay} onClick={closePopup}>
          <div
            className={styles.popupModal}
            onClick={(e) => e.stopPropagation()}
            style={{
              top: `${scrollY + window.innerHeight / 2}px`
            }}
            ref={modalRef}
          >

            <button
              className={styles.closeButton}
              onClick={closePopup}
              aria-label="Close announcements"
            >
              CANCEL
            </button>


            <h2 className={styles.annoucementHeading}>Announcements</h2>
            <p className={styles.annoucementSubtitle}>Now offline courses are available</p>

            <div
              className={styles.popupCarouselWrapper}
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
            >
              {/* Previous Button */}
              <button
                className={`${styles.carouselButton} ${styles.prevButton}`}
                onClick={prevSlide}
                aria-label="Previous slide"
              >
                &#10094;
              </button>

              {/* Carousel Content */}
              <div className={styles.carousel}>
                <div className={styles.carouselTrack} ref={trackRef}>
                  {/* Map through all images and create slides */}
                  {images.map((imageUrl, index) => (
                    <div
                      key={index}
                      className={styles.carouselSlide}
                    >
                      <div className={styles.imageContainer}>
                        <Image
                          src={imageUrl}
                          alt={`Announcement ${index + 1}`}
                          fill
                          style={{ objectFit: 'contain' }}
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Button */}
              <button
                className={`${styles.carouselButton} ${styles.nextButton}`}
                onClick={nextSlide}
                aria-label="Next slide"
              >
                &#10095;
              </button>


              <div className={styles.carouselDots}>
                {images.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === currentIndex ? styles.activeDot : ''
                      }`}
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Slide Counter */}
              <div className={styles.slideCounter}>
                {currentIndex + 1} / {totalSlides}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Annoucements;