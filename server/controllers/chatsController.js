import Requirement from "../models/Requirement.js";
import { GoogleGenAI, Type } from "@google/genai";

/**@todo use .env file, currently process.env.GEMINI_API_KEY gives undefined */
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
    || "AIzaSyAsKhl1OwXCte2dS-6ExyNNNht9_vRtwe4", // fallback
});
console.log("gemini key: ", process.env.GEMINI_API_KEY);

export const handleChat = async (req, res) => {
  try {
    console.log("📥 Incoming body (chat):", req.body);
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({ error: "conversationId and message are required" });
    }

    // Load the existing requirement
    const requirement = await Requirement.findById(conversationId);
    if (!requirement) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    requirement.chatHistory.push({ role: "user", message });

    const modelName = "gemini-2.5-flash-lite";

    const response = await genAI.models.generateContent({
      model: modelName,
      contents: `
The current app requirements are:
${JSON.stringify(requirement, null, 2)}

User says: "${message}"

Update the requirements accordingly. 
Return JSON in this format:
{
  "appName": string,
  "entities": [ { "name": string, "fields": [ { "name": string, "type": string } ] } ],
  "roles": string[],
  "features": string[],
  "uiElements": [ { "type": string, "props": object } ]
}
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            appName: { type: Type.STRING },
            entities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
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
                required: ["name", "fields"],
              },
            },
            roles: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            features: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            uiElements: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  props: { type: Type.MAP },
                },
                required: ["type", "props"],
              },
            },
          },
          required: ["appName", "entities", "roles", "features", "uiElements"],
        },
      },
    });

    const rawJson = response.text;
    console.log("Gemini structured JSON (chat):", rawJson);

    let parsed;
    try {
      parsed = typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;
    } catch (e) {
      console.error("❌ Parsing structured JSON failed (chat):", e);
      return res.status(500).json({ error: "Invalid AI structured response", raw: rawJson });
    }

    console.log("Gemini parsed JSON (chat):", parsed);

    const { appName, entities, roles, features, uiElements } = parsed;
    if (
      !appName ||
      !Array.isArray(entities) ||
      !Array.isArray(roles) ||
      !Array.isArray(features) ||
      !Array.isArray(uiElements)
    ) {
      return res.status(500).json({ error: "AI output missing required fields", raw: parsed });
    }

    const VALID_UI_TYPES = new Set([
      "RolesMenu",
      "EntitiesForm",
      "Sidebar",
      "SearchBar",
      "DashboardSummary",
      "DataTableView",
      "ActionButton",
      "HomepageImage",
    ]);

    const sanitizedUiElements = parsed.uiElements.map(el => {
      if (!VALID_UI_TYPES.has(el.type)) {
        console.warn(`⚠️ Unknown UI type (chat): ${el.type}, replacing with Placeholder`);
        return {
          type: "Placeholder",
          props: { originalType: el.type, ...el.props },
        };
      }
      return el;
    });

    // update the requirement
    requirement.appName = appName;
    requirement.entities = entities;
    requirement.roles = roles;
    requirement.features = features;
    requirement.uiElements = sanitizedUiElements;
    requirement.chatHistory.push({ role: "assistant", message: JSON.stringify(parsed, null, 2) });

    await requirement.save();

    console.log("💾 Updated requirement via chat:", requirement);

    return res.json(requirement);
  } catch (err) {
    console.error("❌ Error in handleChat:", err);
    return res.status(500).json({ error: "handleChat Server error" });
  }
};
