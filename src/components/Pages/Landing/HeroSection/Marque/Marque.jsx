
"use client"

import React, { useEffect, useRef } from 'react'
import styles from "./marque.module.scss"
import gsap from 'gsap'

const marqueContent = [
    "DIGITAL AGENCY",
    "WEB DESIGN", 
    "CYBER SECURITY", 
    "ARTIFICIAL INTELLIGENCE",
    "DATA SCIENCE",
    "BUSINESS ANALYTICS",
    "DIGITAL MARKETING"
]

const Strip = () => {


    useEffect(() => {
    const content = document.querySelector(`.${styles.content}`)
    const stars = document.querySelectorAll(`.${styles.heading} img`)
    let currentAnimation;

    const handleWheel = (dets) => {
        // Kill previous animation to prevent conflicts
        if (currentAnimation) currentAnimation.kill()
        
        if (dets.deltaY > 0) {
            // Scroll down - move left
            currentAnimation = gsap.to(content, {
                x: "-50%",  // Move exactly half width (one complete set)
                duration: 20,
                repeat: -1,
                ease: "none"
            })
            
            gsap.to(stars, {
                rotate: 180,
                duration: 0.8
            })
        }
        else {
            // Scroll up - move right
            currentAnimation = gsap.to(content, {
                x: "50%",
                duration: 20, 
                repeat: -1,
                ease: "none"
            })
            
            gsap.to(stars, {
                rotate: 0,
                duration: 0.8
            })
        }
    }

    window.addEventListener("wheel", handleWheel)
    
    return () => {
        window.removeEventListener("wheel", handleWheel)
        if (currentAnimation) currentAnimation.kill()
    }
}, [])

     return (
        <>
            <div className={styles.strip1}></div>
            
            <div className={styles.strip2}>
                <div className={styles.content}>
                    {marqueContent.map((m, index) => (
                        <div key={`set1-${index}`} className={styles.heading}>
                            <h1>{m}</h1>
                            <img src="./images/SoftStar.svg" alt="" />
                        </div>
                    ))}
                    {marqueContent.map((m, index) => (
                        <div key={`set2-${index}`} className={styles.heading}>
                            <h1>{m}</h1>
                            <img src="./images/SoftStar.svg" alt="" />
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Strip
