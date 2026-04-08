"use client";
import React, { useRef, useEffect } from "react";
import styles from "./styles/networkAnimation.module.scss";
import gsap from "gsap";

const NetworkAnimation = React.forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const nodesRef = useRef([]);
  const containerRef = useRef(null);
  const connectionsRef = useRef([]);
  const animatedDotsRef = useRef([]);
  const imagesRef = useRef({});
  const logoRef = useRef(null);

  // Get images and labels from landing data
  const offlinePrograms = [
    { name: "Student 1", image: "/images/image2.jpeg" },
    { name: "Student 2", image: "/images/image4.jpeg" },
    { name: "Student 3", image: "/images/image5.jpeg" },
    { name: "Student 4", image: "/images/image6.jpeg" },
    { name: "Student 5", image: "/images/image8.jpeg" },
    { name: "Student 6", image: "/images/image9.jpeg" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Load all program images
    const loadImages = () => {
      const imagePromises = offlinePrograms.map((program, index) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            imagesRef.current[index] = img;
            resolve();
          };
          img.onerror = () => {
            // Fallback if image fails to load
            resolve();
          };
          img.src = program.image;
        });
      });
      
      // Load logo
      const logoPromise = new Promise((resolve) => {
        const logoImg = new Image();
        logoImg.onload = () => {
          logoRef.current = logoImg;
          resolve();
        };
        logoImg.onerror = () => {
          resolve();
        };
        logoImg.src = "/images/logo.png";
      });
      
      return Promise.all([...imagePromises, logoPromise]);
    };

    // Set canvas size
    const setCanvasSize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    loadImages().then(() => {
      // Node configuration - arranged in a circular pattern
      const nodeCount = 6;
      const nodes = [];
      
      // Calculate circle properties
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.35;
      
      // Place nodes in a circular arrangement
      for (let i = 0; i < nodeCount; i++) {
        const angle = (i / nodeCount) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        
        nodes.push({
          x: x,
          y: y,
          vx: 0,
          vy: 0,
          radius: 48,
          profileId: i,
          label: offlinePrograms[i].name,
        });
      }
      
      // Add a center node for the logo
      nodes.push({
        x: centerX,
        y: centerY,
        vx: 0,
        vy: 0,
        radius: 48,
        profileId: -1,
        isCenter: true,
        label: "Innoknowvex",
      });

      nodesRef.current = nodes;

      // Pre-calculate all connections - connect all nodes to center and neighbors
      const connections = [];
      const connectionDistance = Math.hypot(canvas.width, canvas.height) / 1.5;
      
      nodes.forEach((node, index) => {
        nodes.forEach((otherNode, otherIndex) => {
          if (index < otherIndex) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.hypot(dx, dy);

            // Connect all nodes with sufficient distance
            if (distance < connectionDistance && distance > 10) {
              connections.push({
                start: { x: node.x, y: node.y },
                end: { x: otherNode.x, y: otherNode.y },
                distance: distance,
              });
            }
          }
        });
      });

      connectionsRef.current = connections;

      // Create animated dots for each connection
      const animatedDots = connections.map((connection, index) => ({
        connection: connection,
        progress: (index * 0.1) % 1, // Stagger start times
        speed: 0.0015 + Math.random() * 0.001, // Slower movement
      }));

      animatedDotsRef.current = animatedDots;

      // Animation loop
      const animate = () => {
        // Clear canvas
        ctx.fillStyle = "rgba(248, 241, 222, 0.3)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw static connection lines - clean and simple
        connections.forEach((connection) => {
          ctx.strokeStyle = "rgba(255, 107, 53, 0.3)";
          ctx.lineWidth = 1.5;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(connection.start.x, connection.start.y);
          ctx.lineTo(connection.end.x, connection.end.y);
          ctx.stroke();
        });

        // Update and draw animated dots
        animatedDots.forEach((dot) => {
          dot.progress += dot.speed;
          if (dot.progress > 1) {
            dot.progress = 0;
          }

          const startX = dot.connection.start.x;
          const startY = dot.connection.start.y;
          const endX = dot.connection.end.x;
          const endY = dot.connection.end.y;

          const x = startX + (endX - startX) * dot.progress;
          const y = startY + (endY - startY) * dot.progress;

          // Small animated dot
          ctx.fillStyle = "#ff6b35";
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();

          // Dot shine
          ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
          ctx.beginPath();
          ctx.arc(x - 1, y - 1, 1.5, 0, Math.PI * 2);
          ctx.fill();
        });

       

        // Draw student profile nodes with images
        nodes.forEach((node) => {
          // Outer glow
          const glowGradient = ctx.createRadialGradient(
            node.x,
            node.y,
            0,
            node.x,
            node.y,
            node.radius + 10
          );
          glowGradient.addColorStop(0, `rgba(255, 107, 53, 0.15)`);
          glowGradient.addColorStop(1, `rgba(255, 107, 53, 0)`);
          ctx.fillStyle = glowGradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 10, 0, Math.PI * 2);
          ctx.fill();

          // Avatar background circle - gradient
          const avatarGradient = ctx.createLinearGradient(
            node.x - node.radius,
            node.y - node.radius,
            node.x + node.radius,
            node.y + node.radius
          );
          if (node.isCenter) {
            // Keep center node aligned with website cream palette
            avatarGradient.addColorStop(0, "#f8f1de");
            avatarGradient.addColorStop(1, "#faf6ed");
          } else {
            // Blue-purple gradient for other nodes
            avatarGradient.addColorStop(0, "#667eea");
            avatarGradient.addColorStop(1, "#764ba2");
          }
          ctx.fillStyle = avatarGradient;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.fill();

          // Draw program image if loaded
          const img = imagesRef.current[node.profileId];
          if (img && img.complete && img.naturalHeight !== 0) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(node.x, node.y, node.radius - 2, 0, Math.PI * 2);
            ctx.clip();
            
            // Calculate proper aspect ratio fit
            const imgAspectRatio = img.width / img.height;
            const circleSize = (node.radius - 2) * 2;
            let drawWidth, drawHeight, drawX, drawY;
            
            if (imgAspectRatio > 1) {
              // Image is wider than tall
              drawHeight = circleSize;
              drawWidth = circleSize * imgAspectRatio;
            } else {
              // Image is taller than wide
              drawWidth = circleSize;
              drawHeight = circleSize / imgAspectRatio;
            }
            
            // Center the image in the circle
            drawX = node.x - drawWidth / 2;
            drawY = node.y - drawHeight / 2;
            
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
            ctx.restore();
          } else if (node.isCenter) {
            // Draw center logo
            const logo = logoRef.current;
            if (logo && logo.complete && logo.naturalHeight !== 0) {
              ctx.save();
              ctx.beginPath();
              const logoClipRadius = node.radius - 3;
              ctx.arc(node.x, node.y, logoClipRadius, 0, Math.PI * 2);
              ctx.clip();
              
              // Use contained sizing so the logo stays optically centered.
              const circleSize = logoClipRadius * 1.9;
              const logoAspectRatio = logo.width / logo.height;
              let drawWidth, drawHeight, drawX, drawY;
              
              if (logoAspectRatio > 1) {
                drawWidth = circleSize;
                drawHeight = circleSize / logoAspectRatio;
              } else if (logoAspectRatio < 1) {
                drawWidth = circleSize * logoAspectRatio;
                drawHeight = circleSize;
              } else {
                drawWidth = circleSize;
                drawHeight = circleSize;
              }
              
              drawX = node.x - drawWidth / 2;
              drawY = node.y - drawHeight / 2;
              
              ctx.drawImage(logo, drawX, drawY, drawWidth, drawHeight);
              ctx.restore();
            }
          }

          // White border (thick)
          ctx.strokeStyle = "rgba(255, 255, 255, 1)";
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Subtle shadow
          ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 2, 0, Math.PI * 2);
          ctx.stroke();
        });

        animationFrameId = requestAnimationFrame(animate);
      };

      animate();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <div className={styles.networkWrapper}>
      <div ref={containerRef} className={styles.networkContainer}>
        <canvas ref={canvasRef} className={styles.networkCanvas} />
      </div>
    </div>
  );
});

NetworkAnimation.displayName = "NetworkAnimation";

export default NetworkAnimation;
