import React from "react";
import Image from "next/image";
import styles from "./navbar.module.scss";
import Link from "next/link";

export default function Navbar() {

    return (

        <div 
        
        >
            <Image className={styles.navbar_logo}
                src='images/knowvexLogo2.0.svg'
                width={361}
                height={211} 
                alt='image'/>

            <div className={styles.navbar__link}>
                <Link href="/" > Home</Link>
                <Link href="/" > About</Link>
                <Link href="/" > Programs</Link>
                <Link href="/" > Blogs</Link>
                <Link href="/" > Testimonials</Link>
                <Link href="/" > Contact Us</Link>
                <button className={styles.navbar__link__button}>Get Started</button>
            </div>

        </div>

    );

}


