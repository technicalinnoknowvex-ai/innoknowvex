"use client";
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from "./styles/plansSection.module.scss";
import Image from "next/image";
import PopUpForm from '../PaymentPopUp/PopUpForm';

export default function PlansSection() {
  const searchParams = useSearchParams();
  const courseName = searchParams.get('course') || 'web-development';
  
  const [pricingData, setPricingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedPlanPrice, setSelectedPlanPrice] = useState(0);

  useEffect(() => {
    async function fetchPricingData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/pricing/${courseName}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch pricing data');
        }
        
        const data = await response.json();
        setPricingData(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching pricing:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPricingData();
  }, [courseName]);

  const handleEnrollClick = (plan, price) => {
    setSelectedPlan(plan);
    setSelectedPlanPrice(price);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedPlan(null);
    setSelectedPlanPrice(0);
  };

  if (loading) {
    return (
      <div id="plans-section" className={styles.plansContainer}>
        <div className={styles.loading}>Loading pricing information...</div>
      </div>
    );
  }

  if (error || !pricingData) {
    return (
      <div id="plans-section" className={styles.plansContainer}>
        <div className={styles.error}>
          <h2>Error Loading Pricing</h2>
          <p>{error || 'No pricing data available'}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div id="plans-section" className={styles.plansContainer}>
      <PopUpForm 
        isOpen={isFormOpen} 
        onClose={closeForm} 
        plan={selectedPlan} 
        course={courseName} 
        price={selectedPlanPrice} 
      />
      
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
        <Image 
          src="/images/Ellipse4.svg"
          width={60} 
          height={60} 
          alt="" 
          className={styles.ellipse} 
        />

        {/* Self Plan */}
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

          <p className={styles.price}>
            Rs {pricingData.self_current_price}
            <span className={styles.originalPrice}>Rs {pricingData.self_actual_price}</span>
          </p>
          <p className={styles.planDesc}>
            Learn at your own pace with all the resources you need to succeed
            independently.
          </p>
          <button onClick={() => handleEnrollClick('Self', pricingData.self_current_price)}>Enroll Now</button>

          <div className={styles.plancontent}>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Recorded session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hand-on internship
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Certification
            </div>
            <div className={styles.features}>
              <Image
                src="/images/redcross.svg"
                alt="Cross"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <Image
                src="/images/redcross.svg"
                alt="Cross"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Live Session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/redcross.svg"
                alt="Cross"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <Image
                src="/images/redcross.svg"
                alt="Cross"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Placement
            </div>
            <div className={styles.features}>
              <Image
                src="/images/redcross.svg"
                alt="Cross"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Mock Interview
            </div>
          </div>
        </div>

        {/* Mentor Plan */}
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

          <p className={styles.price}>
            Rs {pricingData.mentor_current_price}
            <span className={styles.originalPrice}>Rs {pricingData.mentor_actual_price}</span>
          </p>
          <p className={styles.planDesc}>
            Learn at your own pace with all the resources you need to succeed
            independently.
          </p>
          <button onClick={() => handleEnrollClick('Mentor', pricingData.mentor_current_price)}>Enroll Now</button>

          <div className={styles.plancontent}>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Recorded session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hand-on internship
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Certification
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Live Session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <Image
                src="/images/redcross.svg"
                alt="Cross"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Placement
            </div>
            <div className={styles.features}>
              <Image
                src="/images/redcross.svg"
                alt="Cross"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Mock Interview
            </div>
          </div>
        </div>

        {/* Professional Plan */}
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

          <p className={styles.price}>
            Rs {pricingData.professional_current_price}
            <span className={styles.originalPrice}>Rs {pricingData.professional_actual_price}</span>
          </p>
          <p className={styles.planDesc}>
            Learn at your own pace with all the resources you need to succeed
            independently.
          </p>
          <button onClick={() => handleEnrollClick('Professional', pricingData.professional_current_price)}>Enroll Now</button>

          <div className={styles.plancontent}>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Recorded session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hand-on internship
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Hands-on Project
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Certification
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Doubt Clearing
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Live Session
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Mentor Guidance
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
                className={styles.featureimg}
              />
              Placement
            </div>
            <div className={styles.features}>
              <Image
                src="/images/greentick.svg"
                alt="tick"
                width={20}
                height={20}
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