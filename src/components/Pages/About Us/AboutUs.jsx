import React from 'react';
import style from './styles/about.module.scss';
import Image from "next/image";
export default function AboutUs() {
    return (
        <div className={style.content}>
            <div className={style.content__text}>
                <b >About Us</b>
                <p>
                    GET TO KNOW US BETTER
 <br />
Innoknowvex is a cutting-edge EdTech platform designed to seamlessly connect students with internships, professional training, career development, and expert mentorship. Our mission is to bridge the gap between academic education and industry requirements by providing students with access to industry-relevant programs hands-on training, and specialized mentorship. Through a structured, expert-driven approach, we empower aspiring professionals with the practical skills and industry insights necessary to excel in their chosen fields.</p>

            </div>

            <Image
                src='/images/aboutusimg.png'
                width={400}
                height={400}
                alt="about us image" />
        </div>
    );
}