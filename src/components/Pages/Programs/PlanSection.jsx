'use client'
import styles from './styles/PlansSection.module.scss'

export default function PlansSection() {
  return (
    <div className={styles.plansContainer}>
      <div className={styles.Plans}>
        <div className={styles.alignHeading}>
          <img src="/images/SoftStar.svg"
            width={50}
            height={50}
            alt="Soft Star"
            className={styles.starOrange}
          />
        <div className={styles.staralign}>
          
          <h1>Plans to fit your Learning needs</h1>
        </div>
        </div>
        


        <p>CHOOSE THAT FITS YOU</p>
      </div>


      <div className={styles.pricingCardLayout}>
        <img src="/images/Ellipse4.svg"
          alt=""
          className={styles.ellipse} />
        <div className={styles.pricingCards}>
          <div className={styles.heading}>
            <img src="/images/SoftStar3.svg"
              width={20}
              height={20}
              alt="Soft Star"
              className={styles.cardStar} />
            <h1>Self</h1>
          </div>

          <p className={styles.price}> Rs 5,999</p>
          <p className={styles.planDesc}>Learn at your own pace with all the resources you need to succeed independently.</p>
          <button>Enroll Now</button>

          <p className={styles.plancontent}>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Recorded sesion </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />Hand-on internship
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Certification
            </div>
            <div className={styles.features}>
              <img src="/images/redcross.svg" alt=" Cross" className={styles.featureimg} />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <img src="/images/redcross.svg" alt=" Cross" className={styles.featureimg} />
              Live Session
            </div>
            <div className={styles.features}>
              <img src="/images/redcross.svg" alt=" Cross" className={styles.featureimg} />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <img src="/images/redcross.svg" alt=" Cross" className={styles.featureimg} />
              Placement
            </div>
            <div className={styles.features}>
              <img src="/images/redcross.svg" alt=" Cross" className={styles.featureimg} />
              Mock Interview
            </div>
          </p>
        </div>

        <div className={styles.pricingCards}>
          <div className={styles.heading}>
            <img src="/images/SoftStar3.svg"
              width={20}
              height={20}
              alt="Soft Star"
              className={styles.cardStar} />
            <h1>Mentor</h1>
          </div>

          <p className={styles.price}> Rs 8,999</p>
          <p className={styles.planDesc}>Learn at your own pace with all the resources you need to succeed independently.</p>
          <button>Enroll Now</button>

          <p className={styles.plancontent}>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Recorded sesion </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />Hand-on internship
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Certification
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Live Session
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <img src="/images/redcross.svg" alt=" Cross" className={styles.featureimg} />
              Placement
            </div>
            <div className={styles.features}>
              <img src="/images/redcross.svg" alt=" Cross" className={styles.featureimg} />
              Mock Interview
            </div>
          </p>
        </div>

        <div className={styles.pricingCards}>
          <div className={styles.heading}>
            <img src="/images/SoftStar3.svg"
              width={20}
              height={20}
              alt="Soft Star"
              className={styles.cardStar} />
            <h1>Professional</h1>
          </div>

          <p className={styles.price}> Rs 11,999</p>
          <p className={styles.planDesc}>Learn at your own pace with all the resources you need to succeed independently.</p>
          <button>Enroll Now</button>

          <p className={styles.plancontent}>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Recorded sesion </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />Hand-on internship
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Certification
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Live Session
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Placement
            </div>
            <div className={styles.features}>
              <img src="/images/greentick.svg" alt=" tick" className={styles.featureimg} />
              Mock Interview
            </div>
          </p>
        </div>
      </div>
    </div>)
}