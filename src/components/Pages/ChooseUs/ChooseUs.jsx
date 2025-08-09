
'use client';
import Image from 'next/image';
import styles from './styles/styles.module.scss';
import React, { useEffect, useRef } from 'react';

export default function Chooseus() {
    const textRef = useRef(null);
    const starRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

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

        if (textRef.current) observer.observe(textRef.current);
        if (starRef.current) observer.observe(starRef.current);
        if (titleRef.current) observer.observe(titleRef.current);
        if (subtitleRef.current) observer.observe(subtitleRef.current);

        return () => {
            if (textRef.current) observer.unobserve(textRef.current);
            if (starRef.current) observer.unobserve(starRef.current);
            if (titleRef.current) observer.unobserve(titleRef.current);
            if (subtitleRef.current) observer.unobserve(subtitleRef.current);
        };
    }, []);

    return (
        <div className={styles.chooseUsPage}>
            <div className={styles.ellipseContainer}>
                <Image
                    src='/images/Ellipse4.svg'
                    width={400}
                    height={400}
                    alt="Background ellipse"
                    className={styles.ellipse}
                />
            </div>
            
            <div className={styles.content}>
                <div className={styles.content__text}>
                    <Image
                        ref={starRef}
                        className={styles.content__img}
                        src="/images/SoftStar.svg"
                        width={60}
                        height={60}
                        alt="Soft Star"
                    />
                    <div ref={textRef} className={styles.content__textContent}>
                        <h1 ref={titleRef}>Why choose Us</h1>
                        <b ref={subtitleRef}>WHAT MAKES OUR COURSES STAND OUT</b>
                        <p>
                            We're more than just a platform — we're a learning ecosystem 
                            designed to help you thrive. From live classes and hands-on 
                            projects to personalized support and a vibrant community.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}