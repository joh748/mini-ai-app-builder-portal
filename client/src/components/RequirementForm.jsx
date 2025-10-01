import { useState } from "react";
import "../styles/global.css";

export default function RequirementForm({ onExtracted }) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description }),
      });
      const data = await res.json();
      console.log("Inside RequirementForm.jsx, data after fetch:", data.entities);
      onExtracted(data);
      setDescription("");
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen p-6 rounded-2xl shadow-lg mb-6
        bg-[var(--dark-blue-primary-color-1)]">

      <h2>
        App Requirement Extractor
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your app idea..."
          className="p-3 focus:outline-none"
          rows={4}
        />

        <button
          type="submit"
          className="py-2 px-4 w-auto rounded-lg font-semibold"
        >
          {loading ? "Extracting..." : "Extract Requirements"}
        </button>
      </form>
    </div>
  );
}
