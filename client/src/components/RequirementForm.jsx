import { useState } from "react";
import '../styles/global.css';

export default function RequirementForm() {
    const [description, setDescription] = useState("");
    const [response, setResponse] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse(null);

        try {
            const res = await fetch("http://localhost:5000/api/requirements", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ description }),
            });
            const data = await res.json();
            setResponse(data);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div className="max-w-2xl w-full p-6 rounded-2xl shadow-lg"
            style={{ backgroundColor: `var(--nectar-extra-color-1)` }}>

            <h2 className="text-2xl font-bold mb-4"
                style={{ color: "var(--nectar-accent-color)" }}>
                App Requirement Extractor
            </h2>

            {/* INPUT FORM STARTS */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your app idea..."
                    className="p-3 rounded-lg border focus:outline-none"
                    style={{
                        borderColor: "var(--nectar-accent-color)",
                        backgroundColor: "var(--nectar-extra-color-3)",
                        color: "var(--nectar-extra-color-2)",
                    }}
                    rows={4}
                />

                <button
                    type="submit"
                    className="py-2 px-4 rounded-lg font-semibold"
                    style={{
                        backgroundColor: "var(--nectar-accent-color)",
                        color: "var(--nectar-extra-color-2)",
                    }}
                >
                    Extract Requirements
                </button>
            </form>
            {/* INPUT FORM ENDS */}


            {/* RESPONSE BOX STARTS */}
            {response && (
                <div className="mt-6 p-4 rounded-lg"
                    style={{ backgroundColor: "var(--nectar-extra-color-3)" }}>
                    <h3 className="font-bold mb-2"
                        style={{ color: "var(--nectar-accent-color)" }}>
                        Extracted Requirements
                    </h3>

                    <p><strong>App Name:</strong> {response.appName}</p>

                    <p className="mt-2 font-semibold">Entities:</p>
                    <ul className="list-disc list-inside">
                        {response.entities?.map((entity, i) => (
                            <li key={i}>{entity}</li>
                        ))}
                    </ul>

                    <p className="mt-2 font-semibold">Roles:</p>
                    <ul className="list-disc list-inside">
                        {response.roles?.map((role, i) => (
                            <li key={i}>{role}</li>
                        ))}
                    </ul>

                    <p className="mt-2 font-semibold">Features:</p>
                    <ul className="list-disc list-inside">
                        {response.features?.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                </div>
            )}
            {/* RESPONSE BOX ENDS */}


        </div>
    );
}
