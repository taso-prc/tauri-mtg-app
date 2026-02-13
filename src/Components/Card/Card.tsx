import React, { useRef, useState, useEffect } from "react";
import "./Card.css";
import { invoke } from "@tauri-apps/api/core";

interface CardProps {
  title?: string;
  imageUrl?: string;
  foil?: boolean;
  enableFoilEffect?: boolean;
}
const Card: React.FC<CardProps> = ({ title = "", imageUrl, foil = false, enableFoilEffect = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [localImagePath, setLocalImagePath] = useState<string>("");

  useEffect(() => {
    if (imageUrl) { 
      invoke<string>("get_cached_image", {
        url: imageUrl
      }).then((dataUrl) => {
        setLocalImagePath(dataUrl);
      }).catch(() => {
        console.error("Failed to get cached image");
      });
    }
  }, [imageUrl]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();

    // Mouse position relative to card's center
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 20;
    const rotateY = ((x - centerX) / centerX) * 20;

    // Note: rotateX is inverted (move mouse down → rotate up)
    cardRef.current.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(75px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      className="card-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`card ${foil && enableFoilEffect ? "card-foil" : ""}`} ref={cardRef}>
          {localImagePath && (
          <>
            <img
              src={localImagePath}
              alt={title}
              style={{
                width: "100%",
                height: "fit-content",
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
