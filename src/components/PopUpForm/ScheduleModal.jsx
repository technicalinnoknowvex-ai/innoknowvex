"use client";
import React, { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import Sparkle from "../Common/Icons/Sparkle";
import styles from "./styles/scheduleModal.module.scss";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { usePopupForm } from "@/context/PopupFormContext";

const ScheduleSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
  selectedDate: z.string().min(1, "Please select a date"),
  selectedTime: z.string().min(1, "Please select a time"),
});

const ScheduleModal = () => {
  const formRef = useRef(null);
  const calendarRef = useRef(null);
  const { isScheduleFormOpen, closeForm } = usePopupForm();
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const sparkleRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(ScheduleSchema),
    defaultValues: {
      name: "",
      phone: "",
      selectedDate: "",
      selectedTime: "",
    },
  });

  // Animation on form open
  useGSAP(() => {
    if (isScheduleFormOpen && formRef.current) {
      gsap.fromTo(
        formRef.current,
        {
          y: -80,
          opacity: 0,
          scale: 0.95,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [isScheduleFormOpen]);

  // Sparkle animation on submit
  useGSAP(() => {
    if (isSubmitting && sparkleRef.current) {
      const sparkles = sparkleRef.current.querySelectorAll(
        `.${styles.sparkleDiv}`
      );

      sparkles.forEach((sparkle, index) => {
        const randomX = gsap.utils.random(-5, 5);
        const randomY = gsap.utils.random(-10, 10);
        const randomDelay = index * 0.2;
        const randomDuration = gsap.utils.random(0.6, 1.2);

        gsap.fromTo(
          sparkle,
          {
            scale: 0.6,
            opacity: 0,
            y: 0,
          },
          {
            scale: 1.4,
            opacity: 1,
            y: randomY,
            x: randomX,
            duration: randomDuration,
            delay: randomDelay,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          }
        );
      });
    }
  }, [isSubmitting]);

  const timeSlots = [
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
    "06:00 PM",
    "07:00 PM",
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handleDateSelect = (day) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setValue("selectedDate", newDate.toISOString().split("T")[0]);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setValue("selectedTime", time);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        date: data.selectedDate,
        time: data.selectedTime,
        timestamp: new Date().toISOString(),
      };

      const response = await fetch("/api/schedule-meeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to schedule meeting");
      }

      const result = await response.json();
      
      // Show success alert
      alert(`✅ Call Scheduled!\nYou will get a call at ${data.selectedTime} on ${new Date(data.selectedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`);
      
      // Reset form after successful submission
      reset();
      setSelectedDate(null);
      setSelectedTime("");
      setShowCalendar(false);
      
      // Close after delay
      setTimeout(() => {
        closeForm();
      }, 1000);
    } catch (error) {
      console.error("Schedule submission error:", error);
      alert("❌ Failed to schedule meeting. Please try again.");
    }
  };

  if (!isScheduleFormOpen) return null;

  // Calendar days
  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <div className={styles.scheduleOverlay} onClick={closeForm}>
      <div
        className={styles.scheduleModal}
        onClick={(e) => e.stopPropagation()}
        ref={formRef}
      >
        <button
          className={styles.closeBtn}
          onClick={closeForm}
          type="button"
        >
          <Icon icon="mdi:close" width={24} height={24} />
        </button>

        <div className={styles.modalContent}>
          <h2 className={styles.title}>Schedule Your Meeting</h2>
          <p className={styles.subtitle}>
            Book a call with our expert to discuss your program
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            {/* Name Field */}
            <div className={styles.formGroup}>
              <label htmlFor="name">Your Name</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register("name")}
                className={errors.name ? styles.inputError : ""}
              />
              {errors.name && (
                <span className={styles.errorText}>{errors.name.message}</span>
              )}
            </div>

            {/* Phone Field */}
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="10-digit phone number"
                {...register("phone")}
                className={errors.phone ? styles.inputError : ""}
              />
              {errors.phone && (
                <span className={styles.errorText}>{errors.phone.message}</span>
              )}
            </div>

            {/* Schedule Section */}
            <div className={styles.scheduleSection}>
              {/* Date Picker */}
              <div className={styles.dateTimeWrapper}>
                <div className={styles.datePickerContainer}>
                  <label>Select Date</label>
                  <button
                    type="button"
                    className={styles.dateButton}
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <Icon icon="mdi:calendar" width={20} height={20} />
                    <span className={styles.dateButtonText}>
                      {selectedDate
                        ? selectedDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "Pick a date"}
                    </span>
                  </button>

                  {showCalendar && (
                    <div className={styles.calendarInline} ref={calendarRef}>
                      <div className={styles.calendarHeader}>
                        <button
                          type="button"
                          onClick={handlePrevMonth}
                          className={styles.navBtn}
                        >
                          <Icon
                            icon="mdi:chevron-left"
                            width={20}
                            height={20}
                          />
                        </button>
                        <h3>
                          {monthNames[currentMonth.getMonth()]}{" "}
                          {currentMonth.getFullYear()}
                        </h3>
                        <button
                          type="button"
                          onClick={handleNextMonth}
                          className={styles.navBtn}
                        >
                          <Icon
                            icon="mdi:chevron-right"
                            width={20}
                            height={20}
                          />
                        </button>
                      </div>

                      <div className={styles.weekDays}>
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (day) => (
                            <div key={day} className={styles.weekDay}>
                              {day}
                            </div>
                          )
                        )}
                      </div>

                      <div className={styles.calendarDays}>
                        {days.map((day, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className={`${styles.calendarDay} ${
                              day === null ? styles.emptyDay : ""
                            } ${
                              selectedDate?.getDate() === day
                                ? styles.selectedDay
                                : ""
                            }`}
                            onClick={() => day && handleDateSelect(day)}
                            disabled={day === null}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {errors.selectedDate && (
                    <span className={styles.errorText}>
                      {errors.selectedDate.message}
                    </span>
                  )}
                </div>

                {/* Time Picker */}
                <div className={styles.timePickerContainer}>
                  <label>Select Time</label>
                  <div className={styles.timeSlots}>
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        className={`${styles.timeSlot} ${
                          selectedTime === time ? styles.selectedTime : ""
                        }`}
                        onClick={() => handleTimeSelect(time)}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                  {errors.selectedTime && (
                    <span className={styles.errorText}>
                      {errors.selectedTime.message}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              <div ref={sparkleRef} className={styles.sparkleContainer}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Sparkle
                    key={i}
                    className={styles.sparkleDiv}
                    width={8}
                    height={8}
                  />
                ))}
              </div>
              {isSubmitting ? "Scheduling..." : "Schedule Meeting"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
