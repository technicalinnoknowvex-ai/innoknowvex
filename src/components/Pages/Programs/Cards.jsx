// 'use client'
// import { useRef, useEffect } from 'react';
// import styles from './styles/CardsSection.module.scss'

// export default function CardsSection() {
//   const starRefs = useRef([]);
//   const cardRefs = useRef([]);
//   const headerRefs = useRef([]);
//   const paragraphRefs = useRef([]);
//   const headingRefs = useRef([]);

//   useEffect(() => {           
//     starRefs.current = starRefs.current.slice(0, 6);
//     cardRefs.current = cardRefs.current.slice(0, 6);
//     headerRefs.current = headerRefs.current.slice(0, 6);
//     paragraphRefs.current = paragraphRefs.current.slice(0, 6);
//     headingRefs.current = headingRefs.current.slice(0, 6);
//   }, []);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add(styles.visible);
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );

//     // Observe all elements
//     cardRefs.current.forEach((card) => {
//       if (card) observer.observe(card);
//     });
//     starRefs.current.forEach((star) => {
//       if (star) observer.observe(star);
//     });
//     headerRefs.current.forEach((header) => {
//       if (header) observer.observe(header);
//     });
//     paragraphRefs.current.forEach((paragraph) => {
//       if (paragraph) observer.observe(paragraph);
//     });
//     headingRefs.current.forEach((heading) => {
//       if (heading) observer.observe(heading);
//     });

//     return () => {
//       cardRefs.current.forEach((card) => {
//         if (card) observer.unobserve(card);
//       });
//       starRefs.current.forEach((star) => {
//         if (star) observer.unobserve(star);
//       });
//       headerRefs.current.forEach((header) => {
//         if (header) observer.unobserve(header);
//       });
//       paragraphRefs.current.forEach((paragraph) => {
//         if (paragraph) observer.unobserve(paragraph);
//       });
//       headingRefs.current.forEach((heading) => {
//         if (heading) observer.unobserve(heading);
//       });
//     };
//   }, []);

//   return (
//     <div className={styles.cardsContainer}>
//       {/* Left section with Career Boost content */}
//       <div className={styles.leftSection}>
//         <div className={styles.careerBoostContent}>
//           <h1 className={styles.careerBoostTitle}>Career Boost</h1>
//           <p className={styles.careerBoostDescription}>
//             Unlock Your Potential With Dedicated Support That Prepares You For Real-World Success!
//           </p>
//         </div>
//       </div>

//       {/* Cards section */}
//       <div className={styles.cardsSection}>
//         <div className={styles.cardsGrid}>
//           {/* First row */}
//           <div
//             ref={el => cardRefs.current[0] = el}
//             className={`${styles.card} ${styles.softSkillsCard}`}
//           >
//             <div
//               ref={el => headerRefs.current[0] = el}
//               className={styles.cardHeader}
//             >
//               <img
//                 ref={el => starRefs.current[0] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar3.svg"
//                 width={20}
//                 height={20}
//                 alt="Soft Star"
//               />
//               <h3 ref={el => headingRefs.current[0] = el}>SOFT SKILLS</h3>
//             </div>
//             <p ref={el => paragraphRefs.current[0] = el}>
//               Enhance your communications and interpersonal skills.
//             </p>
//           </div>

//           <div
//             ref={el => cardRefs.current[1] = el}
//             className={styles.card}
//           >
//             <div
//               ref={el => headerRefs.current[1] = el}
//               className={styles.cardHeader}
//             >
//               <img
//                 ref={el => starRefs.current[1] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar3.svg"
//                 width={40}
//                 height={40}
//                 alt="Soft Star"
//               />
//               <h3 ref={el => headingRefs.current[1] = el}>MOCK INTERVIEWS</h3>
//             </div>
//             <p ref={el => paragraphRefs.current[1] = el}>
//               Prepare for interviews with realistic practice sessions.
//             </p>
//           </div>

//           <div
//             ref={el => cardRefs.current[2] = el}
//             className={styles.card}
//           >
//             <div
//               ref={el => headerRefs.current[2] = el}
//               className={styles.cardHeader}
//             >
//               <img
//                 ref={el => starRefs.current[2] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar3.svg"
//                 width={20}
//                 height={20}
//                 alt="Soft Star"
//               />
//               <h3 ref={el => headingRefs.current[2] = el}>PORTFOLIO BUILDING</h3>
//             </div>
//             <p ref={el => paragraphRefs.current[2] = el}>
//               Create a standout portfolio that showcases your skills.
//             </p>
//           </div>

//           {/* Second row */}
//           <div
//             ref={el => cardRefs.current[3] = el}
//             className={styles.card}
//           >
//             <div
//               ref={el => headerRefs.current[3] = el}
//               className={styles.cardHeader}
//             >
//               <img
//                 ref={el => starRefs.current[3] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar3.svg"
//                 width={20}
//                 height={20}
//                 alt="Soft Star"
//               />
//               <h3 ref={el => headingRefs.current[3] = el}>RESUME BUILDING</h3>
//             </div>
//             <p ref={el => paragraphRefs.current[3] = el}>
//               Boost confidence with realistic, interview-style practice.
//             </p>
//           </div>

//           <div
//             ref={el => cardRefs.current[4] = el}
//             className={styles.card}
//           >
//             <div
//               ref={el => headerRefs.current[4] = el}
//               className={styles.cardHeader}
//             >
//               <img
//                 ref={el => starRefs.current[4] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar3.svg"
//                 width={40}
//                 height={40}
//                 alt="Soft Star"
//               />
//               <h3 ref={el => headingRefs.current[4] = el}>MOCK TESTS</h3>
//             </div>
//             <p ref={el => paragraphRefs.current[4] = el}>
//               Build a professional resume that highlights your strength.
//             </p>
//           </div>

//           <div
//             ref={el => cardRefs.current[5] = el}
//             className={styles.card}
//           >
//             <div
//               ref={el => headerRefs.current[5] = el}
//               className={styles.cardHeader}
//             >
//               <img
//                 ref={el => starRefs.current[5] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar3.svg"
//                 width={40}
//                 height={40}
//                 alt="Soft Star"
//               />
//               <h3 ref={el => headingRefs.current[5] = el}>INTERVIEW GUIDANCE</h3>
//             </div>
//             <p ref={el => paragraphRefs.current[5] = el}>
//               Ace your interview with targeted guidance and support.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'
import { useRef, useEffect } from 'react';
import styles from './styles/CardsSection.module.scss'

export default function CardsSection() {
  const starRefs = useRef([]);
  const cardRefs = useRef([]);
  const headerRefs = useRef([]);
  const paragraphRefs = useRef([]);
  const headingRefs = useRef([]);

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
              Build a professional resume that highlights your strengths.
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
              Boost confidence with realistic, test-style practice.
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
  )
}