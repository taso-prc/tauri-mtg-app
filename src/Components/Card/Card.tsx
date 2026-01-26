import React from "react";
import "./Card.css";

interface CardProps {
  title?: string;
  imageUrl?: string;
  foil?: boolean;
}

const Card: React.FC<CardProps> = ({ title = "", imageUrl, foil = false }) => {
  return (
    <div className={`card ${foil ? "card-foil" : ""}`}>
      {imageUrl && (
        <>
          {/* <p style={{ margin: "0 0 12px 0", color: "#e0e0e0", lineHeight: "1.5" }}>
            {title}
          </p> */}
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
  );
};

export default Card;
