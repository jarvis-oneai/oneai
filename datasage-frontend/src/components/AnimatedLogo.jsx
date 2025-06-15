import React, { useState } from "react";
import "./AnimatedLogo.css";

export default function AnimatedLogo({ style = {}, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <span
      className="logo-flip"
      style={{
        ...style,
        width: 36,
        height: 36,
        display: "inline-block",
        verticalAlign: "middle",
        position: "relative",
        cursor: "pointer"
      }}
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      aria-label="Go to homepage"
    >
      <img
        src="/assets/datasage-logo.svg"
        alt="DataSage Logo"
        className={`logo-img logo-front${hovered ? " hide" : ""}`}
        style={{
          width: 36,
          height: 36,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          transition: "opacity 0.3s, transform 0.4s"
        }}
        draggable={false}
      />
      <img
        src="/assets/datasage-logo-ds.svg"
        alt="DS Logo"
        className={`logo-img logo-back${hovered ? " show" : ""}`}
        style={{
          width: 36,
          height: 36,
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 3,
          transition: "opacity 0.3s, transform 0.4s"
        }}
        draggable={false}
      />
      {/* The span's size ensures the nav stays aligned. */}
    </span>
  );
}
