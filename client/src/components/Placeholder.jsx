import { useState } from "react";
import PropTypes from "prop-types";

export default function Placeholder({ originalType, availableTypes = [] }) {
  const [selected, setSelected] = useState("");

  const handleReplace = () => {
    if (!selected) return;
    alert(
      `Would replace "${originalType}" with "${selected}". 
      (wire this up to update state in parent)`
    );
  };

  return (
    <div className="border border-yellow-400 bg-yellow-900 text-yellow-200 p-4 rounded-md my-2">
      <p className="font-bold">⚠️ Unknown Component</p>
      <p>
        Gemini suggested: <code>{originalType}</code>, but it isn’t supported.
      </p>

      <div className="mt-3">
        <label className="block text-sm mb-1">Replace with:</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="bg-gray-800 border border-gray-600 text-white p-2 rounded w-full"
        >
          <option value="">-- Select Component --</option>
          {availableTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <button
          onClick={handleReplace}
          disabled={!selected}
          className="mt-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm disabled:opacity-50"
        >
          Replace
        </button>
      </div>
    </div>
  );
}

Placeholder.propTypes = {
  originalType: PropTypes.string.isRequired,
  availableTypes: PropTypes.arrayOf(PropTypes.string),
};
