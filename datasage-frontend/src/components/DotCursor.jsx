import React, { useEffect } from "react";

export default function DotCursor() {
  useEffect(() => {
    const dot = document.createElement("div");
    Object.assign(dot.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "14px",
      height: "14px",
      borderRadius: "50%",
      background: "#0066ff",
      pointerEvents: "none",
      zIndex: 9999,
      opacity: 0.22,
      transition: "transform 0.10s cubic-bezier(.47,1.64,.41,.8)",
      mixBlendMode: "multiply"
    });
    document.body.appendChild(dot);

    function move(e) {
      dot.style.transform = `translate(${e.clientX - 7}px, ${e.clientY - 7}px)`;
    }
    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.removeChild(dot);
    };
  }, []);
  return null;
}
