import styles from './styles/styles.module.scss'
export default function Footer() {
    return (
        <div className={styles.layout}>
            <img
                src="./images/SoftStar2.svg"
                alt="star"
                width={30}
                height={30}

            />
            <div className={styles.ContactUs}>
                <h1>Contact Us.</h1>
                <b>GET IN TOUCH</b>
                <br />
                <br />

                <p className={styles.sendmsg}>Send a Message</p>


                <div className={styles.mail}>
                    <img src="./images/mail.svg" alt="mail" width={20} height={20} />
                    <p>innoknowvex@gmail.com</p>
                </div>
                <div className={styles.address}>
                    <b>ADDRESS</b>
                    <p>Hustlehub SB01, WJ8G+XWP,<br />
                        1st Cross Road, Santhosapuram, 1st Block Koramangala,
                        <br /> HSR Layout 5th Sector, Bengaluru, Karnataka 560034</p>
                </div>



            </div>

            <br />
            <br />

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

            <div className={styles.programs}>

                <h1>Links</h1>
                <div className={styles.linkItems}>
                    <a href="#">About Us</a>
                    <a href="#">Services</a>
                    <a href="#">Blog</a>
                    {/* <a href="#"><Testimonials></Testimonials></a> */}
                </div>



            </div>

        </div>
    )
}