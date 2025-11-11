// src/Components/CropResult.jsx
import React from "react";
import CropList from ".././assets/Crop_list.json"
import "./CropResult.css";
import "../App.css"; // Optional if you want to use same styling

const CropResult = ({ result, id }) => {
  if (!Array.isArray(result) || result.length === 0) return null;

  const cropImage = CropList.find(
    (crop) => crop.crop.toLowerCase() === result[0].toLowerCase()
  )?.img;

  return (
    <div id="result" class={id}>
      {result.map((item, index) => (
        <h2 key={index}>
          ✅ Recommended Crop:{" "}
          {item.charAt(0).toUpperCase() + item.slice(1).toLowerCase()}
        </h2>
      ))}
      {cropImage && <img src={cropImage} alt={result[0]} />}
    </div>
  );
};

export default CropResult;
