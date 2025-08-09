'use client';

import style from './styles/about.module.scss';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

export default function AboutUs() {
    const textRef = useRef(null);
    const imageRef = useRef(null);
    const starRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add(style.visible);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (textRef.current) observer.observe(textRef.current);
        if (imageRef.current) observer.observe(imageRef.current);
        if (starRef.current) observer.observe(starRef.current);

        return () => {
            if (textRef.current) observer.unobserve(textRef.current);
            if (imageRef.current) observer.unobserve(imageRef.current);
            if (starRef.current) observer.unobserve(starRef.current);
        };
    }, []);

    return (
        <div className={style.content}>
            <div className={style.ellipseContainer}>
                <Image
                    src='/images/Ellipse4.svg'
                    width={400}
                    height={400}
                    alt="Background ellipse"
                    className={style.ellipse}
                />
            </div>
            
            <div className={style.content__text}>
                <Image
                    ref={starRef}
                    className={style.content__img}
                    src="/images/SoftStar.svg"
                    width={60}
                    height={60}
                    alt="Soft Star"
                />
                <div ref={textRef} className={style.content__textContent}>
                    <h1>About Us</h1> <br />
                    <b> GET TO KNOW US BETTER </b>
                    <p>
                        Innoknowvex is a cutting-edge EdTech platform designed to seamlessly
                        connect students with internships, professional training, career development,
                        and expert mentorship. Our mission is to bridge the gap between academic
                        education and industry requirements by providing students with access to
                        industry-relevant programs hands-on training, and specialized mentorship.
                        Through a structured, expert-driven approach, we empower aspiring professionals
                        with the practical skills and industry insights necessary to excel in their chosen fields.
                    </p>
                </div>
            </div>

            <Image
                ref={imageRef}
                src='/images/aboutusimg.png'
                width={500}
                height={500}
                alt="about us image"
            />
        </div>
    );
}