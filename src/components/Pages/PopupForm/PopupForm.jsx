'use client';

import { useState, useEffect } from 'react';
import styles from './styles/popup.module.scss';

const PopupForm = ({ delaySeconds = 6 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    program: '',
    timestamp: '' // This will be set automatically
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show popup after specified delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [delaySeconds]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.program) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Add current timestamp to form data
      const dataWithTimestamp = {
        ...formData,
        timestamp: new Date().toISOString()
      };
      
      // Send data to API route
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithTimestamp),
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to submit form');
      }
      
      // Show success message
      alert('Thank you! Your information has been saved.');
      
      // Close popup
      setIsVisible(false);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        program: '',
        timestamp: ''
      });
      
    } catch (error) {
      console.error('Error saving data:', error);
      alert(error.message || 'There was an error saving your information. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close popup
  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <button 
          className={styles.closeButton}
          onClick={handleClose}
          type="button"
        >
          ×
        </button>
        
        <div className={styles.header}>
          <h2>Get Program Information</h2>
          <p>Fill out the form below and we'll get back to you!</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="program">Program of Interest *</label>
            <input
              type="text"
              id="program"
              name="program"
              value={formData.program}
              onChange={handleInputChange}
              placeholder="Enter your program of interest"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PopupForm;