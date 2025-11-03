// "use client";
// import React, { useRef } from "react";
// import heroStyles from "./styles/hero.module.scss";
// import Marquee from "./Marquee/Marquee";
// import CircularText from "./RotatingRing/CircularText";
// import { useCursor } from "@/hooks/useCursor";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { MouseParallax, ScrollParallax } from "react-just-parallax";
// import Sparkle from "@/components/Common/Icons/Sparkle";

// const Hero = ({ scrollContainerRef }) => {
//   const { resetCursor, transformCursor } = useCursor();
//   const heroRef = useRef(null);
//   const h1Refs = useRef([]);
//   const sparkleOneRef = useRef(null);
//   const sparkleTwoRef = useRef(null);

//   useGSAP(
//     () => {
//       const tl = gsap.timeline();

//       // Animate h1 elements
//       tl.to(h1Refs.current, {
//         y: 0,
//         opacity: 1,
//         duration: 1.5,
//         ease: "expo.out",
//         stagger: 0,
//       })
//         // Use .to() instead of chaining to ensure immediate start after h1 completion
//         .to(
//           [sparkleOneRef.current, sparkleTwoRef.current],
//           {
//             scale: 1,
//             opacity: 1,
//             duration: 0.5,
//             ease: "back.out(1.7)",
//             stagger: 0.2,
//           },
//           "-=1"
//         );
//     },
//     { scope: heroRef }
//   );

//   // Store refs for each h1
//   const setH1Ref = (el, index) => {
//     h1Refs.current[index] = el;
//   };

//   return (
//     <section className={heroStyles.hero} ref={heroRef}>
//       <div className={heroStyles.heroTextWrapper}>
//         <div className={heroStyles.gradientSpot}></div>
//         <div className={heroStyles.textContainer}>
//           <ScrollParallax
//             scrollContainerRef={scrollContainerRef}
//             isAbsolutelyPositioned
//           >
//             <MouseParallax isAbsolutelyPositioned strength={0.02} zIndex={2}>
//               <div className={heroStyles.sparkleOne}>
//                 <div
//                   ref={sparkleOneRef}
//                   style={{ transform: "scale(0)", opacity: 0 }}
//                 >
//                   <Sparkle />
//                 </div>
//               </div>
//             </MouseParallax>
//           </ScrollParallax>
//           <div className={heroStyles.textContainer__textDiv}>
//             <h1
//               ref={(el) => setH1Ref(el, 0)}
//               style={{ transform: "translateY(50%)", opacity: 0 }}
//             >
//               Transforming
//             </h1>
//           </div>
//           <div className={heroStyles.textContainer__textDiv}>
//             <h1
//               ref={(el) => setH1Ref(el, 1)}
//               style={{ transform: "translateY(50%)", opacity: 0 }}
//             >
//               Aspirations
//             </h1>
//           </div>
//           <div className={heroStyles.textContainer__textDiv}>
//             <h1
//               ref={(el) => setH1Ref(el, 2)}
//               style={{ transform: "translateY(50%)", opacity: 0 }}
//             >
//               into
//             </h1>
//           </div>
//           <div className={heroStyles.textContainer__textDiv}>
//             <h1
//               ref={(el) => setH1Ref(el, 3)}
//               style={{ transform: "translateY(50%)", opacity: 0 }}
//             >
//               Achievements
//             </h1>
//           </div>
//           <ScrollParallax
//             scrollContainerRef={scrollContainerRef}
//             isAbsolutelyPositioned
//           >
//             <MouseParallax isAbsolutelyPositioned strength={0.03} zIndex={2}>
//               <div className={heroStyles.sparkleTwo}>
//                 <div
//                   ref={sparkleTwoRef}
//                   style={{ transform: "scale(0)", opacity: 0 }}
//                 >
//                   <Sparkle />
//                 </div>
//               </div>
//             </MouseParallax>
//           </ScrollParallax>
//         </div>
//       </div>
//       <div className={heroStyles.scrollWheelWrapper}>
//         <CircularText text={"SCROLL TO EXPLORE • SCROLL TO EXPLORE • "} />
//       </div>
//       <Marquee />
//     </section>
//   );
// };

// export default Hero;



"use client";
import React, { useRef } from "react";
import heroStyles from "./styles/hero.module.scss";
import Marquee from "./Marquee/Marquee";
import CircularText from "./RotatingRing/CircularText";
import { useCursor } from "@/hooks/useCursor";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { MouseParallax, ScrollParallax } from "react-just-parallax";
import Sparkle from "@/components/Common/Icons/Sparkle";

const Hero = ({ scrollContainerRef }) => {
  const { resetCursor, transformCursor } = useCursor();
  const heroRef = useRef(null);
  const h1Refs = useRef([]);
  const sparkleOneRef = useRef(null);
  const sparkleTwoRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // REMOVED: h1 animation (was causing 2.5s LCP delay)
      // ONLY animate sparkles now
      tl.to(
        [sparkleOneRef.current, sparkleTwoRef.current],
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(1.7)",
          stagger: 0.2,
        }
      );
    },
    { scope: heroRef }
  );

  // Store refs for each h1 (keeping for potential future use)
  const setH1Ref = (el, index) => {
    h1Refs.current[index] = el;
  };

  return (
    <section className={heroStyles.hero} ref={heroRef}>
      <div className={heroStyles.heroTextWrapper}>
        <div className={heroStyles.gradientSpot}></div>
        <div className={heroStyles.textContainer}>
          <ScrollParallax
            scrollContainerRef={scrollContainerRef}
            isAbsolutelyPositioned
          >
            <MouseParallax isAbsolutelyPositioned strength={0.02} zIndex={2}>
              <div className={heroStyles.sparkleOne}>
                <div
                  ref={sparkleOneRef}
                  style={{ transform: "scale(0)", opacity: 0 }}
                >
                  <Sparkle />
                </div>
              </div>
            </MouseParallax>
          </ScrollParallax>
          
          {/* REMOVED: transform and opacity styles from h1 elements */}
          {/* Now they render immediately as LCP element */}
          <div className={heroStyles.textContainer__textDiv}>
            <h1 ref={(el) => setH1Ref(el, 0)}>
              Transforming
            </h1>
          </div>
          <div className={heroStyles.textContainer__textDiv}>
            <h1 ref={(el) => setH1Ref(el, 1)}>
              Aspirations
            </h1>
          </div>
          <div className={heroStyles.textContainer__textDiv}>
            <h1 ref={(el) => setH1Ref(el, 2)}>
              into
            </h1>
          </div>
          <div className={heroStyles.textContainer__textDiv}>
            <h1 ref={(el) => setH1Ref(el, 3)}>
              Achievements
            </h1>
          </div>
          
          <ScrollParallax
            scrollContainerRef={scrollContainerRef}
            isAbsolutelyPositioned
          >
            <MouseParallax isAbsolutelyPositioned strength={0.03} zIndex={2}>
              <div className={heroStyles.sparkleTwo}>
                <div
                  ref={sparkleTwoRef}
                  style={{ transform: "scale(0)", opacity: 0 }}
                >
                  <Sparkle />
                </div>
              </div>
            </MouseParallax>
          </ScrollParallax>
        </div>
      </div>
      <div className={heroStyles.scrollWheelWrapper}>
        <CircularText text={"SCROLL TO EXPLORE • SCROLL TO EXPLORE • "} />
      </div>
      <Marquee />
    </section>
  );
};

export default Hero;