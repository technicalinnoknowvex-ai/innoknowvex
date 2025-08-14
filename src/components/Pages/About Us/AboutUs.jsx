'use client';

import style from './styles/about.module.scss';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react';

export default function AboutUs() {
    

    return (
       <div className={style.content}>
        <div>
            <h1 className={style.heading}>About Us</h1> <br />
                    <b className={style.subheading}> GET TO KNOW US BETTER </b>
                    <p className={style.description}>
                        Innoknowvex is a cutting-edge EdTech platform designed to seamlessly
                        connect students with internships, professional training, career development,
                        and expert mentorship. Our mission is to bridge the gap between academic
                        education and industry requirements by providing students with access to
                        industry-relevant programs hands-on training, and specialized mentorship.
                        Through a structured, expert-driven approach, we empower aspiring professionals
                        with the practical skills and industry insights necessary to excel in their chosen fields.
                    </p>
        </div>
        <div>
            <Image
                src='/images/aboutusimg.png'
                width={300}
                height={300}
                alt="about us image"
            />
        </div>
       </div>
    );
}



// ye code anshuman ne likha tha , isko neeche lake rakha hai reference ke liye taki chnages karke phir se likh saku 
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
                    className={style.content__img}
                    src="/images/SoftStar.svg"
                    width={60}
                    height={60}
                    alt="Soft Star"
                />
                <div  className={style.content__textContent}>
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
                src='/images/aboutusimg.png'
                width={300}
                height={300}
                alt="about us image"
            />
        </div>
