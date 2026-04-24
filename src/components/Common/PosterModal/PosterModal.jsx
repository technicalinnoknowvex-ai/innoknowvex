"use client";

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './styles/PosterModal.module.scss';
import posterImage from '@/app/poster.jpeg';

/**
 * PosterModal Component
 * Displays a poster image in a modal with bouncing entrance animation
 * 
 * @param {boolean} isOpen - Controls visibility of the modal
 * @param {function} onClose - Callback function when modal is closed
 */
const PosterModal = ({ isOpen, onClose }) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    // Close only if clicking outside the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={`${styles.modalContent} ${styles.bouncing}`}>
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close poster modal"
          title="Close (ESC)"
        >
          ✕
        </button>
        
        <Link href="/programs/java-dsa" onClick={onClose} className={styles.posterLink}>
          <Image
            src={posterImage}
            alt="Java & Data Structures Poster"
            className={styles.posterImage}
            priority
            quality={90}
          />
        </Link>
      </div>
    </div>
  );
};

export default PosterModal;
