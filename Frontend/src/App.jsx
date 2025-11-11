import { useState } from "react";
import Form from "./Components/Form";
import Ai from "./Components/Ai";
import CropResult from "./Components/CropResult"; // ✅ new import
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "https://backendforcropprediction.onrender.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult([]);

    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResult(data.prediction || []);
    } catch (err) {
      console.log(err);
      setResult(["⚠️ Error connecting to backend"]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="main-container">
      <h1>🌱 Smart AgroAssist</h1>

      <div id={result.length === 0 ? "empty" : "nonEmpty"}>
        <Form
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          loading={loading}
          id={result.length === 0 ? "emptyForm" : "nonEmptyForm"}
        />

        <CropResult
          result={result}
          id={result.length === 0 ? "resultEmpty" : "resultNotEmpty"}
        />
      </div>

      <div id="ai-wrapper">
        <Ai />
      </div>
    </div>
  );
}

export default App;
