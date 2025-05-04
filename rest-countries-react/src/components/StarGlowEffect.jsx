import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext"; // Import the theme context

const StarGlowEffect = () => {
  const canvasRef = useRef(null);
  const { theme } = useTheme(); // Get the current theme
  const isDarkMode = theme === "dark";

  // For debugging
  console.log("StarGlowEffect rendering with theme:", theme);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    // Set canvas to full window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Star particles configuration
    const particleCount = 1000;
    const particles = [];

    // Colors that match the site's theme
    // Different color palettes for dark and light mode
    const darkModeColors = [
      "rgba(0, 184, 148, 0.8)", // Teal/primary color
      "rgba(52, 172, 224, 0.7)", // Blue variation
      "rgba(69, 170, 242, 0.6)", // Lighter blue
      "rgba(75, 123, 236, 0.7)", // Purple-blue
      "rgba(165, 94, 234, 0.5)", // Purple
    ];

    const lightModeColors = [
      "rgba(0, 184, 148, 0.5)", // Teal/primary color (more transparent)
      "rgba(52, 172, 224, 0.4)", // Blue variation (more transparent)
      "rgba(69, 170, 242, 0.3)", // Lighter blue (more transparent)
      "rgba(75, 123, 236, 0.4)", // Purple-blue (more transparent)
      "rgba(165, 94, 234, 0.3)", // Purple (more transparent)
    ];

    const colors = isDarkMode ? darkModeColors : lightModeColors;

    // Function to ensure color format is valid
    const parseColor = (color) => {
      const colorParts = color.match(
        /rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
      );
      if (colorParts) {
        const r = parseInt(colorParts[1], 10);
        const g = parseInt(colorParts[2], 10);
        const b = parseInt(colorParts[3], 10);
        const a = colorParts[4] ? parseFloat(colorParts[4]) : 1;
        return { r, g, b, a };
      }
      return { r: 0, g: 184, b: 148, a: isDarkMode ? 0.8 : 0.4 }; // Default with mode-specific transparency
    };

    // Mouse position with dampening for smooth movement
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    // Track mouse movement
    const handleMouseMove = (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Create star particles
    for (let i = 0; i < particleCount; i++) {
      const colorString = colors[Math.floor(Math.random() * colors.length)];
      const parsedColor = parseColor(colorString);

      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (isDarkMode ? 2 : 1.5) + 0.5, // Smaller particles for light mode
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: parsedColor,
        colorString: colorString,
        brightness: Math.random() * 0.5 + 0.5,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseDirection: Math.random() > 0.5 ? 1 : -1,
        distanceFromMouse: 0,
      });
    }

    // Animation loop
    const animate = () => {
      // Apply dampening for smooth mouse following
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Clear canvas with fully transparent background
      // Don't use a tinted background as it can accumulate and affect the page background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Optional: add an extremely subtle overlay that won't accumulate
      ctx.fillStyle = isDarkMode
        ? "rgba(9, 14, 26, 0.002)" // Almost transparent dark tint
        : "rgba(240, 248, 255, 0.002)"; // Almost transparent light tint
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      particles.forEach((p) => {
        // Calculate distance from mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        p.distanceFromMouse = Math.sqrt(dx * dx + dy * dy);

        // Mouse influence - gentle attraction to cursor
        // Reduced influence in light mode
        if (p.distanceFromMouse < 300) {
          const angle = Math.atan2(dy, dx);
          const force =
            (300 - p.distanceFromMouse) * 0.0005 * (isDarkMode ? 1 : 0.7);
          p.speedX -= Math.cos(angle) * force;
          p.speedY -= Math.sin(angle) * force;
        }

        // Update position with boundaries
        p.x += p.speedX;
        p.y += p.speedY;

        // Apply friction to gradually slow particles
        p.speedX *= 0.98;
        p.speedY *= 0.98;

        // Bounce off edges with damping
        if (p.x < 0 || p.x > canvas.width) {
          p.speedX *= -0.7;
          p.x = p.x < 0 ? 0 : canvas.width;
        }

        if (p.y < 0 || p.y > canvas.height) {
          p.speedY *= -0.7;
          p.y = p.y < 0 ? 0 : canvas.height;
        }

        // Pulse brightness for twinkling effect
        p.brightness += p.pulseSpeed * p.pulseDirection;
        if (p.brightness > 1 || p.brightness < 0.5) {
          p.pulseDirection *= -1;
        }

        // Draw star with glow - reduced glow size in light mode
        const glowDistance = isDarkMode ? 200 : 150;
        const glowIntensity = isDarkMode ? 15 : 10;

        const glow =
          p.distanceFromMouse < glowDistance
            ? Math.min(glowIntensity, (glowDistance - p.distanceFromMouse) / 10)
            : 0;

        // Main star point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.brightness, 0, Math.PI * 2);

        // Use the pre-parsed color with the current brightness
        const { r, g, b } = p.color;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${
          p.brightness * (isDarkMode ? 1 : 0.7)
        })`;
        ctx.fill();

        // Glow effect - subtle in light mode
        if (glow > 0) {
          // Create glow with gradient
          const gradient = ctx.createRadialGradient(
            p.x,
            p.y,
            p.size,
            p.x,
            p.y,
            p.size + glow
          );

          // Use the pre-parsed color
          const { r, g, b } = p.color;

          // Add color stops with proper rgba format - more transparency in light mode
          const glowOpacity = isDarkMode ? p.brightness : p.brightness * 0.6;
          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${glowOpacity})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size + glow, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [theme, isDarkMode]); // Re-run when theme changes

  // Adjust opacity based on theme
  const canvasOpacity = theme === "dark" ? 1 : 0.7;

  return (
    <canvas
      ref={canvasRef}
      className="star-glow-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: canvasOpacity, // Lower opacity in light mode
        mixBlendMode: isDarkMode ? "screen" : "multiply", // Better blending with background
        transition: "opacity 0.5s ease", // Smooth transition when theme changes
      }}
    />
  );
};

export default StarGlowEffect;
