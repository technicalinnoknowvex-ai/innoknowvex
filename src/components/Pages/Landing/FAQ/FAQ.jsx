
'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './styles/faq.module.scss';
import Image from 'next/image';

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);
  const leftSectionRef = useRef(null);
  const rightSectionRef = useRef(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.visible);
        }
      });
    }, { threshold: 0.1 });

    if (leftSectionRef.current) observer.observe(leftSectionRef.current);
    if (rightSectionRef.current) observer.observe(rightSectionRef.current);

    return () => {
      if (leftSectionRef.current) observer.unobserve(leftSectionRef.current);
      if (rightSectionRef.current) observer.unobserve(rightSectionRef.current);
    };
  }, []);

  const faqs = [
    {
      question: "WHO WILL BE MY MENTOR?",
      answer: "You'll be guided by industry professionals with years of hands-on experience in their respective domains. Our mentors focus on concept clarity, practical knowledge, and personalized support throughout your learning journey."
    },
    {
      question: "CAN I PAY IN EASY MONTHLY INSTALLMENTS?",
      answer: "Yes, we offer flexible payment options including monthly installments. Please contact our support team for more details about our payment plans."
    },
    {
      question: "WHAT PAYMENT METHODS DO YOU ACCEPT?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and in some regions, cryptocurrency payments. All transactions are secure and encrypted."
    },
    {
      question: "WILL I GET A CERTIFICATE AFTER COMPLETING THE COURSE?",
      answer: "Absolutely! Upon successful completion of any course, you'll receive a verifiable digital certificate that you can share on LinkedIn or include in your professional portfolio."
    }
  ];

  return (
    <div className={styles.faqContainer}>
      {/* Left section (1/2 of screen) */}
      <div ref={leftSectionRef} className={styles.leftSection}>
        <div className={styles.leftContent}>
          <div className={styles.headingStar}>
            <Image
              src="/images/SoftStar.svg"
              width={40}
              height={40}
              alt="Star"
              className={styles.titleStar}
            />
            <h1 className={styles.mainHeading}>Frequently asked questions</h1>
          </div>
          <h2 className={styles.subHeading}>WHAT YOU SHOULD KNOW</h2>
          <p className={styles.introText}>
            Got questions? You're not alone. We've gathered the most common (and most important) ones right here to help you get clarity, feel confident, and make the right choice. Whether you're curious, cautious, or just doing your homework — the answers you need are just below.
          </p>
          <div className={styles.starContainer}>
            <Image
              className={styles.starImage}
              src="/images/SoftStar.svg"
              width={80}
              height={80}
              alt="Decorative Star"
            />
          </div>
        </div>
      </div>

      {/* Right section (1/2 of screen) */}
      <div ref={rightSectionRef} className={styles.rightSection}>
        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
            >
              <div 
                className={`${styles.faqQuestion} ${activeIndex === index ? styles.activeQuestion : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                <div className={styles.questionStar}>
                  <Image
                    src="/images/SoftStar.svg"
                    width={24}
                    height={24}
                    alt="Star"
                    className={styles.starIcon}
                  />
                </div>
                <h3>{faq.question}</h3>
              </div>
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}