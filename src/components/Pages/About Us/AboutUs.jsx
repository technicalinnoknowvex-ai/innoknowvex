'use client';

import style from './styles/about.module.scss';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

export default function AboutUs() {

    const textRef = useRef(null);
    const imageRef = useRef(null);

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

        return () => {
            if (textRef.current) observer.unobserve(textRef.current);
            if (imageRef.current) observer.unobserve(imageRef.current);
        };
    }, []);
    return (<div className={style.content}>
        <div ref={textRef} className={style.content__text}>
            <b>About Us</b>
            <p>

                GET TO KNOW US BETTER <br />
                Innoknowvex is a cutting-edge EdTech platform designed to seamlessly 
                 connect students  with internships, professional training, career development, 
                 and expert mentorship. Our mission is to bridge the gap between academic 
                 education and industry requirements by providing students with access to
                  industry-relevant programs hands-on training, and specialized mentorship. 
                  Through a structured, expert-driven approach, we empower aspiring professionals 
                  with the practical skills and industry insights necessary to excel in their chosen fields.
            </p>
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