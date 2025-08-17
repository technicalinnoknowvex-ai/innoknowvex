
'use client'
import Navbar from '../Pages/Navbar/Navbar'
import styles from './styles/CourseLayout.module.scss'
import { useRef, useEffect } from 'react';

export default function CourseLayout({ course }) {
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
    <div className={styles.courseContainer}>
      <Navbar />
      <div>
        <img
          src={course.image}
          alt={course.title}
          className={styles.courseImage}
        />
      </div>
      <h2>Program Overview</h2>
      <section>
        <p>{course.overview}</p>
        <div className={styles.buttons}>
          <button className={styles.startnow}>Start Course Now</button>
          <button className={styles.Brochure}>Brochure</button>
        </div>
      </section>
      
      <div className={styles.whyLearnSection}>
        <img src='/images/Ellipse4.svg' alt='ellipse' className={styles.ellipse1} />
        
        <div className={styles.LearnForm}>
          <img src="/images/SoftStar.svg"
            width={60}
            height={60} alt="SoftStar" />
          <h1>Why Learn from <br /> InnoKnowvex</h1>
          <p>WE HAVE NOT ONE, BUT THREE REASONS</p>
          
          {/* Features Section */}
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>01</div>
              <div className={styles.featureContent}>
                <h3>Online Billing, Invoicing & Contracts.</h3>
                <p>Simple and secure control of your organization's financial and legal transactions. Send customized invoices and contracts.</p>
              </div>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>02</div>
              <div className={styles.featureContent}>
                <h3>Easy Scheduling & Attendance tracking.</h3>
                <p>Simple and secure control of your organization's financial and legal transactions. Send customized invoices and contracts.</p>
              </div>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureNumber}>03</div>
              <div className={styles.featureContent}>
                <h3>Customer Tracking.</h3>
                <p>Simple and secure control of your organization's financial and legal transactions. Send customized invoices and contracts.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Career Boost Cards Section */}
      <div className={styles.cardsContainer}>
        {/* Left section with Career Boost content */}
        <div className={styles.leftSection}>
          <div className={styles.careerBoostContent}>
            <h1 className={styles.careerBoostTitle}>Career Boost</h1>
            <p className={styles.careerBoostDescription}>
              Unlock Your Potential With Dedicated Support That Prepares You For Real-World Success!
            </p>
          </div>
        </div>

        {/* Cards section */}
        <div className={styles.cardsSection}>
          <div className={styles.cardsGrid}>
            {/* First row */}
            <div 
              ref={el => cardRefs.current[0] = el}
              className={`${styles.card} ${styles.softSkillsCard}`}
            >
              <div 
                ref={el => headerRefs.current[0] = el}
                className={styles.cardHeader}
              >
                <img
                  ref={el => starRefs.current[0] = el}
                  className={styles.starImage}
                  src="/images/SoftStar3.svg"
                  width={20}
                  height={20}
                  alt="Soft Star"
                />
                <h3 ref={el => headingRefs.current[0] = el}>SOFT SKILLS</h3>
              </div>
              <p ref={el => paragraphRefs.current[0] = el}>
                Enhance your communications and interpersonal skills.
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
                <img
                  ref={el => starRefs.current[1] = el}
                  className={styles.starImage}
                  src="/images/SoftStar3.svg"
                  width={40}
                  height={40}
                  alt="Soft Star"
                />
                <h3 ref={el => headingRefs.current[1] = el}>MOCK INTERVIEWS</h3>
              </div>
              <p ref={el => paragraphRefs.current[1] = el}>
                Prepare for interviews with realistic practice sessions.
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
                <img
                  ref={el => starRefs.current[2] = el}
                  className={styles.starImage}
                  src="/images/SoftStar3.svg"
                  width={20}
                  height={20}
                  alt="Soft Star"
                />
                <h3 ref={el => headingRefs.current[2] = el}>PORTFOLIO BUILDING</h3>
              </div>
              <p ref={el => paragraphRefs.current[2] = el}>
                Create a standout portfolio that showcases your skills.
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
                <img
                  ref={el => starRefs.current[3] = el}
                  className={styles.starImage}
                  src="/images/SoftStar3.svg"
                  width={20}
                  height={20}
                  alt="Soft Star"
                />
                <h3 ref={el => headingRefs.current[3] = el}>RESUME BUILDING</h3>
              </div>
              <p ref={el => paragraphRefs.current[3] = el}>
                Boost confidence with realistic, interview-style practice.
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
                <img
                  ref={el => starRefs.current[4] = el}
                  className={styles.starImage}
                  src="/images/SoftStar3.svg"
                  width={40}
                  height={40}
                  alt="Soft Star"
                />
                <h3 ref={el => headingRefs.current[4] = el}>MOCK TESTS</h3>
              </div>
              <p ref={el => paragraphRefs.current[4] = el}>
                Build a professional resume that highlights your strength.
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
                <img
                  ref={el => starRefs.current[5] = el}
                  className={styles.starImage}
                  src="/images/SoftStar3.svg"
                  width={40}
                  height={40}
                  alt="Soft Star"
                />
                <h3 ref={el => headingRefs.current[5] = el}>INTERVIEW GUIDANCE</h3>
              </div>
              <p ref={el => paragraphRefs.current[5] = el}>
                Ace your interview with targeted guidance and support.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.Plans}>
        <img src="/images/SoftStar.svg"
                  width={40}
                  height={40}
                  alt="Soft Star" />
        <h1>Plans to fit your Learning needs</h1>
        <p>CHOOSE THAT FITS YOU</p>
      </div>
    </div>
  )
}
