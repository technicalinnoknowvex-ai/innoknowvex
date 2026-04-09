"use client";
import React, { useEffect, useRef } from "react";
import s from "./styles/aboutUs.module.scss";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Testimonials from "../Landing/Sections/Testimonials/Testimonials";
import Footer from "../Landing/Sections/Footer/Footer";
import StarIcon from "./svgImages/Star";
import SmoothScroller from "@/components/Layouts/SmoothScroller";

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────
const TEAM = [
  {
    name: "Faruk",
    role: "Founder & CEO",
    image:
      "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/CEO.jpeg",
    desc: "Guides the company's vision and strategy, inspiring the team to innovate, grow, and deliver exceptional results.",
  },
  {
    name: "Vamsi Krishna",
    role: "COO (Founder)",
    image:
      "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/COO.jpeg",
    desc: "Shapes brand strategy, leading marketing efforts to connect with audiences and grow the company's reach.",
  },
  {
    name: "Durgesh C.",
    role: "CGO (Co-Founder)",
    image:
      "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/CGO.jpeg",
    desc: "Builds client relationships, drives revenue growth, and ensures the company's solutions meet market needs.",
  },
];

const GALLERY = [
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.03_01c3f1f9.jpg",
    alt: "Certificate 1",
  },
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.02_db791e5f.jpg",
    alt: "Certificate 2",
  },
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.05_02435bf9.jpg",
    alt: "Certificate 3",
  },
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.01_689ad648.jpg",
    alt: "Certificate 4",
  },
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.02_38b68d11.jpg",
    alt: "Certificate 5",
  },
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.03_34a20cfc.jpg",
    alt: "Certificate 6",
  },
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.04_3838ab77.jpg",
    alt: "Certificate 7",
  },
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.05_ce855ce7.jpg",
    alt: "Certificate 8",
  },
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.04_4afbe92a.jpg",
    alt: "Certificate 9",
  },
  {
    src: "https://hfolrvqgjjontjmmaigh.supabase.co/storage/v1/object/public/Innoknowvex%20website%20content/About%20Us%20Images/Page/WhatsApp%20Image%202025-08-31%20at%2018.43.04_c910bfdb.jpg",
    alt: "Certificate 10",
  },
];

// ─── Component ───────────────────────────────────────────
const AboutDetailsPage = () => {
  const heroRef = useRef(null);
  const starLeftRef = useRef(null);
  const starRightRef = useRef(null);
  const vmRef = useRef(null);
  const teamRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        heroRef.current?.querySelectorAll("[data-hero]"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.2,
        }
      );

      // Hero stars
      gsap.fromTo(
        [starLeftRef.current, starRightRef.current],
        { opacity: 0, scale: 0, rotate: -360 },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          duration: 1.2,
          ease: "back.out(1.7)",
          delay: 0.6,
          stagger: 0.2,
        }
      );

      // Vision & Mission cards
      gsap.fromTo(
        vmRef.current?.querySelectorAll("[data-vm]"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: vmRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Team cards
      gsap.fromTo(
        teamRef.current?.querySelectorAll("[data-team]"),
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: teamRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Gallery items
      gsap.fromTo(
        galleryRef.current?.querySelectorAll("[data-gallery]"),
        { y: 40, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: galleryRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <SmoothScroller>
      {/* ── Hero ────────────────────────────────────────── */}
      <section className={s.hero} ref={heroRef}>
        <div className={s.heroGlow} />
        <StarIcon
          ref={starLeftRef}
          className={s.heroStarLeft}
          width={36}
          height={36}
        />
        <StarIcon
          ref={starRightRef}
          className={s.heroStarRight}
          width={28}
          height={28}
        />
        <p className={s.heroLabel} data-hero>
          Who We Are
        </p>
        <h1 className={s.heroTitle} data-hero>
          About Innoknowvex
        </h1>
        <p className={s.heroSubtitle} data-hero>
          Transforming aspirations into achievements through technology-driven
          education and future-ready skills.
        </p>
      </section>

      {/* ── Vision & Mission ────────────────────────────── */}
      <section className={s.visionMission} ref={vmRef}>
        <div className={s.vmCard} data-vm>
          <div className={s.vmAccent} />
          <div className={s.vmIcon}>
            <StarIcon width={24} height={24} />
          </div>
          <h2 className={s.vmTitle}>Our Vision</h2>
          <p className={s.vmSubtitle}>What Drives Us Forward</p>
          <p className={s.vmText}>
            We are committed to delivering the highest-quality education and
            ensuring accessibility for all. Our goal is to equip individuals with
            the skills needed to adapt to the ever-evolving industry landscape,
            empowering them to thrive in a technology-driven world.
          </p>
        </div>

        <div className={s.vmCard} data-vm>
          <div className={s.vmAccent} />
          <div className={s.vmIcon}>
            <StarIcon width={24} height={24} />
          </div>
          <h2 className={s.vmTitle}>Our Mission</h2>
          <p className={s.vmSubtitle}>Guided By Purpose</p>
          <p className={s.vmText}>
            At Innoknowvex, we empower individuals to drive progress through
            technology and future-ready skills. With expert-led assessments,
            learning paths, and courses, our platform helps professionals
            benchmark their expertise and meet industry demands. We are committed
            to bridging the talent gap, connecting individuals with companies, and
            transforming industries through critical tech education.
          </p>
        </div>
      </section>

      {/* ── Team ────────────────────────────────────────── */}
      <section className={s.teamSection}>
        <p className={s.sectionLabel}>The People</p>
        <h2 className={s.sectionTitle}>Meet Our Team</h2>
        <p className={s.sectionSubtitle}>
          Behind every success is a team of remarkable minds working tirelessly
          to bring ideas to life. Passion fuels our journey, and creativity
          shapes every step we take.
        </p>

        <div className={s.teamGrid} ref={teamRef}>
          {TEAM.map((member, i) => (
            <div className={s.teamCard} key={i} data-team>
              <div className={s.teamImageWrapper}>
                <Image
                  className={s.teamImage}
                  src={member.image}
                  alt={member.name}
                  width={400}
                  height={535}
                />
              </div>
              <div className={s.teamInfo}>
                <h3 className={s.teamName}>{member.name}</h3>
                <p className={s.teamRole}>{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gallery ─────────────────────────────────────── */}
      <section className={s.gallerySection}>
        <div style={{ textAlign: "center" }}>
          <p className={s.sectionLabel}>Our Journey</p>
          <h2 className={s.sectionTitle}>Achievements & Moments</h2>
          <p className={s.sectionSubtitle}>
            A glimpse into the milestones and memories that define our path.
          </p>
        </div>

        <div className={s.galleryGrid} ref={galleryRef}>
          {GALLERY.map((img, i) => (
            <div className={s.galleryItem} key={i} data-gallery>
              <Image
                className={s.galleryImage}
                src={img.src}
                alt={img.alt}
                width={600}
                height={400}
              />
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials & Footer ───────────────────────── */}
      <Testimonials />
      <Footer />
    </SmoothScroller>
  );
};

export default AboutDetailsPage;
