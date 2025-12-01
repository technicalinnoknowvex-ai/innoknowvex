"use client";
import React from "react";
import style from "./style/cartwindow.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Info, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

const CartWindow = ({
  cartItems,
  onRemove,
  onClose,
  fixedPrice = null,
  packageName = null,
}) => {
  const router = useRouter();

  const calculateTotal = () => {
    if (fixedPrice) return fixedPrice;
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  const handleCheckout = () => {
    router.push("/cart");
  };

  if (cartItems.length === 0) return null;

  return (
    <>
      {/* Overlay */}
      <div className={style.overlay} onClick={onClose}></div>

      {/* Cart Window */}
      <div className={style.cartWindow}>
        {/* Header */}
        <div className={style.cartHeader}>
          <div className={style.headerTitle}>
            <ShoppingBag size={24} />
            <div>
              <h2>{packageName || "Your Pack"}</h2>
              <span className={style.itemCount}>
                {cartItems.length}/4 programs
              </span>
            </div>
          </div>
          <button className={style.closeBtn} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className={style.cartItems}>
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${index}`} className={style.cartItem}>
              <div className={style.itemImage}>
                <Image
                  src={item.image}
                  fill
                  alt={item.course}
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className={style.itemDetails}>
                <h3>{item.course}</h3>
                <p className={style.planType}>
                  <span className={style.planBadge}>{item.plan}</span>
                </p>
                {!fixedPrice && (
                  <p className={style.itemPrice}>
                    ₹{item.price.toLocaleString("en-IN")}
                  </p>
                )}
              </div>

              <div className={style.itemActions}>
                <button
                  className={style.infoBtn}
                  onClick={() => router.push(`/programs/${item.id}`)}
                  title="View Details"
                >
                  <Info size={16} />
                </button>
                <button
                  className={style.removeBtn}
                  onClick={() => onRemove(item.id)}
                  title="Remove"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={style.cartFooter}>
          {fixedPrice ? (
            <div className={style.packagePricing}>
              <div className={style.packageInfo}>
                <span className={style.packageLabel}>Fixed Package Price</span>
                <span className={style.packagePrice}>
                  ₹{fixedPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className={style.savingsNote}>
                <span>🎉 Special bundle pricing</span>
              </div>
            </div>
          ) : (
            <div className={style.totalSection}>
              <span>Total Amount:</span>
              <span className={style.totalAmount}>
                ₹{calculateTotal().toLocaleString("en-IN")}
              </span>
            </div>
          )}

          <button className={style.checkoutBtn} onClick={handleCheckout}>
            Proceed to Checkout
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default CartWindow;
