"use client";
import React, { useEffect, useState } from "react";
import style from "./style/packs.module.scss";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Sidebar from "./Sidebar";
import ProgramCards from "./ProgramCards";
import { toast } from "react-toastify";
import { getPrograms } from "@/app/(backend)/api/programs/programs";

gsap.registerPlugin(ScrollTrigger);

const Packs = () => {
  const [programs, setPrograms] = useState([]);
  const [programsPrice, setProgramsPrice] = useState({});
  const [loading, setLoading] = useState(false);
  const [priceLoadingStates, setPriceLoadingStates] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCount, setSelectedCount] = useState(0);

  const fetchProgramsPricesBatch = async (tags) => {
    try {
      // Mark all as loading
      const loadingStates = {};
      tags.forEach(tag => {
        loadingStates[tag] = true;
      });
      setPriceLoadingStates(loadingStates);

      const response = await fetch(`/api/pricingPowerPack/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courses: tags }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const { data } = await response.json();
      setProgramsPrice((prev) => ({ ...prev, ...data }));
    } catch (err) {
      console.error(`Error fetching batch pricing:`, err);
    } finally {
      const loadingStates = {};
      tags.forEach(tag => {
        loadingStates[tag] = false;
      });
      setPriceLoadingStates((prev) => ({ ...prev, ...loadingStates }));
    }
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const fetchedPrograms = await getPrograms();
        setPrograms(fetchedPrograms);
      } catch (error) {
        console.error("Error loading programs:", error);
        toast.error("Failed to load programs", {
          position: "top-right",
          autoClose: 3000,
          theme: "colored",
        });
      }
    };

    fetchPrograms();
  }, []);

  useEffect(() => {
    if (programs.length === 0) return;

    setLoading(true);

    const tags = programs.map((course) => course.price_search_tag);
    fetchProgramsPricesBatch(tags).finally(() => {
      setLoading(false);
    });
  }, [programs]);

  // Load initial count from sessionStorage
  useEffect(() => {
    const items = JSON.parse(sessionStorage.getItem("cartItems")) || [];
    setSelectedCount(items.length);
  }, []);

  return (
    <div className={style.packsContainer}>
      <Sidebar
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className={style.mainContent}>
        <div className={style.stickyHeader}>
          <div className={style.pageHeader}>
            <h1 className={style.pageTitle}>Make Your Own Pack</h1>
            <p className={style.pageSubtitle}>
              Select up to 4 programs to create your custom learning pack
            </p>
          </div>

          <div className={style.selectionCounter}>
            <p>
              Selected: <strong>{selectedCount}</strong> / 4 courses
            </p>
          </div>
        </div>

        <div className={style.cardsScrollContainer}>
          <ProgramCards
            programs={programs}
            programsPrice={programsPrice}
            priceLoadingStates={priceLoadingStates}
            selectedCategory={selectedCategory}
            loading={loading}
            onCountChange={setSelectedCount}
          />
        </div>
      </div>
    </div>
  );
};

export default Packs;
