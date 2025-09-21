"use client"
import React, { useEffect, useRef, useState } from 'react'
import style from "./style/cart.module.scss"
import gsap from 'gsap'
import { toast } from 'react-toastify'
import Image from 'next/image'
import PopUp from './PaymentPopUp/PopUp'

const CartPage = () => {

    const star = useRef()
    const [storedItems, setStoredItems] = useState([]);
    const [total, setTotal] = useState(0)
    const [coupon, setCoupon] = useState("")
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleDelete = (itemToBeDeleted) => {

        const updatedItems = storedItems.filter((item) => item.course !== itemToBeDeleted.course)
        setStoredItems(updatedItems)

        localStorage.setItem("cartItems", JSON.stringify(updatedItems))
        toast.success('Deleted !', {
            position: "top-right",
            autoClose: 500,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            onClose: () => window.location.reload(),
        });
    }

    const handleEnrollClick = () => {
        if (total == 0) {
            toast.warning('Add something to checkout', {
                position: "top-right",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            return;
        }
        setIsFormOpen(true);
    };

    const closeForm = () => {
        setIsFormOpen(false);
    };

    const applyCoupon = async (coupon, total) => {
        if (!coupon || coupon.trim() === "") {
            toast.warning("Please enter a coupon code", {
                position: "top-right",
                autoClose: 2000,
                theme: "colored",
            });
            return;
        }

        try {
            const response = await fetch("/api/pro-packs/coupon_validation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    couponCode: coupon.trim(), // trim whitespace
                    price: total,              // original price
                    courseId: "pro-packs",     // optional: course ID
                }),
            });

            if (!response.ok) {
                // Handle non-2xx HTTP status
                const errorData = await response.json().catch(() => ({}));
                const message = errorData.message || "Failed to apply coupon";
                toast.error(message, { position: "top-right", autoClose: 3000, theme: "colored" });
                return;
            }

            const data = await response.json();

            if (data.success) {
                // Coupon applied successfully
                setTotal(data.finalPrice); // update total price
                setCoupon("")
                toast.success(`Coupon applied!`, {
                    position: "top-right",
                    autoClose: 3000,
                    theme: "colored",
                });
            } else {
                // API returned success=false
                const message = data.message || "Invalid coupon";
                setCoupon("")
                toast.error(message, { position: "top-right", autoClose: 3000, theme: "colored" });
            }
        } catch (err) {
            console.error("Error applying coupon:", err);
            toast.error("Something went wrong. Please try again later.", {
                position: "top-right",
                autoClose: 3000,
                theme: "colored",
            });
        }
    };


    useEffect(() => {
        const cart = localStorage.getItem("cartItems");

        if (cart) {
            setStoredItems(JSON.parse(cart));
        }
        gsap.timeline()
            .fromTo(
                star.current,
                { opacity: 0, scale: 0 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
            )
            .to(
                star.current,
                { rotate: 720, duration: 1, ease: "power2.inOut" }
            )
            .to(
                star.current,
                { rotate: "+=720", duration: 1, ease: "power2.inOut", delay: 0.1 }
            );
    }, [])

    useEffect(() => {
        const amount = storedItems.reduce((acc, s) => acc + s.price, 0);
        setTotal(amount);

    }, [storedItems]);


    return (
        <>
            <PopUp
                isOpen={isFormOpen}
                onClose={closeForm}
                price={total}
                onEnroll={(amount) => handleEnrollClick("cart checkout", amount)}
            />

            <div className={style.head}>
                <svg ref={star} className={style.star} width="50" height="50" viewBox="0 0 136 148" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M66.0962 1.74792C66.3511 -0.582641 69.4658 -0.582641 69.7207 1.74792L71.8573 21.2992C74.6162 46.5452 92.9484 66.4498 116.2 69.4453L134.207 71.7651C136.354 72.0419 136.354 75.4237 134.207 75.7005L116.2 78.0203C92.9484 81.0159 74.6162 100.92 71.8573 126.166L69.7207 145.717C69.4658 148.048 66.3511 148.048 66.0962 145.717L63.9596 126.166C61.2007 100.92 42.8685 81.0159 19.6167 78.0203L1.60985 75.7005C-0.536616 75.4237 -0.536616 72.0419 1.60985 71.7651L19.6167 69.4453C42.8685 66.4498 61.2007 46.5452 63.9596 21.2992L66.0962 1.74792Z" fill="#9F8310" />
                </svg>

                <h1 className={style.heading}>Your Personalised <span>Cart</span></h1>
            </div>

            {/* {Object.values(storedItems).map((item, index) => (
                <div key={index} className={style.cardBody}>
                    <div className={style.cardDetail}>
                        <div>
                            <Image className={style.cardImage} src={item.image} height={200} width={200} alt="course image" />
                        </div>

                        <div className={style.cardDesc}>
                            <h4 className={style.courseTitle}>{item.course}</h4>
                            <h4 className={style.courseTitle}>{item.plan}</h4>
                            <h5 className={style.coursePrice}>Rs. {item.price}</h5>
                        </div>
                    </div>

                    <div className={style.actionBtn}>
                        <svg onClick={() => handleDelete(item)} className={style.delete} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>

                        <svg className={style.pay} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"><path d="M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" /><path d="m9 11l3 3L22 4" /></g></svg>
                    </div>
                </div>
            ))} */}

            <div className={style.shoppingCartContainer}>

                <div className={style.cartContent}>
                    <div className={style.cartItems}>
                        <div className={style.cartItemsList}>
                            {storedItems.length > 0 ? (
                                <>
                                    {Object.values(storedItems).map((m, index) => (
                                        <React.Fragment key={index}>
                                            <div className={style.item} data-item="n2o">
                                                <div>
                                                    <Image
                                                        className={style.itemImage}
                                                        src={m.image}
                                                        height={100}
                                                        width={100}
                                                        alt="courseimage"
                                                    />
                                                </div>

                                                <div className={style.itemDetails}>
                                                    <div className={style.itemName}>{m.course}</div>
                                                    <div className={style.itemInfo}>{m.plan}</div>
                                                </div>

                                                <div className={style.itemControls}>
                                                    <div className={style.itemPrice}>{m.price}</div>
                                                </div>

                                                <div>
                                                    <svg
                                                        className={style.deleteItem}
                                                        onClick={() => handleDelete(m)}
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="24"
                                                        height="24"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            fill="none"
                                                            stroke="currentColor"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M10 11v6m4-6v6m5-11v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                        />
                                                    </svg>
                                                </div>
                                            </div>


                                        </React.Fragment>
                                    ))}

                                </>
                            ) : (
                                <div className={style.emptyCart}>Nothing in cart yet</div>
                            )}

                        </div>
                    </div>


                    <div className={style.orderSummary}>
                        <h3 className={style.summaryTitle}>Order Summary</h3>



                        {/* <div className={`${style.summaryLine} ${style.summaryLineSubtotal}`}>
                            <span>Subtotal</span>
                            <span className={style.amount} id="subtotal">{subTotal}</span>
                        </div> */}

                        {/* <div className={`${style.summaryLine} ${style.summaryLineDiscount}`}>
                            <span>Discount</span>
                            <span className={style.amount} id="discount">0</span>
                        </div> */}

                        <div className={style.line1}></div>

                        <div className={`${style.summaryLine} ${style.summaryLineTotal}`}>
                            <span>Total</span>
                            <span className={style.amount} id="total">{total}</span>
                        </div>

                        <div className={style.line1}></div>

                        <div className={style.couponSection}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Coupon Code"
                                    id="couponInput"
                                    className={style.couponInput}
                                    value={coupon} // bind value
                                    onChange={(e) => setCoupon(e.target.value)} // update state
                                />

                            </div>
                            <div>
                                <button onClick={() => applyCoupon(coupon, total)} className={style.couponBtn}>Apply</button>
                            </div>
                        </div>
                        <button className={style.checkoutBtn} onClick={() => handleEnrollClick()}>
                            Go to Checkout
                        </button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default CartPage
