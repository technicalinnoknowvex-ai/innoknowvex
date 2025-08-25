import styles from './styles/KeyHighlights.module.scss'

export default function KeyHighlights({ course }) {
    return (
        <div className={styles.layout}>
            <div className={styles.ellipse}>
                <img
                    src="/images/Ellipse4.svg"
                    alt=""
                    className={styles.ellipse} />
            </div>
            <div className={styles.headingContainer}>
                <img
                    src="/images/SoftStar.svg"
                    alt="Soft Star"
                    className={styles.starOrange}
                />
                <div className={styles.headingText}>
                    <h1>Key Highlights of our</h1>
                    <h1 className={styles.programName}>{course.id}</h1>
                    <h1>program</h1>
                </div>
            </div>

            <div className={styles.skillsContainer}>
                {course.skills && course.skills.map((skill, index) => (
                    <div key={index} className={styles.skillBox}>
                        {skill}
                    </div>
                ))}
            </div>
        </div>
    )
}