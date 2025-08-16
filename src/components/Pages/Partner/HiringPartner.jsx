
import styles from './styles/Hiringartner.module.scss'
export default function Hiringpartners(){
     const images = [
   { id: 'amity-1', src: '/images/amity.svg', alt: 'Amity University 1' },
    { id: 'kl-2', src: '/images/kl.svg', alt: 'KL University 1' },
    { id: 'ks-3', src: '/images/ks.svg', alt: 'KS University 1' },
    { id: 'reva-4', src: '/images/reva.svg', alt: 'REVA University 1' },
    { id: 'presidency-5', src: '/images/Presidency.svg', alt: 'Presidency University 1' },
    { id: 'amity-6', src: '/images/amity1.svg', alt: 'Amity University 2' },
    { id: 'kl-7', src: '/images/kl1.svg', alt: 'KL University 2' },
    { id: 'ks-8', src: '/images/ks1.svg', alt: 'KS University 2' },
    { id: 'reva-9', src: '/images/reva1.svg', alt: 'REVA University 2' },
    { id: 'amity-10', src: '/images/amity2.svg', alt: 'Amity University 3' },
    { id: 'kl-11', src: '/images/kl2.svg', alt: 'KL University 3' },
    { id: 'ks-12', src: '/images/ks2.svg', alt: 'KS University 3' },
    { id: 'reva-13', src: '/images/reva2.svg', alt: 'REVA University 3' },
    { id: 'presidency-14', src: '/images/Presidency1.svg', alt: 'Presidency University 2' },
    { id: 'amity-15', src: '/images/amity3.svg', alt: 'Amity University 4' },
    { id: 'kl-16', src: '/images/kl3.svg', alt: 'KL University 4' },
    { id: 'ks-17', src: '/images/ks3.svg', alt: 'KS University 4' },
    { id: 'reva-18', src: '/images/reva3.svg', alt: 'REVA University 4' },
    { id: 'presidency-19', src: '/images/Presidency2.svg', alt: 'Presidency University 3' },
    { id: 'amity-20', src: '/images/amity4.svg', alt: 'Amity University 5' },
    { id: 'kl-21', src: '/images/kl4.svg', alt: 'KL University 5' }
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

