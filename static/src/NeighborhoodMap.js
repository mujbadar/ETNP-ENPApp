import React from "react";

const NeighborhoodMap = ({ className = "", ...props }) => {
  return (
    <div
      className={`neighborhood-map-container ${className}`}
      {...props}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "650px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        border: "2px solid #2B3990",
      }}
    >
      {/* Map Image */}
      <img
        src="/west-inwood-map.png"
        alt="West Inwood Neighborhood Map"
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          maxHeight: "450px",
          backgroundColor: "#f0f0f0",
        }}
        onError={(e) => {
          // Fallback if image doesn't exist yet
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />

      {/* Placeholder when image is not available */}
      <div
        style={{
          display: "none",
          width: "100%",
          height: "400px",
          backgroundColor: "#f0f0f0",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          color: "#666",
          fontSize: "16px",
          textAlign: "center",
          padding: "20px",
        }}
      >
        <div style={{ marginBottom: "10px", fontSize: "48px" }}>🗺️</div>
        <div style={{ fontWeight: "500", marginBottom: "8px" }}>
          Map image not found
        </div>
        <div style={{ fontSize: "14px", opacity: "0.8" }}>
          Add image as: /public/west-inwood-map.png
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodMap;
