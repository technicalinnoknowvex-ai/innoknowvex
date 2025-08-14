
"use client"

import React, { useEffect, useRef } from 'react'
import styles from "./strip.module.scss"
import gsap from 'gsap'

const Strip = () => {


    useEffect(() => {

        const heading = document.querySelectorAll(`.${styles.heading}`)
        const star = document.querySelectorAll(`.${styles.heading} img`)

        window.addEventListener("wheel", (dets) => {
            if (dets.deltaY > 0) {
                gsap.to(heading, {
                    transform: "translateX(-400%)",
                    duration: 4,
                    repeat: -1,
                    ease: "none"
                })

                gsap.to(star, {
                    rotate: 180,
                    duration: 0.8
                })
            }
            else {
                gsap.to(heading, {
                    transform: "translateX(0%)",
                    duration: 4,
                    repeat: -1,
                    ease: "none"
                })

                gsap.to(star, {
                    rotate: 0,
                    duration: 0.8
                })
            }
        })
    }, [])

    return (
        <>
            <div className={styles.strip1}>
            </div>

            <div className={styles.strip2}>
                <div className={styles.content}>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                    <div className={styles.heading}>
                        <h1>WEB DESIGN</h1>
                        <img src="./images/SoftStar.svg" alt="" />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Strip
