
import React, { useState, useEffect } from 'react'
import styles from './styles/annoucements.module.scss'
import Image from 'next/image'
import { landingPageData } from "@/data/landing"

const Annoucements = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Extract the images array from offlineProgramSection
  const images = landingPageData.offlineProgramSection.images
  const totalSlides = images.length

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === totalSlides - 1 ? 0 : prevIndex + 1
    )
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? totalSlides - 1 : prevIndex - 1
    )
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  useEffect(() => {
    if (!isAutoPlaying || totalSlides === 0) return

    const interval = setInterval(() => {
      nextSlide()
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(interval)
  }, [currentIndex, isAutoPlaying, totalSlides])

  const handleMouseEnter = () => {
    setIsAutoPlaying(false)
  }

  const handleMouseLeave = () => {
    setIsAutoPlaying(true)
  }

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
    )
  }

  return (
    <div className={styles.layout}>
      {/* Header Section */}
      <div className={styles.textContainer}>
        <h1>{landingPageData.offlineProgramSection.heading}</h1>
        <p className={styles.subheading}>
          {landingPageData.offlineProgramSection.subHeading}
        </p>
      </div>

      {/* Carousel Container */}
      <div 
        className={styles.carouselWrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
          <div 
            className={styles.carouselTrack}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`
            }}
          >
            {/* Map through all images and create slides */}
            {images.map((imageUrl, index) => (
              <div 
                key={index} 
                className={styles.carouselSlide}
              >
                <div className={styles.imageContainer}>
                  <Image
                    src={imageUrl}
                    alt={`Offline Program ${index + 1}`}
                    fill
                    style={{ objectFit: 'contain' }} // Use 'contain' for posters
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

        {/* Dot Indicators */}
        <div className={styles.carouselDots}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentIndex ? styles.activeDot : ''
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
  )
}

export default Annoucements