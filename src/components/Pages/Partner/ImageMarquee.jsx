import React from 'react';
import styles from './styles/ImageMarquee.module.scss';

const ImageMarquee = () => {
  // Image data with 21 unique photos (3 sets of 7)
  const images = [
    // First set (original 7)
    { id: 'accenture-1', src: '/images/Accenture.svg', alt: 'Accenture Logo' },
    { id: 'boat-2', src: '/images/Boat.svg', alt: 'Boat Logo' },
    { id: 'capgemini-3', src: '/images/Capgemini.svg', alt: 'Capgemini Logo' },
    { id: 'ibm-4', src: '/images/IBM.svg', alt: 'IBM Logo' },
    { id: 'phonepe-5', src: '/images/Phonepe.svg', alt: 'PhonePe Logo' },
    { id: 'razorpay-6', src: '/images/Razerpay.svg', alt: 'Razorpay Logo' },
    { id: 'wipro-7', src: '/images/Wipro.svg', alt: 'Wipro Logo' },
    
    // Second set (different images or repeats with new IDs)
    { id: 'accenture-8', src: '/images/Accenture.svg', alt: 'Accenture Logo' },
    { id: 'boat-9', src: '/images/Boat.svg', alt: 'Boat Logo' },
    { id: 'capgemini-10', src: '/images/Capgemini.svg', alt: 'Capgemini Logo' },
    { id: 'ibm-11', src: '/images/IBM.svg', alt: 'IBM Logo' },
    { id: 'phonepe-12', src: '/images/Phonepe.svg', alt: 'PhonePe Logo' },
    { id: 'razorpay-13', src: '/images/Razerpay.svg', alt: 'Razorpay Logo' },
    { id: 'wipro-14', src: '/images/Wipro.svg', alt: 'Wipro Logo' },
    
    // Third set (different images or repeats with new IDs)
    { id: 'accenture-15', src: '/images/Accenture.svg', alt: 'Accenture Logo' },
    { id: 'boat-16', src: '/images/Boat.svg', alt: 'Boat Logo' },
    { id: 'capgemini-17', src: '/images/Capgemini.svg', alt: 'Capgemini Logo' },
    { id: 'ibm-18', src: '/images/IBM.svg', alt: 'IBM Logo' },
    { id: 'phonepe-19', src: '/images/Phonepe.svg', alt: 'PhonePe Logo' },
    { id: 'razorpay-20', src: '/images/Razerpay.svg', alt: 'Razorpay Logo' },
    { id: 'wipro-21', src: '/images/Wipro.svg', alt: 'Wipro Logo' },
  ];

  // Create marquee content with unique keys
  const marqueeContent = [
    ...images,
    ...images.map(img => ({ ...img, id: `${img.id}-copy` }))
  ];

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        <div className={styles.marqueeContent}>
          {marqueeContent.map((image) => (
            <div key={image.id} className={styles.marqueeItem}>
              <img 
                src={image.src} 
                alt={image.alt} 
                className={styles.marqueeImage} 
                draggable="false"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageMarquee;