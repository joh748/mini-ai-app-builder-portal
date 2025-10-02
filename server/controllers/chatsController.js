import Requirement from "../models/Requirement.js";
import { GoogleGenAI, Type } from "@google/genai";

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export const handleChat = async (req, res) => {
  try {
    console.log("📥 Incoming body (chat):", req.body);
    const { conversationId, message } = req.body;

    if (!conversationId || !message) {
      return res.status(400).json({ error: "conversationId and message are required" });
    }

    // Load the existing requirement by the user's propmpt
    const requirement = await Requirement.findById(conversationId);
    if (!requirement) {
      return res.status(404).json({ error: "Requirement not found" });
    }

    requirement.chatHistory.push({ role: "user", message });

    const context = {
      appName: requirement.appName,
      entities: requirement.entities,
      roles: requirement.roles,
      features: requirement.features,
      uiElements: requirement.uiElements,
    };

    const modelName = "gemini-2.5-flash-lite";

    const response = await genAI.models.generateContent({
      model: modelName,
      contents: `
The current app requirements are:
${JSON.stringify(context, null, 2)}

User says: "${message}"

Update the requirements accordingly. 
Extract the following as a single JSON object:
- appName: a short name for the app
- entities: list of main data entities. 
  Each entity MUST include a non-empty "fields" array with at least 1-3 key fields (each field has {name, type}).
  If the user adds a new entity, infer typical fields for it (e.g. id, name, email for a user; id, title, description for a project).
- roles: list of user roles (as strings)
- features: list of app features (as strings)
- uiElements: a list of UI components with appropriate props

Rules:
1. Always include a "RolesMenu" element with props: { roles: [] }.
2. If a data entry form is needed, always use the type "EntitiesForm" with props: { forEntities: [] }.
3. Other UI elements (e.g., SearchBar, Sidebar, DashboardSummary, DataTableView, ActionButton, HomepageImage, etc.) may be included if relevant to the app.
4. Each uiElement MUST include: { type, props }.

Return ONLY valid JSON, no explanations.
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

    /**
     * Update Requirements and push chat
     */
    requirement.appName = appName;
    requirement.entities = entities;
    requirement.roles = roles;
    requirement.features = features;
    requirement.uiElements = parsed.uiElements;
    requirement.chatHistory.push({
      role: "assistant",
      message: JSON.stringify({
        appName: requirement.appName,
        entities: requirement.entities,
        roles: requirement.roles,
        features: requirement.features,
        uiElements: requirement.uiElements,
      }, null, 2),
    });

    await requirement.save();

    console.log("💾 Updated requirement via chat:", requirement);

    return res.json(requirement.toObject());
  } catch (err) {
    console.error("❌ Error in handleChat:", err);
    return res.status(500).json({ error: "handleChat Server error" });
  }
};
