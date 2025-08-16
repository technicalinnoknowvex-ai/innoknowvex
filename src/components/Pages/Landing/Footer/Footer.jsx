
import styles from './styles/styles.module.scss'
import Link from 'next/link';

export default function Footer() {
    return (
        <div className={styles.layout}>
            {/* Left Column */}
            <div className={styles.leftColumn}>
                <div className={styles.ContactUs}>
                    <img
                        src="./images/SoftStar2.svg"
                        alt="star"
                        width={30}
                        height={30}
                    />
                    <h1>Contact Us.</h1>
                    <b>GET IN TOUCH</b>

                    <p className={styles.sendmsg}>Send a Message</p>

                    <div className={styles.mail}>
                        <img src="./images/mail.svg" alt="mail" width={20} height={20} />
                        <a href="mailto:innoknowvex@gmail.com">innoknowvex@gmail.com</a>
                    </div>

                    <div className={styles.address}>
                        <b>ADDRESS</b>
                        <p>Hustlehub SB01, WJ8G+XWP,<br />
                            1st Cross Road, Santhosapuram, 1st Block Koramangala,
                            <br /> HSR Layout 5th Sector, Bengaluru, Karnataka 560034</p>
                    </div>
                </div>

                <div className={styles.socailMedia}>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src="./images/fb.svg" alt="Facebook" width={25} height={25} />
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                        <img src="./images/insta.svg" alt="Instagram" width={25} height={25} />
                    </a>
                    <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
                        <img src="./images/linkedin.svg" alt="LinkedIn" width={25} height={25} />
                    </a>
                    <a href="https://www.youtube.com/" target="_blank" rel="noopener noreferrer">
                        <img src="./images/yt.svg" alt="YouTube" width={25} height={25} />
                    </a>
                </div>
            </div>

            {/* Right Column */}
            <div className={styles.rightColumn}>
                {/* Links Section */}
                <div className={styles.linksSection}>
                    <h2>LINKS</h2>
                    <div className={styles.linkItems}>
                        <Link href="#">About Us</Link>
                        <Link href="#">Programs</Link>
                        <Link href="#">Blog</Link>
                        <Link href="#">Testimonials</Link>
                    </div>
                </div>

                {/* Programs Section */}
                <div className={styles.programsSection}>
                    <h2>OUR PROGRAMS</h2>
                    <div className={styles.programsGrid}>
                        <div className={styles.linkItems}>
                            <Link href="/courses/web-development">Web Development</Link>
                            <Link href="#">Android Development</Link>
                            <Link href="#">Python Programming</Link>
                            <Link href="#">Java & DSA</Link>
                            <Link href="#">Machine Learning</Link>
                            <Link href="#">Artificial Intelligence</Link>
                            <Link href="#">Cloud Computing</Link>
                            <Link href="#">Cyber security</Link>
                            <Link href="#">Data Science</Link>
                            <Link href="#">Nanotechnology</Link>
                            <Link href="#">Embedded Systems</Link>
                            <Link href="#">Internet of Things (IOT)</Link>
                            <Link href="#">Hybrid Electric Vehicles</Link>
                            <Link href="#">VLSI</Link>
                        </div>
                        <div className={styles.linkItems}>
                            <Link href="#">Fashion Designing</Link>
                            <Link href="#">UI/UX</Link>
                             <div className={styles.divider} />
                            <Link href="#">Psychology</Link>
                            <Link href="#">Medical Coding</Link>
                            <div className={styles.divider} />
                            <Link href="#">Digital Marketing</Link>
                            <Link href="#">Business Analytics</Link>
                            <Link href="#">Finance</Link>
                            <Link href="#">Stock Trading</Link>
                            <Link href="#">Human Resources</Link>
                            <Link href="#">Corporate Law</Link>
                            <h2>ADVANCED PROGRAMS</h2>
                            <Link href="#">Advanced Data Science</Link>
                            <Link href="#">Advanced Web Development</Link>
                        </div>
                    </div>
                </div>
            </div>


            <div className={styles.companyName}>

                <h1>INNOKNOWVEX</h1>
            </div>

            {/* Footer Bottom */}
            <div className={styles.footerBottom}>

                <div>All rights reserved 2025 © 2025 Lift Media Online S.L.</div>
                <div className={styles.legalLinks}>
                    <Link href="#">Privacy Policy</Link>
                    <Link href="#">Payments & Refund</Link>
                    <Link href="#">Terms of Service</Link>
                </div>
            </div>
        </div>
    )
}