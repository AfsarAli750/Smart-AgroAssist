import "./Form.css";
const Form = ({ handleSubmit, formData, setFormData, loading, id }) => {
  const inputRanges = {
    N: { min: 0, max: 140, placeholder: "Nitrogen (0-140 kg/ha)" },
    P: { min: 5, max: 145, placeholder: "Phosphorus (5-145 kg/ha)" },
    K: { min: 5, max: 205, placeholder: "Potassium (5-205 kg/ha)" },
    temperature: { min: 0, max: 50, placeholder: "Temperature (0-50°C)" },
    humidity: { min: 0, max: 100, placeholder: "Humidity (0-100%)" },
    ph: { min: 0, max: 14, placeholder: "pH (0-14)" },
    rainfall: { min: 0, max: 300, placeholder: "Rainfall (0-300 mm)" },
  };

  // ✅ Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Wrapped validation inside onSubmit
  const onSubmit = (e) => {
    e.preventDefault();

    for (const [key, value] of Object.entries(formData)) {
      const range = inputRanges[key];
      if (value && (value < range.min || value > range.max)) {
        alert(
          `${key.toUpperCase()} should be between ${range.min} and ${range.max}`
        );
        return;
      }
    }

    // Call parent’s submit handler
    handleSubmit(e);
  };

  return (
    <form id={id} onSubmit={onSubmit}>
      {Object.keys(formData).map((key) => (
        <div key={key} className="input-group">
          <input
            name={key}
            type="number"
            step={
              ["temperature", "humidity", "ph", "rainfall"].includes(key)
                ? "0.01"
                : "1"
            }
            value={formData[key]}
            onChange={handleChange}
            placeholder={inputRanges[key].placeholder}
            min={inputRanges[key].min}
            max={inputRanges[key].max}
            required
          />
        </div>
      ))}
      <button type="submit" disabled={loading}>
        {loading ? "🌱 Predicting..." : "🌾 Predict Crop"}
      </button>
    </form>
  );
};

export default Form;
