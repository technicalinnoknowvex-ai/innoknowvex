import styles from './styles/certification.module.scss'
export default function Certification({course}) {
    

    return(
        <div className={styles.layout}>
            <div className={styles.ellipse}>
                 <img src="/images/Ellipse4.svg"
          alt=""
          className={styles.ellipse} />
            </div>
           
            <div className={styles.starImg}>
                 <img src="/images/SoftStar.svg"
            alt="Soft Star"
            className={styles.starOrange}
          />
           <p> Certificate</p>
            </div>
            <h1>Prove What You've Achieved</h1>

            <div className={styles.images}>
                <img src={course.internship}
                    alt="SampleInternshipCertificate" />
                <img src={course.training}
                    alt="SampleTrainingCertificate" />
            </div>

        </div>
    )

};
