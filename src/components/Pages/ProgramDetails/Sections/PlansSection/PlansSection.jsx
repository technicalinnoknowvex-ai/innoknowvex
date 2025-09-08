"use client";
import styles from "./styles/plansSection.module.scss";
import Image from "next/image";

export default function PlansSection() {
  return (
    <div id="plans-section" className={styles.plansContainer}>
      <div className={styles.Plans}>
        <div className={styles.alignHeading}>
          <Image
            src="/images/SoftStar.svg"
            width={50}
            height={50}
            alt="Soft Star"
            className={styles.starOrange}
          />
          <h1>Plans to fit your Learning needs</h1>
        </div>
        <p>CHOOSE THAT FITS YOU</p>
      </div>

      <div className={styles.pricingCardLayout}>
        <Image src="/images/Ellipse4.svg"
        width={60} 
        height={60} 
         alt="" className={styles.ellipse} />

        <div className={styles.pricingCards}>
          <div className={styles.heading}>
            <Image
              src="/images/SoftStar3.svg"
              width={20}
              height={20}
              alt="Soft Star"
              className={styles.cardStar}
            />
            <h2>Self</h2>
          </div>

          <p className={styles.price}> Rs 5,999</p>
          <p className={styles.planDesc}>
            Learn at your own pace with all the resources you need to succeed
            independently.
          </p>
          <button>Enroll Now</button>

          <div className={styles.plancontent}>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Recorded session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                 width={20}
                height={20}
                className={styles.featureimg}
              />
              Hand-on internship
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                 width={20}
                height={20}
                className={styles.featureimg}
              />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Certification
            </div>
            <div className={styles.features}>
            <Image
                src="/images/redcross.svg"
                alt=" Cross"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Doubt Clearing
            </div>
            <div className={styles.features}>
             <Image
                src="/images/redcross.svg"
                alt=" Cross"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Live Session
            </div>
            <div className={styles.features}>
             <Image
                src="/images/redcross.svg"
                alt=" Cross"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Mentor Guidance
            </div>
            <div className={styles.features}>
            <Image
                src="/images/redcross.svg"
                alt=" Cross"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Placement
            </div>
            <div className={styles.features}>
            <Image
                src="/images/redcross.svg"
                alt=" Cross"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Mock Interview
            </div>
          </div>
        </div>

        <div className={styles.pricingCards}>
          <div className={styles.heading}>
            <Image
              src="/images/SoftStar3.svg"
              width={20}
              height={20}
              alt="Soft Star"
              className={styles.cardStar}
            />
            <h2>Mentor</h2>
          </div>

          <p className={styles.price}> Rs 8,999</p>
          <p className={styles.planDesc}>
            Learn at your own pace with all the resources you need to succeed
            independently.
          </p>
          <button>Enroll Now</button>

          <div className={styles.plancontent}>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              <p className={styles.featuresDesc}>Recorded session</p>
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Hand-on internship
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Certification
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Live Session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <Image
                src="/images/redcross.svg"
                alt=" Cross"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Placement
            </div>
            <div className={styles.features}>
             <Image
                src="/images/redcross.svg"
                alt=" Cross"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Mock Interview
            </div>
          </div>
        </div>

        <div className={styles.pricingCards}>
          <div className={styles.heading}>
            <Image
              src="/images/SoftStar3.svg"
              width={20}
              height={20}
              alt="Soft Star"
              className={styles.cardStar}
            />
            <h2>Professional</h2>
          </div>

          <p className={styles.price}> Rs 11,999</p>
          <p className={styles.planDesc}>
            Learn at your own pace with all the resources you need to succeed
            independently.
          </p>
          <button>Enroll Now</button>

          <div className={styles.plancontent}>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Recorded session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Hand-on internship
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Certification
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Live Session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Placement
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt=" tick"
                height={20}
                  width={20}
                className={styles.featureimg}
              />
              Mock Interview
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
