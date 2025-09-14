import React from 'react'
import style from "./style/cart.module.scss"
import StarShape from './svg/star'

const CartPage = () => {
    return (
        <div className={style.heading}>
            <StarShape height={50} width={50} className={style.star} />
            <h1>Your Personalised Cart</h1>
        </div>
    )
}

export default CartPage
