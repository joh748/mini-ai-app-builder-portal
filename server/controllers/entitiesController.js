// server/controllers/entitiesController.js
import { GoogleGenAI, Type } from "@google/genai";

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY 
    || "AIzaSyAsKhl1OwXCte2dS-6ExyNNNht9_vRtwe4",
});

export const getEntityFields = async (req, res) => {
    try {
        const { entity } = req.body;
        if (!entity) {
            return res.status(400).json({ error: "Entity name is required" });
        }

        const modelName = "gemini-2.5-flash-lite";

        const response = await genAI.models.generateContent({
            model: modelName,
            contents: `Suggest typical input fields for the entity "${entity}". 
                 Return ONLY JSON with the format:
                 {
                   "entity": "${entity}",
                   "fields": [
                     { "name": "string", "type": "string|number|email|date" }
                   ]
                 }`,

            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        entity: { type: Type.STRING },
                        fields: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    type: { type: Type.STRING },
                                },
                                required: ["name", "type"],
                            },
                        },
                    },
                    required: ["entity", "fields"],
                },
            },
        });

        const rawJson = response.text;
        console.log(`Gemini fields for ${entity}:`, rawJson);

        let parsed;
        try {
            parsed = typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;
        } catch (e) {
            console.error("❌ Failed to parse Gemini response:", e);
            return res.status(500).json({ error: "Invalid AI response", raw: rawJson });
        }

        res.status(200).json(parsed);
    } catch (err) {
        console.error("❌ Error generating entity fields:", err);
        res.status(500).json({ error: "Server error generating entity fields" });
    }
};
