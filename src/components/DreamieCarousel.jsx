import React, { useEffect, useState } from "react";

// Bubble styles by Dreamie type
const typeStyles = {
  "Personal Assistant": {
    borderColor: "#3F7245",
    background: "linear-gradient(90deg, rgba(255, 254, 252, 0.75) 0%, rgba(255, 254, 252, 0.90) 100%), #3F7245"
  },
  "Head of Sales": {
    borderColor: "#1B365D",
    background: "linear-gradient(90deg, rgba(255,254,252,0.75) 0%, rgba(245,248,255,0.9) 100%), #1B365D"
  },
  "Head of Marketing": {
    borderColor: "#6D3F72",
    background: "linear-gradient(90deg, rgba(255,254,252,0.75) 0%, rgba(251,242,255,0.90) 100%), #6D3F72"
  },
  "Head of Finance": {
    borderColor: "#BF6B2C",
    background: "linear-gradient(90deg, rgba(255,254,252,0.75) 0%, rgba(255,249,241,0.90) 100%), #BF6B2C"
  }
};

function getVisibleCount() {
  const width = window.innerWidth;
  if (width < 500) return 5;
  if (width < 900) return 7;
  if (width < 1300) return 9;
  return 11;
}

function getWidths(count) {
  const preset = [270, 250, 230, 200, 160];
  const arr = [];
  const half = Math.floor(count / 2);
  for (let i = -half; i <= half; i++) {
    arr.push(preset[Math.abs(i)] ?? 160);
  }
  return arr;
}

function getHeight(width) {
  return Math.round(width * 1024 / 685);
}

export default function DreamieShowcase({ images, messages, tickDelay = 5000 }) {
  // SSR-safe: always start with 7
  const [visibleCount, setVisibleCount] = useState(7);
  const [mounted, setMounted] = useState(false);
  const [centerIdx, setCenterIdx] = useState(0);
  const [showCenter, setShowCenter] = useState(true);

  useEffect(() => {
    // Only run in browser
    setVisibleCount(getVisibleCount());
    setMounted(true);
    function handleResize() {
      setVisibleCount(getVisibleCount());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // SENTINELS: fixed set for left/right, never change
  const half = Math.floor(visibleCount / 2);
  const leftSentinels = images.slice(0, half);
  const rightSentinels =
    images.length >= visibleCount
      ? images.slice(images.length - half)
      : Array(half).fill(images[images.length - 1]);
  const rowImages = [...leftSentinels, images[centerIdx], ...rightSentinels];

  // Prevent the center from duplicating the sentinels
  useEffect(() => {
    if (!mounted) return;
    const blocklist = [
      ...leftSentinels,
      ...rightSentinels,
    ].map((src) => images.indexOf(src));
    if (blocklist.includes(centerIdx)) {
      let next = (centerIdx + 1) % images.length;
      let tries = 0;
      while (blocklist.includes(next) && tries < images.length) {
        next = (next + 1) % images.length;
        tries++;
      }
      setCenterIdx(next);
    }
    // eslint-disable-next-line
  }, [centerIdx, images, leftSentinels, rightSentinels, mounted]);

  // Center animation: fade out, swap, fade in
  useEffect(() => {
    if (!mounted) return;
    if (!showCenter) {
      const timeout = setTimeout(() => {
        let next = (centerIdx + 1) % images.length;
        const blocklist = [
          ...leftSentinels,
          ...rightSentinels,
        ].map((src) => images.indexOf(src));
        let tries = 0;
        while (blocklist.includes(next) && tries < images.length) {
          next = (next + 1) % images.length;
          tries++;
        }
        setCenterIdx(next);
        setShowCenter(true);
      }, 350); // fade-out duration
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => setShowCenter(false), tickDelay);
      return () => clearTimeout(timeout);
    }
  }, [showCenter, centerIdx, images, leftSentinels, rightSentinels, tickDelay, mounted]);

  const widths = getWidths(visibleCount);

  if (!mounted) return null; // Only render on client

  return (
    <div className="hero-carousel-main"
      style={{
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        position: "relative",
        minHeight: 180,
        padding: "2rem 0"
      }}
    >
      {rowImages.map((src, i) => {
        const width = widths[i];
        const height = getHeight(width);
        const isCenter = i === half;
        return (
          <div
            key={i}
            style={{
                transform: isCenter ? "scale(1.11)" : "none",
              flex: `0 0 ${width}px`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              position: "relative",
              margin: "0 -24px",
              zIndex: isCenter ? 2 : 1
            }}
          >
            {isCenter ? (
              <img
                src={src}
                alt=""
                width={width}
                height={height}
                style={{
                  borderRadius: 0,
                  objectFit: "cover",
                  opacity: showCenter ? 1 : 0,
                  transition: "opacity 0.25s"
                }}
                draggable={false}
              />
            ) : (
              <img
                src={src}
                alt=""
                width={width}
                height={height}
                style={{
                  borderRadius: 14,
                  objectFit: "cover",
                  opacity: 1,
                  transition: "none"
                }}
                draggable={false}
              />
            )}
            {isCenter && showCenter && (
              <div className="messageBox"
              style={{
                position: "absolute",
                left: "50%",
                bottom: "20%",
                transform: "translateX(-50%)",
                minWidth: 350,
                maxWidth: 440,
                padding: 0,
                borderRadius: 0,
                border: "none",
                background: "none",
                boxShadow: "none",
                color: "#112238",
                fontWeight: 500,
                fontSize: "1rem",
                pointerEvents: "none",
                opacity: showCenter ? 1 : 0,
                transition: "opacity 0.25s",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5em",
                lineHeight: 1.3
              }}
            >
              <span style={{
                display: "inline-block",
                boxSizing: "border-box",
                borderRadius: 24,
                border: `1px solid ${typeStyles[messages[centerIdx]?.type || "Personal Assistant"].borderColor}`,
                background: typeStyles[messages[centerIdx]?.type || "Personal Assistant"].background,
                boxShadow: "0px 8px 16px 0px rgba(6,22,54,0.10), 0px 2px 4px 0px rgba(0,13,38,0.20)",
                fontWeight: 700,
                fontSize: "18px",
                padding: "8px 16px",
                marginBottom: 0
              }}>
                {messages[centerIdx]?.name}'s {messages[centerIdx]?.type}
              </span>
              <span style={{
                display: "inline-block",
                textAlign: "center",
                boxSizing: "border-box",
                borderRadius: 8,
                border: `1px solid ${typeStyles[messages[centerIdx]?.type || "Personal Assistant"].borderColor}`,
                background: typeStyles[messages[centerIdx]?.type || "Personal Assistant"].background,
                boxShadow: "0px 8px 16px 0px rgba(6,22,54,0.10), 0px 2px 4px 0px rgba(0,13,38,0.20)",
                fontWeight: 400,
                fontSize: "22px",
                padding: "8px 16px",
                marginTop: 0
              }}>
                I'm {messages[centerIdx]?.text}
              </span>
            </div>
            
            )}
          </div>
        );
      })}
    </div>
  );
}
