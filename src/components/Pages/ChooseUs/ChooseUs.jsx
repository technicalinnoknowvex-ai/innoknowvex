// import Image from 'next/image';
// import styles from './styles/styles.scss'

// export default function Chooseus() {
//     return (
//         <div className={styles.content}>

//             <Image
//                 // ref={starRef}
//                 // className={style.content__img}
//                 src="/images/SoftStar.svg"
//                 width={60}
//                 height={60}
//                 alt="Soft Star"
//             />

//             <b>Why choose Us</b>
//             <h2>What makes our courses stand out.</h2>
//             <p>We’re more than just a platform — we’re a learning
//                 ecosystem designed to help you thrive. From live
//                 classes and hands-on projects to personalized support
//                 and a vibrant community, every feature we offer is built
//                 to make your learning journey engaging, effective, and future-ready.</p>
//         </div>

//     );

// }


import Image from 'next/image';
import styles from './styles/styles.scss';

export default function Chooseus() {
    return (
        <div className={styles.pageContainer}>
            <div className={styles.content}>
                <div className={styles.textSection}>
                    <Image
                        src="/images/SoftStar.svg"
                        width={60}
                        height={60}
                        alt="Soft Star"
                        className={styles.starImage}
                    />

                    <b className={styles.subtitle}>Why choose Us</b>
                    <h2 className={styles.title}>What makes our courses stand out.</h2>
                    <p className={styles.description}>We're more than just a platform — we're a learning
                        ecosystem designed to help you thrive. From live
                        classes and hands-on projects to personalized support
                        and a vibrant community, every feature we offer is built
                        to make your learning journey engaging, effective, and future-ready.</p>
                </div>

                <div className={styles.boxesSection}>
                    {/* Row 1 */}
                    <div className={`${styles.featureBox} ${styles.orangeBox}`}>
                        <h3 className={styles.boxTitle}>Title 1</h3>
                        <p className={styles.boxContent}>Content for feature 1 goes here</p>
                    </div>
                    <div className={styles.featureBox}>
                        <h3 className={styles.boxTitle}>Title 2</h3>
                        <p className={styles.boxContent}>Content for feature 2 goes here</p>
                    </div>
                    <div className={styles.featureBox}>
                        <h3 className={styles.boxTitle}>Title 3</h3>
                        <p className={styles.boxContent}>Content for feature 3 goes here</p>
                    </div>

                    {/* Row 2 */}
                    <div className={styles.featureBox}>
                        <h3 className={styles.boxTitle}>Title 4</h3>
                        <p className={styles.boxContent}>Content for feature 4 goes here</p>
                    </div>
                    <div className={styles.featureBox}>
                        <h3 className={styles.boxTitle}>Title 5</h3>
                        <p className={styles.boxContent}>Content for feature 5 goes here</p>
                    </div>
                    <div className={styles.featureBox}>
                        <h3 className={styles.boxTitle}>Title 6</h3>
                        <p className={styles.boxContent}>Content for feature 6 goes here</p>
                    </div>
                </div>
            </div>
        </div>
    );
}