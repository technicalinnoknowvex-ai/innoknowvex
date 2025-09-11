"use client"
import React, { useEffect, useRef } from 'react'
import style from "./style/cart.module.scss"
import gsap from 'gsap'

const CartPage = () => {

    const star = useRef()

    useEffect(()=>{
        gsap.to(star.current,{
            rotate:360,
            duration:5,
            repeat:-1,
            ease:"linear"
        })
    },[])

    return (
        <div className={style.heading}>
            <svg ref={star} width="50" height="50" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M98.4051 17.0205C98.6998 14.3265 102.3 14.3265 102.595 17.0205L105.065 39.6212C108.254 68.8048 129.445 91.8138 156.323 95.2766L177.139 97.9582C179.62 98.2782 179.62 102.187 177.139 102.507L156.323 105.189C129.445 108.652 108.254 131.661 105.065 160.844L102.595 183.445C102.3 186.139 98.6998 186.139 98.4051 183.445L95.9353 160.844C92.7461 131.661 71.5546 108.652 44.6763 105.189L23.8609 102.507C21.3797 102.187 21.3797 98.2782 23.8609 97.9582L44.6763 95.2766C71.5546 91.8138 92.7461 68.8048 95.9353 39.6212L98.4051 17.0205Z" fill="#FF6432" />
            </svg>

            <h1>Your Personalised Cart</h1>
        </div>
    )
}

export default CartPage
