// server/controllers/requirementsController.js
import Requirement from "../models/Requirement.js";
import { GoogleGenAI, Type } from "@google/genai";

/**@todo use .env file, currently process.env.GEMINI_API_KEY gives undefined */
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
    || "AIzaSyAsKhl1OwXCte2dS-6ExyNNNht9_vRtwe4", // fallback
});
console.log("gemini key: ", process.env.GEMINI_API_KEY);

export const extractRequirements = async (req, res) => {
  try {
    console.log("📥 Incoming body:", req.body);
    const { description } = req.body;

    if (!description) {
      console.log("❌ No description received");
      return res.status(400).json({ error: "Description is required" });
    }

    const modelName = "gemini-2.5-flash";

const response = await genAI.models.generateContent({
  model: modelName,
  contents: `
Based on this app description:

"${description}"

Extract the following as a single JSON object:
- appName: a short name for the app
- entities: list of main data entities (as strings)
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
          items: { type: Type.STRING },
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
    console.log("Gemini structured JSON:", rawJson);

    let parsed;
    try {
      parsed = typeof rawJson === "string" ? JSON.parse(rawJson) : rawJson;
    } catch (e) {
      console.error("❌ Parsing structured JSON failed:", e);
      return res.status(500).json({ error: "Invalid AI structured response", raw: rawJson });
    }

    console.log("Gemini parsed JSON: ", parsed);

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
        console.warn(`⚠️ Unknown UI type: ${el.type}, replacing with Placeholder`);
        return {
          type: "Placeholder",
          props: { originalType: el.type, ...el.props }
        };
      }
      return el;
    });

    const newReq = new Requirement({
      description,
      appName,
      entities,
      roles,
      features,
      uiElements: sanitizedUiElements
    });

    console.log("💾 Saving requirement:", newReq);

    await newReq.save();

    return res.status(201).json(newReq);
  } catch (err) {
    console.error("❌ Error extracting requirements:", err);
    return res.status(500).json({ error: "extractRequirements Server error" });
  }
};

export const listRequirements = async (req, res) => {
  try {
    const requirements = await Requirement.find();
    res.json(requirements);
  } catch (err) {
    console.error("❌ Error listing requirements:", err);
    res.status(500).json({ error: "listRequirements Server error" });
  }
};
