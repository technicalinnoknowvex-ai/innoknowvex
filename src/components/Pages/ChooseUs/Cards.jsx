
// 'use client';
// import Image from 'next/image';
// import styles from './styles/cards.module.scss';
// import { useRef, useEffect } from 'react';

// export default function Cards() {
//   const starRefs = useRef([]);
//   const cardRefs = useRef([]);
//   const headerRefs = useRef([]);

//   // Initialize ref arrays
//   useEffect(() => {
//     starRefs.current = starRefs.current.slice(0, 6);
//     cardRefs.current = cardRefs.current.slice(0, 6);
//     headerRefs.current = headerRefs.current.slice(0, 6);
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

//     // Observe all cards and their elements
//     cardRefs.current.forEach((card) => {
//       if (card) observer.observe(card);
//     });
//     starRefs.current.forEach((star) => {
//       if (star) observer.observe(star);
//     });
//     headerRefs.current.forEach((header) => {
//       if (header) observer.observe(header);
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
//     };
//   }, []);

//   return (
//     <div className={styles.cardsContainer}>
//       {/* Empty left section (1/3 of screen) */}
//       <div className={styles.leftSection}></div>

//       {/* Cards section (remaining 2/3 of screen) */}
//       <div className={styles.cardsSection}>
//         {/* Cards grid */}
//         <div className={styles.cardsGrid}>
//           {/* First row */}
//           <div 
//             ref={el => cardRefs.current[0] = el}
//             className={`${styles.card} ${styles.firstCard}`}
//           >
//             <div 
//               ref={el => headerRefs.current[0] = el}
//               className={styles.cardHeader}
//             >
//               <Image
//                 ref={el => starRefs.current[0] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar.svg"
//                 width={40}
//                 height={40}
//                 alt="Soft Star"
//               />
//               <h3>Innovative Approach</h3>
//             </div>
//             <p>Cutting-edge curriculum designed by industry experts with real-world applications</p>
//           </div>
          
//           <div 
//             ref={el => cardRefs.current[1] = el}
//             className={styles.card}
//           >
//             <div 
//               ref={el => headerRefs.current[1] = el}
//               className={styles.cardHeader}
//             >
//               <Image
//                 ref={el => starRefs.current[1] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar.svg"
//                 width={40}
//                 height={40}
//                 alt="Soft Star"
//               />
//               <h3>Hands-on Learning</h3>
//             </div>
//             <p>Practical projects and real-world applications that prepare you for industry challenges</p>
//           </div>
          
//           <div 
//             ref={el => cardRefs.current[2] = el}
//             className={styles.card}
//           >
//             <div 
//               ref={el => headerRefs.current[2] = el}
//               className={styles.cardHeader}
//             >
//               <Image
//                 ref={el => starRefs.current[2] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar.svg"
//                 width={40}
//                 height={40}
//                 alt="Soft Star"
//               />
//               <h3>Expert Mentors</h3>
//             </div>
//             <p>Learn from professionals with years of experience in their respective fields</p>
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
//               <Image
//                 ref={el => starRefs.current[3] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar.svg"
//                 width={40}
//                 height={40}
//                 alt="Soft Star"
//               />
//               <h3>Career Support</h3>
//             </div>
//             <p>Dedicated career services and job placement assistance for all students</p>
//           </div>
          
//           <div 
//             ref={el => cardRefs.current[4] = el}
//             className={styles.card}
//           >
//             <div 
//               ref={el => headerRefs.current[4] = el}
//               className={styles.cardHeader}
//             >
//               <Image
//                 ref={el => starRefs.current[4] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar.svg"
//                 width={40}
//                 height={40}
//                 alt="Soft Star"
//               />
//               <h3>Flexible Learning</h3>
//             </div>
//             <p>Study at your own pace with our adaptable learning schedules</p>
//           </div>
          
//           <div 
//             ref={el => cardRefs.current[5] = el}
//             className={styles.card}
//           >
//             <div 
//               ref={el => headerRefs.current[5] = el}
//               className={styles.cardHeader}
//             >
//               <Image
//                 ref={el => starRefs.current[5] = el}
//                 className={styles.starImage}
//                 src="/images/SoftStar.svg"
//                 width={40}
//                 height={40}
//                 alt="Soft Star"
//               />
//               <h3>Community</h3>
//             </div>
//             <p>Network with peers and professionals in our vibrant learning community</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import Image from 'next/image';
import styles from './styles/cards.module.scss';
import { useRef, useEffect } from 'react';

export default function Cards() {
  const starRefs = useRef([]);
  const cardRefs = useRef([]);
  const headerRefs = useRef([]);

  // Initialize ref arrays
  useEffect(() => {
    starRefs.current = starRefs.current.slice(0, 6);
    cardRefs.current = cardRefs.current.slice(0, 6);
    headerRefs.current = headerRefs.current.slice(0, 6);
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

    // Observe all cards and their elements
    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card);
    });
    starRefs.current.forEach((star) => {
      if (star) observer.observe(star);
    });
    headerRefs.current.forEach((header) => {
      if (header) observer.observe(header);
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
              <h3>CLASSES</h3>
            </div>
            <p>Each activity is one of the most important events that will contribute to our business. We have been working with people who are able to work on their own and to empower them to grow our business.</p>
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
              <h3>INTERVIEW TRAINING</h3>
            </div>
            <p>Ideal for front-line through social activities, professional leadership, and expert feedback—any online technology project provided, or other information on all real-world experiences.</p>
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
              <h3>LINKEDIN & RESUME BUILDING</h3>
            </div>
            <p>Review personalized experience across a particular team. Just right, our achievements, our career and we'd try to showcase our living strategies.</p>
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
              <h3>PASSIONATE COMMUNITY</h3>
            </div>
            <p>Join our next-generation creative communities of peers, friends, and family members to deliver new collaborative partnerships and creative opportunities after online learning journey.</p>
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
              <h3>SUPPORT & ASSISTANCE</h3>
            </div>
            <p>Our dedicated team supports productivity and efficiency—helping play the objectives, photography, knowledge and content practices that create solutions.</p>
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
              <h3>ACCESS TO CONTENT</h3>
            </div>
            <p>Select your team across its diverse forms and links with stakeholders. Stay close with an external culture, open growing public space, increasing awareness to industry leaders.</p>
          </div>
        </div>
      </div>
    </div>
  );
}