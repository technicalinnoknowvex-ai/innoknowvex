"use client";
import React from "react";
import style from "./style/cartwindow.module.scss";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Info, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

const CartWindow = ({
  cartItems,
  programsPrice, // ✅ Keep for display purposes only (not used in calculations)
  onRemove,
  onClose,
  fixedPrice = null,
  packageName = null,
}) => {
  const router = useRouter();

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
          {cartItems.map((item, index) => {
            return (
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
                  {/* ✅ SECURE: No price display - calculated at checkout */}
                  {!fixedPrice && (
                    <p className={style.itemPrice}>
                      Price at checkout
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
            );
          })}
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
                Calculated at checkout
              </span>
            </div>
          )}

          <button className={style.checkoutBtn} onClick={handleCheckout}>
            Proceed to Checkout
            <ArrowRight size={20} />
          </button>

          {/* ✅ Security Notice */}
          <p style={{ 
            fontSize: '0.75em', 
            color: '#6b7280', 
            marginTop: '8px', 
            textAlign: 'center' 
          }}>
            🔒 Final price calculated securely on our server
          </p>
        </div>
      </div>
    </>
  );
};

export default CartWindow;