
import React from 'react';
import styles from './styles/ImageMarquee.module.scss';

const ImageMarquee = () => {
  // Original image set
  const images = [
    { id: 'accenture-1', src: '/images/Accenture.svg', alt: 'Accenture Logo' },
    { id: 'boat-2', src: '/images/Boat.svg', alt: 'Boat Logo' },
    { id: 'capgemini-3', src: '/images/Capgemini.svg', alt: 'Capgemini Logo' },
    { id: 'ibm-4', src: '/images/IBM.svg', alt: 'IBM Logo' },
    { id: 'phonepe-5', src: '/images/Phonepe.svg', alt: 'PhonePe Logo' },
    { id: 'razorpay-6', src: '/images/Razerpay.svg', alt: 'Razorpay Logo' },
    { id: 'wipro-7', src: '/images/Wipro.svg', alt: 'Wipro Logo' },
    { id: 'accenture-8', src: '/images/Accenture1.svg', alt: 'Accenture Logo' },
    { id: 'boat-9', src: '/images/Boat1.svg', alt: 'Boat Logo' },
    { id: 'capgemini-10', src: '/images/Capgemini1.svg', alt: 'Capgemini Logo' },
    { id: 'ibm-11', src: '/images/IBM1.svg', alt: 'IBM Logo' },
    { id: 'phonepe-12', src: '/images/Phonepe1.svg', alt: 'PhonePe Logo' },
    { id: 'razorpay-13', src: '/images/Razerpay1.svg', alt: 'Razorpay Logo' },
    { id: 'wipro-14', src: '/images/Wipro1.svg', alt: 'Wipro Logo' },
    { id: 'accenture-15', src: '/images/Accenture2.svg', alt: 'Accenture Logo' },
    { id: 'boat-16', src: '/images/Boat2.svg', alt: 'Boat Logo' },
    { id: 'capgemini-17', src: '/images/Capgemini2.svg', alt: 'Capgemini Logo' },
    { id: 'ibm-18', src: '/images/IBM2.svg', alt: 'IBM Logo' },
    { id: 'phonepe-19', src: '/images/Phonepe2.svg', alt: 'PhonePe Logo' },
    { id: 'razorpay-20', src: '/images/Razerpay2.svg', alt: 'Razorpay Logo' },
    { id: 'wipro-21', src: '/images/Wipro2.svg', alt: 'Wipro Logo' },
  ];

  // Duplicate images for seamless looping (enough to fill screen + buffer)
  const marqueeContent = [...images, ...images, ...images];

  return (
    <div className={styles.marqueeContainer}>
      <div className={styles.marqueeTrack}>
        <div className={styles.marqueeContent}>
          {marqueeContent.map((image, index) => (
            <div key={`${image.id}-${index}`} className={styles.marqueeItem}>
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