
'use client';
import Image from 'next/image';
import styles from './styles/cards.module.scss';
import { useRef, useEffect } from 'react';

export default function Cards() {
  const starRefs = useRef([]);
  const cardRefs = useRef([]);
  const headerRefs = useRef([]);
  const paragraphRefs = useRef([]);
  const headingRefs = useRef([]);

  // Initialize ref arrays
  useEffect(() => {
    starRefs.current = starRefs.current.slice(0, 6);
    cardRefs.current = cardRefs.current.slice(0, 6);
    headerRefs.current = headerRefs.current.slice(0, 6);
    paragraphRefs.current = paragraphRefs.current.slice(0, 6);
    headingRefs.current = headingRefs.current.slice(0, 6);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.visible);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all elements
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    starRefs.current.forEach((star) => {
      if (star) observer.observe(star);
    });
    headerRefs.current.forEach((header) => {
      if (header) observer.observe(header);
    });
    paragraphRefs.current.forEach((paragraph) => {
      if (paragraph) observer.observe(paragraph);
    });
    headingRefs.current.forEach((heading) => {
      if (heading) observer.observe(heading);
    });

    return () => {
      cardRefs.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
      starRefs.current.forEach((star) => {
        if (star) observer.unobserve(star);
      });
      headerRefs.current.forEach((header) => {
        if (header) observer.unobserve(header);
      });
      paragraphRefs.current.forEach((paragraph) => {
        if (paragraph) observer.unobserve(paragraph);
      });
      headingRefs.current.forEach((heading) => {
        if (heading) observer.unobserve(heading);
      });
    };
  }, []);

  return (
    <div className={styles.cardsContainer}>
      {/* Empty left section (1/3 of screen) */}
      <div className={styles.leftSection}></div>

      {/* Cards section (remaining 2/3 of screen) */}
      <div className={styles.cardsSection}>
        {/* Cards grid */}
        <div className={styles.cardsGrid}>
          {/* First row */}
          <div 
            ref={el => cardRefs.current[0] = el}
            className={`${styles.card} ${styles.firstCard}`}
          >
            <div 
              ref={el => headerRefs.current[0] = el}
              className={styles.cardHeader}
            >
              <Image
                ref={el => starRefs.current[0] = el}
                className={styles.starImage}
                src="/images/SoftStar.svg"
                width={40}
                height={40}
                alt="Soft Star"
              />
              <h3 ref={el => headingRefs.current[0] = el}>CLASSES</h3>
            </div>
            <p ref={el => paragraphRefs.current[0] = el}>
              Each activity is one of the most important events that will contribute to our business. We have been working with people who are able to work on their own and to empower them to grow our business.
            </p>
          </div>
          
          <div 
            ref={el => cardRefs.current[1] = el}
            className={styles.card}
          >
            <div 
              ref={el => headerRefs.current[1] = el}
              className={styles.cardHeader}
            >
              <Image
                ref={el => starRefs.current[1] = el}
                className={styles.starImage}
                src="/images/SoftStar.svg"
                width={40}
                height={40}
                alt="Soft Star"
              />
              <h3 ref={el => headingRefs.current[1] = el}>INTERVIEW TRAINING</h3>
            </div>
            <p ref={el => paragraphRefs.current[1] = el}>
              Ideal for front-line through social activities, professional leadership, and expert feedback—any online technology project provided, or other information on all real-world experiences.
            </p>
          </div>
          
          <div 
            ref={el => cardRefs.current[2] = el}
            className={styles.card}
          >
            <div 
              ref={el => headerRefs.current[2] = el}
              className={styles.cardHeader}
            >
              <Image
                ref={el => starRefs.current[2] = el}
                className={styles.starImage}
                src="/images/SoftStar.svg"
                width={40}
                height={40}
                alt="Soft Star"
              />
              <h3 ref={el => headingRefs.current[2] = el}>LINKEDIN & RESUME BUILDING</h3>
            </div>
            <p ref={el => paragraphRefs.current[2] = el}>
              Review personalized experience across a particular team. Just right, our achievements, our career and we'd try to showcase our living strategies.
            </p>
          </div>

          {/* Second row */}
          <div 
            ref={el => cardRefs.current[3] = el}
            className={styles.card}
          >
            <div 
              ref={el => headerRefs.current[3] = el}
              className={styles.cardHeader}
            >
              <Image
                ref={el => starRefs.current[3] = el}
                className={styles.starImage}
                src="/images/SoftStar.svg"
                width={40}
                height={40}
                alt="Soft Star"
              />
              <h3 ref={el => headingRefs.current[3] = el}>PASSIONATE COMMUNITY</h3>
            </div>
            <p ref={el => paragraphRefs.current[3] = el}>
              Join our next-generation creative communities of peers, friends, and family members to deliver new collaborative partnerships and creative opportunities after online learning journey.
            </p>
          </div>
          
          <div 
            ref={el => cardRefs.current[4] = el}
            className={styles.card}
          >
            <div 
              ref={el => headerRefs.current[4] = el}
              className={styles.cardHeader}
            >
              <Image
                ref={el => starRefs.current[4] = el}
                className={styles.starImage}
                src="/images/SoftStar.svg"
                width={40}
                height={40}
                alt="Soft Star"
              />
              <h3 ref={el => headingRefs.current[4] = el}>SUPPORT & ASSISTANCE</h3>
            </div>
            <p ref={el => paragraphRefs.current[4] = el}>
              Our dedicated team supports productivity and efficiency—helping play the objectives, photography, knowledge and content practices that create solutions.
            </p>
          </div>
          
          <div 
            ref={el => cardRefs.current[5] = el}
            className={styles.card}
          >
            <div 
              ref={el => headerRefs.current[5] = el}
              className={styles.cardHeader}
            >
              <Image
                ref={el => starRefs.current[5] = el}
                className={styles.starImage}
                src="/images/SoftStar.svg"
                width={40}
                height={40}
                alt="Soft Star"
              />
              <h3 ref={el => headingRefs.current[5] = el}>ACCESS TO CONTENT</h3>
            </div>
            <p ref={el => paragraphRefs.current[5] = el}>
              Select your team across its diverse forms and links with stakeholders. Stay close with an external culture, open growing public space, increasing awareness to industry leaders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}