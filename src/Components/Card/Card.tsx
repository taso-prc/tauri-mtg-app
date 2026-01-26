import React, { useRef } from "react";
import "./Card.css";

interface CardProps {
  title?: string;
  imageUrl?: string;
  foil?: boolean;
}

const Card: React.FC<CardProps> = ({ title = "", imageUrl, foil = false }) => {
  const cardRef = useRef<HTMLDivElement>(null);

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
      <div className={`card ${foil ? "card-foil" : ""}`} ref={cardRef}>
        {imageUrl && (
          <>
            <img
              src={imageUrl}
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
